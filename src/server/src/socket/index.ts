import { Socket } from 'socket.io';

function onConnect(socket: Socket) {
  console.log('Connect a user'); // eslint-disable-line no-console
  socket.on('disconnect', () => {
    console.log('Disconnect a user'); // eslint-disable-line no-console
  });
}

export default onConnect;
