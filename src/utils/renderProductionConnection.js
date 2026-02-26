import { getFeatureFlags } from "../featureFlags/featureFlags";
import http from "../http/http";

const publicCode = new URLSearchParams(window.location.search).get("public");

const getFlag = async () => {
    const flag = await getFeatureFlags("ORDER_FEATURE");
    return flag
}

const getEnabledBusinessOrderOnlineFeature = async () => {
    return true;
}

export default async function connectToSocket(connectGuest, connected, setSocketEnabled) {
    const orderFlagEnabled = await getFlag();
    const businessOrderOnlineEnabled = await getEnabledBusinessOrderOnlineFeature();

    setSocketEnabled(orderFlagEnabled);
    if(!orderFlagEnabled && !businessOrderOnlineEnabled) return;
    if(connected) return; // already connected
        (async () => {
        try {
            await connectGuest();
        } catch (err) {
            console.error("connectGuest failed", err);
        }
    })();
}