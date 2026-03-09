import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const PostJobForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'دوام كامل',
    category: 'تكنولوجيا',
    contact_whatsapp: '',
    contact_email: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('يجب عليك تسجيل الدخول أولاً');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('jobs').insert([
        {
          ...formData,
          user_id: user.id,
          status: 'pending',
          requirements: [],
          benefits: []
        }
      ]);

      if (error) throw error;

      toast.success('تم إرسال الوظيفة بنجاح! ستظهر بعد مراجعة الإدارة.');
      setFormData({
        title: '',
        company: '',
        location: '',
        salary: '',
        type: 'دوام كامل',
        category: 'تكنولوجيا',
        contact_whatsapp: '',
        contact_email: '',
        description: ''
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('حدث خطأ أثناء نشر الوظيفة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
          <Send size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">نشر وظيفة جديدة</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">أدخل تفاصيل الوظيفة لجذب أفضل المتقدمين</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">المسمى الوظيفي</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: مطور ويب، مهندس مدني..."
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">اسم الشركة</label>
            <input
              required
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="اسم الشركة أو المؤسسة"
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">الموقع (المحافظة/المنطقة)</label>
            <input
              required
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="مثال: بغداد، المنصور"
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">الراتب المتوقع</label>
            <input
              required
              type="text"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="مثال: 1,000,000 د.ع"
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">نوع الدوام</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option>دوام كامل</option>
              <option>جزئي</option>
              <option>عن بعد</option>
              <option>عقد</option>
              <option>تدريب</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">التصنيف</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option>تكنولوجيا</option>
              <option>هندسة</option>
              <option>طب وصحة</option>
              <option>مبيعات</option>
              <option>إدارة ومحاسبة</option>
              <option>خدمات لوجستية</option>
              <option>أخرى</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">رقم الواتساب (للتواصل)</label>
            <input
              required
              type="text"
              value={formData.contact_whatsapp}
              onChange={(e) => setFormData({ ...formData, contact_whatsapp: e.target.value })}
              placeholder="+964..."
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">البريد الإلكتروني</label>
            <input
              required
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              placeholder="example@company.com"
              className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">وصف الوظيفة والمتطلبات</label>
          <textarea
            required
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="اكتب وصفاً مفصلاً للوظيفة والمهارات المطلوبة..."
            className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
          />
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl flex items-start gap-3">
          <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
            أتعهد بدفع عمولة قدرها 10% من أول راتب للموظف الذي يتم اختياره عبر هذه المنصة، وذلك لضمان استمرارية الخدمة وتطويرها.
          </p>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
          نشر الوظيفة الآن
        </button>
      </form>
    </motion.div>
  );
};
