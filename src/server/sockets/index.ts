import { Socket, Server } from 'socket.io';

function socketOnConnection(client: Socket, server: Server) {
  console.log('a user connected'); // eslint-disable-line
  client.on('disconnect', () => {
    console.log('a user disconnected'); // eslint-disable-line
  });
}

export default socketOnConnection;
