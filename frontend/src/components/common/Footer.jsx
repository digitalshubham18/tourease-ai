import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { MdFlight } from 'react-icons/md'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><MdFlight className="text-white" /></div>
              <span className="text-xl font-bold gradient-text">TourEase AI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">India's smartest AI-powered tourism platform. Plan trips, book verified hotels, and explore incredible destinations across Incredible India.</p>
            <div className="space-y-2 mb-5">
              <a href="mailto:support@tourease.ai" className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 text-sm transition-colors"><FiMail size={14} />support@tourease.ai</a>
              <a href="tel:+919876543210" className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 text-sm transition-colors"><FiPhone size={14} />+91 98765 43210</a>
              <div className="flex items-center gap-2 text-slate-400 text-sm"><FiMapPin size={14} />New Delhi, India 110001</div>
            </div>
            <div className="flex gap-3">
              {[{ Icon: FiGithub, href: 'https://github.com' }, { Icon: FiTwitter, href: 'https://twitter.com' }, { Icon: FiInstagram, href: 'https://instagram.com' }, { Icon: FiMail, href: 'mailto:support@tourease.ai' }].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all border border-white/10">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-slate-200 mb-5">Explore</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/hotels', label: '🏨 Browse Hotels' },
                { to: '/ai-planner', label: '🤖 AI Trip Planner' },
                { to: '/hotels?featured=true', label: '⭐ Featured Hotels' },
                { to: '/hotels?category=luxury', label: '💎 Luxury Hotels' },
                { to: '/hotels?category=budget', label: '💰 Budget Hotels' },
                { to: '/hotels?category=resort', label: '🌴 Resorts' },
              ].map((l) => (
                <li key={l.to}><Link to={l.to} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-slate-200 mb-5">Company</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/about', label: '👥 About Us' },
                { to: '/about#team', label: '🏆 Our Team' },
                { to: '/about#mission', label: '🎯 Our Mission' },
                { to: '/contact', label: '📬 Contact Us' },
                { to: '/support', label: '🎫 Support Center' },
                { to: '/about#hackathon', label: '🏅 SIH 2024' },
              ].map((l) => (
                <li key={l.to}><Link to={l.to} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-slate-200 mb-5">Legal</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/privacy', label: '🔒 Privacy Policy' },
                { to: '/terms', label: '📄 Terms of Service' },
                { to: '/cookies', label: '🍪 Cookie Policy' },
                { to: '/support', label: '💬 Help Center' },
                { to: '/contact', label: '📞 Contact Support' },
              ].map((l) => (
                <li key={l.to}><Link to={l.to} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">{l.label}</Link></li>
              ))}
            </ul>

            {/* Payment accepted */}
            <div className="mt-6">
              <p className="text-xs text-slate-500 mb-3">Accepted Payments</p>
              <div className="flex flex-wrap gap-1.5">
                {['Visa', 'MC', 'RuPay', 'UPI', 'GPay', 'PhonePe', 'Paytm', 'BHIM'].map((p) => (
                  <span key={p} className="px-2 py-0.5 glass border border-white/10 rounded text-xs text-slate-400 font-medium">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="py-6 border-y border-white/5 mb-6">
          <p className="text-xs text-slate-500 mb-3">Popular Destinations</p>
          <div className="flex flex-wrap gap-2">
            {['Goa', 'Rajasthan', 'Kerala', 'Manali', 'Agra', 'Varanasi', 'Mumbai', 'Delhi', 'Jaipur', 'Udaipur', 'Darjeeling', 'Coorg', 'Andaman', 'Leh-Ladakh', 'Rishikesh'].map((d) => (
              <Link key={d} to={`/hotels?city=${d}`} className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">{d}</Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2024 TourEase AI. All rights reserved. Built for Smart India Hackathon 2024.</p>
          <div className="flex items-center gap-4">
            <p className="text-slate-500 text-sm">🇮🇳 Promoting Incredible India</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-400">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
