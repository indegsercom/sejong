import Cors from 'micro-cors'
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
    ...config,
  })

  const apolloHandler = apolloServer.createHandler({
    path,
  })

  const handler = (req, res: NextApiResponse) => {
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    return apolloHandler(req, res)
  }

  return cors(handler)
}
