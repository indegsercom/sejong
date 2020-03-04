import historyService from '../../src/services/historyService'
import { gql } from 'apollo-server-micro'
import { nodeTypeDefs } from 'graphql/typeDefs'
import { db, sql } from 'database'
import { createApolloServer, apolloServerConfig } from 'handler'

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

export const config = apolloServerConfig

export default createApolloServer('/api/history', {
  typeDefs,
  resolvers,
})
