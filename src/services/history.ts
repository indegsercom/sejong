import { gql } from 'apollo-server-micro'
import { findAll, deleteById } from '../db/queryHelper'
import combine from '../graphql/helpers/combine'
import isAuthenticated from '../graphql/helpers/isAuthenticated'

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
    title: String!
    excerpt: String!
    link: String!
    cover: String
    comment: String
  }
`

const resolvers = {
  Query: {
    getHistories: () => findAll('history'),
  },
  Mutation: {
    createHistory: combine(isAuthenticated, (_, { input }) => null),
    deleteHistory: combine(isAuthenticated, (_, { id }) =>
      deleteById('history', id)
    ),
  },
}

const historyService = {
  typeDefs,
  resolvers,
}

export default historyService
