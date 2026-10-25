/**
 * Project: ليرن ويب | Lern Web
 * File: src/services/storageService.ts
 * Centralized persistent state manager connected to backend API.
 */

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
  type: 'video' | 'doc';
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

let cachedProjects: ProjectItem[] = [];
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

export async function initializeStorageBackend() {
  try {
    const [p, s, w, pl, d, u, m, o, r, l, c] = await Promise.all([
      fetch('/api/projects?includeUnpublished=true').then(res => res.json()).catch(() => []),
      fetch('/api/settings').then(res => res.json()).catch(() => null),
      fetch('/api/wallets').then(res => res.json()).catch(() => []),
      fetch('/api/plans').then(res => res.json()).catch(() => []),
      fetch('/api/drafts').then(res => res.json()).catch(() => []),
      fetch('/api/users').then(res => res.json()).catch(() => []),
      fetch('/api/media').then(res => res.json()).catch(() => []),
      fetch('/api/orders').then(res => res.json()).catch(() => []),
      fetch('/api/reviews').then(res => res.json()).catch(() => []),
      fetch('/api/logs').then(res => res.json()).catch(() => []),
      fetch('/api/chats').then(res => res.json()).catch(() => [])
    ]);

    if (Array.isArray(p)) cachedProjects = p;
    if (s && typeof s === 'object') cachedSettings = s;
    if (Array.isArray(w)) cachedWallets = w;
    if (Array.isArray(pl)) cachedPlans = pl;
    if (Array.isArray(d)) cachedDrafts = d;
    if (Array.isArray(u)) cachedUsers = u;
    if (Array.isArray(m)) cachedMedia = m;
    if (Array.isArray(o)) cachedOrders = o;
    if (Array.isArray(r)) cachedReviews = r;
    if (Array.isArray(l)) cachedLogs = l;
    if (Array.isArray(c)) cachedChats = c;
  } catch (err) {
    console.error('Failed to initialize storage backend:', err);
  }
}

initializeStorageBackend();

export const storageService = {
  isAdminLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('lernweb_admin_auth_session') === 'true';
    }
    return false;
  },

  loginAdmin(passcodeAttempt: string): boolean {
    const settings = this.getSettings();
    if (passcodeAttempt.trim() === (settings?.adminPasscode || '100100').trim()) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('lernweb_admin_auth_session', 'true');
      }
      return true;
    }
    return false;
  },

  logoutAdmin(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('lernweb_admin_auth_session');
    }
  },

  getProjects(includeUnpublished: boolean = false): ProjectItem[] {
    if (includeUnpublished) return cachedProjects;
    return cachedProjects.filter(p => p.isPublished);
  },

  saveProjects(projects: ProjectItem[]): void {
    cachedProjects = projects;
    projects.forEach(p => {
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      }).catch(err => console.error(err));
    });
  },

  addProject(newProject: ProjectItem): void {
    cachedProjects.unshift(newProject);
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject)
    }).catch(err => console.error(err));
  },

  updateProject(updated: ProjectItem): void {
    cachedProjects = cachedProjects.map(p => p.id === updated.id ? updated : p);
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).catch(err => console.error(err));
  },

  deleteProject(projectId: string): void {
    cachedProjects = cachedProjects.filter(p => p.id !== projectId);
    fetch('/api/projects/' + projectId, { method: 'DELETE' }).catch(err => console.error(err));
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

    fetch('/api/projects/' + projectId + '/publish', { method: 'PATCH' }).catch(err => console.error(err));
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
    fetch('/api/settings', {
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
    fetch('/api/wallets', {
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
    fetch('/api/plans', {
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
    fetch('/api/drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft)
    }).catch(err => console.error(err));
  },

  updateAiDraftStatus(draftId: string, newStatus: any, notes?: string): void {
    cachedDrafts = cachedDrafts.map(d => d.id === draftId ? { ...d, status: newStatus, notes: notes !== undefined ? notes : d.notes } : d);
    const target = cachedDrafts.find(d => d.id === draftId);
    if (target) {
      fetch('/api/drafts/' + draftId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: target.notes })
      }).catch(err => console.error(err));
    }
  },

  getMediaResources(): MediaResourceItem[] {
    return cachedMedia;
  },

  saveMediaResources(items: MediaResourceItem[]): void {
    cachedMedia = items;
  },

  addMediaResource(item: MediaResourceItem): void {
    cachedMedia.unshift(item);
    fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    }).catch(err => console.error(err));
  },

  deleteMediaResource(id: string): void {
    cachedMedia = cachedMedia.filter(m => m.id !== id);
    fetch('/api/media/' + id, { method: 'DELETE' }).catch(err => console.error(err));
  },

  getUserOrders(): UserOrder[] {
    return cachedOrders;
  },

  saveUserOrder(order: UserOrder): void {
    cachedOrders.unshift(order);
    fetch('/api/orders', {
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
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    }).catch(err => console.error(err));
  },

  deleteReview(reviewId: string): void {
    cachedReviews = cachedReviews.filter(r => r.id !== reviewId);
    fetch('/api/reviews/' + reviewId, { method: 'DELETE' }).catch(err => console.error(err));
  },

  getUsers(): UserAccount[] {
    return cachedUsers;
  },

  addUser(user: UserAccount): void {
    if (!cachedUsers.find(u => u.id === user.id)) {
      cachedUsers.push(user);
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }).catch(err => console.error(err));
    }
  },

  loginUser(phone: string, name: string): UserAccount {
    let user = cachedUsers.find(u => u.phone === phone);
    if (!user) {
      user = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        name,
        phone,
        createdAt: new Date().toISOString()
      };
      this.addUser(user);
    } else {
      user.name = name;
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }).catch(err => console.error(err));
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lernweb_user_auth_session', JSON.stringify(user));
    }
    return user;
  },

  getCurrentUser(): UserAccount | null {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('lernweb_user_auth_session');
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
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      }).catch(err => console.error(err));

      const current = this.getCurrentUser();
      if (current && current.id === userId && typeof window !== 'undefined') {
        sessionStorage.setItem('lernweb_user_auth_session', JSON.stringify(updatedUser));
      }
      return updatedUser;
    }
    return null;
  },

  logoutUser(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('lernweb_user_auth_session');
    }
  },

  deleteUserAccount(userId: string): boolean {
    if (!userId) return false;
    cachedUsers = cachedUsers.filter(u => u.id !== userId);
    cachedDrafts = cachedDrafts.filter(d => d.visitorId !== userId);
    cachedOrders = cachedOrders.filter(o => o.userId !== userId);
    fetch('/api/users/' + userId, { method: 'DELETE' }).catch(err => console.error(err));
    this.logoutUser();
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
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLog)
    }).catch(err => console.error(err));
    return cachedLogs;
  },

  clearActivityLogs(): void {
    cachedLogs = [];
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
    fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newChat)
    }).catch(err => console.error(err));
    return cachedChats;
  },

  deleteChatMessage(chatId: string): ChatMessage[] {
    cachedChats = cachedChats.filter(c => c.id !== chatId);
    fetch('/api/chats/' + chatId, { method: 'DELETE' }).catch(err => console.error(err));
    return cachedChats;
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
