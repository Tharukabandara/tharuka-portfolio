export type ExperienceItem = {
  id: string;
  company: string;
  companyLocation: string;
  role: string;
  employmentType: string;
  period: string;
  startDate: string;
  endDate: string;
  current: boolean;
  projectHighlight: string;
  summary: string;
  responsibilities: string[];
  domains: string[];
  technologies: string[];
};

export const experience: ExperienceItem[] = [
  {
    id: "algobrave",
    company: "AlgoBrave Technologies Pty Ltd",
    companyLocation: "Australia (Remote / Sri Lanka)",
    role: "Software Engineer Intern",
    employmentType: "Internship",
    period: "Mar 2026 – Present",
    startDate: "2026-03-20",
    endDate: "Present",
    current: true,
    projectHighlight: "StayCleanly — Multi-Tenant Microservice Platform",
    summary:
      "Supporting backend engineering for StayCleanly, a scalable multi-tenant microservice platform built with Java Spring Boot and PostgreSQL.",
    responsibilities: [
      "Develop and maintain backend microservices for the StayCleanly multi-tenant platform using Java Spring Boot and PostgreSQL.",
      "Architect and support core domain modules including User Management, Inventory Control, Order Processing, and Job/Staff Management using standardized service patterns, precise DTO mapping, and strict data validation.",
      "Implement secure document handling and cloud storage integration with AWS S3 and asynchronous processing to improve cross-service reliability and system scalability.",
      "Execute comprehensive end-to-end system testing, API verification, and document workflow testing across services.",
    ],
    domains: [
      "Multi-Tenant Microservices",
      "User Management",
      "Inventory & Order Systems",
      "Job Management",
      "Document Handling & AWS S3",
    ],
    technologies: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Microservices",
      "AWS S3",
      "REST APIs",
      "React",
      "Next.js",
      "Redux",
      "Postman",
    ],
  },
  {
    id: "slt",
    company: "Sri Lanka Telecom PLC (SLT)",
    companyLocation: "Lotus Road, Colombo 01, Sri Lanka",
    role: "Software Engineer Intern",
    employmentType: "Internship",
    period: "Sep 2025 – Mar 2026",
    startDate: "2025-09-09",
    endDate: "2026-03-09",
    current: false,
    projectHighlight: "ProHub — Enterprise Legacy System Modernization",
    summary:
      "Worked with the C#/.NET Core engineering team to build an upgraded, scalable replacement for SLT's legacy internal application (ProHub).",
    responsibilities: [
      "Engineered an upgraded enterprise system (ProHub) to replace an existing legacy SLT application using C# and ASP.NET Core.",
      "Implemented backend modules, RESTful API endpoints, and business logic supporting user management, client records, and internal project lifecycle handling.",
      "Built and verified structured document handling workflows and operational modules across the platform.",
      "Conducted functional testing, debugging, system refactoring, and performance optimization within a collaborative Agile environment.",
    ],
    domains: [
      "Legacy Modernization",
      "User & Client Management",
      "Internal Project Handling",
      "Document Workflows",
      "System Testing & Refactoring",
    ],
    technologies: [
      "C#",
      "ASP.NET Core",
      ".NET Core",
      "REST APIs",
      "SQL",
      "Agile / Scrum",
      "Git",
    ],
  },
];

export const education = {
  institution: "University of Plymouth (UK)",
  partnerInstitution: "NSBM Green University, Sri Lanka",
  qualification: "BSc (Hons) Software Engineering",
  result: "Second Class Honours, Upper Division (2:1)",
  period: "2022 – 2025",
  highlights: [
    "Completed capstone Final Year Project: Full-Stack Pet Adoption Platform & Accessory Marketplace with Stripe payment integration.",
    "Core focus on Full-Stack Web Engineering, Object-Oriented Programming (Java, C#), Relational & NoSQL Databases, and Software Architecture.",
  ],
};
