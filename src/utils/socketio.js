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
            sessionStorage.setItem("socket_token", res.data.token);
        }
    } catch (err) {
        console.error("Failed to get guest token:", err);
        throw err;
    }
}

export async function getBusinessToken(uid) {
    try {
        const res = await axios.get(
          `${ORDER_SERVER}/gen-business-token/${uid}`
        );
        if(res.data?.success){
            sessionStorage.setItem("socket_token", res.data.token);
        }
    } catch (err) {
        console.error("Failed to get business token:", err);
        throw err;
    }
}

export async function HandeSocketConnect(publicCode) {
    await getGuestToken(publicCode);
    const socketIO = io(SOCKET_SERVER, {
        transports: ["polling", "websocket"],
        forceNew: true,
        reconnection: true,
        auth: { token: sessionStorage.getItem("socket_token") },
    });

    return await new Promise((resolve, reject) => {
        const onConnect = () => {
            socketIO.off('connect_error', onError);
            socketIO.off('disconnect', onDisconnect);
            console.log("connected", socketIO.id);
            resolve(socketIO);
        };

        const onError = (err) => {
            socketIO.off('connect', onConnect);
            console.error('Socket connect_error', err);
            reject(err);
        };

        const onDisconnect = (reason) => {
            // if disconnected before connect resolved, treat as error
            console.log({'Disconnected from server': reason});
        };

        socketIO.once("connect", onConnect);
        socketIO.once('connect_error', onError);
        socketIO.on('disconnect', onDisconnect);
        // safety timeout: reject if not connected in 10s
        setTimeout(() => {
            if (!socketIO.connected) {
                socketIO.off('connect', onConnect);
                socketIO.off('connect_error', onError);
                reject(new Error('Socket connection timeout'));
            }
        }, 10000);
    });
}

export async function HandeleSocketConnectForBusiness(user) {
    try{
        await getBusinessToken(user?.uid);
        const socketIO = io(SOCKET_SERVER, {
            transports: ["polling", "websocket"],
            forceNew: true,
            reconnection: true,
            auth: { token: sessionStorage.getItem("socket_token") },
        });

        return await new Promise((resolve, reject) => {
            const onConnect = () => {
                // request business auth and wait for server callback
                socketIO.emit(
                    "business-connection",
                    { ...user },
                    (res) => {
                        if (!res?.success) {
                            console.error("business connect failed", res);
                            socketIO.disconnect();
                            reject(res || new Error('Business auth failed'));
                            return;
                        }
                        console.log("business connect success", res);
                        // cleanup listeners that were only for initial connect/auth
                        socketIO.off('connect_error', onError);
                        resolve(socketIO);
                    }
                );
            };

            const onError = (err) => {
                console.error('Socket connect_error', err);
                reject(err);
            };

            const onDisconnect = (reason) => {
                console.log({'Disconnected from server': reason});
            };

            socketIO.once('connect', onConnect);
            socketIO.once('connect_error', onError);
            socketIO.on('disconnect', onDisconnect);

            // safety timeout in case server doesn't respond
            setTimeout(() => {
                if (!socketIO.connected) {
                    socketIO.off('connect', onConnect);
                    socketIO.off('connect_error', onError);
                    reject(new Error('Business socket connection timeout'));
                }
            }, 15000);
        });
    }
    catch(err){
        console.error("Error during business socket connection:", err);
        throw err;
    }
}



export async function sendOrder(socketRef, data) {
    try {
        if (!socketRef.current) {
            socketRef.current = await HandeSocketConnect(publicCode);
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