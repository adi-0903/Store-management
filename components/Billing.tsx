'use client'

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { Product, mockProducts } from '@/lib/products';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Icons
const Icons = {
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  products: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  analytics: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  billing: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  logout: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  plus: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  minus: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>,
  trash: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  print: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
  search: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  user: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  phone: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  mail: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
};

interface CartItem {
  product: Product;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Bill History Component
function BillHistory({ billHistory, onPrintBill, onClearHistory }: { 
  billHistory: any[]; 
  onPrintBill: (bill: any) => void;
  onClearHistory: () => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (billHistory.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-12 shadow-lg border border-slate-200/50 dark:border-slate-700/50 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Bill History</h3>
        <p className="text-slate-500 dark:text-slate-400">You haven't processed any bills yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bill History</h2>
          {billHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Clear History
            </button>
          )}
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {billHistory.map((bill) => (
            <div key={bill.id} className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Bill #{bill.id}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(bill.date)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onPrintBill(bill)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    title="Print Bill"
                  >
                    {Icons.print}
                  </button>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                      ${bill.total.toFixed(2)}
                    </p>
                    <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                      Paid
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Customer Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Name:</span>
                    <span className="ml-2 text-slate-900 dark:text-white">{bill.customer.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Email:</span>
                    <span className="ml-2 text-slate-900 dark:text-white">{bill.customer.email}</span>
                  </div>
                  {bill.customer.phone && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                      <span className="ml-2 text-slate-900 dark:text-white">{bill.customer.phone}</span>
                    </div>
                  )}
                  {bill.customer.address && (
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Address:</span>
                      <span className="ml-2 text-slate-900 dark:text-white">{bill.customer.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">Items Purchased</h4>
                <div className="space-y-2">
                  {bill.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-sm bg-white/30 dark:bg-slate-600/30 rounded-lg p-2">
                      <div>
                        <span className="font-medium text-slate-900 dark:text-white">{item.product.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Subtotal:</span>
                  <span className="font-medium">${bill.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Tax (8%):</span>
                  <span className="font-medium">${bill.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-slate-900 dark:text-white">Total:</span>
                  <span className="text-pink-600 dark:text-pink-400">${bill.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Billing() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Customer state
  const [customer, setCustomer] = useState<Customer>({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Billing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [billHistory, setBillHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load bill history from localStorage on component mount
  useEffect(() => {
    const savedBills = localStorage.getItem(`billHistory_${user?.email}`);
    if (savedBills) {
      try {
        setBillHistory(JSON.parse(savedBills));
      } catch (error) {
        console.error('Error loading bill history:', error);
      }
    }
  }, [user]);

  // Save bill history to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      if (billHistory.length > 0) {
        localStorage.setItem(`billHistory_${user.email}`, JSON.stringify(billHistory));
      } else {
        // Clear localStorage if no bills
        localStorage.removeItem(`billHistory_${user.email}`);
      }
    }
  }, [billHistory, user]);

  // Function to clear all bill history
  const clearBillHistory = () => {
    if (window.confirm('Are you sure you want to clear all bill history? This action cannot be undone.')) {
      setBillHistory([]);
      if (user) {
        localStorage.removeItem(`billHistory_${user.email}`);
      }
    }
  };

  // PDF generation function
  const generatePDF = async (bill: any) => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      
      // Set fonts
      pdf.setFont('helvetica');
      
      // Function to add header
      const addHeader = () => {
        pdf.setFontSize(24);
        pdf.setTextColor(147, 51, 234);
        pdf.text('SLOOZE STORE', pageWidth / 2, 25, { align: 'center' });
        
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text('Premium Grocery & Essentials', pageWidth / 2, 33, { align: 'center' });
        
        pdf.setFontSize(9);
        pdf.text('12/3, MG Road, Koramangala', pageWidth / 2, 39, { align: 'center' });
        pdf.text('Bangalore, Karnataka 560034', pageWidth / 2, 44, { align: 'center' });
        pdf.text('Phone: +91 80 1234 5678', pageWidth / 2, 49, { align: 'center' });
        pdf.text('Email: info@slooze.com | www.slooze.com', pageWidth / 2, 54, { align: 'center' });
        
        pdf.setDrawColor(200);
        pdf.line(margin, 60, pageWidth - margin, 60);
      };
      
      // Function to add footer on last page
      const addFooter = () => {
        pdf.setFontSize(9);
        pdf.setTextColor(100);
        pdf.setFont('helvetica', 'normal');
        
        const footerY = pageHeight - 30;
        pdf.text('Thank you for shopping at Slooze Store!', pageWidth / 2, footerY, { align: 'center' });
        pdf.text('This is a computer-generated bill and does not require signature', pageWidth / 2, footerY + 5, { align: 'center' });
        pdf.text('For any queries, please contact our customer service: +91 1800-123-4567', pageWidth / 2, footerY + 10, { align: 'center' });
      };
      
      // Function to add PAID watermark
      const addPaidWatermark = () => {
        pdf.saveGraphicsState();
        pdf.setGState(pdf.GState({ opacity: 0.3 }));
        pdf.setTextColor(0, 200, 0);
        pdf.setFontSize(80);
        pdf.setFont('helvetica', 'bold');
        pdf.text('PAID', pageWidth / 2, pageHeight / 2 + 30, { 
          align: 'center', 
          angle: 45 
        });
        pdf.restoreGraphicsState();
      };
      
      // Start first page
      addHeader();
      addPaidWatermark();
      
      // Bill details section
      pdf.setFontSize(12);
      pdf.setTextColor(0);
      pdf.text('BILL RECEIPT', margin, 75);
      
      pdf.setFontSize(10);
      pdf.text(`Bill Number: #${bill.id}`, margin, 85);
      pdf.text(`Date: ${new Date(bill.date).toLocaleDateString()}`, margin, 92);
      pdf.text(`Time: ${new Date(bill.date).toLocaleTimeString()}`, margin, 99);
      pdf.text(`Cashier: ${user?.email}`, margin, 106);
      
      // Customer details box
      pdf.setDrawColor(150);
      pdf.rect(margin, 115, pageWidth - 40, 40);
      pdf.setFontSize(11);
      pdf.setTextColor(50);
      pdf.text('CUSTOMER DETAILS', margin + 5, 125);
      pdf.setFontSize(9);
      pdf.setTextColor(80);
      pdf.text(`Name: ${bill.customer.name}`, margin + 5, 135);
      pdf.text(`Email: ${bill.customer.email}`, margin + 5, 142);
      if (bill.customer.phone) {
        pdf.text(`Phone: ${bill.customer.phone}`, margin + 5, 149);
      }
      if (bill.customer.address) {
        pdf.text(`Address: ${bill.customer.address}`, margin + 5, 156);
      }
      
      // Items header
      pdf.setFontSize(11);
      pdf.setTextColor(50);
      pdf.text('ITEMS PURCHASED', margin, 175);
      
      // Table headers
      pdf.setDrawColor(200);
      pdf.line(margin, 180, pageWidth - margin, 180);
      pdf.setFontSize(9);
      pdf.setTextColor(60);
      pdf.text('S.No', 25, 187);
      pdf.text('Description', 45, 187);
      pdf.text('Qty', 110, 187);
      pdf.text('Price', 130, 187);
      pdf.text('Amount', 155, 187);
      pdf.line(margin, 190, pageWidth - margin, 190);
      
      // Items list with pagination
      let yPosition = 197;
      const lineHeight = 8;
      const pageBreakThreshold = pageHeight - 80; // Leave space for summary and footer
      
      bill.items.forEach((item: any, index: number) => {
        const itemTotal = (item.product.price * item.quantity).toFixed(2);
        
        // Check if we need a new page
        if (yPosition > pageBreakThreshold) {
          // Add new page
          pdf.addPage();
          addHeader();
          addPaidWatermark();
          
          // Continue table headers on new page
          pdf.setDrawColor(200);
          pdf.line(margin, 75, pageWidth - margin, 75);
          pdf.setFontSize(9);
          pdf.setTextColor(60);
          pdf.text('S.No', 25, 82);
          pdf.text('Description', 45, 82);
          pdf.text('Qty', 110, 82);
          pdf.text('Price', 130, 82);
          pdf.text('Amount', 155, 82);
          pdf.line(margin, 85, pageWidth - margin, 85);
          
          yPosition = 92;
        }
        
        pdf.setFontSize(8);
        pdf.setTextColor(80);
        pdf.text(`${index + 1}`, 25, yPosition);
        pdf.text(item.product.name.substring(0, 35), 45, yPosition); // Limit name length
        pdf.text(item.quantity.toString(), 110, yPosition);
        pdf.text(`$${item.product.price.toFixed(2)}`, 130, yPosition);
        pdf.text(`$${itemTotal}`, 155, yPosition);
        yPosition += lineHeight;
      });
      
      // Bottom line for items
      pdf.setDrawColor(200);
      pdf.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
      
      // Check if we need a new page for summary
      if (yPosition + 60 > pageHeight - 40) {
        pdf.addPage();
        addHeader();
        addPaidWatermark();
        yPosition = 75;
      }
      
      // Summary section
      const summaryY = yPosition + 15;
      
      // Right-aligned summary
      pdf.setFontSize(10);
      pdf.setTextColor(60);
      pdf.text('Subtotal:', 130, summaryY);
      pdf.text(`$${bill.subtotal.toFixed(2)}`, 170, summaryY, { align: 'right' });
      
      pdf.text('Tax (8%):', 130, summaryY + 8);
      pdf.text(`$${bill.tax.toFixed(2)}`, 170, summaryY + 8, { align: 'right' });
      
      // Total box
      pdf.setDrawColor(100);
      pdf.rect(125, summaryY + 12, 60, 22);
      pdf.setFontSize(10);
      pdf.setTextColor(147, 51, 234);
      pdf.setFont('helvetica', 'normal');
      pdf.text('TOTAL AMOUNT', 130, summaryY + 22);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0);
      pdf.text(`$${bill.total.toFixed(2)}`, 170, summaryY + 28, { align: 'right' });
      
      // Add footer on the last page
      addFooter();
      
      // Save the PDF
      pdf.save(`Bill_${bill.id}_${bill.customer.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  useEffect(() => {
    setMounted(true);
    if (!user) router.push('/login');
  }, [user, router]);

  // Filter products for search
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Group products by category for better organization
  const productsByCategory = useMemo(() => {
    const grouped: { [key: string]: Product[] } = {};
    filteredProducts.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  }, [filteredProducts]);

  // Calculate totals
  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [cart]);

  // Add to cart
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  // Update quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // Process payment
  const processPayment = async () => {
    if (!customer.name || !customer.email || cart.length === 0) {
      alert('Please fill customer details and add items to cart');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create bill record
    const bill = {
      id: Date.now().toString(),
      customer: { ...customer },
      items: [...cart],
      subtotal,
      tax,
      total,
      date: new Date().toISOString(),
      cashier: user?.email,
    };
    
    setBillHistory(prev => [bill, ...prev]);
    
    // Reset form
    setCustomer({ id: '', name: '', email: '', phone: '', address: '' });
    setCart([]);
    setIsProcessing(false);
    
    alert('Payment processed successfully!');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/20 to-purple-50/20 dark:from-slate-900 dark:via-pink-900/20 dark:to-purple-900/20 flex">
      {/* Static Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50">
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-center border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <img src="/FFFFFF-1.png" alt="Slooze" className="w-6 h-auto" />
            </div>
          </div>
          <nav className="flex-1 py-6 px-3 space-y-1">
            {[
              { id: 'products', icon: Icons.products },
              { id: 'billing', icon: Icons.billing },
              { id: 'settings', icon: Icons.settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'products') router.push('/products');
                  else if (item.id === 'settings') router.push('/settings');
                }}
                className={`w-full flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                  item.id === 'billing'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30 scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 hover:scale-105'
                }`}
              >
                {item.icon}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center p-3 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-300 hover:scale-105"
            >
              {Icons.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20">
        <div className="h-full flex flex-col">
          {/* Header */}
          <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Billing System</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Customer billing and payment processing</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                  >
                    {showHistory ? 'New Bill' : 'Bill History'}
                  </button>
                  <ThemeToggle />
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Cashier: {user?.email}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 px-6 py-6 overflow-auto">
            {showHistory ? (
              <BillHistory 
                billHistory={billHistory} 
                onPrintBill={generatePDF}
                onClearHistory={clearBillHistory}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Details & Products */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Customer Information */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                      {Icons.user}
                      <span className="ml-2">Customer Information</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name *</label>
                        <input
                          type="text"
                          value={customer.name}
                          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                          className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                          placeholder="Customer name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                        <input
                          type="email"
                          value={customer.email}
                          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                          className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                          placeholder="customer@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                          placeholder="+1 234-567-8900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                        <input
                          type="text"
                          value={customer.address}
                          onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                          className="w-full px-3 py-2 bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                          placeholder="Customer address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Products</h2>
                      <div className="relative w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                          placeholder="Search products..."
                        />
                      </div>
                    </div>
                    <div className="space-y-6 max-h-96 overflow-y-auto">
                      {Object.entries(productsByCategory).map(([category, products]) => (
                        <div key={category}>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 sticky top-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl py-2">
                            {category}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.map((product) => {
                              const cartItem = cart.find(item => item.product.id === product.id);
                              const isInCart = !!cartItem;
                              
                              return (
                                <div key={product.id} className="bg-white/50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h4 className="font-medium text-slate-900 dark:text-white text-sm">{product.name}</h4>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">{product.description}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold text-pink-600 dark:text-pink-400">${product.price}</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400">Stock: {product.stock}</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => addToCart(product)}
                                    disabled={isInCart || product.stock === 0}
                                    className={`w-full py-2 rounded-lg font-medium transition-all ${
                                      isInCart
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : product.stock === 0
                                        ? 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
                                        : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg hover:shadow-pink-500/30'
                                    }`}
                                  >
                                    {isInCart ? 'In Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cart & Payment */}
                <div className="space-y-6">
                  {/* Shopping Cart */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Shopping Cart</h2>
                    {cart.length === 0 ? (
                      <p className="text-slate-500 dark:text-slate-400 text-center py-8">Cart is empty</p>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {cart.map((item) => (
                          <div key={item.product.id} className="bg-white/50 dark:bg-slate-700/50 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-900 dark:text-white text-sm">{item.product.name}</h4>
                                <p className="text-pink-600 dark:text-pink-400 font-semibold">${item.product.price}</p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                {Icons.trash}
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1 rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500"
                                >
                                  {Icons.minus}
                                </button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1 rounded bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500"
                                >
                                  {Icons.plus}
                                </button>
                              </div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Order Summary</h2>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Tax (8%)</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-slate-900 dark:text-white">Total</span>
                          <span className="text-lg font-bold text-pink-600 dark:text-pink-400">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={processPayment}
                      disabled={isProcessing || cart.length === 0 || !customer.name || !customer.email}
                      className="w-full mt-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isProcessing ? 'Processing...' : 'Process Payment'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
