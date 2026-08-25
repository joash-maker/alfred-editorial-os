// lib/alfredConfig.ts
//
// Alfred V3 central configuration.
//
// This file provides the default markets, sectors, organisation types,
// relationships, use cases, solution families, products and campaigns.
//
// Later, Alfred's Settings / Admin area will allow these options to be
// edited and stored in Supabase. These values act as the safe defaults.

export type MarketStatus =
  | "Core Market"
  | "Active Market Entry"
  | "Exploring"
  | "Existing Relationship"
  | "Opportunistic"
  | "Future"
  | "Parked";

export type PortfolioStatus =
  | "Core Product"
  | "Vertical Solution"
  | "Demo"
  | "Market-entry Demo"
  | "Pilot"
  | "Platform"
  | "Venture"
  | "MVP"
  | "Experiment"
  | "Internal Tool"
  | "Parked";

export type CampaignStatus =
  | "Active"
  | "Secondary"
  | "Developing"
  | "Paused"
  | "Parked"
  | "Completed";

export type CampaignType =
  | "Revenue"
  | "Market Entry"
  | "Partnership"
  | "Validation"
  | "Pilot"
  | "Research"
  | "Nurture";

export interface SectorDefinition {
  name: string;
  subcategories: string[];
}

export interface MarketDefinition {
  id: string;
  name: string;
  status: MarketStatus;
  regions: string[];
  sectors: SectorDefinition[];
}

export interface ProductDefinition {
  id: string;
  name: string;
  family: string;
  type: PortfolioStatus;
  markets: string[];
  sectors: string[];
  useCases: string[];
  url: string;
  description: string;
  commercialStatus:
    | "Sell Now"
    | "Demo Ready"
    | "Pilot Ready"
    | "Validation"
    | "Strategic"
    | "Exploring"
    | "Parked";
}

export interface CampaignDefinition {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  primary: boolean;
  market: string;
  sectors: string[];
  products: string[];
  objective: string;
  reviewCadence: string;
}

export const solutionFamilies = [
  "Customer Engagement AI",
  "Voice AI",
  "Multilingual AI",
  "Information Assistants",
  "Operations Intelligence",
  "Workflow Automation",
  "Decision Intelligence",
  "Opportunity Intelligence",
  "Business Readiness",
  "AI Governance & Risk",
  "AI Education & Training",
  "Market Entry Solutions",
  "Custom AI Solution",
  "Consulting / Advisory",
];

export const organisationTypes = [
  "Sole Trader",
  "Micro Business",
  "Small Business",
  "Medium Business",
  "Regional SME",
  "Family Business",
  "Multi-site Business",
  "Franchise",
  "National Company",
  "Start-up",
  "Membership Organisation",
  "Charity / NGO",
  "Government Ministry",
  "Government Agency",
  "Municipality",
  "Regional Council",
  "State-owned Enterprise",
  "Regulatory Body",
  "Industry Body",
  "Chamber of Commerce",
  "Educational Institution",
  "University",
  "Training Provider",
  "Financial Institution",
  "Bank",
  "Development Organisation",
  "Partnership / Network",
];

export const relationshipTypes = [
  "New Prospect",
  "Qualified Prospect",
  "Opportunity",
  "Customer",
  "Former Customer",
  "Strategic Partner",
  "Potential Partner",
  "Pilot Partner",
  "Institutional Customer",
  "Referrer",
  "Introducer",
  "Tester",
  "Supplier",
  "Industry Contact",
  "Government Stakeholder",
  "Funder",
  "Media Contact",
  "Existing Relationship",
  "Nurture",
  "Do Not Pursue",
];

export const useCases = [
  "Missed Enquiries",
  "After-hours Enquiries",
  "Lead Capture",
  "Lead Qualification",
  "Appointment Booking",
  "Telephone Answering",
  "WhatsApp Handling",
  "Customer FAQs",
  "Multilingual Communication",
  "Customer Support",
  "Internal Operations",
  "Workflow Automation",
  "Data Capture",
  "Reporting / Intelligence",
  "Waste Reduction",
  "Logistics Management",
  "Fleet Operations",
  "Funding Readiness",
  "Tender Readiness",
  "Business Readiness",
  "Youth Development",
  "Entrepreneurship",
  "Decision Support",
  "AI Governance",
  "AI Risk",
  "Staff AI Guidance",
  "Public Information",
  "Compliance",
  "Training / Education",
  "Market Entry",
];

