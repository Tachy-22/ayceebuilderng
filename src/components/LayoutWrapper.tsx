"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className="overflow-x-hidden">
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <FloatingWhatsApp />}
    </div>
  );
}