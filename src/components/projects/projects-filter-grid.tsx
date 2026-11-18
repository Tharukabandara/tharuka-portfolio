"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProjectCard } from "@/components/projects/project-card";
import {
  projects as staticProjects,
  projectCategories,
  type Project,
  type ProjectCategory,
} from "@/data/projects";

export function ProjectsFilterGrid({
  initialProjects = staticProjects,
}: {
  initialProjects?: Project[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<"All" | ProjectCategory>("All");
  const [selectedTech, setSelectedTech] = useState<string>("All");

  const allTechnologies = useMemo(() => {
    const set = new Set<string>();
    initialProjects.forEach((p) => p.stack.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set)];
  }, [initialProjects]);

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;
      const matchesTech =
        selectedTech === "All" || project.stack.includes(selectedTech);
      return matchesCategory && matchesTech;
    });
  }, [initialProjects, selectedCategory, selectedTech]);

  return (
    <div>
      <div className="panel mb-10 flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono-code text-[11px] uppercase tracking-wider text-[#20cfff]">
              Filter by Domain
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {projectCategories.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`relative rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                      active
                        ? "text-[#051218] font-semibold"
                        : "border border-white/10 bg-white/[0.02] text-[#9aa8b8] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="project-category-pill"
                        className="absolute inset-0 -z-10 rounded-lg bg-[#20cfff] shadow-[0_0_24px_rgba(32,207,255,0.4)]"
                        transition={{ type: "spring", stiffness: 360, damping: 28 }}
                      />
                    )}
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-right font-mono-code text-xs text-[#8492a2]">
            Showing <span className="text-[#c8ff00] font-semibold">{filteredProjects.length}</span> of{" "}
            {initialProjects.length} projects
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-4">
          <p className="font-mono-code text-[11px] uppercase tracking-wider text-[#8492a2]">
            Technology Tag
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {allTechnologies.map((tech) => {
              const active = selectedTech === tech;
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setSelectedTech(tech)}
                  className={`relative rounded-md px-2.5 py-1 font-mono-code text-[11px] transition ${
                    active
                      ? "text-[#c8ff00] font-semibold"
                      : "border border-white/[0.07] bg-white/[0.02] text-[#9aa8b8] hover:border-white/20 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="project-tech-pill"
                      className="absolute inset-0 -z-10 rounded-md border border-[#c8ff00]/60 bg-[#c8ff00]/15 shadow-[0_0_16px_rgba(200,255,0,0.2)]"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                  {tech}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="panel p-12 text-center"
        >
          <p className="text-base font-semibold text-white">No projects match that filter combination.</p>
          <p className="mt-2 text-xs text-[#9aa8b8]">
            Try resetting the category or technology filter to view all case studies.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSelectedTech("All");
            }}
            className="button-secondary mt-5 text-xs"
          >
            Reset filters
          </button>
        </motion.div>
      ) : (
        <motion.div layout className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -12 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
