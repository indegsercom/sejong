import db from './db'
import { sql } from 'slonik'

const camelToSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export const findAll = async (table: string) => {
  let result = []
  try {
    result = await db.many(sql`select * from ${sql.identifier([table])}`)
  } catch (err) {
    console.log(err)
  } finally {
    return result
  }
}

const toTable = (table: string) => {
  return sql.identifier([table])
}

export const insertOne = async (table: string, data: any) => {
  const keys = Object.keys(data).filter((k) => data[k] !== undefined)

  const columns = sql.join(
    keys.map((k) => sql.identifier([camelToSnakeCase(k)])),
    sql`,`
  )

  const values = sql.join(
    keys.map((k) => {
      const value = data[k]
      if (Array.isArray(value)) {
        return sql.array(value, 'text')
      }

      return data[k]
    }),
    sql`,`
  )

  return db.one(sql`
    insert into ${toTable(table)} (${columns}) 
    values (${values}) returning *
  `)
}

export const deleteById = async (table: string, id: string) => {
  return db.one(sql`
    delete from ${toTable(table)}
    where id = ${id}
    returning *;
  `)
}
