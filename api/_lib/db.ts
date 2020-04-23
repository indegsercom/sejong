import {
  createPool,
  TransactionFunctionType,
  DatabaseTransactionConnectionType,
  sql,
} from 'slonik'
import { NowRequest } from '@now/node'
import jsonwebtoken from 'jsonwebtoken'
import { createFieldNameTransformationInterceptor } from 'slonik-interceptor-field-name-transformation'

const db = createPool(process.env.DATABASE_URL, {
  interceptors: [
    createFieldNameTransformationInterceptor({ format: 'CAMEL_CASE' }),
  ],
})

const jwt = async (t: DatabaseTransactionConnectionType, req: NowRequest) => {
  const authHeader = req.headers['authorization']

  if (authHeader) {
    const [prefix, token] = authHeader.split(' ')

    if (prefix === 'Bearer') {
      try {
        const verified = jsonwebtoken.verify(token, process.env.JWT_SECRET)
        return t.query(sql`set local role editor`)
      } catch (err) {
        console.log(err.message, 'JWT')
      }
    }
  }

  return t.query(sql`set local role visitor`)
}

export const transaction = <T>(req: NowRequest) => {
  return (handler: TransactionFunctionType<T>) => {
    return db.transaction(async (t) => {
      await jwt(t, req)
      return handler(t)
    })
  }
}

export default db
