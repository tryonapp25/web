import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import http from "../http/http";
import Navbar from "../components/Navbar";
import styles from "../styles/Onboarding.module.css";
import Model3D from "../components/3dModel";

const config = {
  camera_orbit: "auto 55deg",
}

const modelUrls = [
  {
    model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FGrilled%20Salmon.glb_5cdc2302-3b49-441b-9e22-614359b3eb3a.glb?alt=media&token=d98e06c1-8b4f-4879-9828-bc8348c86aac",
    url: ["https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2Fmenu-images%2FGrilled_Salmon_image.png?alt=media&token=2d43764e-9fde-417d-9e03-390f731af438"],
    name: "Grilled Salmon",
    price: "$18.99"
  },
  {
    model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FVegetable_Pad_Thai.glb_f33431a6-19d8-49c9-b558-94741e95d455.glb?alt=media&token=4356bb7f-1166-4e76-89c2-5e49d14393fc",
    url: ["https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2Fmenu-images%2FVegetable_Pad_Thai_image.png?alt=media&token=cee53760-4709-430a-882c-fff96758ddcc"],
    name: "Vegetable Pad Thai",
    price: "$11.99"
  },
  {
    model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FMushroom_Risotto.glb_c6e17090-f1df-42bf-8328-20102bccf529.glb?alt=media&token=0967964e-bcb8-4b50-aa57-8d831d18209b",
    url: ["https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2Fmenu-images%2Fmushroom_risotto.png?alt=media&token=ec54a883-663b-4040-8491-fb4fa1e5f2f6"],
    name: "Mushroom Risotto",
    price: "$14.99"
  },
];

const benefits = [
  {
    title: "Scan to Order (QR)",
    icon: `${import.meta.env.BASE_URL}images/scanToOrder.png`,
    desc: "Guests scan a QR code, browse a 3D menu, and order in seconds.",
  },
  {
    title: "Order From Your Table",
    icon: `${import.meta.env.BASE_URL}images/orderFromTable.png`,
    desc: "Increase ticket size with easy add-ons and frictionless re-orders.",
  },
  {
    title: "No More Waiting in Line",
    icon: `${import.meta.env.BASE_URL}images/noMoreWaiting.png`,
    desc: "Reduce peak-time bottlenecks and serve faster with self-ordering.",
  },
  {
    title: "POS + Kitchen Workflow",
    icon: `${import.meta.env.BASE_URL}images/easyToUse.png`,
    desc: "Orders flow straight to POS/KDS—no re-typing, fewer mistakes.",
  },
  {
    title: "Online Ordering",
    icon: `${import.meta.env.BASE_URL}images/noMoreStandOrder.png`,
    desc: "Pickup & delivery ordering on your website with your branding.",
  },
  {
    title: "Easy Menu Updates",
    icon: `${import.meta.env.BASE_URL}images/easyToOrder.png`,
    desc: "Change prices, items, combos, and availability anytime.",
  },
];

