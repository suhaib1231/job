import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, isMockMode } from '../lib/supabase';
import { Job } from './JobComponents';
import { MapPin, Briefcase, Calendar, DollarSign, Building2, ChevronRight, Send, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthProvider';

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    if (isMockMode) {
      // Mock data for details
      const mockJobs: Record<string, Job> = {
        '1': {
          id: '1',
          title: 'مطور واجهات أمامية (React)',
          company: 'شركة التقنية العراقية',
          location: 'بغداد، المنصور',
          salary: '1,500,000 د.ع',
          type: 'دوام كامل',
          category: 'تكنولوجيا',
          created_at: new Date().toISOString(),
          status: 'active',
          description: `نحن نبحث عن مطور واجهات أمامية محترف للانضمام إلى فريقنا المتنامي. ستكون مسؤولاً عن بناء واجهات مستخدم تفاعلية وسلسة باستخدام React و Tailwind CSS.

المتطلبات:
- خبرة لا تقل عن سنتين في React.js.
- إتقان HTML5, CSS3, و JavaScript (ES6+).
- خبرة في التعامل مع APIs و State Management.
- القدرة على العمل ضمن فريق والالتزام بالمواعيد.`
        },
        '2': {
          id: '2',
          title: 'مهندس مدني',
          company: 'مجموعة البناء الحديثة',
          location: 'البصرة، حي الجزائر',
          salary: '2,000,000 د.ع',
          type: 'عقد',
          category: 'هندسة',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'active',
          description: 'مطلوب مهندس مدني بخبرة في الإشراف على المشاريع السكنية.'
        }
      };
      setJob(mockJobs[id || ''] || mockJobs['1']);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('فشل في تحميل تفاصيل الوظيفة');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('يرجى تسجيل الدخول للتقديم على الوظيفة');
      navigate('/auth');
      return;
    }

    setApplying(true);
    try {
      if (!isMockMode) {
        const { error } = await supabase
          .from('applications')
          .insert({
            job_id: id,
            user_id: user.id,
            cover_letter: coverLetter,
            status: 'pending'
          });
        if (error) throw error;
      }
      
      toast.success('تم إرسال طلبك بنجاح!');
      setShowApplyModal(false);
    } catch (error) {
      toast.error('فشل في إرسال الطلب');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">الوظيفة غير موجودة</h2>
        <button onClick={() => navigate('/')} className="text-indigo-600 font-bold">العودة للرئيسية</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-32 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors mb-8 text-sm font-bold"
          >
            <ChevronRight size={20} />
            العودة للبحث
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">
                <Briefcase size={14} />
                {job.category}
              </div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-indigo-500" />
                  <span className="font-bold">{job.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-indigo-500" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-indigo-500" />
                  <span>نُشر في {new Date(job.created_at).toLocaleDateString('ar-IQ')}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowApplyModal(true)}
              className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-1"
            >
              قدّم على هذه الوظيفة
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">وصف الوظيفة</h2>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {job.description || 'لا يوجد وصف متاح لهذه الوظيفة حالياً.'}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6">ملخص الوظيفة</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-indigo-600">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">الراتب المتوقع</p>
                    <p className="font-bold text-slate-900 dark:text-white">{job.salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-indigo-600">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">نوع الدوام</p>
                    <p className="font-bold text-slate-900 dark:text-white">{job.type}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-200 dark:shadow-none">
              <h3 className="font-bold text-xl mb-4">هل لديك استفسار؟</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                يمكنك التواصل مع فريق الدعم الفني للمنصة في حال واجهتك أي مشكلة أثناء التقديم.
              </p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-all">
                تواصل معنا
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">التقديم على الوظيفة</h2>
                  <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600">
                    <CheckCircle2 size={24} className="rotate-45" />
                  </button>
                </div>

                <form onSubmit={handleApply} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      رسالة تعريفية (اختياري)
                    </label>
                    <textarea
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="لماذا تعتقد أنك الشخص المناسب لهذه الوظيفة؟"
                      rows={5}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                    />
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl">
                    <div className="flex gap-3">
                      <FileText className="text-amber-600 shrink-0" size={20} />
                      <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                        سيتم إرسال ملف سيرتك الذاتية المرفوع في ملفك الشخصي تلقائياً مع هذا الطلب. تأكد من تحديثه قبل التقديم.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowApplyModal(false)}
                      className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={applying}
                      className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all disabled:opacity-50"
                    >
                      {applying ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          <Send size={20} />
                          إرسال الطلب
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
