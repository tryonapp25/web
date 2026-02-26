import { getFeatureFlags } from "../featureFlags/featureFlags";


const getFlag = async () => {
    const flag = await getFeatureFlags("ORDER_FEATURE");
    return flag
}


export default async function connectToSocket(connectGuest, connected, setSocketEnabled) {
    const orderFeatureEnabled = await getFlag();
    setSocketEnabled(orderFeatureEnabled);
    if(!orderFeatureEnabled) return;
    if(connected) return; // already connected
        (async () => {
        try {
            await connectGuest();
        } catch (err) {
            console.error("connectGuest failed", err);
        }
    })();
}