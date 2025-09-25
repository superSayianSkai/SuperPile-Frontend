import { useEffect, useState } from 'react';

const AutoMigrationNotification = ({ migrationStatus, isMigrating, migrationProgress }) => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (migrationStatus || isMigrating) {
      setShowNotification(true);
    }
  }, [migrationStatus, isMigrating]);

  useEffect(() => {
    if (migrationStatus && migrationStatus.success) {
      // Auto-hide success notification after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [migrationStatus]);

  if (!showNotification) return null;

  return (
    <div className="fixed top-18 right-4 z-50 max-w-sm">
      <div className={`rounded-lg p-4 shadow-lg border ${
        isMigrating 
          ? 'bg-blue-50 border-blue-200' 
          : migrationStatus?.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {isMigrating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            ) : migrationStatus?.success ? (
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${
              isMigrating 
                ? 'text-blue-800' 
                : migrationStatus?.success 
                  ? 'text-green-800' 
                  : 'text-red-800'
            }`}>
              {isMigrating ? 'Migrating Your Saved Links' : 'Migration Complete'}
            </h3>
            <div className={`mt-1 text-sm ${
              isMigrating 
                ? 'text-blue-700' 
                : migrationStatus?.success 
                  ? 'text-green-700' 
                  : 'text-red-700'
            }`}>
              {isMigrating ? (
                <div>
                  <p>Moving your locally saved piles to your account...</p>
                  {migrationProgress > 0 && (
                    <div className="mt-2">
                      <div className="bg-white rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#ff66b2] to-[#ff8c00] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${migrationProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1">{migrationProgress}% complete</p>
                    </div>
                  )}
                </div>
              ) : (
                <p>{migrationStatus?.message}</p>
              )}
            </div>
          </div>
          {isMigrating && (
            <div className="ml-4">
              <button
                onClick={() => setShowNotification(false)}
                className={`inline-flex text-sm ${
                  migrationStatus?.success ? 'text-green-400 hover:text-green-500' : 'text-red-400 hover:text-red-500'
                }`}
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoMigrationNotification;