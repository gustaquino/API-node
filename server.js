import { fastify } from 'fastify'
import { DatabaseMemory } from './database-memory.js'

const server = fastify()

server.post('/fotos', () => {
  return 'something'
})

server.get('/fotos', () => {
  return 'something'
})

server.put('/fotos/:id', () => {
  return 'something'
})

server.delete('/fotos/:id', () => {
  return 'something'
})


server.listen({
  port: 3333,
})