export const markets: MarketDefinition[] = [
  {
    id: "uk",
    name: "United Kingdom",
    status: "Core Market",
    regions: [
      "Yorkshire",
      "West Yorkshire",
      "North of England",
      "Midlands",
      "London",
      "South East",
      "South West",
      "Scotland",
      "Wales",
      "Northern Ireland",
      "UK-wide",
    ],
    sectors: [
      {
        name: "Trades & Home Services",
        subcategories: [
          "Plumbing & Heating",
          "Boiler Services",
          "Electrical",
          "Roofing",
          "Drainage",
          "HVAC / Air Conditioning",
          "Builders",
          "Property Maintenance",
          "Locksmiths",
          "Glazing / Windows & Doors",
          "Pest Control",
          "Landscaping",
          "Cleaning Services",
          "Fire & Security",
          "Renewable Energy / Solar",
          "Bathrooms & Kitchens",
          "Joinery",
          "Other Trade",
        ],
      },
      {
        name: "Health & Private Healthcare",
        subcategories: [
          "Dental Practice",
          "Orthodontics",
          "Physiotherapy",
          "Chiropractic",
          "Osteopathy",
          "Private Clinic",
          "Aesthetics",
          "Opticians",
          "Hearing Clinic",
          "Therapy Practice",
          "Veterinary Practice",
        ],
      },
      {
        name: "Care Services",
        subcategories: [
          "Domiciliary Care",
          "Home Care",
          "Care Home",
          "Supported Living",
          "Disability Support",
          "Live-in Care",
          "Care Recruitment",
          "Private Nursing",
        ],
      },
      {
        name: "Property & Workspace",
        subcategories: [
          "Estate Agent",
          "Letting Agent",
          "Property Management",
          "Block Management",
          "Property Developer",
          "Student Accommodation",
          "Serviced Accommodation",
          "Serviced Office",
          "Coworking Space",
          "Business Centre",
          "Industrial Workspace",
          "Self-storage",
        ],
      },
      {
        name: "Automotive Services",
        subcategories: [
          "Independent Garage",
          "MOT Centre",
          "Bodyshop",
          "Accident Repair",
          "Tyre Centre",
          "Mobile Mechanic",
          "Vehicle Recovery",
          "Windscreen Repair",
          "Commercial Vehicle Repair",
          "Car Detailing",
        ],
      },
      {
        name: "Fitness & Wellness",
        subcategories: [
          "Independent Gym",
          "Functional Fitness",
          "HYROX / Hybrid Training",
          "Personal Training Studio",
          "CrossFit",
          "Martial Arts",
          "Boxing Gym",
          "Yoga",
          "Pilates",
          "Swimming School",
          "Sports Club",
          "Wellness Centre",
        ],
      },
      {
        name: "Transport & Logistics",
        subcategories: [
          "Courier",
          "Same-day Courier",
          "Haulage",
          "Transport",
          "Logistics",
          "Freight",
          "Fleet",
          "Distribution",
          "Warehousing",
          "Removals",
          "Delivery Services",
          "Vehicle Recovery",
        ],
      },
      {
        name: "Professional Services",
        subcategories: [
          "Accountant",
          "Solicitor",
          "Conveyancer",
          "Mortgage Broker",
          "Financial Adviser",
          "Insurance Broker",
          "Recruitment Agency",
          "Business Consultant",
          "Architect",
          "Surveyor",
        ],
      },
      {
        name: "Education & Training",
        subcategories: [
          "Primary School",
          "Secondary School",
          "Independent School",
          "Nursery",
          "College",
          "University",
          "Training Provider",
          "Apprenticeship Provider",
          "Tutoring",
          "Driving School",
          "Professional Training",
          "Online Education",
        ],
      },
      {
        name: "Hospitality & Tourism",
        subcategories: [
          "Hotel",
          "Guesthouse",
          "B&B",
          "Self-catering Accommodation",
          "Holiday Let",
          "Restaurant",
          "Hotel Group",
          "Catering",
          "Contract Catering",
          "Event Venue",
          "Conference Venue",
          "Tour Operator",
        ],
      },
      {
        name: "Faith & Non-profit",
        subcategories: [
          "Church",
          "Denomination",
          "Christian Organisation",
          "Charity",
          "Mission Organisation",
          "Faith-led Business",
          "NGO",
          "Community Organisation",
        ],
      },
    ],
  },
  {
    id: "namibia",
    name: "Namibia",
    status: "Active Market Entry",
    regions: [
      "National",
      "Windhoek",
      "Khomas",
      "Erongo",
      "Oshana",
      "Oshikoto",
      "Ohangwena",
      "Omusati",
      "Kavango East",
      "Kavango West",
      "Otjozondjupa",
      "Kunene",
      "Hardap",
      "Karas",
      "Zambezi",
      "Omaheke",
    ],
    sectors: [
      {
        name: "Tourism & Hospitality",
        subcategories: [
          "Lodge",
          "Safari Lodge",
          "Guesthouse",
          "Hotel",
          "Self-catering",
          "B&B",
          "Tour Operator",
          "Car Hire",
          "Travel Operator",
          "Destination Management",
          "Tourism Association",
          "Tourism Authority",
        ],
      },
      {
        name: "SME & Entrepreneurship",
        subcategories: [
          "Micro Business",
          "Informal Trader",
          "SME",
          "Start-up",
          "Entrepreneur",
          "Youth Entrepreneur",
          "Business Association",
          "Business Support Organisation",
          "Incubator",
          "Accelerator",
          "Enterprise Programme",
        ],
      },
      {
        name: "Banking, Finance & Investment",
        subcategories: [
          "Commercial Bank",
          "Development Bank",
          "Microfinance",
          "Investment Organisation",
          "Fund",
          "Grant Programme",
          "SME Finance",
          "Financial Education",
          "Insurance",
          "Fintech",
        ],
      },
      {
        name: "Government & Public Sector",
        subcategories: [
          "Ministry",
          "Government Agency",
          "Municipality",
          "Regional Council",
          "State-owned Enterprise",
          "Regulatory Body",
          "Youth Programme",
          "SME Programme",
          "Tourism Authority",
          "Education Authority",
          "Public Information Service",
        ],
      },
      {
        name: "Education, Youth & Skills",
        subcategories: [
          "School",
          "University",
          "College",
          "Vocational Training",
          "Skills Programme",
          "Youth Organisation",
          "Entrepreneurship Programme",
          "Career Guidance",
          "Training Academy",
          "Government Youth Programme",
        ],
      },
      {
        name: "Agriculture & Agribusiness",
        subcategories: [
          "Commercial Farming",
          "Agribusiness",
          "Food Processing",
          "Agricultural Supplier",
          "Agricultural Exporter",
          "Feed Producer",
          "Cooperative",
          "Agricultural Association",
          "Agricultural Logistics",
        ],
      },
      {
        name: "Property & Construction",
        subcategories: [
          "Property Developer",
          "Estate Agency",
          "Construction",
          "Property Management",
          "Facilities Management",
          "Building Supplier",
        ],
      },
      {
        name: "Faith & Non-profit",
        subcategories: [
          "Church",
          "Christian Organisation",
          "NGO",
          "Development Organisation",
          "Community Organisation",
          "Charity",
        ],
      },
    ],
  },
  {
    id: "southern-africa",
    name: "Southern Africa",
    status: "Exploring",
    regions: [
      "South Africa",
      "Botswana",
      "Zambia",
      "Zimbabwe",
      "Angola",
      "Mozambique",
      "Malawi",
      "Other",
    ],
    sectors: [
      {
        name: "General Business",
        subcategories: [
          "SME",
          "Enterprise",
          "Tourism",
          "Agriculture",
          "Education",
          "Healthcare",
          "Property",
          "Logistics",
          "Professional Services",
        ],
      },
    ],
  },
  {
    id: "central-africa",
    name: "Central Africa",
    status: "Existing Relationship",
    regions: ["DRC", "Other"],
    sectors: [
      {
        name: "Agriculture & Agribusiness",
        subcategories: [
          "Agribusiness",
          "Agricultural Supplier",
          "Food Producer",
          "Exporter",
          "Distribution",
        ],
      },
    ],
  },
  {
    id: "international",
    name: "International",
    status: "Opportunistic",
    regions: [
      "Europe",
      "Middle East",
      "Africa",
      "North America",
      "Asia Pacific",
      "Global",
    ],
    sectors: [
      {
        name: "General",
        subcategories: [
          "Business Services",
          "Technology",
          "Hospitality",
          "Education",
          "Faith",
          "Consulting",
          "Entrepreneurship",
        ],
      },
    ],
  },
];

