export type ProjectCategory =
  | "Full-Stack / E-Commerce"
  | "Full-Stack / Booking System"
  | "Product Concept / Full-Stack";

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  context: string;
  summary: string;
  description: string;
  problem: string;
  role: string;
  architecture: {
    overview: string;
    layers: { name: string; detail: string }[];
  };
  features: string[];
  challenges: string[];
  outcomes: string[];
  stack: string[];
  status: "Completed" | "Planning & Architecture" | "In Progress";
  featured: boolean;
  accentColor: "cyan" | "lime";
  links?: {
    demo?: string;
    github?: string;
  };
};

export const projects: Project[] = [
  {
    slug: "pet-adoption-platform",
    title: "Pet Adoption & Accessory Marketplace",
    subtitle: "Final Year University Project — Unified Pet Adoption Portal & Stripe E-Commerce Store",
    category: "Full-Stack / E-Commerce",
    context: "Final Year Capstone Project · University of Plymouth (2025)",
    summary:
      "A full-stack MERN platform combining structured pet adoption workflows with an integrated pet accessory e-commerce marketplace and Stripe Sandbox checkout.",
    description:
      "Designed and engineered as my BSc (Hons) Software Engineering Final Year Project, this platform bridges two connected user journeys: discovering and applying to adopt pets, and purchasing essential pet accessories in a single cohesive web application.",
    problem:
      "Prospective pet adopters frequently face fragmented workflows—browsing static adoption listings on one site while navigating separate retail stores for food and supplies, often without reliable profile verification or transparent order tracking.",
    role: "Full-Stack Developer (End-to-End Architecture, UI, API & Payment Integration)",
    architecture: {
      overview:
        "Built on a decoupled MERN stack architecture with a responsive React single-page frontend communicating with a stateless Node.js/Express REST API secured via JWT authentication and backed by MongoDB document collections.",
      layers: [
        {
          name: "Presentation Layer (React.js)",
          detail:
            "Responsive component architecture for pet discovery filters, adoption profiles, persistent shopping cart state, and checkout flows.",
        },
        {
          name: "API & Authentication Layer (Node.js + Express + JWT)",
          detail:
            "RESTful controllers enforcing JWT authentication, protected profile routes, and input validation across adoption and commerce endpoints.",
        },
        {
          name: "Payment & Order Processing (Stripe Sandbox)",
          detail:
            "Integrated Stripe Sandbox checkout workflow with secure token/intent handling and order state persistence.",
        },
        {
          name: "Persistence Layer (MongoDB)",
          detail:
            "Structured schemas for Users, Pet Listings, Adoption Applications, Products, Cart Items, and Orders.",
        },
      ],
    },
    features: [
      "Full CRUD operations for pet adoption listings, detailed pet profiles, and user account management.",
      "JWT-based authentication and authorization protecting user profiles, adoption requests, and order histories.",
      "Integrated e-commerce accessory marketplace with dynamic product browsing, shopping cart management, and order creation.",
      "Secure payment processing integrated via Stripe Sandbox with clean checkout feedback and order confirmation.",
      "Responsive layout engineered for seamless browsing across desktop, tablet, and mobile viewports.",
    ],
    challenges: [
      "Coordinating two distinct domain models (adoption listings vs. e-commerce inventory and cart state) within a unified user session and navigation structure.",
      "Ensuring secure payment data handling with Stripe Sandbox so sensitive card details never touch the application server directly.",
    ],
    outcomes: [
      "Delivered a complete end-to-end full-stack capstone application demonstrating authentication, CRUD domain modeling, and third-party payment gateway integration.",
      "Contributed to achieving Upper Second-Class Honours (2:1) in BSc (Hons) Software Engineering.",
    ],
    stack: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "Stripe Sandbox",
      "JWT Auth",
      "REST APIs",
    ],
    status: "Completed",
    featured: true,
    accentColor: "lime",
    links: {
      github: "https://github.com/Tharukabandara",
    },
  },
  {
    slug: "seat-reservation-system",
    title: "Seat Reservation System",
    subtitle: "Full-Stack Time-Slot & Seat Booking Engine with Conflict Prevention",
    category: "Full-Stack / Booking System",
    context: "Full-Stack Engineering Project · MERN Stack",
    summary:
      "A role-based seat and time-slot reservation platform featuring interactive booking workflows, JWT security, and double-booking conflict prevention.",
    description:
      "A full-stack reservation system engineered to handle seat allocation and time-slot scheduling reliably. The system enforces role-based access control (RBAC) for customers and administrators while preventing overlapping seat reservations.",
    problem:
      "Manual or poorly synchronized booking interfaces frequently suffer from double-booked seats, unclear time-slot availability, and lack of administrative visibility into capacity utilization.",
    role: "Full-Stack Developer",
    architecture: {
      overview:
        "A three-tier MERN architecture pairing a reactive seat-selection UI with an Express.js reservation engine that validates slot availability before committing bookings to MongoDB.",
      layers: [
        {
          name: "Interactive Booking Client (React.js)",
          detail:
            "Visual seat availability grid, date/time-slot selector, and role-aware dashboards for users and administrators.",
        },
        {
          name: "Security & Access Control (JWT + RBAC)",
          detail:
            "Middleware verifying signed JSON Web Tokens and differentiating standard user booking permissions from admin seat/schedule configuration.",
        },
        {
          name: "Conflict-Prevention Service (Node.js + Express.js)",
          detail:
            "Server-side validation checking existing seat + date + time-slot combinations prior to persistence to prevent overlapping bookings.",
        },
        {
          name: "Data Store (MongoDB)",
          detail:
            "Indexed collections for Seats, Time Slots, Reservations, and Users.",
        },
      ],
    },
    features: [
      "JWT authentication paired with Role-Based Access Control (RBAC) for users and administrators.",
      "Interactive seat selection and time-slot booking with real-time availability status.",
      "Deterministic conflict prevention logic blocking duplicate reservations for the same seat and time window.",
      "Admin management interface to configure seat layouts, manage time slots, and review active bookings.",
    ],
    challenges: [
      "Designing clean server-side validation rules to ensure two users cannot reserve the exact same seat and time slot simultaneously.",
      "Keeping the React seat map state synchronized with backend availability after booking creation or cancellation.",
    ],
    outcomes: [
      "Built a reusable booking engine pattern applicable to venues, transport, coworking spaces, or dining reservations.",
      "Strengthened practical proficiency in RBAC middleware and state-driven UI feedback.",
    ],
    stack: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "JWT Auth",
      "RBAC",
      "REST APIs",
    ],
    status: "Completed",
    featured: true,
    accentColor: "cyan",
    links: {
      github: "https://github.com/Tharukabandara",
    },
  },
  {
    slug: "pastamore-ecommerce",
    title: "PastAmore — Restaurant E-Commerce",
    subtitle: "Full-Stack Restaurant & Pizza Ordering Platform with Admin Management",
    category: "Full-Stack / E-Commerce",
    context: "Full-Stack Web Application · MERN Stack",
    summary:
      "A mobile-optimized restaurant and pizza shop e-commerce platform supporting dynamic menu browsing, customer ordering, and administrative catalog/order management.",
    description:
      "PastAmore is a digital ordering platform tailored for a pizza and Italian kitchen concept. It provides customers with a fast, appetizing mobile-first ordering flow while equipping staff with an administration portal to manage menu items and incoming orders.",
    problem:
      "Local restaurants relying solely on phone orders or third-party aggregators lose brand control and margin. They need a responsive, self-hosted ordering experience with straightforward menu administration.",
    role: "Full-Stack Developer",
    architecture: {
      overview:
        "Full-stack MERN application featuring a dynamic React storefront, RESTful Node.js/Express API endpoints, authenticated customer/admin sessions, and MongoDB persistence.",
      layers: [
        {
          name: "Customer Storefront & Admin UI (React.js)",
          detail:
            "Category-driven menu exploration, customizable cart drawer, checkout workflow, and admin management views.",
        },
        {
          name: "Order & Catalog API (Express.js + Node.js)",
          detail:
            "REST endpoints handling product CRUD, authentication, and order lifecycle transitions.",
        },
        {
          name: "Database Layer (MongoDB)",
          detail:
            "Document schemas storing menu items, categories, customer accounts, and itemized orders.",
        },
      ],
    },
    features: [
      "Dynamic product browsing with category filtering, item details, and responsive cart management.",
      "End-to-end customer ordering workflow optimized for mobile and desktop viewports.",
      "Dedicated admin management capabilities for creating, updating, and organizing menu offerings and tracking orders.",
      "Secure user authentication and session handling.",
    ],
    challenges: [
      "Optimizing UI rendering and navigation ergonomics for mobile users browsing rich food catalogs.",
      "Structuring clean separation between public storefront routes and protected administrative actions.",
    ],
    outcomes: [
      "Delivered a complete restaurant e-commerce blueprint with both customer-facing ordering and back-office management.",
    ],
    stack: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "Authentication",
      "REST APIs",
      "Responsive UI",
    ],
    status: "Completed",
    featured: true,
    accentColor: "cyan",
    links: {
      github: "https://github.com/Tharukabandara",
    },
  },
  {
    slug: "flavory-cafe",
    title: "Flavory Cafe — Digital Experience",
    subtitle: "Modern Web & Admin Concept for a Local Café in Avissawella",
    category: "Product Concept / Full-Stack",
    context: "Product Concept & Architecture · Avissawella, Sri Lanka",
    summary:
      "An upcoming digital storefront and admin dashboard concept for Flavory Cafe in Avissawella, designed around interactive menu discovery, visual storytelling, and local customer engagement.",
    description:
      "Flavory Cafe is a product and engineering initiative currently in the planning and architecture stage for a café in Avissawella. The goal is to craft a modern, high-speed web presence that showcases signature food and beverage categories, atmosphere gallery, contact channels, and a future administrative dashboard for live menu updates.",
    problem:
      "Regional cafés often lack a cohesive digital identity where guests can explore up-to-date menus, seasonal specials, and location details on mobile before visiting.",
    role: "Product Architect & Full-Stack Engineer",
    architecture: {
      overview:
        "Planned around Next.js App Router, TypeScript, and Tailwind CSS for instant server-rendered menu pages and SEO visibility, with a planned PostgreSQL/Supabase backend for dynamic menu and gallery administration.",
      layers: [
        {
          name: "Public Experience (Next.js App Router + Tailwind CSS)",
          detail:
            "Fast, mobile-first landing page, filterable digital menu by category, ambiance gallery, and direct contact/location integration.",
        },
        {
          name: "Planned Admin & Content Layer",
          detail:
            "Role-protected dashboard allowing café staff to update menu items, pricing, availability badges, and gallery photos without code deployments.",
        },
      ],
    },
    features: [
      "Categorized digital menu concept with dietary/specialty tags and search.",
      "Curated visual gallery highlighting café ambiance and signature offerings in Avissawella.",
      "Location, opening hours, and direct inquiry integration.",
      "Planned administrative dashboard architecture for self-service menu and content management.",
    ],
    challenges: [
      "Designing a lightweight, maintainable content workflow so non-technical café staff can update items effortlessly once launched.",
    ],
    outcomes: [
      "Currently in the planning and UI/architecture specification phase.",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL (Planned)"],
    status: "Planning & Architecture",
    featured: false,
    accentColor: "lime",
  },
];

export const projectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);

export const projectCategories: ("All" | ProjectCategory)[] = [
  "All",
  "Full-Stack / E-Commerce",
  "Full-Stack / Booking System",
  "Product Concept / Full-Stack",
];
