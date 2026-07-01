/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Lock, User, Globe, ChevronRight, CheckCircle, ArrowLeft } from "lucide-react";

export const Auth: React.FC = () => {
  const { loginWithEmail, loginWithGoogle, loginWithApple, enterGuestMode } = useApp();
  
  const [view, setView] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("United States");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all credentials.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(email, undefined, password);
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password || !confirmPassword) {
      setError("Please fill out all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(email, name, password);
    } catch (err: any) {
      setError(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email address is required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // Simulate reset link dispatching
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResetSuccess(true);
    } catch (err: any) {
      setError("Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative w-full flex flex-col justify-center items-center px-4 bg-brand-primary overflow-hidden py-10">
      
      {/* Brand Top Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex w-16 h-16 mb-4 rounded-2xl bg-brand-card items-center justify-center border border-brand-accent/10 shadow-lg"
        >
          <svg className="w-8 h-8 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        
        <h1 className="font-display text-3xl font-bold tracking-tight text-white mb-1" id="auth-brand-name">
          FinScope
        </h1>
        <p className="text-xs text-brand-text-secondary tracking-wide" id="auth-brand-tagline">
          Your intelligent finance companion.
        </p>
      </div>

      {/* Main Authentic Card Layout */}
      <div className="w-full max-w-md bg-brand-secondary/70 backdrop-blur-md rounded-3xl border border-white/5 shadow-2xl p-6 relative z-10 glass-panel"
        id="auth-card"
      >
        
          {/* LOGIN VIEW */}
          {view === "login" && (
            <div
              key="login" >
              <h2 className="text-xl font-bold text-white mb-2" id="login-title">Sign In</h2>
              <p className="text-xs text-brand-text-secondary mb-6">Enter your registered email to explore deep market insights.</p>
              
              {error && <div className="mb-4 text-xs font-semibold bg-red-500/10 text-red-400 p-3 rounded-xl border border-red-500/20">{error}</div>}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-brand-card/40 border border-white/5 focus:border-brand-accent/40 outline-none text-white text-sm transition-all placeholder:text-brand-text-secondary/50"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-brand-card/40 border border-white/5 focus:border-brand-accent/40 outline-none text-white text-sm transition-all placeholder:text-brand-text-secondary/50"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setView("forgot"); setError(""); }}
                    className="text-xs text-brand-accent hover:text-brand-accent-highlight font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-brand-btn-accent text-brand-primary font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all hover:bg-brand-accent disabled:opacity-50"
                >
                  {loading ? "AUTHENTICATING..." : "CONTINUE"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <span className="relative bg-brand-secondary/90 px-3 text-[10px] font-mono uppercase text-brand-text-secondary tracking-wider">OR SIGN IN WITH</span>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => { setError(""); loginWithGoogle(); }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-brand-card/40 border border-white/5 hover:bg-brand-card/60 transition-colors text-white text-xs font-semibold"
                >
                  {/* Google SVG */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.65 4.5 1.8l2.423-2.423C17.3 1.5 14.9 0 12.24 0 6.033 0 1 5.033 1 11.24s5.033 11.24 11.24 11.24c5.78 0 10.24-4.067 10.24-10.24 0-.62-.05-1.22-.16-1.785H12.24z"/>
                  </svg>
                  Google
                </button>
                <button
                  onClick={() => { setError(""); loginWithApple(); }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-brand-card/40 border border-white/5 hover:bg-brand-card/60 transition-colors text-white text-xs font-semibold"
                >
                  {/* Apple SVG */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.09.09 2.21-.55 2.94-1.39z"/>
                  </svg>
                  Apple
                </button>
              </div>

              <button
                onClick={() => { setError(""); enterGuestMode(); }}
                className="w-full py-3.5 mb-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold tracking-wide border border-white/5 transition-all"
              >
                ACCESS AS GUEST
              </button>

              <p className="text-center text-xs text-brand-text-secondary">
                Don't have an account?{" "}
                <button
                  onClick={() => { setView("register"); setError(""); }}
                  className="text-brand-accent font-semibold hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          )}

          {/* REGISTER VIEW */}
          {view === "register" && (
            <div
              key="register" >
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => setView("login")} className="text-brand-text-secondary hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-xl font-bold text-white">Create Account</h2>
              </div>
              <p className="text-xs text-brand-text-secondary mb-6">Build your personal financial information vault.</p>

              {error && <div className="mb-4 text-xs font-semibold bg-red-500/10 text-red-400 p-3 rounded-xl border border-red-500/20">{error}</div>}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-brand-card/40 border border-white/5 focus:border-brand-accent/40 outline-none text-white text-sm transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-brand-card/40 border border-white/5 focus:border-brand-accent/40 outline-none text-white text-sm transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                  <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-brand-card/40 border border-white/5 focus:border-brand-accent/40 outline-none text-white text-sm transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-brand-card/40 border border-white/5 focus:border-brand-accent/40 outline-none text-white text-sm transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-brand-card/40 border border-white/5 focus:border-brand-accent/40 outline-none text-white text-sm transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 mt-2 rounded-2xl bg-brand-btn-accent text-brand-primary font-bold text-sm tracking-wide transition-all hover:bg-brand-accent"
                >
                  {loading ? "CREATING VAULT..." : "CREATE ACCOUNT"}
                </button>
              </form>

              <p className="text-center text-xs text-brand-text-secondary mt-6">
                Already have an account?{" "}
                <button
                  onClick={() => { setView("login"); setError(""); }}
                  className="text-brand-accent font-semibold hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {view === "forgot" && (
            <div
              key="forgot" >
              <div className="flex items-center gap-2 mb-2">
                <button onClick={() => { setView("login"); setError(""); setResetSuccess(false); }} className="text-brand-text-secondary hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-xl font-bold text-white">Reset Password</h2>
              </div>
              <p className="text-xs text-brand-text-secondary mb-6">Enter your email and we'll dispatch a secure recovery token.</p>

              {error && <div className="mb-4 text-xs font-semibold bg-red-500/10 text-red-400 p-3 rounded-xl border border-red-500/20">{error}</div>}

              {resetSuccess ? (
                <div className="text-center py-6 bg-brand-card/20 rounded-3xl border border-brand-accent/10 p-4"
                >
                  <CheckCircle className="w-12 h-12 text-brand-accent mx-auto mb-4" />
                  <h3 className="text-sm font-bold text-white mb-2">Link Dispatched</h3>
                  <p className="text-xs text-brand-text-secondary leading-relaxed">
                    Check your email inbox for resetting guidelines. Secure session terminated.
                  </p>
                  <button
                    onClick={() => { setView("login"); setResetSuccess(false); }}
                    className="mt-6 text-xs text-brand-accent font-bold tracking-wider hover:underline"
                  >
                    BACK TO LOGIN
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-brand-card/40 border border-white/5 focus:border-brand-accent/40 outline-none text-white text-sm transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-brand-btn-accent text-brand-primary font-bold text-sm tracking-wide transition-all hover:bg-brand-accent"
                  >
                    {loading ? "TRANSMITTING..." : "SEND RESET LINK"}
                  </button>
                </form>
              )}
            </div>
          )}
        
      </div>

      {/* Footer Details */}
      <div className="text-center mt-10 relative z-10 text-[10px] text-brand-text-secondary/60 flex items-center gap-3">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <span>•</span>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        <span>•</span>
        <a href="#" className="hover:text-white transition-colors">Enforce SSL</a>
      </div>
    </div>
  );
};
