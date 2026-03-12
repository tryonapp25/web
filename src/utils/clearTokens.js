export default function clearTokens() {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
}