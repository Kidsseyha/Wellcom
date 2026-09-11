import { motion } from 'motion/react';
import { LogIn, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  language: 'kh' | 'en';
}

export default function LoginScreen({ onLogin, language }: LoginScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-[#0a0806] to-[#0a0806]"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm mx-4 p-8 rounded-3xl bg-black/40 border border-amber-500/20 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)]">
          <Sparkles className="w-8 h-8 text-amber-950" />
        </div>

        <h1 className="text-2xl font-moul text-amber-300 mb-3">
          {language === 'kh' ? 'ចូលគណនី' : 'Welcome'}
        </h1>
        <p className="text-sm font-khmer text-amber-100/70 mb-8 leading-relaxed">
          {language === 'kh'
            ? 'សូមចូលគណនី Google របស់អ្នកដើម្បីបន្តចូលទៅកាន់លិខិតអញ្ជើញ។'
            : 'Please sign in with your Google account to access the invitation.'}
        </p>

        <motion.button
          onClick={onLogin}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="font-khmer">
            {language === 'kh' ? 'ចូលជាមួយ Google' : 'Sign in with Google'}
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
