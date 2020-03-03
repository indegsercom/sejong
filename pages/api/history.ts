import historyService, {
  createHistory,
  getHistories,
} from '../../src/services/historyService'
import { gql, ApolloServer } from 'apollo-server-micro'
import { nodeTypeDefs } from 'graphql/typeDefs'
import { db, sql } from 'database'
import Cors from 'micro-cors'

const typeDefs = gql`
  type Query {
    getHistories: [History]
  }

  type Mutation {
    createHistory(link: String!): History
    deleteHistory(id: ID!): Boolean
  }

  type History {
    ${nodeTypeDefs}
    title: String!
    excerpt: String!
    link: String!
    cover: String
  }
`

const resolvers = {
  Query: {
    getHistories: () => db.many(sql`select * from history`),
  },
  Mutation: {
    createHistory: (_, { link }) => historyService.createHistory({ link }),
    deleteHistory: (_, { id }) => historyService.removeHistory(id),
  },
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

export const config = {
  api: {
    bodyParser: false,
  },
}

const cors = Cors({
  allowMethods: ['POST', 'OPTIONS'],
})

const handler = apolloServer.createHandler({
  path: '/api/history',
})

export default cors(handler)
