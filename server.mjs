import fastify from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import 'dotenv/config';
import DatabasePostgres from './database-postgres.mjs';

// Parse JSON bodies
const jsonBodyParser = new fastifyPlugin((instance, opts, done) => {
  instance.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
    try {
      done(null, JSON.parse(body));
    } catch (err) {
      err.statusCode = 400;
      done(err, undefined);
    }
  });

  done();
});

// Handle errors
const errorHandler = new fastifyPlugin((instance, opts, done) => {
  instance.setErrorHandler((error, request, reply) => {
    reply.status(error.statusCode || 500).send({
      statusCode: error.statusCode || 500,
      error: error.name || 'Internal Server Error',
      message: error.message || 'An error occurred on the server.',
    });
  });

  done();
});

const database = new DatabasePostgres();

// Create, list, update, and delete fotos
class FotoService {
  constructor(database) {
    this.database = database;
  }

  async create(foto) {
    await this.database.create(foto);
  }

  async list(search) {
    return await this.database.list(search);
  }

  async update(fotoId, foto) {
    await this.database.update(fotoId, foto);
  }

  async delete(fotoId) {
    await this.database.delete(fotoId);
  }
}

const server = fastify();

// Register the JSON body parser plugin
server.register(jsonBodyParser);

// Register the error handler plugin
server.register(errorHandler);

// Create a FotoService
const fotoService = new FotoService(database);

// Register routes for creating, listing, updating, and deleting fotos
server.post('/fotos', async (request, reply) => {
  const foto = request.body;

  await fotoService.create(foto);

  reply.status(201).send();
});

server.get('/fotos', async (request) => {
  const search = request.query.search;

  const fotos = await fotoService.list(search);

  return fotos;
});

server.put('/fotos/:id', async (request, reply) => {
  const fotoId = request.params.id;
  const foto = request.body;

  await fotoService.update(fotoId, foto);

  reply.status(204).send();
});

server.delete('/fotos/:id', async (request, reply) => {
  const fotoId = request.params.id;

  await fotoService.delete(fotoId);

  reply.status(204).send();
});

async function start() {
  try {
    await server.listen({
      host: '0.0.0.0',
      port: process.env.PORT ?? 3333,
    });
    console.log('Server is running on port 3333');
  } catch (err) {
    console.error('Error starting the server:', err);
    process.exit(1);
  }
}

start();