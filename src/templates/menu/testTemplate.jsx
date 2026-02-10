import PdfPageWrapper from "../../components/pdfPageWrapper";
import Template1 from "./BRGR01"

import useIsMobile from "../../utils/deviceCheck";

const fakeTemplateData = {
  id: 303,
  category: "burger",
  code: "BRGR01",
  name: "Burger",
  price: 1,
  uid: 5,
  type: "demo",
  subheading: "Menu",
  heading: "Burgers",
  drinks: [
    { name: "Soda", price: "$2" },
    { name: "Iced Tea", price: "$0.5" },
    { name: "Lemonade", price: "$0.5" },
    { name: "Blue Lemonade", price: "$2" },
    { name: "Mineral Water", price: "$1" },
  ],
  extras: [
    { name: "Ketchup", price: "$0.5" },
    { name: "Mayonnaise", price: "$0.5" },
    { name: "BBQ Sauce", price: "$0.5" },
    { name: "Chili Sauce", price: "$0.5" },
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
  ],
};




export default function TestTemplate() {
  const isMobile = useIsMobile();

  const content = <Template1 data={fakeTemplateData} />;

  return isMobile ? content : <PdfPageWrapper>{content}</PdfPageWrapper>;
}
