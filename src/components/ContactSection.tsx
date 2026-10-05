import React, { useState } from 'react';
import { sendContactMessage } from '../lib/supabase.ts';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError('Please provide your name, phone number, and message.');
      return;
    }

    try {
      setLoading(true);
      await sendContactMessage({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        message: message.trim(),
      });
      setSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.error('Contact submit error', err);
      setError('Could not send message. Please reach us directly via WhatsApp: 03273172804');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            Contact Dubai Transport
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal">
            Get in touch for instant bookings, inquiries, and commercial transport quotes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Business Info Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0A1628] rounded-3xl p-6 sm:p-8 text-white space-y-5 shadow-xl">
              <h3 className="text-xl font-extrabold text-white">
                Dubai Transport Center
              </h3>

              <div className="space-y-3 pt-1">
                <a
                  href="https://wa.me/923273172804?text=Hello%20Dubai%20Transport,%20I%20would%20like%20to%20inquire%20about%20transport%20rates."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">WhatsApp</p>
                    <p className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      03273172804
                    </p>
                  </div>
                </a>

                <a
                  href="tel:03273172804"
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">Phone</p>
                    <p className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                      03273172804
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:s38454672@gmail.com"
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">Email</p>
                    <p className="text-sm font-semibold text-white">
                      s38454672@gmail.com
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium">Location</p>
                    <p className="text-sm font-semibold text-white">
                      Dubai, United Arab Emirates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form Column */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              Send a Message
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Fill out your details and we will get back to you immediately.
            </p>

            {success ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">
                  Message Sent Successfully
                </h4>
                <p className="text-xs text-emerald-700">
                  Thank you. We will contact you at {phone || 'your phone number'}.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="03273172804"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="s38454672@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you want to transport..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
