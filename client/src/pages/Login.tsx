import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Eye, EyeOff } from 'lucide-react';

const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .regex(strictEmailRegex, 'Please enter a valid email address with a domain (e.g. user@domain.com)'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err: any) {
      setServerError(err.message || 'Invalid email or password');
    }
  };

  const handleAutoFill = (email: string, password: string) => {
    setValue('email', email, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setValue('password', password, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setServerError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 glass-card p-8 rounded-3xl border border-emerald-200/80 shadow-xl bg-white/95">
        {/* Top Header Icon */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-xs">
            <LogIn className="w-5 h-5 text-emerald-800" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
            Sign in to your LumaPress account to continue reading and writing
          </p>
        </div>

        {/* Demo User Credentials Box */}
        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-3 shadow-xs">
          <span className="text-xs font-semibold text-slate-800 pl-1">
            Demo User Credentials
          </span>
          <button
            type="button"
            onClick={() => handleAutoFill('jane@example.com', 'Author123!')}
            className="px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-white hover:bg-emerald-100/80 border border-emerald-300/80 transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            AUTO-FILL (JANE)
          </button>
        </div>

        {serverError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email / Username */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Username or Email
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="Enter username or email"
              className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50/40 focus:bg-white focus:outline-none transition-all ${
                errors.email
                  ? 'border-rose-300 focus:ring-2 focus:ring-rose-500'
                  : 'border-slate-300 focus:ring-2 focus:ring-emerald-700'
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className={`w-full pl-4 pr-11 py-3 rounded-xl border text-sm bg-slate-50/40 focus:bg-white focus:outline-none transition-all ${
                  errors.password
                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-500'
                    : 'border-slate-300 focus:ring-2 focus:ring-emerald-700'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-rose-600">{errors.password.message}</p>
            )}
          </div>

          {/* Primary LOG IN Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#0d5c3a] hover:bg-[#0b4d30] active:bg-emerald-900 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer border border-emerald-800"
          >
            {isSubmitting ? <span>Logging In...</span> : <span>LOG IN</span>}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-600">
            New here?{' '}
            <Link to="/register" className="font-bold text-emerald-900 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
