import { insert, db, sql } from '../database'
import parisApi from '../apis/parisApi'

const createBook = async data => {
  let { cover } = data

  if (cover) {
    cover = await parisApi.resize(cover, { height: 480 })
  }

  const book = await insert({
    table: 'book',
    ...data,
    cover,
  })

  return book
}

const getAllBooks = async () => {
  console.time('getBook')
  let books = []
  try {
    books = await db.many(sql`select * from book order by modified_at DESC`)
  } catch (err) {
    console.log(err.message, 'ERR')
  }

  console.timeEnd('getBook')

  return books
}

const updateBook = () => {}

const removeBook = () => {}

const findById = (id: string) => {
  return db.one(sql`select * from book where id = ${id}`)
}

const bookService = {
  findById,
  getAll: getAllBooks,
  create: createBook,
  update: updateBook,
  remove: removeBook,
}

export default bookService
