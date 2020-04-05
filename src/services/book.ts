import { gql } from 'apollo-server-micro'
import { findAll, deleteById, findOne, insertOne } from '../db/queryHelper'
import combine from '../graphql/helpers/combine'
import isAuthenticated from '../graphql/helpers/isAuthenticated'
import { nodeTypeDefs } from '../graphql/typeDefs'
import choseh from '../utils/choseh'
import parisApi from '../utils/parisApi'

const typeDefs = gql`
  extend type Query {
    getBook(id: ID!): Book
    getBooks: [Book]
  }

  input CreateBookInput {
    title: String!
    cover: String
    authors: [String!]!
    publishedYear: Int!
  }

  extend type Mutation {
    createBook(book: CreateBookInput!): Book
    deleteBook(id: ID!): Boolean
  }

  type Book {
    title: String!
    cover: String
    citation: String!
    choseh: Choseh
    ${nodeTypeDefs}
  }
`

const resolvers = {
  Query: {
    getBook: async (_, { id }) => {
      return findOne('book', id)
    },
    getBooks: () => findAll('book'),
  },
  Mutation: {
    createBook: combine(isAuthenticated, async (_, { book: data }) => {
      let { cover } = data

      if (cover) {
        cover = await parisApi.resize(cover, { height: 480 })
      }

      const book = await insertOne('book', {
        ...data,
        cover,
      })

      return book
    }),
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
