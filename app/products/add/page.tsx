'use client'

import { useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/lib/ProductContext';
import ProductForm from '@/components/ProductForm';
import ThemeToggle from '@/components/ThemeToggle';

export default function AddProduct() {
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSave = (productData: Omit<import('@/lib/products').Product, 'id'>) => {
    addProduct(productData);
    router.push('/products');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Product</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ProductForm onSave={handleSave} />
          </div>
        </div>
      </main>
    </div>
  );
}
