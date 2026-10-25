/**
 * Project: ليرن ويب | Lern Web
 * File: src/data/storeData.ts
 * Rich catalog of educational engines, media streams, technical articles & payment gateways
 */

export interface AppItem {
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
  featuresAr: string[];
  featuresEn: string[];
  techStack: string[];
  screenshots: {
    titleAr: string;
    titleEn: string;
    bgGradient: string;
    mockupType: 'dashboard' | 'code' | 'quiz' | 'qr' | 'analytics';
  }[];
  downloadUrl: string;
  distributionLink: string;
  defaultSandboxConfig: {
    centerName: string;
    theme: 'ocean' | 'midnight' | 'emerald' | 'amber';
    activeCourse: string;
    hasQuiz: boolean;
    bannerText: string;
  };
}

export const APPS_DATA: AppItem[] = [
  {
    id: 'lms-core-hub',
    category: 'lms',
    titleAr: 'منظومة إدارة المراكز والسناتر التعليمية (LMS Core)',
    titleEn: 'LMS Core Educational Center Manager',
    badgeAr: 'النظام الأساسي المعتمد',
    badgeEn: 'Certified Flagship LMS',
    taglineAr: 'بوابة إلكترونية متكاملة لإدارة الحصص، مجموعات الطلاب، الجداول وسجلات الحضور والغياب للسناتر الكبرى والمدرسين.',
    taglineEn: 'Complete cloud platform for orchestrating classroom sessions, student cohorts, schedules, and fee ledgers.',
    descriptionAr: 'منظومة LMS Core صُممت خصيصاً لمواءمة المتطلبات التشغيلية الواقعية للمراكز التعليمية والسناتر في الشرق الأوسط. تتيح للمدرسين إنشاء بوابات خاصة بأسماء مراكزهم، إدارة المحاضرات الحضورية والأونلاين، تتبع اشتراكات وسداد الطلاب، وإصدار بطاقات باركود ذكية للدخول السريع مع إشعارات واتساب تلقائية لأولياء الأمور فور تسجيل الحضور أو الغياب.',
    descriptionEn: 'Engineered specifically for the real-world operational workflows of tutoring centers and regional academies. Enables educators to deploy white-labeled portals, manage hybrid in-person and digital sessions, automate tuition tracking, and issue dynamic QR smart cards for high-speed student check-in with instant guardian SMS and WhatsApp dispatch.',
    version: 'v3.8.2',
    developer: 'Lern Web Systems & Lab',
    rating: 4.9,
    reviewsCount: 312,
    accentColor: '#3b82f6',
    featuresAr: [
      'لوحة قيادة تفاعلية للمعلمين والإداريين تدعم تعدد الفروع والقاعات',
      'توليد بطاقات QR ذكية لكل طالب لسرعة تسجيل الحضور عند بوابات السنتر',
      'بوابة دفع مدمجة تدعم فودافون كاش، انستاباي، والتحويلات المباشرة',
      'نظام صلاحيات متقدم يفصل بين صلاحيات السكرتارية، المساعدين، والمعلمين',
      'تصدير كشوفات الدرجات والتقارير المالية بصيغة Excel و PDF فورياً'
    ],
    featuresEn: [
      'Multi-branch administrative dashboard managing physical classrooms and online hubs',
      'Instant student smart QR badge generation for millisecond gate check-in',
      'Integrated payment gateway supporting mobile wallets (Vodafone Cash, InstaPay, STC)',
      'Role-based access controls for tutors, teaching assistants, and accounting staff',
      'One-click automated financial reporting and grade export to Excel & PDF'
    ],
    techStack: ['Next.js 14', 'Tailwind CSS', 'Vercel Edge', 'SQLite / Cloud SQL', 'PWA Engine'],
    screenshots: [
      { titleAr: 'لوحة إدارة الفروع والطلاب', titleEn: 'Branch & Student Ledger', bgGradient: 'from-blue-900 to-indigo-950', mockupType: 'dashboard' },
      { titleAr: 'بوابة تسجيل الحضور بالباركود', titleEn: 'QR Gate Check-In Terminal', bgGradient: 'from-sky-900 to-slate-900', mockupType: 'qr' },
      { titleAr: 'مؤشرات الأداء والتحصيل المالي', titleEn: 'Financial Flow Analytics', bgGradient: 'from-indigo-900 to-blue-950', mockupType: 'analytics' }
    ],
    downloadUrl: 'https://github.com/lernweb/lms-core-dist.git',
    distributionLink: 'https://lernweb.com/deploy/lms-core',
    defaultSandboxConfig: {
      centerName: 'أكاديمية ليرن ويب المركزية',
      theme: 'ocean',
      activeCourse: 'كورس الرياضيات للثانوية العامة',
      hasQuiz: true,
      bannerText: 'تنبيه: بدأ التسجيل في المجموعات الجديدة للفصل الدراسي الثاني!'
    }
  },
  {
    id: 'ai-exam-proctor',
    category: 'ai',
    titleAr: 'منصة الاختبارات الذكية والمراقبة الآلية (Proctor AI)',
    titleEn: 'Proctor AI Smart Examination Suite',
    badgeAr: 'ذكاء اصطناعي فوري',
    badgeEn: 'Real-time AI Shield',
    taglineAr: 'محرك تقييم فوري يمنع تسريب الاختبارات ويكشف محاولات الغش مع تصحيح ذكي للأسئلة المقالية والاختيارية.',
    taglineEn: 'High-integrity testing engine featuring active anti-cheat safeguards and semantic open-ended grading.',
    descriptionAr: 'منظومة Proctor AI تقدم تجربة اختبارات آمنة تماماً تدعم بنوك الأسئلة المتدرجة الصعوبة. يقوم المحرك الذكي برصد تبديل النوافذ وشاشات الهاتف، وتوليد نماذج امتحانية عشوائية متباينة الترتيب لكل طالب لمنع الغش الجماعي، بالإضافة إلى تصحيح آلي فوري يوضح للطلاب نقاط الضعف ونماذج الإجابة النموذجية المعتمدة.',
    descriptionEn: 'A resilient testing ecosystem equipped with algorithmic question randomization and active anti-cheat monitoring. Detects tab switches, split-screen anomalies, and external devices while employing semantic AI grading models to evaluate both open-ended conceptual explanations and objective multiple-choice submissions.',
    version: 'v2.4.0',
    developer: 'Cognitive Learner Inc.',
    rating: 4.8,
    reviewsCount: 184,
    accentColor: '#8b5cf6',
    featuresAr: [
      'تأمين كامل للمتصفح مع منع النسخ وتصوير الشاشة وتبديل النوافذ',
      'بنوك أسئلة ديناميكية تعيد ترتيب الأسئلة والخيارات لكل طالب',
      'تصحيح فوري مدعوم بالذكاء الاصطناعي مع تقديم تحليل مفصل لكل إجابة',
      'مؤقت دقيق لكل سؤال مع إمكانية القفل التلقائي عند انتهاء الوقت',
      'سجل زمني دقيق لكل حركة قام بها الطالب داخل نافذة الامتحان'
    ],
    featuresEn: [
      'Lockdown browser environment preventing clipboard copying, screencasts, and tab jumps',
      'Dynamic question pools generating unique permutations per candidate',
      'Instant AI-assisted rubric evaluation with step-by-step diagnostic feedback',
      'Granular per-question countdown timers with auto-submission triggers',
      'Audited interaction telemetry timestamping each student response action'
    ],
    techStack: ['WebAssembly', 'Next.js App Router', 'TensorFlow.js', 'Tailwind CSS', 'Vercel KV'],
    screenshots: [
      { titleAr: 'واجهة الامتحان المقفل والمؤقت', titleEn: 'Lockdown Exam Container', bgGradient: 'from-purple-950 to-slate-900', mockupType: 'quiz' },
      { titleAr: 'تحليل سلوكيات الغش المكتشفة', titleEn: 'Anti-Cheat Telemetry Radar', bgGradient: 'from-violet-900 to-indigo-950', mockupType: 'analytics' },
      { titleAr: 'تقرير تصحيح الإجابات الفوري', titleEn: 'Instant AI Evaluation Card', bgGradient: 'from-purple-900 to-slate-950', mockupType: 'dashboard' }
    ],
    downloadUrl: 'https://github.com/lernweb/proctor-ai.git',
    distributionLink: 'https://lernweb.com/deploy/proctor-ai',
    defaultSandboxConfig: {
      centerName: 'مركز التقييم والقياس الذكي',
      theme: 'midnight',
      activeCourse: 'اختبار تجريبي في الفيزياء والكيمياء',
      hasQuiz: true,
      bannerText: 'الاختبار التجريبي مفتوح الآن: ينتهي الوقت المتبقي تلقائياً بعد 15 دقيقة!'
    }
  },
  {
    id: 'stem-code-lab',
    category: 'stem',
    titleAr: 'مختبر البرمجة والعلوم التفاعلي (Interactive Code Lab)',
    titleEn: 'Interactive Code Lab & STEM Sandbox',
    badgeAr: 'مختبر سحابي للبرمجة',
    badgeEn: 'Cloud Compiler & Terminal',
    taglineAr: 'بيئة تشغيل تفاعلية داخل المتصفح للغات Python, JS, C++ مع شروحات برمجية ومحرر كود متقدم.',
    taglineEn: 'In-browser interactive coding sandbox with live compilers, Monaco editor, and automated grading.',
    descriptionAr: 'يتيح Interactive Code Lab للطلاب كتابة وتصحيح واختبار الأكواد البرمجية مباشرة من المتصفح بدون الحاجة لتثبيت أي برامج على حواسيبهم. يحتوي على دروس خطوة بخطوة في بايثون ومفاهيم تطوير الويب، مع نظام فحص تلقائي لنتائج الأكواد (Unit Testing) يمنح الطالب شارات تفاعلية عند اجتياز كل مسألة بنجاح.',
    descriptionEn: 'Empowers students to author, compile, and execute code directly within their browser without local installation overhead. Features guided curricula for Python, JavaScript, and algorithm fundamentals alongside automated test-runner suites that validate edge cases and award mastery badges upon successful logic compilation.',
    version: 'v4.1.0',
    developer: 'VeloCode Open Education',
    rating: 5.0,
    reviewsCount: 420,
    accentColor: '#10b981',
    featuresAr: [
      'محرر كود متقدم يدعم تلوين الصياغة والإكمال التلقائي الذكي',
      'بيئة تشغيل آمنة للغات بايثون، جافاسكربت، و C++ بدون سيرفر خارجي',
      'أكثر من 150 تحدياً برمجياً تدريجياً من الصفر حتى الاحتراف',
      'إمكانية مشاركة كود الطالب مع المعلم لتلقي الملاحظات الفورية',
      'تصدير المشاريع كصفحات ويب حية ومشاركتها مع زملاء الدراسة'
    ],
    featuresEn: [
      'Advanced code editor with syntax highlighting, indentation guides, and autocomplete',
      'Zero-latency sandboxed WebAssembly execution for Python and JavaScript',
      'Library of 150+ interactive coding katas spanning beginner to competitive tracks',
      'Peer-to-peer real-time tutor code inspection and annotation mode',
      'Instant one-click static web project deployment and live URL sharing'
    ],
    techStack: ['Monaco Editor', 'Pyodide (WebAssembly)', 'Tailwind CSS', 'Vercel Edge Functions'],
    screenshots: [
      { titleAr: 'محرر بايثون والطرفية الحية', titleEn: 'Python Cloud Workspace', bgGradient: 'from-emerald-950 to-teal-900', mockupType: 'code' },
      { titleAr: 'شجرة التحديات والمسائل البرمجية', titleEn: 'Interactive Kata Explorer', bgGradient: 'from-teal-900 to-slate-900', mockupType: 'dashboard' },
      { titleAr: 'سجل تصحيح الكود التلقائي', titleEn: 'Unit-Test Evaluator', bgGradient: 'from-emerald-900 to-cyan-950', mockupType: 'analytics' }
    ],
    downloadUrl: 'https://github.com/lernweb/code-lab.git',
    distributionLink: 'https://lernweb.com/deploy/code-lab',
    defaultSandboxConfig: {
      centerName: 'أكاديمية المبرمج الصغير والذكاء الاصطناعي',
      theme: 'emerald',
      activeCourse: 'معسكر بايثون للمبتدئين: من الصفر إلى أول تطبيق',
      hasQuiz: false,
      bannerText: 'المختبر يعمل بكفاءة 100%: الكود ينفذ داخل المتصفح فورياً.'
    }
  },
  {
    id: 'student-portal-qr',
    category: 'operations',
    titleAr: 'بوابة حضور وبطاقات الطلاب الذكية (Smart Attendance QR)',
    titleEn: 'Smart Attendance QR & Guardian Portal',
    badgeAr: 'تسجيل دخول سريع',
    badgeEn: 'Rapid Gate Scanner',
    taglineAr: 'تطبيق خفيف جداً يثبته حراس الأمن والسكرتارية لمسح بطاقات الطلاب بالهاتف في أجزاء من الثانية.',
    taglineEn: 'Ultra-lightweight scanner application for instant student card scanning and immediate parental sync.',
    descriptionAr: 'حل عملي وفعال لأزمة طوابير الدخول في السناتر الكبرى. يسمح للسكرتارية بمسح كود الطالب بواسطة كاميرا الهاتف العادية دون الحاجة لأجهزة مسح باهظة الثمن. يقوم التطبيق فورياً بالتأكد من سداد الطالب للاشتراك الشهري وعرض صورته وبياناته، مع إرسال إشعار لحظي لواتساب ولي الأمر يؤكد وصول الطالب وسلامته داخل السنتر.',
    descriptionEn: 'The definitive solution for eliminating bottleneck congestion at major education centers. Uses standard smartphone cameras to scan dynamic encrypted student badges in under 200 milliseconds. Cross-checks tuition status in real-time, displays photo verification, and triggers automatic WhatsApp check-in confirmations to parent numbers.',
    version: 'v1.9.5',
    developer: 'GateWay EduSys',
    rating: 4.7,
    reviewsCount: 96,
    accentColor: '#f59e0b',
    featuresAr: [
      'مسح فائق السرعة لكود QR في أقل من 200 مللي ثانية بالكاميرا العادية',
      'العمل الكامل أوفلاين مع مزامنة البيانات تلقائياً عند استعادة الإنترنت',
      'إشعار فوري لولي الأمر عبر واتساب وسجل يومي لغياب وحضور المجموعات',
      'كشف الطلاب المتأخرين عن سداد الرسوم تلقائياً مع تنبيه سري للسكرتارية',
      'إمكانية طباعة بطاقات هوية بلاستيكية أو إلكترونية لكل طالب بسهولة'
    ],
    featuresEn: [
      'Sub-200ms optical QR parsing using device camera with offline resilience',
      'Automatic bi-directional synchronization once internet connection resumes',
      'Automated parent WhatsApp dispatch confirming arrival and dismissal times',
      'Discreet fee status indicators alerting reception staff of pending dues',
      'One-click printable plastic ID card generation with encrypted QR payloads'
    ],
    techStack: ['ZXing / Web Barcode API', 'PWA Offline Cache', 'Next.js App Router', 'Tailwind CSS'],
    screenshots: [
      { titleAr: 'شاشة ماسح الكاميرا السريع', titleEn: 'Camera Scanner Interface', bgGradient: 'from-amber-950 to-orange-950', mockupType: 'qr' },
      { titleAr: 'بطاقة الطالب الرقمية وحالة الرسوم', titleEn: 'Verified Student Badge', bgGradient: 'from-amber-900 to-slate-900', mockupType: 'dashboard' },
      { titleAr: 'سجل الحضور اليومي للمجموعات', titleEn: 'Daily Cohort Attendance Log', bgGradient: 'from-orange-950 to-amber-950', mockupType: 'analytics' }
    ],
    downloadUrl: 'https://github.com/lernweb/smart-qr-gate.git',
    distributionLink: 'https://lernweb.com/deploy/smart-qr',
    defaultSandboxConfig: {
      centerName: 'بوابة الحضور السريع - سنتر القمة',
      theme: 'amber',
      activeCourse: 'مجموعة المتميزين - الصف الثالث الثانوي',
      hasQuiz: false,
      bannerText: 'نظام مسح الكاميرا نشط: تم مسح 148 طالباً اليوم بنجاح!'
    }
  },
  {
    id: 'ecommerce-saas-store',
    category: 'operations',
    titleAr: 'منظومة المتاجر الإلكترونية المتكاملة (SaaS E-Commerce Hub)',
    titleEn: 'Multi-Vendor SaaS E-Commerce Platform',
    badgeAr: 'متجر إلكتروني شامل',
    badgeEn: 'Enterprise E-Commerce',
    taglineAr: 'منصة تجارة إلكترونية متكاملة لبيع المنتجات الرقمية والفيزيائية مع إدارة المخزون وبوابات الدفع.',
    taglineEn: 'Complete multi-vendor e-commerce ecosystem with automated inventory, checkout flows, and analytics.',
    descriptionAr: 'منظومة تجارية متكاملة لإنشاء المتاجر الإلكترونية الاحترافية، تتيح للتاجر عرض المنتجات، إدارة المخزون اللحظي، تتبع الشحنات، واستقبال المدفوعات عبر محفظة فودافون كاش وبطاقات الائتمان.',
    descriptionEn: 'Comprehensive commerce engine enabling merchants to launch online storefronts, manage live inventory, track fulfillment, and accept digital payments.',
    version: 'v3.2.0',
    developer: 'Lern Web Commerce Lab',
    rating: 4.9,
    reviewsCount: 245,
    accentColor: '#0284c7',
    featuresAr: [
      'إدارة المنتجات، الأقسام، والمخزون اللحظي مع تنبيهات نفاد الكمية',
      'سلة تسوق ذكية وبوابة إتمام طلب (Checkout) سلسة وسريعة',
      'لوحة تحكم للمبيعات والأرباح مع رسوم بيانية تفصيلية لحركة الطلبات',
      'دعم الشحن الدولي والمحلي وحساب ضرائب الشحن تلقائياً'
    ],
    featuresEn: [
      'Real-time product catalog, category hierarchy, and inventory alerts',
      'Optimized one-page checkout cart with secure payment routing',
      'Executive sales analytics dashboard tracking revenue and conversion rates',
      'Automated shipping rate calculation and tax compliance rules'
    ],
    techStack: ['Next.js 14', 'Tailwind CSS', 'Stripe / Wallets', 'PostgreSQL / SQLite'],
    screenshots: [
      { titleAr: 'لوحة مبيعات المتجر والطلبات', titleEn: 'Store Sales & Orders Ledger', bgGradient: 'from-sky-950 to-blue-900', mockupType: 'dashboard' },
      { titleAr: 'تحليلات الأداء المالي وسلة التسوق', titleEn: 'Checkout & Financial Telemetry', bgGradient: 'from-blue-900 to-indigo-950', mockupType: 'analytics' }
    ],
    downloadUrl: 'https://github.com/lernweb/ecommerce-saas.git',
    distributionLink: 'https://lernweb.com/deploy/ecommerce',
    defaultSandboxConfig: {
      centerName: 'متجر ليرن ويب الرقمي والتجاري',
      theme: 'ocean',
      activeCourse: 'منتجات العصر الرقمي والبرمجيات',
      hasQuiz: false,
      bannerText: 'خصم 20% على كافة المنتجات الرقمية لفترة محدودة!'
    }
  },
  {
    id: 'ai-content-generator',
    category: 'ai',
    titleAr: 'منصة توليد المحتوى والتسويق بالذكاء الاصطناعي (AI Copywriter)',
    titleEn: 'AI Content & Marketing Copywriting Suite',
    badgeAr: 'مولد محتوى ذكي',
    badgeEn: 'Generative AI Suite',
    taglineAr: 'منصة ذكاء اصطناعي متكاملة لتوليد المقالات، إعلانات السوشيال ميديا، والردود التسويقية تلقائياً.',
    taglineEn: 'AI-powered writing assistant for generating blogs, ad copy, social media posts, and landing page texts.',
    descriptionAr: 'أداة سحابية متقدمة لتوليد النصوص التسويقية الاحترافية والمحتوى الإعلاني بلغات متعددة بضغطة زر واحدة.',
    descriptionEn: 'Advanced cloud utility generating professional marketing copy, blog outlines, and ad scripts in seconds.',
    version: 'v2.8.0',
    developer: 'Cognitive GenAI Labs',
    rating: 4.9,
    reviewsCount: 389,
    accentColor: '#8b5cf6',
    featuresAr: [
      'توليد مقالات تحسين محركات البحث (SEO) متكاملة الهياكل',
      'صياغة إعلانات فيسبوك وتويتر وجوجل الجذابة لزيادة المبيعات',
      'ترجمة وتلخيص النصوص الطويلة بدقة فائقة وسرعة قياسية'
    ],
    featuresEn: [
      'SEO-optimized blog article generator with structural subheadings',
      'High-converting ad copy generator for social media marketing',
      'Instant document summarization and multi-language translation'
    ],
    techStack: ['Gemini 3.8 Flash API', 'Next.js', 'Tailwind CSS'],
    screenshots: [
      { titleAr: 'محرر ومولد النصوص الذكي', titleEn: 'AI Copywriting Studio', bgGradient: 'from-purple-950 to-slate-900', mockupType: 'code' },
      { titleAr: 'تحليلات المحتوى المُولّد', titleEn: 'Content Analytics Hub', bgGradient: 'from-indigo-950 to-purple-900', mockupType: 'dashboard' }
    ],
    downloadUrl: 'https://github.com/lernweb/ai-copywriter.git',
    distributionLink: 'https://lernweb.com/deploy/ai-copywriter',
    defaultSandboxConfig: {
      centerName: 'مختبر توليد المحتوى الذكي',
      theme: 'midnight',
      activeCourse: 'مساعد التسويق الذكي والذكاء التوليدي',
      hasQuiz: false,
      bannerText: 'تم توليد أكثر من 15,000 مقال وإعلان تسويقي بنجاح!'
    }
  }
];

