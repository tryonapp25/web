import { io } from "socket.io-client";
import axios from "axios";
const SOCKET_SERVER = import.meta.env.VITE_SOCKET_SERVER;
const ORDER_SERVER = import.meta.env.VITE_ORDER_SERVER;

const publicCode = new URLSearchParams(window.location.search).get("public");

export async function getGuestToken(publicCode) {
    try {
        const res = await axios.get(
          `${ORDER_SERVER}/gen-guest-token/${publicCode}`
        );
        if(res.data?.success){
            sessionStorage.setItem("token", res.data.token);
        }
    } catch (err) {
        console.error("Failed to get guest token:", err);
        throw err;
    }
}

export async function HandeleConnect(publicCode) {
    await getGuestToken(publicCode);
    const socketIO = io(SOCKET_SERVER, {
        transports: ['websocket'], // Use WebSocket to avoid polling
        forceNew: true, // Ensures a new connection is created
        reconnection: true,
        auth: {token: sessionStorage.getItem("token")},
    });

    socketIO.on('connect', () => {
        console.log(`Connected to socketio server with ID: ${socketIO.id}`);
    });
    socketIO.on('connect_error', (err) => {
        console.error('Socket connect_error', err);
    });
    // listen for disconnection //
    socketIO.on('disconnect', (reason) => {
        console.log({'Disconnected from server': reason});
    });
    return socketIO
}



export async function sendOrder(socketRef, data) {
    try {
        if (!socketRef.current) {
            socketRef.current = await HandeleConnect(publicCode);
        }
        if (!socketRef.current) {
            return { success: false, error: "Socket not available" };
        }
        const result = await new Promise((resolve) => {
            socketRef.current.emit("new_order", data, (response) => {
                console.log("Server response:", response);
                if (response?.success)
                    resolve({ success: true });
                else
                    resolve({
                        success: false,
                        error: response?.error || "Unknown error"
                });
            });
        });
        return result;
    }
    catch (err) {
        return { success: false, error: err.message };
    }

}