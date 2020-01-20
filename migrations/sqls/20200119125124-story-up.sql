/* Replace with your SQL commands */
create table story (
  id text primary key,
  title text not null,
  excerpt text not null,
  body text,
  created_at timestamptz default now(),
  modified_at timestamptz default now ()
);

CREATE OR REPLACE FUNCTION set_modified_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_modified_at
BEFORE UPDATE ON story
FOR EACH ROW
EXECUTE PROCEDURE set_modified_at();