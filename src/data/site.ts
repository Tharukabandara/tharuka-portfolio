function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit && !explicit.includes("localhost")) {
    return explicit.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return explicit || "https://tharukabandara.vercel.app";
}

export const site = {
  name: "Tharuka Bandara",
  shortName: "THARUKA",
  role: "Full-Stack Software Engineer",
  tagline: "Architecting resilient backend services and refined full-stack web applications.",
  location: "Sri Lanka",
  locationDetail: "Colombo / Avissawella, Sri Lanka (UTC+5:30)",
  email: "tharukabandara821@gmail.com",
  phone: "+94 70 109 6940",
  github: "https://github.com/Tharukabandara",
  linkedin: "https://www.linkedin.com/in/tharuka-bandara-57b52b297",
  url: resolveSiteUrl(),
  cvPath: "/resume/tharuka-bandara-cv.pdf",
  portraitPath: "/images/profile/tharuka-bandara.jpg",
  availability: "Open to international & remote opportunities",
  description:
    "Full-Stack Software Engineer experienced in Java Spring Boot microservices, C# ASP.NET Core, React, Next.js, and the MERN stack — building scalable enterprise and e-commerce systems.",
  metrics: [
    { label: "Core Focus", value: "Full-Stack & Microservices" },
    { label: "Enterprise Stacks", value: "Spring Boot · .NET Core · React" },
    { label: "Honours Degree", value: "BSc (Hons) SE — 2:1 (Plymouth UK)" },
  ],
};
