import { gql } from 'apollo-server-micro'
import { findAll, deleteById, findOne } from '../db/queryHelper'
import combine from '../graphql/helpers/combine'
import isAuthenticated from '../graphql/helpers/isAuthenticated'
import { nodeTypeDefs } from '../graphql/typeDefs'
import choseh from '../utils/choseh'

const typeDefs = gql`
  extend type Query {
    getBook: Book
    getBooks: [Book]
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
    citation: String
    comment: String
    choseh: Choseh
    ${nodeTypeDefs}
  }
`

const resolvers = {
  Query: {
    getBook: (_, { id }) => findOne('book', id),
    getBooks: () => findAll('book'),
  },
  Mutation: {
    createBook: combine(isAuthenticated, (_, { input }) => null),
    deleteBook: combine(isAuthenticated, (_, { id }) => deleteById('book', id)),
  },
  Book: {
    choseh: ({ id }) => {
      return choseh.get({ id })
    },
    citation: (book) => {
      if (book.authors.length === 0) return `(${book.publishedYear})`
      return `${book.authors.join(', ')} (${book.publishedYear})`
    },
  },
}

const bookService = {
  typeDefs,
  resolvers,
}

export default bookService
