'use client'

import { useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log('User role:', user.role); // Debug logging
      if (user.role === 'Manager') {
        router.push('/dashboard');
      } else if (user.role === 'Cashier') {
        router.push('/billing');
      } else {
        router.push('/products');
      }
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return <div>Loading...</div>;
}
