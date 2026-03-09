import { Link } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Clock, Building2, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  category: string;
  created_at: string;
  status: string;
  description?: string;
}

export const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.RelativeTimeFormat('ar-IQ', { numeric: 'auto' }).format(
      -Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-2xl shrink-0 group-hover:scale-110 transition-transform">
            {job.company.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {job.title}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Building2 size={16} />
                {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={16} />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign size={16} />
                {job.salary}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
            {job.type}
          </span>
          <span className="px-3 py-1 text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full flex items-center gap-1">
            <Clock size={12} />
            {formatDate(job.created_at)}
          </span>
          <Link
            to={`/job/${job.id}`}
            className="flex items-center gap-1 px-5 py-2.5 text-sm font-bold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-700 rounded-xl transition-all"
          >
            التفاصيل
            <ChevronLeft size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export const JobFilterSection: React.FC<{ onFilterChange: (filters: any) => void }> = ({ onFilterChange }) => {
  const categories = ['تكنولوجيا', 'هندسة', 'طب وصحة', 'مبيعات', 'إدارة ومحاسبة', 'خدمات لوجستية', 'أخرى'];
  const types = ['دوام كامل', 'جزئي', 'عن بعد', 'عقد', 'تدريب'];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">التصنيف الوظيفي</label>
          <select 
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <option value="">الكل</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">نوع الدوام</label>
          <select 
            onChange={(e) => onFilterChange({ type: e.target.value })}
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <option value="">الكل</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">الراتب المتوقع</label>
          <select 
            onChange={(e) => onFilterChange({ salary: e.target.value })}
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <option value="">الكل</option>
            <option value="500-1000">500,000 - 1,000,000 د.ع</option>
            <option value="1000-2000">1,000,000 - 2,000,000 د.ع</option>
            <option value="2000+">أكثر من 2,000,000 د.ع</option>
          </select>
        </div>
      </div>
    </div>
  );
};
