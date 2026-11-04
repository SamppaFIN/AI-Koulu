// Sisäinen linkki base-polun (/AI-Koulu/) alle. trailingSlash: "always", joten sivupolut päättyvät kauttaviivaan.
export const url = (path = "") => import.meta.env.BASE_URL.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
