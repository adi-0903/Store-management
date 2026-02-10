'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useProducts } from '@/lib/ProductContext';
import ProductForm from '@/components/ProductForm';
import { Product } from '@/lib/products';
import ThemeToggle from '@/components/ThemeToggle';

export default function EditProduct() {
  const { user } = useAuth();
  const { products, editProduct } = useProducts();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        router.push('/products');
      }
    }
  }, [user, id, products, router]);

  if (!user || !product) {
    return <div>Loading...</div>;
  }

  const handleSave = (productData: Omit<Product, 'id'>) => {
    editProduct(id, productData);
    router.push('/products');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ProductForm product={product} onSave={handleSave} />
          </div>
        </div>
      </main>
    </div>
  );
}
