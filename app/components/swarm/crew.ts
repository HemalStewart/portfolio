/**
 * The crew: twelve cursors, one per skill, all of them the same person.
 * The first four are the crafts the rest of the site is coloured by
 * (`data-by` on a build step asks for one of them by id).
 */
export type Member = {
  id: string;
  name: string;
  color: string;
  /** Light colours carry dark text on their name tag. */
  dark?: boolean;
};

export const CREW: Member[] = [
  { id: "design", name: "Design", color: "#ff6a3d" },
  { id: "web", name: "Web", color: "#4f83ff" },
  { id: "flutter", name: "Flutter", color: "#22d38a", dark: true },
  { id: "ai", name: "Backend", color: "#a678ff" },
  { id: "motion", name: "Motion", color: "#ffd84a", dark: true },
  { id: "api", name: "API", color: "#35c9f5", dark: true },
  { id: "ux", name: "UX", color: "#ff7eb6", dark: true },
  { id: "ml", name: "AI", color: "#c98bff", dark: true },
  { id: "seo", name: "SEO", color: "#b6f36a", dark: true },
  { id: "deploy", name: "Deploy", color: "#2ee6c8", dark: true },
  { id: "qa", name: "QA", color: "#ff5d5d" },
  { id: "copy", name: "Copy", color: "#f4b183", dark: true },
];

/** How many of the crew work on a small screen. */
export const SMALL_CREW = 6;
