import { createDirectus, rest } from "@directus/sdk";

const directus = createDirectus("http://app.summon.test").with(rest());

export default directus;
