import { HttpError } from 'http-errors'
import { NotFoundError, UniqueIntegrityConstraintViolationError } from 'slonik'
import cors from './cors'
import Cors from 'micro-cors'
import { Config, ApolloServer } from 'apollo-server-micro'
import { NextApiResponse } from 'next'

export const apolloServerConfig = {
  api: {
    bodyParser: false,
  },
}

const cors2 = Cors({
  allowMethods: ['POST', 'GET', 'OPTIONS'],
})

export const createApolloServer = (path: string, config: Config) => {
  const apolloServer = new ApolloServer(config)

  const apolloHandler = apolloServer.createHandler({
    path,
  })

  const handler = (req, res: NextApiResponse) => {
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    apolloHandler(req, res)
  }

  return cors2(handler)
}

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
