import { Socket, Server } from 'socket.io';

function socketOnConnection(client: Socket, server: Server) {
  console.info('a user connected'); // eslint-disable-line
  client.on('disconnect', () => {
    console.info('a user disconnected'); // eslint-disable-line
  });
}

export default socketOnConnection;

const a = {
  users: [
    { id: 'kasd8fjkafa', name: 'Mehmet' },
    { id: 'kasasdadfja', name: 'Yasin' },
    { id: 'kasdabblaal', name: 'Osman' },
    { id: 'kaasbd8fkaf', name: 'Sumeyye' },
  ],
  groups: [
    {
      id: '5ad52c141c4',
      name: 'Yasinini Grupbu',
      users: [
        {
          id: 'kaasbd8fkaf',
          role: 'admin',
        },
        {
          id: 'kasdabblaal',
          role: 'member',
        },
      ],
    },
  ],
  messages: [
    {
      groupId: '5ad52c141c4',
      senderId: 'kaasbd8fkaf',
      text: 'Merhaba Bu Ilk Mesaj',
    },
  ],
};
