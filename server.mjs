import { fastify } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import databaseMemory from './database-memory.mjs';

const DatabaseMemory = databaseMemory;

class MyDatabaseMemory extends DatabaseMemory {
  constructor() {
    super()
  }
}

const server = fastify();

server.register(fastifyPlugin((instance, opts, done) => {
  instance.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
    try {
      const parsedBody = JSON.parse(body);
      done(null, parsedBody);
    } catch (err) {
      err.statusCode = 400;
      done(err, undefined);
    }
  });

  done();
}));

const database = new MyDatabaseMemory();

server.post('/fotos', {
  schema: {
    body: {
      type: 'object',
      required: ['title', 'description', 'size'],
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        size: { type: 'number' },
      },
    },
  },
}, async (request, reply) => {
  try {
    const { title, description, size } = request.body;
    console.log('Raw Request Body:', request.body.toString());
    const foto = {
      title,
      description,
      size,
    };

    database.create(foto);

    return reply.status(201).send();
  } catch (error) {
    reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid JSON data in the request body.',
    });
  }
});

server.get('/fotos', () => {
  const fotos = database.list()
  return fotos
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
