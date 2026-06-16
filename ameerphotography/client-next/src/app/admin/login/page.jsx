"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const AdminLogin = () => {
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  // Already logged in as admin → go to dashboard
  if (isAuthenticated && user?.role === 'admin') {
    redirect('/admin');
  }

  // Logged in as non-admin → back to home
  if (isAuthenticated && user?.role !== 'admin') {
    redirect('/');
  }

  const onSubmit = async (data) => {
    const success = await login(data.email, data.password);
    if (success) {
      // navigate happens via the Navigate redirect above once auth state updates
    } else {
      toast.error('Invalid credentials. Admin access only.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Lock size={20} className="text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-heading tracking-tight text-gray-800 mb-2">Admin Portal</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-bold">Ameer Photography</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 p-10 md:p-12 rounded-2xl shadow-lg backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-600">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-light text-gray-800 placeholder:text-gray-400"
              />
              {errors.email && (
                <p className="text-red-400/80 text-[10px] uppercase tracking-wider mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-600">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-transparent border-b border-gray-300 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-light text-gray-800 placeholder:text-gray-400"
              />
              {errors.password && (
                <p className="text-red-400/80 text-[10px] uppercase tracking-wider mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-4 rounded-full uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-primary/90 transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>

        {/* Back link */}
        <p className="text-center mt-8">
          <a
            href="/"
            className="text-[10px] uppercase tracking-widest text-gray-600 hover:text-primary transition-colors"
          >
            ← Back to website
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
