// import { db, sql } from '../../../src/database'
// import handler from '../../../src/handler'
// import { updateStory, getStory } from '../../../src/services/story'

// const responder = async (req, res) => {
//   const { storyId } = req.query

//   switch (req.method) {
//     case 'DELETE': {
//       const result = await db.one(sql`
//         delete from story where id = ${storyId}
//         returning story.id
//       `)

//       return { storyId }
//     }
//     case 'PUT': {
//       const story = await updateStory({ id: storyId, ...req.body })
//       return { story }
//     }
//     case 'GET': {
//       const story = await getStory(storyId)
//       return { story }
//     }
//   }
// }

// export default handler()(responder)
