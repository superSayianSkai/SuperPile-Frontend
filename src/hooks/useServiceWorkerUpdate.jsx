// src/hooks/useServiceWorkerUpdater.ts
import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

const useServiceWorkerUpdater = () => {
  const [updated, setUpdated] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log("SW registered:", swUrl, registration);
    },
    onNeedRefresh() {
      console.log("⚡ A new version is available!");
      setUpdated(true);
    },
    onRegisterError(error) {
      console.error("SW registration failed", error);
    },
  });

  // Auto-refresh after 2s when update is detected
  useEffect(() => {
    if (updated) {
      const timer = setTimeout(() => {
        updateServiceWorker(true); // skip waiting
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [updated, updateServiceWorker]);

  return updated;
};

export default useServiceWorkerUpdater;