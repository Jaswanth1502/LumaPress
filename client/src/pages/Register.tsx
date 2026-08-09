import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { Feather, Eye, EyeOff, UserPlus, Mail, User, Lock } from 'lucide-react';

const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .email('Invalid email address')
      .regex(strictEmailRegex, 'Please enter a valid email address with a domain (e.g. user@domain.com)'),
    password: z.string().min(1, 'Password is required'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    try {
      await registerAuth(data);
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8 glass-card p-8 rounded-3xl border border-emerald-200/80 shadow-xl bg-white/90">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 mb-2 border border-emerald-200/60">
            <Feather className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-slate-900">Create Author Account</h2>
          <p className="text-sm text-slate-500">Publish articles and join the LumaPress editorial platform</p>
        </div>

        {serverError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-red-500" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="w-5 h-5 absolute left-3.5 text-slate-400" />
              <input
                type="text"
                {...register('name')}
                placeholder="John Doe"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
                  errors.name
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                    : 'border-slate-200 focus:ring-2 focus:ring-emerald-700'
                }`}
              />
            </div>
            {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 absolute left-3.5 text-slate-400" />
              <input
                type="email"
                {...register('email')}
                placeholder="author@example.com"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
                  errors.email
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                    : 'border-slate-200 focus:ring-2 focus:ring-emerald-700'
                }`}
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 absolute left-3.5 text-slate-400" />
              <input
                type="password"
                {...register('password')}
                placeholder="Minimum 8 characters"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
                  errors.password
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                    : 'border-slate-200 focus:ring-2 focus:ring-emerald-700'
                }`}
              />
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 absolute left-3.5 text-slate-400" />
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="Re-enter password"
                className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm bg-slate-50/50 focus:bg-white focus:outline-none transition-all ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500'
                    : 'border-slate-200 focus:ring-2 focus:ring-emerald-700'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#0d5c3a] hover:bg-[#0b4d30] active:bg-emerald-900 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            {isSubmitting ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account & Join</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-sm text-slate-600">
          Already have an author account?{' '}
          <Link to="/login" className="font-semibold text-emerald-800 hover:underline">
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
