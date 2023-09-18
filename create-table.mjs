import { sql } from './db.mjs'

//sql`DROP TABLE IF EXISTS fotos;`.then(() => {
  //console.log('tabela apagada')
//})

 sql`
CREATE TABLE fotos (
  id           TEXT PRIMARY KEY,
  title        TEXT,
  description  TEXT,
  size         INTEGER
);
`.then(() => {
  console.log('Tabela criada')
})