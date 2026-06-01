'use client';

import { trackAffiliateClick } from '@/lib/tracking';

export default function AffiliateCTA() {
  const handleClick = () => {
    trackAffiliateClick('bitget', 'burn-dashboard-cta');
  };

  return (
    <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white text-center">
      <h3 className="text-lg font-bold mb-2">Track Crypto Burns</h3>
      <p className="text-sm mb-4 opacity-90">
        Still tracking burn analytics across chains
      </p>
      <a
        href="https://burniqo.com/crypto"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-block bg-white text-orange-600 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 transition"
      >
        View Burn Data
      </a>
    </div>
  );
}