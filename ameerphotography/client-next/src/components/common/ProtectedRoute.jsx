"use client";
import { usePathname } from 'next/navigation';
import { redirect } from 'next/navigation';

import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Admin routes → redirect to admin login
  if (!isAuthenticated && allowedRoles.includes('admin')) {
    return <redirect href="/admin/login" replace />;
  }

  // Non-admin protected routes → redirect to admin login (no public login anymore)
  if (!isAuthenticated) {
    return <redirect href="/admin/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    const redirectPath = user?.role === 'admin' ? '/admin' : '/';
    return <redirect href={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
