import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import styles from "../styles/Onboarding.module.css";
import Model3D from "../components/3dModel";

const config = {
  camera_orbit: "auto 70deg",
};

const modelUrls = [
  "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FClassic_Cheeseburger.glb_e86c3afc-6ef9-494d-ad7a-e045844610a9.glb?alt=media&token=c7d357a2-97b9-4939-a774-def262cb24d8",
  "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FThai_Bubble.glb_93127e08-098f-48a3-91d1-62bfceddd7f0.glb?alt=media&token=abf5c34b-d17d-4b22-b947-9614c2a664d3",
  "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FNeapolitan_Pizza.glb_da513427-77b4-4b5a-8bf6-c5df72b479ad.glb?alt=media&token=52945a22-e746-4f9f-ad81-f3cd5345f205",
];

const images = [
  {
    title: "No More Standing to Order",
    icon: `${import.meta.env.BASE_URL}images/noMoreStandOrder.png`,
    desc: "Skip the counter and order directly from your phone with ease."
  },
  {
    title: "No More Waiting in Line",
    icon: `${import.meta.env.BASE_URL}images/noMoreWaiting.png`,
    desc: "Avoid long queues and place your order instantly from anywhere."
  },
  {
    title: "Scan to Order",
    icon: `${import.meta.env.BASE_URL}images/scanToOrder.png`,
    desc: "Scan a QR code to view the menu and start ordering in seconds."
  },
  {
    title: "Order From Your Table",
    icon: `${import.meta.env.BASE_URL}images/orderFromTable.png`,
    desc: "Sit back and order comfortably without leaving your seat."
  },
  {
    title: "Easy Ordering",
    icon: `${import.meta.env.BASE_URL}images/easyToOrder.png`,
    desc: "Simple steps, clear menus, and a smooth checkout experience."
  },
  {
    title: "Easy to Use",
    icon: `${import.meta.env.BASE_URL}images/easyToUse.png`,
    desc: "Designed for everyone—fast, intuitive, and hassle-free."
  }
];

