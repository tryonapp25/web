import http from "../http/http";


/**
 * Handles business connection logic.
 * @param {object} params - Dependencies that must be passed from a React component
 * @param {function} params.navigate - useNavigate() hook result
 * @param {object} params.publicUser - User from UserContext
 * @param {function} params.setSocketEnabled - From SocketContext
 * @param {function} params.connectBusiness - From SocketContext
 */


export default async function handleBusinessSocketConnection({
    publicUser,
    setSocketEnabled,
    connectBusiness
}) {
    const isEnabled = await checkEnableOrderOnlineFeature(publicUser);
    setSocketEnabled(isEnabled)
    if (isEnabled && publicUser?.isCustomer) await connectBusiness(publicUser);
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

