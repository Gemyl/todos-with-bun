import { authentication, createDirectus, rest } from "@directus/sdk";

const directus = createDirectus(process.env.DIRECTUS_URL as string)
  .with(rest())
  .with(authentication("json", { credentials: "include", autoRefresh: false }));

export default directus;
