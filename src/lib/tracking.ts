export const trackAffiliateClick = (platform: string, action: string) => {
  console.log(`Affiliate Click Tracked - Platform: ${platform}, Action: ${action}`);
  // Integrate with analytics service here if needed
};

export const trackSocialShare = (platform: string, url: string) => {
  console.log(`Social Share Tracked - Platform: ${platform}, URL: ${url}`);
};

export const getUtmUrl = (url: string, campaign: string, medium: string = 'social', source: string = 'burniqo') => {
  const urlObj = new URL(url);
  urlObj.searchParams.set('utm_source', source);
  urlObj.searchParams.set('utm_medium', medium);
  urlObj.searchParams.set('utm_campaign', campaign);
  return urlObj.toString();
};
