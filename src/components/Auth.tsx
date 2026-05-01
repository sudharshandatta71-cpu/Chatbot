import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

interface AuthProps {
  onLogin: (token: string, user: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const body = isLogin 
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (isLogin) {
        onLogin(data.token, data.user);
      } else {
        setIsLogin(true);
        setFormData({ ...formData, password: '', confirmPassword: '' });
        alert('Account created! Please login.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl p-8 rounded-2xl gold-border gold-shadow"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gold-text-gradient mb-2">CAMPUS BUDDY</h1>
          <p className="text-zinc-400">{isLogin ? 'Welcome back, Scholar' : 'Start your journey today'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gold w-5 h-5" />
              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gold w-5 h-5" />
            <input
              type="email"
              placeholder="Gmail Address"
              required
              className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gold w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gold w-5 h-5" />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                {isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {isLogin && (
            <div className="relative flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-zinc-800"></div>
              <span className="text-zinc-500 text-xs font-bold uppercase">OR</span>
              <div className="flex-1 h-px bg-zinc-800"></div>
            </div>
          )}

          {isLogin && (
            <button
              type="button"
              onClick={() => onLogin('guest_token', { id: -1, name: 'Guest User', email: 'guest@campusbuddy.ai', isGuest: true })}
              className="w-full bg-zinc-800 text-gold font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors border border-gold/20"
            >
              GUEST LOGIN
            </button>
          )}
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-400 hover:text-gold transition-colors text-sm"
          >
            {isLogin ? "Don't have an account? Create one" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
