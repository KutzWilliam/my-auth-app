'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { UserNav } from '../components/UserNav';
import Link from 'next/link';

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
    <div className="min-h-screen flex flex-col">
      <header className="bg-background border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="text-lg font-semibold">
            Meu Painel
          </Link>
          <UserNav />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {children}
      </main>
      <footer className="text-center p-4 border-t text-sm text-muted-foreground">
        © {new Date().getFullYear()} Minha Empresa
      </footer>
    </div>
  );
}