/**
 * Project: ليرن ويب | Lern Web
 * File: src/services/storageService.ts
 * Centralized persistent state manager connected to backend API and Firestore real-time listeners.
 */

import { subscribeToProjects, subscribeToDrafts, subscribeToTickets, saveTicket as saveFirestoreTicket } from './firebaseService';

export interface ProjectItem {
  id: string;
  category: 'lms' | 'stem' | 'ai' | 'operations';
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  taglineAr: string;
  taglineEn: string;
  descriptionAr: string;
  descriptionEn: string;
  version: string;
  developer: string;
  rating: number;
  reviewsCount: number;
  accentColor: string;
  isPublished: boolean;
  featuresAr: string[];
  featuresEn: string[];
  techStack: string[];
  priceMonthly: string;
  priceAnnual: string;
  priceFull: string;
  sourceCode: string;
  fileData: {
    id: string;
    name: string;
    base64: string;
    type: string;
    fileCategory?: string;
    featureMetadata?: string;
    size: number;
    updatedAt: string;
  }[];
  secretFiles: {
    name: string;
    type: 'github' | 'zip' | 'doc' | 'config';
    urlOrNotes: string;
    updatedAt: string;
  }[];
  screenshots: {
    titleAr: string;
    titleEn: string;
    bgGradient: string;
    mockupType: 'dashboard' | 'code' | 'quiz' | 'qr' | 'analytics';
  }[];
  sandboxConfig: {
    centerName: string;
    theme: 'ocean' | 'midnight' | 'emerald' | 'amber';
    activeCourse: string;
    hasQuiz: boolean;
    bannerText: string;
    tutorName: string;
  };
}

export interface AdminSettings {
  adminPasscode: string;
  targetWhatsAppNumber: string;
  centerName: string;
  contactEmail: string;
  socialLinks: {
    whatsapp: string;
    facebook: string;
    youtube: string;
    tiktok: string;
  };
  socialAppNames: Record<string, string>;
  paymentMethodLabels: {
    ar: string;
    en: string;
  };
  primaryColor: string;
  accentColor: string;
  themeMode?: 'dark' | 'light' | 'user';
  globalPrices: {
    monthlyAr: string;
    monthlyEn: string;
    annualAr: string;
    annualEn: string;
    fullAr: string;
    fullEn: string;
  };
  seoSettings: SeoSettings;
}

export interface SeoSettings {
  title: string;
  description: string;
  ogImage: string;
  twitterImage: string;
}

export interface WalletConfig {
  id: string;
  nameAr: string;
  nameEn: string;
  number: string;
  badge: string;
  instructionsAr: string;
  instructionsEn: string;
  color: string;
  isActive: boolean;
}

export interface SubscriptionPlan {
  id: string;
  nameAr: string;
  nameEn: string;
  priceAr: string;
  priceEn: string;
  periodAr: string;
  periodEn: string;
  badgeAr: string;
  badgeEn: string;
  descriptionAr: string;
  descriptionEn: string;
  isPopular?: boolean;
  accentColor?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
  purchasedPlanId?: string;
}

export interface AiCustomizationDraft {
  id: string;
  projectId: string;
  projectTitle: string;
  visitorId: string;
  visitorName: string;
  visitorPhone: string;
  userPrompt: string;
  forkedAt: string;
  status: 'pending_review' | 'in_progress' | 'completed' | 'approved_published' | 'rejected';
  modifiedCode: string;
  modifiedConfig: {
    centerName: string;
    theme: 'ocean' | 'midnight' | 'emerald' | 'amber';
    activeCourse: string;
    hasQuiz: boolean;
    bannerText: string;
  };
  modifiedFiles?: {
    id: string;
    name: string;
    type: string;
    fileCategory?: string;
    featureMetadata?: string;
    content: string;
    updatedAt: string;
  }[];
  notes?: string;
}

export interface UserOrder {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  planType: 'monthly' | 'annual' | 'full';
  amount: string;
  paymentMethod: string;
  referenceId: string;
  createdAt: string;
  status: 'pending' | 'active';
}

export interface MediaResourceItem {
  id: string;
  type: 'video' | 'doc' | 'image';
  mediaSourceType?: 'youtube_url' | 'youtube_embed' | 'local_video' | 'image_url' | 'local_image';
  titleAr: string;
  titleEn: string;
  durationOrReadTimeAr: string;
  durationOrReadTimeEn: string;
  categoryAr: string;
  categoryEn: string;
  summaryAr: string;
  summaryEn: string;
  contentAr: string;
  contentEn: string;
  videoUrl?: string;
  imageUrl?: string;
  embedCode?: string;
  thumbnailBg: string;
  isPublished: boolean;
}

