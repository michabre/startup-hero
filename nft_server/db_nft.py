import sqlite3

# conn = sqlite3.connect("nfts.sqlite")
conn = sqlite3.connect("db.sqlite")

cursor = conn.cursor();
sql_query = """ CREATE TABLE nfts (
  id integer PRIMARY KEY,
  tid integer NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  hacker integer DEFAULT 0,
  artist integer DEFAULT 0,
  hustler integer DEFAULT 0,
  artwork blob NOT NULL
)"""

cursor.execute(sql_query)