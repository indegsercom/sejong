import { HttpError } from 'http-errors'
import { NotFoundError, UniqueIntegrityConstraintViolationError } from 'slonik'
import cors from './cors'

const handler = () => (...mids) => async (req, res) => {
  const middlewares = [cors(), ...mids]
  let middlewareIdx = 0

  const next = () => {
    middlewareIdx++
  }

  try {
    while (middlewareIdx < middlewares.length) {
      let currentIdx = middlewareIdx
      const middleware = middlewares[middlewareIdx]
      await middleware(req, res, next)

      if (currentIdx === middlewareIdx) {
        // next is not called
        break
      }
    }
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.statusCode = 404
    } else if (err instanceof HttpError) {
      res.statusCode = err.statusCode
    } else if (err instanceof UniqueIntegrityConstraintViolationError) {
      res.statusCode = 409
    } else {
      res.statusCode = 400
    }
    res.json({
      data: null,
      error: err.message,
    })
  }
}

export default handler
