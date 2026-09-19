import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { motion } from 'framer-motion'

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="pt-20 max-w-4xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="badge-primary mb-4">🍪 Legal</span>
          <h1 className="text-4xl font-black text-slate-100 mb-3">Cookie Policy</h1>
          <p className="text-slate-400 mb-8">Last updated: December 1, 2024</p>
          <div className="space-y-5">
            {[
              { title: 'What Are Cookies?', content: 'Cookies are small text files stored on your device when you visit websites. They help sites remember your preferences, keep you logged in, and understand how you use the platform.' },
              { title: 'Cookies We Use', content: null, table: [
                { name: 'token', purpose: 'Authentication — keeps you logged in', duration: '7 days', type: 'Essential' },
                { name: 'session', purpose: 'Session management for OAuth flows', duration: 'Session', type: 'Essential' },
                { name: 'currency_pref', purpose: 'Remembers your preferred currency', duration: '1 year', type: 'Functional' },
                { name: '_ga, _gid', purpose: 'Google Analytics — usage statistics', duration: '2 years', type: 'Analytics' },
              ]},
              { title: 'Managing Cookies', content: 'You can control cookies through your browser settings. Disabling essential cookies will affect login and session functionality. Analytics cookies can be disabled without impacting core features. Use browser settings: Chrome > Settings > Privacy > Cookies | Firefox > Options > Privacy.' },
              { title: 'No Advertising Cookies', content: 'TourEase AI products are completely ad-free. We do not use advertising cookies, tracking pixels, or third-party ad networks. Your browsing data is never sold to advertisers.' },
            ].map((sec, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card p-6">
                <h2 className="font-bold text-slate-200 text-lg mb-3">{sec.title}</h2>
                {sec.content && <p className="text-slate-400 text-sm leading-relaxed">{sec.content}</p>}
                {sec.table && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b border-white/10">{['Cookie', 'Purpose', 'Duration', 'Type'].map(h => <th key={h} className="text-left text-xs text-slate-400 py-2 pr-4">{h}</th>)}</tr></thead>
                      <tbody>{sec.table.map((row, j) => (
                        <tr key={j} className="border-b border-white/5">
                          <td className="py-2 pr-4 text-indigo-400 font-mono text-xs">{row.name}</td>
                          <td className="py-2 pr-4 text-slate-400 text-xs">{row.purpose}</td>
                          <td className="py-2 pr-4 text-slate-400 text-xs">{row.duration}</td>
                          <td className="py-2 text-xs"><span className={`badge ${row.type === 'Essential' ? 'badge-error' : row.type === 'Functional' ? 'badge-primary' : 'badge-warning'}`}>{row.type}</span></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
