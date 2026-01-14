import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/Onbroading.module.css";
import Navbar from "../components/Navbar";
import http from "../http/http";
import WaitlistCard from "../components/waitlistCard";
import { Link } from "react-router-dom";
import FilterGrid from "../components/extraComponents/filterGrid";
import AppPublicCard from "../components/extraComponents/appPublicCard";

function Badge({ children }) {
  return <span className={styles.badge}>{children}</span>;
}

function PrimaryButton({ children, onClick, href }) {
  const content = (
    <>
      {children}
      <span className={styles.btnIcon} aria-hidden="true">→</span>
    </>
  );

  if (href) {
    return (
      <a className={styles.primaryBtn} href={href}>
        {content}
      </a>
    );
  }
  return (
    <button className={styles.primaryBtn} onClick={onClick}>
      {content}
    </button>
  );
}

function SecondaryButton({ children, href }) {
  return (
    <a className={styles.secondaryBtn} href={href}>
      {children}
    </a>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardIcon}>
          <img className={styles.Icon} src={`${import.meta.env.BASE_URL}${icon}`}/>
        </div>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
      <p className={styles.cardDesc}>{desc}</p>
    </div>
  );
}

function PricingCard({ name, price, tokens, desc, items, highlighted }) {
  return (
    <div className={`${styles.pricingCard} ${highlighted ? styles.highlight : ""}`}>
      <div className={styles.pricingHeader}>
        <h3 className={styles.pricingName}>{name}</h3>
        <div className={styles.pricingPrice}>
          <span className={styles.pricingAmount}>{price}</span>
          <span className={styles.pricingPeriod}>/{tokens} tokens</span>
        </div>
        <p className={styles.pricingDesc}>{desc}</p>
      </div>

      <ul className={styles.pricingList}>
        {items.map((it) => (
          <li key={it} className={styles.pricingItem}>
            <span className={styles.check} aria-hidden="true">✓</span>
            {it}
          </li>
        ))}
      </ul>

      <div className={styles.pricingCta}>
        <a className={highlighted ? styles.primaryBtn : styles.secondaryBtn} href="#get-started">
          Choose {name}
        </a>
      </div>
    </div>
  );
}

function FaqItem({ q, a, open, onToggle }) {
  return (
    <button className={styles.faqItem} onClick={onToggle} aria-expanded={open}>
      <div className={styles.faqTop}>
        <span className={styles.faqQ}>{q}</span>
        <span className={styles.faqChevron} aria-hidden="true">{open ? "–" : "+"}</span>
      </div>
      <div className={`${styles.faqA} ${open ? styles.faqOpen : ""}`}>
        <p>{a}</p>
      </div>
    </button>
  );
}

