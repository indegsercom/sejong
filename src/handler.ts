import nanoid from 'nanoid'
import cors from 'micro-cors'
import { HttpError } from 'http-errors'
import { NotFoundError } from 'slonik'

const handler = () => responder => async (req, res) => {
  const requestId = nanoid(7)
  try {
    const data = await cors()(responder)(req, res)
    res.json({ requestId, data, error: null })
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.statusCode = 404
    } else if (err instanceof HttpError) {
      res.statusCode = err.statusCode
    } else {
      res.statusCode = 400
    }
    res.json({
      requestId,
      data: null,
      error: err.message,
    })
  }
}

export default handler
