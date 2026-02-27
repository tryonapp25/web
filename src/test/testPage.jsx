import { useEffect, useRef, useContext } from "react";
import { SocketContext } from "../ApiContext/socketContext";
import { UserContext } from "../ApiContext/userContext";
import Socket from "../model/socket";

export default function TestPage() {
  const connectingRef = useRef(false);

  const { publicUser } = useContext(UserContext);
  const socketContext = useContext(SocketContext); // ✅ hook at top-level

  useEffect(() => {
    if (connectingRef.current) return;
    connectingRef.current = true;

    const socket = new Socket(publicUser, socketContext); // ✅ pass value
    socket.connect();
  }, [publicUser, socketContext]); // ✅ include deps

  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page for development purposes.</p>
    </div>
  );
}