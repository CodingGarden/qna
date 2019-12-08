import io from 'socket.io-client';
import feathers from '@feathersjs/client';

import API_URL from './API_URL';

const socket = io(API_URL);
const app = feathers();

app.configure(feathers.socketio(socket));
app.configure(feathers.authentication({
  storage: window.localStorage,
}));

export default app;
