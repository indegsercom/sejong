import { gql } from 'apollo-server-micro'

const typeDefs = gql`
  type Query {
    getHistories: [History]
  }

  input CreateHistoryInput {
    link: String!
    comment: String
  }

  # type Mutation {
  #   createHistory(input: CreateHistoryInput): History
  #   deleteHistory(id: ID!): Boolean
  # }

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
    getHistories: () => [],
  },
  // Mutation: {
  // createHistory: combine(isAuthenticated, (_, { input }) =>
  //   historyService.createHistory(input)
  // ),
  // deleteHistory: combine(isAuthenticated, (_, { id }) =>
  //   historyService.deleteHistory(id)
  // ),
  // },
}

const historyService = {
  typeDefs,
  resolvers,
}

export default historyService
