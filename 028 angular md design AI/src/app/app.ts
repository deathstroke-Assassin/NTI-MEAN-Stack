import { Component, computed, signal } from '@angular/core';

type Copy = {
  nav: string[];
  download: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  body: string;
  primary: string;
  secondary: string;
};

@Component({
  selector: 'app-root',
  template: `
    <header class="site-header">
      <a class="brand" href="#top" aria-label="ZaloPay home">
        <span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M23.2 2.5 8.7 21.2c-.8 1-.1 2.5 1.2 2.5h8.3l-1.4 13.8L31.8 18.9c.8-1 .1-2.5-1.2-2.5h-8.2l.8-13.9Z" fill="currentColor"/></svg></span>
        <span>zalo<span>pay</span></span>
      </a>
      <nav class="desktop-nav" aria-label="Main navigation">
        @for (item of copy().nav; track item) { <a href="#{{ navTargets[$index] }}">{{ item }}</a> }
      </nav>
      <div class="header-actions">
        <span class="language" aria-label="Language: English">EN</span>
        <a class="button button-small" href="#download">{{ copy().download }} <span aria-hidden="true">↗</span></a>
        <button class="menu-toggle" type="button" (click)="menuOpen.update(v => !v)" [attr.aria-expanded]="menuOpen()" aria-label="Toggle navigation"><span></span><span></span></button>
      </div>
      @if (menuOpen()) {
        <nav class="mobile-nav" aria-label="Mobile navigation">
          @for (item of copy().nav; track item) { <a href="#{{ navTargets[$index] }}" (click)="menuOpen.set(false)">{{ item }}</a> }
          <a href="#download" class="mobile-download">{{ copy().download }} ↗</a>
        </nav>
      }
    </header>

    <main id="top">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-orb orb-one"></div><div class="hero-orb orb-two"></div>
        <div class="hero-inner">
          <div class="hero-copy">
            <div class="eyebrow"><span class="eyebrow-dot"></span>{{ copy().eyebrow }}</div>
            <h1 id="hero-title">{{ copy().title }}<span class="title-highlight">{{ copy().titleAccent }}</span></h1>
            <p class="hero-description">{{ copy().body }}</p>
            <div class="hero-buttons">
              <a class="button button-pill" href="#download">{{ copy().primary }} <span aria-hidden="true">↗</span></a>
              <a class="text-link" href="#services">{{ copy().secondary }} <span aria-hidden="true">→</span></a>
            </div>
            <div class="hero-proof"><div class="avatar-stack"><span>🌿</span><span>🌸</span><span>✨</span><b>+</b></div><div><strong>14M+</strong><span>trusted users</span></div><div class="proof-divider"></div><div class="rating"><span>★★★★★</span><small>4.8 / 5 on the App Store</small></div></div>
          </div>
          <div class="hero-visual" aria-label="ZaloPay app preview">
            <div class="floating-note note-cash"><span class="note-icon green-note">↗</span><div><small>Cashback received</small><strong>+ ₫50,000</strong></div><span class="note-spark">✦</span></div>
            <div class="floating-note note-safe"><span class="safe-check">✓</span><div><small>Secure transaction</small><strong>Confirmed</strong></div></div>
            <div class="phone-shadow"></div>
            <div class="phone">
              <div class="phone-screen">
                <div class="phone-notch"></div>
                <div class="phone-status"><span>9:41</span><span>●●● ▰</span></div>
                <div class="phone-top"><div><small>Welcome,</small><strong>Minh Anh <span>✦</span></strong></div><div class="phone-avatar">MA</div></div>
                <div class="wallet-card"><div class="wallet-label"><span>Wallet balance</span><span>•••</span></div><div class="wallet-balance">₫2,850,000<span class="eye">◉</span></div><div class="wallet-bottom"><span>ZaloPay Wallet <b>•</b> 090 *** 882</span><span class="wallet-logo">z</span></div><div class="wallet-glow"></div></div>
                <div class="quick-actions">
                  <div><span class="quick-icon transfer">↗</span><small>Transfer</small></div><div><span class="quick-icon scan">▦</span><small>Scan QR</small></div><div><span class="quick-icon pay">▤</span><small>Pay</small></div><div><span class="quick-icon add">＋</span><small>Top up</small></div>
                </div>
                <div class="phone-section-head"><strong>Picked for you</strong><span>See all →</span></div>
                <div class="mini-promo"><span class="mini-tag">TODAY’S DEAL</span><strong>Dine & get<br>up to ₫50,000 back</strong><span class="mini-food">🍜</span><span class="mini-cta">Get it now →</span></div>
                <div class="phone-section-head transaction-head"><strong>Recent transactions</strong><span>•••</span></div>
                <div class="transaction"><span class="transaction-icon coffee">☕</span><span><b>The Coffee House</b><small>Today, 9:42 AM</small></span><strong>- ₫65,000</strong></div>
                <div class="phone-tabbar"><span class="active-tab">⌂<small>Home</small></span><span>◷<small>History</small></span><span>▣<small>Rewards</small></span><span>◉<small>Profile</small></span></div>
              </div>
            </div>
            <div class="hero-confetti confetti-a">✦</div><div class="hero-confetti confetti-b">✧</div><div class="hero-confetti confetti-c">✦</div>
          </div>
        </div>
        <div class="hero-bottom"><span>Happier payments. Lighter living.</span><span class="scroll-cue">SCROLL TO EXPLORE <i>↓</i></span></div>
      </section>

      <section class="services section-wrap" id="services">
        <div class="section-heading"><div><span class="section-kicker">ONE TAP, MORE POSSIBILITIES</span><h2>Make everyday life easier<br>with <span>ZaloPay</span></h2></div><a class="all-services" href="#services">Explore all <span>↗</span></a></div>
        <div class="service-grid">
          <a href="#download" class="service-item"><span class="service-icon icon-blue"><svg viewBox="0 0 32 32"><path d="M7 11h18M20 6l5 5-5 5M25 21H7m5-5-5 5 5 5"/></svg></span><strong>Transfer</strong><small>Free, 24/7</small></a>
          <a href="#download" class="service-item"><span class="service-icon icon-green"><svg viewBox="0 0 32 32"><rect x="6" y="7" width="20" height="18" rx="3"/><path d="M10 12h12M10 17h5m4 0h3m-12 4h3"/></svg></span><strong>Bills</strong><small>Utilities & internet</small></a>
          <a href="#download" class="service-item"><span class="service-icon icon-orange"><svg viewBox="0 0 32 32"><path d="M5 10h22v16H5zM8 6h16v4M5 15h22m-15 4h5"/></svg></span><strong>Mobile top-up</strong><small>Save up to 10%</small></a>
          <a href="#download" class="service-item"><span class="service-icon icon-purple"><svg viewBox="0 0 32 32"><path d="M7 13h18v13H7zM10 13V9a6 6 0 0 1 12 0v4m-6 5v3"/></svg></span><strong>Savings</strong><small>Earn every day</small></a>
          <a href="#download" class="service-item"><span class="service-icon icon-pink"><svg viewBox="0 0 32 32"><path d="M16 26s-10-6-10-13a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 7-10 13-10 13Z"/><path d="M10 17h4l2-4 3 7 2-3h2"/></svg></span><strong>Insurance</strong><small>Peace of mind</small></a>
          <a href="#download" class="service-item"><span class="service-icon icon-cyan"><svg viewBox="0 0 32 32"><path d="M6 13h20v13H6zM9 13l2-6h10l2 6m-13 5h12m-8 4h4"/></svg></span><strong>Shopping</strong><small>Great deals daily</small></a>
        </div>
      </section>

      <section class="promo-section" id="offers">
        <div class="promo-inner">
          <div class="promo-copy"><span class="promo-kicker"><span>✦</span> SPECIAL OFFERS</span><h2>{{ activePromo().title }}<br>{{ activePromo().subtitle }}</h2><p>{{ activePromo().description }}</p><a class="promo-button" href="#download">{{ activePromo().action }} <span>↗</span></a><div class="promo-pagination"><button type="button" aria-label="Previous promotion" (click)="promoIndex.update(i => (i + 2) % 3)">←</button>@for (promo of promos; track promo.title; let index = $index) { <button class="promo-dot" [class.active-dot]="promoIndex() === index" type="button" [attr.aria-label]="'Show promotion ' + (index + 1)" [attr.aria-pressed]="promoIndex() === index" (click)="promoIndex.set(index)"></button> }<button type="button" aria-label="Next promotion" (click)="promoIndex.update(i => (i + 1) % 3)">→</button></div></div>
          <div class="promo-art"><div class="promo-sun"></div><div class="promo-ticket"><span class="ticket-top">ZALOPAY ✦ A DEAL JUST FOR YOU</span><strong>50<span>K</span></strong><span class="ticket-desc">CASHBACK WHEN YOU PAY</span><span class="ticket-line"></span><div class="ticket-bottom"><span>Available today</span><span class="ticket-stamp">Z</span></div></div><div class="promo-gift gift-one">🎁</div><div class="promo-gift gift-two">✦</div><div class="promo-chip">DEAL<br><b>HOT</b></div></div>
        </div>
      </section>

      <section class="trust-section section-wrap" id="about">
        <div class="trust-copy"><span class="section-kicker">PEACE OF MIND IN EVERY PAYMENT</span><h2>Security you can count on.<br>Confidence in every transaction.</h2><p>Your money is protected by multiple layers of internationally certified security. Pay safely, wherever you are.</p><a class="text-link" href="#about">Learn about security <span>→</span></a></div>
        <div class="trust-stats"><div class="stat-card"><span class="stat-icon">♧</span><strong>100%</strong><b>Secure transactions</b><small>PCI DSS certified security</small></div><div class="stat-card"><span class="stat-icon">♡</span><strong>14M+</strong><b>Trusted users</b><small>Enjoy more every day</small></div><div class="stat-card"><span class="stat-icon">◷</span><strong>24/7</strong><b>Always here for you</b><small>Support whenever you need it</small></div></div>
      </section>

      <section class="partners-section"><div class="partners-inner"><div><span class="section-kicker">CONNECTED TO WHAT YOU LOVE</span><h2>One tap brings you<br>everything you need.</h2></div><div class="partners-grid"><span class="partner-logo partner-vietcom">Vietcombank</span><span class="partner-logo partner-vietin">VietinBank</span><span class="partner-logo partner-momo">ShopeeFood</span><span class="partner-logo partner-fpt">FPT</span><span class="partner-logo partner-tiki">tiki</span><span class="partner-logo partner-be">be</span></div></div></section>

      <section class="download-section" id="download"><div class="download-pattern"></div><div class="download-content"><span class="download-kicker">GET STARTED TODAY</span><h2>Make every day<br>more joyful with ZaloPay.</h2><p>Download the app and enjoy smarter payments<br>in seconds.</p><div class="download-buttons"><a href="#download" class="store-button"><span class="store-icon">▶</span><span><small>Download on</small><b>Google Play</b></span></a><a href="#download" class="store-button"><span class="store-icon apple">●</span><span><small>Download on</small><b>App Store</b></span></a></div></div><div class="download-visual"><div class="download-orbit orbit-outer"></div><div class="download-orbit orbit-inner"></div><div class="download-mark"><svg viewBox="0 0 40 40"><path d="M23.2 2.5 8.7 21.2c-.8 1-.1 2.5 1.2 2.5h8.3l-1.4 13.8L31.8 18.9c.8-1 .1-2.5-1.2-2.5h-8.2l.8-13.9Z" fill="currentColor"/></svg></div><span class="download-star star-one">✦</span><span class="download-star star-two">✧</span></div></section>
    </main>

    <footer class="site-footer" id="footer"><div class="footer-main"><div class="footer-brand-col"><a class="brand footer-brand" href="#top"><span class="brand-mark"><svg viewBox="0 0 40 40"><path d="M23.2 2.5 8.7 21.2c-.8 1-.1 2.5 1.2 2.5h8.3l-1.4 13.8L31.8 18.9c.8-1 .1-2.5-1.2-2.5h-8.2l.8-13.9Z" fill="currentColor"/></svg></span><span>zalo<span>pay</span></span></a><p>Happier payments,<br>lighter living.</p><div class="social-links"><a href="#footer" aria-label="Facebook">f</a><a href="#footer" aria-label="Instagram">◎</a><a href="#footer" aria-label="Youtube">▶</a><a href="#footer" aria-label="TikTok">♪</a></div></div><div class="footer-links"><div><strong>Products</strong><a href="#services">E-wallet</a><a href="#services">Bill payments</a><a href="#offers">Rewards</a><a href="#services">Financial services</a></div><div><strong>About ZaloPay</strong><a href="#about">About us</a><a href="#about">News</a><a href="#about">Careers</a><a href="#about">Partners</a></div><div><strong>Support</strong><a href="#footer">Help center</a><a href="#footer">Contact us</a><a href="#footer">FAQs</a><a href="#footer">Support line 1900 545 436</a></div></div><div class="footer-qr"><div class="qr-grid" aria-label="QR code illustration"></div><span>Scan to download the app</span></div></div><div class="footer-bottom"><span>© 2024 Zion Joint Stock Company. A member of VNG Corporation.</span><div><a href="#footer">Terms of use</a><a href="#footer">Privacy policy</a><a href="#footer">🇺🇸 English</a></div></div></footer>
  `,
})
export class App {
  protected readonly menuOpen = signal(false);
  protected readonly promoIndex = signal(0);
  protected readonly promos = [
    { title: 'Double the joy,', subtitle: 'offers all around', description: 'Find new vouchers every day and enjoy effortless payments. Fresh offers are always waiting for you.', action: 'Explore offers' },
    { title: 'Dine out and', subtitle: 'get great cashback', description: 'Pay for your favorite meals and enjoy exciting cashback offers every day.', action: 'Get a voucher' },
    { title: 'Scan to pay,', subtitle: 'get a gift instantly', description: 'Shop with ease using ZaloPay and unlock gifts picked just for you.', action: 'View gifts' },
  ];
  protected readonly activePromo = computed(() => this.promos[this.promoIndex()]);
  protected readonly navTargets = ['services', 'offers', 'about'];
  protected readonly copy = () => this.en;

  private readonly en: Copy = {
    nav: ['Services', 'Offers', 'About us'], download: 'Get the app',
    eyebrow: "VIETNAM'S LEADING E-WALLET", title: 'Pay with joy. ', titleAccent: 'Joy in every tap.',
    body: 'Tap to pay and enjoy life to the fullest. Fast, secure, and filled with exclusive offers made just for you.',
    primary: 'Discover ZaloPay', secondary: 'Explore services',
  };

}



