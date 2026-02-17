import React from "react";
import styles from "./TVHE88.module.css";
import Model3D from "../../components/3dModel";


const menuCategory = {
  id: 303,
  category: "burger",
  code: "BRGR01",
  name: "Burger",
  price: 1,
  uid: 5,
  type: "demo",
  subheading: "Menu",
  heading: "Burgers",
  extras: [
    {
      title: "Drinks",
      description: "Refreshing beverages",
      data: [
        { name: "Soda", price: "$2" },
        { name: "Iced Tea", price: "$0.5" },
        { name: "Lemonade", price: "$0.5" },
        { name: "Blue Lemonade", price: "$2" },
        { name: "Mineral Water", price: "$1" }
      ]
    },
    {
      title: "Sauces",
      description: "Additional sauces",
      data: [
        { name: "Ketchup", price: "$0.5" },
        { name: "Mayonnaise", price: "$0.5" },
        { name: "BBQ Sauce", price: "$0.5" },
        { name: "Chili Sauce", price: "$0.5" }
      ]
    }
  ],
  contents: [
    {
      title: "Classic Cheeseburger",
      description:
        "Juicy beef patty grilled to perfection, topped with melted cheddar, fresh lettuce, tomato, and house sauce.",
      ingredients: [
        { name: "Beef Patty", included: true },
        { name: "Cheese", included: true },
        { name: "Lettuce", included: true },
        { name: "Tomato", included: true },
      ],
      data: [
        { name: "Single", price: "$18" },
        { name: "Double", price: "$22" },
        { name: "Triple", price: "$26" },
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FClassic_Cheeseburger.glb_e86c3afc-6ef9-494d-ad7a-e045844610a9.glb?alt=media&token=c7d357a2-97b9-4939-a774-def262cb24d8",
    },
    {
      title: "Bacon BBQ Burger",
      description:
        "Smoky bacon, crispy onions, and tangy BBQ sauce layered over a thick beef patty.",
      ingredients: [
        { name: "Beef Patty", included: true },
        { name: "Bacon", included: true },
        { name: "BBQ Sauce", included: true },
        { name: "Onion", included: true },
      ],
      data: [
        { name: "Single", price: "$20" },
        { name: "Double", price: "$24" },
        { name: "Triple", price: "$28" },
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FBacon_BBQ_Burger.glb_ad0699ba-6b80-4a4e-a36e-ce7067752669.glb?alt=media&token=3f472398-015e-448e-b644-27af2b37ba76",
    },
    {
      title: "Chicken Burger",
      description:
        "Crispy fried chicken breast with creamy mayo, lettuce, and pickles in a toasted bun.",
      ingredients: [
        { name: "Chicken", included: true },
        { name: "Lettuce", included: true },
        { name: "Pickles", included: true },
        { name: "Mayo", included: true },
      ],
      data: [
        { name: "Single", price: "$17" },
        { name: "Double", price: "$21" },
        { name: "Spicy", price: "$22" },
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FChicken_Burger.glb_9d5ed30f-d6bb-4d74-8b06-f1b88b8d90dd.glb?alt=media&token=574e07e7-9f14-4b03-8bf1-dc5b65cbb2e8",
    },
    {
      title: "Veggie Burger",
      description:
        "Plant-based patty with avocado, fresh veggies, and vegan sauce. Light, fresh, and satisfying.",
      ingredients: [
        { name: "Veggie Patty", included: true },
        { name: "Avocado", included: true },
        { name: "Lettuce", included: true },
        { name: "Tomato", included: true },
      ],
      data: [
        { name: "Single", price: "$16" },
        { name: "Double", price: "$20" },
        { name: "Gluten-Free Bun", price: "$22" },
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2Fveggie_burger.glb_46571bc5-53a6-4219-8760-c28a12ed7b4d.glb?alt=media&token=84fc60e1-be4c-4725-a0c2-60dc940dbfce",
    },
    {
      title: "Spicy Jalapeño Burger",
      description:
        "Bold and fiery with jalapeños, pepper jack cheese, and spicy chipotle sauce.",
      ingredients: [
        { name: "Beef Patty", included: true },
        { name: "Jalapeño", included: true },
        { name: "Pepper Jack", included: true },
        { name: "Chipotle Sauce", included: true },
      ],
      data: [
        { name: "Single", price: "$19" },
        { name: "Double", price: "$23" },
        { name: "Extra Spicy", price: "$25" },
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FSpicy_Jalape%C3%B1o_Burge.glb_e16538e1-5c73-4e74-b69c-4f819da1dbed.glb?alt=media&token=6c399d68-e1e8-4ccb-b741-1a875309c4d6",
    },
    {
      title: "Cheeseburger",
      description:
        "Juicy beef patty topped with melted cheese, crisp lettuce, fresh tomato, and classic burger sauce. A timeless favorite.",
      ingredients: [
        { name: "Beef Patty", included: true },
        { name: "Cheddar Cheese", included: true },
        { name: "Lettuce", included: true },
        { name: "Tomato", included: true },
      ],
      data: [
        { name: "Single", price: "$18" },
        { name: "Double", price: "$22" },
        { name: "Gluten-Free Bun", price: "$24" },
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FCheeseburger.glb_35eae291-d4e0-4c11-9ba6-8bd6cac793ad.glb?alt=media&token=1fda8dcf-3537-4209-abec-9cfad39d9426",
    },
    {
      title: "Chicken Nuggets",
      description:
        "Crispy golden chicken nuggets made with tender white meat. Perfectly seasoned and served hot with your choice of dipping sauce.",
      ingredients: [
        { name: "Chicken Breast", included: true },
        { name: "Crispy Breading", included: true },
        { name: "Salt & Pepper", included: true },
        { name: "Dipping Sauce", included: true },
      ],
      data: [
        { name: "6 Pieces", price: "$10" },
        { name: "9 Pieces", price: "$14" },
        { name: "12 Pieces", price: "$18" },
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FNuggets.glb_215c5ac2-03c5-49da-aebf-a4d1ae8fba47.glb?alt=media&token=c22dfbb1-41fe-4b23-b4a6-245542b2635b",
    },
    {
      title: "Pepper Chicken Wings",
      description:
        "A bold, tangy house sauce with a creamy base, a touch of sweetness, and a spicy kick. Perfect for dipping nuggets or fries.",
      ingredients: [
        { name: "Mayo Base", included: true },
        { name: "Tomato Paste", included: true },
        { name: "Garlic", included: true },
        { name: "Paprika", included: true },
        { name: "Chili Heat", included: true },
      ],
      data: [
        { name: "Single Dip", price: "$1.50" },
        { name: "Double Dip", price: "$2.50" },
        { name: "Large Cup", price: "$4.00" },
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FPepper_Chicken_Wings.glb_c3d00806-20f4-412b-9384-299a49cf71a9.glb?alt=media&token=7206f815-6e6e-4285-8f87-ff9e1051b895",
    },
    {
      title: "Pepper Chicken Wings",
      description:
        "A bold, tangy house sauce with a creamy base, a touch of sweetness, and a spicy kick. Perfect for dipping nuggets or fries.",
      ingredients: [
        { name: "Mayo Base", included: true },
        { name: "Tomato Paste", included: true },
        { name: "Garlic", included: true },
        { name: "Paprika", included: true },
        { name: "Chili Heat", included: true },
      ],
      data: [
        { name: "Single Dip", price: "$1.50" },
        { name: "Double Dip", price: "$2.50" },
        { name: "Large Cup", price: "$4.00" },
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FPepper_Chicken_Wings.glb_c3d00806-20f4-412b-9384-299a49cf71a9.glb?alt=media&token=7206f815-6e6e-4285-8f87-ff9e1051b895",
    },
    {
      title: "Pepper Chicken Wings",
      description:
        "A bold, tangy house sauce with a creamy base, a touch of sweetness, and a spicy kick. Perfect for dipping nuggets or fries.",
      ingredients: [
        { name: "Mayo Base", included: true },
        { name: "Tomato Paste", included: true },
        { name: "Garlic", included: true },
        { name: "Paprika", included: true },
        { name: "Chili Heat", included: true },
      ],
      data: [
        { name: "Single Dip", price: "$1.50" },
        { name: "Double Dip", price: "$2.50" },
        { name: "Large Cup", price: "$4.00" },
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FPepper_Chicken_Wings.glb_c3d00806-20f4-412b-9384-299a49cf71a9.glb?alt=media&token=7206f815-6e6e-4285-8f87-ff9e1051b895",
    },
    {
      title: "Pepper Chicken Wings",
      description:
        "A bold, tangy house sauce with a creamy base, a touch of sweetness, and a spicy kick. Perfect for dipping nuggets or fries.",
      ingredients: [
        { name: "Mayo Base", included: true },
        { name: "Tomato Paste", included: true },
        { name: "Garlic", included: true },
        { name: "Paprika", included: true },
        { name: "Chili Heat", included: true },
      ],
      data: [
        { name: "Single Dip", price: "$1.50" },
        { name: "Double Dip", price: "$2.50" },
        { name: "Large Cup", price: "$4.00" },
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FPepper_Chicken_Wings.glb_c3d00806-20f4-412b-9384-299a49cf71a9.glb?alt=media&token=7206f815-6e6e-4285-8f87-ff9e1051b895",
    },
    {
      title: "Pepper Chicken Wings",
      description:
        "A bold, tangy house sauce with a creamy base, a touch of sweetness, and a spicy kick. Perfect for dipping nuggets or fries.",
      ingredients: [
        { name: "Mayo Base", included: true },
        { name: "Tomato Paste", included: true },
        { name: "Garlic", included: true },
        { name: "Paprika", included: true },
        { name: "Chili Heat", included: true },
      ],
      data: [
        { name: "Single Dip", price: "$1.50" },
        { name: "Double Dip", price: "$2.50" },
        { name: "Large Cup", price: "$4.00" },
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FPepper_Chicken_Wings.glb_c3d00806-20f4-412b-9384-299a49cf71a9.glb?alt=media&token=7206f815-6e6e-4285-8f87-ff9e1051b895",
    },
  ],
};


const config = {
  camera_orbit: "auto 55deg",
}

export default function MenuBoard() {
  const items = menuCategory?.contents ?? [];

  return (
    <div className={styles.stage}>
      <div className={styles.board}>
        {/* LEFT PANEL */}
        <aside className={styles.left}>
          <div className={styles.logoBlock}>
            <div className={styles.logoMark} aria-hidden="true">
              <svg viewBox="0 0 64 64" className={styles.logoSvg}>
                <path
                  d="M22 26c-6 0-10-3.4-10-9 0-6.1 5.1-11 11.4-11 2.5 0 4.8.8 6.6 2.2C32 5.7 35.1 4 38.6 4 44.4 4 49 8.6 49 14.4c0 1-.1 2-.4 2.9 2.6 1.3 4.4 4 4.4 7.2 0 5.1-4.2 9.5-12.6 9.5H22z"
                  fill="white"
                  opacity=".95"
                />
                <path d="M18 32h28v6c0 7-6 12-14 12s-14-5-14-12v-6z" fill="white" opacity=".95" />
                <path d="M10 56l10-10" stroke="white" strokeWidth="4" strokeLinecap="round" />
                <path d="M54 56L44 46" stroke="white" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <div className={styles.logoText}>Your logo</div>
          </div>

          <div className={styles.leftTitle}>
            <div className={styles.restaurantWord}>RESTAURANT</div>
            <div className={styles.menuWord}>{menuCategory?.subheading ?? "Menu"}</div>
          </div>

          <div className={styles.leftHeading}>{menuCategory?.heading ?? "Burgers"}</div>

          <div className={styles.heroFood} aria-hidden="true">
            <div
              className={styles.heroImg}
            >
                <Model3D model={items?.[0]?.model} config={config}/>
            </div>
            
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <main className={styles.right}>
          <div className={styles.grid}>
            {items.slice(0, 12).map((c) => {
              // choose "Single" price if exists, else first option
              const single = c.data?.find((x) => x.name?.toLowerCase() === "single");
              const displayPrice = single?.price ?? c.data?.[0]?.price ?? "";

              return (
                <article className={styles.card} key={c.title}>
                  <div className={styles.photoWrap}>
                    {/* no images in your structure -> fallback circle */}
                    <div className={styles.photoFallback}>
                        <Model3D model={c.model} config={config}/>
                    </div>
                    <div className={styles.price}>{displayPrice}</div>
                  </div>

                  <h3 className={styles.itemTitle}>{c.title}</h3>
                  <p className={styles.itemDesc}>{c.description}</p>
                </article>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
