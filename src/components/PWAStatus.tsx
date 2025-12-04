import { useEffect, useState } from 'react';

export default function PWAStatus() {
  const [status, setStatus] = useState({
    isOnline: navigator.onLine,
    isInstalled: false,
    swRegistered: false,
    swActive: false,
  });

  useEffect(() => {
    // Check if running as installed PWA
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // Check service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        setStatus(prev => ({
          ...prev,
          isInstalled,
          swRegistered: !!registration,
          swActive: registration?.active !== null,
        }));
      });
    } else {
      setStatus(prev => ({ ...prev, isInstalled }));
    }

    // Listen for online/offline
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Only show in development or when explicitly needed
  if (process.env.NODE_ENV === 'production' && status.swActive) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 text-white p-3 rounded-lg shadow-lg text-xs space-y-1 z-50 max-w-xs">
      <div className="font-bold mb-2">PWA Status</div>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${status.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>{status.isOnline ? 'Online' : 'Offline'}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${status.isInstalled ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <span>{status.isInstalled ? 'Installed' : 'Not Installed'}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${status.swRegistered ? 'bg-green-500' : 'bg-red-500'}`} />
        <span>Service Worker: {status.swRegistered ? 'Registered' : 'Not Registered'}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${status.swActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
        <span>SW Status: {status.swActive ? 'Active' : 'Inactive'}</span>
      </div>
    </div>
  );
}
