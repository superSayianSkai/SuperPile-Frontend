import React, { useEffect, useState } from 'react';
import { usePileMigration } from '../hooks/usePileMigration';
import { localStoragePiles } from '../utilities/localStoragePiles';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

const PileMigrationHandler = ({ isAuthenticated, onMigrationComplete }) => {
  const { migratePilesToAccount, isMigrating, migrationProgress, migrationError } = usePileMigration();
  const [migrationStatus, setMigrationStatus] = useState('idle'); // idle, migrating, success, error
  const [migratedCount, setMigratedCount] = useState(0);

  useEffect(() => {
    const handleMigration = async () => {
      if (isAuthenticated && migrationStatus === 'idle') {
        const localPiles = localStoragePiles.getLocalPiles();
        
        if (localPiles.length > 0) {
          setMigrationStatus('migrating');
          
          try {
            const result = await migratePilesToAccount();
            
            if (result.success) {
              setMigrationStatus('success');
              setMigratedCount(result.migratedCount);
              
              // Auto-close after 3 seconds
              setTimeout(() => {
                onMigrationComplete?.(result);
              }, 3000);
            } else {
              setMigrationStatus('error');
            }
          } catch (error) {
            setMigrationStatus('error');
          }
        }
      }
    };

    handleMigration();
  }, [isAuthenticated, migrationStatus, migratePilesToAccount, onMigrationComplete]);

  if (migrationStatus === 'idle' || !isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        {migrationStatus === 'migrating' && (
          <div className="text-center">
            <Loader className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Migrating Your Links
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We're moving your saved links to your account...
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${migrationProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {migrationProgress}% complete
            </p>
          </div>
        )}

        {migrationStatus === 'success' && (
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Migration Complete!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Successfully moved {migratedCount} link{migratedCount !== 1 ? 's' : ''} to your account.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Redirecting you to your dashboard...
            </p>
          </div>
        )}

        {migrationStatus === 'error' && (
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Migration Error
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {migrationError || 'There was an error migrating your links. Please try again.'}
            </p>
            <button
              onClick={() => setMigrationStatus('idle')}
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PileMigrationHandler;