export interface WalletOption {
  id: string;
  nameAr: string;
  nameEn: string;
  number: string;
  badge: string;
  instructionsAr: string;
  instructionsEn: string;
  color: string;
}

export const WALLET_OPTIONS: WalletOption[] = [
  {
    id: 'vodafone-cash',
    nameAr: 'فودافون كاش (Vodafone Cash)',
    nameEn: 'Vodafone Cash (Egypt)',
    number: '01024889921',
    badge: 'مصر - الأكثر استخداماً',
    instructionsAr: 'حول المبلغ المطلوب عبر كود *9*7*الرقم*المبلغ# أو تطبيق أنا فودافون، ثم انسخ كود العملية أو احتفظ بلقطة الشاشة.',
    instructionsEn: 'Transfer funds via *9*7*Number*Amount# or Ana Vodafone app, then save transaction screenshot or reference number.',
    color: '#e11d48'
  },
  {
    id: 'orange-cash',
    nameAr: 'أورانج كاش (Orange Cash)',
    nameEn: 'Orange Cash (Egypt)',
    number: '01224889921',
    badge: 'محفظة أورانج كاش الفورية',
    instructionsAr: 'قم بإدخال رقم هاتفك المحمول ليصلك كود التحقق OTP لإتمام الدفع المباشر، أو حول إلى رقم المحفظة.',
    instructionsEn: 'Enter your registered mobile phone number to receive a one-time OTP verification code for instant checkout.',
    color: '#f97316'
  },
  {
    id: 'instapay',
    nameAr: 'انستاباي الفوري (InstaPay)',
    nameEn: 'InstaPay Direct IPN (Egypt)',
    number: 'lernweb@instapay',
    badge: 'تحويل بنكي لحظي 0% عمولة',
    instructionsAr: 'افتح تطبيق انستاباي، اختر تحويل إلى عنوان دفع لحظي (IPA) واكتب lernweb@instapay، ثم اضغط تأكيد.',
    instructionsEn: 'Open InstaPay app, transfer to Instant Payment Address (IPA) lernweb@instapay and submit transaction ID.',
    color: '#6366f1'
  },
  {
    id: 'stc-pay',
    nameAr: 'إس تي سي باي (STC Pay)',
    nameEn: 'STC Pay (Saudi Arabia & Gulf)',
    number: '+966509823412',
    badge: 'المملكة العربية السعودية والخليج',
    instructionsAr: 'حول إلى رقم الجوال المسجل عبر تطبيق STC Pay واختر تحويل محلي فوري، وسيتم تفعيل حسابك مباشرة.',
    instructionsEn: 'Transfer via STC Pay mobile application to the registered phone number with instant cross-border activation.',
    color: '#8b5cf6'
  },
  {
    id: 'bank-wire',
    nameAr: 'التحويل البنكي الدولي (IBAN / Wire)',
    nameEn: 'Direct Bank Wire (IBAN Transfer)',
    number: 'EG380002000100000012345678901',
    badge: 'البنك التجاري الدولي CIB',
    instructionsAr: 'قم بإجراء تحويل بنكي على حساب شركة ليرن ويب تكنولوجيز، ثم أرفق إشعار التحويل البنكي لتفعيل رخصة التملك.',
    instructionsEn: 'Execute wire transfer to Lern Web Technologies account with IBAN reference for full enterprise release.',
    color: '#0284c7'
  }
];

