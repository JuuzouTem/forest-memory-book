import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, LogIn, UserPlus, User } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Yeni: İsim
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginWithEmail, registerWithEmail, loginWithGoogle, updateUsername } = useAuth();
  const navigate = useNavigate();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        const userCred = await registerWithEmail(email, password);
        // Kayıt olan kullanıcının ismini hemen atıyoruz
        if (username.trim()) {
          await updateUsername(username.trim());
        }
      }
      navigate('/');
    } catch (err) {
      setError(isLogin ? 'Giriş başarısız. Bilgilerinizi kontrol edin.' : 'Kayıt başarısız. Şifre en az 6 karakter olmalı.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(''); setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Google ile işlem başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-sage/20 w-full max-w-sm">
        <div className="flex justify-center mb-6"><div className="bg-sage/20 p-4 rounded-full text-sage"><Leaf size={32} /></div></div>
        <h2 className="text-2xl font-bold text-olive text-center mb-6">Orman Anıları</h2>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {/* Sadece kayıt modunda İsmi Sor */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-olive mb-1">Kullanıcı Adı</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-olive/50" size={18} />
                <input type="text" required className="w-full pl-10 pr-4 py-2 border border-sage/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 bg-cream/30 text-olive" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-olive mb-1">E-posta</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-olive/50" size={18} />
              <input type="email" required className="w-full pl-10 pr-4 py-2 border border-sage/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 bg-cream/30 text-olive" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-olive mb-1">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-olive/50" size={18} />
              <input type="password" required minLength="6" className="w-full pl-10 pr-4 py-2 border border-sage/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 bg-cream/30 text-olive" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <button disabled={loading} type="submit" className="w-full bg-sage hover:bg-sage/90 text-white font-medium py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2 mt-2 shadow-sm">
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />} {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-sage hover:text-olive transition-colors font-medium">
            {isLogin ? "Hesabın yok mu? Kayıt Ol" : "Zaten hesabın var mı? Giriş Yap"}
          </button>
        </div>
        <div className="mt-6 border-t border-sage/20 pt-6">
          <button onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white border border-sage/30 hover:bg-sage/10 text-olive font-medium py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2">
            Google ile Giriş / Kayıt
          </button>
        </div>
      </div>
    </div>
  );
}