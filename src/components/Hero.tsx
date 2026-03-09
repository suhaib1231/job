import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, animate } from 'motion/react';
import { Briefcase, Building2, Users, CheckCircle2 } from 'lucide-react';

const AnimatedCounter = ({ value, label, icon: Icon }: { value: number; label: string; icon: any }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (latest) => setCount(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
    >
      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 mb-4">
        <Icon size={28} />
      </div>
      <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
        {count}+
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
        {label}
      </div>
    </motion.div>
  );
};

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-400/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-violet-400/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-bold mb-8 border border-indigo-100 dark:border-indigo-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            🚀 JOB - منصة التوظيف العراقية الأولى
          </span>
          
          <h1 className="text-5xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 leading-[0.9]">
            مستقبلك يبدأ <br />
            <span className="text-indigo-600">مع JOB</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
            تصفح آلاف الوظائف المتاحة في العراق وتواصل مع أفضل الشركات مباشرة. 
            <span className="block mt-2 font-bold text-indigo-600 dark:text-indigo-400">
              عمولة 10% من أول راتب فقط بعد التوظيف.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/jobs"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Briefcase size={20} />
              تصفح الوظائف
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/auth?signup=true&role=employer"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Building2 size={20} />
              نشر وظيفة (للشركات)
            </motion.a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <AnimatedCounter value={1250} label="وظيفة نشطة" icon={Briefcase} />
            <AnimatedCounter value={450} label="شركة مسجلة" icon={Building2} />
            <AnimatedCounter value={8900} label="باحث عن عمل" icon={Users} />
            <AnimatedCounter value={100} label="التسجيل مجاني" icon={CheckCircle2} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
