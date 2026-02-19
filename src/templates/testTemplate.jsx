import PdfPageWrapper from "../components/pdfPageWrapper";
import Template from "./posters/POST01";
import PosterEditor from "./posters/posterEditor";
import EditButton from "../components/editButton";
import { useState } from "react";

import useIsMobile from "../utils/deviceCheck";

const defaultData = {
  kicker: "THE FOOD RESTO",
  title: "MENU",
  imageUrl: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?q=80&w=800&auto=format&fit=crop",
  badgeSmall: "SPECIAL MENU",
  badgeLarge: "ENJOY 20% OFF",
  hours: "OPEN 2 PM - 11 PM",
  address: "555 YOUR CITY, AMAZING STATE 28888",
  phone: "123-555-2414",
  website: "WWW.YOURWEBSITE.COM",
  bgColor: "#111111",
  accentColor: "#f5a623",
  textColor: "#ffffff",
  mutedColor: "#bbbbbb",
  badgeRotation: -5,
  plateSize: 280,
};

export default function TestTemplate() {
  const [editMode, setEditMode] = useState(false);
  const isMobile = useIsMobile();

  if (editMode) return <PosterEditor data={defaultData} onChange={() => setEditMode(false)}><Template/></PosterEditor>;

  const content = <Template data={defaultData} />;

  return isMobile ? content : <PdfPageWrapper><EditButton onClick={() => setEditMode(true)} />{content}</PdfPageWrapper>;
}
