'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Shield, User, Lock, Mail, ArrowRight, Activity } from 'lucide-react';
import clsx from 'clsx';

export function AuthOverlay() {
    const { login } = useAppStore();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMsg(null);

        const endpoint = isLogin ? '/login' : '/register';
        const payload = isLogin ? { email, password } : { email, password, name };

        try {
            const res = await fetch(`http://127.0.0.1:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                // Determine user-friendly error message
                if (data.error === "Invalid credentials") {
                    throw new Error("Access Denied: Invalid Email or Password mismatch.");
                } else if (data.error === "User already exists") {
                    throw new Error("Registration Failed: Personnel already exists.");
                } else {
                    throw new Error(data.error || "Authentication Failed.");
                }
            }

            if (isLogin) {
                login(data.name || name || email.split('@')[0]);
            } else {
                setSuccessMsg("Registration Complete. Please Login to access system.");
                setIsLogin(true); // Switch to login mode
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null; // Prevent hydration error by waiting for client mount

    return (
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center p-4 z-50">
            <div className="pointer-events-auto bg-slate-950/80 backdrop-blur-2xl border border-slate-700/50 shadow-2xl rounded-2xl w-full max-w-md p-8 relative overflow-hidden group animate-in fade-in zoom-in duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 opacity-50"></div>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30 text-blue-400 group-hover:scale-110 transition-transform duration-500">
                            <Shield size={32} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
                        {isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
                    </h1>
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                        {isLogin ? 'PLEASE ENTER YOUR DETAILS' : 'START YOUR JOURNEY'}
                    </p>
                </div>

                {/* Status Messages */}
                {(error || successMsg) && (
                    <div className={clsx(
                        "mb-4 p-3 rounded-lg border text-xs font-mono flex items-center gap-2",
                        error ? "bg-red-500/10 border-red-500/30 text-red-200" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                    )}>
                        {error && <Activity className="text-red-500 shrink-0" size={14} />}
                        {successMsg && <Shield className="text-emerald-500 shrink-0" size={14} />}
                        <span>{error || successMsg}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-600 font-mono text-sm"
                                    placeholder="ENTER NAME..."
                                    required={!isLogin}
                                />
                                <User className="absolute left-3 top-3 text-slate-500" size={16} />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-600 font-mono text-sm"
                                placeholder="ENTER EMAIL..."
                                required
                            />
                            <Mail className="absolute left-3 top-3 text-slate-500" size={16} />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-600 font-mono text-sm"
                                placeholder="••••••••"
                                required
                            />
                            <Lock className="absolute left-3 top-3 text-slate-500" size={16} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isLoading ? <Activity className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                        {isLoading ? 'LOGGING IN...' : (isLogin ? 'LOGIN' : 'SIGN UP')}
                    </button>
                </form>

                {/* Footer Toggle */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs text-slate-500 hover:text-white transition-colors"
                    >
                        {isLogin ? "DON'T HAVE CREDENTIALS? " : "ALREADY REGISTERED? "}
                        <span className="text-blue-400 underline decoration-blue-400/30 underline-offset-4">
                            {isLogin ? 'Sign up' : 'Log in'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
