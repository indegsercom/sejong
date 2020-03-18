/* Replace with your SQL commands */
create table choseh (
  id text primary key,
  edition int default 1
);

-- CREATE OR REPLACE FUNCTION auto_edition()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.edition = OLD.edition + 1;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE IF NOT EXISTS TRIGGER auto_edition
-- BEFORE UPDATE ON choseh
-- FOR EACH ROW
-- EXECUTE PROCEDURE auto_edition();