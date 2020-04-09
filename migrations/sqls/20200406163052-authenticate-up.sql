/* Replace with your SQL commands */
create schema _private;
create extension if not exists "pgcrypto";

create type jwt_token as (
  role text,
  exp bigint
);

create table _private.account (
  email            text not null unique check (email ~* '^.+@.+\..+$'),
  password_hash    text not null
);

create function _private.register(
  email text,
  password text
) returns boolean as $$
begin
  insert into _private.account (email, password_hash) values (email, crypt(password, gen_salt('bf')));

  return true;
end;
$$ language plpgsql strict security definer;

create function authenticate(
  email text,
  password text
) returns jwt_token as $$
declare
  account _private.account;
begin
  select a.* into account
  from _private.account as a
  where a.email = $1;

  if account.password_hash = crypt(password, account.password_hash) then
    return ('editor',extract(epoch from (now() + interval '2 days')))::jwt_token;
  else
    return null;
  end if;
end;
$$ language plpgsql strict security definer;
