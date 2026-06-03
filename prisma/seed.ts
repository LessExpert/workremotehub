// Seed sample articles with burning mechanisms
import { prisma } from '@/lib/prisma';

const articles = [
  {
    title: "Binance Coin (BNB) - Burn Mechanism Deep Dive",
    slug: 'binance-coin-burn-mechanism',
    description: "How BNB quarterly token burns affect supply dynamics and network security",
    content: 'Binance regularly burns BNB tokens from its reserves. This reduces circulating supply, creating scarcity and potentially increasing token value. Learn how a 50% supply burn since 2017 impacts BNB holders and BSC network fees.',
    published: true,
    tags: 'burning, tokenomics, binance',
    authorId: 'user123',
  },
  {
    title: "Ethereum EIP-1559 - Permanent Burn System Explained",
    slug: 'ethereum-eip-1559',
    description: "How EIP-1559 base fee burn creates deflationary pressure on ETH",
    content: "EIP-1559 introduced a burn mechanism for ETH gas fees. Every transaction burns a portion of ETH, reducing supply over time. This blog explores the implications for Ethereum monetary policy and gas pricing.",
    published: true,
    tags: 'burning, deflationary, ethereum',
    authorId: 'user123',
  },
  {
    title: "SafeMoon Automatic Burn and Reward System",
    slug: 'safemoon-burn-mechanics',
    description: "SafeMoon dual burn-and-reward model: 8% goes to holders, 2% burns permanently",
    content: 'SafeMoon allocates 8% of every transaction to holders (Safemoon Rewards) and burns 2% permanently. This creates a unique economic model that incentivizes holding while reducing token supply.',
    published: true,
    tags: 'burning, reward, ssto',
    authorId: 'user123',
  },
];

articles.forEach(async (article) => {
  await prisma.article.upsert({
    where: { slug: article.slug },
    update: article,
    create: article,
  });
});