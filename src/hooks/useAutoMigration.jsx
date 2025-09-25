import { useEffect, useState } from 'react';
import { usePileMigration } from './usePileMigration';
import { localStoragePiles } from '../utilities/localStoragePiles';

export const useAutoMigration = (user) => {
  const [hasAttemptedMigration, setHasAttemptedMigration] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const { migratePilesToAccount, isMigrating, migrationProgress } = usePileMigration();

  useEffect(() => {
    const attemptAutoMigration = async () => {
      // Only attempt migration if:
      // 1. User is authenticated
      // 2. We haven't already attempted migration in this session
      // 3. There are local piles to migrate
      // 4. Not currently migrating
      if (user && !hasAttemptedMigration && !isMigrating) {
        const localPiles = localStoragePiles.getLocalPiles();
        
        if (localPiles.length > 0) {
          console.log(`Found ${localPiles.length} local piles to migrate`);
          setHasAttemptedMigration(true);
          
          try {
            const result = await migratePilesToAccount();
            setMigrationStatus({
              success: result.success,
              migratedCount: result.migratedCount,
              message: result.success 
                ? `Successfully migrated ${result.migratedCount} piles to your account!`
                : `Migration failed: ${result.error}`
            });
          } catch (error) {
            console.error('Auto-migration failed:', error);
            setMigrationStatus({
              success: false,
              migratedCount: 0,
              message: `Migration failed: ${error.message}`
            });
          }
        } else {
          // No piles to migrate, mark as attempted to prevent future checks
          setHasAttemptedMigration(true);
        }
      }
    };

    attemptAutoMigration();
  }, [user, hasAttemptedMigration, isMigrating, migratePilesToAccount]);

  // Reset migration attempt when user logs out
  useEffect(() => {
    if (!user) {
      setHasAttemptedMigration(false);
      setMigrationStatus(null);
    }
  }, [user]);

  return {
    isMigrating,
    migrationProgress,
    migrationStatus,
    hasAttemptedMigration
  };
};