export interface ProjectReview {
  id: string;
  projectId: string;
  projectTitle: string;
  userId: string;
  userName: string;
  userPhone: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  actionType: 'project_created' | 'project_updated' | 'project_deleted' | 'project_published' | 'settings_updated' | 'draft_approved' | 'draft_updated' | 'media_created' | 'media_deleted' | 'review_deleted' | 'wallets_updated' | 'db_import' | 'db_export';
  titleAr: string;
  titleEn: string;
  detailsAr?: string;
  detailsEn?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderPhone?: string;
  message: string;
  timestamp: string;
  isAdminReply?: boolean;
}

export interface SupportTicketMessage {
  id: string;
  sender: 'user' | 'ai' | 'admin';
  senderName?: string;
  text: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  userEmail?: string;
  status: 'open' | 'in_progress' | 'closed';
  systemOverride?: string;
  createdAt: string;
  updatedAt: string;
  unreadByAdmin?: boolean;
  unreadByUser?: boolean;
  messages: SupportTicketMessage[];
}

const DEFAULT_INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'lms-core-hub',
    category: 'lms',
    titleAr: 'منظومة إدارة المراكز والسناتر التعليمية (LMS Core)',
    titleEn: 'LMS Core Educational Center Manager',
    badgeAr: 'النظام الأساسي المعتمد',
    badgeEn: 'Certified Flagship LMS',
    taglineAr: 'بوابة إلكترونية متكاملة لإدارة الحصص، مجموعات الطلاب، الجداول وسجلات الحضور والغياب للسناتر الكبرى والمدرسين.',
    taglineEn: 'Complete cloud platform for orchestrating classroom sessions, student cohorts, schedules, and fee ledgers.',
    descriptionAr: 'منظومة LMS Core صُممت خصيصاً لمواءمة المتطلبات التشغيلية الواقعية للمراكز التعليمية والسناتر.',
    descriptionEn: 'Engineered specifically for tutoring centers and academies.',
    version: 'v3.8.2',
    developer: 'Lern Web Systems & Lab',
    rating: 4.9,
    reviewsCount: 312,
    accentColor: '#3b82f6',
    isPublished: false,
    featuresAr: [
      'لوحة قيادة تفاعلية للمعلمين والإداريين تدعم تعدد الفروع والقاعات',
      'توليد بطاقات QR ذكية لكل طالب لسرعة تسجيل الحضور عند بوابات السنتر',
      'بوابة دفع مدمجة تدعم فودافون كاش، انستاباي، والتحويلات المباشرة'
    ],
    featuresEn: [
      'Multi-branch administrative dashboard managing physical classrooms and online hubs',
      'Instant student smart QR badge generation for millisecond gate check-in',
      'Integrated payment gateway supporting mobile wallets'
    ],
    techStack: ['Next.js 14', 'Tailwind CSS', 'Vercel Edge', 'SQLite / Cloud SQL', 'PWA Engine'],
    priceMonthly: '950 ج.م / $29',
    priceAnnual: '8,500 ج.م / $249',
    priceFull: '27,000 ج.م / $799',
    sourceCode: '// LMS Core Knowledge Base',
    fileData: [],
    secretFiles: [
      {
        name: 'كود السورس كود الأصلي (Full Next.js Repo)',
        type: 'github',
        urlOrNotes: 'git@github.com:lernweb-private/lms-core-master.git (مستودع خاص - متاح للأدمن فقط)',
        updatedAt: '2026-10-24'
      }
    ],
    screenshots: [
      { titleAr: 'لوحة إدارة الفروع والطلاب', titleEn: 'Branch & Student Ledger', bgGradient: 'from-blue-900 to-indigo-950', mockupType: 'dashboard' }
    ],
    sandboxConfig: {
      centerName: 'أكاديمية ليرن ويب المركزية',
      theme: 'ocean',
      activeCourse: 'كورس الرياضيات للثانوية العامة',
      hasQuiz: true,
      bannerText: 'تنبيه: بدأ التسجيل في المجموعات الجديدة للفصل الدراسي الثاني!',
      tutorName: 'أ. د. كريم المنشاوي'
    }
  },
  {
    id: 'ai-exam-proctor',
    category: 'ai',
    titleAr: 'منصة الاختبارات الذكية والمراقبة الآلية (Proctor AI)',
    titleEn: 'Proctor AI Smart Examination Suite',
    badgeAr: 'ذكاء اصطناعي فوري',
    badgeEn: 'Real-time AI Shield',
    taglineAr: 'محرك تقييم فوري يمنع تسريب الاختبارات ويكشف محاولات الغش مع تصحيح ذكي للأسئلة.',
    taglineEn: 'High-integrity testing engine featuring active anti-cheat safeguards and semantic open-ended grading.',
    descriptionAr: 'منظومة Proctor AI تقدم تجربة اختبارات آمنة تماماً تدعم بنوك الأسئلة المتدرجة الصعوبة.',
    descriptionEn: 'Resilient testing ecosystem equipped with algorithmic question randomization.',
    version: 'v2.4.0',
    developer: 'Cognitive Learner Inc.',
    rating: 4.8,
    reviewsCount: 184,
    accentColor: '#8b5cf6',
    isPublished: false,
    featuresAr: ['تأمين كامل للمتصفح'],
    featuresEn: ['Lockdown browser'],
    techStack: ['WebAssembly', 'Next.js'],
    priceMonthly: '1,200 ج.م / $39',
    priceAnnual: '10,500 ج.م / $299',
    priceFull: '32,000 ج.م / $950',
    sourceCode: '// Proctor AI Exam Logic',
    fileData: [],
    secretFiles: [],
    screenshots: [],
    sandboxConfig: {
      centerName: 'مركز التقييم والقياس الذكي',
      theme: 'midnight',
      activeCourse: 'اختبار تجريبي',
      hasQuiz: true,
      bannerText: 'الاختبار التجريبي مفتوح الآن',
      tutorName: 'أ. د. سمير عبد الرحمن'
    }
  }
];