export interface MediaItem {
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
}

export const MEDIA_RESOURCES: MediaItem[] = [
  {
    id: 'doc-vercel-edge',
    type: 'doc',
    titleAr: 'الدليل التقني: نشر ليرن ويب على شبكة Vercel Edge في ثوانٍ',
    titleEn: 'Technical Documentation: Deploying Lern Web on Vercel Edge Network',
    durationOrReadTimeAr: 'قراءة في 6 دقائق',
    durationOrReadTimeEn: '6 min read',
    categoryAr: 'توثيق المطورين',
    categoryEn: 'Developer Docs',
    summaryAr: 'خطوات إعداد ملفات Next.js App Router، ربط مستودع GitHub، وتهيئة متغيرات البيئة للتشغيل العالمي فائق السرعة.',
    summaryEn: 'Detailed guide for configuring Next.js App Router files, connecting GitHub repo, and configuring Edge runtime.',
    thumbnailBg: 'from-emerald-950 to-slate-900',
    contentAr: `# دليل النشر السريع على Vercel Edge
1. انسخ الكود غير المضغوط من تبويب "أكواد Next.js لـ VS Code".
2. افتح مشروعك في VS Code وقم بإنشاء مجلدات:
   - app/layout.jsx
   - app/page.jsx
   - components/AppStore.jsx
   - components/SandboxPreview.jsx
   - public/manifest.json
   - app/sw.js
3. قم بتشغيل الأمر:
   \`npm install next react react-dom tailwindcss lucide-react\`
4. ارفع المشروع إلى مستودع GitHub الخاص بك.
5. ادخل إلى لوحة تحكم Vercel واضغط "Import Project"، وسيقوم Vercel تلقائياً باكتشاف إعدادات Next.js ونشر الموقع في أقل من 40 ثانية مع دعم كامل لـ HTTPS و Edge CDN المجاني!`,
    contentEn: `# Instant Vercel Edge Deployment Guide
1. Copy the uncompressed Next.js source code from the "VS Code Source Files" tab.
2. Open your local project inside VS Code and create the canonical structure:
   - app/layout.jsx
   - app/page.jsx
   - components/AppStore.jsx
   - components/SandboxPreview.jsx
   - public/manifest.json
   - app/sw.js
3. Execute standard dependencies:
   \`npm install next react react-dom tailwindcss lucide-react\`
4. Push your commits to GitHub.
5. In your Vercel Dashboard, select "Import Project". Vercel auto-detects Next.js and deploys to global Edge nodes in under 40 seconds with automated TLS certificate provisioning!`
  },
  {
    id: 'doc-pwa-standalone',
    type: 'doc',
    titleAr: 'الدليل المعماري: معايير PWA والعمل بدون إنترنت (Offline Sync)',
    titleEn: 'Architecture Whitepaper: Standalone PWA & Offline Service Worker',
    durationOrReadTimeAr: 'قراءة في 5 دقائق',
    durationOrReadTimeEn: '5 min read',
    categoryAr: 'المعمارية السحابية',
    categoryEn: 'Architecture Guide',
    summaryAr: 'شرح آلية عمل Service Worker في تخزين واجهات المركز، وضمان تشغيل امتحانات الطلاب حتى عند انقطاع الشبكة.',
    summaryEn: 'Deep-dive into service worker precaching, background sync, and offline exam resilience.',
    thumbnailBg: 'from-amber-950 to-slate-900',
    contentAr: `### معمارية التخزين المحلي والـ PWA
تعتمد منصة ليرن ويب على استراتيجية CacheFirst للأصول الثابتة (الخطوط، الأيقونات، الواجهات) واستراتيجية NetworkFirst مع Fallback فوري للبيانات الديناميكية.
عندما يقوم الطالب ببدء الامتحان، يقوم الـ Service Worker بحفظ كافة الأسئلة محلياً في IndexedDB، بحيث إذا انقطع الاتصال يستمر المؤقت ويعمل الامتحان بشكل طبيعي، وفور عودة الإنترنت يتم إرسال الإجابات تلقائياً للسيرفر.`,
    contentEn: `### Offline Caching & PWA Architecture
Lern Web employs a CacheFirst caching strategy for immutable assets (fonts, icons, shell styles) and a resilient NetworkFirst fallback for dynamic student data.
During student assessments, the Service Worker guarantees zero disruptions by staging responses inside local IndexedDB and performing atomic sync upon network restoration.`
  }
];
