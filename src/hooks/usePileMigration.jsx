import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import usePostPile from '../tanstack-query-hooks/usePostPile';
import { localStoragePiles } from '../utilities/localStoragePiles';

export const usePileMigration = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationError, setMigrationError] = useState(null);
  const postPile = usePostPile();
  const queryClient = useQueryClient();

  const migratePilesToAccount = async () => {
    const localPiles = localStoragePiles.getLocalPiles();
    
    if (localPiles.length === 0) {
      return { success: true, migratedCount: 0 };
    }

    setIsMigrating(true);
    setMigrationProgress(0);
    setMigrationError(null);

    let migratedCount = 0;
    const totalPiles = localPiles.length;

    try {
      for (let i = 0; i < localPiles.length; i++) {
        const pile = localPiles[i];
        
        try {
          await postPile.mutateAsync({
            url: pile.url,
            category: pile.category || 'general',
            skipOptimisticUpdate: true // Skip optimistic updates during migration
          });
          
          migratedCount++;
          setMigrationProgress(Math.round((migratedCount / totalPiles) * 100));
          
          // Small delay to prevent overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to migrate pile: ${pile.url}`, error);
          // Continue with other piles even if one fails
        }
      }

      // Clear local storage after successful migration
      if (migratedCount > 0) {
        localStoragePiles.clearLocalPiles();
        
        // Invalidate pile queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: ["pile"], exact: false });
      }

      return { success: true, migratedCount };
    } catch (error) {
      setMigrationError(error.message);
      return { success: false, migratedCount, error: error.message };
    } finally {
      setIsMigrating(false);
      setMigrationProgress(0);
    }
  };

  return {
    migratePilesToAccount,
    isMigrating,
    migrationProgress,
    migrationError
  };
};