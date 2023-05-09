import sqlite3

conn = sqlite3.connect("nfts.sqlite")
cursor = conn.cursor()

sql_query = """ CREATE TABLE nfts (
  id integer DEFAULT 0,
  tid integer DEFAULT 0,
  name text NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  hacker integer DEFAULT 0,
  artist integer DEFAULT 0,
  hustler integer DEFAULT 0,
  success integer DEFAULT 0,
  artwork blob NOT NULL,
  sale boolean DEFAULT FALSE
)"""

cursor.execute(sql_query)