require('dotenv').config()

const express = require('express')
const app = express()
const { createPool, sql } = require('slonik')

const pool = createPool(process.env.DATABASE_URL)

app.get('/', async (req, res) => {
  const result = await pool.many(
    sql`select * from book order by modified_at DESC`
  )
  res.json(result)
})

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`)
})
