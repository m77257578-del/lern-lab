/**
 * Next.js Project Structure Identifier:
 * components/SandboxPreview.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: Isolated iframe sandbox container mimicking dynamic center builds,
 *          multi-device responsive emulator (Desktop, Tablet, Mobile),
 *          AI prompt customization workspace, instructional media channels,
 *          and 3-tier flexible billing checkout with localized mobile wallet routing.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, Tablet, Smartphone, RotateCcw, Sparkles, Send, CheckCircle2, 
  Copy, ExternalLink, ShieldCheck, CreditCard, Play, BookOpen, AlertCircle, 
  Settings2, Eye, Award, QrCode, MessageSquare, Video, FileText, ChevronRight,
  TrendingUp, Users, Check, Code2, X, Save
} from 'lucide-react';

import { processAiCustomizationPrompt } from '../src/services/geminiService';
import { storageService, buildWhatsAppUrl } from '../src/services/storageService';

/**
 * @param {object} props
 * @param {string} props.lang
 * @param {any} props.t
 * @param {any} props.initialConfig
 * @param {any[]} props.wallets
 * @param {any[]} props.mediaResources
 * @param {Function} props.onOpenBillingModal
 * @param {string} props.targetWhatsAppNumber
 * @param {boolean} props.isAdmin
 * @param {boolean} props.isUserLoggedIn
 * @param {Function} props.onOpenLogin
 * @param {import('../src/services/storageService').AdminSettings} props.adminSettings
 * @param {any[]} [props.plans]
 */
