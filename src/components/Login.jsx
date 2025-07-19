import { SupaPileAUTHContext } from "../context/SupaPileContext";
import { useContext, useState, useEffect } from "react";

const Login = () => {
  const { handleSignIn } = useContext(SupaPileAUTHContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-orange-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative h-[100svh] flex flex-col">
        <main className="flex-1 flex items-center justify-center p-4">
          <div
            className={`bg-white/80 backdrop-blur-xl flex flex-col items-center rounded-3xl shadow-2xl border border-white/20 max-w-md w-full p-8 transform transition-all duration-1000 ease-out ${
              isLoaded
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-8 opacity-0 scale-95"
            }`}
          >
            {/* Animated Logo */}
            <div
              className={`relative mb-8 transform transition-all duration-700 delay-300 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ width: "64px", height: "64px" }}
            >
              {/* Outer circle with gradient border */}
              <div
                className="absolute inset-0 rounded-full p-0.5 animate-spin-slow"
                style={{
                  background: "linear-gradient(to right, #ff66b2, #ff8c00)",
                }}
              >
                <div className="w-full h-full rounded-full bg-white"></div>
              </div>

              {/* Top half - pink to orange gradient */}
              <div
                className="absolute top-0.5 left-0.5 right-0.5 h-[calc(50%-2px)] rounded-t-full"
                style={{
                  background: "linear-gradient(to right, #ff66b2, #ff8c00)",
                }}
              ></div>

              {/* Bottom half - clean white */}
              <div className="absolute bottom-0.5 left-0.5 right-0.5 h-[calc(50%-2px)] bg-white rounded-b-full"></div>

              {/* Center divider with subtle shadow */}
              <div className="absolute top-1/2 left-1 right-1 h-0.5 bg-gray-800 transform -translate-y-1/2 shadow-sm"></div>

              {/* Center diamond - more refined */}
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-sm transform -translate-x-1/2 -translate-y-1/2 rotate-45 shadow-sm animate-pulse"></div>

              {/* Center dot with subtle glow */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            {/* Animated Heading */}
            <div
              className={`text-center mb-8 transform transition-all duration-700 delay-500 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent animate-pulse">
                  Supapile
                </span>
              </h1>
              <p className="text-gray-600 text-sm font-medium tracking-wide">
                PILE AND SHARE URLS
              </p>
            </div>

            {/* Animated Google Button */}
            <button
              type="button"
              className={`group relative w-full bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-3 mb-4 overflow-hidden transition-all duration-700 delay-700 transform hover:scale-105 hover:shadow-2xl ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              onClick={handleSignIn}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Button content with conditional styling */}
              <div className="relative z-20 flex items-center gap-3">
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
        </main>

        {/* Animated Footer */}
        <footer
          className={`p-6 flex flex-col md:flex-row justify-between items-center bg-white/50 backdrop-blur-sm border-t border-white/20 transition-all duration-1000 delay-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="font-bold text-2xl bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent mb-2 md:mb-0">
            Supapile
          </div>
          <div className="text-gray-700 flex items-center gap-3 text-sm md:text-base">
            all your URLS
            <span className="text-orange-500 text-2xl animate-pulse">•</span>
            in one place
          </div>
        </footer>
      </div>

      {/* Custom CSS for additional animations */}
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
