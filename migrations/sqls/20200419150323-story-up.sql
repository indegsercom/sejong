drop table story;

create table story (
  id serial primary key,
  slug text unique,
  sha text,
  front_matter jsonb,
  created_at timestamptz default now(),
  modified_at timestamptz default now ()
);

CREATE TRIGGER set_modified_at
BEFORE UPDATE ON story
FOR EACH ROW
EXECUTE PROCEDURE set_modified_at();

grant select on story to visitor, editor;
grant insert, update, delete on story to editor;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO editor;