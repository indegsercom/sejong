import { createPool } from 'slonik'
import { createFieldNameTransformationInterceptor } from 'slonik-interceptor-field-name-transformation'

const db = createPool(process.env.DATABASE_URL, {
  interceptors: [
    createFieldNameTransformationInterceptor({ format: 'CAMEL_CASE' }),
  ],
})

export default db
