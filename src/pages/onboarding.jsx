import React, { useMemo, useState } from "react";
import styles from "../styles/Onbroading.module.css";
import Navbar from "../components/Navbar";
import http from "../http/http";

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
          <img className={styles.Icon} src={icon}/>
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

  const features = useMemo(
    () => [
      {
        title: "Realistic Virtual Try-On",
        icon: "/icons/stylingIcon.png",
        desc: "Preview clothes on your full body with honest results. TryOn avoids fake perfection and tells you when a photo isn’t good enough for accuracy."
      },
      {
        title: "🧠 Personal AI Stylist",
        icon: "/icons/personal-stylist.png",
        desc: "Get outfit suggestions from your own clothes. Every recommendation comes with a clear explanation — fit, color, and occasion included."
      },
      {
        title: "☀️ Context-Aware Styling",
        icon: "/icons/context-aware.png",
        desc: "Outfits that match your day. TryOn considers weather, occasion, comfort, and activity so your look always makes sense."
      },
      {
        title: "🔐 Built for Trust",
        icon: "/icons/trust.png",
        desc: "No charges for failed results. Clear AI limits. Your photos stay private and under your control."
      }
    ],
    []
  );

  const steps = useMemo(
    () => [
      { k: "01", t: "Open TryOn", d: "Use it instantly on any device." },
      { k: "02", t: "Pick an Outfit", d: "Select what you want to try on." },
      { k: "03", t: "See It On You", d: "Preview and compare before you decide." }

    ],
    []
  );

  const testimonials = useMemo(
    () => [
      {
        name: "Store Owner",
        role: "Online Retail",
        quote:
          "TryOn reduced hesitation at checkout by giving customers clearer visual confidence before buying."
      },
      {
        name: "Fashion Creator",
        role: "Digital Media",
        quote:
          "It’s fast, clean, and mobile-first. Previewing and sharing looks feels natural, not gimmicky."
      },
      {
        name: "Customer",
        role: "Smart Shopper",
        quote:
          "I donl"
      }
    ],
    []
  );


  const pricing = useMemo(
    () => [
      {
        name: "Starter Pack",
        price: "$1.99",
        tokens: 10,
        desc: "Try TryOn with a few realistic previews.",
        items: [
          "10 try-on tokens",
          "Realistic full-body previews",
          "Side-by-side outfit comparison",
          "No charge for failed results"
        ],
        highlighted: false
      },
      {
        name: "Popular Pack",
        price: "$4.99",
        tokens: 30,
        desc: "Best value for everyday outfit decisions.",
        items: [
          "30 try-on tokens",
          "Everything in Starter Pack",
          "Color & fit guidance",
          "Context-aware styling"
        ],
        highlighted: true
      },
      {
        name: "Pro Pack",
        price: "$9.99",
        tokens: 80,
        desc: "For frequent shoppers and creators.",
        items: [
          "80 try-on tokens",
          "Everything in Popular Pack",
          "Faster processing priority",
          "Early access to new features"
        ],
        highlighted: false
      }
    ],
    []
  );


  const faqs = useMemo(
    () => [
      {
        q: "Do I need to install an app to use TryOn?",
        a: "You can use TryOn on the web or install it as a mobile app. Your experience stays the same across devices."
      },
      {
        q: "What does one token give me?",
        a: "One token gives you one realistic try-on preview. You’re only charged when a result is successfully generated."
      },
      {
        q: "What happens if a preview fails?",
        a: "If a photo isn’t suitable or a result can’t be generated, the token is not deducted."
      },
      {
        q: "Do my tokens expire?",
        a: "No. Tokens never expire and stay in your account until you use them."
      },
      {
        q: "Are my photos stored safely?",
        a: "Yes. Your images are securely stored and only used to generate your previews. You stay in full control."
      },
      {
        q: "Can I delete my generated images?",
        a: "Yes. You can delete your previews at any time directly from your account."
      }
    ],
    []
  );


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
              <Badge>Fast • Mobile • Shareable</Badge>
            </div>

            <h1 className={styles.heroTitle}>
              Virtual try-on See Your Outfit Before You Buy It.
            </h1>
            <p className={styles.heroSubtitle}>
              TryOn lets you preview outfits on your real body and get smart styling advice from your own 
              wardrobe — so you can choose with confidence, not guesswork.
            </p>

            <div className={styles.heroCtas}>
              <PrimaryButton href="#get-started">Get started</PrimaryButton>
              <SecondaryButton href="#features">See features</SecondaryButton>
            </div>

            <div className={styles.heroStats} aria-label="Key highlights">
              <div className={styles.stat}>
                <div className={styles.statValue}>1–2s</div>
                <div className={styles.statLabel}>snappy UI feel</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>100%</div>
                <div className={styles.statLabel}>responsive layout</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>0</div>
                <div className={styles.statLabel}>global CSS leaks</div>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.previewCard} role="img" aria-label="TryOn preview mock">
              <div className={styles.previewTop}>
                <div className={styles.previewDot} />
                <div className={styles.previewDot} />
                <div className={styles.previewDot} />
              </div>
              <div className={styles.previewBody}>
                <div className={styles.previewPhone}>
                  <div className={styles.previewPhoneHeader}>
                    <span className={styles.previewPill}>TryOn</span>
                    <span className={styles.previewPillMuted}>Preview</span>
                  </div>
                  <div className={styles.previewCanvas} />
                  <div className={styles.previewRow}>
                    <div className={styles.previewThumb} />
                    <div className={styles.previewThumb} />
                    <div className={styles.previewThumb} />
                    <div className={styles.previewThumb} />
                  </div>
                  <div className={styles.previewActions}>
                    <div className={styles.previewBtn} />
                    <div className={styles.previewBtnAlt} />
                  </div>
                </div>

                <div className={styles.previewSide}>
                  <div className={styles.previewLine} />
                  <div className={styles.previewLineWide} />
                  <div className={styles.previewLine} />
                  <div className={styles.previewBadgeRow}>
                    <span className={styles.previewTag}>Responsive</span>
                    <span className={styles.previewTag}>Clean UI</span>
                    <span className={styles.previewTag}>Modular</span>
                  </div>
                  <div className={styles.previewBlock} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className={styles.section} id="features">
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>Features</h2>
          <p className={styles.muted}>
            A modern layout that you can wire to any backend or try-on engine.
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
            Keep the flow simple: pick, preview, share.
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
          <p className={styles.muted}>Simple tiers—adjust to your business model.</p>
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
          <p className={styles.muted}>Common questions about this template.</p>
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
              Try TryOn before everyone else
            </h2>
            <p className={styles.ctaSubtitle}>
              We’re launching soon. Join the waitlist to get early access and special launch discounts.
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