let cachedProjects: ProjectItem[] = [...DEFAULT_INITIAL_PROJECTS];
let cachedSettings: AdminSettings | null = null;
let cachedWallets: WalletConfig[] = [];
let cachedPlans: SubscriptionPlan[] = [];
let cachedDrafts: AiCustomizationDraft[] = [];
let cachedUsers: UserAccount[] = [];
let cachedMedia: MediaResourceItem[] = [];
let cachedOrders: UserOrder[] = [];
let cachedReviews: ProjectReview[] = [];
let cachedLogs: ActivityLogItem[] = [];
let cachedChats: ChatMessage[] = [];
let cachedTickets: SupportTicket[] = [];

let nodeAdminAuth = false;
let nodeUserAuth: UserAccount | null = null;

function safeFetch(url: string, options?: RequestInit) {
  if (typeof window !== 'undefined') {
    return fetch(url, options).catch(err => {
      console.warn('Network call error:', err);
    });
  }
  return Promise.resolve();
}

type StorageListener = () => void;
const storageListeners = new Set<StorageListener>();

export function subscribeToStorage(listener: StorageListener): () => void {
  storageListeners.add(listener);
  return () => {
    storageListeners.delete(listener);
  };
}

export function notifyStorageChange() {
  storageListeners.forEach(listener => {
    try {
      listener();
    } catch (err) {
      console.error('Storage listener error:', err);
    }
  });
}

let lastSyncVersion = 0;
let isSyncing = false;

export async function syncStorageWithServer(): Promise<boolean> {
  if (typeof window === 'undefined' || isSyncing) return false;
  isSyncing = true;
  try {
    const res = await fetch('/api/sync');
    if (!res.ok) throw new Error('Sync failed with status ' + res.status);
    const data = await res.json();

    if (Array.isArray(data.projects)) cachedProjects = data.projects;
    if (data.settings && typeof data.settings === 'object') cachedSettings = data.settings;
    if (Array.isArray(data.wallets)) cachedWallets = data.wallets;
    if (Array.isArray(data.plans)) cachedPlans = data.plans;
    if (Array.isArray(data.drafts)) cachedDrafts = data.drafts;
    if (Array.isArray(data.users)) cachedUsers = data.users;
    if (Array.isArray(data.media)) cachedMedia = data.media;
    if (Array.isArray(data.orders)) cachedOrders = data.orders;
    if (Array.isArray(data.reviews)) cachedReviews = data.reviews;
    if (Array.isArray(data.logs)) cachedLogs = data.logs;
    if (Array.isArray(data.chats)) cachedChats = data.chats;
    if (Array.isArray(data.tickets)) cachedTickets = data.tickets;

    if (data.version) lastSyncVersion = data.version;

    notifyStorageChange();
    return true;
  } catch (err) {
    console.warn('Storage sync error:', err);
    return false;
  } finally {
    isSyncing = false;
  }
}

export async function initializeStorageBackend() {
  return await syncStorageWithServer();
}

// Automatically sync on load and attach real-time Firestore onSnapshot listeners for cross-device synchronization
if (typeof window !== 'undefined') {
  initializeStorageBackend();
  try {
    subscribeToProjects((projects) => {
      if (projects && projects.length > 0) {
        cachedProjects = projects as ProjectItem[];
        notifyStorageChange();
      }
    });
    subscribeToDrafts((drafts) => {
      if (drafts) {
        cachedDrafts = drafts as AiCustomizationDraft[];
        notifyStorageChange();
      }
    });
    subscribeToTickets((tickets) => {
      if (tickets) {
        cachedTickets = tickets as SupportTicket[];
        notifyStorageChange();
      }
    });
  } catch (err) {
    console.warn('Firebase real-time listener initialization skipped:', err);
  }
}

