import bookService from 'services/bookService'
import { createApolloServer } from 'handler'
import { gql } from 'apollo-server-micro'
import { nodeTypeDefs } from 'graphql/typeDefs'
import { BookTable } from 'db/tableTypes'

const typeDefs = gql`
  type Query {
    getBooks: [Book]
  }

  type Book {
    ${nodeTypeDefs}
    title: String
    cover: String
    citation: String
  }

  input CreateBookInput {
    title: String
    cover: String
    authors: [String]
    publishedYear: Int
  }

  type Mutation {
    createBook(book: CreateBook): Book
  }
`

const resolvers = {
  Query: {
    getBooks: () => bookService.getAll(),
  },
  Mutation: {
    createBook: (_, { book }: { book: BookTable }) => {
      return bookService.create({
        table: 'book',
        ...book,
      })
    },
  },
  Book: {
    citation: (book: BookTable) => {
      return `${book.authors.join(', ')} (${book.publishedYear})}`
    },
  },
}

export default createApolloServer('api/book', {
  typeDefs,
  resolvers,
})
