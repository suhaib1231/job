import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { supabase, isMockMode } from '../lib/supabase';
import { User, FileText, Upload, CheckCircle2, Loader2, Mail, User as UserIcon, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';

export const UserProfile: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
    }
  }, [profile]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (isMockMode) {
      setUploading(true);
      setTimeout(() => {
        setUploading(false);
        toast.success('تم رفع السيرة الذاتية بنجاح (وضع التجربة)');
      }, 1500);
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `cvs/${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cvs')
        .getPublicUrl(filePath);

      // 3. Update Profile in Database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ cv_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('تم تحديث السيرة الذاتية بنجاح');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('فشل في رفع الملف: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (isMockMode) {
      setUpdating(true);
      setTimeout(() => {
        setUpdating(false);
        toast.success('تم تحديث البيانات بنجاح (وضع التجربة)');
      }, 1000);
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('تم تحديث الملف الشخصي');
    } catch (error: any) {
      toast.error('فشل التحديث: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">يرجى تسجيل الدخول</h2>
        <a href="/auth" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">تسجيل الدخول</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">الملف الشخصي</h1>
            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold">
              {profile?.role === 'employer' ? 'صاحب عمل' : 'باحث عن عمل'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Basic Info */}
            <div className="md:col-span-2 space-y-6">
              <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <UserIcon size={20} className="text-indigo-600" />
                  المعلومات الأساسية
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الاسم الكامل</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">البريد الإلكتروني</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500">
                      <Mail size={18} />
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {updating && <Loader2 className="animate-spin" size={18} />}
                    حفظ التغييرات
                  </button>
                </form>
              </section>

              {profile?.role === 'seeker' && (
                <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <FileText size={20} className="text-indigo-600" />
                    السيرة الذاتية (CV)
                  </h2>
                  <div className="space-y-6">
                    <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-indigo-500 transition-all">
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                        <Upload size={32} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-slate-900 dark:text-white">ارفع ملف السيرة الذاتية</p>
                        <p className="text-sm text-slate-500">PDF أو Word (بحد أقصى 5MB)</p>
                      </div>
                      <label className="cursor-pointer px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
                        {uploading ? <Loader2 className="animate-spin" size={20} /> : 'اختر ملف'}
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} disabled={uploading} />
                      </label>
                    </div>

                    {profile.cv_url && (
                      <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="text-emerald-600" size={20} />
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">تم رفع السيرة الذاتية</span>
                        </div>
                        <a 
                          href={profile.cv_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-sm font-bold text-indigo-600 hover:underline"
                        >
                          عرض الملف
                        </a>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Stats/Quick Links */}
            <div className="space-y-6">
              <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200 dark:shadow-none">
                <h3 className="font-bold text-xl mb-4">حالة الحساب</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-80">تاريخ الانضمام</span>
                    <span className="font-bold">{new Date(user.created_at).toLocaleDateString('ar-IQ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-80">اكتمال الملف</span>
                    <span className="font-bold">{profile?.cv_url ? '100%' : '60%'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">روابط سريعة</h3>
                <div className="space-y-2">
                  <a href="/" className="flex items-center gap-2 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-600 dark:text-slate-400 font-bold">
                    <Briefcase size={18} />
                    تصفح الوظائف
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
