/* Replace with your SQL commands */
create extension if not exists "uuid-ossp";

create table history (
  id uuid default uuid_generate_v1mc() primary key,
  link text unique not null,
  title text not null,
  cover text,
  excerpt text,
  comment text,
  created_at timestamptz default now(),
  modified_at timestamptz default now()
);

create trigger set_modified_at
before update on history
for each row
execute procedure set_modified_at();