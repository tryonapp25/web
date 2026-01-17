import React, { useEffect, useState } from "react";
import styles from "../styles/PizzaMenu.module.css";

const pizzas = [
  {
    id: "slot1",
    img: "/pizza1.png",
    model: "http://127.0.0.1:1267/model"
  },
  {
    id: "slot2",
    img: "/pizza1.png",
    model: "http://127.0.0.1:1267/model"
  },
  {
    id: "slot3",
    img: "/pizza1.png",
    model: "http://127.0.0.1:1267/model"
  },
];


export default function Model3D(data = []) {
  const [openSlotId, setOpenSlotId] = useState(null);
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    if (customElements.get("model-viewer")) return;

    const s = document.createElement("script");
    s.type = "module";
    s.src = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
    s.onload = () => console.log("model-viewer loaded");
    document.head.appendChild(s);
    }, []);


  const openModel = (slotId) => {
    setOpenSlotId(slotId);
    setReloadTick((t) => t + 1); // force new URL each open
    };
  const closeModel = () => setOpenSlotId(null);

  return (
    <div className={styles.stage}>
      <div className={styles.topbar}>
        <div className={styles.brand}>Borcelle Restaurant</div>
      </div>

      <div className={styles.title}>Pizza Menu</div>

      {/* Text blocks */}
      <div className={`${styles.section} ${styles.regular}`}>
        <h3>REGULAR PIZZA</h3>
        <div className={styles.lines}>
          <div className={styles.row}>
            <div className={styles.dots}>
              <span className={styles.name}>Veg Pizza 01</span>
            </div>
            <div className={styles.price}>$20</div>
          </div>
          <div className={styles.row}>
            <div className={styles.dots}>
              <span className={styles.name}>Mushroom Pizza 02</span>
            </div>
            <div className={styles.price}>$22</div>
          </div>
          <div className={styles.row}>
            <div className={styles.dots}>
              <span className={styles.name}>Chicken Pizza 03</span>
            </div>
            <div className={styles.price}>$24</div>
          </div>
        </div>
      </div>

      <div className={`${styles.section} ${styles.medium}`}>
        <h3>MEDIUM PIZZA</h3>
        <div className={styles.lines}>
          <div className={styles.row}>
            <div className={styles.dots}>
              <span className={styles.name}>Cheese Pizza 01</span>
            </div>
            <div className={styles.price}>$30</div>
          </div>
          <div className={styles.row}>
            <div className={styles.dots}>
              <span className={styles.name}>Chicken Salami 02</span>
            </div>
            <div className={styles.price}>$32</div>
          </div>
          <div className={styles.row}>
            <div className={styles.dots}>
              <span className={styles.name}>Veg Mushroom 03</span>
            </div>
            <div className={styles.price}>$34</div>
          </div>
        </div>
      </div>

      <div className={`${styles.section} ${styles.premium}`}>
        <h3>PREMIUM PIZZA</h3>
        <div className={styles.lines}>
          <div className={styles.row}>
            <div className={styles.dots}>
              <span className={styles.name}>Supreme Pizza 01</span>
            </div>
            <div className={styles.price}>$40</div>
          </div>
          <div className={styles.row}>
            <div className={styles.dots}>
              <span className={styles.name}>Margharita 02</span>
            </div>
            <div className={styles.price}>$42</div>
          </div>
          <div className={styles.row}>
            <div className={styles.dots}>
              <span className={styles.name}>Double Cheese 03</span>
            </div>
            <div className={styles.price}>$44</div>
          </div>
        </div>
      </div>

      {/* Pizza slots */}
      {pizzas.map((p) => {
        const isOpen = openSlotId === p.id;
        return (
          <div
            key={p.id}
            className={`${styles.pizzaSlot} ${styles[p.id]}`}
            title="Click to view 3D"
            onClick={() => {
              // prevent re-opening if already open
              if (!isOpen) openModel(p.id);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                if (!isOpen) openModel(p.id);
              }
            }}
          >
            {!isOpen ? (
              <img src={p.img} alt={`Pizza ${p.id}`} />
            ) : (
              <>
                {/* model-viewer is a web component */}
                <model-viewer
                    src={`${p.model}?cb=${Date.now()}-${reloadTick}`}
                    alt="3D pizza model"
                    camera-controls
                    camera-orbit="auto 10deg" // x y z (in meters, model space)
                    touch-action="pan-y"
                    autoplay
                    animation-loop
                    environment-image="neutral"
                    shadow-intensity="1"
                    exposure="1"
                    className={styles.popModel}
                />


                <button
                  className={styles.closeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeModel();
                  }}
                  type="button"
                >
                  Close ✕
                </button>
              </>
            )}
          </div>
        );
      })}

      <div className={styles.hint}>
        Click a pizza image to open the 3D model in the same spot
      </div>
    </div>
  );
}
