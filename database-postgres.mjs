import { randomUUID } from "crypto";
import { sql } from './db.mjs'

export default class DatabasePostgres {

  async list(search) {
    let fotos
   
    if (search) {
      fotos = await sql`select * from fotos where title ilike ${'&' +search + '&'}`
    } else {
      fotos = await sql`select * from fotos`
    }
  }

  async create(foto) {
    const fotoId = randomUUID()

    const { title, description, size } = foto

    await sql`insert into fotos (id, title, description, size) VALUES (${fotoId},  ${title}, ${description}, ${size})`
  }

  update(id, foto) {

  }

  delete(id) {

  }
}