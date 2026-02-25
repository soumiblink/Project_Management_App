import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export const useAuth = (requireAuth: boolean = true) => {
  const router = useRouter();
  const { isAuthenticated, user, isInitialized } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for store to be initialized
    if (!isInitialized) {
      return;
    }

    setIsChecking(false);

    // Small delay to prevent flash of wrong page
    const timer = setTimeout(() => {
      if (requireAuth && !isAuthenticated) {
        router.push('/login');
      } else if (!requireAuth && isAuthenticated) {
        router.push('/dashboard');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, requireAuth, router, isInitialized]);

  return { isAuthenticated, user, isChecking: isChecking || !isInitialized };
};
