import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); // Giriş mi, Kayıt mı modu
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      navigate('/');
    } catch (err) {
      if (!isLogin) {
        setError('Kayıt başarısız. Şifre en az 6 karakter olmalı veya bu e-posta zaten kullanılıyor.');
      } else {
        setError('Giriş başarısız. Hesabın olduğundan veya şifrenin doğruluğundan emin ol.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Google ile işlem başarısız oldu. Firebase yetkili alan adlarını (Authorized domains) kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-sage/20 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="bg-sage/20 p-4 rounded-full text-sage">
            <Leaf size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-olive text-center mb-6">Orman Anıları</h2>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-olive mb-1">E-posta</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-olive/50" size={18} />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2 border border-sage/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 bg-cream/30 text-olive"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-olive mb-1">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-olive/50" size={18} />
              <input
                type="password"
                required
                minLength="6"
                className="w-full pl-10 pr-4 py-2 border border-sage/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 bg-cream/30 text-olive"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-sage hover:bg-sage/90 text-white font-medium py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2 mt-2 shadow-sm"
          >
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-sage hover:text-olive transition-colors font-medium"
          >
            {isLogin ? "Hesabın yok mu? Kayıt Ol" : "Zaten hesabın var mı? Giriş Yap"}
          </button>
        </div>

        <div className="mt-6 border-t border-sage/20 pt-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-sage/30 hover:bg-sage/10 text-olive font-medium py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google ile Giriş / Kayıt
          </button>
        </div>
      </div>
    </div>
  );
}