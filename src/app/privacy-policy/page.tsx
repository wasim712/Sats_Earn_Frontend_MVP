export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#020202] px-4 py-10 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sats-orange-400">Legal</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Privacy Policy</h1>
          <p className="mt-3 text-sm text-gray-400">SatsEarn explains what information we collect, how we use it, and how users can contact us about privacy concerns.</p>
        </div>

        <section className="rounded-3xl border border-[#1a1a1a] bg-[#080808] p-6 space-y-5">
          <div>
            <h2 className="text-xl font-black">Information We Collect</h2>
            <p className="mt-2 text-sm leading-7 text-gray-300">We may collect account details such as name, email address, username, wallet information, submitted task data, device/browser details, and general platform usage data needed to operate SatsEarn securely.</p>
          </div>

          <div>
            <h2 className="text-xl font-black">How We Use Information</h2>
            <p className="mt-2 text-sm leading-7 text-gray-300">We use collected information to create accounts, process rewards, protect against fraud, improve user experience, support users, and maintain platform security and functionality.</p>
          </div>

          <div>
            <h2 className="text-xl font-black">Cookies and Analytics</h2>
            <p className="mt-2 text-sm leading-7 text-gray-300">SatsEarn may use cookies, analytics tools, and advertising-related technologies to understand traffic, improve performance, and support monetization features such as Google AdSense where applicable.</p>
          </div>

          <div>
            <h2 className="text-xl font-black">Contact</h2>
            <p className="mt-2 text-sm leading-7 text-gray-300">For privacy questions, account issues, or data-related requests, please use the public contact page available on this website.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
