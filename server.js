    import { createServer } from 'node:http'

    const server = createServer(() => {
      console.log('server created')
    })

    server.listen(3333)