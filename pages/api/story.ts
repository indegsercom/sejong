import handler from '../../src/handler'
import { createError } from '../../src/errors'
import { createStory, getStories } from '../../src/services/story'
import { validator } from '../../src/validator'

const responder = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const stories = await getStories()
      res.json({ data: { stories } })
    }
    case 'POST': {
      res.statusCode = 201
      const story = await createStory(req.body)
      res.json({ data: { story } })
      break
    }
    default: {
      throw new createError.MethodNotAllowed()
    }
  }
}

export default handler()(
  validator({
    POST: joi =>
      joi.object({
        title: joi.string().required(),
        excerpt: joi.string().required(),
        body: joi.string().required(),
      }),
  }),
  responder
)
