import io from 'socket.io-client';
import feathers from '@feathersjs/client';

const API_URL = 'https://api.coding.garden';

const socket = io(API_URL);
const app = feathers();

app.configure(feathers.socketio(socket));

export default app;
