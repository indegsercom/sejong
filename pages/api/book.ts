import bookService from 'services/bookService'
import { createApolloServer, apolloServerConfig } from 'handler'
import { gql, ValidationError } from 'apollo-server-micro'
import { nodeTypeDefs, chosehTypeDefs } from 'graphql/typeDefs'
import { BookTable } from 'db/tableTypes'
import chosehService from 'services/chosehService'

const typeDefs = gql`
  type Query {
    getBook(id: ID!): Book
    getBooks: [Book]
  }

  type Book {
    ${nodeTypeDefs}
    title: String
    cover: String
    citation: String
  }

  input CreateBookInput {
    title: String!
    cover: String
    authors: [String!]!
    publishedYear: Int!
  }

  type Mutation {
    createBook(book: CreateBookInput): Book
  }
`

const resolvers = {
  Query: {
    getBook: (_, { id }) => bookService.findById(id),
    getBooks: () => bookService.getAll(),
  },
  Mutation: {
    createBook: (_, { book }: { book: BookTable }) => {
      if (book.authors.length === 0) {
        throw new ValidationError('`book.authors` should not be empty array')
      }
      return bookService.create({
        table: 'book',
        ...book,
      })
    },
  },
  Book: {
    citation: (book: BookTable) => {
      if (book.authors.length === 0) return `(${book.publishedYear})`
      return `${book.authors.join(', ')} (${book.publishedYear})`
    },
  },
}

export const config = apolloServerConfig

export default createApolloServer('/api/book', {
  typeDefs,
  resolvers,
})
