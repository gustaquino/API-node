import { randomUUID } from "crypto";

export default class DatabaseMemory {
  #fotos = new Map();

  list(search) {
    return Array.from(this.#fotos.entries()).map((fotoArray) => {
      const id = fotoArray[0]
      const data =  fotoArray[1]

      return {
        id,
        ...data,
      }
    }).filter(foto => {
      if (search) {
        return foto.title.includes(search)
      }
      return true
    })
  }

  create(foto) {
    const fotoId = randomUUID();

    this.#fotos.set(fotoId, foto);
  }

  update(id, foto) {
    const fotoId = id;

    this.#fotos.set(fotoId, foto);
  }

  delete(id) {
    const fotoId = id;

    this.#fotos.delete(fotoId);
  }
}