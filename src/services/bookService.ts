import { insert, db, sql } from '../database'

const createBook = data => {
  return insert({
    table: 'book',
    ...data,
  })
}

const getAllBooks = async () => {
  let books = []
  try {
    books = await db.many(sql`select * from book order by modified_at DESC`)
  } catch (err) {}

  return books
}

const updateBook = () => {}

const removeBook = () => {}

const bookService = {
  getAll: getAllBooks,
  create: createBook,
  update: updateBook,
  remove: removeBook,
}

export default bookService
