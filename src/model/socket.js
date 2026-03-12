

class SocketManager {
  constructor(context) {
    const {
      socketRef,
      connected,
      setConnected,
      orderFeatureEnabled,
      setSocketEnabled,
      connectBusiness,
      connectGuest,
    } = context;

    this.socketRef = socketRef;
    this.connected = connected;
    this.setConnected = setConnected;
    this.orderFeatureEnabled = orderFeatureEnabled;
    this.setSocketEnabled = setSocketEnabled;
    this.connectBusiness = connectBusiness;
    this.connectGuest = connectGuest;
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

  async connectToGuest() {
    console.log("Connecting to guest socket...");
    if (this.connected) return;
    try {
      await this.connectGuest();
    } catch (err) {
      console.error("connectGuest failed", err);
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

  connectAsGuest() {
    this.connectToGuest();
  }

}



export default Socket;