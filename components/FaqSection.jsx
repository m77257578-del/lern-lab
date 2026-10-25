/**
 * Next.js Project Structure Identifier:
 * components/FaqSection.jsx
 * 
 * Project Identity: ليرن ويب | Lern Web
 * Purpose: Interactive FAQ Accordion Component explaining Platform Features, 
 *          3-tier Pricing Models, PWA Installation, and AI Customizer Studio.
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Smartphone, ShieldCheck, CreditCard, Code2 } from 'lucide-react';

export default function FaqSection({ lang = 'ar', adminSettings }) {
  const isRtl = lang === 'ar';
  const [openIdx, setOpenIdx] = useState(0);

  const faqItems = [
    {
      icon: Sparkles,
      categoryAr: 'عن المنصة',
      categoryEn: 'About Platform',
      questionAr: 'ما هي منصة ليرن ويب (Lern Web) وكيف تفيد المركز التعليمي؟',
      questionEn: 'What is Lern Web and how does it empower educational centers?',
      answerAr: 'منظومة ليرن ويب هي بيئة سحابية متكاملة تتيح للمدرسين والمراكز والسناتر التعليمية إطلاق منصاتهم الخاصة بهوية بصرية مستقلة، وتتضمن بوابات إدارة الطلاب، نظام الحضور الذكي بالـ QR، بنوك الأسئلة والاختبارات التفاعلية، وبيئات البرمجة السحابية مع تطبيق PWA يعمل بدون إنترنت.',
      answerEn: 'Lern Web is a unified cloud ecosystem enabling educators and academies to deploy custom branded portals featuring student hubs, sub-200ms QR check-in gates, AI-proctored exam suites, and PWA offline support.'
    },
    {
      icon: CreditCard,
      categoryAr: 'نظام الاشتراكات',
      categoryEn: 'Pricing Models',
      questionAr: 'ما هي باقات الاشتراك والترخيص المتاحة (شهرى، سنوى، تمليك)؟',
      questionEn: 'What pricing and licensing tiers are available?',
      answerAr: 'تقدم المنصة 3 باقات مرنة تناسب جميع الاحتياجات:\n1. **الإيجار الشهري (Monthly):** اشتراك مرن وتكلفة منخفضة لتجربة التشغيل.\n2. **السنوي المعتمد (Annual):** الباقة الأكثر شيوعاً وتشمل استضافة Edge فائقة السرعة، الدعم الفني المباشر، والتحديثات الدورية.\n3. **التملك الكامل (Full Buyout):** التسليم الكامل للكود المصدري الأصلي غير المضغوط مع ترخيص استخدام دائم دون أي اشتراكات مستقبلياً.',
      answerEn: 'We offer 3 flexible tiers:\n1. Monthly Rental: Low commitment operational tier.\n2. Annual Suite: High-performance Vercel Edge hosting with SLA updates.\n3. Full Source Code Buyout: Perpetual license with uncompressed Next.js source repository ownership.'
    },
    {
      icon: Smartphone,
      categoryAr: 'تطبيق PWA',
      categoryEn: 'PWA & Offline',
      questionAr: 'كيف أقوم بتثبيت واستخدام تطبيق الـ PWA على الهاتف والحاسوب؟',
      questionEn: 'How do I install and run the Progressive Web App (PWA)?',
      answerAr: 'يمكنك تثبيت المنصة بنقرة واحدة بالضغط على زر "تثبيت التطبيق الآن" في الشريط العلوي، أو خيار "Add to Home Screen" من قائمة المتصفح. يتميز التطبيق بالعمل كأنه تطبيق محلي سريع جداً، مع التخزين المحلي المؤقت (Service Worker) للعمل حتى عند ضعف أو انقطاع الإنترنت.',
      answerEn: 'Click the "Install App" prompt in the header or "Add to Home Screen" in your browser. The PWA behaves like a native mobile app with Service Worker caching for seamless offline usage.'
    },
    {
      icon: Code2,
      categoryAr: 'التخصيص بالذكاء الاصطناعي',
      categoryEn: 'AI Studio',
      questionAr: 'كيف أستخدم استوديو التخصيص بالذكاء الاصطناعي والمحاكي التفاعلي؟',
      questionEn: 'How do I use the AI Customizer Studio & Live Sandbox Simulator?',
      answerAr: 'في تبويب "المحاكي والذكاء الاصطناعي"، يمكنك كتابة أوامرك باللغة الطبيعية (مثلاً: تغيير الثيم، اسم السنتر، إضافة كورس جديد) وسيقوم المساعد الذكي بتوليد التعديلات فورياً في المحاكي أمامك. بعد ذلك يمكنك إرسال المسودة للأدمن للاعتماد ومتابعة حالتها من لوحة العميل.',
      answerEn: 'In the Sandbox tab, enter natural language prompts (e.g. change theme, center name, add courses) to instantaneously re-render the simulator. Submit your staged draft to the Admin and track approval inside your Client Dashboard.'
    },
    {
      icon: ShieldCheck,
      categoryAr: 'متابعة الطلبات',
      categoryEn: 'Status Tracking',
      questionAr: 'كيف أتتبع حالة طلبات التعديل الخاصة بي والتنبيهات؟',
      questionEn: 'How do I track modification request statuses and notifications?',
      answerAr: 'بمجرد تسجيل دخولك كعميل، يمكنك الانتقال لتبويب "لوحة العميل" لمشاهدة كافة طلبات التعديل ومسوداتك وسجل حالتها اللحظية (قيد المراجعة، قيد التنفيذ، تم التنفيذ/منشور)، وتتلقى تنبيهاً مرئياً فورياً عند قيام الأدمن بالتحديث.',
      answerEn: 'Sign in as a client and access "My Dashboard" to inspect your modification request timeline (Pending Review, In Progress, Completed/Published) with instant status alert banners.'
    }
  ];

  return (
    <div className="w-full space-y-6 my-10 animate-fadeIn">
      {/* FAQ Header Card */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-6 md:p-8 shadow-xl space-y-2 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
          <HelpCircle className="w-4 h-4 text-blue-400" />
          <span>{isRtl ? 'مركز المساعدة والدعم الفني' : 'Help Center & Documentation'}</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold text-white">
          {isRtl ? 'الأسئلة الشائعة وإرشادات الاستخدام' : 'Frequently Asked Questions (FAQ)'}
        </h3>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto">
          {isRtl 
            ? 'إجابات شاملة حول مميزات منصة ليرن ويب، باقات الاشتراك، تثبيت تطبيق PWA، وطريقة استخدام استوديو التخصيص ومتابعة الطلبات.'
            : 'Comprehensive answers regarding platform features, pricing tiers, PWA installation, and AI customizer usage.'}
        </p>
      </div>

      {/* Accordion Questions List */}
      <div className="max-w-4xl mx-auto space-y-3">
        {faqItems.map((item, idx) => {
          const Icon = item.icon;
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen 
                  ? 'border-blue-500/50 bg-slate-900 shadow-lg shadow-blue-900/10' 
                  : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-5 flex items-center justify-between text-right gap-4 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 block w-fit">
                      {isRtl ? item.categoryAr : item.categoryEn}
                    </span>
                    <h4 className="text-sm md:text-base font-bold text-white">
                      {isRtl ? item.questionAr : item.questionEn}
                    </h4>
                  </div>
                </div>

                <div className="text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-blue-400" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-800/80 text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line animate-fadeIn">
                  {isRtl ? item.answerAr : item.answerEn}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
