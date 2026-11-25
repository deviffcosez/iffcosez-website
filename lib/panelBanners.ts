import {
  Anchor,
  Banknote,
  Building2,
  Cog,
  Factory,
  FileCheck,
  Globe,
  Handshake,
  HeartHandshake,
  Layers,
  Leaf,
  Network,
  Percent,
  Recycle,
  Route,
  Scale,
  ShieldCheck,
  Snowflake,
  Sprout,
  Sun,
  TrendingUp,
  Truck,
  Users,
  Warehouse,
  Wheat,
  Wifi,
  Wrench,
  Zap,
  Droplets,
  Boxes,
  LayoutGrid,
  Utensils,
  type LucideIcon,
} from "lucide-react";

export interface PanelPoint {
  label: string;
  icon: LucideIcon;
}

export interface PanelBanner {
  // Stable key, used to pick a subset of panels for a page.
  id: string;
  headline: string;
  subline?: string;
  points: PanelPoint[];
  footer: string;
  // Contact slide: a button instead of repeating the footer as plain text.
  cta?: { label: string; href: string };
}

// Exhibition-panel content (10 panels) shown as the home-page banner. The
// company name/logo lives once on the section, not on every slide.
export const PANEL_BANNERS: PanelBanner[] = [
  {
    id: "gateway",
    headline: "Your Gateway to Industrial Growth in Southern India",
    points: [
      { label: "Infrastructure", icon: Building2 },
      { label: "Industries", icon: Factory },
      { label: "Prosperity", icon: TrendingUp },
    ],
    footer: "Together for a Stronger Tomorrow",
  },
  {
    id: "location",
    headline: "Strategic Location: Nellore, Andhra Pradesh",
    subline: "8 km on NH-16 · 50 km from two ports",
    points: [
      { label: "Proximity to Ports & Logistics", icon: Anchor },
      { label: "Excellent Connectivity", icon: Route },
      { label: "Access to Domestic & Global Markets", icon: Globe },
    ],
    footer: "Strategically Placed for Global Opportunities",
  },
  {
    id: "infrastructure",
    headline: "World-Class Industrial Infrastructure",
    points: [
      { label: "Wide Roads & Internal Connectivity", icon: Route },
      { label: "Reliable Power Supply", icon: Zap },
      { label: "Water Management System", icon: Droplets },
      { label: "24x7 Security & Safety", icon: ShieldCheck },
      { label: "High-Speed IT & Telecom Connectivity", icon: Wifi },
      { label: "Efficient Common Facilities", icon: Cog },
    ],
    footer: "Modern Infrastructure for a Stronger Tomorrow",
  },
  {
    id: "agro-food",
    headline: "Agro & Food Processing Hub",
    subline: "From Farm to Global Markets",
    points: [
      { label: "Food Processing", icon: Utensils },
      { label: "Value Addition", icon: Layers },
      { label: "Cold Storage", icon: Snowflake },
      { label: "Agri Logistics & Warehousing", icon: Truck },
    ],
    footer: "Farmer's Produce, Global Opportunities",
  },
  {
    id: "investment",
    headline: "Investment Opportunities at IKSEZ",
    points: [
      { label: "Attractive Incentives", icon: Percent },
      { label: "Supportive Policy Environment", icon: Scale },
      { label: "Ease of Doing Business", icon: FileCheck },
      { label: "High Growth Potential", icon: TrendingUp },
    ],
    footer: "Grow Your Business with Us",
  },
  {
    id: "industries",
    headline: "MSME & Large-Scale Industries",
    subline: "Together for a Stronger Economy",
    points: [
      { label: "Manufacturing", icon: Factory },
      { label: "Engineering & Machinery", icon: Wrench },
      { label: "Food Processing", icon: Wheat },
      { label: "Logistics & Warehousing", icon: Warehouse },
      { label: "Other Value-Added Industries", icon: Boxes },
    ],
    footer: "Your Industry, Our Support",
  },
  {
    id: "plug-and-play",
    headline: "Plug-and-Play Industrial Development",
    subline: "Ready Infrastructure | Faster Setup | Lower Time to Market",
    points: [
      { label: "Pre-Developed Plots", icon: LayoutGrid },
      { label: "Built-up Roads", icon: Route },
      { label: "Utilities Ready", icon: Zap },
      { label: "Hassle-Free Approvals", icon: FileCheck },
    ],
    footer: "Seamless Setup for Your Success",
  },
  {
    id: "farmer-led",
    headline: "Farmer-Led Industrial Growth",
    subline: "Empowering Farmers | Building a Stronger Tomorrow",
    points: [
      { label: "Co-operative Strength", icon: Handshake },
      { label: "Rural Prosperity", icon: Sprout },
      { label: "Inclusive Growth", icon: Users },
      { label: "Sustainable Future", icon: Leaf },
    ],
    footer: "From Farmers, for a Better Tomorrow",
  },
  {
    id: "sustainable",
    headline: "Sustainable & Future-Ready Industrial Park",
    subline: "Greener Today | Healthier Tomorrow",
    points: [
      { label: "Clean Environment", icon: Leaf },
      { label: "Renewable Energy", icon: Sun },
      { label: "Waste Management", icon: Recycle },
      { label: "Sustainable Operations", icon: Network },
    ],
    footer: "Sustainable Growth for Generations",
  },
  {
    id: "invest-grow",
    headline: "Invest. Grow. Prosper with IKSEZ",
    points: [
      { label: "Partnership", icon: HeartHandshake },
      { label: "Growth", icon: TrendingUp },
      { label: "Sustainability", icon: Leaf },
      { label: "Prosperity", icon: Banknote },
    ],
    footer: "ceooffice@iffcosez.in · +91-9652993599",
    cta: { label: "Contact us", href: "/contact-us/" },
  },
];
