import { io } from "socket.io-client";
const SOCKET_SERVER = import.meta.env.VITE_SOCKET_SERVER;
const SOCKET_USERNAME = import.meta.env.VITE_SOCKET_USERNAME;
const SOCKET_PASSWORD = import.meta.env.VITE_SOCKET_PASSWORD;



async function HandeleConnect() {
    socketIO = io(SOCKET_SERVER, {
        transports: ['websocket'], // Use WebSocket to avoid polling
        forceNew: true, // Ensures a new connection is created
        reconnection: true,
        /* extraHeaders:{
            socketUsername: SOCKET_USERNAME,
            socketPassword: SOCKET_PASSWORD
        }, */
        auth: {
            userName: SOCKET_USERNAME,
            password: SOCKET_PASSWORD
        }
    });
    socketIO.on('connect', () => {
        log.debug(`Connecting to socketio..`);
        // Now it's safe to use socketIO.id
        socketIO.emit('connection', {
            socketID: socketIO.id,
            userID: publicUser?.userID
        });
        setConnected(true);
    });
    // listen for disconnection //
    socketIO.on('disconnect', (reason) => {
        log.warn({'Disconnected from server': reason});
    });
    return socketIO
}