/* Replace with your SQL commands */
create table book (
  id uuid default uuid_generate_v1mc() primary key,
  title text not null,
  cover text,
  excerpt text,
  authors text[] not null,
  published_year integer not null,
  created_at timestamptz default now(),
  modified_at timestamptz default now()
);

create trigger set_modified_at
before update on book
for each row
execute procedure set_modified_at();
