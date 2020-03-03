/* Replace with your SQL commands */
create table movie (
  id uuid default uuid_generate_v1mc() primary key,
  title text not null,
  cover text,
  trailer_url text,
  directors text[] not null,
  actors text[] not null,
  published_year integer not null,
  created_at timestamptz default now(),
  modified_at timestamptz default now()
);

create trigger set_modified_at
before update on movie
for each row
execute procedure set_modified_at();