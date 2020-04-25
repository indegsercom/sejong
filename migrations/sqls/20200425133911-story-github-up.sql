/* Replace with your SQL commands */
alter table story
  add column if not exists github jsonb,
  drop column if exists sha;