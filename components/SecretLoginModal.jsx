/**
 * Next.js Project Structure Identifier:
 * components/SecretLoginModal.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: Discreet Admin Passcode Login (password: 100100) and Visitor Session Manager.
 */

import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, User, X, Eye, EyeOff } from 'lucide-react';
import { storageService } from '../src/services/storageService';

export default function SecretLoginModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess, 
  lang = 'ar' 
}) {
  const isRtl = lang === 'ar';
  const [activeTab, setActiveTab] = useState('admin'); // 'admin' | 'visitor'
  const [passcode, setPasscode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorSuccess, setVisitorSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const success = storageService.loginAdmin(passcode);
    if (success) {
      setPasscode('');
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } else {
      setErrorMsg(isRtl ? 'كلمة المرور غير صحيحة! هذه البوابة مخصصة للإدارة فقط.' : 'Invalid administrative passcode.');
    }
  };

  const handleVisitorSubmit = (e) => {
    e.preventDefault();
    if (!visitorName.trim()) {
      setErrorMsg(isRtl ? 'يرجى إدخال اسمك الكريم للمتابعة' : 'Please provide your name');
      return;
    }
    if (!visitorPhone.trim()) {
      setErrorMsg(isRtl ? 'يرجى إدخال رقم الهاتف للتواصل' : 'Please provide your phone number');
      return;
    }

    storageService.loginUser(visitorPhone, visitorName);

    setVisitorSuccess(true);
    setTimeout(() => {
      setVisitorSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-6 md:p-8 text-white shadow-2xl space-y-6">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-600/30">
            {activeTab === 'admin' ? <Lock className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
          </div>
          <h3 className="text-xl md:text-2xl font-bold">
            {activeTab === 'admin' 
              ? (isRtl ? 'تسجيل دخول الإدارة (Master Admin)' : 'Master Admin Portal')
              : (isRtl ? 'تسجيل زائر جديد / عميل' : 'Visitor Guest Session')}
          </h3>
          <p className="text-xs text-slate-400">
            {activeTab === 'admin' 
              ? (isRtl ? 'بوابة سرية ومحمية للتحكم في المنصات، طرق الدفع، ورفع الملفات' : 'Secure gate for managing applications, payments & private assets')
              : (isRtl ? 'سجل بياناتك لإرسال طلبات التعديل وحفظ مسوداتك' : 'Provide your details to submit modification requests')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl border border-slate-800 bg-slate-950 p-1">
          <button
            onClick={() => { setActiveTab('admin'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
              activeTab === 'admin' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isRtl ? 'بوابة الأدمن السرية' : 'Admin Gate'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('visitor'); setErrorMsg(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
              activeTab === 'visitor' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{isRtl ? 'دخول الزوار' : 'Visitor'}</span>
          </button>
        </div>

        {/* ADMIN LOGIN FORM */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {isRtl ? 'رمز مرور الأدمن السري (Passcode):' : 'Secret Admin Passcode:'}
              </label>
              
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder={isRtl ? 'أدخل الرمز السري...' : 'Enter passcode...'}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 placeholder:font-sans focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono tracking-widest text-center"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition active:scale-98"
            >
              {isRtl ? 'فتح لوحة تحكم الأدمن' : 'Unlock Admin Dashboard'}
            </button>
          </form>
        )}

        {/* VISITOR GUEST FORM */}
        {activeTab === 'visitor' && (
          <form onSubmit={handleVisitorSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {isRtl ? 'اسم صاحب المركز / المدرس:' : 'Full Name:'}
              </label>
              <input
                type="text"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder={isRtl ? 'أدخل اسمك الكريم...' : 'Enter your name...'}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                {isRtl ? 'رقم الهاتف / واتساب للتواصل:' : 'Phone / WhatsApp Number:'}
              </label>
              <input
                type="text"
                value={visitorPhone}
                onChange={(e) => setVisitorPhone(e.target.value)}
                placeholder={isRtl ? 'مثال: 01012345678' : 'e.g. +201012345678'}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>

            {errorMsg && activeTab === 'visitor' && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {visitorSuccess && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-300 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isRtl ? 'تم تسجيل بياناتك بنجاح! مرحباً بك في ليرن ويب.' : 'Session recorded successfully!'}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition"
            >
              {isRtl ? 'متابعة المعاينة والتجربة' : 'Proceed to Preview'}
            </button>
          </form>
        )}

        <div className="border-t border-slate-800 pt-3 text-center">
          <p className="text-[11px] text-slate-500">
            {isRtl ? 'نظام تشفير ليرن ويب الآمن' : 'Lern Web Security System'}
          </p>
        </div>
      </div>
    </div>
  );
}
