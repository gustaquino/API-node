import { sql } from './db.mjs'

sql`
CREATE TABLE fotos (
  title        TEXT,
  description  TEXT,
  size         INTEGER
);
`.then(() => {
  console.log('Tabela criada')
})