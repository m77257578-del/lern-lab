/**
 * Project Identity: ليرن ويب | Lern Web
 * Architecture Framework: Next.js (App Router Layout Structure) + React Vite Runtime
 * Purpose: Full interactive dashboard, PWA engine, AppStore marketplace, SandboxPreview simulator,
 *          Conversational AI customizer, bilingual RTL/LTR engine, dynamic theme, and VS Code file exporter.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Layers, Play, Video, ShieldCheck, Sun, Moon, 
  Globe, Download, Smartphone, Code2, ArrowUpRight,
  CheckCircle2, Menu, X, Share2, Terminal, Copy, Check, Lock, User, Sparkles, Printer, BarChart3, Rocket, Clock, Bot
} from 'lucide-react';

import AppStore from '../components/AppStore';
import SandboxPreview from '../components/SandboxPreview';
import FaqSection from '../components/FaqSection';
import PwaDiagnostics from '../components/PwaDiagnostics';
import UserProfileSection from '../components/UserProfileSection';
import ProductTour from '../components/ProductTour';
import AboutUsSection from '../components/AboutUsSection';
import { toast } from 'sonner';
import { translations } from './data/translations';
import { APPS_DATA, WALLET_OPTIONS, MEDIA_RESOURCES, AppItem } from './data/storeData';

// Raw file representations for instant uncompressed VS Code copying & inspection
const VSCODE_CODE_CATALOG: Record<string, { lang: string; title: string; code: string }> = {
  'app/page.jsx': {
    lang: 'javascript',
    title: 'app/page.jsx (Root layout routing and state coordinator)',
    code: `/**
 * Next.js Project Structure Identifier:
 * app/page.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Architecture Framework: Next.js (App Router Layout Structure)
 * Purpose: Root layout routing and state coordinator, bilingual engine, dynamic shade swapping,
 *          PWA installation tracker, and marketplace/sandbox conductor.
 */

'use client';

import React, { useState } from 'react';
import AppStore from '@/components/AppStore';
import SandboxPreview from '@/components/SandboxPreview';

