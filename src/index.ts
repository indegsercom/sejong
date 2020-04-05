require('dotenv').config()

import micro from 'micro'
import Cors from 'micro-cors'
import { ApolloServer } from 'apollo-server-micro'
import historyService from './services/history'
import bookService from './services/book'
import jwt from 'jsonwebtoken'
import chosehService from './services/choseh'

const cors = Cors({
  allowMethods: ['POST', 'GET', 'OPTIONS'],
})

const server = new ApolloServer({
  typeDefs: [
    chosehService.typeDefs,
    historyService.typeDefs,
    bookService.typeDefs,
  ],
  resolvers: [
    chosehService.resolvers,
    historyService.resolvers,
    bookService.resolvers,
  ],
  playground: true,
  context: ({ req }) => {
    const token = req.headers.authorization

    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET)
      return {
        isAdmin: result.role === 'admin',
      }
    } catch (err) {
      if (!process.env.JWT_SECRET) {
        console.warn('JWT empty')
      }
    }
  },
  introspection: true,
})

const PORT = process.env.PORT || 3000

const handler = server.createHandler()

micro(
  cors((req, res) => {
    if (req.method === 'OPTIONS') {
      res.statusCode = 200
      res.end()
    } else {
      handler(req, res)
    }
  })
).listen(PORT, () => console.log(`Micro on port: ${PORT}`))
