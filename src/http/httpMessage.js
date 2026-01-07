export default function httpMessage(err){
    if (err?.response?.data?.message) {
    return err.response.data.message;
    }
    if (err?.response?.statusText) {
        return err.response.statusText;
    }
    if (err?.message) {
        return err.message;
    }
    return `status: ${err.response.status} "Server error 500"`;
}