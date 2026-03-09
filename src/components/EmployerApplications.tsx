import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { supabase, isMockMode } from '../lib/supabase';
import { FileText, Mail, Calendar, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';

interface Application {
  id: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'rejected';
  cv_url: string;
  cover_letter: string;
  job: {
    title: string;
    company: string;
  };
  profile: {
    full_name: string;
    email: string;
  };
}

export const EmployerApplications: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMockMode) {
      setApplications([
        {
          id: '1',
          created_at: new Date().toISOString(),
          status: 'pending',
          cv_url: '#',
          cover_letter: 'أنا مهتم جداً بهذه الوظيفة ولدي خبرة 3 سنوات في React.',
          job: { title: 'مطور واجهات أمامية', company: 'شركة التقنية' },
          profile: { full_name: 'أحمد علي', email: 'ahmed@example.com' }
        }
      ]);
      setLoading(false);
      return;
    }
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // In a real app, we'd join jobs and profiles
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          created_at,
          status,
          cv_url,
          cover_letter,
          job:jobs(title, company),
          profile:profiles(full_name, email)
        `)
        .eq('jobs.user_id', user?.id);

      if (error) throw error;
      setApplications(data as any || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Mock data for demo
      setApplications([
        {
          id: '1',
          created_at: new Date().toISOString(),
          status: 'pending',
          cv_url: '#',
          cover_letter: 'أنا مهتم جداً بهذه الوظيفة ولدي خبرة 3 سنوات في React.',
          job: { title: 'مطور واجهات أمامية', company: 'شركة التقنية' },
          profile: { full_name: 'أحمد علي', email: 'ahmed@example.com' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      toast.success(status === 'accepted' ? 'تم القبول المبدئي' : 'تم رفض الطلب');
      fetchApplications();
    } catch (error) {
      toast.error('فشل في تحديث الحالة');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-medium">جاري تحميل طلبات التقديم...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">طلبات التقديم المستلمة</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {applications.length > 0 ? (
          applications.map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{app.profile.full_name}</h3>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{app.job.title}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      {app.profile.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {new Date(app.created_at).toLocaleDateString('ar-IQ')}
                    </div>
                  </div>

                  {app.cover_letter && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {app.cover_letter}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-3 shrink-0">
                  <a
                    href={app.cv_url}
                    target="_blank"
                    className="w-full sm:w-auto lg:w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-all"
                  >
                    <ExternalLink size={18} />
                    عرض السيرة الذاتية
                  </a>
                  
                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={() => updateStatus(app.id, 'accepted')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all"
                    >
                      <CheckCircle size={18} />
                      قبول
                    </button>
                    <button
                      onClick={() => updateStatus(app.id, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-all"
                    >
                      <XCircle size={18} />
                      رفض
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <Mail className="mx-auto text-slate-200 dark:text-slate-800 mb-4" size={48} />
            <p className="text-slate-500 dark:text-slate-400 font-medium">لا توجد طلبات تقديم حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
};
