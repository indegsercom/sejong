import micro from 'micro'
import { ApolloServer, gql } from 'apollo-server-micro'

const typeDefs = gql`
  type Query {
    sayHello: String
  }
`

const resolvers = {
  Query: {
    sayHello() {
      return 'Hello world'
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  // introspection: true,
})

const PORT = process.env.PORT || 3000

micro(server.createHandler()).listen(PORT, () =>
  console.log(`Micro on port: ${PORT}`)
)