export default function Onbroading() {
  const [email, setEmail] = useState("");
  const [faqOpen, setFaqOpen] = useState(0);
  const [waitlistCount, setWaitlistCount] = useState(null);
  const [filters, setFilters] = useState([]);
  
  useEffect(()=>{
    const fetchWaitlist = async () => {
      try{
        const res = await http.get(`/webpage/waitlist`);
        if(res.data.success){
          setWaitlistCount(res.data.data);
        }
      }catch(err){
        setWaitlistCount(0)
      }
    };
    if(!waitlistCount) fetchWaitlist();
    if(filters.length === 0) handleGetFilters()
  },[]);

  const handleGetFilters = async () => {
    try{
      const res = await http.get(`/filters-example`);
      if(res.data.success){
        setFilters(res.data.data);
      }
    }
    catch(err){

    }
  }

  // ✅ FEATURES (AI Filters + Creator Marketplace)
  const features = [
    {
      title: "Trending AI Filters",
      icon: "icons/stylingIcon.png",
      desc: "Explore the most-used community filters—cinematic, film, vintage, clean, and more. One tap to apply."
    },
    {
      title: "Instant Preview",
      icon: "icons/personal-stylist.png",
      desc: "Upload a photo and preview the filter in seconds. Realistic results—no over-sharpening, no fake looks."
    },
    {
      title: "Create Your Own Filter",
      icon: "icons/context-aware.png",
      desc: "Creators can build filters using prompts + settings, publish them, and share with the community."
    },
    {
      title: "Creator Earnings & Analytics",
      icon: "icons/trust.png",
      desc: "Track uses, likes, saves, and trends. Earn revenue when others use your filters—transparent and fair."
    }
  ];


  // ✅ HOW IT WORKS (Filters flow)
  const steps = [
    { k: "01", t: "Pick a Filter", d: "Choose from trending, new, or creator collections." },
    { k: "02", t: "Upload a Photo", d: "Use any selfie or photo—your image stays yours." },
    { k: "03", t: "Generate & Share", d: "Apply the filter, download the result, and share it anywhere." }
  ];


  // ✅ PRICING (Tokens for image generations/edits)
  const pricing = [
    {
      name: "Starter Pack",
      price: "$1.99",
      tokens: 10,
      desc: "Try a few filters and see the quality.",
      items: [
        "10 generation tokens",
        "Access to trending filters",
        "High-quality results",
        "No charge for failed generations"
      ],
      highlighted: false
    },
    {
      name: "Popular Pack",
      price: "$4.99",
      tokens: 30,
      desc: "Best value for regular use.",
      items: [
        "30 generation tokens",
        "Everything in Starter Pack",
        "Faster processing priority",
        "Save favorites + collections"
      ],
      highlighted: true
    },
    {
      name: "Pro Pack",
      price: "$9.99",
      tokens: 80,
      desc: "For creators and power users.",
      items: [
        "80 generation tokens",
        "Everything in Popular Pack",
        "Early access to new filters",
        "Creator tools + advanced settings"
      ],
      highlighted: false
    }
  ];


  // ✅ FAQ (AI filters + privacy + creator earnings)
  const faqs = [
    {
      q: "Do I need to install an app?",
      a: "You can use the platform on the web and optionally install it as an app. Your account and filters stay the same across devices."
    },
    {
      q: "What does one token give me?",
      a: "One token gives you one successful AI filter generation (one output image). You’re only charged when the result is successfully generated."
    },
    {
      q: "What happens if generation fails?",
      a: "If the image can’t be generated, your token is not deducted."
    },
    {
      q: "Can I create and publish my own filters?",
      a: "Yes. Creators can build filters, publish them publicly or privately, and track usage."
    },
    {
      q: "How do creators earn money?",
      a: "Creators earn based on how often their filters are used. Usage counts, analytics, and payouts are transparent in the creator dashboard."
    },
    {
      q: "Are my photos private?",
      a: "Yes. Your photos are only used to generate your result. You control your uploads and can delete generated images anytime."
    }
  ];



  async function onSubmit(e) {
    e.preventDefault();
    try{
      const res = await http.post(`/webpage/waitlist`, {email: email.trim()});
      if(res.data.success){
        setEmail("");
        alert(`Thanks! We’ll reach out to: ${email}`);
      }
    }
    catch(err){
      alert(err);
    }
  }

  return (
    <div className={styles.page}>
      <Navbar />

      {/* HERO */}
      <header className={styles.hero} id="top">
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadges}>
              <Badge>TryOn</Badge>
              <Badge>AI filters • Community-made • Creator earnings</Badge>
            </div>

            <h1 className={styles.heroTitle}>
              "AI Filters You Can Create, Use, and Share."
            </h1>
            <p className={styles.heroSubtitle}>
              Discover trending filters, generate high-quality edits in seconds, and build your own filters to share with the community—and earn when others use them.
            </p>

            <div className={styles.heroCtas}>
              <Link to="/login"><PrimaryButton href="#get-started">Get started</PrimaryButton></Link>
              <SecondaryButton href="#features">See features</SecondaryButton>
            </div>

            <div className={styles.heroStats} aria-label="Key highlights">
              <div className={styles.stat}>
                <div className={styles.statValue}>1–2s</div>
                <div className={styles.statLabel}>preview generation</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>Real</div>
                <div className={styles.statLabel}>honest try-on results</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>0</div>
                <div className={styles.statLabel}>charges for failed previews</div>
              </div>
            </div>
            
            <div style={{marginTop:25}}>
              <WaitlistCard count={waitlistCount} live={true}/>
            </div>

          </div>

          <div className={styles.heroRight}>
             <FilterGrid data={filters}/>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className={styles.section} id="features">
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>Features</h2>
          <p className={styles.muted}>
            Everything you need to discover, apply, and create AI filters—built for community and creators.
          </p>
        </div>

        <div className={styles.grid4}>
          {features.map((f) => (
            <FeatureCard key={f.title} title={f.title} desc={f.desc} icon={f.icon}/>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.sectionAlt} id="how">
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>How it works</h2>
          <p className={styles.muted}>
            Simple flow: pick a filter, upload a photo, generate and share.
          </p>
        </div>

        <div className={styles.steps}>
          {steps.map((s) => (
            <div className={styles.step} key={s.k}>
              <div className={styles.stepK}>{s.k}</div>
              <div className={styles.stepBody}>
                <div className={styles.stepT}>{s.t}</div>
                <div className={styles.stepD}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.sectionAlt} >
        <div className={styles.appPublicCard}>
         <div style={{width:"80%"}}>
            <AppPublicCard
              title="TryOn Mobile"
              subtitle="Discover trending filters, generate high-quality edits in seconds"
              phoneLeftSrc="icons/phoneScreen1.png"
              phoneRightSrc="icons/phoneScreen2.png"
              appStoreHref="https://apple.com"
              googlePlayHref="https://play.google.com"
            />
         </div>
        </div>
      </section>

     {/* 
      <section className={styles.section} id="testimonials">
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>What people say</h2>
          <p className={styles.muted}>Replace these with real reviews when you’re ready.</p>
        </div>

        <div className={styles.grid3}>
          {testimonials.map((t) => (
            <div className={styles.quoteCard} key={t.name}>
              <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
              <div className={styles.quoteMeta}>
                <div className={styles.avatar} aria-hidden="true" />
                <div>
                  <div className={styles.quoteName}>{t.name}</div>
                  <div className={styles.quoteRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section> */}


      {/* PRICING */}
      <section className={styles.sectionAlt} id="pricing">
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>Pricing</h2>
          <p className={styles.muted}>Token-based pricing—pay only for successful generations.</p>
        </div>

        <div className={styles.pricingGrid}>
          {pricing.map((p) => (
            <PricingCard key={p.name} {...p} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.section} id="faq">
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>FAQ</h2>
          <p className={styles.muted}>Common questions about AI filters, privacy, and creator payouts.</p>
        </div>

        <div className={styles.faq}>
          {faqs.map((f, idx) => (
            <FaqItem
              key={f.q}
              q={f.q}
              a={f.a}
              open={faqOpen === idx}
              onToggle={() => setFaqOpen(faqOpen === idx ? -1 : idx)}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta} id="get-started">
        <div className={styles.ctaInner}>
          <div>
            <h2 className={styles.ctaTitle}>
              Get early access to the AI filter marketplace
            </h2>
            <p className={styles.ctaSubtitle}>
              We’re launching soon. Join the waitlist for early access, creator perks, and launch offers.
            </p>
          </div>

          <form className={styles.ctaForm} onSubmit={onSubmit}>
            <label className={styles.srOnly} htmlFor="email">Email</label>
            <input
              id="email"
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
            />
            <button className={styles.primaryBtn} type="submit">
              Join the waitlist <span className={styles.btnIcon} aria-hidden="true">→</span>
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
