'use client';

export default function NewsletterSignup() {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-bold mb-2 text-white">Get Burn Updates</h3>
      <p className="text-gray-400 text-sm mb-4">
        Join 5,000+ crypto investors tracking token burns weekly
      </p>
      <form 
        action="https://buttondown.com/api/emails/embed-subscribe/workremotehub" 
        method="post" 
        target="popupwindow"
        onSubmit={() => window.open('https://buttondown.com/workremotehub', 'popupwindow')}
        className="space-y-3"
      >
        <input
          type="email"
          name="email"
          placeholder="Your email"
          required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Subscribe
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-3">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}