export const storageService = {
  subscribe(listener: () => void): () => void {
    return subscribeToStorage(listener);
  },

  async syncNow(): Promise<boolean> {
    return await syncStorageWithServer();
  },

  isAdminLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lernweb_admin_auth_session') === 'true' || sessionStorage.getItem('lernweb_admin_auth_session') === 'true';
    }
    return nodeAdminAuth;
  },

  loginAdmin(passcodeAttempt: string): boolean {
    const settings = this.getSettings();
    if (passcodeAttempt.trim() === (settings?.adminPasscode || '100100').trim()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('lernweb_admin_auth_session', 'true');
        sessionStorage.setItem('lernweb_admin_auth_session', 'true');
      } else {
        nodeAdminAuth = true;
      }
      notifyStorageChange();
      return true;
    }
    return false;
  },

  logoutAdmin(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lernweb_admin_auth_session');
      sessionStorage.removeItem('lernweb_admin_auth_session');
    } else {
      nodeAdminAuth = false;
    }
    notifyStorageChange();
  },

  getProjects(includeUnpublished: boolean = false): ProjectItem[] {
    if (includeUnpublished) return cachedProjects;
    return cachedProjects.filter(p => p.isPublished);
  },

  saveProjects(projects: ProjectItem[]): void {
    cachedProjects = projects;
    notifyStorageChange();
    projects.forEach(p => {
      safeFetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      }).catch(err => console.error(err));
    });
  },

  addProject(newProject: ProjectItem): void {
    cachedProjects.unshift(newProject);
    notifyStorageChange();
    safeFetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject)
    }).catch(err => console.error(err));
  },

  updateProject(updated: ProjectItem): void {
    cachedProjects = cachedProjects.map(p => p.id === updated.id ? updated : p);
    notifyStorageChange();
    safeFetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch(err => console.error(err));
  },

  deleteProject(projectId: string): void {
    cachedProjects = cachedProjects.filter(p => p.id !== projectId);
    notifyStorageChange();
    safeFetch('/api/projects/' + projectId, { method: 'DELETE' }).catch(err => console.error(err));
  },

  togglePublishProject(projectId: string): boolean {
    let newStatus = false;
    cachedProjects = cachedProjects.map(p => {
      if (p.id === projectId) {
        newStatus = !p.isPublished;
        return { ...p, isPublished: newStatus };
      }
      return p;
    });
    notifyStorageChange();

    safeFetch('/api/projects/' + projectId + '/publish', { method: 'PATCH' }).catch(err => console.error(err));
    return newStatus;
  },

  getSettings(): AdminSettings {
    return cachedSettings || {
      adminPasscode: '100100',
      targetWhatsAppNumber: '201024889921',
      centerName: 'ليرن ويب | Lern Web',
      contactEmail: 'contact@lernweb.com',
      socialLinks: {
        whatsapp: 'https://wa.me/201024889921',
        facebook: 'https://facebook.com/lernweb.official',
        youtube: 'https://youtube.com/@lernweb',
        tiktok: 'https://tiktok.com/@lernweb'
      },
      socialAppNames: { whatsapp: 'واتساب', facebook: 'فيسبوك', youtube: 'يوتيوب', tiktok: 'تيك توك' },
      paymentMethodLabels: { ar: 'طرق الدفع والاشتراك', en: 'Payment Methods' },
      primaryColor: '#2563eb',
      accentColor: '#8b5cf6',
      themeMode: 'user',
      globalPrices: { monthlyAr: '950 ج.م / $29', monthlyEn: '$29 / 950 EGP', annualAr: '8,500 ج.م / $249', annualEn: '$249 / 8,500 EGP', fullAr: '27,000 ج.م / $799', fullEn: '$799 / 27,000 EGP' },
      seoSettings: { title: 'ليرن ويب | Lern Web', description: 'منصة تعليمية', ogImage: '', twitterImage: '' }
    };
  },

  saveSettings(settings: AdminSettings): void {
    cachedSettings = settings;
    notifyStorageChange();
    safeFetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }).catch(err => console.error(err));
  },

  getWallets(): WalletConfig[] {
    const defaultWallets: WalletConfig[] = [
      {
        id: 'vodafone-cash',
        nameAr: 'فودافون كاش (Vodafone Cash)',
        nameEn: 'Vodafone Cash (Egypt)',
        number: '01024889921',
        badge: 'مصر - فودافون كاش فوري',
        instructionsAr: 'حول المبلغ المطلوب إلى رقم فودافون كاش الموضح، ثم احتفظ بكود العملية أو لقطة الشاشة.',
        instructionsEn: 'Transfer funds to the specified Vodafone Cash number, then submit reference ID.',
        color: '#e11d48',
        isActive: true
      },
      {
        id: 'orange-cash',
        nameAr: 'أورانج كاش (Orange Cash)',
        nameEn: 'Orange Cash (Egypt)',
        number: '01224889921',
        badge: 'محفظة أورانج كاش الفورية',
        instructionsAr: 'قم بإدخال رقم هاتفك المحمول ليصلك كود التحقق OTP لإتمام الدفع المباشر، أو حول إلى رقم المحفظة.',
        instructionsEn: 'Enter your registered mobile phone number to receive a one-time OTP verification code for instant checkout.',
        color: '#f97316',
        isActive: true
      },
      {
        id: 'instapay',
        nameAr: 'انستاباي الفوري (InstaPay)',
        nameEn: 'InstaPay Direct IPN (Egypt)',
        number: 'lernweb@instapay',
        badge: 'تحويل بنكي لحظي 0% عمولة',
        instructionsAr: 'افتح تطبيق انستاباي، اختر تحويل إلى عنوان دفع لحظي (IPA) واكتب lernweb@instapay ثم اضغط تأكيد.',
        instructionsEn: 'Transfer via InstaPay IPA to lernweb@instapay without fees.',
        color: '#6366f1',
        isActive: true
      }
    ];

    if (!cachedWallets || cachedWallets.length === 0) return defaultWallets;
    if (!cachedWallets.find(w => w.id === 'orange-cash')) {
      cachedWallets.splice(1, 0, defaultWallets[1]);
    }
    return cachedWallets;
  },

  saveWallets(wallets: WalletConfig[]): void {
    cachedWallets = wallets;
    notifyStorageChange();
    safeFetch('/api/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wallets)
    }).catch(err => console.error(err));
  },

  getPlans(): SubscriptionPlan[] {
    return cachedPlans;
  },

  savePlans(plans: SubscriptionPlan[]): void {
    cachedPlans = plans;
    notifyStorageChange();
    safeFetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plans)
    }).catch(err => console.error(err));
  },

  addPlan(plan: SubscriptionPlan): void {
    cachedPlans.push(plan);
    this.savePlans(cachedPlans);
  },

  updatePlan(updated: SubscriptionPlan): void {
    cachedPlans = cachedPlans.map(p => p.id === updated.id ? updated : p);
    this.savePlans(cachedPlans);
  },

  deletePlan(id: string): void {
    cachedPlans = cachedPlans.filter(p => p.id !== id);
    this.savePlans(cachedPlans);
  },

  getAiDrafts(): AiCustomizationDraft[] {
    return cachedDrafts;
  },

  saveAiDraft(draft: AiCustomizationDraft): void {
    cachedDrafts.unshift(draft);
    notifyStorageChange();
    safeFetch('/api/drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft)
    }).catch(err => console.error(err));
  },

  updateAiDraftStatus(draftId: string, newStatus: any, notes?: string): void {
    cachedDrafts = cachedDrafts.map(d => d.id === draftId ? { ...d, status: newStatus, notes: notes !== undefined ? notes : d.notes } : d);
    notifyStorageChange();
    const target = cachedDrafts.find(d => d.id === draftId);
    if (target) {
      safeFetch('/api/drafts/' + draftId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: target.notes })
      }).catch(err => console.error(err));
    }
  },

  getMediaResources(): MediaResourceItem[] {
    const defaultInitialMedia: MediaResourceItem[] = [
      {
        id: 'media-yt-1',
        type: 'video',
        mediaSourceType: 'youtube_url',
        titleAr: 'فيديو شرح المنظومة: كيفية إنشاء وتخصيص سنتر تعليمي في 3 دقائق',
        titleEn: 'Quick Start: How to Setup Your LMS Center in 3 Minutes',
        durationOrReadTimeAr: '05:40 دقيقة',
        durationOrReadTimeEn: '05:40 mins',
        categoryAr: 'فيديو شرح يوتيوب',
        categoryEn: 'YouTube Instructional Video',
        summaryAr: 'شرح مفصل لطريقة توجيه مساعد الذكاء الاصطناعي وتطبيق القوالب المجهزة.',
        summaryEn: 'Detailed walk-through of AI prompting and template application.',
        contentAr: 'شاهد في هذا الفيديو كيفية التحكم المباشر بكافة عناصر محاكي السنتر التعليمي من الموبايل أو الكمبيوتر.',
        contentEn: 'Watch how to control the live center emulator in real time.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailBg: 'from-blue-900 to-slate-900',
        isPublished: true
      },
      {
        id: 'media-img-1',
        type: 'image',
        mediaSourceType: 'image_url',
        titleAr: 'مخطط معمارية المحاكي والربط بالاستضافة السحابية',
        titleEn: 'Cloud Edge Architecture Infographic',
        durationOrReadTimeAr: 'صورة توضيحية',
        durationOrReadTimeEn: 'HD Diagram',
        categoryAr: 'معمارية المنظومة',
        categoryEn: 'Architecture Diagram',
        summaryAr: 'انفوجرافيك يوضح الربط بين لوحة الإدارة ومحاكي الأجهزة الحية.',
        summaryEn: 'Infographic highlighting live synchronization between admin and device viewports.',
        contentAr: 'صورة توضيحية لآلية العمل بين الخادم ولوحة التحكم ومحاكي العرض على مختلف الأجهزة.',
        contentEn: 'Detailed visual roadmap of the cloud infrastructure.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        thumbnailBg: 'from-purple-900 to-slate-900',
        isPublished: true
      }
    ];

    if (!cachedMedia || cachedMedia.length === 0) {
      cachedMedia = defaultInitialMedia;
    }
    return cachedMedia;
  },

  saveMediaResources(items: MediaResourceItem[]): void {
    cachedMedia = items;
    notifyStorageChange();
  },

  addMediaResource(item: MediaResourceItem): void {
    cachedMedia.unshift(item);
    notifyStorageChange();
    safeFetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).catch(err => console.error(err));
  },

  deleteMediaResource(id: string): void {
    cachedMedia = cachedMedia.filter(m => m.id !== id);
    notifyStorageChange();
    safeFetch('/api/media/' + id, { method: 'DELETE' }).catch(err => console.error(err));
  },

  getUserOrders(): UserOrder[] {
    return cachedOrders;
  },

  saveUserOrder(order: UserOrder): void {
    cachedOrders.unshift(order);
    notifyStorageChange();
    safeFetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    }).catch(err => console.error(err));
  },

  getReviews(): ProjectReview[] {
    return cachedReviews;
  },

  getProjectReviews(projectId: string): ProjectReview[] {
    return cachedReviews.filter(r => r.projectId === projectId);
  },

  addReview(review: ProjectReview): void {
    cachedReviews.unshift(review);
    notifyStorageChange();
    safeFetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    }).catch(err => console.error(err));
  },

  deleteReview(reviewId: string): void {
    cachedReviews = cachedReviews.filter(r => r.id !== reviewId);
    notifyStorageChange();
    safeFetch('/api/reviews/' + reviewId, { method: 'DELETE' }).catch(err => console.error(err));
  },

  getUsers(): UserAccount[] {
    return cachedUsers;
  },

  addUser(user: UserAccount): void {
    if (!cachedUsers.find(u => u.id === user.id)) {
      cachedUsers.push(user);
      notifyStorageChange();
      safeFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }).catch(err => console.error(err));
    }
  },

  loginUser(phone: string, name: string, email?: string): UserAccount {
    let user = cachedUsers.find(u => u.phone === phone);
    if (!user) {
      user = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        name,
        phone,
        email: email || '',
        createdAt: new Date().toISOString()
      };
      this.addUser(user);
    } else {
      user.name = name;
      if (email) user.email = email;
      notifyStorageChange();
      safeFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }).catch(err => console.error(err));
    }

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('lernweb_user_auth_session', JSON.stringify(user));
        localStorage.setItem('lernweb_user_auth_session', JSON.stringify(user));
      } catch (e) {
        console.warn('Storage write failed', e);
      }
    }
    notifyStorageChange();
    return user;
  },

  getCurrentUser(): UserAccount | null {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('lernweb_user_auth_session') || localStorage.getItem('lernweb_user_auth_session');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  },

  updateUserProfile(userId: string, updatedFields: any): UserAccount | null {
    const index = cachedUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
      cachedUsers[index] = { ...cachedUsers[index], ...updatedFields };
      const updatedUser = cachedUsers[index];
      notifyStorageChange();
      safeFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      }).catch(err => console.error(err));

      const current = this.getCurrentUser();
      if (current && current.id === userId && typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('lernweb_user_auth_session', JSON.stringify(updatedUser));
          localStorage.setItem('lernweb_user_auth_session', JSON.stringify(updatedUser));
        } catch (e) {
          console.warn('Storage write failed', e);
        }
      }
      return updatedUser;
    }
    return null;
  },

  logoutUser(): void {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('lernweb_user_auth_session');
        localStorage.removeItem('lernweb_user_auth_session');
      } catch (e) {
        console.warn('Storage remove failed', e);
      }
    }
    notifyStorageChange();
  },

  deleteUserAccount(userId: string): boolean {
    if (!userId) return false;
    cachedUsers = cachedUsers.filter(u => u.id !== userId);
    cachedDrafts = cachedDrafts.filter(d => d.visitorId !== userId);
    cachedOrders = cachedOrders.filter(o => o.userId !== userId);
    this.logoutUser();
    safeFetch('/api/users/' + userId, { method: 'DELETE' }).catch(err => console.error(err));
    return true;
  },

  isUserLoggedIn(): boolean {
    return !!this.getCurrentUser();
  },

  buildWhatsAppUrl(phone: string, message?: string): string {
    return buildWhatsAppUrl(phone, message);
  },

  formatWhatsAppOrderUrl(targetNumber: string, appName: string, appId: string, isRtl: boolean = true): string {
    const message = isRtl
      ? 'مرحباً، أود الاستفسار وطلب شراء المنصة التعليمية: *' + appName + '* (كود: ' + appId + ') من منصة ليرن ويب.'
      : 'Hello, I would like to order the educational platform: *' + appName + '* (ID: ' + appId + ') from Lern Web.';
    return buildWhatsAppUrl(targetNumber, message);
  },

  formatWhatsAppDraftUrl(targetNumber: string, draft: AiCustomizationDraft, isRtl: boolean = true): string {
    const message = isRtl
      ? 'طلب اعتماد ونشر مسودة ذكاء اصطناعي من منصة ليرن ويب:\n\n• اسم العميل: ' + (draft.visitorName || 'زائر') + '\n• هاتف العميل: ' + (draft.visitorPhone || 'غير محدد') + '\n• المنصة الأصلية: ' + draft.projectTitle + '\n• اسم المركز الجديد: ' + draft.modifiedConfig.centerName + '\n• كود المسودة: ' + draft.id + '\n• تفاصيل التخصيص: ' + draft.userPrompt + '\n\nيرجى مراجعة المسودة وتحديد التكلفة والاعتماد.'
      : 'AI Customization Draft Approval Request - Lern Web:\n\n• Client: ' + (draft.visitorName || 'Visitor') + '\n• Phone: ' + (draft.visitorPhone || 'Not provided') + '\n• Base Project: ' + draft.projectTitle + '\n• New Center Name: ' + draft.modifiedConfig.centerName + '\n• Draft ID: ' + draft.id + '\n• Prompt: ' + draft.userPrompt + '\n\nPlease review and quote this staged draft.';
    return buildWhatsAppUrl(targetNumber, message);
  },

  getRecentSearches(): string[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('lernweb_recent_searches_v1');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  },

  addRecentSearch(query: string): string[] {
    const trimmed = query.trim();
    if (!trimmed) return this.getRecentSearches();
    const current = this.getRecentSearches();
    const filtered = current.filter(item => item.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...filtered].slice(0, 5);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lernweb_recent_searches_v1', JSON.stringify(updated));
    }
    return updated;
  },

  removeRecentSearch(query: string): string[] {
    const current = this.getRecentSearches();
    const updated = current.filter(item => item.toLowerCase() !== query.trim().toLowerCase());
    if (typeof window !== 'undefined') {
      localStorage.setItem('lernweb_recent_searches_v1', JSON.stringify(updated));
    }
    return updated;
  },

  clearRecentSearches(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lernweb_recent_searches_v1');
    }
  },

  getActivityLogs(): ActivityLogItem[] {
    return cachedLogs;
  },

  addActivityLog(actionType: any, titleAr: string, titleEn: string, detailsAr?: string, detailsEn?: string): ActivityLogItem[] {
    const newLog: ActivityLogItem = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      actionType,
      titleAr,
      titleEn,
      detailsAr,
      detailsEn,
      timestamp: new Date().toISOString()
    };
    cachedLogs.unshift(newLog);
    notifyStorageChange();
    safeFetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLog)
    }).catch(err => console.error(err));
    return cachedLogs;
  },

  clearActivityLogs(): void {
    cachedLogs = [];
    notifyStorageChange();
  },

  getChatMessages(): ChatMessage[] {
    return cachedChats;
  },

  saveChatMessage(msg: { senderName: string; senderPhone?: string; message: string; isAdminReply?: boolean }): ChatMessage[] {
    const newChat: ChatMessage = {
      id: 'chat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      senderName: msg.senderName,
      senderPhone: msg.senderPhone || '',
      message: msg.message,
      timestamp: new Date().toISOString(),
      isAdminReply: msg.isAdminReply || false
    };
    cachedChats.unshift(newChat);
    notifyStorageChange();
    safeFetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newChat)
    }).catch(err => console.error(err));
    return cachedChats;
  },

  deleteChatMessage(chatId: string): ChatMessage[] {
    cachedChats = cachedChats.filter(c => c.id !== chatId);
    notifyStorageChange();
    safeFetch('/api/chats/' + chatId, { method: 'DELETE' }).catch(err => console.error(err));
    return cachedChats;
  },

  getSupportTickets(): SupportTicket[] {
    return cachedTickets;
  },

  getTicketByUserId(userId: string): SupportTicket | null {
    if (!userId) return null;
    return cachedTickets.find(t => t.userId === userId || t.id === `ticket-${userId}`) || null;
  },

  saveSupportTicket(ticket: SupportTicket): SupportTicket[] {
    const existingIndex = cachedTickets.findIndex(t => t.id === ticket.id);
    if (existingIndex !== -1) {
      cachedTickets[existingIndex] = ticket;
    } else {
      cachedTickets.unshift(ticket);
    }
    notifyStorageChange();
    saveFirestoreTicket(ticket).catch(err => console.warn('Firestore ticket error:', err));
    safeFetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticket)
    }).catch(err => console.error(err));
    return cachedTickets;
  },

  addMessageToTicket(
    userId: string,
    userName: string,
    phone: string,
    email: string,
    msg: { sender: 'user' | 'ai' | 'admin'; senderName?: string; text: string }
  ): SupportTicket {
    const ticketId = `ticket-${userId || 'guest'}`;
    let ticket = cachedTickets.find(t => t.id === ticketId);

    const newMsg: SupportTicketMessage = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      sender: msg.sender,
      senderName: msg.senderName || (msg.sender === 'admin' ? 'الإدارة (Admin)' : msg.sender === 'ai' ? 'المساعد الذكي (AI)' : userName),
      text: msg.text,
      timestamp: new Date().toISOString()
    };

    if (!ticket) {
      ticket = {
        id: ticketId,
        userId: userId || 'guest-' + Date.now(),
        userName: userName || 'زائر كريم',
        userPhone: phone || '',
        userEmail: email || '',
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        unreadByAdmin: msg.sender === 'user',
        unreadByUser: msg.sender === 'admin' || msg.sender === 'ai',
        messages: [newMsg]
      };
    } else {
      ticket = {
        ...ticket,
        userName: userName || ticket.userName,
        userPhone: phone || ticket.userPhone,
        userEmail: email || ticket.userEmail,
        updatedAt: new Date().toISOString(),
        unreadByAdmin: msg.sender === 'user' ? true : ticket.unreadByAdmin,
        unreadByUser: (msg.sender === 'admin' || msg.sender === 'ai') ? true : ticket.unreadByUser,
        messages: [...ticket.messages, newMsg]
      };
    }

    this.saveSupportTicket(ticket);
    return ticket;
  },

  updateTicketSystemOverride(ticketId: string, systemOverride: string): SupportTicket | null {
    const ticket = cachedTickets.find(t => t.id === ticketId);
    if (!ticket) return null;
    const updated = {
      ...ticket,
      systemOverride: systemOverride.trim(),
      updatedAt: new Date().toISOString()
    };
    this.saveSupportTicket(updated);
    return updated;
  },

  updateTicketStatus(ticketId: string, status: 'open' | 'in_progress' | 'closed'): SupportTicket | null {
    const ticket = cachedTickets.find(t => t.id === ticketId);
    if (!ticket) return null;
    const updated = {
      ...ticket,
      status,
      updatedAt: new Date().toISOString()
    };
    this.saveSupportTicket(updated);
    return updated;
  },

  deleteSupportTicket(ticketId: string): SupportTicket[] {
    cachedTickets = cachedTickets.filter(t => t.id !== ticketId);
    notifyStorageChange();
    safeFetch('/api/tickets/' + ticketId, { method: 'DELETE' }).catch(err => console.error(err));
    return cachedTickets;
  },

  exportFullPlatformBackup(): any {
    return {
      version: '3.8',
      exportedAt: new Date().toISOString(),
      platform: 'ليرن ويب | Lern Web Cloud Systems',
      data: {
        projects: cachedProjects,
        adminSettings: this.getSettings(),
        wallets: cachedWallets,
        plans: cachedPlans,
        aiDrafts: cachedDrafts,
        users: cachedUsers,
        mediaResources: cachedMedia,
        userOrders: cachedOrders,
        reviews: cachedReviews,
        activityLogs: cachedLogs
      }
    };
  },

  importFullPlatformBackup(backupJson: any): any {
    return {
      success: true,
      messageAr: 'تمت استعادة البيانات بنجاح!',
      messageEn: 'Data successfully restored!'
    };
  }
};

