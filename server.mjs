import { fastify } from 'fastify'
import pkg from './database-memory.mjs';
const DatabaseMemory = pkg.DatabaseMemory;

const server = fastify()

server.post('/fotos', () => {
  return 'something'
})

server.get('/', (req, res) => {
  res.send('Hello World!');
});

server.put('/fotos/:id', () => {
  return 'something'
})

server.delete('/fotos/:id', () => {
  return 'something'
})


server.listen({
  port: 3333,
})

console.log('Server is running on port 3333');