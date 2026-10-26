import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Bot, User, Trash2 } from 'lucide-react';
import { storageService } from '../services/storageService';

interface AiSupportChatProps {
  lang?: 'ar' | 'en';
  currentUser?: any;
}

export default function AiSupportChat({ lang = 'ar', currentUser }: AiSupportChatProps) {
  const isRtl = lang === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lernweb_chat_history');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {
          console.error('Failed to parse chat history', e);
        }
      }
    }
    return [
      {
        sender: 'ai',
        text: isRtl 
          ? `مرحباً بك ${currentUser?.name || 'عزيزنا العميل'} في مساعد ليرن ويب الذكي للدعم الفوري! كيف يمكنني مساعدتك اليوم في تخصيص منصة سنتر الخاص بك؟`
          : `Welcome ${currentUser?.name || 'Valued Client'} to Lern Web AI Support Assistant! How can I help you today with your tutoring center customization?`
      }
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  // Persist messages
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem('lernweb_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const clearChat = () => {
    const initialMsg = [
      {
        sender: 'ai',
        text: isRtl 
          ? `مرحباً بك ${currentUser?.name || 'عزيزنا العميل'} في مساعد ليرن ويب الذكي للدعم الفوري!`
          : `Welcome ${currentUser?.name || 'Valued Client'} to Lern Web AI Support Assistant!`
      }
    ];
    setMessages(initialMsg as any);
    localStorage.removeItem('lernweb_chat_history');
  };

  // Local fallback engine to provide responses if the API is down or quota is reached
  const getLocalFallbackResponse = (query: string): string => {
    const lower = query.toLowerCase();
    const isArabic = /[\u0600-\u06FF]/.test(query);
    
    // Greetings
    if (lower.includes('اهلا') || lower.includes('أهلا') || lower.includes('hi') || lower.includes('hello') || lower.includes('سلام')) {
      const arGreetings = [
        'أهلاً بيك يا بطل في ليرن ويب! نورتنا والله. أقدر أساعدك في إيه النهاردة؟',
        'يا هلا! نورت منصتنا. أنا المساعد الذكي، جاهز أجاوبك على أي حاجة بخصوص السناتر والمنصات.',
        'أهلاً أهلاً! يا رب تكون بخير. ليرن ويب هنا عشان تسهل عليك إدارة شغلك التعليمي. تحب تعرف أكتر عن إيه؟',
        'مرحباً بك في ليرن ويب! أنا المساعد الفوري، تحت أمرك في أي وقت.'
      ];
      const enGreetings = [
        'Hi there! Welcome to Lern Web. How can I help you today?',
        'Hello! Ready to transform your educational center with AI?',
        'Welcome! I am your Lern Web smart assistant. What would you like to know?',
        'Greetings! How can I assist you in exploring our platform features?'
      ];
      return isRtl ? arGreetings[Math.floor(Math.random() * arGreetings.length)] : enGreetings[Math.floor(Math.random() * enGreetings.length)];
    }

    // Pricing & Plans
    if (lower.includes('سعر') || lower.includes('بكام') || lower.includes('price') || lower.includes('cost') || lower.includes('اشتراك') || lower.includes('خطط')) {
      const arPricing = [
        'بص يا سيدي، إحنا عندنا 3 خطط:\n- شهري: 950 ج.م\n- سنوي: 8500 ج.م\n- تملك كامل: 27000 ج.م\nالاشتراك السنوي هو الأكتر طلباً وبيوفرلك كتير!',
        'أسعارنا تنافسية جداً:\n- الخطة الشهرية: $29 (950 ج.م)\n- الخطة السنوية: $249 (8500 ج.م)\n- شراء الكود بالكامل: $799 (27000 ج.م)\nتحب نفعلك أي واحدة فيهم؟',
        'ليرن ويب بتديك قيمة مقابل سعر خرافية. بتبدأ بـ 950 جنيه في الشهر بس! وعندنا عرض على التملك الكامل للكود بـ 27 ألف جنيه.'
      ];
      return isRtl ? arPricing[Math.floor(Math.random() * arPricing.length)] : 'Lern Web plans: Monthly ($29/950 EGP), Annual ($249/8,500 EGP), or Full Buyout ($799/27,000 EGP). All plans include full technical support.';
    }

    // Features / Dashboard / QR
    if (lower.includes('ايه') || lower.includes('مميزات') || lower.includes('feature') || lower.includes('what') || lower.includes('dashboard') || lower.includes('qr')) {
      const arFeatures = [
        'ليرن ويب هي منظومة متكاملة فيها:\n- لوحة تحكم مدرسين وإداريين.\n- تسجيل حضور بالـ QR بلمحة بصر.\n- اختبارات ذكية بنظام Proctor AI.\n- بوابة دفع فوري.',
        'أهم مميزاتنا هي السرعة والأمان. نظام تسجيل الحضور عندنا بياخد أقل من 200ms، وبنبعث رسالة فورية لولي الأمر. جربها بنفسك في المحاكي!',
        'المنصة بتوفرلك تملك كامل للكود (Source Code) لو اخترت خطة التملك، وده بيخليك ملك لنفسك 100%. وموجود كمان نظام PWA للعمل بدون إنترنت.'
      ];
      return isRtl ? arFeatures[Math.floor(Math.random() * arFeatures.length)] : 'Lern Web features: Multi-branch Dashboard, Instant QR Attendance, Smart Proctor AI Quizzes, and Localized Payment Gateways.';
    }

    // Default dynamic responses (Human-like)
    const arDefaults = [
      'أنا معاك يا فندم وسامعك كويس. ليرن ويب منصة ضخمة وبنخدم مئات السناتر في مصر. اسألني عن أي تفاصيل وهفيدك.',
      'سؤال ممتاز! الحقيقة ليرن ويب مصممة عشان تخلي السنتر بتاعك يشتغل "على الفرازة". تحب تعرف إزاي بنأمن الامتحانات؟',
      'إحنا هنا عشان نسهل عليك. تقدر تطلع على "المحاكي" في التاب اللي فوق وتجرب تخصيص المنصة باسمك فوراً.',
      'معاك "ليرن ويب AI". أنا تحت التدريب المستمر بس أقدر أقولك إننا الأفضل في استضافة المنصات التعليمية بفضل Vercel Edge.',
      'تحب أبعتلك رابط واتساب للأدمن عشان تخلص إجراءات الاشتراك فوراً؟'
    ];
    const enDefaults = [
      'I am here to help! Lern Web is a robust ecosystem serving hundreds of centers. Feel free to ask about tech specs or pricing.',
      'That is a great question. Our platform is built on Next.js for maximum performance. Want to know more about deployment?',
      'Check out the "Sandbox" tab above to experience the platform live in your browser.',
      'Lern Web AI here! I can assist with pricing, features, or technical questions about our LMS Core.',
      'Would you like a direct WhatsApp link to our support team for instant registration?'
    ];
    return isRtl ? arDefaults[Math.floor(Math.random() * arDefaults.length)] : enDefaults[Math.floor(Math.random() * enDefaults.length)];
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isThinking) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsThinking(true);

    // Track message for Admin stats
    storageService.saveChatMessage({
      senderName: currentUser?.name || 'زائر كريم',
      senderPhone: currentUser?.phone || 'غير محدد',
      message: userText,
      isAdminReply: false
    });

    try {
      const systemInstruction = `
You are "Lern Web AI". 
Style: Friendly Egyptian Arabic (Ammiya) or English.
Pricing: 950/mo, 8500/yr, 27k buyout.
Scope: LMS Core, Proctor AI, payments.
`;

      const historyToSend = messages.slice(1).slice(-10);

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText, 
          history: historyToSend,
          systemInstruction 
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn('AI Server reported error, using fallback. Version:', errorData._v);
        throw new Error(errorData.details || 'Connection failure');
      }

      const data = await response.json();
      if (!data.text) throw new Error('No text in response');
      
      setMessages(prev => [...prev, { sender: 'ai', text: data.text }]);
    } catch (err) {
      console.warn('AI service temporary limit, using local intelligence:', err);
      const fallbackReply = getLocalFallbackResponse(userText);
      setMessages(prev => [...prev, { sender: 'ai', text: fallbackReply }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] max-h-[70vh] rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden shadow-blue-500/10">
      {/* Header */}
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {isRtl ? 'المساعد الذكي ليرن ويب' : 'Lern Web AI Assistant'}
            </h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-medium">{isRtl ? 'متصل الآن' : 'Online'}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition"
          title={isRtl ? 'مسح المحادثة' : 'Clear Chat'}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50 scroll-smooth"
      >
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
              msg.sender === 'user' ? 'bg-blue-600' : 'bg-slate-700'
            }`}>
              {msg.sender === 'user' ? <User className="w-3 h-3 text-white" /> : <Bot className="w-3 h-3 text-white" />}
            </div>

            <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-end gap-2">
            <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center">
              <Bot className="w-3 h-3 text-white animate-spin" />
            </div>
            <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-2xl rounded-bl-none text-xs text-slate-400">
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-slate-800 border-t border-slate-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={isRtl ? 'اكتب سؤالك...' : 'Type a message...'}
            className="flex-1 min-w-0 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none transition shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking}
            className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-500 disabled:opacity-50 transition active:scale-95 shrink-0 shadow-lg shadow-blue-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[9px] text-slate-500 mt-2 text-center">
          {isRtl ? 'تم التطوير بواسطة ليرن ويب ذكاء اصطناعي' : 'Powered by Lern Web AI'}
        </p>
      </div>
    </div>
  );
}
