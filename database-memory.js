import { randomUUID } from "crypto"

export class DatabaseMemory {
  #fotos = new Map()

  list() {
    this.#fotos.values()
  } 

  create(foto) {
    const fotoId = randomUUID

    this.#fotos.set(fotoId, foto)
  } 
  update(id, foto) {
    this.#fotos.set(id, foto)
  }
  delete(id) {
    this.#fotos.set(id, foto)
  }
}