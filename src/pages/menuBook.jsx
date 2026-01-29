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
