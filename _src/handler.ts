import Cors from 'micro-cors'
import jwt from 'jsonwebtoken'
import { Config, ApolloServer } from 'apollo-server-micro'
import { NextApiResponse } from 'next'

export const apolloServerConfig = {
  api: {
    bodyParser: false,
  },
}

const cors = Cors({
  allowMethods: ['POST', 'GET', 'OPTIONS'],
})

export const createApolloServer = (path: string, config: Config) => {
  const apolloServer = new ApolloServer({
    playground: true,
    introspection: true,
    context: ({ req }) => {
      const token = req.headers.authorization

      try {
        const result: any = jwt.verify(token, process.env.JWT_SECRET)
        return {
          isAdmin: result.role === 'admin',
        }
      } catch (err) {
        if (!process.env.JWT_SECRET) {
          console.warn('JWT empty')
        }
      }
    },
    ...config,
  })

  const apolloHandler = apolloServer.createHandler({
    path,
  })

  const handler = (req, res: NextApiResponse) => {
    res.setHeader('cache-control', 's-maxage=1, stale-while-revalidate')
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    if (req.url === '/') {
      return res.status(200).end()
    }

    return apolloHandler(req, res)
  }

  return cors(handler)
}
