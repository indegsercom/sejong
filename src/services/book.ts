import { gql } from 'apollo-server-micro'
import { findAll, deleteById } from '../db/queryHelper'
import combine from '../graphql/helpers/combine'
import isAuthenticated from '../graphql/helpers/isAuthenticated'
import { nodeTypeDefs } from '../graphql/typeDefs'

const typeDefs = gql`
  extend type Query {
    books: [Book]
  }

  input CreateBookInput {
    link: String!
    comment: String
  }

  extend type Mutation {
    createBook(input: CreateBookInput): Book
    deleteBook(id: ID!): Boolean
  }

  type Book {
    title: String!
    excerpt: String!
    link: String!
    cover: String
    comment: String
    ${nodeTypeDefs}
  }
`

const resolvers = {
  Query: {
    books: () => findAll('book'),
  },
  Mutation: {
    createBook: combine(isAuthenticated, (_, { input }) => null),
    deleteBook: combine(isAuthenticated, (_, { id }) => deleteById('book', id)),
  },
}

const bookService = {
  typeDefs,
  resolvers,
}

export default bookService
