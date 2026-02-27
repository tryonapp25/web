
import http from "../http/http";



class SocketManager {
  constructor(context) {
    const {
      socketRef,
      connected,
      setConnected,
      socketEnabled,
      setSocketEnabled,
      connectGuest,
      connectBusiness,
    } = context;

    this.socketRef = socketRef;
    this.connected = connected;
    this.setConnected = setConnected;
    this.socketEnabled = socketEnabled;
    this.setSocketEnabled = setSocketEnabled;
    this.connectGuest = connectGuest;
    this.connectBusiness = connectBusiness;
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
  constructor(user, context) {
    super(context); // ✅ required
    this.user = user;
  }

  connect() {
    if (this.user?.isCustomer == true) {
      console.log("user is business..");
      this.connectToBusiness();
    } else{
      console.log("user is guest..");
      this.connectToGuest();
    }
  }
}

export default Socket;