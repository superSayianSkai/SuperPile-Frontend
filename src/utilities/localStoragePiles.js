import { getMetaDataSync } from '../utils/getMetaDataSync';


const LOCAL_STORAGE_KEY = 'supapile_local_piles';
const MAX_LOCAL_PILES = 5;

// Add a callback system for updates
//how does the call back system handle updates 
let updateCallbacks = [];

const notifyUpdate = () => {
  updateCallbacks.forEach(callback => callback());
};

export const localStoragePiles = {
  // Subscribe to updates
  subscribe: (callback) => {
    updateCallbacks.push(callback);
    return () => {
      updateCallbacks = updateCallbacks.filter(cb => cb !== callback);
    };
  },

  // Get all local piles
  getLocalPiles: () => {
    try {
      const piles = localStorage.getItem(LOCAL_STORAGE_KEY);
      return piles ? JSON.parse(piles) : [];
    } catch (error) {
      console.error('Error getting local piles:', error);
      return [];
    }
  },

  // Add a new pile to local storage with optimistic update
  addLocalPile: async (url, category = 'general') => {
    try {
      const existingPiles = localStoragePiles.getLocalPiles();
      
      // Check if URL already exists
      if (existingPiles.some(pile => pile.url === url)) {
        throw new Error('This link has already been saved');
      }
      
      // Check if we've reached the maximum
      if (existingPiles.length >= MAX_LOCAL_PILES) {
        throw new Error(`You can only save up to ${MAX_LOCAL_PILES} piles. Sign up to save more!`);
      }

      // Create pile immediately with basic info (optimistic update)
      const newPile = {
        id: Date.now().toString(),
        url,
        category,
        title: '',
        description: '',
        image: '',
        createdAt: new Date().toISOString(),
        isLocal: true,
        isLoadingMetadata: true // Flag to indicate metadata is being fetched
      };

      // Save immediately to localStorage
      const updatedPiles = [newPile, ...existingPiles];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPiles));
      notifyUpdate(); // Notify subscribers immediately
      
      // Fetch metadata in the background
      getMetaDataSync(url)
        .then(metadata => {
          console.log('Metadata fetched:', metadata); // Debug log
          // Update the pile with metadata
          localStoragePiles.updatePileMetadata(newPile.id, {
            title: metadata.title || '',
            description: metadata.description || '',
            image: metadata.image || '',
            isLoadingMetadata: false
          });
        })
        .catch(error => {
          console.error('Failed to fetch metadata:', error);
          // Still remove the loading flag even if metadata fetch fails
          localStoragePiles.updatePileMetadata(newPile.id, {
            isLoadingMetadata: false
          });
        });
      
      return newPile;
    } catch (error) {
      console.error('Error adding local pile:', error);
      throw error;
    }
  },

  // Update metadata for a specific pile
  updatePileMetadata: (id, metadata) => {
    try {
      const existingPiles = localStoragePiles.getLocalPiles();
      const updatedPiles = existingPiles.map(pile => 
        pile.id === id 
          ? { ...pile, ...metadata }
          : pile
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPiles));
      console.log('Metadata updated for pile:', id, metadata); // Debug log
      notifyUpdate(); // Notify subscribers of the update
      return updatedPiles;
    } catch (error) {
      console.error('Error updating pile metadata:', error);
      throw error;
    }
  },

  // Remove a pile from local storage
  removeLocalPile: (id) => {
    try {
      const existingPiles = localStoragePiles.getLocalPiles();
      const updatedPiles = existingPiles.filter(pile => pile.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPiles));
      notifyUpdate(); // Notify subscribers
      return updatedPiles;
    } catch (error) {
      console.error('Error removing local pile:', error);
      throw error;
    }
  },

  // Clear all local piles (used after migration)
  clearLocalPiles: () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      notifyUpdate(); // Notify subscribers
    } catch (error) {
      console.error('Error clearing local piles:', error);
    }
  },

  // Get count of local piles
  getLocalPilesCount: () => {
    return localStoragePiles.getLocalPiles().length;
  },

  // Check if we can add more piles
  canAddMore: () => {
    return localStoragePiles.getLocalPilesCount() < MAX_LOCAL_PILES;
  },

  // Get remaining slots
  getRemainingSlots: () => {
    return MAX_LOCAL_PILES - localStoragePiles.getLocalPilesCount();
  }
};