import http from "../http/http";
import httpMessage from "../http/httpMessage";



export const getFeatureFlags = async (name) => {
  try {
    const res = await http.get(`/featureFlags/name/${name}`)  
    if (res.data.success) {
        console.log('Feature flag data:', res.data.data) // Debug log
      return res.data.data || false
    }
    return false
    } catch (e) {
        console.error('Error fetching feature flags', httpMessage(e))
        return false
    }
}