import { createPool, sql as s } from 'slonik'
import { createFieldNameTransformationInterceptor } from 'slonik-interceptor-field-name-transformation'

export const sql = s

const getConnectionUri = () => {
  return (
    process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/indegsercom'
  )
}

const interceptors = [
  createFieldNameTransformationInterceptor({
    format: 'CAMEL_CASE',
  }),
]

export const db = createPool(getConnectionUri(), {
  captureStackTrace: false,
  interceptors,
})

export const findById = (table, id) => {
  return db.one(sql`
    select * from ${sql.identifier([table])}
    where id = ${id}
  `)
}

export const insert = (table: string, data) => {
  const keys = Object.keys(data)
  const columns = sql.join(
    keys.map(k => sql.identifier([k])),
    sql`,`
  )
  const values = sql.join(
    keys.map(k => data[k]),
    sql`,`
  )

  return db.one(sql`
    insert into ${sql.identifier([table])} (${columns}) 
    values (${values}) returning *
  `)
}

export const update = (table: string, data) => {
  const { id, ...values } = data

  const keys = Object.keys(values)
  const str = sql.join(
    keys.map(k => sql`${sql.identifier([k])} = ${values[k]}`),
    sql`,`
  )

  return db.one(sql`
    update ${sql.identifier([table])}
    set ${str}
    where id = ${id}
    returning *
  `)
}
