import { sendOrder } from "../utils/socketio";

class SocketManager {
  constructor(context) {
    const {
      socketRef,
      connected,
      setConnected,
      orderFeatureEnabled,
      setSocketEnabled,
      connectBusiness,
    } = context;

    this.socketRef = socketRef;
    this.connected = connected;
    this.setConnected = setConnected;
    this.orderFeatureEnabled = orderFeatureEnabled;
    this.setSocketEnabled = setSocketEnabled;
    this.connectBusiness = connectBusiness;
  }
  async connectToBusiness() {
    console.log("Connecting to business socket...");
    if (this.connected) return;
    try {
      await this.connectBusiness(this.user);
    } catch (err) {
      console.error("connectBusiness failed", err);
    }
  }

  getSocket() {
    return this.socketRef;
  }
}

class Socket extends SocketManager {
  constructor(context) {
    super(context); // ✅ required
  }

  connect() {
    this.connectToBusiness();
  }

}



export default Socket;