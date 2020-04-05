import { gql } from 'apollo-server-micro'
import combine from '../graphql/helpers/combine'
import isAuthenticated from '../graphql/helpers/isAuthenticated'
import choseh from '../utils/choseh'

const typeDefs = gql`
  input Write {
    id: ID!
    content: String!
  }

  extend type Mutation {
    write(input: Write!): Boolean
  }

  type Choseh {
    edition: Int!
    content: String!
    modifiedAt: Float!
  }
`

const resolvers = {
  Mutation: {
    write: combine(isAuthenticated, (_, { input }) => {
      return choseh.write(input)
    }),
  },
}

const chosehService = {
  typeDefs,
  resolvers,
}

export default chosehService
