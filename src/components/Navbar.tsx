import React from 'react';
import { useAuth } from './AuthProvider';
import { LogOut, User, LayoutDashboard, Briefcase, Building2, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'الوظائف', href: '/jobs' },
    { name: 'الشركات', href: '/companies' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-950/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.location.href = '/'}
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                J
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                JOB
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center gap-6 mr-10">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 font-bold transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <a
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                >
                  <User size={18} />
                  الملف الشخصي
                </a>
                {profile?.role === 'employer' && (
                  <a
                    href="/dashboard/employer"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                  >
                    <LayoutDashboard size={18} />
                    لوحة التحكم
                  </a>
                )}
                <button
                  onClick={signOut}
                  className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a
                  href="/auth"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 transition-colors"
                >
                  تسجيل الدخول
                </a>
                <a
                  href="/auth?signup=true"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
                >
                  انضم إلينا مجاناً
                </a>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 dark:text-slate-400"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <a
                      href={profile?.role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker'}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
                    >
                      <LayoutDashboard size={18} />
                      لوحة التحكم
                    </a>
                    <button
                      onClick={signOut}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg"
                    >
                      <LogOut size={18} />
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/auth"
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
                    >
                      تسجيل الدخول
                    </a>
                    <a
                      href="/auth?signup=true"
                      className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg"
                    >
                      انضم إلينا مجاناً
                    </a>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
