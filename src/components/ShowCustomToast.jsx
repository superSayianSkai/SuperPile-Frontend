// src/components/CustomToast.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types"
const CustomToast = ({ message = "", show = false, duration = 1000 }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!visible) return null;

  return (
    <div className={`fixed flex  items-center dark:bg-white dark:text-black justify-center gap-2 bottom-2 md:bottom-4 md:left-8 bg-black text-white text-sm max-sm:rounded-md rounded-xl px-4  py-3 md:py-2 shadow-lg z-50 animate-slide-up ${message?"block":"hidden"} `}>
      {message}
    </div>
  );
};

CustomToast.propTypes={
    message :PropTypes.string,
    show:PropTypes.bool,
    duration:PropTypes.number
};

<style>
{`
@keyframes slide-up-down {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(20px);
  }
}
.animate-slide-up {
  animation: slide-up-down 3s ease-in-out forwards;
}
`}
</style>

export default CustomToast;
