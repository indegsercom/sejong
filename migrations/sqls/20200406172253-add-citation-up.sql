CREATE EXTENSION if not exists plv8;

CREATE OR REPLACE FUNCTION book_citation(book book) RETURNS
text AS $$
  if (book.authors.length === 0) return `(${book.published_year})`
  return `${book.authors.join(', ')} (${book.published_year})`
$$ LANGUAGE plv8 IMMUTABLE STRICT;