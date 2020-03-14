import { apolloServerConfig, createApolloServer } from 'handler'
import { gql } from 'apollo-server-micro'
import { chosehTypeDefs } from 'graphql/typeDefs'
import chosehService from 'services/chosehService'

export const config = apolloServerConfig

const typeDefs = gql`
  ${chosehTypeDefs}

  type Query {
    hello: String
  }

  input Write {
    id: ID!
    content: String!
  }

  type Mutation {
    write(input: Write!): Choseh
  }
`

const resolvers = {
  Query: {
    hello: () => 'string',
  },
  Mutation: {
    write: async (_, { input }) => {
      const res = await chosehService.write(input)
      return { eTag: res.ETag.replace(/"/g, '') }
    },
  },
}

export default createApolloServer('/api/choseh', {
  typeDefs,
  resolvers,
})
