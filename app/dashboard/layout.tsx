'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { UserNav } from '../components/UserNav';
import { EmailProvider } from '../contexts/EmailContext';
import Link from 'next/link';
import { SidebarNav } from './components/SidebarNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, user, isLoading, fetchUserData } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/login');
    } else if (token && !user) {
      fetchUserData();
    }
  }, [token, user, isLoading, router, fetchUserData]);

  if (isLoading || (!token && typeof window !== 'undefined')) {
    return <div className="flex items-center justify-center min-h-screen">Carregando dashboard...</div>;
  }

  if (!token) {
    return null;
  }

  return (
    <EmailProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Link href="/dashboard" className="text-lg font-semibold">
            Email Service
          </Link>
          <div className="relative ml-auto flex-1 md:grow-0">
          </div>
          <UserNav />
        </header>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <SidebarNav />
          </aside>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
          </main>
        </div>
      </div>
    </EmailProvider>
  );
}