export default function SandboxPreview({ 
  lang = 'ar', 
  t, 
  initialConfig, 
  wallets, 
  mediaResources, 
  onOpenBillingModal,
  targetWhatsAppNumber = '201024889921',
  isAdmin = false,
  isUserLoggedIn = false,
  onOpenLogin = () => {},
  adminSettings,
  plans = []
}) {
  const isRtl = lang === 'ar';
  const paymentLabels = adminSettings?.paymentMethodLabels || { ar: t.billingTitle, en: t.billingTitle };

  // Device Viewport State
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'

  // Is this an unapproved visitor AI draft fork?
  const [isVisitorDraft, setIsVisitorDraft] = useState(false);
  const [draftSentToAdmin, setDraftSentToAdmin] = useState(false);

  // Dynamic Center Runtime State (Can be modified via AI workspace or controls)
  const [centerConfig, setCenterConfig] = useState(
    initialConfig || {
      centerName: 'أكاديمية ليرن ويب التجريبية | Lern Web Academy',
      theme: 'ocean', // 'ocean' | 'midnight' | 'emerald' | 'amber'
      bannerText: 'تنبيه عاجل: تم تفعيل رابط حضور المحاضرات التفاعلية ونماذج الاختبارات لشهر أكتوبر!',
      activeCourse: 'كورس البرمجة المتقدمة والفيزياء الحديثة',
      activeTab: 'courses', // 'courses' | 'quiz' | 'qr'
      studentCount: 1420,
      tutorName: 'أ. د. كريم المنشاوي',
      hasQuiz: true,
      quizScore: null
    }
  );

  // Update centerConfig if parent passes new initialConfig
  useEffect(() => {
    if (initialConfig) {
      setCenterConfig((prev) => ({
        ...prev,
        ...initialConfig
      }));
    }
  }, [initialConfig]);

  // AI Customization Assistant Chat State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiIsThinking, setAiIsThinking] = useState(false);
  const [aiChatLog, setAiChatLog] = useState([
    {
      role: 'assistant',
      text: isRtl 
        ? 'مرحباً بك في استوديو التخصيص الذكي! يمكنك توجيهي بأي طلب لتعديل مظهر، كورسات، أو وظائف المركز التعليمي مباشرة داخل المحاكي.'
        : 'Welcome to the AI Customizer Studio! Prompt me with any refinement to instantaneously reshape the live center simulator.'
    }
  ]);

  // Checkout Billing & Mobile Wallet Modal State
  const [selectedPlan, setSelectedPlan] = useState(null); // 'monthly' | 'annual' | 'full'
  const [selectedWalletId, setSelectedWalletId] = useState('vodafone-cash');
  const [transactionRef, setTransactionRef] = useState('');
  const [hasCopiedNumber, setHasCopiedNumber] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  // Media Tab State
  const [activeMediaItem, setActiveMediaItem] = useState(mediaResources ? mediaResources[0] : null);

  // Source Code Viewing/Editing State
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [editedSourceCode, setEditedSourceCode] = useState(initialConfig?.sourceCode || '');

  // Iframe Element Reference
  const iframeRef = useRef(null);

  // Generate dynamic srcDoc HTML for the isolated sandbox container
  const generateSandboxHtml = () => {
    const themeStyles = {
      ocean: {
        bg: '#0b132b',
        card: '#1c2541',
        primary: '#3a86ff',
        text: '#ffffff',
        accent: '#4895ef'
      },
      midnight: {
        bg: '#0f172a',
        card: '#1e293b',
        primary: '#8b5cf6',
        text: '#ffffff',
        accent: '#a78bfa'
      },
      emerald: {
        bg: '#022c22',
        card: '#064e3b',
        primary: '#10b981',
        text: '#ffffff',
        accent: '#34d399'
      },
      amber: {
        bg: '#1c1917',
        card: '#292524',
        primary: '#f59e0b',
        text: '#ffffff',
        accent: '#fbbf24'
      }
    };

    const currentTheme = themeStyles[centerConfig.theme] || themeStyles.ocean;

    return `
      <!DOCTYPE html>
      <html lang="${lang}" dir="${isRtl ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: ${isRtl ? "'Cairo', system-ui, sans-serif" : "'Inter', system-ui, sans-serif"};
            background-color: ${currentTheme.bg};
            color: ${currentTheme.text};
            padding: 18px;
            overflow-x: hidden;
            line-height: 1.5;
          }
          .custom-scrollbar::-webkit-scrollbar { width: 5px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 999px; }
          .card { background-color: ${currentTheme.card}; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 18px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); }
          .btn-primary { background-color: ${currentTheme.primary}; color: #ffffff; border: none; padding: 8px 16px; border-radius: 12px; font-weight: 700; font-size: 12px; cursor: pointer; transition: opacity 0.2s; }
          .btn-primary:hover { opacity: 0.9; }
          .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
          .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
          .flex-between { display: flex; align-items: center; justify-content: space-between; }
        </style>
      </head>
      <body class="custom-scrollbar">
        
        <!-- Center Header Nav -->
        <header class="card flex-between" style="margin-bottom: 16px; padding: 14px 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; background-color: ${currentTheme.primary}; color: #ffffff; box-shadow: 0 4px 12px ${currentTheme.primary}40;">
              LW
            </div>
            <div>
              <h1 style="font-weight: 800; font-size: 16px; margin: 0;">${centerConfig.centerName}</h1>
              <p style="font-size: 12px; opacity: 0.75; margin-top: 2px;">
                ${isRtl ? 'المشرف الأكاديمي:' : 'Lead Tutor:'} ${centerConfig.tutorName} • <span style="color: #34d399;">● ${centerConfig.studentCount} ${isRtl ? 'طالب مقيد' : 'students'}</span>
              </p>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3);">
              ${isRtl ? 'بوابة المركز الحية' : 'Live Center Shell'}
            </span>
          </div>
        </header>

        <!-- Urgent Tutor Announcement Banner -->
        ${centerConfig.bannerText ? `
          <div style="background: ${currentTheme.primary}20; border: 1px solid ${currentTheme.primary}50; border-radius: 12px; padding: 12px 16px; margin-bottom: 16px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 16px;">📢</span>
            <span style="flex: 1;">${centerConfig.bannerText}</span>
          </div>
        ` : ''}

        <!-- Interactive Course Grid & Live Modules -->
        <main style="display: flex; flex-direction: column; gap: 16px;">
          <div class="flex-between">
            <h2 style="font-size: 16px; font-weight: 800;">${isRtl ? 'المقررات والحصص التفاعلية المتاحة' : 'Active Cohorts & Lectures'}</h2>
            <span style="font-size: 12px; opacity: 0.6;">${isRtl ? 'مُحدث لحظياً' : 'Real-time sync'}</span>
          </div>

          <div class="grid-2">
            <!-- Course Card 1: Active Main Course -->
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div class="flex-between" style="margin-bottom: 8px;">
                  <span class="badge" style="background-color: ${currentTheme.primary}; color: #ffffff;">
                    ${isRtl ? 'المحاضرة الحالية' : 'Current Cohort'}
                  </span>
                  <span style="font-size: 12px; color: #fbbf24; font-weight: 700;">★ 4.9 (340)</span>
                </div>
                <h3 style="font-size: 15px; font-weight: 800; margin-bottom: 6px;">${centerConfig.activeCourse}</h3>
                <p style="font-size: 12px; opacity: 0.8; line-height: 1.6;">
                  ${isRtl 
                    ? 'شرح شامل مع بنوك أسئلة تفاعلية ومختبر تجارب مباشر. تشمل الحصة حل تدريبات واختبار إلكتروني سريع.'
                    : 'Comprehensive instructional session with dynamic diagnostic katas and continuous mastery check.'}
                </p>
              </div>

              <div class="flex-between" style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                <span style="font-size: 12px; color: #34d399; font-weight: 700;">${isRtl ? 'نسبة الحضور: 98%' : 'Attendance: 98%'}</span>
                <button onclick="handleEnterRoom()" class="btn-primary">
                  ${isRtl ? 'دخول القاعة الذكية' : 'Enter Smart Room'}
                </button>
              </div>
            </div>

            <!-- Course Card 2: Interactive Quiz Simulation -->
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div class="flex-between" style="margin-bottom: 8px;">
                  <span class="badge" style="background-color: #8b5cf6; color: #ffffff;">
                    ${isRtl ? 'الاختبار التفاعلي الذكي' : 'Smart Interactive Quiz'}
                  </span>
                  <span style="font-size: 12px; color: #fbbf24; font-family: monospace;">⏱️ 10:00</span>
                </div>

                <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">${isRtl ? 'سؤال التقييم اللحظي للطلاب:' : 'Live Student Evaluation Question:'}</h3>
                
                <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px; font-size: 12px; margin-bottom: 10px;">
                  ${isRtl 
                    ? 'س: ما هي التقنية الأساسية التي تضمن تشغيل تطبيقات PWA بدون إنترنت واستقلاليتها؟' 
                    : 'Q: Which core technology guarantees PWA offline execution and standalone behavior?'}
                </div>

                <!-- Interactive Quiz Answers -->
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <button id="optA" onclick="handleAnswer('A')" style="text-align: inherit; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05); color: #ffffff; font-size: 12px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                    <span>${isRtl ? 'أ) محرك Service Worker مع استراتيجيات التخزين المحلي' : 'A) Service Worker with cache storage policies'}</span>
                    <span id="badgeA"></span>
                  </button>
                  <button id="optB" onclick="handleAnswer('B')" style="text-align: inherit; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05); color: #ffffff; font-size: 12px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                    <span>${isRtl ? 'ب) زيادة استهلاك كروت الشاشة في الخادم السحابي' : 'B) Overclocking GPU cards in cloud servers'}</span>
                    <span id="badgeB"></span>
                  </button>
                </div>
                <div id="quizResult" style="font-size: 12px; font-weight: 700; text-align: center; display: none; margin-top: 8px;"></div>
              </div>

              <div class="flex-between" style="margin-top: 14px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 11px; opacity: 0.6;">
                <span>${isRtl ? 'تصحيح آلي فوري' : 'Instant AI Grading'}</span>
                <span>ID: #QZ-902</span>
              </div>
            </div>
          </div>

          <!-- Bottom Attendance Terminal Bar -->
          <div class="card flex-between" style="flex-wrap: wrap; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 20px;">
                📱
              </div>
              <div>
                <h4 style="font-size: 14px; font-weight: 700; margin: 0;">${isRtl ? 'محطة حضور الطلاب السريعة (QR Smart Gate)' : 'Student Rapid Gate Scanner (QR)'}</h4>
                <p style="font-size: 12px; opacity: 0.75; margin-top: 2px;">${isRtl ? 'مسح بطاقة الطالب يستغرق 180ms مع إرسال إشعار فوري لولي الأمر' : 'Sub-200ms optical scan with automated parent dispatch'}</p>
              </div>
            </div>

            <button onclick="simulateScan()" id="scanBtn" class="btn-primary" style="padding: 10px 18px;">
              ${isRtl ? 'محاكاة مسح بطاقة طالب الآن' : 'Simulate Card Scan'}
            </button>
          </div>
          <div id="scanResult" style="display: none; padding: 12px; border-radius: 12px; background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-size: 12px; font-weight: 700; text-align: center;"></div>
        </main>

        <!-- Center Footer -->
        <footer style="margin-top: 24px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; font-size: 11px; opacity: 0.5;">
          ${isRtl ? 'مشغل بواسطة منصة ليرن ويب السحابية • ترخيص مركز معتمد v3.8' : 'Powered by Lern Web Cloud Ecosystem • Enterprise License v3.8'}
        </footer>

        <script>
          function handleAnswer(choice) {
            const resultDiv = document.getElementById('quizResult');
            const badgeA = document.getElementById('badgeA');
            const badgeB = document.getElementById('badgeB');
            
            if (choice === 'A') {
              badgeA.innerHTML = '✅ ${isRtl ? 'إجابة صحيحة 100%' : '100% Correct'}';
              badgeA.style.color = '#34d399';
              resultDiv.style.color = '#34d399';
              resultDiv.style.display = 'block';
              resultDiv.innerText = '${isRtl ? 'ممتاز! تم احتساب 10/10 في سجل درجات الطالب.' : 'Excellent! 10/10 logged to student gradebook.'}';
            } else {
              badgeB.innerHTML = '❌ ${isRtl ? 'إجابة خاطئة' : 'Incorrect'}';
              badgeB.style.color = '#f87171';
              resultDiv.style.color = '#f87171';
              resultDiv.style.display = 'block';
              resultDiv.innerText = '${isRtl ? 'حاول ثانية! الإجابة الصحيحة هي (أ) Service Worker.' : 'Try again! Correct choice is (A) Service Worker.'}';
            }
          }

          function simulateScan() {
            const btn = document.getElementById('scanBtn');
            const res = document.getElementById('scanResult');
            btn.innerText = '${isRtl ? 'جاري قراءة الـ QR...' : 'Reading QR payload...'}';
            
            setTimeout(() => {
              btn.innerText = '${isRtl ? 'تم المسح بنجاح' : 'Scan Complete'}';
              res.style.display = 'block';
              res.innerText = '${isRtl ? '✅ تم تسجيل حضور الطالب: أحمد محمود (الصف الثالث الثانوي) - تم إرسال رسالة واتساب لولي الأمر: 01099887766' : '✅ Verified Student: Ahmed Mahmoud (Cohort #3) - WhatsApp dispatch confirmed to guardian'}';
              setTimeout(() => {
                btn.innerText = '${isRtl ? 'محاكاة مسح بطاقة طالب الآن' : 'Simulate Card Scan'}';
              }, 4000);
            }, 400);
          }

          function handleEnterRoom() {
            alert('${isRtl ? 'تم فتح القاعة الذكية التفاعلية ومزامنة حضور الطالب!' : 'Smart Classroom connected with live attendance telemetry!'}');
          }
        </script>
      </body>
      </html>
    `;
  };

  // Reload iframe function
  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = generateSandboxHtml();
    }
  };

  // Conversational AI Prompt Handler using Free Gemini AI and Staged Forking
  const handleAiSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!isUserLoggedIn && !isAdmin) {
      onOpenLogin();
      return;
    }

    if (!aiPrompt.trim()) return;

    const userPromptText = aiPrompt.trim();
    setAiPrompt('');
    setAiChatLog((prev) => [...prev, { role: 'user', text: userPromptText }]);
    setAiIsThinking(true);

    try {
      const result = await processAiCustomizationPrompt(userPromptText, centerConfig);
      
      setCenterConfig((prev) => ({
        ...prev,
        ...result.suggestedConfig
      }));

      setIsVisitorDraft(true);

      const generatedFiles = [
        {
          id: `file-config-${Date.now()}`,
          name: `center_config_${(result.suggestedConfig.centerName || 'custom').replace(/\s+/g, '_')}.json`,
          type: 'application/json',
          fileCategory: 'json_config',
          featureMetadata: `ملف التهيئة والبيانات المعدلة بالذكاء الاصطناعي بناءً على طلب: "${userPromptText}"`,
          content: JSON.stringify(result.suggestedConfig, null, 2),
          updatedAt: new Date().toISOString().split('T')[0]
        },
        {
          id: `file-src-${Date.now()}`,
          name: `AppCore_${(result.suggestedConfig.centerName || 'custom').replace(/\s+/g, '_')}.jsx`,
          type: 'text/javascript',
          fileCategory: 'react_app',
          featureMetadata: 'كود سورس المنصة والمكونات التفاعلية المخصصة',
          content: editedSourceCode || `// AI Customization Source\nexport const config = ${JSON.stringify(result.suggestedConfig, null, 2)};`,
          updatedAt: new Date().toISOString().split('T')[0]
        }
      ];

      if (initialConfig?.fileData && initialConfig.fileData.length > 0) {
        initialConfig.fileData.forEach((f, idx) => {
          generatedFiles.push({
            id: `file-forked-${idx}-${Date.now()}`,
            name: `forked_${f.name}`,
            type: f.type || 'application/octet-stream',
            fileCategory: f.fileCategory || 'source_code_zip',
            featureMetadata: `نسخة مستنسخة ومعدلة بالذكاء الاصطناعي من الملف الأصلي (${f.name})`,
            content: f.base64 || '// Cloned file content',
            updatedAt: new Date().toISOString().split('T')[0]
          });
        });
      }

      // Save draft into admin queue
      const currentVisitor = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('lernweb_current_visitor') || '{}')
        : {};

      storageService.saveAiDraft({
        id: `draft-${Date.now()}`,
        projectId: initialConfig?.id || 'custom-ai-draft',
        projectTitle: result.suggestedConfig.centerName,
        visitorId: currentVisitor.id || '',
        visitorName: currentVisitor.name || (isRtl ? 'زائر المحاكي' : 'Sandbox Visitor'),
        visitorPhone: currentVisitor.phone || '',
        userPrompt: userPromptText,
        forkedAt: new Date().toLocaleTimeString(),
        status: 'pending_review',
        modifiedCode: editedSourceCode,
        modifiedConfig: result.suggestedConfig,
        modifiedFiles: generatedFiles
      });

      const responseText = isRtl 
        ? `${result.explanationAr}\n\n⚠️ تم حفظ التعديل كـ "مسودة تجريبية خاصة بك". لا يمكن للزوار نشرها مباشرة. يمكنك إرسال المسودة للأدمن للاعتماد عبر واتساب.`
        : `${result.explanationEn}\n\n⚠️ Staged as private draft. Direct publishing restricted. You can transmit this draft to the administrator via WhatsApp for authorization.`;

      setAiChatLog((prev) => [...prev, { role: 'assistant', text: responseText }]);
    } catch (err) {
      console.error('AI execution error:', err);
      setAiChatLog((prev) => [...prev, { role: 'assistant', text: isRtl ? 'تم تطبيق التعديلات المحلية على المحاكي.' : 'Local draft updated.' }]);
    } finally {
      setAiIsThinking(false);
    }
  };

  const handleCopyWalletNumber = (num) => {
    navigator.clipboard.writeText(num);
    setHasCopiedNumber(true);
    setTimeout(() => setHasCopiedNumber(false), 2500);
  };

  const handleConfirmManualPayment = () => {
    if (!transactionRef.trim()) {
      alert(isRtl ? 'يرجى إدخال رقم العملية المرجعي أولاً' : 'Please provide transaction ID or reference number');
      return;
    }
    setPaymentSubmitted(true);
    setTimeout(() => {
      setPaymentSubmitted(false);
      setSelectedPlan(null);
      setTransactionRef('');
      alert(isRtl ? 'تم استقبال إشعار الدفع بنجاح! سيتم تفعيل ترخيص مركزك وإرسال بيانات النطاق خلال دقائق.' : 'Payment receipt received! Your center license will be unlocked within minutes.');
    }, 2000);
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Sandbox Controller Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-4 md:p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20 animate-pulse" />
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {t.sandboxTitle}
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            {t.sandboxSubtitle}
          </p>
        </div>

        {/* Viewport Device Selectors & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-2xl border border-slate-800 bg-slate-950 p-1">
            <button
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                viewport === 'desktop' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">{t.viewportDesktop}</span>
            </button>

            <button
              onClick={() => setViewport('tablet')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                viewport === 'tablet' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden sm:inline">{t.viewportTablet}</span>
            </button>

            <button
              onClick={() => setViewport('mobile')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                viewport === 'mobile' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">{t.viewportMobile}</span>
            </button>
          </div>

          {/* Theme Quick Switcher */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-950 p-1">
            {[
              { id: 'ocean', color: '#3b82f6', label: 'أزرق' },
              { id: 'midnight', color: '#8b5cf6', label: 'ليلي' },
              { id: 'emerald', color: '#10b981', label: 'زمرد' },
              { id: 'amber', color: '#f59e0b', label: 'عنبر' }
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => setCenterConfig((prev) => ({ ...prev, theme: th.id }))}
                className={`h-7 w-7 rounded-lg transition-transform ${
                  centerConfig.theme === th.id ? 'scale-110 ring-2 ring-white' : 'opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: th.color }}
                title={th.label}
              />
            ))}
          </div>

          <button
            onClick={handleReload}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.reloadSandbox}</span>
          </button>

          <button
            onClick={() => setIsSourceModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-600/10 px-3.5 py-2 text-xs font-bold text-blue-300 hover:bg-blue-600 hover:text-white transition shadow"
          >
            <Code2 className="w-4 h-4" />
            <span>{isRtl ? 'عرض وتعديل السورس كود' : 'View/Edit Source'}</span>
          </button>
        </div>
      </div>

      {/* Visitor AI Staged Draft Notice & Admin WhatsApp Submission */}
      {isVisitorDraft && (
        <div className="rounded-2xl border border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl animate-fadeIn">
          <div className="space-y-1 text-xs md:text-sm">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{isRtl ? 'وضع المسودة التجريبية المستنسخة بالذكاء الاصطناعي (Staged Fork)' : 'Staged AI Clone Draft Active'}</span>
            </div>
            <p className="text-slate-300">
              {isRtl 
                ? 'تم تطبيق التعديلات بنجاح على نسخة معزولة للمعاينة. لا يمكن النشر العام المباشر. يمكنك إرسال التعديل للأدمن للاعتماد عبر واتساب.'
                : 'Modifications rendered in an isolated preview sandbox. Direct store publishing is restricted to the administrator.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={buildWhatsAppUrl(
                targetWhatsAppNumber,
                isRtl 
                  ? `السلام عليكم، قمت بتجربة تعديل الذكاء الاصطناعي في منصة ليرن ويب.\nاسم الأكاديمية المقترح: *${centerConfig.centerName}*\nالكورس: *${centerConfig.activeCourse}*\nأرجو اعتماد المسودة وتحديد تكلفة التجهيز والنشر.`
                  : `Hello, I submitted an AI customized platform draft for *${centerConfig.centerName}*. Please review and quote deployment.`
              )}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-xs font-bold shadow-lg transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isRtl ? 'إرسال المسودة للأدمن للاعتماد عبر واتساب' : 'Submit Draft to Admin via WhatsApp'}</span>
            </a>

            <button
              onClick={() => {
                setIsVisitorDraft(false);
                handleReload();
              }}
              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              {isRtl ? 'استعادة النسخة الأصلية' : 'Revert to Original'}
            </button>
          </div>
        </div>
      )}

      {/* Main Sandbox Interactive Stage */}
      <div className="flex flex-col items-center justify-center p-2 sm:p-6 rounded-3xl border border-slate-800/80 bg-slate-950/60 shadow-2xl overflow-hidden min-h-[640px]">
        {/* Device Enclosure Wrapper */}
        <div 
          className={`transition-all duration-300 w-full flex justify-center ${
            viewport === 'desktop' 
              ? 'max-w-full' 
              : viewport === 'tablet' 
              ? 'max-w-[768px]' 
              : 'max-w-[390px]'
          }`}
        >
          <div 
            className={`w-full bg-slate-900 border border-slate-700 shadow-2xl transition-all duration-300 overflow-hidden ${
              viewport === 'desktop' 
                ? 'rounded-2xl h-[620px]' 
                : viewport === 'tablet' 
                ? 'rounded-[32px] p-3 border-4 border-slate-700 h-[680px]' 
                : 'rounded-[40px] p-3.5 border-4 border-slate-700 h-[680px]'
            }`}
          >
            {/* Mobile / Tablet Camera Notch Simulation */}
            {viewport === 'mobile' && (
              <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-2" />
            )}

            {/* Isolated Iframe Sandbox Container */}
            <iframe
              ref={iframeRef}
              title="Lern Web Dynamic Center Sandbox"
              srcDoc={generateSandboxHtml()}
              className="w-full h-full rounded-xl bg-slate-950 border-0"
              sandbox="allow-scripts allow-modals"
            />
          </div>
        </div>
      </div>

      {/* Conversational AI Customization Handler Workspace */}
      <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/30 p-6 md:p-8 shadow-2xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <Sparkles className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{t.navAiStudio}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white">
              {isRtl ? 'مساعد الذكاء الاصطناعي لتخصيص محاكي المركز الحية' : 'AI Assistant Live Sandbox Customizer'}
            </h3>
            <p className="text-xs md:text-sm text-slate-300">
              {isRtl 
                ? 'اكتب أي تعديل أو أمر باللغة الطبيعية (تغيير الألوان، اسم الأكاديمية، إضافة دورات، تفعيل تنبيهات) وسيقوم المساعد بإعادة بناء المحاكي فورياً.'
                : 'Enter natural language prompts to customize your academy branding, courses, exam alerts, and layout behaviors in real time.'}
            </p>
          </div>
        </div>

        {/* Conversation Stream Log */}
        <div className="space-y-3 max-h-48 overflow-y-auto rounded-2xl bg-slate-950/80 p-4 border border-slate-800">
          {aiChatLog.map((chat, idx) => (
            <div 
              key={idx}
              className={`flex items-start gap-2.5 text-xs md:text-sm ${
                chat.role === 'assistant' ? 'text-slate-200' : 'text-blue-300 font-medium'
              }`}
            >
              <span className="shrink-0 mt-0.5">
                {chat.role === 'assistant' ? '🤖' : '👤'}
              </span>
              <div className="flex-1 leading-relaxed">
                {chat.text}
              </div>
            </div>
          ))}

          {aiIsThinking && (
            <div className="flex items-center gap-2 text-xs text-blue-400 font-mono animate-pulse">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>{t.aiThinking}</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400">
            {isRtl ? 'اقتراحات سريعة للتجربة بنقرة واحدة:' : 'Quick Prompt Presets:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {t.aiQuickPrompts.map((preset, pIdx) => (
              <button
                key={pIdx}
                onClick={() => {
                  setAiPrompt(preset);
                }}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 hover:border-blue-500 hover:text-white transition"
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleAiSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={t.aiPromptPlaceholder}
            className={`flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${isRtl ? 'text-right' : 'text-left'}`}
          />
          <button
            type="submit"
            disabled={aiIsThinking || !aiPrompt.trim()}
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition"
          >
            <Send className="w-4 h-4" />
            <span>{t.aiSend}</span>
          </button>
        </form>
      </div>

      {/* Multi-Format Instructional Media Channels & Documentation Reader */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 md:p-8 shadow-2xl space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Video className="w-4 h-4 text-emerald-400" />
            <span>{t.mediaTitle}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white">
            {t.videoChannelTitle} & {t.docsChannelTitle}
          </h3>
          <p className="text-xs md:text-sm text-slate-400">
            {t.mediaSubtitle}
          </p>
        </div>

        {/* Media Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mediaResources.map((media) => {
            const isSelected = activeMediaItem && activeMediaItem.id === media.id;
            return (
              <div
                key={media.id}
                onClick={() => setActiveMediaItem(media)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                  isSelected 
                    ? 'border-blue-500 bg-slate-800/90 shadow-lg ring-2 ring-blue-500/20' 
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400">
                      {isRtl ? media.categoryAr : media.categoryEn}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {isRtl ? media.durationOrReadTimeAr : media.durationOrReadTimeEn}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-2">
                    {isRtl ? media.titleAr : media.titleEn}
                  </h4>
                </div>

                <div className="pt-3 flex items-center justify-between text-xs font-semibold text-blue-400">
                  <span>{media.type === 'video' ? t.watchVideo : t.readDoc}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Media Reader / Video Player Stream Display */}
        {activeMediaItem && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                  {activeMediaItem.type === 'video' ? '📺 Live Streaming Channel' : '📄 Technical Whitepaper'}
                </span>
                <h4 className="text-lg md:text-xl font-bold text-white">
                  {isRtl ? activeMediaItem.titleAr : activeMediaItem.titleEn}
                </h4>
              </div>
            </div>

            {/* If video resource */}
            {activeMediaItem.type === 'video' ? (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner">
                  <video
                    controls
                    className="w-full h-full object-cover"
                    src={activeMediaItem.videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {isRtl ? activeMediaItem.contentAr : activeMediaItem.contentEn}
                </p>
              </div>
            ) : (
              /* If documentation resource */
              <div className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap rounded-xl bg-slate-900/60 p-5 border border-slate-800 font-mono">
                {isRtl ? activeMediaItem.contentAr : activeMediaItem.contentEn}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Flexible Operational License Tiers & Localized Wallet Checkout Overlay */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-900 p-6 md:p-10 shadow-2xl space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs md:text-sm font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>{isRtl ? 'ضمان تشغيلي واستضافة متوافقة مع Vercel Edge' : 'Certified Vercel Edge Architecture'}</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white">
            {isRtl ? paymentLabels.ar : paymentLabels.en}
          </h2>
          <p className="text-sm md:text-base text-slate-300">
            {t.billingSubtitle}
          </p>
        </div>

        {/* Dynamic Pricing Tiers from Admin Store */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => {
            const isPopular = plan.isPopular;
            const planColor = plan.accentColor || '#3b82f6';
            
            return (
              <div 
                key={plan.id}
                className={`relative rounded-3xl border transition-all duration-300 p-6 md:p-8 flex flex-col justify-between space-y-6 ${
                  isPopular 
                    ? 'border-2 border-blue-500 bg-gradient-to-b from-blue-950/40 to-slate-900 shadow-2xl shadow-blue-900/30' 
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-black uppercase text-white shadow">
                    {isRtl ? plan.badgeAr : plan.badgeEn}
                  </div>
                )}

                <div className="space-y-4">
                  {!isPopular && plan.badgeAr && (
                    <span className="inline-block rounded-md px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: `${planColor}33`, color: planColor }}>
                      {isRtl ? plan.badgeAr : plan.badgeEn}
                    </span>
                  )}
                  <h3 className={`font-bold text-white ${isPopular ? 'text-2xl font-black' : 'text-xl'}`}>
                    {isRtl ? plan.nameAr : plan.nameEn}
                  </h3>
                  
                  <div className="space-y-1">
                    <span className="text-3xl font-extrabold text-white">
                      {isRtl ? plan.priceAr : plan.priceEn}
                    </span>
                    <p className={`text-xs font-semibold ${isPopular ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {isRtl ? plan.periodAr : plan.periodEn}
                    </p>
                  </div>

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    {isRtl ? plan.descriptionAr : plan.descriptionEn}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  style={isPopular ? {} : { borderColor: `${planColor}66`, backgroundColor: `${planColor}1a`, color: planColor }}
                  className={`w-full rounded-2xl py-3 text-sm font-bold transition ${
                    isPopular 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 hover:bg-blue-500' 
                      : 'border hover:text-white'
                  }`}
                >
                  {isRtl ? 'اختيار هذه الباقة' : 'Choose Plan'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Localized Mobile Wallet Payment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 md:p-8 shadow-2xl text-slate-100 space-y-6">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase text-blue-400">
                  {selectedPlan === 'monthly' ? t.tierMonthlyTitle : selectedPlan === 'annual' ? t.tierAnnualTitle : t.tierFullTitle}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {t.paymentModalTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="rounded-xl p-2 text-slate-400 hover:text-white bg-slate-800"
              >
                ✕
              </button>
            </div>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {t.paymentModalDesc}
            </p>

            {/* Wallet Selector Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                {t.selectWallet}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {wallets.map((w) => {
                  const isCur = selectedWalletId === w.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWalletId(w.id)}
                      className={`rounded-2xl p-3 border text-right transition flex items-center justify-between ${
                        isCur 
                          ? 'border-blue-500 bg-slate-800 ring-2 ring-blue-500/20' 
                          : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">
                          {isRtl ? w.nameAr : w.nameEn}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {w.badge}
                        </div>
                      </div>
                      <div 
                        className="w-3.5 h-3.5 rounded-full" 
                        style={{ backgroundColor: w.color }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Wallet Information Box & Orange Cash Interactive Gateway */}
            {selectedWalletId === 'orange-cash' ? (
              <div className="rounded-2xl border border-orange-500/50 bg-gradient-to-br from-orange-950/40 via-slate-950 to-orange-950/30 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-orange-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-orange-500 animate-ping" />
                    <span className="font-extrabold text-orange-400 text-sm md:text-base">
                      🍊 {isRtl ? 'بوابة الدفع الفوري أورانج كاش (Orange Cash OTP Gateway)' : 'Orange Cash OTP Direct Gateway'}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2.5 py-1 rounded-full">
                    {isRtl ? 'تحقق لحظي OTP' : 'Instant OTP'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {isRtl 
                    ? 'قم بإدخال رقم هاتف محفظة أورانج كاش المسجلة لديك، وسيصلك كود تحقق مؤقت (OTP) لإجراء الخصم والتحقق المباشر من الاشتراك.' 
                    : 'Enter your registered Orange Cash mobile number to receive a secure OTP code for instant account verification.'}
                </p>

                {/* Orange Cash Phone Input & Send OTP Button */}
                <div className="space-y-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <label className="text-xs font-bold text-orange-300 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-orange-400" />
                    <span>{isRtl ? 'رقم هاتف محفظة أورانج كاش (Orange Cash Phone):' : 'Orange Cash Phone Number:'}</span>
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={orangePhone}
                      onChange={(e) => setOrangePhone(e.target.value)}
                      placeholder={isRtl ? 'مثال: 01224889921' : 'e.g. 01224889921'}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs md:text-sm text-white font-mono focus:border-orange-500 focus:outline-none transition"
                    />
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (!orangePhone.trim()) {
                          alert(isRtl ? 'يرجى إدخال رقم هاتف أورانج كاش أولاً' : 'Please enter Orange Cash phone number first');
                          return;
                        }
                        const code = '8822';
                        setSimulatedOtpCode(code);
                        setOtpSent(true);
                        setOtpMsg(isRtl ? `تم إرسال كود التحقق OTP إلى الرقم ${orangePhone} (كود التجربة: ${code})` : `OTP code sent to ${orangePhone} (Simulated OTP: ${code})`);
                      }}
                      className="rounded-xl bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 text-xs font-bold transition shadow shrink-0 cursor-pointer"
                    >
                      {otpSent ? (isRtl ? 'إعادة إرسال OTP 🔄' : 'Resend OTP 🔄') : (isRtl ? 'إرسال كود OTP' : 'Send OTP')}
                    </button>
                  </div>

                  {otpMsg && (
                    <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                      <span>{otpMsg}</span>
                    </div>
                  )}
                </div>

                {/* OTP Verification Code Input Field */}
                {otpSent && (
                  <div className="space-y-3 bg-slate-900/90 p-4 rounded-xl border border-orange-500/30 animate-fadeIn">
                    <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{isRtl ? 'كود التحقق OTP المكون من 4 أرقام:' : 'Enter 4-Digit OTP Code:'}</span>
                    </label>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={orangeOtp}
                        onChange={(e) => setOrangeOtp(e.target.value)}
                        placeholder="8822"
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-center text-sm md:text-base font-mono font-bold tracking-widest text-emerald-300 focus:border-emerald-500 focus:outline-none transition"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          if (!orangeOtp.trim()) {
                            alert(isRtl ? 'يرجى كتابة كود التحقق OTP' : 'Please enter the OTP code');
                            return;
                          }
                          setIsOtpVerified(true);
                          setTransactionRef(`ORANGE-CASH-OTP-${orangePhone.trim() || '01224889921'}-VERIFIED`);
                          alert(isRtl ? '✅ تم التحقق بنجاح من رقم أورانج كاش وتأكيد العملية!' : '✅ Orange Cash OTP successfully verified!');
                        }}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-xs font-bold transition shadow shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isRtl ? 'التحقق وتأكيد أورانج كاش' : 'Verify Orange Cash OTP'}</span>
                      </button>
                    </div>

                    {isOtpVerified && (
                      <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{isRtl ? 'تم التحقق الإلكتروني بنجاح من محفظة أورانج كاش! يمكنك الآن إتمام الدفع.' : 'Orange Cash OTP Verified! You can now confirm payment.'}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Selected Wallet Information Box for Other Wallets */
              (() => {
                const activeW = wallets.find((w) => w.id === selectedWalletId) || wallets[0];
                return (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">
                        {t.walletNumber}
                      </span>
                      <span className="text-xs font-semibold text-emerald-400">
                        {isRtl ? activeW.nameAr : activeW.nameEn}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-900 border border-slate-700/80 px-4 py-3">
                      <span className="text-base md:text-lg font-mono font-bold text-white select-all">
                        {activeW.number}
                      </span>
                      <button
                        onClick={() => handleCopyWalletNumber(activeW.number)}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition"
                      >
                        {hasCopiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{hasCopiedNumber ? t.copied : t.copyNumber}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      ℹ️ {isRtl ? activeW.instructionsAr : activeW.instructionsEn}
                    </p>
                  </div>
                );
              })()
            )}

            {/* Transaction Reference Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                {isRtl ? 'كود العملية المرجعي / اسم صاحب المحفظة:' : 'Transaction Reference ID / Sender Phone:'}
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder={t.referenceInputPlaceholder}
                className={`w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${isRtl ? 'text-right' : 'text-left'}`}
              />
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleConfirmManualPayment}
                disabled={paymentSubmitted}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 disabled:opacity-50 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{paymentSubmitted ? (isRtl ? 'جاري التحقق وإرسال الإشعار...' : 'Transmitting receipt...') : t.confirmPayment}</span>
              </button>

              <a
                href={buildWhatsAppUrl(
                  targetWhatsAppNumber,
                  `السلام عليكم، قمت بالتحويل للاشتراك في باقة: ${selectedPlan} لمنصة ليرن ويب. رقم العملية المرجعي: ${transactionRef || 'مرفق الإيصال'}`
                )}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 py-3 text-xs md:text-sm font-semibold text-emerald-400 hover:bg-emerald-900/50 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.sendWhatsAppProof}</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              🔒 {t.secureGuarantee}
            </p>
          </div>
        </div>
      )}
      {/* Source Code View/Edit Modal (Knowledge Base) */}
      {isSourceModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 flex flex-col text-slate-100 shadow-2xl">
            
            <div className="flex items-start justify-between border-b border-slate-800 p-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
                  <Code2 className="w-4 h-4" />
                  <span>{isRtl ? 'قاعدة البيانات المعرفية والكود المصدري' : 'Project Knowledge Base & Source Code'}</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {isRtl ? 'تعديل منطق المنصة الداخلي' : 'Modify Platform Internal Logic'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isRtl 
                    ? 'يمكنك نسخ هذا الكود وتعديله، ثم إرساله للأدمن للاعتماد وحفظه في مشروعك.' 
                    : 'Copy and modify this code, then submit it to the admin for review and deployment.'}
                </p>
              </div>
              <button
                onClick={() => setIsSourceModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:text-white bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">{isRtl ? 'محرر الكود (Source Editor):' : 'Code Editor:'}</label>
                <textarea
                  value={editedSourceCode}
                  onChange={(e) => setEditedSourceCode(e.target.value)}
                  className="w-full h-[350px] rounded-2xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-200 font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 leading-relaxed"
                  placeholder="// Paste your modified code here..."
                  dir="ltr"
                />
              </div>

              <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200 leading-relaxed">
                  {isRtl 
                    ? 'ملاحظة: هذا التعديل خاص بقاعدة البيانات المعرفية للمنصة. عند الحفظ، سيتم إرسال الكود المعدل ضمن المسودة للأدمن.' 
                    : 'Note: This modification targets the project knowledge base. Saving will include this code in your draft submission.'}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsSourceModalOpen(false)}
                className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
              
              <button
                onClick={() => {
                  setIsSourceModalOpen(false);
                  if (!isVisitorDraft) setIsVisitorDraft(true);
                  // Trigger AI submit with a special note or just keep it staged
                  setAiChatLog(prev => [...prev, { 
                    role: 'assistant', 
                    text: isRtl 
                      ? '✅ تم حفظ تعديلات السورس كود محلياً في المسودة. يمكنك الآن إرسال المسودة للأدمن لاعتمادها.' 
                      : '✅ Source code modifications saved to your draft. You can now submit this draft to the admin.' 
                  }]);
                }}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-blue-500 transition"
              >
                <Save className="w-4 h-4" />
                <span>{isRtl ? 'حفظ في المسودة' : 'Save to Draft'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
