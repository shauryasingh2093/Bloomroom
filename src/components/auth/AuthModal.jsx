
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onContinueAsGuest, onLoginSuccess }) {
    const { signIn, signUp } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage('');
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) throw error;
                onLoginSuccess ? onLoginSuccess() : onClose();
            } else {
                const { error } = await signUp(email, password);
                if (error) throw error;
                setMessage('Check your email for the confirmation link!');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="bg-gradient-to-br from-planning-dusk/90 via-future-dusk/90 to-care-dusk/90 backdrop-blur-xl w-full max-w-md rounded-3xl p-8 shadow-2xl overflow-hidden relative border border-white/20"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                    <h2 className="text-3xl font-extralight text-cream-50 mb-2 text-center tracking-[0.2em] uppercase drop-shadow-md">
                        {isLogin ? 'Welcome Back' : 'Join'}
                    </h2>
                    <p className="text-center text-cream-100/60 mb-8 font-light tracking-widest text-xs uppercase">
                        {isLogin ? 'Continue your journey' : 'Start your journey today'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 text-cream-50 tracking-wider font-light"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-white/30 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 text-cream-50 tracking-wider font-light"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-200 text-xs text-center bg-red-500/10 border border-red-500/20 p-3 rounded-xl backdrop-blur-sm">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="text-emerald-200 text-xs text-center bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl backdrop-blur-sm">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-full bg-white/10 hover:bg-white/20 text-cream-50 font-light tracking-[0.2em] uppercase transition-all shadow-lg border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            <span className="relative z-10">{loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}</span>
                            <div className="absolute inset-0 bg-white/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                        </button>
                    </form>

                    <div className="mt-8 text-center relative z-10 space-y-6">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-cream-100/40 text-xs hover:text-cream-50 transition-colors uppercase tracking-widest block w-full"
                        >
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>

                        <div className="relative pt-6 border-t border-white/5">
                            <p className="text-cream-100/20 text-[10px] uppercase tracking-widest mb-3">Just browsing?</p>
                            <button
                                onClick={onContinueAsGuest}
                                className="group w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-3"
                            >
                                <span className="text-cream-100/60 group-hover:text-cream-50 text-xs uppercase tracking-[0.15em] transition-colors">
                                    Take a look around
                                </span>
                                <svg className="w-4 h-4 text-cream-100/40 group-hover:text-cream-50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
