/* Replace with your SQL commands */

alter table story
  alter column id set data type uuid using (uuid_generate_v4()),
  alter column id SET DEFAULT uuid_generate_v1mc(),
  alter column excerpt drop not null,
  add column if not exists cover text,
  drop column if exists body;