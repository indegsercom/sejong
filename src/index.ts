require('dotenv').config()

import express from 'express'
import cors from 'cors'
import { postgraphile, PostGraphileOptions } from 'postgraphile'
import createHistoryPlugin from './plugins/createHistoryPlugin'

const app = express()
// app.options('*', cors(), (req, res) => {
//   console.log('hello?')
//   res.status(200).send()
// })

const production = process.env.NODE_ENV === 'production'

const { PORT = 3000, JWT_SECRET } = process.env

const postgraphileOptions: Partial<PostGraphileOptions> = production
  ? {
      subscriptions: true,
      retryOnInitFail: true,
      dynamicJson: true,
      setofFunctionsContainNulls: false,
      ignoreRBAC: false,
      ignoreIndexes: false,
      extendedErrors: ['errcode'],
      graphiql: false,
      enableQueryBatching: true,
      disableQueryLog: true, // our default logging has performance issues, but do make sure you have a logging system in place!
      legacyRelations: 'omit',
    }
  : {
      subscriptions: true,
      watchPg: true,
      dynamicJson: true,
      setofFunctionsContainNulls: false,
      ignoreRBAC: false,
      ignoreIndexes: false,
      showErrorStack: 'json',
      extendedErrors: ['hint', 'detail', 'errcode'],
      exportGqlSchemaPath: 'schema.graphql',
      graphiql: true,
      enhanceGraphiql: true,
      enableQueryBatching: true,
      legacyRelations: 'omit',
    }

app
  .use(
    postgraphile(process.env.DATABASE_URL, 'public', {
      ...postgraphileOptions,
      enableCors: true,
      pgDefaultRole: 'visitor',
      jwtPgTypeIdentifier: 'public.jwt_token',
      jwtSecret: JWT_SECRET,
      appendPlugins: [
        require('@graphile-contrib/pg-simplify-inflector'),
        createHistoryPlugin,
      ],
    })
  )
  .listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
  })
