import handler from '../../src/handler'
import { createError } from '../../src/errors'
import { createStory, getStories } from '../../src/services/story'

const responder = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const stories = await getStories()
      return { stories }
    }
    case 'POST': {
      res.statusCode = 201
      const story = await createStory(req.body)
      return { story }
    }
    default: {
      throw new createError.MethodNotAllowed()
    }
  }
}

export default handler()(responder)
