'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function LogoutPage() {
  const { logout } = useAuthStore();

  useEffect(() => {
    const performLogout = async () => {
      // Clear Zustand store
      logout();
      
      // Clear all storage
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      // Call logout API to clear cookies
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Logout API error:', error);
      }

      // Redirect to login with cache busting
      setTimeout(() => {
        window.location.replace('/login?t=' + Date.now());
      }, 500);
    };

    performLogout();
  }, [logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
        <p className="mt-4 text-slate-400">Logging out...</p>
      </div>
    </div>
  );
}
