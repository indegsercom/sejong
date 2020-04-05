require('dotenv').config()

import micro from 'micro'
import { ApolloServer } from 'apollo-server-micro'
import historyService from './services/history'
import bookService from './services/book'

const server = new ApolloServer({
  typeDefs: [historyService.typeDefs, bookService.typeDefs],
  resolvers: [historyService.resolvers, bookService.resolvers],
  playground: true,
  // introspection: true,
})

const PORT = process.env.PORT || 3000

micro(server.createHandler()).listen(PORT, () =>
  console.log(`Micro on port: ${PORT}`)
)