export const products: ProductDefinition[] = [
  {
    id: "fredi",
    name: "Fredi",
    family: "Customer Engagement AI",
    type: "Core Product",
    markets: ["United Kingdom"],
    sectors: ["Multi-sector"],
    useCases: [
      "Lead Capture",
      "Lead Qualification",
      "Missed Enquiries",
      "After-hours Enquiries",
      "Customer FAQs",
    ],
    url: "https://fredi.mediahubink.com",
    description:
      "Mediahubink's core enquiry capture and qualification solution for service businesses.",
    commercialStatus: "Sell Now",
  },
  {
    id: "trades-demo",
    name: "Trades Demo",
    family: "Customer Engagement AI",
    type: "Demo",
    markets: ["United Kingdom"],
    sectors: ["Trades & Home Services"],
    useCases: [
      "Lead Capture",
      "Missed Enquiries",
      "After-hours Enquiries",
      "Lead Qualification",
    ],
    url: "https://trades-demo.mediahubink.com",
    description:
      "Vertical demonstration of enquiry handling for trades and home-service businesses.",
    commercialStatus: "Demo Ready",
  },
  {
    id: "voice-demo",
    name: "Voice Demo",
    family: "Voice AI",
    type: "Demo",
    markets: ["United Kingdom", "Namibia"],
    sectors: ["Multi-sector"],
    useCases: [
      "Telephone Answering",
      "Lead Qualification",
      "Customer FAQs",
      "After-hours Enquiries",
    ],
    url: "https://voice-demo.mediahubink.com",
    description:
      "Voice-agent demonstration for telephone enquiries, qualification and handover.",
    commercialStatus: "Demo Ready",
  },
  {
    id: "grid-gym",
    name: "Grid Gym",
    family: "Customer Engagement AI",
    type: "Vertical Solution",
    markets: ["United Kingdom"],
    sectors: ["Fitness & Wellness"],
    useCases: [
      "Lead Capture",
      "Customer FAQs",
      "Appointment Booking",
      "After-hours Enquiries",
    ],
    url: "https://grid-gym-demo.mediahubink.com",
    description:
      "Fitness-industry enquiry assistant for gyms and performance-led fitness businesses.",
    commercialStatus: "Demo Ready",
  },
  {
    id: "gym-demo",
    name: "Gym Demo",
    family: "Customer Engagement AI",
    type: "Demo",
    markets: ["United Kingdom"],
    sectors: ["Fitness & Wellness"],
    useCases: [
      "Lead Capture",
      "Customer FAQs",
      "Appointment Booking",
    ],
    url: "https://gym-demo.mediahubink.com",
    description:
      "General gym and fitness customer-engagement demonstration.",
    commercialStatus: "Demo Ready",
  },
  {
    id: "runsheet-os",
    name: "RunSheet OS",
    family: "Operations Intelligence",
    type: "Core Product",
    markets: ["United Kingdom"],
    sectors: ["Transport & Logistics"],
    useCases: [
      "Logistics Management",
      "Fleet Operations",
      "Workflow Automation",
      "Internal Operations",
      "Reporting / Intelligence",
    ],
    url: "https://app.runsheetos.co.uk",
    description:
      "Operational system for small and medium transport, courier and logistics businesses.",
    commercialStatus: "Pilot Ready",
  },
  {
    id: "wasteiq",
    name: "WasteIQ",
    family: "Operations Intelligence",
    type: "Pilot",
    markets: ["United Kingdom", "International"],
    sectors: ["Hospitality & Tourism"],
    useCases: [
      "Waste Reduction",
      "Reporting / Intelligence",
      "Compliance",
      "Internal Operations",
    ],
    url: "https://wasteiq.mediahubink.com",
    description:
      "Operational intelligence platform focused on hospitality waste, reporting and action.",
    commercialStatus: "Pilot Ready",
  },
  {
    id: "bizspace",
    name: "BizSpace Demo",
    family: "Customer Engagement AI",
    type: "Vertical Solution",
    markets: ["United Kingdom"],
    sectors: ["Property & Workspace"],
    useCases: [
      "Lead Capture",
      "Lead Qualification",
      "Customer FAQs",
      "Appointment Booking",
    ],
    url: "https://bizspace.mediahubink.com",
    description:
      "Enquiry assistant demonstration for flexible workspace, offices and commercial property.",
    commercialStatus: "Demo Ready",
  },
  {
    id: "kingdom-intelligence",
    name: "Kingdom Intelligence",
    family: "AI Governance & Risk",
    type: "Venture",
    markets: ["United Kingdom", "International"],
    sectors: ["Faith & Non-profit"],
    useCases: [
      "AI Governance",
      "AI Risk",
      "Staff AI Guidance",
      "Training / Education",
    ],
    url: "https://kingdomintelligence.co.uk",
    description:
      "Responsible AI education, governance and advisory initiative for churches and Christian organisations.",
    commercialStatus: "Strategic",
  },
  {
    id: "ezra",
    name: "Ezra",
    family: "AI Governance & Risk",
    type: "Core Product",
    markets: ["United Kingdom", "International"],
    sectors: ["Faith & Non-profit"],
    useCases: [
      "AI Governance",
      "AI Risk",
      "Staff AI Guidance",
      "Decision Support",
    ],
    url: "https://kingdomintelligence.co.uk/ezra.html",
    description:
      "AI adviser for church policy, operations, safeguarding boundaries and responsible AI use.",
    commercialStatus: "Demo Ready",
  },
  {
    id: "pondu",
    name: "Pondu",
    family: "Multilingual AI",
    type: "Market-entry Demo",
    markets: ["Central Africa", "International"],
    sectors: ["Agriculture & Agribusiness"],
    useCases: [
      "Multilingual Communication",
      "Customer FAQs",
      "Customer Support",
      "Lead Qualification",
    ],
    url: "https://pondu.mediahubink.com",
    description:
      "Multilingual agribusiness customer-assistant demonstration for African markets.",
    commercialStatus: "Demo Ready",
  },
  {
    id: "netty",
    name: "Netty",
    family: "Information Assistants",
    type: "Vertical Solution",
    markets: ["United Kingdom", "International"],
    sectors: ["Education & Training"],
    useCases: [
      "Public Information",
      "Customer FAQs",
      "After-hours Enquiries",
      "Training / Education",
    ],
    url: "https://netty.mediahubink.com",
    description:
      "Education information assistant for schools and education organisations.",
    commercialStatus: "Demo Ready",
  },
  {
    id: "mentorboard",
    name: "MentorBoard",
    family: "Decision Intelligence",
    type: "MVP",
    markets: ["International"],
    sectors: ["Entrepreneurship", "Professional Services"],
    useCases: ["Decision Support", "Entrepreneurship"],
    url: "https://mentorboard-seven.vercel.app",
    description:
      "Decision-support concept for founders, consultants and leaders.",
    commercialStatus: "Exploring",
  },
  {
    id: "opportunity",
    name: "Opportunity Blueprint",
    family: "Opportunity Intelligence",
    type: "Core Product",
    markets: ["United Kingdom", "International"],
    sectors: ["Entrepreneurship"],
    useCases: [
      "Entrepreneurship",
      "Decision Support",
      "Market Entry",
    ],
    url: "https://opportunity.mediahubink.com",
    description:
      "Opportunity assessment and business-idea intelligence platform.",
    commercialStatus: "Validation",
  },
  {
    id: "smile",
    name: "Smile",
    family: "Customer Engagement AI",
    type: "Vertical Solution",
    markets: ["United Kingdom"],
    sectors: ["Health & Private Healthcare"],
    useCases: [
      "Lead Capture",
      "Appointment Booking",
      "Customer FAQs",
      "After-hours Enquiries",
    ],
    url: "https://smile.mediahubink.com",
    description:
      "Dental enquiry assistant demonstration for patient questions and appointment enquiries.",
    commercialStatus: "Demo Ready",
  },
  {
    id: "namready-youth",
    name: "NamReady Youth",
    family: "Business Readiness",
    type: "Platform",
    markets: ["Namibia"],
    sectors: ["Education, Youth & Skills", "SME & Entrepreneurship"],
    useCases: [
      "Youth Development",
      "Entrepreneurship",
      "Business Readiness",
      "Training / Education",
    ],
    url: "https://youth.namready.com",
    description:
      "Namibia-first youth enterprise readiness and action-planning platform.",
    commercialStatus: "Validation",
  },
  {
    id: "namready",
    name: "NamReady",
    family: "Business Readiness",
    type: "Venture",
    markets: ["Namibia"],
    sectors: [
      "SME & Entrepreneurship",
      "Banking, Finance & Investment",
      "Government & Public Sector",
    ],
    useCases: [
      "Business Readiness",
      "Funding Readiness",
      "Tender Readiness",
      "Entrepreneurship",
    ],
    url: "https://www.namready.com",
    description:
      "Namibia-focused readiness platform helping SMEs become better prepared for finance, grants and tenders.",
    commercialStatus: "Strategic",
  },
  {
    id: "kaya",
    name: "Kaya",
    family: "Customer Engagement AI",
    type: "Market-entry Demo",
    markets: ["Namibia"],
    sectors: ["Tourism & Hospitality"],
    useCases: [
      "Multilingual Communication",
      "Customer FAQs",
      "After-hours Enquiries",
      "Lead Qualification",
      "Customer Support",
    ],
    url: "https://kaya.mediahubink.com",
    description:
      "Namibia tourism and hospitality AI-agent demonstration for guest enquiries and multilingual support.",
    commercialStatus: "Demo Ready",
  },
];

