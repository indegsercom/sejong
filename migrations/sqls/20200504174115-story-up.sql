create table if not exists story (
  id serial primary key,
  slug text unique,
  data jsonb not null,
  git jsonb not null,
  content text not null,
  created_at timestamptz default now(),
  modified_at timestamptz default now()
);

create or replace function set_modified_at()
returns trigger as $$
begin
  new.modified_at = now();
  return new;
end;
$$ language plpgsql;


drop trigger if exists set_story_modified_at on story;
create trigger set_story_modified_at
before update on story
for each row
execute procedure set_modified_at();