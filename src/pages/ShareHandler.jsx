import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePostStore } from '../zustard/usePostStore'; // Adjust import based on your store

const ShareHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addLink } = usePostStore(); // Adjust based on your state management

  useEffect(() => {
    const title = searchParams.get('title');
    const text = searchParams.get('text');
    const url = searchParams.get('url');

    if (url) {
      // Add the shared URL to your app's state/storage
      const linkData = {
        url: url,
        title: title || 'Shared Link',
        description: text || '',
        timestamp: new Date().toISOString()
      };

      // Add to your pile/collection
      addLink(linkData);
      
      // Show success message or redirect
      console.log('Link added from share:', linkData);
      
      // Redirect to home page after processing
      navigate('/', { replace: true });
    } else {
      // No URL shared, redirect to home
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate, addLink]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Adding shared link...</p>
      </div>
    </div>
  );
};

export default ShareHandler;