import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const aiApiKey = process.env.GEMINI_API_KEY || '';
if (!aiApiKey) {
  console.warn('⚠️ WARNING: GEMINI_API_KEY is not set in process.env. AI features will likely fail.');
}

const ai = new GoogleGenAI({
  apiKey: aiApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const dbFile = path.resolve(process.cwd(), 'lernweb_db.json');

interface DatabaseSchema {
  version: number;
  lastModified: number;
  projects: any[];
  settings: any;
  wallets: any[];
  plans: any[];
  ai_drafts: any[];
  users: any[];
  media_resources: any[];
  user_orders: any[];
  reviews: any[];
  activity_logs: any[];
  chat_messages: any[];
  support_tickets: any[];
}

function loadDb(): DatabaseSchema {
  try {
    if (fs.existsSync(dbFile)) {
      const content = fs.readFileSync(dbFile, 'utf-8');
      const parsed = JSON.parse(content);
      if (!parsed.version) parsed.version = 1;
      if (!parsed.lastModified) parsed.lastModified = Date.now();
      return parsed;
    }
  } catch (e) {
    console.error('Error loading DB file:', e);
  }

  // Default initial data
  const initialDb: DatabaseSchema = {
    version: 1,
    lastModified: Date.now(),
    projects: [
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
        isPublished: false, // Unpublished by default as requested
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
        sourceCode: `// LMS Core Knowledge Base\nexport const config = {\n  version: "3.8.2",\n  features: ["QR_GATE", "PAYMENTS", "ROLE_RBAC"],\n  theme: "blue-modern"\n};`,
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
          { titleAr: 'لوحة إدارة الفروع والطلاب', titleEn: 'Branch & Student Ledger', bgGradient: 'from-blue-900 to-indigo-950', mockupType: 'dashboard' },
          { titleAr: 'بوابة تسجيل الحضور بالباركود', titleEn: 'QR Gate Check-In Terminal', bgGradient: 'from-sky-900 to-slate-900', mockupType: 'qr' }
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
        isPublished: false, // Unpublished by default
        featuresAr: [
          'تأمين كامل للمتصفح مع منع النسخ وتصوير الشاشة وتبديل النوافذ',
          'بنوك أسئلة ديناميكية تعيد ترتيب الأسئلة والخيارات لكل طالب',
          'تصحيح فوري مدعوم بالذكاء الاصطناعي مع تقديم تحليل مفصل لكل إجابة'
        ],
        featuresEn: [
          'Lockdown browser environment preventing clipboard copying and tab jumps',
          'Dynamic question pools generating unique permutations per candidate',
          'Instant AI-assisted rubric evaluation with step-by-step diagnostic feedback'
        ],
        techStack: ['WebAssembly', 'Next.js App Router', 'TensorFlow.js', 'Tailwind CSS'],
        priceMonthly: '1,200 ج.م / $39',
        priceAnnual: '10,500 ج.م / $299',
        priceFull: '32,000 ج.م / $950',
        sourceCode: `// Proctor AI Exam Logic\nconst antiCheat = {\n  lockBrowser: true,\n  trackTabSwitch: true,\n  aiScoring: "semantic"\n};`,
        fileData: [],
        secretFiles: [
          {
            name: 'نماذج الكشف الذكي بالـ AI (TensorFlow Weights)',
            type: 'zip',
            urlOrNotes: 'https://storage.lernweb.internal/models/proctor-ai-weights.tar.gz',
            updatedAt: '2026-10-22'
          }
        ],
        screenshots: [
          { titleAr: 'واجهة الامتحان المقفل والمؤقت', titleEn: 'Lockdown Exam Container', bgGradient: 'from-purple-950 to-slate-900', mockupType: 'quiz' }
        ],
        sandboxConfig: {
          centerName: 'مركز التقييم والقياس الذكي',
          theme: 'midnight',
          activeCourse: 'اختبار تجريبي في الفيزياء والكيمياء',
          hasQuiz: true,
          bannerText: 'الاختبار التجريبي مفتوح الآن: ينتهي الوقت المتبقي تلقائياً بعد 15 دقيقة!',
          tutorName: 'أ. د. سمير عبد الرحمن'
        }
      }
    ],
    settings: {
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
      socialAppNames: {
        whatsapp: 'واتساب',
        facebook: 'فيسبوك',
        youtube: 'يوتيوب',
        tiktok: 'تيك توك'
      },
      paymentMethodLabels: { ar: 'طرق الدفع والاشتراك', en: 'Payment & Subscription Methods' },
      primaryColor: '#2563eb',
      accentColor: '#8b5cf6',
      themeMode: 'user',
      globalPrices: {
        monthlyAr: '950 ج.م / $29',
        monthlyEn: '$29 / 950 EGP',
        annualAr: '8,500 ج.م / $249',
        annualEn: '$249 / 8,500 EGP',
        fullAr: '27,000 ج.م / $799',
        fullEn: '$799 / 27,000 EGP'
      },
      seoSettings: {
        title: 'ليرن ويب | Lern Web - المنظومة التعليمية السحابية المتكاملة',
        description: 'سوق أدوات ومحاكي مراكز تعليمية متطورة مع محرك PWA وترخيص مرن وتملك كامل للكود المصدري.',
        ogImage: '/og-image.png',
        twitterImage: '/twitter-image.png'
      }
    },
    wallets: [
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
    ],
    plans: [
      {
        id: 'plan-monthly',
        nameAr: 'الاشتراك الشهري المرن',
        nameEn: 'Flexible Monthly Rental',
        priceAr: '950 ج.م / $29',
        priceEn: '$29 / 950 EGP',
        periodAr: 'شهرياً',
        periodEn: 'per month',
        badgeAr: 'للمراكز الناشئة',
        badgeEn: 'Starter Centers',
        descriptionAr: 'مثالي للمدرسين والسناتر الصغيرة التي تبدأ رحلتها الرقمية.',
        descriptionEn: 'Ideal for individual tutors and growing tutoring centers.',
        isPopular: false,
        accentColor: '#3b82f6'
      },
      {
        id: 'plan-annual',
        nameAr: 'الترخيص السنوي المتقدم',
        nameEn: 'Advanced Annual License',
        priceAr: '8,500 ج.م / $249',
        priceEn: '$249 / 8,500 EGP',
        periodAr: 'سنوياً',
        periodEn: 'per year',
        badgeAr: 'الأكثر طلباً',
        badgeEn: 'Most Popular',
        descriptionAr: 'يشمل اسم نطاق خاص بالمركز، دعم فني فوري، وسعة غير محدودة.',
        descriptionEn: 'Includes Custom Domain, VIP priority SLA, and unlimited quotas.',
        isPopular: true,
        accentColor: '#3b82f6'
      },
      {
        id: 'plan-full',
        nameAr: 'التملك الكامل للكود المصدر',
        nameEn: 'Full Outright Source Buyout',
        priceAr: '27,000 ج.م / $799',
        priceEn: '$799 / 27,000 EGP',
        periodAr: 'دفعة واحدة',
        periodEn: 'one-time payment',
        badgeAr: 'ملكية مدى الحياة',
        badgeEn: 'White-Label Ownership',
        descriptionAr: 'احصل على كامل الكود المصدري بدون أي اشتراكات شهرية.',
        descriptionEn: 'Receive complete uncompressed source code. Zero recurring fees.',
        isPopular: false,
        accentColor: '#8b5cf6'
      }
    ],
    ai_drafts: [],
    users: [],
    media_resources: [],
    user_orders: [],
    reviews: [],
    activity_logs: [
      {
        id: 'log-1',
        actionType: 'settings_updated',
        titleAr: 'تحديث تفضيلات مظهر المنصة',
        titleEn: 'Site-wide Theme Preferences Updated',
        detailsAr: 'تم ضبط وضع الثيم الشامل وتأكيد حفظ إعدادات النظام.',
        detailsEn: 'Configured global theme preference and saved settings.',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString()
      }
    ],
    chat_messages: [],
    support_tickets: []
  };

  try {
    fs.writeFileSync(dbFile, JSON.stringify(initialDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to initialize lernweb_db.json on disk:', err);
  }

  return initialDb;
}

function saveDb(data: DatabaseSchema) {
  try {
    data.version = (data.version || 0) + 1;
    data.lastModified = Date.now();
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving DB file:', e);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  let db = loadDb();

  // Full cross-device sync endpoint
  app.get('/api/sync', (req, res) => {
    db = loadDb();
    res.json({
      version: db.version || 1,
      lastModified: db.lastModified || Date.now(),
      projects: db.projects,
      settings: db.settings,
      wallets: db.wallets,
      plans: db.plans,
      drafts: db.ai_drafts,
      users: db.users,
      media: db.media_resources,
      orders: db.user_orders,
      reviews: db.reviews,
      logs: db.activity_logs,
      chats: db.chat_messages || [],
      tickets: db.support_tickets || []
    });
  });

  // API Routes
  app.get('/api/projects', (req, res) => {
    db = loadDb();
    const includeUnpublished = req.query.includeUnpublished === 'true';
    if (includeUnpublished) {
      res.json(db.projects);
    } else {
      res.json(db.projects.filter(p => p.isPublished));
    }
  });

  app.post('/api/projects', (req, res) => {
    db = loadDb();
    const p = req.body;
    const index = db.projects.findIndex(item => item.id === p.id);
    if (index !== -1) {
      db.projects[index] = p;
    } else {
      db.projects.unshift(p);
    }
    saveDb(db);
    res.json({ success: true });
  });

  app.delete('/api/projects/:id', (req, res) => {
    db = loadDb();
    db.projects = db.projects.filter(p => p.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  app.patch('/api/projects/:id/publish', (req, res) => {
    db = loadDb();
    const project = db.projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    project.isPublished = !project.isPublished;
    saveDb(db);
    res.json({ success: true, isPublished: project.isPublished });
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    db = loadDb();
    res.json(db.settings || {});
  });

  app.post('/api/settings', (req, res) => {
    db = loadDb();
    db.settings = req.body;
    saveDb(db);
    res.json({ success: true });
  });

  // Wallets
  app.get('/api/wallets', (req, res) => {
    db = loadDb();
    res.json(db.wallets);
  });

  app.post('/api/wallets', (req, res) => {
    db = loadDb();
    db.wallets = req.body;
    saveDb(db);
    res.json({ success: true });
  });

  // AI Drafts
  app.get('/api/drafts', (req, res) => {
    db = loadDb();
    res.json(db.ai_drafts);
  });

  app.post('/api/drafts', (req, res) => {
    db = loadDb();
    const d = req.body;
    const index = db.ai_drafts.findIndex(item => item.id === d.id);
    if (index !== -1) {
      db.ai_drafts[index] = d;
    } else {
      db.ai_drafts.unshift(d);
    }
    saveDb(db);
    res.json({ success: true });
  });

  app.patch('/api/drafts/:id', (req, res) => {
    db = loadDb();
    const { status, notes } = req.body;
    const draft = db.ai_drafts.find(d => d.id === req.params.id);
    if (draft) {
      draft.status = status;
      if (notes !== undefined) draft.notes = notes;
      saveDb(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Draft not found' });
    }
  });

  // Users
  app.get('/api/users', (req, res) => {
    db = loadDb();
    res.json(db.users);
  });

  app.post('/api/users', (req, res) => {
    db = loadDb();
    const u = req.body;
    const index = db.users.findIndex(item => item.id === u.id);
    if (index !== -1) {
      db.users[index] = u;
    } else {
      db.users.push(u);
    }
    saveDb(db);
    res.json({ success: true });
  });

  app.delete('/api/users/:id', (req, res) => {
    db = loadDb();
    const userId = req.params.id;
    db.users = db.users.filter(u => u.id !== userId);
    db.ai_drafts = db.ai_drafts.filter(d => d.visitorId !== userId);
    db.user_orders = db.user_orders.filter(o => o.userId !== userId);
    saveDb(db);
    res.json({ success: true });
  });

  // Plans
  app.get('/api/plans', (req, res) => {
    db = loadDb();
    res.json(db.plans);
  });

  app.post('/api/plans', (req, res) => {
    db = loadDb();
    db.plans = req.body;
    saveDb(db);
    res.json({ success: true });
  });

  // Media
  app.get('/api/media', (req, res) => {
    db = loadDb();
    res.json(db.media_resources);
  });

  app.post('/api/media', (req, res) => {
    db = loadDb();
    const m = req.body;
    const index = db.media_resources.findIndex(item => item.id === m.id);
    if (index !== -1) {
      db.media_resources[index] = m;
    } else {
      db.media_resources.unshift(m);
    }
    saveDb(db);
    res.json({ success: true });
  });

  app.delete('/api/media/:id', (req, res) => {
    db = loadDb();
    db.media_resources = db.media_resources.filter(m => m.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // Orders
  app.get('/api/orders', (req, res) => {
    db = loadDb();
    res.json(db.user_orders);
  });

  app.post('/api/orders', (req, res) => {
    db = loadDb();
    const o = req.body;
    db.user_orders.unshift(o);
    saveDb(db);
    res.json({ success: true });
  });

  // Reviews
  app.get('/api/reviews', (req, res) => {
    db = loadDb();
    res.json(db.reviews);
  });

  app.post('/api/reviews', (req, res) => {
    db = loadDb();
    const r = req.body;
    db.reviews.unshift(r);
    saveDb(db);
    res.json({ success: true });
  });

  app.delete('/api/reviews/:id', (req, res) => {
    db = loadDb();
    db.reviews = db.reviews.filter(r => r.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // Activity Logs
  app.get('/api/logs', (req, res) => {
    db = loadDb();
    res.json(db.activity_logs);
  });

  app.post('/api/logs', (req, res) => {
    db = loadDb();
    db.activity_logs.unshift(req.body);
    saveDb(db);
    res.json({ success: true });
  });

  // Chat Messages (Connected to Admin Dashboard & AI Support Chat)
  app.get('/api/chats', (req, res) => {
    db = loadDb();
    res.json(db.chat_messages || []);
  });

  app.post('/api/chats', (req, res) => {
    db = loadDb();
    if (!db.chat_messages) db.chat_messages = [];
    db.chat_messages.unshift(req.body);
    saveDb(db);
    res.json({ success: true });
  });

  app.delete('/api/chats/:id', (req, res) => {
    db = loadDb();
    if (db.chat_messages) {
      db.chat_messages = db.chat_messages.filter(c => c.id !== req.params.id);
      saveDb(db);
    }
    res.json({ success: true });
  });

  // Support Tickets API
  app.get('/api/tickets', (req, res) => {
    db = loadDb();
    res.json(db.support_tickets || []);
  });

  app.post('/api/tickets', (req, res) => {
    db = loadDb();
    if (!db.support_tickets) db.support_tickets = [];
    const ticket = req.body;
    const index = db.support_tickets.findIndex(t => t.id === ticket.id);
    if (index !== -1) {
      db.support_tickets[index] = ticket;
    } else {
      db.support_tickets.unshift(ticket);
    }
    saveDb(db);
    res.json({ success: true, ticket });
  });

  app.delete('/api/tickets/:id', (req, res) => {
    db = loadDb();
    if (db.support_tickets) {
      db.support_tickets = db.support_tickets.filter(t => t.id !== req.params.id);
      saveDb(db);
    }
    res.json({ success: true });
  });

  // Robust Multi-Model AI Generator with Exponential Backoff and Attempt Timeout
  async function generateAiContentWithRetry(params: any, retries = 1) {
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let lastError: any = null;

    const timeoutPromise = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error(`AI generation timed out after ${ms}ms`)), ms));

    for (const model of candidateModels) {
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const apiCall = ai.models.generateContent({
            ...params,
            model
          });

          const response: any = await Promise.race([apiCall, timeoutPromise(8000)]);
          if (response && response.text) {
            return response;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`[AI] Model ${model} attempt ${attempt + 1} encountered:`, err?.message || err);
          if (attempt < retries) {
            const delay = Math.min(500 * Math.pow(2, attempt) + Math.random() * 200, 2000);
            await new Promise(r => setTimeout(r, delay));
          }
        }
      }
    }
    throw lastError || new Error('All AI models failed to respond');
  }

  // AI Chat Route
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history, systemInstruction } = req.body;
      if (!message) return res.status(400).json({ error: 'Message is required' });

      if (!aiApiKey) {
        throw new Error('GEMINI_API_KEY is missing from environment');
      }

      const contents = [];
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          if (msg.text && msg.sender) {
            contents.push({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
            });
          }
        });
      }
      
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const defaultSystemInstruction = `
أنت "المساعد الذكي الرسمي لمنصة ليرن ويب (Lern Web AI)".
طبيعتك وأسلوبك:
- تجيب ببراعة بجميع اللغات واللهجات، وبشكل خاص باللهجة العامية المصرية الودودة واللبقة والأصيلة (المصرية الدارجة الراقية).
- إذا تحدث العميل بالعامية المصرية أو الفصحى أو الإنجليزية، تجاوبه فوراً بنفس الأسلوب واللغة.
- إجاباتك دقيقة وواضحة، مفيدة وكاملة وتساعد المعلم وصاحب السنتر على اتخاذ قراره.

معلومات منصة ليرن ويب (Lern Web):
1. التعريف: المنظومة التعليمية السحابية المتكاملة لإدارة المراكز التعليمية والسناتر والمدارس والمدرسين الخصوصيين.
2. باقات الاشتراك والأسعار:
   - الاشتراك الشهري المرن: 950 ج.م / $29 شهرياً (بدون التزام طويل).
   - الترخيص السنوي المتقدم: 8,500 ج.م / $249 سنوياً (الأكثر طلباً، نطاق خاص، سعة غير محدودة، دعم أولوية VIP).
   - التملك الكامل للكود المصدري (White-Label Buyout): 27,000 ج.م / $799 دفعة واحدة فقط مدى الحياة بدون أي اشتراكات متكررة.
3. طرق الدفع المعتمدة:
   - فودافون كاش (Vodafone Cash): 01024889921
   - أورانج كاش (Orange Cash): 01224889921
   - انستاباي (InstaPay IPN): lernweb@instapay
4. أهم الخصائص التقنية والتشغيلية:
   - نظام الحضور الذكي QR Gate Check-in في أقل من 200 مللي ثانية مع إشعار ولي الأمر.
   - محرك الاختبارات الذكية الآمنة Proctor AI لمنع الغش وتأمين المتصفح وتصحيح ذكي للأسئلة.
   - محاكي Sandbox التفاعلي لتجربة المنصة وتخصيص اسمها وشعارها وألوانها فوراً في المتصفح.
   - دعم كامل لتطبيقات الهواتف والعمل أوفلاين بمحرك PWA الحديث.
   - تملك كامل للكود المصدري Next.js مع قواعد بيانات سحابية وتكامل كامل.
   - دعم فني متواصل عبر واتساب والبريد.
لا تظهر أي أخطاء جافة، واحرص على الترحيب بالعميل وتقديم المساعدة الصادقة والسريعة دائماً.
`;

      const response = await generateAiContentWithRetry({
        contents: contents,
        config: {
          systemInstruction: systemInstruction || defaultSystemInstruction,
          temperature: 0.7,
        }
      });

      if (!response.text) {
        throw new Error('Model returned an empty response');
      }

      res.json({ text: response.text, _v: '3.8.0' });
    } catch (err: any) {
      console.error('AI Chat Error:', err.message || err);
      const errorMsg = typeof err.details === 'string' ? err.details : (err.message || JSON.stringify(err));
      res.status(500).json({ 
        error: 'AI connection failed', 
        details: errorMsg,
        _v: '3.8.0'
      });
    }
  });

  // AI Project Customization Route (For Sandbox)
  app.post('/api/ai/customize', async (req, res) => {
    try {
      const { prompt, baseConfig } = req.body;
      if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

      if (!aiApiKey) throw new Error('GEMINI_API_KEY missing');

      const systemInstruction = `
You are an expert software architect for "Lern Web". 
Return strictly JSON:
{
  "explanationAr": "...",
  "explanationEn": "...",
  "theme": "ocean" | "midnight" | "emerald" | "amber",
  "centerName": "...",
  "activeCourse": "...",
  "bannerText": "...",
  "tutorName": "...",
  "hasQuiz": true | false
}
`;

      const response = await generateAiContentWithRetry({
        contents: [
          {
            role: 'user',
            parts: [{ text: `Base Config: ${JSON.stringify(baseConfig)}\n\nRequest: "${prompt}"` }]
          }
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      res.json({
        success: true,
        explanationAr: parsed.explanationAr || 'تم تحليل طلبك.',
        explanationEn: parsed.explanationEn || 'Analyzed.',
        suggestedConfig: {
          centerName: parsed.centerName || baseConfig.centerName,
          theme: ['ocean', 'midnight', 'emerald', 'amber'].includes(parsed.theme) ? parsed.theme : baseConfig.theme,
          activeCourse: parsed.activeCourse || baseConfig.activeCourse,
          hasQuiz: typeof parsed.hasQuiz === 'boolean' ? parsed.hasQuiz : baseConfig.hasQuiz,
          bannerText: parsed.bannerText || baseConfig.bannerText,
          tutorName: parsed.tutorName || baseConfig.tutorName
        }
      });
    } catch (err: any) {
      console.error('AI Customize Critical Failure:', err);
      res.status(500).json({ error: 'Customization failed', details: err.message });
    }
  });

  // Backup
  app.get('/api/backup', (req, res) => {
    db = loadDb();
    res.json({ version: '3.8', exportedAt: new Date().toISOString(), data: db });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
  }

  const port = 3000;
  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
