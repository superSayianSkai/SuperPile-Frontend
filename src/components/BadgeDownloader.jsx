import { useRef } from "react";
import { toPng } from "html-to-image";

const BadgeDownloader = () => {
  // const ref = useRef(null);

  // const handleDownload = async () => {
  //   if (!ref.current) return;

  //   try {
  //     const dataUrl = await toPng(ref.current, {
  //       backgroundColor: "transparent",
  //       pixelRatio: 2, // sharper image
  //     });

  //     const link = document.createElement("a");
  //     link.download = "badge.png";
  //     link.href = dataUrl;
  //     link.click();
  //   } catch (err) {
  //     console.error("Failed to export image:", err);
  //   }

  const ref = useRef();

  const handleDownload = async () => {
    if (!ref.current) return;

    try {
      const datUrl = await toPng(ref.current, {
        backgroundColor: "transparent",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = "supapile-icon.png", 
      link.href = datUrl;
      link.click();
    } catch (err) {
      console.err("failed to export image: ", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <div ref={ref} className="relative h-8 w-8">
        {/* Outer circle with gradient border */}
        <div
          className="absolute inset-0 rounded-full p-0.5"
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
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white border-2 border-gray-800 rounded-sm transform -translate-x-1/2 -translate-y-1/2 rotate-45 shadow-sm"></div>

        {/* Center dot with subtle glow */}
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <button
        onClick={handleDownload}
        className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-lg shadow-md hover:brightness-110 transition-all"
      >
        Download PNG
      </button>
    </div>
  );
};

export default BadgeDownloader;
