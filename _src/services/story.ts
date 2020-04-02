// import nanoid from 'nanoid'
// import { db, sql, insert, update, findById } from '../database'

// export const createStory = async body => {
//   const data = { ...body, id: nanoid(7) }
//   return await insert('story', data)
// }

// export const updateStory = async data => {
//   return await update('story', data)
// }

// export const deleteStory = async ({ id }) => {
//   await db.query(sql`
//     delete from story
//     where id = ${id}
//     returning id
//   `)

//   return { id }
// }

// export const getStory = storyId => findById('story', storyId)

// export const getStories = async () => {
//   try {
//     const stories = await db.many(sql`
//       select * from story
//     `)
//     return stories
//   } catch (err) {
//     return []
//   }
// }

const story = {}

export default story
