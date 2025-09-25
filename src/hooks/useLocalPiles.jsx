import { useState, useEffect } from 'react';
import { localStoragePiles } from '../utilities/localStoragePiles';

export const useLocalPiles = () => {
  const [localPiles, setLocalPiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshPiles = () => {
    const piles = localStoragePiles.getLocalPiles();
    setLocalPiles(piles);
  };

  useEffect(() => {
    refreshPiles();
    
    // Subscribe to updates from localStoragePiles
    const unsubscribe = localStoragePiles.subscribe(() => {
      console.log('LocalPiles updated, refreshing...'); // Debug log
      refreshPiles();
    });

    return unsubscribe;
  }, []);

  const addPile = async (url, category = 'general') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Add pile optimistically (no waiting for metadata)
      const newPile = await localStoragePiles.addLocalPile(url, category);
      
      return newPile;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removePile = (id) => {
    try {
      localStoragePiles.removeLocalPile(id);
    } catch (err) {
      setError(err.message);
    }
  };

  const clearAllPiles = () => {
    try {
      localStoragePiles.clearLocalPiles();
    } catch (err) {
      setError(err.message);
    }
  };

  const updatePileMetadata = (id, metadata) => {
    try {
      localStoragePiles.updatePileMetadata(id, metadata);
    } catch (err) {
      setError(err.message);
    }
  };

  const canAddMore = localStoragePiles.canAddMore();
  const remainingSlots = localStoragePiles.getRemainingSlots();
  const pilesCount = localStoragePiles.getLocalPilesCount();

  return {
    localPiles,
    isLoading,
    error,
    addPile,
    removePile,
    clearAllPiles,
    refreshPiles,
    updatePileMetadata,
    canAddMore,
    remainingSlots,
    pilesCount
  };
};