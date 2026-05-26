/// <reference types="astro/client" />

/** Site-wide configuration constants. */

export const SITE = {
  title: "Remote Work Hub",
  tagline: "Curated tools, tips & gear for the modern remote workforce",
  description:
    "Expert reviews and practical guides on remote work gear, productivity tools, and digital nomad essentials. Find the best home office setup for your needs.",
  url: "https://workremotehub.com", // CHANGE
  author: "Alex",
  locale: "en_US",
  language: "en",
  ogImage: "/og-default.png",
};

export const SOCIAL = {
  twitter: "@remoteworkhub", // Optional
};

export const AMAZON_TAG = "remotework-20"; // Your Amazon affiliate tag

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Home Office Setup", href: "/categories/home-office-setup" },
  { label: "Productivity", href: "/categories/productivity" },
  { label: "Digital Nomad", href: "/categories/digital-nomad" },
  { label: "About", href: "/about" },
];