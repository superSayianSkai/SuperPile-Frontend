import useServiceWorkerUpdater from "../hooks/useServiceWorkerUpdate";
const ServiceWorkerToast = () => {
  const updated = useServiceWorkerUpdater();

  if (!updated) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 
      bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg z-[2000]">
      ✅ App updated! Refreshing…
    </div>
  );
};

export default ServiceWorkerToast;