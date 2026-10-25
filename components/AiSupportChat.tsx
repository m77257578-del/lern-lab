/**
 * Project: ليرن ويب | Lern Web
 * File: components/AiSupportChat.tsx
 * AI Support Chatbot Assistant inside Client Dashboard for instant Q&A and technical guidance.
 */

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { storageService } from '../src/services/storageService';

interface AiSupportChatProps {
  lang?: 'ar' | 'en';
  currentUser?: any;
}

export default function AiSupportChat({ lang = 'ar', currentUser }: AiSupportChatProps) {
  const isRtl = lang === 'ar';

  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: isRtl 
        ? `مرحباً بك ${currentUser?.name || 'عزيزنا العميل'} في مساعد ليرن ويب الذكي للدعم الفوري! كيف يمكنني مساعدتك اليوم في تخصيص منصة سنتر الخاص بك (مثل سناتر يخت، إدارة المجموعات، أو تفعيل الباركود)؟`
        : `Welcome ${currentUser?.name || 'Valued Client'} to Lern Web AI Support Assistant! How can I help you today with your tutoring center customization (like Sannatr Yakt workflows, cohorts, or QR gates)?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isThinking) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsThinking(true);

    // Save message to backend for Admin Dashboard
    storageService.saveChatMessage({
      senderName: currentUser?.name || 'زائر كريـم',
      senderPhone: currentUser?.phone || 'غير محدد',
      message: userText,
      isAdminReply: false
    });


    try {
      const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
                     (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || 
                     '';

      let aiReply = '';

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `
You are an expert AI support chatbot for "Lern Web" (ليرن ويب), an advanced universal cloud SaaS platform for building, customizing, and deploying ALL kinds of software and programming projects (E-commerce stores, SaaS applications, AI generation tools, CRM pipelines, mobile apps, and educational portals).
You answer client questions in Arabic (or English if prompted in English) regarding instant support, project customization, pricing, deployment, payment wallets (Vodafone Cash, InstaPay), and full source code ownership.
Keep responses helpful, professional, encouraging, and concise.
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ text: userText }],
          config: { systemInstruction }
        });
        aiReply = response.text || (isRtl ? 'عذراً، لم أتمكن من معالجة الطلب.' : 'Sorry, could not process.');
      } else {
        const lower = userText.toLowerCase();
        if (lower.includes('سعر') || lower.includes('تكلفة') || lower.includes('اشتراك') || lower.includes('price')) {
          aiReply = isRtl 
            ? 'تتنوع باقات ليرن ويب بين الاشتراك الشهري المرن (950 ج.م / $29)، والترخيص السنوي (8,500 ج.م / $249)، والتملك الكامل للكود المصدري مدى الحياة (27,000 ج.م / $799) بدون أي رسوم شهرية لاحقاً.' 
            : 'Lern Web offers flexible monthly plans ($29), annual licenses ($249), and full outright source buyout ($799) with zero recurring fees.';
        } else if (lower.includes('باركود') || lower.includes('حضور') || lower.includes('qr')) {
          aiReply = isRtl
            ? 'نظام الحضور الباركود (QR Gate) يتيح لكل طالب بطاقة ذكية خاصة به. عند مسحها عند بوابة السنتر أو القاعة يتم تسجيل الحضور فورياً وإرسال إشعار واتساب تلقائي لولي الأمر.'
            : 'The QR Gate attendance system generates smart badges for students, instantly recording gate check-ins and sending automated WhatsApp notifications to parents.';
        } else if (lower.includes('تخصيص') || lower.includes('حذف') || lower.includes('تعديل') || lower.includes('customize')) {
          aiReply = isRtl
            ? 'يمكنك بالكامل تخصيص اسم المركز، الألوان، الكورسات، أو حتى حذف المحتوى الافتراضي وإضافة منصاتك الخاصة من خلال محاكي التخصيص الذكي أو لوحة التحكم الخاصة بك.'
            : 'You can fully customize center names, themes, active courses, or delete default content and add your own platforms via the sandbox or admin dashboard.';
        } else {
          aiReply = isRtl
            ? 'شكراً لتواصلك! لقد استلمت استفسارك حول "' + userText + '". يمكنك تعديل منصتك، مراجعة حالة طلبات التخصيص، أو التواصل المباشر مع الإدارة عبر الواتساب لأي دعم فوري.'
            : 'Thanks for your inquiry about "' + userText + '". You can customize your platform, review draft statuses, or contact admin via WhatsApp.';
        }
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: isRtl ? 'عذراً حدث خطأ مؤقت في الاتصال بالمساعد الذكي. يمكنك التواصل عبر الواتساب.' : 'Temporary connection error. Please use WhatsApp for instant help.' 
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="rounded-3xl border border-blue-500/30 bg-slate-900/95 p-6 md:p-8 shadow-2xl space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400">
            <Bot className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المساعد الذكي للدعم الفوري' : 'AI Instant Support Assistant'}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white">
            {isRtl ? 'اسأل المساعد الذكي عن خدمات سناتر المستقبل (مثل سناتر يخت)' : 'Ask AI About Tutoring Center Services (Sannatr Yakt Style)'}
          </h3>
          <p className="text-xs md:text-sm text-slate-300">
            {isRtl 
              ? 'اطرح أي سؤال حول الاشتراكات، بوابات الحضور بالباركود، طرق الدفع فودافون كاش، وتخصيص المنصة بالكامل.' 
              : 'Ask any question regarding pricing, QR gate attendance, payment wallets, and full platform customization.'}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 text-xs font-bold text-blue-400 shrink-0">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{isRtl ? 'مساعد ذكي 24/7' : '24/7 AI Online'}</span>
        </span>
      </div>

      {/* Chat Messages Container */}
      <div className="h-80 md:h-96 rounded-2xl border border-slate-800 bg-slate-950 p-4 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed shadow ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 px-4 py-3 text-xs text-slate-400">
              {isRtl ? 'المساعد الذكي يكتب الرد الآن...' : 'AI Assistant is thinking...'}
            </div>
          </div>
        )}
      </div>

      {/* Chat Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={isRtl ? 'اكتب سؤالك هنا (مثال: كيف أخصص اسم السنتر؟ ما هي الأسعار؟)...' : 'Type your question here (e.g. How to customize center? What are prices?)...'}
          className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs md:text-sm text-white focus:border-blue-500 focus:outline-none transition shadow-sm"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isThinking}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs md:text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition active:scale-95 shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{isRtl ? 'إرسال' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
}
