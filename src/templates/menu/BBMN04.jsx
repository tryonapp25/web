// BBMN04.jsx
import styles from "./BBMN04.module.css";
import Model3D from "../../components/3dModel";

const data = {
    id: 202,
  category: "bubble",
  code: "BBMN04", // template name
  name: "Bubble",
  price:1,
  uid:5,
  type:"demo",
  heading: "MENU",
  subheading: "Fresh Drinks & Milk Tea",

  contents: [
    {
      title: "Taro Bubble Milk Tea",
      description:
        "Creamy taro blended with fresh milk and chewy tapioca pearls. A customer favorite with a rich and smooth flavor.",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" },
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FTaro_Bubble.glb_e2b4db50-7bc2-453d-81aa-0fdac3286dc5.glb?alt=media&token=77b87f52-2c13-42c3-a76f-02b315e76ac6"
    },

    {
      title: "Matcha Milk Tea",
      description:
        "Premium Japanese matcha mixed with milk for a smooth, earthy, and slightly sweet taste.",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" },
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FMatcha_Bubble.glb_5a807eb5-45f5-40ae-9a8a-710a60ebcdfd.glb?alt=media&token=0b2adf51-20ae-41ad-8bb7-fed68fe88970"
    },

    {
      title: "Chocolate Milk Tea",
      description:
        "Rich chocolate flavor combined with creamy milk tea and soft tapioca pearls.",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" },
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FBrown_Sugar.glb_b876d796-40da-4af1-a676-882cf3ea2ca2.glb?alt=media&token=69f0cab6-a5f2-4971-95bc-ea7cdfd308d3"
    },

    {
      title: "Strawberry Fruit Tea",
      description:
        "Refreshing strawberry tea made with real fruit for a light and sweet summer drink.",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" },
      ],
      model:"https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FStrawberry_Bubble.glb_02d7d794-c5db-4c9b-b233-751beeef21d2.glb?alt=media&token=0c2e78d8-20a1-42f6-bcf0-7ff572d24a21"
    },

    {
      title: "Fruit Milk Tea",
      description:
        "Creamy milk tea layered with vibrant fruit flavors and topped with chewy boba pearls.",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" },
      ],
      model:
        "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2FFruit_Milk.glb_c1e2fde9-7702-4338-be22-01fa7b47bb85.glb?alt=media&token=6b401ceb-d604-4a44-97d1-7a30d5a99577"
    },
  ],

  information: {
    brand: "YourBrand",
    website: "www.example.com",

    more: {
      headlineScript: "Special",
      headerSmall: "Freshly made drinks every day",
      rating: 4,
      discount: 30,

      footerLeftNote: "More information",

      promoTitle: "Hot Promotion",

      promoNote:
        "Get 30% OFF all drinks today. Limited time only — don’t miss out!",
    },
  },
};



const config = {
  camera_orbit: "auto 90deg",
}

function Stars({ value = 4 }) {
  return (
    <div className={styles.stars} aria-label={`Rating ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={styles.star}>
          {i < value ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}


function QrPlaceholder() {
  return (
    <div className={styles.qrBox} aria-label="QR code placeholder">
      <div className={styles.qrGrid}>
        {Array.from({ length: 64 }).map((_, i) => (
          <span key={i} className={styles.qrDot} />
        ))}
      </div>
      <div className={styles.qrLabel}>QR</div>
    </div>
  );
}

export default function BBMN04({onClickModel}) {
  return (
    <div className={styles.page}>
      <div className={styles.poster} role="img" aria-label="Menu Special poster template">
        {/* HEADER */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headlineTop}>{data.heading}</div>
            <div className={styles.headlineScript}>{data?.information?.more?.headlineScript}</div>
            <div className={styles.headerSubtitle}>{data.subheading}</div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.discountRow}>
              <div className={styles.discount}>{data?.information?.more?.discount}%</div>
              <div className={styles.off}>OFF</div>
            </div>

            <div className={styles.headerSmall}>
              {data?.information?.more?.headerSmall}
            </div>

            <Stars value={data?.information?.more?.rating} />
          </div>
        </header>

        {/* BODY */}
        <main className={styles.body}>
          {/* LEFT LIST */}
          <section className={styles.menuList}>
            {data.contents.map((item, idx) => {
                const priceText = item?.data?.at(-1)?.price ?? "$0";
                return (
                <div key={idx} className={styles.menuItem}>
                    <div className={styles.menuItemRow}>
                    <div className={styles.menuTitle}>{item.title}</div>
                    <div className={styles.dots} />
                    <div className={styles.menuPrice}>{priceText}</div>
                    </div>

                    <div className={styles.menuDesc}>{item.description}</div>

                    {/* ✅ sizes row */}
                    <div className={styles.sizeRow}>
                    {item?.data?.map((size, index) => (
                        <div key={index} className={styles.sizeItem}>
                        <span className={styles.sizeName}>{size.name}</span>
                        <span className={styles.sizePrice}>{size.price}</span>
                        </div>
                    ))}
                    </div>
                </div>
                );
            })}
           </section>


          {/* RIGHT GRID */}
          <section className={styles.drinksGrid}>
            {data.contents.map((item, idx) => (
              <div key={idx} className={styles.drinkCard} title={item.model}>
                <div style={{ width: "100px", height: "100px" }} className={styles.model3d}>
                  <Model3D model={item?.model} config={config} onClick={() => onClickModel?.(section)}/>
                </div>
                <div className={styles.drinkName}>{item.title}</div>
              </div>
            ))}
          </section>
        </main>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <div className={styles.footerNote}>{data.footerLeftNote}</div>
            <div className={styles.footerLeftRow}>
              <QrPlaceholder />
              <div className={styles.socialBlock}>
                <Stars value={data?.information?.more?.rating} />
                <div className={styles.handle}>@{data?.information?.brand}</div>
                <div className={styles.website}>{data?.information?.website}</div>
              </div>
            </div>
          </div>

          <div className={styles.footerRight}>
            <div className={styles.dontMiss}>Don’t Miss!</div>
            <div className={styles.promoTitle}>{data?.information?.more?.promoTitle}</div>
            <div className={styles.promoNote}>{data?.information?.more?.promoNote}</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
