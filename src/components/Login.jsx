import { SupaPileContext } from "../context/SupaPileContext";
import { useContext } from "react";
const Login = () => {
  const { handleSignIn } = useContext(SupaPileContext);
  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden  transition-all duration-300 ease-in-out w-[100%]">
      <div className="h-[100svh] bg-gray-100 flex flex-col">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="md:bg-white rounded-3xl md:shadow-lg max-w-md w-full p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 relative">
                {/* Outer circle */}
                <div className="absolute inset-0 rounded-full border-4 border-black"></div>

                {/* Top half - #ff8c00 (orange) */}
                <div
                  className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full"
                  style={{ backgroundColor: "#ff8c00" }}
                ></div>

                {/* Bottom half - white */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white rounded-b-full"></div>

                {/* Center band */}
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-black transform -translate-y-1/2"></div>

                {/* Center button - diamond shape */}
                <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-white border-2 border-black rounded-sm transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>

                {/* Small dot in center */}
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

                {/* Decorative elements - small triangles */}
                <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 transform rotate-45 bg-black"></div>
                <div
                  className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 transform rotate-45"
                  style={{ backgroundColor: "#ff8c00" }}
                ></div>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="text-[1.4rem] flex flex-col text-gray-500 font-medium">
                PILE AND SHARE URLS
              </h1>
            </div>

            {/* Google Button */}
            <button
              type="button"
              className="w-full bg-black text-white rounded-lg py-3 px-4 flex items-center justify-center gap-2 mb-4 hover:bg-[#ff8c00]"
              onClick={handleSignIn}
            >
              <i className="bi bi-google text-white"></i>
              Continue with Google
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 flex flex-col md:flex-row justify-between items-center ">
          <div className="font-bold text-xl">Supapile</div>
          <div className="text-gray-700 flex items-center gap-3">
            all your URLS <span className="text-[#ff8c00] text-[2rem]">•</span>{" "}
            in one place
          </div>
        </footer>
      </div>
    </div>
  );
};
export default Login;