export const defaultCampaigns: CampaignDefinition[] = [
  {
    id: "fredi-uk-trades",
    name: "Fredi UK Trades",
    type: "Revenue",
    status: "Active",
    primary: true,
    market: "United Kingdom",
    sectors: ["Trades & Home Services"],
    products: ["Fredi", "Trades Demo", "Voice Demo"],
    objective: "Win the next paying Fredi customer.",
    reviewCadence: "Weekly",
  },
  {
    id: "namibia-ai-market-entry",
    name: "Namibia AI Market Entry",
    type: "Market Entry",
    status: "Active",
    primary: false,
    market: "Namibia",
    sectors: [
      "Tourism & Hospitality",
      "SME & Entrepreneurship",
      "Banking, Finance & Investment",
      "Government & Public Sector",
      "Education, Youth & Skills",
    ],
    products: [
      "Kaya",
      "NamReady",
      "NamReady Youth",
      "Voice Demo",
      "Fredi",
    ],
    objective:
      "Validate demand, build institutional relationships and identify viable AI pilot opportunities in Namibia.",
    reviewCadence: "Weekly",
  },
];

export const campaignTypes: CampaignType[] = [
  "Revenue",
  "Market Entry",
  "Partnership",
  "Validation",
  "Pilot",
  "Research",
  "Nurture",
];

export const campaignStatuses: CampaignStatus[] = [
  "Active",
  "Secondary",
  "Developing",
  "Paused",
  "Parked",
  "Completed",
];

export const marketStatuses: MarketStatus[] = [
  "Core Market",
  "Active Market Entry",
  "Exploring",
  "Existing Relationship",
  "Opportunistic",
  "Future",
  "Parked",
];

export const portfolioStatuses: PortfolioStatus[] = [
  "Core Product",
  "Vertical Solution",
  "Demo",
  "Market-entry Demo",
  "Pilot",
  "Platform",
  "Venture",
  "MVP",
  "Experiment",
  "Internal Tool",
  "Parked",
];

export const alfredConfig = {
  markets,
  solutionFamilies,
  organisationTypes,
  relationshipTypes,
  useCases,
  products,
  defaultCampaigns,
  campaignTypes,
  campaignStatuses,
  marketStatuses,
  portfolioStatuses,
};

export default alfredConfig;