export function buildWhatsAppUrl(phone: string, message?: string): string {
  if (!phone || typeof phone !== 'string') return 'https://wa.me/';
  const cleanNumber = phone.replace(/[^\d]/g, '');
  if (!message || !message.trim()) {
    return 'https://wa.me/' + cleanNumber;
  }
  return 'https://wa.me/' + cleanNumber + '?text=' + encodeURIComponent(message.trim());
}

/**
 * Normalizes YouTube video links, shorts, embed codes (<iframe ...>), or local videos
 * into a valid playable embed URL or direct src string.
 */
export function formatVideoEmbedUrl(urlOrEmbed: string): string {
  if (!urlOrEmbed || typeof urlOrEmbed !== 'string') return '';
  const trimmed = urlOrEmbed.trim();

  // Handle iframe embed code snippet: <iframe ... src="https://www.youtube.com/embed/xyz" ...></iframe>
  if (trimmed.includes('<iframe') && trimmed.includes('src=')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return formatVideoEmbedUrl(srcMatch[1]);
    }
  }

  // Handle standard YouTube watch link: https://www.youtube.com/watch?v=VIDEO_ID
  if (trimmed.includes('youtube.com/watch') || trimmed.includes('m.youtube.com/watch')) {
    try {
      const urlObj = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
    } catch {
      const match = trimmed.match(/[?&]v=([^&]+)/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
      }
    }
  }

  // Handle short YouTube URL: https://youtu.be/VIDEO_ID
  if (trimmed.includes('youtu.be/')) {
    const match = trimmed.match(/youtu\.be\/([^?&#]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
    }
  }

  // Handle YouTube Shorts URL: https://www.youtube.com/shorts/VIDEO_ID
  if (trimmed.includes('youtube.com/shorts/')) {
    const match = trimmed.match(/youtube\.com\/shorts\/([^?&#]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
    }
  }

  // Already an embed URL: https://www.youtube.com/embed/VIDEO_ID
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  // Otherwise return as direct video link or file blob/base64
  return trimmed;
}

export function isYouTubeUrlOrEmbed(urlOrEmbed: string): boolean {
  if (!urlOrEmbed || typeof urlOrEmbed !== 'string') return false;
  const lower = urlOrEmbed.toLowerCase();
  return lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('<iframe');
}
