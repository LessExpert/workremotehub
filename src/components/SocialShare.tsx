'use client';

import { trackSocialShare, getUtmUrl } from '@/lib/tracking';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
}

export default function SocialShare({ title, url, description = 'Check out this crypto burn analytics dashboard' }: SocialShareProps) {
  const handleShare = (platform: 'twitter' | 'telegram' | 'discord' | 'facebook') => {
    const utmUrl = getUtmUrl(url, 'social_share');
    trackSocialShare(platform, url);
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(utmUrl)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(utmUrl)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'discord':
        window.open(`https://discord.com/channels/@me/${encodeURIComponent(utmUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(utmUrl)}`, '_blank');
        break;
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-900 rounded-xl">
      <span className="text-sm font-medium text-gray-400">Share:</span>
      <div className="flex gap-2">
        <button
          onClick={() => handleShare('twitter')}
          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition"
          aria-label="Share on Twitter"
        >
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.235a1.5 1.5 0 0 0-.86-.538H6.652a1.5 1.5 0 0 0-.86.538A1.49 1.49 0 0 0 5 3.724V12.5c0 .627.256 1.215.713 1.643.457.428 1.06.674 1.697.674h10.091c.637 0 1.24-.246 1.697-.674.457-.428.713-.99.713-1.643V3.724a1.49 1.49 0 0 0-.756-1.489z" />
          </svg>
        </button>
        <button
          onClick={() => handleShare('facebook')}
          className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition"
          aria-label="Share on Facebook"
        >
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.563 9.897v-6.987H7.904V11.5h2.659V9.427c0-2.633 1.572-4.098 3.966-4.098 1.142 0 2.331.203 2.331.203v2.561h-1.268c-1.243 0-1.616.771-1.616 1.562V11.5h2.787l-.447 6.523h-2.787v6.987C18.343 21.128 22 16.991 22 12z" />
          </svg>
        </button>
        <button
          onClick={() => handleShare('telegram')}
          className="p-2 bg-blue-400/20 hover:bg-blue-400/30 rounded-lg transition"
          aria-label="Share on Telegram"
        >
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 4.51c.199-.002.398 0 .596.011.792.032 1.57.125 2.328.388a13.2 13.2 0 0 1 2.023.863c.71.428 1.343.93 1.9 1.486.556.556 1.046 1.18 1.486 1.9a13.2 13.2 0 0 1 .862 2.328c.125.758.193 1.536.206 2.328a13.5 13.5 0 0 1-.011.596c-.032.792-.125 1.57-.388 2.328a13.1 13.1 0 0 1-.863 2.023c-.427.71-1.006 1.343-1.625 1.9-.619.557-1.29.974-2.017 1.25a13.5 13.5 0 0 1-2.328.206c-.792.012-1.57.08-2.328.206a13.1 13.1 0 0 1-2.023-.863c-.71-.427-1.343-1.006-1.9-1.625a13.1 13.1 0 0 1-1.25-2.017c-.263-.758-.35-1.536-.388-2.328a13.2 13.2 0 0 1 .862-2.023c.427-.71.974-1.343 1.625-1.9.619-.556 1.29-.974 2.017-1.25.727-.276 1.498-.5 2.328-.619.792-.032 1.57-.044 2.328-.011z" />
          </svg>
        </button>
        <button
          onClick={() => handleShare('discord')}
          className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg transition"
          aria-label="Share on Discord"
        >
          <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm0-8h-2V4h2v2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}