const fs = require('fs');
const file = 'c:/Users/sumit/Desktop/Sats_Earn/Sats_Earn_Frontend/src/app/contact/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Find the bounds of the Marquee + Cards block (which is currently right before PLATFORM HEALTH)
const marqueeStart = content.indexOf('{/* ─── INFINITE MARQUEE ─── */}');
const platformHealthStart = content.indexOf('{/* ─── PLATFORM HEALTH ─── */}');

if (marqueeStart !== -1 && platformHealthStart !== -1) {
  let marqueeAndCards = content.substring(marqueeStart, platformHealthStart);
  
  // Remove it from current position
  content = content.replace(marqueeAndCards, '');
  
  // Create new cards HTML based on the image provided
  const newCardsHtml = `
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6 hover:border-sats-orange-500/30 transition-all">
              <div className="text-2xl mb-3">🛟</div>
              <div className="text-[15px] font-bold text-white mb-2">General Support</div>
              <div className="text-[13px] text-gray-400 leading-relaxed mb-4">General inquiries, technical issues, or platform questions.</div>
              <div onClick={(e) => scrollToForm(e, 'General Support')} className="text-[13px] font-bold text-sats-orange-500 hover:text-sats-orange-400 cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                support@satsearn.app
              </div>
              <div className="text-xs text-gray-400 italic mt-2">⏱ Response time: 24–48 hours</div>
            </div>
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6 hover:border-sats-orange-500/30 transition-all">
              <div className="text-2xl mb-3">💳</div>
              <div className="text-[15px] font-bold text-white mb-2">Billing &amp; Subscriptions</div>
              <div className="text-[13px] text-gray-400 leading-relaxed mb-4">Questions about paid-tier subscriptions, payment issues, or renewals.</div>
              <div onClick={(e) => scrollToForm(e, 'Billing')} className="text-[13px] font-bold text-sats-orange-500 hover:text-sats-orange-400 cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                support@satsearn.app
              </div>
              <div className="text-xs text-gray-400 italic mt-2">⏱ Response time: 24 hours</div>
            </div>
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6 hover:border-sats-orange-500/30 transition-all">
              <div className="text-2xl mb-3">🔐</div>
              <div className="text-[15px] font-bold text-white mb-2">Privacy &amp; Data</div>
              <div className="text-[13px] text-gray-400 leading-relaxed mb-4">Data access or deletion requests, or privacy concerns.</div>
              <div onClick={(e) => scrollToForm(e, 'Other')} className="text-[13px] font-bold text-sats-orange-500 hover:text-sats-orange-400 cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                support@satsearn.app
              </div>
              <div className="text-xs text-gray-400 italic mt-2">⏱ Response time: up to 30 days</div>
            </div>
            <div className="bg-[#050505] border border-[#1a1a1a] rounded-2xl p-6 hover:border-sats-orange-500/30 transition-all">
              <div className="text-2xl mb-3">🛡️</div>
              <div className="text-[15px] font-bold text-white mb-2">Security Issues</div>
              <div className="text-[13px] text-gray-400 leading-relaxed mb-4">Report vulnerabilities or security concerns.</div>
              <div onClick={(e) => scrollToForm(e, 'Security')} className="text-[13px] font-bold text-sats-orange-500 hover:text-sats-orange-400 cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                support@satsearn.app
              </div>
              <div className="text-xs text-gray-400 italic mt-2">⏱ Critical: 24h · Non-critical: 72h</div>
            </div>
          </div>
`;

  const gridStart = marqueeAndCards.indexOf('<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">');
  let textCenterStart = marqueeAndCards.indexOf('<div className="text-center mt-6 text-sm text-gray-400 font-medium">', gridStart);
  if (textCenterStart === -1) {
    // If we can't find it, just grab up to the final closing divs
    textCenterStart = marqueeAndCards.lastIndexOf('</div>\n        </div>');
  }

  // Inject new cards
  marqueeAndCards = marqueeAndCards.substring(0, gridStart) + newCardsHtml + marqueeAndCards.substring(textCenterStart);

  // 2. Insert BEFORE SAVE TIME block
  const saveTimeStart = content.indexOf('{/* ─── SAVE TIME ─── */}');
  
  if (saveTimeStart !== -1) {
    content = content.substring(0, saveTimeStart) + marqueeAndCards + '\n' + content.substring(saveTimeStart);
    fs.writeFileSync(file, content);
    console.log('Successfully updated contact page.');
  } else {
    console.log('SAVE TIME block not found.');
  }
} else {
  console.log('Marquee or Platform Health block not found.');
}
