import http from "../http/http";

const publicCode = new URLSearchParams(window.location.search).get("public");


const getEnabledBusinessOrderOnlineFeatureByPublicCode = async () => {
    try {
        const response = await http.get(`/business/feature/ORDER_ONLINE/publicCode/${publicCode}`);
        return response.data.data || false;
    } catch (error) {        console.error("Error fetching business order online feature status:", error);
        return false; // Default to false if there's an error
    }
}

export default async function connectToSocket(connectGuest, connected, setSocketEnabled) {
    const businessOrderOnlineEnabled = await getEnabledBusinessOrderOnlineFeatureByPublicCode();
;
    if(!businessOrderOnlineEnabled) return;
    setSocketEnabled(businessOrderOnlineEnabled);

    if(connected) return; // already connected
        (async () => {
        try {
            await connectGuest();
        } catch (err) {
            console.error("connectGuest failed", err);
        }
    })();
}