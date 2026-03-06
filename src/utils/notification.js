export async function showNotification(message) {
    if (!("Notification" in window)) {
        console.error("This browser does not support desktop notifications.");
        return;
    }
    if (Notification.permission === "granted") {
        new Notification(message);
    }
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(async (permission) => {
            if (permission === "granted") {
                new Notification(message);
            }
        });
    }
}

export function Vibrate() {
    if ("vibrate" in navigator) {
        navigator.vibrate([300, 100, 300]);
    }
    const audio = new Audio("/audios/order_completed.mp3");
    audio.play().catch(() => {
        // Browser blocked autoplay — play on first user interaction
        const playOnInteraction = () => {
            audio.play().catch(() => {});
            document.removeEventListener("click", playOnInteraction);
            document.removeEventListener("touchstart", playOnInteraction);
        };
        document.addEventListener("click", playOnInteraction, { once: true });
        document.addEventListener("touchstart", playOnInteraction, { once: true });
    });
}