export default function Onboarding() {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentModelIndex((prev) => (prev + 1) % modelUrls.length);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  const imageInterval = setInterval(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, 3500);

    return () => clearInterval(imageInterval);
  }, []);

  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero} id="top">
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span>✨</span> Modern menus for modern cafés
          </div>
          <h1 className={styles.heroTitle}>
            A modern digital menu for
            <br />
            <span className={styles.heroHighlight}>cafés & restaurants</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Replace old paper menus and boring screen menus with interactive 3D
            digital menus that look better, take up less space, and are easy to
            update.
          </p>
          <div className={styles.heroCta}>
            <Link to="/login" className={styles.btnPrimary}>
              Start Free Trial
              <span>→</span>
            </Link>
            <a className={styles.btnSecondary} href="#how" onClick={(e) => scrollToSection(e, "how")}>How it works</a>
          </div>

          {/* Image Showcase Section */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Benefits</span>
              <h2 className={styles.sectionTitle}>Better Customer Experience</h2>
            </div>
            <div className={styles.imageShowcase}>
              <div className={styles.imageShowcaseContent}>
                <img 
                  src={images[currentImageIndex].icon} 
                  alt={images[currentImageIndex].title}
                  className={styles.showcaseImage}
                />
                <h3 className={styles.showcaseTitle}>{images[currentImageIndex].title}</h3>
                <p className={styles.showcaseDesc}>{images[currentImageIndex].desc}</p>
                <div className={styles.showcaseDots}>
                  {images.map((_, index) => (
                    <span 
                      key={index}
                      className={`${styles.showcaseDot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <div className={styles.heroVisual}>
        <div className={styles.mockupContainer}>
          <div className={styles.mockupImage}>
                <Model3D config={config} model={modelUrls[currentModelIndex]}/>
            </div>
          <div className={styles.mockupOverlay} />
        </div>
      </div>

      {/* Features Section */}
      <section className={styles.section} id="features">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Why Use It</span>
          <h2 className={styles.sectionTitle}>
            Why Use a 3D Digital Menu?
          </h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to display your menu beautifully and manage it
            effortlessly.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✨</div>
            <h3 className={styles.featureTitle}>More attractive menus</h3>
            <p className={styles.featureDesc}>
              3D models make food and drinks look more appealing, helping
              customers notice the menu and decide faster.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💰</div>
            <h3 className={styles.featureTitle}>Save money</h3>
            <p className={styles.featureDesc}>
              No more printing costs. Update prices, items, or promotions
              anytime without reprinting menus.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📐</div>
            <h3 className={styles.featureTitle}>Save space</h3>
            <p className={styles.featureDesc}>
              One screen replaces posters, boards, and paper menus—perfect for
              small cafés.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3 className={styles.featureTitle}>Fast setup</h3>
            <p className={styles.featureDesc}>
              Choose a template, add your menu items, and go live quickly. No
              complex installation.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>✏️</div>
            <h3 className={styles.featureTitle}>Easy to edit</h3>
            <p className={styles.featureDesc}>
              Edit your menu anytime—prices, items, photos, and
              descriptions—in just a few clicks.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎨</div>
            <h3 className={styles.featureTitle}>Match your brand</h3>
            <p className={styles.featureDesc}>
              Clean, modern templates that match your brand identity and give
              your café a premium look.
            </p>
          </div>
        </div>
      </section>

      {/* Designed For Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Perfect Fit</span>
          <h2 className={styles.sectionTitle}>
            Designed for Cafés & Small Restaurants
          </h2>
        </div>

        <div className={styles.useCasesGrid}>
          <div className={styles.useCase}>
            <div className={styles.useCaseIcon}>📺</div>
            <h3 className={styles.useCaseTitle}>TV Screens</h3>
            <p className={styles.useCaseDesc}>
              Works beautifully on TV screens in your café
            </p>
          </div>

          <div className={styles.useCase}>
            <div className={styles.useCaseIcon}>📱</div>
            <h3 className={styles.useCaseTitle}>QR Code</h3>
            <p className={styles.useCaseDesc}>
              Customers scan a QR code to view on their phone
            </p>
          </div>

          <div className={styles.useCase}>
            <div className={styles.useCaseIcon}>🎯</div>
            <h3 className={styles.useCaseTitle}>Clean Templates</h3>
            <p className={styles.useCaseDesc}>
              Modern templates that match your brand
            </p>
          </div>

          <div className={styles.useCase}>
            <div className={styles.useCaseIcon}>🔄</div>
            <h3 className={styles.useCaseTitle}>No Workflow Change</h3>
            <p className={styles.useCaseDesc}>
              No change to your ordering process
            </p>
          </div>
        </div>

        <div className={styles.callout}>
          <div className={styles.calloutIcon}>💡</div>
          <p className={styles.calloutText}>
            <span className={styles.calloutHighlight}>
              This is not an ordering system.
            </span>
            <br />
            It's a better way to show your menu.
          </p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>The Difference</span>
          <h2 className={styles.sectionTitle}>Why It Works</h2>
          <p className={styles.sectionSubtitle}>
            Most digital menus today are just text on a screen. Our 3D menus
            turn your menu into a visual experience.
          </p>
        </div>

        <div className={styles.comparisonWrap}>
          <div className={styles.comparisonGrid}>
            <div className={`${styles.comparisonCol} ${styles.old}`}>
              <h3 className={styles.comparisonTitle}>
                <span>📋</span> Traditional Menus
              </h3>
              <ul className={styles.comparisonList}>
                <li>
                  <span>✕</span> Expensive printing costs
                </li>
                <li>
                  <span>✕</span> Hard to update prices
                </li>
                <li>
                  <span>✕</span> Takes up counter space
                </li>
                <li>
                  <span>✕</span> Plain text looks boring
                </li>
                <li>
                  <span>✕</span> Can't show rotating content
                </li>
              </ul>
            </div>

            <div className={`${styles.comparisonCol} ${styles.new}`}>
              <h3 className={styles.comparisonTitle}>
                <span>✨</span> 3D Digital Menu
              </h3>
              <ul className={styles.comparisonList}>
                <li>
                  <span>✓</span> Zero printing costs
                </li>
                <li>
                  <span>✓</span> Update instantly anytime
                </li>
                <li>
                  <span>✓</span> One screen for everything
                </li>
                <li>
                  <span>✓</span> Eye-catching 3D visuals
                </li>
                <li>
                  <span>✓</span> Showcase promotions easily
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.section} id="how">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Simple Process</span>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            Get your 3D digital menu up and running in minutes.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Choose a Template</h3>
            <p className={styles.stepDesc}>
              Browse our collection of modern, customizable templates designed
              for cafés and restaurants.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Add Your Menu</h3>
            <p className={styles.stepDesc}>
              Upload your menu items, prices, photos, and descriptions. Our
              editor makes it easy.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Go Live</h3>
            <p className={styles.stepDesc}>
              Display on your TV screen and share the QR code. Your customers
              will love it.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.section} id="pricing">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel}>Pricing</span>
          <h2 className={styles.sectionTitle}>Try It Risk-Free</h2>
          <p className={styles.sectionSubtitle}>
            Free trial available. No contract. We help you set it up.
          </p>
        </div>

        <div className={styles.pricingGrid}>
          <div className={styles.pricingCard}>
            <h3 className={styles.pricingName}>Free Trial</h3>
            <div className={styles.pricingPrice}>
              $0 <span>/ 14 days</span>
            </div>
            <ul className={styles.pricingFeatures}>
              <li>Full access to all features</li>
              <li>1 menu template</li>
              <li>QR code included</li>
              <li>Email support</li>
            </ul>
            <Link to="/login" className={styles.btnSecondary}>
              Start Free Trial
            </Link>
          </div>

          <div className={`${styles.pricingCard} ${styles.featured}`}>
            <div className={styles.pricingBadge}>Most Popular</div>
            <h3 className={styles.pricingName}>Pro</h3>
            <div className={styles.pricingPrice}>
              $29 <span>/ month</span>
            </div>
            <ul className={styles.pricingFeatures}>
              <li>Unlimited menu items</li>
              <li>All premium templates</li>
              <li>3D model showcase</li>
              <li>Priority support</li>
              <li>Custom branding</li>
            </ul>
            <Link to="/login" className={styles.btnPrimary}>
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Tagline */}
      <div className={styles.tagline}>
        <p className={styles.taglineText}>
          Make your menu stand out in 3D.
        </p>
      </div>

      {/* Final CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Make your menu work harder for your business.
          </h2>
          <p className={styles.ctaSubtitle}>
            Join cafés and restaurants that are already using 3D digital menus.
          </p>

          <div className={styles.ctaFeatures}>
            <div className={styles.ctaFeature}>
              <span>✓</span> Free trial available
            </div>
            <div className={styles.ctaFeature}>
              <span>✓</span> No contract
            </div>
            <div className={styles.ctaFeature}>
              <span>✓</span> We help you set it up
            </div>
          </div>

          <Link to="/login" className={styles.btnPrimary}>
            Get Started Today
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
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
            <a href="#features" onClick={(e) => scrollToSection(e, "features")}>Features</a>
            <a href="#how" onClick={(e) => scrollToSection(e, "how")}>How it works</a>
            <a href="#pricing" onClick={(e) => scrollToSection(e, "pricing")}>Pricing</a>
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
