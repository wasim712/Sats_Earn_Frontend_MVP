'use client';

import React, { useState } from 'react';
import { 
  Mail, Copy, CheckCircle2, AlertTriangle, Shield, Clock, Zap, 
  Send, HelpCircle, FileText, Briefcase, Loader2, ArrowUpRight, 
  MessageSquare, Globe, Smartphone, CheckSquare,
  MessageCircle
} from 'lucide-react';

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: ''
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@satsearn.app');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToForm = (e: React.MouseEvent, category?: string) => {
    e.preventDefault();
    if (category) {
      setFormData(prev => ({ ...prev, category }));
    }
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // EmailJS integration handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    try {
      // ---------------------------------------------------------
      // EMAILJS INTEGRATION TODO:
      // 1. npm install @emailjs/browser
      // 2. Import it: import emailjs from '@emailjs/browser';
      // 3. Setup your EmailJS account at https://www.emailjs.com/
      // 4. Create a Service and a Template.
      // 5. Replace the placeholders below with your actual IDs.
      // ---------------------------------------------------------
      
      /*
      await emailjs.send(
        'YOUR_SERVICE_ID', 
        'YOUR_TEMPLATE_ID', 
        {
          from_name: formData.name,
          reply_to: formData.email,
          category: formData.category,
          message: formData.message,
        }, 
        'YOUR_PUBLIC_KEY'
      );
      */
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormStatus({ type: 'success', message: 'Your message has been sent successfully. We will get back to you soon!' });
      setFormData({ name: '', email: '', category: '', message: '' });
    } catch (error) {
      setFormStatus({ type: 'error', message: 'Failed to send message. Please try again later or email us directly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] pb-20">
      <div className="max-w-5xl mx-auto space-y-12 p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
        
        {/* ─── HERO SECTION ─── */}
        <div className="text-center space-y-4 pt-8 md:pt-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-sats-orange-500/20 bg-sats-orange-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-sats-orange-400">
            <HelpCircle className="h-4 w-4" /> Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Contact <span className="text-sats-orange-500">SatsEarn</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Questions, feedback, or support — we read and respond to every message. Reach us by email or connect on our social channels.
          </p>
        </div>

        {/* ─── EMAIL CARD ─── */}
        <div className="bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15),transparent_50%),#050505] border border-[#1a1a1a] rounded-[32px] p-8 md:p-12 text-center relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#111] border border-[#2a2a2a] rounded-2xl shadow-inner">
              <Mail className="w-8 h-8 text-sats-orange-500" />
            </div>
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Email Us Directly</p>
          <h2 className="text-2xl md:text-4xl font-black text-sats-orange-500 mb-8 break-all selection:bg-sats-orange-500 selection:text-black">
            support@satsearn.app
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={(e) => scrollToForm(e)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-black text-sm px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] active:scale-95"
            >
              <Send className="w-4 h-4" /> Send a Message
            </button>
            <button 
              onClick={handleCopyEmail}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 font-bold text-sm px-6 py-3.5 rounded-xl border transition-all active:scale-95 ${copied ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-[#111] border-[#2a2a2a] text-white hover:bg-[#1a1a1a]'}`}
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard' : 'Copy Email'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-6 font-medium">For support, partnerships, press, legal, and privacy enquiries.</p>
        </div>

        {/* ─── CHANNELS & SLA GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#050505] border border-[#1a1a1a] rounded-[28px] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-[#1a1a1a] pb-4">
              <Zap className="w-5 h-5 text-sats-orange-500" />
              <h3 className="text-lg font-bold text-white tracking-tight">Support Channels</h3>
            </div>
            <div className="space-y-4">
              <div className="group border border-[#1a1a1a] bg-[#0a0a0a] rounded-2xl p-4 hover:border-sats-orange-500/30 transition-colors cursor-pointer" onClick={(e) => scrollToForm(e, 'General Support')}>
                <h4 className="font-bold text-white mb-1 flex justify-between items-center">
                  General Support
                  <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-sats-orange-500 transition-colors" />
                </h4>
                <p className="text-xs text-gray-400 mb-2">General inquiries, technical issues, or platform questions.</p>
                <div className="text-[10px] font-black uppercase tracking-widest text-sats-orange-500/80">⏱ 24–48 hours</div>
              </div>
              <div className="group border border-[#1a1a1a] bg-[#0a0a0a] rounded-2xl p-4 hover:border-sats-orange-500/30 transition-colors cursor-pointer" onClick={(e) => scrollToForm(e, 'Billing')}>
                <h4 className="font-bold text-white mb-1 flex justify-between items-center">
                  Billing & Subscriptions
                  <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-sats-orange-500 transition-colors" />
                </h4>
                <p className="text-xs text-gray-400 mb-2">Questions about paid-tiers, payment issues, or renewals.</p>
                <div className="text-[10px] font-black uppercase tracking-widest text-sats-orange-500/80">⏱ 24 hours</div>
              </div>
              <div className="group border border-[#1a1a1a] bg-[#0a0a0a] rounded-2xl p-4 hover:border-sats-orange-500/30 transition-colors cursor-pointer" onClick={(e) => scrollToForm(e, 'Security')}>
                <h4 className="font-bold text-white mb-1 flex justify-between items-center">
                  Security Issues
                  <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-sats-orange-500 transition-colors" />
                </h4>
                <p className="text-xs text-gray-400 mb-2">Report vulnerabilities or security concerns securely.</p>
                <div className="text-[10px] font-black uppercase tracking-widest text-sats-orange-500/80">⏱ Critical: 24h</div>
              </div>
            </div>
          </div>

          <div className="bg-[#050505] border border-[#1a1a1a] rounded-[28px] p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-[#1a1a1a] pb-4">
              <Clock className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white tracking-tight">Response Targets</h3>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-3">
                <span className="text-sm font-medium text-red-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /> Critical (Platform Down)</span>
                <span className="text-sm font-bold text-white">2–4 hours</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-3">
                <span className="text-sm font-medium text-sats-orange-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-sats-orange-500" /> High (Billing, Security)</span>
                <span className="text-sm font-bold text-white">24 hours</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-3">
                <span className="text-sm font-medium text-yellow-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500" /> Normal (General Support)</span>
                <span className="text-sm font-bold text-white">24–48 hours</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#1a1a1a] pb-3">
                <span className="text-sm font-medium text-green-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Low (Feature Requests)</span>
                <span className="text-sm font-bold text-white">3–5 biz days</span>
              </div>
            </div>

            <div className="mt-auto bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Support Hours</div>
              <p className="text-sm text-gray-300 mb-1">Monday to Sunday</p>
              <p className="text-sm font-black text-sats-orange-500">10:00 AM – 8:00 PM IST</p>
              <p className="text-xs text-gray-500 mt-2 font-medium">Emergency support available 24/7 for critical issues.</p>
            </div>
          </div>
        </div>

        {/* ─── BEFORE YOU CONTACT ─── */}
        <div className="bg-gradient-to-br from-sats-orange-500/10 to-[#050505] border border-sats-orange-500/20 rounded-[28px] p-6 md:p-8">
          <h3 className="text-lg font-bold text-white tracking-tight mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-sats-orange-500" /> Quick Self-Help
          </h3>
          <p className="text-sm text-gray-400 mb-6">Many questions are already answered. Check these resources first for an instant answer.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="/faq" className="flex items-start gap-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 hover:border-sats-orange-500/30 transition-colors">
              <HelpCircle className="w-5 h-5 text-gray-500 shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm mb-1">FAQ Page</h4>
                <p className="text-xs text-gray-500">Covers the most common questions about tasks, withdrawals, and accounts.</p>
              </div>
            </a>
            <a href="/how-it-works" className="flex items-start gap-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 hover:border-sats-orange-500/30 transition-colors">
              <FileText className="w-5 h-5 text-gray-500 shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm mb-1">How It Works</h4>
                <p className="text-xs text-gray-500">A full walkthrough of earning, tiers, and the Lightning Network payout process.</p>
              </div>
            </a>
          </div>
        </div>

        {/* ─── CONTACT FORM ─── */}
        <div id="contact-form" className="bg-[#050505] border border-[#1a1a1a] rounded-[32px] p-6 md:p-10 shadow-xl scroll-mt-24">
          <div className="flex items-center gap-3 mb-8 border-b border-[#1a1a1a] pb-5">
            <div className="p-2.5 bg-[#111] border border-[#2a2a2a] rounded-xl shadow-inner">
              <MessageSquare className="w-5 h-5 text-sats-orange-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Send a Message</h2>
              <p className="text-sm text-gray-500 mt-1">Fill in the details below and we&apos;ll get back to you soon.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            
            {formStatus.type === 'error' && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm font-medium">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{formStatus.message}</p>
              </div>
            )}

            {formStatus.type === 'success' && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3 text-green-400 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{formStatus.message}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Your Name</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Satoshi Nakamoto"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-4 py-3.5 rounded-xl outline-none focus:border-sats-orange-500/50 focus:bg-[#111] transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Email Address</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="satoshi@example.com"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-4 py-3.5 rounded-xl outline-none focus:border-sats-orange-500/50 focus:bg-[#111] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">How can we help?</label>
              <div className="relative">
                <select 
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-4 py-3.5 rounded-xl outline-none focus:border-sats-orange-500/50 focus:bg-[#111] transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select a topic...</option>
                  <option value="General Support">General Support</option>
                  <option value="Billing">Billing & Subscriptions</option>
                  <option value="Security">Security Issues</option>
                  <option value="Partnerships">Partnerships & Brands</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Message</label>
              <textarea 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Describe your issue or inquiry in detail..."
                rows={5}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-4 py-3.5 rounded-xl outline-none focus:border-sats-orange-500/50 focus:bg-[#111] transition-all resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sats-orange-500 hover:bg-sats-orange-400 text-black font-black text-sm px-8 py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(249,115,22,0.2)] active:scale-95"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* ─── SOCIAL LINKS ─── */}
        <div className="text-center pt-8">
          <h3 className="text-xl font-bold text-white mb-6">Connect With Us</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://twitter.com/satsearn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#050505] border border-[#1a1a1a] hover:border-[#333] hover:bg-[#111] text-gray-400 hover:text-white px-5 py-3 rounded-2xl transition-all">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-bold">X / Twitter</span>
            </a>
            <a href="https://t.me/satsearnapp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#050505] border border-[#1a1a1a] hover:border-[#333] hover:bg-[#111] text-gray-400 hover:text-white px-5 py-3 rounded-2xl transition-all">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-bold">Telegram</span>
            </a>
            <a href="https://youtube.com/@satsearnapp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#050505] border border-[#1a1a1a] hover:border-[#333] hover:bg-[#111] text-gray-400 hover:text-white px-5 py-3 rounded-2xl transition-all">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-bold">LinkedIn</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
