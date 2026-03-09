import React, { useState } from 'react';
import { supabase, isMockMode } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { motion } from 'motion/react';
import { Mail, Lock, User, Building2, Loader2, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'seeker' | 'employer'>('seeker');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    console.log('Auth attempt:', isSignUp ? 'Signup' : 'Login', formData.email);

    try {
      if (isSignUp) {
        // 1. Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              role: role
            }
          }
        });

        if (error) throw error;
        
        if (data.user) {
          // 2. Create Profile
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: formData.fullName,
            role: role,
            created_at: new Date().toISOString()
          });
          
          if (profileError) {
            console.error('Profile error:', profileError);
            toast.error('تم إنشاء الحساب، ولكن فشل تحديث البيانات الشخصية. تأكد من إعدادات قاعدة البيانات.');
          }
        }

        toast.success('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        setIsSignUp(false);
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;
        
        if (data.session) {
          toast.success('تم تسجيل الدخول بنجاح');
          window.location.href = '/';
        } else {
          toast.error('يرجى تفعيل الحساب من بريدك الإلكتروني أولاً.');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden"
      >
        {/* Connection Status Badge */}
        <div className={`absolute top-0 left-0 right-0 py-1 px-4 text-[10px] font-bold text-center uppercase tracking-widest ${isMockMode ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {isMockMode ? (
            <span className="flex items-center justify-center gap-1">
              <AlertCircle size={10} /> وضع التجربة (غير متصل بـ Supabase)
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1">
              <CheckCircle size={10} /> متصل بـ Supabase
            </span>
          )}
        </div>

        <div className="text-center mb-8 mt-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
            J
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {isSignUp ? 'إنشاء حساب جديد' : 'مرحباً بك مجدداً'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isSignUp ? 'انضم إلى أكبر منصة توظيف في العراق' : 'سجل دخولك لمتابعة رحلتك المهنية'}
          </p>
        </div>

        {isSignUp && (
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
            <button
              onClick={() => setRole('seeker')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all ${
                role === 'seeker' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'
              }`}
            >
              <User size={18} />
              باحث عن عمل
            </button>
            <button
              onClick={() => setRole('employer')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all ${
                role === 'employer' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'
              }`}
            >
              <Building2 size={18} />
              صاحب عمل
            </button>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="الاسم الثلاثي"
                  className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-right"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@mail.com"
                className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-right"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pr-10 pl-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-right"
                dir="ltr"
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ArrowRight size={20} className="rotate-180" />}
            {isSignUp ? 'إنشاء الحساب' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isSignUp ? 'لديك حساب بالفعل؟ سجل دخولك' : 'ليس لديك حساب؟ انضم إلينا'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
