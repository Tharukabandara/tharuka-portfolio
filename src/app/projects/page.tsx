import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/page-intro";
import { ProjectsFilterGrid } from "@/components/projects/projects-filter-grid";
import { getProjects } from "@/lib/portfolio-repository";

export const metadata: Metadata = {
  title: "Projects & Case Studies",
  description:
    "Explore full-stack software engineering projects and case studies by Tharuka Bandara, including a MERN Pet Adoption & Accessory Marketplace with Stripe, a Seat Reservation System, PastAmore E-Commerce, and Flavory Cafe.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container section-space">
      <PageIntro
        eyebrow="Selected Work"
        title="Projects & engineering case studies."
        description="A curated collection of full-stack applications and product concepts. Each case study breaks down the problem statement, system architecture, key features, and technical challenges."
      />
      <ProjectsFilterGrid initialProjects={projects} />
    </div>
  );
}
