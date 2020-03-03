import { ApolloServer, gql } from 'apollo-server-micro'
import Cors from 'micro-cors'
import { db, sql } from 'database'
import movieService from 'services/movieService'

const typeDefs = gql`
  type Query {
    getMovies: [Movie]
  }

  type Mutation {
    createMovie(movie: CreateMovieInput): Movie
  }

  input CreateMovieInput {
    title: String
    cover: String
    directors: [String]
    actors: [String]
    publishedYear: Int
  }

  type Movie {
    id: ID
    title: String
    cover: String
    trailerUrl: String
    citation: String
    createdAt: Int
    modifiedAt: Int
  }
`

const resolvers = {
  Query: {
    getMovies: (_parent, _args, _context) => {
      return db.many(sql`
        select * from movie;
      `)
    },
  },
  Mutation: {
    createMovie: (_parent, { movie }) => {
      return movieService.createMovie(movie)
    },
  },
  Movie: {
    citation: parent => {
      const { actors, directors, publishedYear } = parent
      return `${[...directors, ...actors].join(', ')} (${publishedYear})`
    },
  },
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return {}
  },
})

const handler = apolloServer.createHandler({ path: '/api/movie' })

export const config = {
  api: {
    bodyParser: false,
  },
}

const cors = Cors({
  allowMethods: ['POST', 'OPTIONS'],
})

export default cors(handler)
