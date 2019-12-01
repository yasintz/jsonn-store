import { Socket, Server } from 'socket.io';

function socketOnConnection(client: Socket, server: Server) {
  console.info('a user connected'); // eslint-disable-line
  client.on('disconnect', () => {
    console.info('a user disconnected'); // eslint-disable-line
  });
}

export default socketOnConnection;
