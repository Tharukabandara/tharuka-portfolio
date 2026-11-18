export type SkillCategory = {
  id: string;
  title: string;
  subtitle: string;
  items: string[];
};

export const skillGroups: SkillCategory[] = [
  {
    id: "backend",
    title: "Backend & Enterprise Systems",
    subtitle: "Microservices, multi-tenant APIs, DTO validation & business logic",
    items: [
      "Java",
      "Spring Boot",
      "C#",
      "ASP.NET Core",
      "Node.js",
      "Express.js",
      "RESTful APIs",
      "Microservices",
      "JWT & RBAC",
    ],
  },
  {
    id: "frontend",
    title: "Frontend & Web Engineering",
    subtitle: "Responsive interfaces, state management & modern SSR/SPA architectures",
    items: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Redux",
      "Tailwind CSS",
      "HTML5 & CSS3",
    ],
  },
  {
    id: "database-cloud",
    title: "Databases, Storage & Integrations",
    subtitle: "Relational & document data modeling, cloud object storage & payments",
    items: [
      "PostgreSQL",
      "MongoDB",
      "MySQL",
      "AWS S3",
      "Stripe Sandbox API",
      "Multi-Tenant Data Modeling",
    ],
  },
  {
    id: "tools-practices",
    title: "Tools, Testing & Engineering Practices",
    subtitle: "Verification, API contract testing, version control & agile delivery",
    items: [
      "Git & GitHub",
      "Postman",
      "Spring Tool Suite (STS)",
      "VS Code",
      "System & API Testing",
      "Agile / Scrum",
      "Python & C",
    ],
  },
];

export const domainExperience = [
  {
    title: "Multi-Tenant Microservices",
    description:
      "Supporting multi-tenant backend services with strict tenant isolation, standardized service layers, and DTO validation in Java Spring Boot & PostgreSQL.",
  },
  {
    title: "Legacy System Modernization",
    description:
      "Upgrading enterprise legacy workflows into maintainable C# and ASP.NET Core modules covering internal project, client, and document management.",
  },
  {
    title: "Order, Inventory & Job Engines",
    description:
      "Designing transactional workflows for inventory tracking, order processing, seat/time-slot reservations, and operational job scheduling.",
  },
  {
    title: "Document & Cloud Storage Workflows",
    description:
      "Implementing secure document handling and AWS S3 storage integration with end-to-end functional and integration testing.",
  },
];
