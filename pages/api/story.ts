import { apolloServerConfig, createApolloServer } from 'handler'
import { nodeTypeDefs, chosehTypeDefs } from 'graphql/typeDefs'
import chosehService from 'services/chosehService'
import { db, sql } from 'database'

export const config = apolloServerConfig

const resolvers = {
  Query: {
    story: (_, { id }) => {
      return db.one(sql`
        select * from story where id = ${id}
      `)
    },
    stories: () => {
      return db.many(sql`
        select * from story
      `)
    },
  },
  Mutation: {
    createStory: () => {},
    updateStory: () => {},
    deleteStory: () => {},
  },
  Story: {
    choseh: story => {
      return chosehService.get({ id: story.id })
    },
  },
}

const typeDefs = `
  type Query {
    story(id: ID!): Story
    stories: [Story]
  }

  input CreateStory {
    title: String!
    cover: String
  }

  input UpdateStory {
    id: ID!
    title: String
    cover: String
  }

  input DeleteStory {
    id: ID!
  }

  type Mutation {
    createStory(input: CreateStory): Story
    deleteStory(input: DeleteStory): Boolean
    updateStory(input: UpdateStory): Story
  }

  ${chosehTypeDefs}
  type Story {
    ${nodeTypeDefs}
    choseh: Choseh
    title: String!
    cover: String
  }
`

export default createApolloServer('/api/story', {
  resolvers,
  typeDefs,
})
