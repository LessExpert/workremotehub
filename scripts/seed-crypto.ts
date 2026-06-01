// Auto-seed crypto data every X hours
// Extend this to fetch live prices, burn data, etc.

console.log('📊 Seeding crypto data...');

// Example: fetch from API and write to DB
async function seedCryptoData() {
  try {
    // Placeholder for actual API calls
    const coins = ['BTC', 'ETH', 'BNB', 'SOL'];
    console.log('Fetched prices for:', coins.join(', '));
    // TODO: Write to DB
  } catch (error) {
    console.error('Seed failed:', error);
  }
}

seedCryptoData();

// Keep process alive for PM2 cron mode
setTimeout(() => {
  console.log('✅ Seed cycle complete');
  process.exit(0);
}, 5000);