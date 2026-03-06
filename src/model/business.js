
import { setupNotifications } from "../firebase";

class Business {
    constructor(context) {
        super(context); // ✅ required
    }


    getFCMToken() {
        return this.FCMToken;
    }
}