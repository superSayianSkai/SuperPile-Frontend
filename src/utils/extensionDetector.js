// Extension detection utility
export const detectExtension = () => {
  return new Promise((resolve) => {
    // Method 1: Check for extension-injected global variable
    if (window.Supapile) {
      console.log("✅ Supapile extension detected!", window.Supapile.version);
      console.log("Ping test:", window.Supapile.ping());
      console.log("extension found");
      resolve(true);
      return;
    }

    // Method 2: Try to communicate with extension
    const checkExtension = () => {
      try {
        // Send message to extension
        window.postMessage({ type: "CHECK_EXTENSION" }, "*");

        const messageListener = (event) => {
          if (event.data.type === "EXTENSION_RESPONSE") {
            window.removeEventListener("message", messageListener);
            resolve(true);
          }
        };

        window.addEventListener("message", messageListener);

        // Timeout if no response
        setTimeout(() => {
          window.removeEventListener("message", messageListener);
          console.log('❌ Supapile extension not found');
          resolve(false);
        }, 1000);
      } catch (error) {
        console.log(error);
        resolve(false);
      }
    };

    checkExtension();
  });
};