export default function Page() {
  const [theme, setTheme] = useState('dark');
  // Product Tour State
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (activeTab === 'client-dashboard' && isUserLoggedIn && !localStorage.getItem('hasSeenTour')) {
      setShowTour(true);
    }
  }, [activeTab, isUserLoggedIn]);

  return (
    <div className={theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}>
      
      {/* Product Tour Overlay */}
      {showTour && (
        <ProductTour 
          lang={lang} 
          onClose={() => {
            setShowTour(false);
            localStorage.setItem('hasSeenTour', 'true');
          }}
        />
      )}
      <AppStore />
    </div>
  );
}`
  },
  'app/layout.jsx': {
    lang: 'javascript',
    title: 'app/layout.jsx (Bilingual context wrappers, metadata providers, and global font injections)',
    code: `export const metadata = {
  title: 'ليرن ويب | Lern Web - المنظومة التعليمية السحابية المتكاملة',
  description: 'سوق أدوات ومحاكي مراكز تعليمية متطورة مع محرك PWA وترخيص مرن وتملك كامل للكود المصدري.',
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon-192.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}`
  }
};

import AdminDashboard from '../components/AdminDashboard';
import SecretLoginModal from '../components/SecretLoginModal';
import { storageService, buildWhatsAppUrl, ProjectItem, AdminSettings, WalletConfig, MediaResourceItem, AiCustomizationDraft } from './services/storageService';

export default function App() {
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') toast.success(message);
    else toast.error(message);
  }, []);

  // Bilingual State: 'ar' (RTL default) | 'en' (LTR)
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const t = translations[lang] || translations.ar;
  const isRtl = lang === 'ar';

  // Dynamic Shade Theme: 'dark' | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Main Navigation Tabs: 'store' | 'sandbox' | 'media' | 'billing' | 'vscode' | 'client-dashboard'
  const [activeTab, setActiveTab] = useState<'store' | 'sandbox' | 'media' | 'billing' | 'vscode' | 'client-dashboard'>('store');

  // Mobile Navigation Drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active Sandbox Configuration for Cross-Component Provisioning
  const [sandboxConfig, setSandboxConfig] = useState<any>(null);

  // Admin Master State (Secret Login with password 100100)
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSecretLoginOpen, setIsSecretLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  
  // Logo 5 clicks in 3 seconds gesture
  const [logoClickTimes, setLogoClickTimes] = useState<number[]>([]);
  
  // AI Chat Toggle
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // User Auth State
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (activeTab === 'client-dashboard' && isUserLoggedIn && !localStorage.getItem('hasSeenTour')) {
      setShowTour(true);
    }
  }, [activeTab, isUserLoggedIn]);

  const [userDrafts, setUserDrafts] = useState<AiCustomizationDraft[]>(() => storageService.getAiDrafts());

  // Track draft status changes for automatic client notifications
  const prevDraftStatuses = useRef<Record<string, string>>({});

  useEffect(() => {
    if (isUserLoggedIn && userDrafts.length > 0) {
      userDrafts.forEach((draft) => {
        const prevStatus = prevDraftStatuses.current[draft.id];
        
        // If we have a previous status and it's different from the current one
        if (prevStatus && prevStatus !== draft.status) {
          const statusMapAr: Record<string, string> = {
            'pending_review': 'قيد المراجعة الفنية',
            'in_progress': 'قيد التنفيذ والبرمجة',
            'completed': 'تم التنفيذ / جاهز',
            'approved_published': 'تم الاعتماد والنشر بالمتجر',
            'rejected': 'تم الرفض / يحتاج مراجعة'
          };
          const statusMapEn: Record<string, string> = {
            'pending_review': 'Pending Review',
            'in_progress': 'In Progress',
            'completed': 'Completed / Ready',
            'approved_published': 'Approved & Published',
            'rejected': 'Rejected / Needs Review'
          };

          const statusLabel = isRtl ? statusMapAr[draft.status] : statusMapEn[draft.status];
          
          let details = isRtl 
            ? `🔔 تحديث حالة: طلبك "${draft.modifiedConfig.centerName}" أصبح الآن [${statusLabel}]`
            : `🔔 Status Update: Your request "${draft.modifiedConfig.centerName}" is now [${statusLabel}]`;
          
          if (draft.notes) {
            details += isRtl ? `\n\nملاحظة الإدارة: ${draft.notes}` : `\n\nAdmin Note: ${draft.notes}`;
          }

          showToast(details, 'success');
        }
        
        // Update the ref with current status
        prevDraftStatuses.current[draft.id] = draft.status;
      });
    } else if (!isUserLoggedIn) {
      // Reset tracker on logout
      prevDraftStatuses.current = {};
    }
  }, [userDrafts, isUserLoggedIn, isRtl, showToast]);

  // Persistent Projects, Settings, Wallets, Media
  const [projects, setProjects] = useState<ProjectItem[]>(() => storageService.getProjects(false));
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => storageService.getSettings());
  const [wallets, setWallets] = useState<WalletConfig[]>(() => storageService.getWallets());
  const [mediaItems, setMediaItems] = useState<MediaResourceItem[]>(() => {
    const stored = storageService.getMediaResources();
    return stored.length > 0 ? stored : (MEDIA_RESOURCES as any[]);
  });
  const [plans, setPlans] = useState<any[]>(() => storageService.getPlans());


  const refreshStorageData = () => {
    const loggedIn = storageService.isAdminLoggedIn();
    setIsAdmin(loggedIn);
    setProjects(storageService.getProjects(loggedIn));
    setAdminSettings(storageService.getSettings());
    setWallets(storageService.getWallets());
    
    const storedMedia = storageService.getMediaResources();
    setMediaItems(storedMedia.length > 0 ? storedMedia : (MEDIA_RESOURCES as any[]));
    setPlans(storageService.getPlans());
    setUserDrafts(storageService.getAiDrafts());

    const userLoggedIn = storageService.isUserLoggedIn();
    setIsUserLoggedIn(userLoggedIn);
    setCurrentUser(storageService.getCurrentUser());
  };

  useEffect(() => {
    refreshStorageData();

    // Secret shortcut: Ctrl+Shift+A opens secret admin login
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsSecretLoginOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Anti-Piracy: Disable Right-Click
    const handleContextMenu = (e: MouseEvent) => {
      // Allow right-click on specific elements if needed, otherwise block
      if (!(e.target as HTMLElement).closest('input, textarea, pre, code')) {
        e.preventDefault();
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Strict: 5 clicks on logo within 3 seconds opens Admin Portal
  const handleLogoSecretClick = () => {
    const now = Date.now();
    const recent = [...logoClickTimes.filter((tVal) => now - tVal < 3000), now];
    setLogoClickTimes(recent);
    if (recent.length >= 5) {
      setIsSecretLoginOpen(true);
      setLogoClickTimes([]);
    }
  };

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  // VS Code Source Code Viewer
  const [activeVsCodeFile, setActiveVsCodeFile] = useState('app/page.jsx');
  const [hasCopiedFile, setHasCopiedFile] = useState(false);

  // Compute effective theme based on Admin System Preferences setting
  const effectiveTheme = adminSettings?.themeMode === 'dark' 
    ? 'dark' 
    : adminSettings?.themeMode === 'light' 
      ? 'light' 
      : theme;

  // Sync HTML tag attributes for RTL and Theme
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';

    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [lang, isRtl, effectiveTheme]);

  // PWA Prompt Detection
  useEffect(() => {
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      alert(isRtl 
        ? 'يمكنك تثبيت التطبيق مباشرة من قائمة إعدادات المتصفح (Install App أو Add to Home Screen).' 
        : 'You can install the app directly via your browser menu (Install App / Add to Home Screen).');
    }
  };

  const handleLaunchAppInSandbox = (app: AppItem) => {
    if (app && app.defaultSandboxConfig) {
      setSandboxConfig({
        centerName: isRtl ? app.titleAr : app.titleEn,
        theme: app.defaultSandboxConfig.theme,
        activeCourse: isRtl ? app.defaultSandboxConfig.activeCourse : app.titleEn,
        bannerText: isRtl ? app.defaultSandboxConfig.bannerText : 'Active runtime deployment configured',
        activeTab: 'courses',
        studentCount: 850,
        tutorName: 'د. ليرن ويب الأكاديمي',
        hasQuiz: app.defaultSandboxConfig.hasQuiz
      });
    }
    setActiveTab('sandbox');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyCode = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setHasCopiedFile(true);
    setTimeout(() => setHasCopiedFile(false), 2500);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      effectiveTheme === 'dark' 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* 0. Secret Master Admin Operational Banner (Active when logged in with 100100) */}
      {isAdmin && (
        <div className="no-print bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border-b border-blue-400/40 px-4 py-2.5 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm shadow-xl z-50 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-emerald-500/30 animate-pulse" />
            <span className="font-bold">👑 {isRtl ? 'وضع تحكم المشرف العام نشط (Master Mode)' : 'Master Admin Mode Active'}:</span>
            <span className="text-slate-200 hidden md:inline">{isRtl ? 'لك الصلاحية الكاملة لإدارة المنصة، حذف المحتوى، واعتماد مسودات الزوار' : 'Full master access active'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="rounded-xl bg-blue-500 hover:bg-blue-400 px-3.5 py-1.5 font-bold text-white shadow transition"
            >
              {isRtl ? 'فتح لوحة تحكم الإدارة' : 'Open Admin Panel'}
            </button>
            <button
              onClick={() => {
                storageService.logoutAdmin();
                refreshStorageData();
                showToast(isRtl ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully', 'success');
              }}
              className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-white transition"
            >
              {isRtl ? 'خروج من الإدارة' : 'Logout Admin'}
            </button>
          </div>
        </div>
      )}

      {/* 1. Native PWA & App Installation Engine Banner */}
      {!isInstalled && (
        <aside aria-label="PWA install banner" className="no-print relative z-40 border-b border-blue-500/20 bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-900 px-4 py-2.5 text-white shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <Smartphone className="w-4 h-4 text-blue-300" />
              <span className="font-semibold">{t.pwaInstallTitle}:</span>
              <span className="text-slate-300 hidden md:inline">{t.pwaInstallDesc}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 px-3.5 py-1.5 font-bold text-white shadow transition active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.installNow}</span>
              </button>

              {isIOS && (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="rounded-xl border border-white/20 bg-white/10 px-2.5 py-1.5 text-xs text-white hover:bg-white/20"
                >
                  iPhone Guide
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Main Global Navigation Header (NO ADMIN BUTTONS IN HEADER OR FOOTER PER USER REQUEST) */}
      <header className={`no-print sticky ${isAdmin ? 'top-10' : 'top-0'} z-30 border-b backdrop-blur-xl transition-colors ${
        theme === 'dark' 
          ? 'border-slate-800/80 bg-slate-950/85' 
          : 'border-slate-200/80 bg-white/85'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Mark & Global AI Tool Badge */}
          <div className="flex items-center gap-4">
            <div 
              onClick={() => {
                setActiveTab('store');
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center font-black text-white text-lg">
                  LW
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg md:text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
                    ليرن ويب
                  </span>
                  <span className="text-xs font-bold text-blue-400 font-mono">
                    LERN WEB
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {isRtl ? 'المنظومة البرمجية الشاملة' : 'Universal Software Platform'}
                </p>
              </div>
            </div>

            {/* Global AI Tool Badge */}
            <div className="hidden xl:flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>{isRtl ? 'أداة الذكاء الاصطناعي العامة' : 'LernWeb AI Engine'}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5">
            {[
              { id: 'store', label: t.navStore, icon: Layers },
              { id: 'sandbox', label: t.navSandbox, icon: Play },
              { id: 'about', label: isRtl ? 'من نحن' : 'About Us', icon: Sparkles },
              { id: 'media', label: t.navMediaDocs, icon: Video },
              { id: 'billing', label: t.navBilling, icon: ShieldCheck },
              { id: 'vscode', label: t.navCodeViewer, icon: Code2 },
              ...(isUserLoggedIn ? [{ id: 'client-dashboard', label: isRtl ? 'لوحة العميل' : 'My Dashboard', icon: User }] : [])
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id as any)}
                  style={isActive ? { backgroundColor: adminSettings.primaryColor || '#2563eb' } : {}}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs md:text-sm font-semibold transition-all ${
                    isActive 
                      ? 'text-white shadow-md' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{nav.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: WhatsApp, Language, Theme, User Sign In */}
          <div className="flex items-center gap-2 md:gap-3">
            {adminSettings.targetWhatsAppNumber && (
              <a
                href={buildWhatsAppUrl(adminSettings.targetWhatsAppNumber, isRtl ? 'مرحباً، أود الاستفسار عن منصات ليرن ويب التعليمية' : 'Hello, I have an inquiry about Lern Web platforms')}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition shadow-sm"
              >
                <span>💬 {isRtl ? 'واتساب' : 'WhatsApp'}</span>
              </a>
            )}

            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 hover:border-slate-700 transition"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            <button
              onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}
              title={adminSettings?.themeMode && adminSettings.themeMode !== 'user' ? (isRtl ? 'إعدادات المنظومة: مظهر مفروض من الإدارة' : 'System Forced Theme') : undefined}
              className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              {effectiveTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* User Login / Account Button */}
            <button
              onClick={() => {
                if (isUserLoggedIn) {
                  setActiveTab('client-dashboard');
                } else {
                  setIsSecretLoginOpen(true);
                }
              }}
              className="flex items-center gap-2 rounded-xl border border-blue-500/50 bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs md:text-sm font-bold text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30 transition active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>
                {isUserLoggedIn 
                  ? (currentUser?.name || (isRtl ? 'حسابي' : 'My Account'))
                  : (isRtl ? 'تسجيل دخول العميل' : 'Client Login')}
              </span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-3 animate-fadeIn">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (isUserLoggedIn) {
                  setActiveTab('client-dashboard');
                } else {
                  setIsSecretLoginOpen(true);
                }
              }}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
            >
              <User className="w-4 h-4" />
              <span>{isUserLoggedIn ? (currentUser?.name || 'لوحة العميل') : (isRtl ? 'تسجيل دخول العميل' : 'Client Sign In')}</span>
            </button>

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              {[
                { id: 'store', label: t.navStore, icon: Layers },
                { id: 'sandbox', label: t.navSandbox, icon: Play },
                { id: 'about', label: isRtl ? 'من نحن' : 'About Us', icon: Sparkles },
                { id: 'media', label: t.navMediaDocs, icon: Video },
                { id: 'billing', label: t.navBilling, icon: ShieldCheck },
                { id: 'vscode', label: t.navCodeViewer, icon: Code2 },
                ...(isUserLoggedIn ? [{ id: 'client-dashboard', label: isRtl ? 'لوحة العميل' : 'My Dashboard', icon: User }] : [])
              ].map((nav) => {
                const Icon = nav.icon;
                return (
                  <button
                    key={nav.id}
                    onClick={() => {
                      setActiveTab(nav.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      activeTab === nav.id 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{nav.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        
        {/* TAB 1: AppStore */}
        {activeTab === 'store' && (
          <AppStore
            apps={projects as any}
            lang={lang}
            t={t}
            onLaunchSandbox={handleLaunchAppInSandbox}
            onSelectAppForDeploy={handleLaunchAppInSandbox}
            isAdmin={isAdmin}
            isUserLoggedIn={isUserLoggedIn}
            adminSettings={adminSettings}
            onOpenLogin={() => setIsSecretLoginOpen(true)}
            onOpenAdminPortal={() => setIsAdminDashboardOpen(true)}
            showToast={showToast}
          />
        )}

        {/* TAB 2.5: About Us */}
        {activeTab === 'about' && (
          <AboutUsSection lang={lang} onClose={() => setActiveTab('store')} />
        )}

        {/* TAB 2: Sandbox Preview */}
        {activeTab === 'sandbox' && (
          <SandboxPreview
            lang={lang}
            t={t}
            initialConfig={sandboxConfig}
            wallets={wallets.filter((w) => w.isActive)}
            mediaResources={mediaItems}
            onOpenBillingModal={() => setActiveTab('billing')}
            targetWhatsAppNumber={adminSettings.targetWhatsAppNumber}
            isAdmin={isAdmin}
            isUserLoggedIn={isUserLoggedIn}
            onOpenLogin={() => setIsSecretLoginOpen(true)}
            adminSettings={adminSettings}
            plans={plans}
          />
        )}

        {/* TAB 3: Media Channels */}
        {activeTab === 'media' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{t.mediaTitle}</h2>
              <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">{t.mediaSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediaItems.filter(m => isAdmin || m.isPublished !== false).map((res) => (
                <div key={res.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-lg flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400">
                        {isRtl ? res.categoryAr : res.categoryEn}
                      </span>
                      <span className="font-mono text-slate-400">
                        {isRtl ? res.durationOrReadTimeAr : res.durationOrReadTimeEn}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{isRtl ? res.titleAr : res.titleEn}</h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{isRtl ? res.summaryAr : res.summaryEn}</p>
                  </div>

                  {res.type === 'video' ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                      <iframe 
                        src={res.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'} 
                        title={res.titleAr} 
                        className="w-full h-full border-0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen 
                      />
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {isRtl ? res.contentAr : res.contentEn}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Billing */}
        {activeTab === 'billing' && (
          <div className="animate-fadeIn">
            <SandboxPreview
              lang={lang}
              t={t}
              initialConfig={sandboxConfig}
              wallets={wallets.filter((w) => w.isActive)}
              mediaResources={mediaItems}
              onOpenBillingModal={() => {}}
              targetWhatsAppNumber={adminSettings.targetWhatsAppNumber}
              isAdmin={isAdmin}
              isUserLoggedIn={isUserLoggedIn}
              onOpenLogin={() => setIsSecretLoginOpen(true)}
              adminSettings={adminSettings}
              plans={plans}
            />
          </div>
        )}

        {/* TAB 5: VS Code Explorer */}
        {activeTab === 'vscode' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-md bg-emerald-500/20 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
                <Terminal className="w-4 h-4" />
                <span>VS Code Environment & Vercel Edge Pipeline</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{t.vsCodeExplorerTitle}</h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">{t.vsCodeExplorerSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Next.js App Router Structure:</h4>
                {Object.keys(VSCODE_CODE_CATALOG).map((fileName) => (
                  <button
                    key={fileName}
                    onClick={() => setActiveVsCodeFile(fileName)}
                    className={`w-full text-left font-mono text-xs px-3 py-2.5 rounded-xl transition flex items-center justify-between ${
                      activeVsCodeFile === fileName ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{fileName}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ))}
              </div>

              <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono text-blue-400">{VSCODE_CODE_CATALOG[activeVsCodeFile]?.title}</span>
                    <h4 className="text-base font-mono font-bold text-white">{activeVsCodeFile}</h4>
                  </div>

                  <button
                    onClick={() => handleCopyCode(VSCODE_CODE_CATALOG[activeVsCodeFile]?.code || '')}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition shadow"
                  >
                    {hasCopiedFile ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{hasCopiedFile ? t.fileCopied : t.copyFileCode}</span>
                  </button>
                </div>

                <div className="rounded-xl bg-slate-900 p-4 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto max-h-[500px]" dir="ltr">
                  <pre className="text-left font-mono whitespace-pre">{VSCODE_CODE_CATALOG[activeVsCodeFile]?.code}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CLIENT DASHBOARD & MODIFICATION REQUESTS STATUS TRACKER */}
        {activeTab === 'client-dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {isUserLoggedIn ? (
              <>
                <div className="rounded-3xl border border-blue-500/40 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 md:p-8 shadow-2xl space-y-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
                        <User className="w-4 h-4" />
                        <span>{isRtl ? 'لوحة العميل الخاصة' : 'Client Account Portal'}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-black text-white">
                        {isRtl ? `مرحباً بك، ${currentUser?.name || 'عميلنا العزيز'}` : `Welcome back, ${currentUser?.name}`}
                      </h2>
                    </div>

                    <button
                      onClick={() => window.print()}
                      className="no-print flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{isRtl ? 'طباعة تقرير التعديلات' : 'Print Status Report'}</span>
                    </button>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300">
                    {isRtl 
                      ? 'من خلال هذه اللوحة يمكنك متابعة حالة طلبات التعديل، إدارة معلومات حسابك والتواصل مع الأدمن.'
                      : 'Track your submitted AI customization drafts, update profile contact details, and view deployment stats.'}
                  </p>
                </div>
                
                {/* 'My Usage' Summary Widget: Quotas & Limits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-slate-300">{isRtl ? 'حصة نشر المشاريع' : 'Project Deployment Quota'}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">1 / 3</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '33.33%' }} />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {isRtl ? 'لقد استهلكت مشروعاً واحداً من أصل 3 مشاريع مسموحة في باقتك الحالية.' : 'You have deployed 1 out of 3 allowed projects in your current plan.'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-slate-300">{isRtl ? 'حدود وقت المحاكي النشط' : 'Active Sandbox Runtime Limit'}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">45 / 120 min</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '37.5%' }} />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {isRtl ? 'متبقي لك 75 دقيقة من البث المباشر للمحاكي هذا الشهر.' : '75 minutes of sandbox streaming runtime remaining this month.'}
                    </p>
                  </div>
                </div>

                {/* 5-Step Automated Booking & Deployment Workflow Visualizer */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 shadow-xl space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-blue-400" />
                        <span>{isRtl ? 'مسار تفعيل ونشر المنصة (5 خطوات)' : '5-Step Provisioning Pipeline'}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {isRtl ? 'تتبع حالة طلبك من التخصيص حتى النشر المباشر على السيرفر' : 'Track your acquisition journey from AI customization to live deployment'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400">
                      <Clock className="w-3 h-3" />
                      <span>{isRtl ? 'قيد المعالجة' : 'Processing'}</span>
                    </div>
                  </div>

                  <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Connector Line (Desktop) */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 hidden md:block" />
                    
                    {[
                      { id: 1, labelAr: 'تخصيص AI', labelEn: 'AI Customizer', status: 'completed' },
                      { id: 2, labelAr: 'اختيار الترخيص', labelEn: 'License Selection', status: 'completed' },
                      { id: 3, labelAr: 'تأكيد الدفع', labelEn: 'Payment Proof', status: 'current' },
                      { id: 4, labelAr: 'أرشفة الكود', labelEn: 'Private Archiving', status: 'pending' },
                      { id: 5, labelAr: 'النشر المباشر', labelEn: 'Live Provisioning', status: 'pending' }
                    ].map((step) => (
                      <div key={step.id} className="relative z-10 flex flex-row md:flex-col items-center gap-3 md:gap-2 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          step.status === 'completed' 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : step.status === 'current'
                            ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-500/20 animate-pulse'
                            : 'bg-slate-900 border-slate-800 text-slate-500'
                        }`}>
                          {step.status === 'completed' ? <Check className="w-4 h-4" /> : step.id}
                        </div>
                        <div className="flex flex-col md:items-center">
                          <span className={`text-[10px] md:text-xs font-bold ${
                            step.status === 'pending' ? 'text-slate-500' : 'text-slate-200'
                          }`}>
                            {isRtl ? step.labelAr : step.labelEn}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile Management Section */}
                <UserProfileSection
                  currentUser={currentUser}
                  userDraftsCount={userDrafts.length}
                  lang={lang}
                  onUserUpdated={(updatedUser) => setCurrentUser(updatedUser)}
                />

                {/* Visual Status Change Notification Banner */}
                {userDrafts.some(d => d.status === 'completed' || d.status === 'in_progress' || d.status === 'approved_published') && (
                  <div className="rounded-2xl bg-gradient-to-r from-emerald-900/40 via-blue-900/40 to-slate-900 border border-emerald-500/40 p-5 text-white flex items-center gap-4 shadow-xl animate-fadeIn">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-6 h-6 animate-bounce" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm md:text-base font-bold text-emerald-300">
                        {isRtl ? '🔔 إشعار تحديث حالة طلبات التعديل' : '🔔 Modification Request Status Update'}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-300">
                        {isRtl 
                          ? 'قام المشرف العام بتحديث حالة طلباتك (مثل التحول إلى "قيد التنفيذ" أو "تم التنفيذ"). تفقد السجل أدناه لمعاينة التحديثات وملاحظات الأدمن.' 
                          : 'The administrator has updated the status of your modification requests. Review the status logs below.'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-xl space-y-6">
                  <h3 className="text-xl font-bold text-white">
                    {isRtl ? 'سجل طلبات التعديل وحالة المراجعة' : 'Modification Request Status Tracker'}
                  </h3>

                  {userDrafts.length === 0 ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center text-slate-400 space-y-2">
                      <Sparkles className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-sm font-semibold">{isRtl ? 'لم تقم بإرسال أي طلبات تعديل بعد' : 'No modification requests submitted yet'}</p>
                      <p className="text-xs text-slate-500">{isRtl ? 'قم بتجربة أي تعديل داخل المحاكي ثم أرسل الطلب للأدمن.' : 'Use the AI customizer sandbox to submit a request.'}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userDrafts.map((draft) => (
                        <div key={draft.id} className="print-card rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                draft.status === 'completed' || draft.status === 'approved_published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                draft.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}>
                                {draft.status === 'completed' || draft.status === 'approved_published' ? (isRtl ? '✅ تم التنفيذ / منشور' : 'Completed / Published') :
                                 draft.status === 'in_progress' ? (isRtl ? '⏳ قيد التنفيذ والبرمجة' : 'In Progress') : (isRtl ? '⌛ قيد المراجعة الفنية' : 'Pending Review')}
                              </span>
                              <span className="text-xs font-mono text-slate-400">{draft.forkedAt}</span>
                            </div>

                            <h4 className="text-base font-bold text-white">{draft.modifiedConfig.centerName}</h4>
                            <p className="text-xs text-slate-300"><strong>{isRtl ? 'التعديل المطلوب:' : 'Prompt:'}</strong> "{draft.userPrompt}"</p>
                            {draft.notes && (
                              <p className="text-xs text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30">
                                <strong>{isRtl ? 'ملاحظة الأدمن:' : 'Admin Notes:'}</strong> {draft.notes}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              setSandboxConfig({
                                centerName: draft.modifiedConfig.centerName,
                                theme: draft.modifiedConfig.theme,
                                activeCourse: draft.modifiedConfig.activeCourse,
                                hasQuiz: draft.modifiedConfig.hasQuiz,
                                bannerText: draft.modifiedConfig.bannerText,
                                tutorName: 'العميل'
                              });
                              setActiveTab('sandbox');
                            }}
                            className="no-print rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:text-white shrink-0"
                          >
                            {isRtl ? 'معاينة المسودة' : 'Preview Sandbox'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Client Profile, Contact Info & Account Management (Logout & Deletion) */}
                <UserProfileSection
                  currentUser={currentUser}
                  userDraftsCount={userDrafts.length}
                  lang={lang}
                  onUserUpdated={(updated) => setCurrentUser(updated)}
                  onLogout={() => {
                    refreshStorageData();
                    setActiveTab('store');
                    showToast(isRtl ? 'تم تسجيل الخروج من الحساب بنجاح' : 'Logged out successfully', 'success');
                  }}
                />
              </>
            ) : (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center space-y-4">
                <User className="w-12 h-12 text-blue-400 mx-auto opacity-80" />
                <h3 className="text-xl font-bold text-white">
                  {isRtl ? 'تسجيل الدخول إلى حساب العميل' : 'Client Account Access'}
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  {isRtl 
                    ? 'سجل دخولك لمتابعة حالة طلبات التعديل والملاحظات المرسلة إلى إدارة المنظومة.' 
                    : 'Sign in to access your personal modification requests and admin feedback.'}
                </p>
                <button
                  onClick={() => setIsSecretLoginOpen(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 transition active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span>{isRtl ? 'تسجيل الدخول الآن' : 'Sign In Now'}</span>
                </button>
              </div>
            )}

            {/* Diagnostic PWA & Service Worker Capability View */}
            <PwaDiagnostics lang={lang} />

            {/* Embedded FAQ Section inside Client Dashboard */}
            <FaqSection lang={lang} adminSettings={adminSettings} />
          </div>
        )}
      </main>

      {/* Global iOS PWA Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-6 text-white space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold">{t.iosInstallGuide}</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">1</span>
                <p>{t.iosStep1}</p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">2</span>
                <p>{t.iosStep2}</p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full rounded-2xl bg-slate-800 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* Product Tour Overlay */}
      {showTour && (
        <ProductTour 
          lang={lang} 
          onClose={() => {
            setShowTour(false);
            localStorage.setItem('hasSeenTour', 'true');
          }}
        />
      )}

      {/* Global Footer (NO ADMIN BUTTONS IN FOOTER PER USER REQUEST) */}
      <footer className="no-print mt-16 border-t border-slate-800/80 bg-slate-950 py-10 px-4 text-center text-xs text-slate-400 space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {(adminSettings.socialLinks.whatsapp || adminSettings.targetWhatsAppNumber) && (
            <a 
              href={buildWhatsAppUrl(adminSettings.targetWhatsAppNumber || adminSettings.socialLinks.whatsapp)} 
              target="_blank" 
              rel="noreferrer" 
              className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition"
            >
              💬 {adminSettings.socialAppNames?.whatsapp || 'WhatsApp'}
            </a>
          )}
          {adminSettings.socialLinks.facebook && (
            <a href={adminSettings.socialLinks.facebook} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:text-blue-400 hover:border-blue-500/40 transition">
              {adminSettings.socialAppNames?.facebook || 'Facebook'}
            </a>
          )}
          {adminSettings.socialLinks.youtube && (
            <a href={adminSettings.socialLinks.youtube} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:text-red-400 hover:border-red-500/40 transition">
              {adminSettings.socialAppNames?.youtube || 'YouTube'}
            </a>
          )}
          {adminSettings.socialLinks.tiktok && (
            <a href={adminSettings.socialLinks.tiktok} target="_blank" rel="noreferrer" className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:text-pink-400 hover:border-pink-500/40 transition">
              {adminSettings.socialAppNames?.tiktok || 'TikTok'}
            </a>
          )}
        </div>

        <p>
          {isRtl 
            ? 'منظومة ليرن ويب | Lern Web التعليمية المتكاملة • ترخيص رقمي وتشغيل سحابي معتمد' 
            : 'Lern Web Cloud Educational Ecosystem • Certified Digital Operation'}
        </p>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-[11px]">
          <span>Next.js App Router • Tailwind CSS • Vercel Edge Architecture</span>
        </div>
      </footer>

      {/* Secret Admin Passcode Modal (Password 100100) */}
      <SecretLoginModal
        isOpen={isSecretLoginOpen}
        onClose={() => setIsSecretLoginOpen(false)}
        onLoginSuccess={() => {
          refreshStorageData();
          setIsAdminDashboardOpen(true);
        }}
        lang={lang}
      />

      {/* Admin Master Control Dashboard */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          lang={lang}
          onClose={() => setIsAdminDashboardOpen(false)}
          onRefreshData={refreshStorageData}
          onOpenSandboxWithConfig={(cfg: any) => {
            setSandboxConfig(cfg);
            setActiveTab('sandbox');
          }}
        />
      )}

      {/* Floating AI Support Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsAiChatOpen(!isAiChatOpen)}
          className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-2xl hover:scale-105 transition"
        >
          {isAiChatOpen ? <X className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
        </button>
      </div>

      {isAiChatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-sm animate-fadeIn">
          <AiSupportChat lang={lang} currentUser={currentUser} />
        </div>
      )}
    </div>
  );
}
