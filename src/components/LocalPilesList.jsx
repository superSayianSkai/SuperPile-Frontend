import { useState } from 'react';
import { Trash2, Copy, ExternalLink } from 'lucide-react';
import { localStoragePiles } from '../utilities/localStoragePiles';

const LocalPilesList = ({ piles, onRemove, onRefresh }) => {
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleRemove = (id) => {
    try {
      localStoragePiles.removeLocalPile(id);
      onRemove(id);
      onRefresh();
    } catch (error) {
      console.error('Error removing pile:', error);
    }
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    // You can add toast notification here if needed
  };

  const getHostName = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  if (piles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No saved links yet. Add your first link above!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1   sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {piles.map((pile) => {
        const hasImageError = imageErrors.has(pile.id);
        const imageUrl = pile.image;
        const hostName = getHostName(pile.url);

        return (
          <div key={pile.id} className="flex flex-col">
            <div
              draggable="true"
              className={`border-[1px] border-slate-300 dark:border-slate-500 rounded-xl overflow-clip flex flex-col justify-between cursor-pointer hover:opacity-90 ${
                pile.isLoadingMetadata ? 'animate-pulse' : ''
              }`}
            >
              <a href={pile.url} target="_blank" rel="noopener noreferrer">
                <div className="w-full aspect-[16/9] bg-black relative">
                  {pile.isLoadingMetadata && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                      <div className="text-white text-xs">Loading...</div>
                    </div>
                  )}
                  {imageUrl && !hasImageError ? (
                    <img
                      src={imageUrl}
                      className="w-full h-full object-contain"
                      onError={() => handleImageError(pile.id, imageUrl)}
                      onLoad={() => {
                        // Remove from error set if image loads successfully after retry
                        setImageErrors((prev) => {
                          const newSet = new Set(prev);
                          newSet.delete(pile.id);
                          return newSet;
                        });
                      }}
                    />
                  ) : (
                    <div className="w-full h-full object-contain bg-black flex justify-center items-center font-bold transition-all duration-300 bg-gradient-to-r from-[#ff66b2] to-[#ff8c00]">
                      {pile.title ? (
                        <h1 className="text-[.9rem] text-white text-center uppercase">
                          {pile.title}
                        </h1>
                      ) : (
                        <h1 className="text-[.8rem] text-white dark:text-white uppercase">
                          {hostName}
                        </h1>
                      )}
                    </div>
                  )}
                </div>
              </a>
            </div>
            
            <div className="pt-[.8rem] px-[.7rem] flex flex-col gap-[5px] justify-between">
              <h2 className="font-bold text-[.7rem] flex items-center gap-1">
                {pile.title || hostName}
                {pile.isLoadingMetadata && (
                  <span className="text-xs text-gray-400 animate-pulse">•••</span>
                )}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-[.6rem] text-ellipsis mt-[10px]">
                {pile.description?.slice(0, 152) || `Visit ${hostName}`}
              </p>
              <div className="flex items-center w-[100%] pr-[1rem]">
                <div className="flex gap-4 mt-[10px] items-center w-[100%]">
                  <button
                    onClick={() => copy(pile.url)}
                    className="p-1 rounded-md transition"
                    title="Copy link"
                  >
                    <Copy className="h-4 w-4 hover:opacity-50 md:hover:opacity-50 active:opacity-50 hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] transition" />
                  </button>
                  <button
                    onClick={() => window.open(pile.url, '_blank')}
                    className="p-1 rounded-md transition"
                    title="Open link"
                  >
                    <ExternalLink className="h-4 w-4 hover:opacity-50 md:hover:opacity-50 active:opacity-50 hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] transition" />
                  </button>
                  <button 
                    className="p-1 rounded-md transition"
                    onClick={() => handleRemove(pile.id)}
                    title="Remove link"
                  >
                    <Trash2 className="h-4 w-4 text-red-600 hover:opacity-50 md:hover:opacity-50 active:opacity-50  hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#ff66b2] hover:to-[#ff8c00] transition cursor-pointer" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LocalPilesList;