/* Replace with your SQL commands */

CREATE INDEX history_published_at_index ON history(modified_at DESC NULLS LAST);
CREATE INDEX book_published_at_index ON book(modified_at DESC NULLS LAST);