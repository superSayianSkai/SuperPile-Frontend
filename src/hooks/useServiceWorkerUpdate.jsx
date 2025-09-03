// src/hooks/useServiceWorkerUpdater.ts
import { useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

const useServiceWorkerUpdater=()=> {
  const [updated, setUpdated] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onNeedRefresh() {
      // Called when a new SW is waiting
      setUpdated(true);
    },
    onRegisteredSW(_, registration) {
      if (registration) {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated") {
                // SW activated successfully
                setUpdated(true);
                // Force reload after short delay
                setTimeout(() => {
                  updateServiceWorker(true);
                  window.location.reload();
                }, 2000);
              }
            });
          }
        });
      }
    }
  });

  return updated;
}

export default useServiceWorkerUpdater