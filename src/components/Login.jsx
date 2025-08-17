import { SupaPileAUTHContext } from "../context/SupaPileContext";
import { useContext, useState, useEffect } from "react";
import image from "../assets/Images/supapile-icon2.svg";

const Login = () => {
  const { handleSignIn } = useContext(SupaPileAUTHContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  return (

      <div className="flex items-center justify-center bg-gray-100 h-[100svh] ">
          <div
            className={`backdrop-blur-xl flex flex-col items-center rounded-3xl  md:shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-white/20 max-w-md w-full px-8 py-10 transform transition-all duration-1000 ease-out ${
              isLoaded
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-8 opacity-0 scale-95"
            }`}
          >
            {/* Animated Logo */}
            <img
              src={image}
              className={`mb-6 transform transition-all duration-700 delay-500 w-14 h-auto ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            />

            {/* Animated Heading */}
            <div
              className={`text-center mb-10 transform transition-all duration-700 delay-500 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-3 leading-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                  Supapile
                </span>
              </h1>
              <p className="text-gray-600 text-sm font-medium tracking-wider uppercase">
                PILE AND SHARE URLS
              </p>
            </div>

            {/* Animated Google Button */}
            <button
              type="button"
              className={`group relative w-full bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-3 mb-6 overflow-hidden transition-all duration-700 delay-700 transform hover:scale-105 hover:shadow-2xl ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              onClick={handleSignIn}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Button content with conditional styling */}
              <div className="relative z-20 flex items-center justify-center gap-3">
                <i
                  className={`bi bi-google text-lg transition-all duration-300 ${
                    isHovered ? "rotate-12 scale-110 text-white" : "text-white"
                  }`}
                  style={{ color: "white !important" }}
                ></i>
                <p
                  className={`font-semibold transition-all duration-300 ${
                    isHovered ? "text-white drop-shadow-lg" : "text-white"
                  }`}
                  style={{ color: "white !important" }}
                >
                  Continue with Google
                </p>
              </div>

              {/* Animated background overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r from-pink-500 to-orange-500 transition-transform duration-300 ${
                  isHovered ? "translate-x-0" : "-translate-x-full"
                }`}
              ></div>
            </button>

            {/* Security note */}
            <p
              className={`text-xs text-gray-500 text-center transition-all duration-700 delay-900 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              🔒 Secure authentication with Google
            </p>
          </div>
        


      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
