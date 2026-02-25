'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function ClearAuthPage() {
  const router = useRouter();
  const { logout } = useAuthStore();

  useEffect(() => {
    // Clear all auth data
    logout();
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }

    // Redirect to login after a short delay
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  }, [logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
        <p className="mt-4 text-slate-400">Clearing authentication data...</p>
        <p className="mt-2 text-sm text-slate-500">You will be redirected to login shortly</p>
      </div>
    </div>
  );
}