export default function Onboarding() {
  const startRef = useRef(false);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [currentBenefitIndex, setCurrentBenefitIndex] = useState(0);
  const [pricingData, setPricingData] = useState([]);


  useEffect(() => {
    if(startRef.current) return;
    startRef.current = true;
    getBusinessPricing();
  },[])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentModelIndex((prev) => (prev + 1) % modelUrls.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBenefitIndex((prev) => (prev + 1) % benefits.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  const getBusinessPricing = async () => {
    try {
      const response = await http.get("/business/pricing");
      setPricingData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching pricing:", error);
    }
  };
  

  return (
    <div className={styles.page}>
      <Navbar />

      {/* HERO */}
      <header className={styles.hero} id="top">
        <div className={styles.heroGlow} />
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span>✨</span> 3D Menu + Order Online + POS
            </div>

            <h1 className={styles.heroTitle}>
              The 3D menu that{" "}
              <span className={styles.heroHighlight}>takes orders</span>
              <br />
              and runs your POS.
            </h1>

            <p className={styles.heroSubtitle}>
              Turn browsing into buying. Let customers scan, order, and pay—while
              orders flow to your POS and kitchen automatically.
            </p>

            <div className={styles.heroCta}>
              <Link to="/login" className={styles.btnPrimary}>
                Start Free Trial <span>→</span>
              </Link>
              <a
                className={styles.btnSecondary}
                href="#how"
                onClick={(e) => scrollToSection(e, "how")}
              >
                How it works
              </a>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>QR + Web</div>
                <div className={styles.statLabel}>Ordering channels</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>POS Ready</div>
                <div className={styles.statLabel}>Orders to kitchen</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>3D Menu</div>
                <div className={styles.statLabel}>Premium experience</div>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.mockupContainer}>
              <div className={styles.mockupTopBar}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
                <div className={styles.mockupTopText}>Live 3D Menu</div>
              </div>
              <div className={styles.mockupImage}>
                <Model3D config={config} model={modelUrls[currentModelIndex]?.model} images={modelUrls[currentModelIndex]?.url} />
              </div>
              <div className={styles.mockupOverlay} />
            </div>

            <div className={styles.floatingCard}>
              <div className={styles.floatingTitle}>New Order</div>
              <div className={styles.floatingRow}>
                <span>{modelUrls[currentModelIndex]?.name}</span>
                <strong>{modelUrls[currentModelIndex]?.price}</strong>
              </div>
              <div className={styles.floatingRowMuted}>+ Fries • + Soda</div>
              <div className={styles.floatingFooter}>
                <span className={styles.pill}>Paid</span>
                <span className={styles.pillAlt}>Sent to Kitchen</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* BENEFITS (rotating) */}
      <section className={styles.section} id="benefits">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Benefits</span>
          <h2 className={styles.sectionTitle}>A better ordering experience</h2>
          <p className={styles.sectionSubtitle}>
            Fewer lines, faster service, higher average order value.
          </p>
        </div>

        <div className={styles.benefitShowcase}>
          <div className={styles.benefitCard}>
            <img
              src={benefits[currentBenefitIndex].icon}
              alt={benefits[currentBenefitIndex].title}
              className={styles.showcaseImage}
            />
            <h3 className={styles.showcaseTitle}>
              {benefits[currentBenefitIndex].title}
            </h3>
            <p className={styles.showcaseDesc}>
              {benefits[currentBenefitIndex].desc}
            </p>

            <div className={styles.showcaseDots}>
              {benefits.map((_, index) => (
                <span
                  key={index}
                  className={`${styles.showcaseDot} ${
                    index === currentBenefitIndex ? styles.activeDot : ""
                  }`}
                  onClick={() => setCurrentBenefitIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className={styles.benefitGridMini}>
            {benefits.map((b, i) => (
              <button
                key={b.title}
                className={`${styles.benefitMini} ${
                  i === currentBenefitIndex ? styles.benefitMiniActive : ""
                }`}
                onClick={() => setCurrentBenefitIndex(i)}
                type="button"
              >
                <div className={styles.benefitMiniTitle}>{b.title}</div>
                <div className={styles.benefitMiniDesc}>{b.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ORDER ONLINE */}
      <section className={styles.section} id="order-online">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Order Online</span>
          <h2 className={styles.sectionTitle}>Pickup & delivery on your site</h2>
          <p className={styles.sectionSubtitle}>
            Branded checkout, upsells, and automatic order routing to POS/KDS.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🛍️</div>
            <h3 className={styles.featureTitle}>Cart + Upsells</h3>
            <p className={styles.featureDesc}>
              Add-ons, combos, and “popular with this” suggestions to lift AOV.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💳</div>
            <h3 className={styles.featureTitle}>Pay online</h3>
            <p className={styles.featureDesc}>
              Smooth payment flow that feels premium and fast.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📦</div>
            <h3 className={styles.featureTitle}>Pickup & delivery</h3>
            <p className={styles.featureDesc}>
              Set prep times, pickup windows, and delivery availability.
            </p>
          </div>
        </div>
      </section>

      {/* POS SECTION */}
      <section className={styles.section} id="pos">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>POS System</span>
          <h2 className={styles.sectionTitle}>Run orders, tables, and kitchen</h2>
          <p className={styles.sectionSubtitle}>
            A modern POS foundation built for cafés and small restaurants.
          </p>
        </div>

        <div className={styles.posGrid}>
          <div className={styles.posCard}>
            <h3 className={styles.posTitle}>Front of house</h3>
            <ul className={styles.posList}>
              <li><span>✓</span> Quick add items & modifiers</li>
              <li><span>✓</span> Table management</li>
              <li><span>✓</span> Discounts & promos</li>
              <li><span>✓</span> Receipts & order history</li>
            </ul>
          </div>

          <div className={styles.posCard}>
            <h3 className={styles.posTitle}>Kitchen</h3>
            <ul className={styles.posList}>
              <li><span>✓</span> Auto-send orders to kitchen</li>
              <li><span>✓</span> Notes and item routing</li>
              <li><span>✓</span> Status updates (prepping/ready)</li>
              <li><span>✓</span> Fewer mistakes (no re-typing)</li>
            </ul>
          </div>

          <div className={styles.posCard}>
            <h3 className={styles.posTitle}>Back office</h3>
            <ul className={styles.posList}>
              <li><span>✓</span> Sales dashboard</li>
              <li><span>✓</span> Menu & availability control</li>
              <li><span>✓</span> Staff roles & permissions</li>
              <li><span>✓</span> Simple reporting</li>
            </ul>
          </div>
        </div>

        <div className={styles.callout}>
          <div className={styles.calloutIcon}>🚀</div>
          <p className={styles.calloutText}>
            <span className={styles.calloutHighlight}>
              One system for menu + ordering + POS.
            </span>
            <br />
            Your 3D menu becomes a sales channel—not just a display.
          </p>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className={styles.section} id="integrations">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Integrations</span>
          <h2 className={styles.sectionTitle}>Connect your workflow</h2>
          <p className={styles.sectionSubtitle}>
            Payments, printers, kitchen screens, and more—ready to plug in.
          </p>
        </div>

        <div className={styles.integrationsRow}>
          {["Payments", "Printers", "Kitchen Display", "QR Stands", "Analytics", "Delivery"].map(
            (x) => (
              <div key={x} className={styles.integrationChip}>
                {x}
              </div>
            )
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.section} id="how">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Simple Setup</span>
          <h2 className={styles.sectionTitle}>Go live in minutes</h2>
          <p className={styles.sectionSubtitle}>
            Create a 3D menu, enable ordering, and route to POS & kitchen.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Build your menu</h3>
            <p className={styles.stepDesc}>
              Add items, modifiers, categories, and 3D models.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Turn on ordering</h3>
            <p className={styles.stepDesc}>
              Enable QR ordering and online ordering for pickup/delivery.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Connect POS & kitchen</h3>
            <p className={styles.stepDesc}>
              Route orders automatically to the right station.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3 className={styles.stepTitle}>Track & optimize</h3>
            <p className={styles.stepDesc}>
              See best-sellers, peak hours, and improve conversions.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className={styles.section} id="pricing">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Pricing</span>
          <h2 className={styles.sectionTitle}>Start small. Scale fast.</h2>
          <p className={styles.sectionSubtitle}>
            Choose the plan that matches your café today.
          </p>
        </div>

        <div className={styles.pricingGrid}>
          {pricingData.length > 0 ? (
            pricingData.map((plan, index) => (
              <div className={`${styles.pricingCard} ${plan?.highlighted ? styles.featured : ""}`} key={index}>
                {plan?.popular && <div className={styles.pricingBadge}>Most Popular</div>}

                <h3 className={styles.pricingName}>{plan.pack}</h3>
                <div className={styles.pricingPrice}>
                  {plan.currency === "usd" ? "$" : plan.currency}
                  {plan.price}
                  <span>/ month</span>
                </div>
                <ul className={styles.pricingFeatures}>
                  {plan.items && plan.items.length > 0 ? (
                    plan.items.map((item, idx) => {
                      const name = item?.name || item || "";
                      const desc = item?.description || "";
                      const included = item?.included === undefined ? true : !!item.included;
                      return (
                        <li key={idx} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ color: included ? "#16a34a" : "#9ca3af", fontWeight: 700, paddingRight:"8px" }}>{included ? "✓" : "✗"}</span>
                          <div>
                            <div style={{ textDecoration: item?.included ? "none" : "line-through" }}>{desc}</div>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <li>No features listed</li>
                  )}
                </ul>
                <Link to="/login" className={styles.btnSecondary}>
                  {plan?.pack === "Pro" ? "Talk to us" : plan?.pack}
                </Link>
              </div>
            ))
          ) : (
            <p className={styles.noPricing}>Loading pricing...</p>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Turn your menu into revenue.</h2>
          <p className={styles.ctaSubtitle}>
            3D menus that guests love + ordering that staff trusts.
          </p>

          <div className={styles.ctaFeatures}>
            <div className={styles.ctaFeature}>
              <span>✓</span> QR + online ordering
            </div>
            <div className={styles.ctaFeature}>
              <span>✓</span> POS + kitchen workflow
            </div>
            <div className={styles.ctaFeature}>
              <span>✓</span> Easy menu updates
            </div>
          </div>

          <Link to="/login" className={styles.btnPrimary}>
            Get Started Today <span>→</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <img
              src={`${import.meta.env.BASE_URL}logos/logo.png`}
              alt="TryOn"
              className={styles.footerLogo}
            />
            <span className={styles.footerName}>TryOn</span>
          </div>

          <div className={styles.footerLinks}>
            <a href="#benefits" onClick={(e) => scrollToSection(e, "benefits")}>
              Benefits
            </a>
            <a href="#order-online" onClick={(e) => scrollToSection(e, "order-online")}>
              Order Online
            </a>
            <a href="#pos" onClick={(e) => scrollToSection(e, "pos")}>
              POS
            </a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, "pricing")}>
              Pricing
            </a>
            <Link to="/login">Login</Link>
          </div>

          <p className={styles.footerCopy}>
            © {new Date().getFullYear()} TryOn. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}