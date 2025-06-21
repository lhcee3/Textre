import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with deployed URL in prod

export default socket;
