import { createPool, sql as s } from 'slonik'

export const sql = s

export const db = createPool(
  process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/polpri',
  {
    captureStackTrace: false,
  }
)
