import historyService from '../../src/services/historyService'
import { gql } from 'apollo-server-micro'
import { nodeTypeDefs } from 'graphql/typeDefs'
import { createApolloServer, apolloServerConfig } from 'handler'
import isAuthenticated from 'graphql/resolvers/isAuthenticated'
import combine from 'graphql/resolvers/combine'

const typeDefs = gql`
  type Query {
    getHistories: [History]
  }

  input CreateHistoryInput {
    link: String!
    comment: String
  }

  type Mutation {
    createHistory(input: CreateHistoryInput): History
    deleteHistory(id: ID!): Boolean
  }

  type History {
    ${nodeTypeDefs}
    title: String!
    excerpt: String!
    link: String!
    cover: String
    comment: String
  }
`

const resolvers = {
  Query: {
    getHistories: () => historyService.getHistories(),
  },
  Mutation: {
    createHistory: combine(isAuthenticated, (_, { input }) =>
      historyService.createHistory(input)
    ),
    deleteHistory: combine(isAuthenticated, (_, { id }) =>
      historyService.deleteHistory(id)
    ),
  },
}

export const config = apolloServerConfig

export default createApolloServer('/api/history', {
  typeDefs,
  resolvers,
})
