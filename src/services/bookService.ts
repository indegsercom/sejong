import { insert, db, sql } from '../database'
import parisApi from '../apis/parisApi'

const createBook = async data => {
  let { cover } = data

  if (cover) {
    cover = await parisApi.resize(cover, { height: 480 })
  }

  return insert({
    table: 'book',
    ...data,
    cover,
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
