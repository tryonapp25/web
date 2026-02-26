import http from "../http/http";
import { getFeatureFlags } from "../featureFlags/featureFlags";

/**
 * Handles business connection logic.
 * @param {object} params - Dependencies that must be passed from a React component
 * @param {function} params.navigate - useNavigate() hook result
 * @param {object} params.publicUser - User from UserContext
 * @param {function} params.setSocketEnabled - From SocketContext
 * @param {function} params.connectBusiness - From SocketContext
 */

const getFlag = async () => {
    const flag = await getFeatureFlags("ORDER_FEATURE");
    return flag;
}
export default async function handleBusinessSocketConnection({
    publicUser,
    setSocketEnabled,
    connectBusiness
}) {
    const isEnabled = await checkEnableOrderOnlineFeature(publicUser);
    const flag = await getFlag();
    setSocketEnabled(isEnabled);
    if (isEnabled && flag) await socketConnect(publicUser, connectBusiness);
}

const checkEnableOrderOnlineFeature = async (user) => {
    try {
        const res = await http.get(`/business/feature/ORDER_ONLINE/business/${user?.business?.id}`);
        const enabled = res.data?.data ?? false;
        return enabled;
    } catch (err) {
        console.error("Error checking permissions:", err);
        return false;
    }
};

const socketConnect = async (user, connectBusiness) => {
    if (!user?.isCustomer) return;

    try {
        await connectBusiness(user);
    } catch (err) {
        console.error("connectBusiness failed", err);
    }
};