type Node = {
  id: string
  createdAt: string
  modifiedAt: string
}

export type HistoryTable = Node & {
  table: 'history'
  link: string
  title: string
  excerpt: string
  cover: string
}

export type BookTable = Node & {
  table: 'book'
  title: string
  cover: string
  authors: string[]
  publishedYear: number
}

export type MovieTable = Node & {
  table: 'movie'
  title: string
  actors: string[]
  publishers: string[]
  publishedYear: number
  cover: string
  trailerUrl?: string
}

export type TableTypes = HistoryTable | BookTable | MovieTable
