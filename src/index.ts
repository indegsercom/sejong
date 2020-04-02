import micro from 'micro'
import { ApolloServer } from 'apollo-server-micro'
import historyService from './services/history'
import { createPool } from './db/db'

const server = new ApolloServer({
  typeDefs: [historyService.typeDefs],
  resolvers: [historyService.resolvers],
  playground: true,
  // introspection: true,
})

const PORT = process.env.PORT || 3000

createPool(() => {
  micro(server.createHandler()).listen(PORT, () =>
    console.log(`Micro on port: ${PORT}`)
  )
})
