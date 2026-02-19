import PdfPageWrapper from "../components/pdfPageWrapper";
import Template from "./posters/POST01";
import PosterEditor from "./posters/posterEditor";
import EditButton from "../components/editButton";
import { useState } from "react";

import useIsMobile from "../utils/deviceCheck";

const data = {
  id: 5,
  uid: 5,
  isPublic: false,
  publicCode: {
    String: "",
    Valid: false
  },
  price: 1,
  code: "POST01",
  type: "demo",
  category: "poster",
  subheading: "THE FOOD RESTO",
  heading: "MENU",
  contents: [
    {
      title: "Sushi",
      description: "",
      data: [
        {
          name: "Ruby Toro Selection",
          description: "Premium marbled toro with a rich, buttery melt.",
          price: "190kr.",
          quantity: "8 stk."
        }
      ],
      model: "https://firebasestorage.googleapis.com/v0/b/tryon-308c9.firebasestorage.app/o/LOCAL%2Fminhlu142@gmail.com%2F3dModels%2FRuby_Toro_Selection.glb_b2b1243c-a0aa-4db4-9c59-fe269a277bf5.glb?alt=media&token=cf2a0f1d-52b2-495a-9678-2d39d1515f62",
      images: null,
      ingredients: null
    }
  ],
  information: {
    address: "555 YOUR CITY, AMAZING STATE 28888",
    phone: "123-555-2414",
    website: "WWW.YOURWEBSITE.COM",
    more:{
      hours: "OPEN 2 PM - 11 PM",
      badgeSmall: "SPECIAL MENU",
      badgeLarge: "ENJOY 20% OFF",
      bgColor: "#111111",
      accentColor: "#f5a623",
      textColor: "#ffffff",
      mutedColor: "#bbbbbb",
      badgeRotation: -5,
      plateSize: 280,
    }
  }
};

export default function TestTemplate() {
  const [editMode, setEditMode] = useState(false);
  const [templateData, setTemplateData] = useState(data);
  const isMobile = useIsMobile();

  if (editMode) return <PosterEditor data={templateData} onChange={(newData) => { setTemplateData(newData); setEditMode(false); }}><Template/></PosterEditor>;

  const content = <Template data={templateData} />;

  return isMobile ? content : <PdfPageWrapper><EditButton onClick={() => setEditMode(true)} />{content}</PdfPageWrapper>;
}
