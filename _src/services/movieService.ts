import { db, insert } from 'database'

const createMovie = movie => {
  return insert({
    table: 'movie',
    ...movie,
  })
}

const movieService = {
  createMovie,
}

export default movieService
