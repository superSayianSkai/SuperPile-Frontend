import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useError } from "../zustard/useError";

const CustomToast = ({ message = "", show = false, duration = 1000 }) => {
  const [visible, setVisible] = useState(show);
  const clearError = useError((state) => state.setError);

  useEffect(() => {
    if (show && message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        // Clear the error by setting it to empty string
        clearError("");
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [show, duration, message, clearError]);

  // Don't render if there's no message or not meant to be shown
  if (!visible || !message) return null;

  return (
    <div className={`fixed flex items-center dark:bg-white dark:text-black justify-center gap-2 bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm max-sm:rounded-md rounded-xl px-4 py-3 md:py-2 shadow-lg z-50 animate-slide-up w-[350px] ${message ? "block" : "hidden"} z-[2000]`}>
      {message}
    </div>
  );
};

CustomToast.propTypes = {
  message: PropTypes.string,
  show: PropTypes.bool,
  duration: PropTypes.number
};

export default CustomToast;
