import { useMemo } from "react";

import BookWraper from "../components/bookWraper";
import PdfPageWrapper from "../components/pdfPageWrapper";
import useIsMobile from "../utils/deviceCheck";
import Template from "../templates/AXQP83"

export default function MenuBook() {
  const isMobile = useIsMobile();
  const templateData = [{
  id: 1,
  category: "pizza",
  name: "template2",
  subheading:"Menu",
  heading:"PIZZA",

  // 👉 MENU SECTIONS
  contents: [
    {
      title: "Cheese Pizza",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" }
      ],
      model: "http://127.0.0.1:1267/model/name/pizza2"
    },
    {
      title: "Hawaiian Pizza",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" }
      ],
      model: "http://127.0.0.1:1267/model/name/pizza2"
    },
    {
      title: "BBQ chicken",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" }
      ],
      model: "http://127.0.0.1:1267/model/name/pizza2"
    },
    {
      title: "Neopolitan Pizza",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" }
      ],
      model: "http://127.0.0.1:1267/model/name/pizza2"
    },
    {
      title: "Pepperoni Pizza",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" }
      ],
      model: "http://127.0.0.1:1267/model/name/pizza2"
    },
    {
      title: "Vege Pizza",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" }
      ],
      model: "http://127.0.0.1:1267/model/name/pizza2"
    }
  ],
},
{
  id: 1,
  category: "pizza",
  name: "template2",
  subheading:"Menu",
  heading:"PIZZA",

  // 👉 MENU SECTIONS
  contents: [
    {
      title: "Cheese Pizza",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" }
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fpizza2.glb_faac6194-17d7-49f7-8f9c-fd8e1a8807d3.glb?alt=media&token=5ea82992-92cb-435f-8dc3-0cafdfe7471a"
    },
    {
      title: "Hawaiian Pizza",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" }
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fpizza2.glb_faac6194-17d7-49f7-8f9c-fd8e1a8807d3.glb?alt=media&token=5ea82992-92cb-435f-8dc3-0cafdfe7471a"
    },
    {
      title: "BBQ chicken",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" }
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fpizza2.glb_faac6194-17d7-49f7-8f9c-fd8e1a8807d3.glb?alt=media&token=5ea82992-92cb-435f-8dc3-0cafdfe7471a"
    },
    {
      title: "Neopolitan Pizza",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" }
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fpizza2.glb_faac6194-17d7-49f7-8f9c-fd8e1a8807d3.glb?alt=media&token=5ea82992-92cb-435f-8dc3-0cafdfe7471a"
    },
    {
      title: "Pepperoni Pizza",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" }
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fpizza2.glb_faac6194-17d7-49f7-8f9c-fd8e1a8807d3.glb?alt=media&token=5ea82992-92cb-435f-8dc3-0cafdfe7471a"
    },
    {
      title: "Vege Pizza",
      data: [
        { name: "Small", price: "$20" },
        { name: "Medium", price: "$22" },
        { name: "Large", price: "$24" }
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142%40gmail.com%2F3dModels%2Fpizza2.glb_faac6194-17d7-49f7-8f9c-fd8e1a8807d3.glb?alt=media&token=5ea82992-92cb-435f-8dc3-0cafdfe7471a"
    }
  ],
}
];


  return (
    isMobile ? (
      <BookWraper data={templateData}>
        <Template/>
      </BookWraper>
    ) : (
      <PdfPageWrapper>
        <BookWraper data={templateData}>
          <Template/>
        </BookWraper>
      </PdfPageWrapper>
    )
  );
}
