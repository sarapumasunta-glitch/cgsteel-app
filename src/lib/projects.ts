export type ProjectStatus = "published" | "repository";

export const PROJECT_STATUSES: ProjectStatus[] = ["published", "repository"];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  published: "Publicado",
  repository: "Repositorio",
};

export const PROJECT_STATUS_BADGE_CLASSES: Record<ProjectStatus, string> = {
  published: "bg-green-100 text-green-700",
  repository: "bg-steel-gray/20 text-steel-gray",
};
