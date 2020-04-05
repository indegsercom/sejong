import { gql } from 'apollo-server-micro'
import { findAll, deleteById, insertOne } from '../db/queryHelper'
import combine from '../graphql/helpers/combine'
import isAuthenticated from '../graphql/helpers/isAuthenticated'
import crawlOpenGraph from './history/crawlOpenGraph'
import resizeCover from './history/resizeCover'
import { nodeTypeDefs } from '../graphql/typeDefs'

const typeDefs = gql`
  type Query {
    getHistories: [History]
  }

  input CreateHistoryInput {
    link: String!
    comment: String
  }

  type Mutation {
    createHistory(input: CreateHistoryInput): History
    deleteHistory(id: ID!): Boolean
  }

  type History {
    title: String!
    excerpt: String!
    link: String!
    cover: String
    comment: String
    ${nodeTypeDefs}
  }
`

const resolvers = {
  Query: {
    getHistories: () => findAll('history'),
  },
  Mutation: {
    createHistory: combine(isAuthenticated, async (_, { input }) => {
      const { ogImage, ogDescription, ogTitle } = await crawlOpenGraph(
        input.link
      )
      const cover = await resizeCover(ogImage.url, input.link)
      const payload = {
        cover,
        title: ogTitle,
        excerpt: ogDescription,
        ...input,
      }

      return insertOne('history', payload)
    }),
    deleteHistory: combine(isAuthenticated, (_, { id }) =>
      deleteById('history', id)
    ),
  },
}

const historyService = {
  typeDefs,
  resolvers,
}

export default historyService
