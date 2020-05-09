/* Replace with your SQL commands */
create schema if not exists _private;
create extension if not exists "pgcrypto";

create table if not exists _private.account (
  email            text not null unique check (email ~* '^.+@.+\..+$'),
  password_hash    text not null
);

create or replace function _private.register(
  email text,
  password text
) returns boolean as $$
begin
  insert into _private.account (email, password_hash) values (email, crypt(password, gen_salt('bf')));

  return true;
end;
$$ language plpgsql strict security definer;

create or replace function authenticate(
  email text,
  password text
) returns boolean as $$
declare
  account _private.account;
begin
  select a.* into account
  from _private.account as a
  where a.email = $1;

  if account.password_hash = crypt(password, account.password_hash) then
    return true;
  else
    return false;
  end if;
end;
$$ language plpgsql strict security definer;
