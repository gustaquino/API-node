import { fastify } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import DatabaseMemory from './database-memory.mjs';

const server = fastify();

server.register(fastifyPlugin((instance, opts, done) => {
  instance.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
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

const database = new DatabaseMemory();

server.setErrorHandler((error, request, reply) => {
  reply.status(error.statusCode || 500).send({
    statusCode: error.statusCode || 500,
    error: error.name || 'Internal Server Error',
    message: error.message || 'An error occurred on the server.',
  });
});

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
    const foto = {
      title,
      description,
      size,
    };

    await database.create(foto);

    return reply.status(201).send();
  } catch (error) {
    throw error;
  }
});

server.get('/fotos', async () => {
  const fotos = await database.list();
  return fotos;
});

server.put('/fotos/:id', () => {
  return 'something';
});

server.delete('/fotos/:id', () => {
  return 'something';
});

const start = async () => {
  try {
    await server.listen({
      port: 3333
    });
    console.log('Server is running on port 3333');
  } catch (err) {
    console.error('Error starting the server:', err);
    process.exit(1);
  }
};

start();
