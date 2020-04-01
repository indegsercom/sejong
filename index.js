require('dotenv').config()

const express = require('express')
const app = express()
const { createPool, sql } = require('slonik')

const pool = createPool(process.env.DATABASE_URL)
console.log(pool.getPoolState())

app.get('/', async (req, res) => {
  console.time('conn')
  const result = await pool.connect(async conn => {
    console.log(pool.getPoolState())
    console.timeEnd('conn')
    console.time('query')
    return conn.many(sql`select * from book order by modified_at DESC`)
  })
  console.timeEnd('query')
  console.time('json')
  res.json(result)
  console.timeEnd('json')
})

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})
