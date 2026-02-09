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
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FClassic_Cheeseburger.glb_e86c3afc-6ef9-494d-ad7a-e045844610a9.glb?alt=media&token=c7d357a2-97b9-4939-a774-def262cb24d8",
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
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FClassic_Cheeseburger.glb_e86c3afc-6ef9-494d-ad7a-e045844610a9.glb?alt=media&token=c7d357a2-97b9-4939-a774-def262cb24d8",
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
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FClassic_Cheeseburger.glb_e86c3afc-6ef9-494d-ad7a-e045844610a9.glb?alt=media&token=c7d357a2-97b9-4939-a774-def262cb24d8",
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
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FClassic_Cheeseburger.glb_e86c3afc-6ef9-494d-ad7a-e045844610a9.glb?alt=media&token=c7d357a2-97b9-4939-a774-def262cb24d8",
    },
  ],
};




export default function TestTemplate() {
  const isMobile = useIsMobile();

  const content = <Template1 data={fakeTemplateData} />;

  return isMobile ? content : <PdfPageWrapper>{content}</PdfPageWrapper>;
}
