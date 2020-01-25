import { createPool, sql as s } from 'slonik'

export const sql = s

const getConnectionUri = () => {
  const uris = {
    PROD: process.env.PROD_DB,
    STAGE: process.env.STAGE_DB,
  }

  return (
    uris[process.env.MODE] || 'postgres://postgres@localhost:5432/indegsercom'
  )
}

console.log(getConnectionUri(), 'URI')

export const db = createPool(getConnectionUri(), {
  captureStackTrace: false,
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
