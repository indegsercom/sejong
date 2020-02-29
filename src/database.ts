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

interface IHistory {
  table: 'history'
  link: string
  title: string
  excerpt: string
  cover: string
}

interface IBook {
  table: 'book'
  title: string
  cover: string
  excerpt: string
  markdown_url: string
  authors: string[]
  published_year: number
}

type TableType = IBook | IHistory

const camelToSnakeCase = str =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)

export const insert = ({ table, ...data }: TableType) => {
  const keys = Object.keys(data).filter(k => data[k] !== undefined)

  const columns = sql.join(
    keys.map(k => sql.identifier([camelToSnakeCase(k)])),
    sql`,`
  )

  const values = sql.join(
    keys.map(k => {
      const value = data[k]
      if (Array.isArray(value)) {
        return sql.array(value, 'text')
      }

      return data[k]
    }),
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
