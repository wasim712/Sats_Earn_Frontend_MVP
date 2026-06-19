'use client';

import React, { useState ,useRef} from 'react';
import { 
  Mail, Copy, CheckCircle2, AlertTriangle, Clock, Zap, 
  Send, HelpCircle,  Loader2, ArrowUpRight, 
  MessageSquare,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

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
  const formRef = useRef<HTMLFormElement>(null);
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@satsearn.app');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToForm = (e: React.MouseEvent, category?: string, message?: string) => {
    e.preventDefault();
    if (category || message) {
      setFormData(prev => ({ 
        ...prev, 
        ...(category && { category }), 
        ...(message && { message }) 
      }));
    }
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setFormStatus({ type: null, message: '' });

  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    setFormStatus({
      type: 'error',
      message: 'Email service is not configured correctly. Please try again later or email us directly.'
    });
    setIsSubmitting(false);
    return;
  }

  emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      from_name: formData.name,
      reply_to: formData.email,
      category: formData.category,
      message: formData.message,
    },
    {
      publicKey: EMAILJS_PUBLIC_KEY,
    }
  ).then(
    () => {
      setFormStatus({ type: 'success', message: 'Your message has been sent successfully. We will get back to you soon!' });
      setFormData({ name: '', email: '', category: '', message: '' });
      setIsSubmitting(false);
    },
    (error) => {
      console.error('EmailJS Error:', error);
      setFormStatus({ type: 'error', message: 'Failed to send message. Please try again later or email us directly.' });
      setIsSubmitting(false);
    }
  );
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

        {/* ─── WHAT CAN WE HELP WITH ─── */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-[13px] tracking-[0.2em] uppercase text-sats-orange-500 font-black font-mono mb-2">What Can We Help With</div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Reach Out About Anything</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6">
              <div className="text-2xl mb-3">🛟</div>
              <div className="text-[15px] font-bold text-white mb-2">Account & Support</div>
              <div className="text-[13px] text-gray-400 leading-relaxed">Login issues, withdrawals, task verification, or anything not working as expected.</div>
            </div>
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6">
              <div className="text-2xl mb-3">🤝</div>
              <div className="text-[15px] font-bold text-white mb-2">Partnerships & Brands</div>
              <div className="text-[13px] text-gray-400 leading-relaxed">Want to run tasks, advertise, or explore a brand partnership with SatsEarn? Let&apos;s talk.</div>
            </div>
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6">
              <div className="text-2xl mb-3">📣</div>
              <div className="text-[15px] font-bold text-white mb-2">Press & Media</div>
              <div className="text-[13px] text-gray-400 leading-relaxed">Writing about Bitcoin rewards or covering SatsEarn? Reach out for info and assets.</div>
            </div>
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6">
              <div className="text-2xl mb-3">⚖️</div>
              <div className="text-[15px] font-bold text-white mb-2">Legal & Privacy</div>
              <div className="text-[13px] text-gray-400 leading-relaxed">Data requests, privacy enquiries, or questions about our <a href="/legal" className="text-sats-orange-500 hover:underline">policies</a>.</div>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-gray-500 font-medium">
            Before emailing, you might find your answer faster in our <a href="/faq" className="text-sats-orange-500 hover:underline">FAQ &rarr;</a>
          </div>
        </div>

        {/* ─── SAVE TIME ─── */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-[13px] tracking-[0.2em] uppercase text-sats-orange-500 font-black font-mono mb-2">Save Time</div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Before You Contact Us</h2>
            <p className="text-sm text-gray-400 mt-2 font-medium">Many questions are already answered — check these first for an instant answer.</p>
          </div>
          <div className="bg-gradient-to-br from-sats-orange-500/10 to-[#050505] border border-sats-orange-500/20 rounded-3xl p-6 md:p-8">
            <h3 className="text-base font-black text-white mb-4">✅ Quick Self-Help Checklist</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-[#1a1a1a]">
                <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-sats-orange-500/10 border border-sats-orange-500/20 text-sm">📖</div>
                <div className="text-sm text-gray-400">Check our <a href="/faq" className="text-sats-orange-500 font-bold hover:underline">FAQ page</a> — covers the most common questions about tasks, withdrawals, and accounts.</div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b border-[#1a1a1a]">
                <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-sats-orange-500/10 border border-sats-orange-500/20 text-sats-orange-500">
                  <svg viewBox="0 0 56 72" width="8" height="10" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M30.6 2.2c1.1-2 4.2-1 3.9 1.3l-3.1 22.3 18.4.2c2.4 0 3.5 3 1.6 4.5L19.2 69.4c-1.4 1.7-4.2.3-3.7-1.9l5.4-23.8-15.5-.2c-2.3 0-3.4-2.8-1.7-4.4z"/></svg>
                </div>
                <div className="text-sm text-gray-400">Read <a href="/how-it-works" className="text-sats-orange-500 font-bold hover:underline">How It Works</a> — a full walkthrough of earning, tiers, and the Lightning Network payout process.</div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b border-[#1a1a1a]">
                <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-sats-orange-500/10 border border-sats-orange-500/20 text-sm">💸</div>
                <div className="text-sm text-gray-400">Visit the <a href="/withdrawals" className="text-sats-orange-500 font-bold hover:underline">Withdrawals guide</a> — minimum amounts, processing times, and wallet setup explained.</div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 bg-sats-orange-500/10 border border-sats-orange-500/20 text-sm">🏆</div>
                <div className="text-sm text-gray-400">Review the <Link href="/#tiers" className="text-sats-orange-500 font-bold hover:underline">Tier System</Link> — understand how your tier affects earning rates and withdrawal limits.</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── PLATFORM HEALTH ─── */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-[13px] tracking-[0.2em] uppercase text-sats-orange-500 font-black font-mono mb-2">Platform Health</div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Live System Status</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between bg-[#050505] border border-[#1a1a1a] rounded-2xl p-5 gap-4">
            <div className="flex items-center gap-3 font-bold text-sm text-white">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
              All Systems Operational
            </div>
            <div className="text-xs text-gray-500 font-mono">Last checked: just now</div>
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

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            
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
                name="from_name"
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
                  name="reply_to"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@example.com"
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm px-4 py-3.5 rounded-xl outline-none focus:border-sats-orange-500/50 focus:bg-[#111] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">How can we help?</label>
              <div className="relative">
                <select 
                  required
                  name="category"
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
                name="message"
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

        {/* ─── HELP US IMPROVE ─── */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-[13px] tracking-[0.2em] uppercase text-sats-orange-500 font-black font-mono mb-2">Help Us Improve</div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Bug Report or Feature Request?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a 
              href="#contact-form" 
              onClick={(e) => scrollToForm(e, 'Bug Report', 'Bug Report: [Describe your issue here]\n\nPlatform / Device:\nSteps to reproduce:\n1. \n2. \n3. \n\nExpected behaviour:\nActual behaviour:\n\nScreenshot / video attached: Yes / No')}
              className="flex items-center gap-4 bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6 hover:border-sats-orange-500/30 transition-all group"
            >
              <div className="text-3xl shrink-0">🐛</div>
              <div>
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1 font-mono">Something broken?</div>
                <div className="text-[15px] font-black text-white group-hover:text-sats-orange-500 transition-colors">Report a Bug</div>
                <div className="text-xs text-gray-400 mt-1">Pre-fills the form with a bug report template so we can reproduce and fix it fast.</div>
              </div>
            </a>
            <a 
              href="#contact-form" 
              onClick={(e) => scrollToForm(e, 'Feature Request', 'Feature idea:\n\nWhy it would help:\n\nHow you imagine it working:')}
              className="flex items-center gap-4 bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6 hover:border-sats-orange-500/30 transition-all group"
            >
              <div className="text-3xl shrink-0">💡</div>
              <div>
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1 font-mono">Have an idea?</div>
                <div className="text-[15px] font-black text-white group-hover:text-sats-orange-500 transition-colors">Request a Feature</div>
                <div className="text-xs text-gray-400 mt-1">Pre-fills the form with a feature request template. We read every suggestion.</div>
              </div>
            </a>
          </div>
        </div>

        {/* ─── PEER SUPPORT ─── */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-[13px] tracking-[0.2em] uppercase text-sats-orange-500 font-black font-mono mb-2">Fastest Help</div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Get Peer Support 24/7</h2>
            <p className="text-sm text-gray-400 mt-2 max-w-lg mx-auto font-medium">Outside business hours? Our community on Telegram and Discord is active around the clock — often the fastest way to get an answer.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="https://t.me/satsearnapp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-[#050505] border border-[#1a1a1a] rounded-2xl p-5 hover:border-sats-orange-500/30 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center shrink-0 text-sats-orange-500">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-white group-hover:text-sats-orange-500 transition-colors">Telegram Community</div>
                <div className="text-xs text-gray-400">Active 24/7 · Often the fastest response</div>
              </div>
            </a>
            <a href="https://discord.gg/satsearn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-[#050505] border border-[#1a1a1a] rounded-2xl p-5 hover:border-sats-orange-500/30 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-sats-orange-500/10 border border-sats-orange-500/20 flex items-center justify-center shrink-0 text-sats-orange-500">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </div>
              <div>
                <div className="text-sm font-black text-white group-hover:text-sats-orange-500 transition-colors">Discord Server</div>
                <div className="text-xs text-gray-400">Help channels · Tips & tricks</div>
              </div>
            </a>
          </div>
        </div>

        {/* ─── CONTACT FAQ ─── */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-[13px] tracking-[0.2em] uppercase text-sats-orange-500 font-black font-mono mb-2">Common Questions</div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Frequently Asked</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "How long do withdrawals take?",
                a: "Once your balance has matured and you request a withdrawal, Lightning Network payouts are typically processed quickly — usually within minutes. If a withdrawal is pending much longer than expected, contact us."
              },
              {
                q: "Why is my account restricted or suspended?",
                a: "Accounts may be restricted for unusual activity or suspected multi-accounting. If you believe this is an error, email us with your registered email address and we'll investigate within 24–48 hours."
              },
              {
                q: "My task wasn't credited — what do I do?",
                a: "Task credits go through a verification window before appearing as pending. If a completed task is still missing after that, make sure you finished all the required steps. Still missing? Email us with the task name, date, and a screenshot."
              },
              {
                q: "What is the minimum withdrawal amount?",
                a: "Free tiers can withdraw from 25,000 sats. Paid tiers have lower minimums — from 20,000 sats (Platinum) down to 10,000 sats (Founders)."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-[#050505] border border-[#1a1a1a] rounded-2xl open:border-sats-orange-500/30 transition-all [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-5 text-[15px] font-bold text-white cursor-pointer select-none group-hover:text-sats-orange-500 transition-colors">
                  {faq.q}
                  <span className="text-xl text-gray-500 group-open:rotate-180 group-open:text-sats-orange-500 transition-transform">⌄</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/faq" className="inline-flex items-center gap-2 bg-sats-orange-500/10 border border-sats-orange-500/20 text-sats-orange-500 hover:bg-sats-orange-500/20 px-6 py-3 rounded-xl font-bold text-sm transition-all">
              View all FAQs &rarr;
            </a>
          </div>
        </div>

        {/* ─── SOCIAL LINKS ─── */}
        <div id="connect" className="text-center pt-8 border-t border-[#1a1a1a] scroll-mt-24">
          <h3 className="text-xl font-black text-white mb-2">Follow & Connect With Us</h3>
          <p className="text-sm text-gray-400 mb-8 font-medium">Join our community across platforms — follow, engage, and stay up to date.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="https://twitter.com/satsearn" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 bg-[#050505] border border-[#1a1a1a] rounded-[14px] px-4 py-6 hover:border-sats-orange-500/30 hover:-translate-y-[3px] hover:bg-[#0a0a0a] transition-all group">
              <div className="text-gray-500 group-hover:text-white transition-colors mb-1"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></div>
              <div className="text-[13px] font-bold text-white group-hover:text-sats-orange-500 transition-colors">X / Twitter</div>
              <div className="text-xs text-gray-500 font-mono">@satsearn</div>
            </a>
            <a href="https://t.me/satsearnapp" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 bg-[#050505] border border-[#1a1a1a] rounded-[14px] px-4 py-6 hover:border-sats-orange-500/30 hover:-translate-y-[3px] hover:bg-[#0a0a0a] transition-all group">
              <div className="text-gray-500 group-hover:text-white transition-colors mb-1"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></div>
              <div className="text-[13px] font-bold text-white group-hover:text-sats-orange-500 transition-colors">Telegram</div>
              <div className="text-xs text-gray-500 font-mono">@satsearnapp</div>
            </a>
            <a href="https://youtube.com/@satsearnapp" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 bg-[#050505] border border-[#1a1a1a] rounded-[14px] px-4 py-6 hover:border-sats-orange-500/30 hover:-translate-y-[3px] hover:bg-[#0a0a0a] transition-all group">
              <div className="text-gray-500 group-hover:text-white transition-colors mb-1"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></div>
              <div className="text-[13px] font-bold text-white group-hover:text-sats-orange-500 transition-colors">YouTube</div>
              <div className="text-xs text-gray-500 font-mono">@satsearnapp</div>
            </a>
            <a href="https://discord.gg/satsearn" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 bg-[#050505] border border-[#1a1a1a] rounded-[14px] px-4 py-6 hover:border-sats-orange-500/30 hover:-translate-y-[3px] hover:bg-[#0a0a0a] transition-all group">
              <div className="text-gray-500 group-hover:text-white transition-colors mb-1"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg></div>
              <div className="text-[13px] font-bold text-white group-hover:text-sats-orange-500 transition-colors">Discord</div>
              <div className="text-xs text-gray-500 font-mono">/satsearn</div>
            </a>
            <a href="https://instagram.com/satsearn" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 bg-[#050505] border border-[#1a1a1a] rounded-[14px] px-4 py-6 hover:border-sats-orange-500/30 hover:-translate-y-[3px] hover:bg-[#0a0a0a] transition-all group">
              <div className="text-gray-500 group-hover:text-white transition-colors mb-1"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg></div>
              <div className="text-[13px] font-bold text-white group-hover:text-sats-orange-500 transition-colors">Instagram</div>
              <div className="text-xs text-gray-500 font-mono">@satsearn</div>
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 bg-[#050505] border border-[#1a1a1a] rounded-[14px] px-4 py-6 hover:border-sats-orange-500/30 hover:-translate-y-[3px] hover:bg-[#0a0a0a] transition-all group">
              <div className="text-gray-500 group-hover:text-white transition-colors mb-1"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.515 5.26l-.999 3.648 3.973-1.515zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.078 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg></div>
              <div className="text-[13px] font-bold text-white group-hover:text-sats-orange-500 transition-colors">WhatsApp</div>
              <div className="text-xs text-gray-500 font-mono">/satsearn</div>
            </a>
            <a href="https://linkedin.com/company/satsearn" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 bg-[#050505] border border-[#1a1a1a] rounded-[14px] px-4 py-6 hover:border-sats-orange-500/30 hover:-translate-y-[3px] hover:bg-[#0a0a0a] transition-all group">
              <div className="text-gray-500 group-hover:text-white transition-colors mb-1"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></div>
              <div className="text-[13px] font-bold text-white group-hover:text-sats-orange-500 transition-colors">LinkedIn</div>
              <div className="text-xs text-gray-500 font-mono">/satsearn</div>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
