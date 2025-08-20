"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

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
    </div>
  );
}