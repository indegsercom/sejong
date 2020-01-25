import handler from '../../src/handler'
import { createError } from '../../src/errors'
import { createHistory, getHistories } from '../../src/services/historyService'
import { validator } from '../../src/validator'

const responder = async (req, res) => {
  switch (req.method) {
    case 'GET': {
      const histories = await getHistories()
      return res.json({ data: { histories } })
    }
    case 'POST': {
      const history = await createHistory(req.body)
      return res.json({ data: { history } })
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
        link: joi
          .string()
          .uri()
          .required(),
      }),
  }),
  responder
)
