import { useEffect, useState, useRef } from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

const OfflineSnackbar = () => {
  const isOnline = useOnlineStatus();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const prevOnlineStatus = useRef(isOnline); // store previous state

  useEffect(() => {
    // went offline
    if (!isOnline && prevOnlineStatus.current) {
      setMessage("offline");
      setVisible(true);
    }

    // came back online
    if (isOnline && !prevOnlineStatus.current) {
      setMessage("online");
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }

    prevOnlineStatus.current = isOnline; // update previous state
  }, [isOnline]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-xl shadow-lg z-[1000] text-center text-sm">
      {message === "online" ? (
        <span>✅ Back online</span>
      ) : (
        <span className="flex items-center gap-2 text-red-200">
          <i className="bi bi-exclamation-circle"></i>
          <span>You are offline</span>
        </span>
      )}
    </div>
  );
};

export default OfflineSnackbar;