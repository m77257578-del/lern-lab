/**
 * Next.js Project Structure Identifier:
 * components/UserProfileSection.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: Client Profile section within Client Dashboard to view registration date,
 *          total project deployments, and edit/manage contact information.
 */

import React, { useState } from 'react';
import { 
  User, Phone, Mail, Calendar, Rocket, ShieldCheck, 
  Save, CheckCircle2, AlertCircle, Edit3, Clock, Sparkles, LogOut, Trash2
} from 'lucide-react';
import { storageService } from '../src/services/storageService';
import AiSupportChat from './AiSupportChat';

export default function UserProfileSection({ 
  currentUser, 
  userDraftsCount = 0, 
  lang = 'ar',
  onUserUpdated = (_updated) => {},
  onLogout = () => {}
}) {
  const isRtl = lang === 'ar';
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formattedRegDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : (isRtl ? 'اليوم' : 'Today');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage(isRtl ? 'يرجى إدخال الاسم الكامل' : 'Please enter your full name');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage(isRtl ? 'يرجى إدخال رقم الهاتف' : 'Please enter your phone number');
      return;
    }

    if (currentUser?.id) {
      const updated = storageService.updateUserProfile(currentUser.id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim()
      });

      if (updated) {
        onUserUpdated(updated);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3500);
      }
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6 animate-fadeIn">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">
            <User className="w-3.5 h-3.5" />
            <span>{isRtl ? 'الملف الشخصي والبيانات المسجلة' : 'User Profile & Contact Information'}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            {isRtl ? 'إدارة حساب العميل ومعلومات التواصل' : 'Account Overview & Contact Settings'}
          </h3>
          <p className="text-xs md:text-sm text-slate-300">
            {isRtl 
              ? 'معاينة تاريخ التسجيل، إجمالي المنصات المخصصة، وتعديل اسمك وهاتفك للتواصل المباشر مع الإدارة.' 
              : 'View account metrics, total deployment statistics, and manage your primary contact details.'}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>{isRtl ? 'حساب عميل موثق' : 'Verified Client'}</span>
        </span>
      </div>

      {/* Profile Summary Cards (Metrics Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Registration Date */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">{isRtl ? 'تاريخ انضمام الحساب' : 'Registration Date'}</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg md:text-xl font-bold text-white">
            {formattedRegDate}
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{isRtl ? 'عضوية نشطة في المنظومة' : 'Active platform member'}</span>
          </p>
        </div>

        {/* Metric 2: Total Project Deployments */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">{isRtl ? 'إجمالي نشر المنصات والمشاريع' : 'Total Project Deployments'}</span>
            <Rocket className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{userDraftsCount}</span>
            <span className="text-xs font-bold text-purple-400">{isRtl ? 'منصة / تعديل' : 'Deployments'}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {isRtl ? 'طلبات التخصيص والنشر المرسلة للأدمن' : 'AI customization drafts and deployments'}
          </p>
        </div>

        {/* Metric 3: Account ID & Verification */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">{isRtl ? 'معرف العميل (Client ID)' : 'Account Reference ID'}</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-sm font-bold text-amber-400 truncate">
            {currentUser?.id || 'u-client-001'}
          </div>
          <p className="text-[11px] text-slate-400">
            {isRtl ? 'مرجع دعم وتفعيل التراخيص والخدمات' : 'Reference for technical support & licenses'}
          </p>
        </div>
      </div>

      {/* My Usage Summary Widget (Mini Progress Bars) */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h4 className="text-sm md:text-base font-bold text-white">
              {isRtl ? 'ملخص الاستخدام الحالي' : 'My Usage Summary'}
            </h4>
          </div>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-2 py-1 bg-blue-400/10 rounded-md">
            {isRtl ? 'باقة النشطة' : 'Active Plan'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Usage 1: Project Deployment Quota */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">{isRtl ? 'حصة نشر المشاريع' : 'Project Deployment Quota'}</span>
              <span className="text-white font-bold">{userDraftsCount} / 10</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((userDraftsCount / 10) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">
              {isRtl ? 'متبقي لك 3 عمليات نشر إضافية هذا الشهر' : '3 deployments remaining this month'}
            </p>
          </div>

          {/* Usage 2: Sandbox Runtime Limits */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">{isRtl ? 'ساعات تشغيل المحاكي' : 'Sandbox Runtime Limit'}</span>
              <span className="text-white font-bold">45 / 100 hr</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000"
                style={{ width: '45%' }}
              />
            </div>
            <p className="text-[10px] text-slate-500">
              {isRtl ? 'تجدد الساعات تلقائياً يوم 1 في الشهر' : 'Resets automatically on the 1st of the month'}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Contact Information Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-blue-400" />
            <span>{isRtl ? 'تحديث معلومات التواصل الخاصة بك:' : 'Manage Contact Information:'}</span>
          </h4>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isSaved && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{isRtl ? 'تم حفظ وتحديث بيانات التواصل بنجاح!' : 'Contact information updated successfully!'}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>{isRtl ? 'الاسم الكامل:' : 'Full Name:'}</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isRtl ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs md:text-sm text-white focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRtl ? 'رقم الهاتف / الواتساب:' : 'Phone / WhatsApp:'}</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={isRtl ? 'أدخل رقم الهاتف' : 'Enter your phone number'}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs md:text-sm text-white focus:border-blue-500 focus:outline-none transition font-mono"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRtl ? 'البريد الإلكتروني (اختياري):' : 'Email Address (Optional):'}</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isRtl ? 'name@example.com' : 'name@example.com'}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs md:text-sm text-white focus:border-blue-500 focus:outline-none transition font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isRtl ? 'حفظ التغييرات' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Account Session & Danger Zone Actions */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>{isRtl ? 'إدارة الجلسة وحذف الحساب:' : 'Session Management & Account Safety:'}</span>
        </h4>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              storageService.logoutUser();
              onLogout();
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-bold text-slate-200 hover:border-slate-500 hover:text-white transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-amber-400" />
            <span>{isRtl ? 'تسجيل الخروج من الحساب' : 'Logout of Account'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-5 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isRtl ? 'حذف الحساب والمسودات المسجلة' : 'Delete Account & Saved Drafts'}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Account Deletion */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/40 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {isRtl ? 'تأكيد حذف الحساب نهائياً' : 'Confirm Permanent Account Deletion'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isRtl ? 'إجراء غير قابل للتراجع' : 'Irreversible Action'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isRtl 
                ? 'سيتم مسح بيانات حسابك بالكامل، بالإضافة إلى جميع مسودات الذكاء الاصطناعي والتعديلات التي أنشأتها، وسيتم تسجيل خروجك فوراً.'
                : 'All account data, saved drafts, and AI customizations will be deleted permanently. You will be logged out immediately.'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentUser?.id) {
                    storageService.deleteUserAccount(currentUser.id);
                  } else {
                    storageService.logoutUser();
                  }
                  setShowDeleteConfirm(false);
                  onLogout();
                }}
                className="rounded-xl bg-rose-600 hover:bg-rose-500 px-5 py-2 text-xs font-bold text-white shadow-lg transition"
              >
                {isRtl ? 'نعم، احذف الحساب الآن' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Support Chatbot Assistant */}
      <AiSupportChat lang={lang} currentUser={currentUser} />
    </div>
  );
}
