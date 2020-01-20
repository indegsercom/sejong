import nanoid from 'nanoid'
import { db, sql } from '../database'

export const upsertStory = async data => {
  const { id, title, excerpt, body } = data

  const result = await db.one(sql`
    insert into story (id, title, excerpt, body) 
    values (${id || nanoid()}, ${title}, ${excerpt}, ${body})
    on conflict (id) do update
      set title = excluded.title,
          excerpt = excluded.excerpt,
          body = excluded.body
    returning *
  `)

  return result
}

export const deleteStory = async ({ id }) => {
  await db.query(sql`
    delete from story
    where id = ${id}
    returning id
  `)

  return { id }
}

export const getStories = () => {}
