import { apolloServerConfig, createApolloServer } from 'handler'
import { gql } from 'apollo-server-micro'
import { chosehTypeDefs } from 'graphql/typeDefs'
import chosehService from 'services/chosehService'
import combine from 'graphql/resolvers/combine'
import isAuthenticated from 'graphql/resolvers/isAuthenticated'

export const config = apolloServerConfig

const typeDefs = gql`
  ${chosehTypeDefs}

  type Query {
    hello: String!
  }

  input Write {
    id: ID!
    content: String!
  }

  type Mutation {
    write(input: Write!): Boolean
  }
`

const resolvers = {
  Query: {
    hello: () => 'World!',
  },
  Mutation: {
    write: combine(isAuthenticated, async (_, { input }) => {
      return chosehService.write(input)
    }),
  },
}

// TODO. turn off on production build.
export default createApolloServer('/api/choseh', {
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
})
