import type { BunRequest } from "bun";
import { login } from "../../lib/auth";
import directus from "../../lib/directus";

export default async function LoginPage(req: BunRequest, layout: string) {
  const loginHtml = await Bun.file("./pages/login/index.html").text();
  const totalHtml = layout.replace("{{CONTENT}}", loginHtml);

  if (req.method === "POST") {
    const data = await req.formData();
    const intent: string = data.get("intent")?.toString() as string;

    switch (intent) {
      case "logout":
        const refreshToken = req.cookies
          .get("refresh_token")
          ?.toString() as string;

        await directus.logout({ refresh_token: refreshToken });
        req.cookies.delete("access_token");
        req.cookies.delete("refresh_token");

        return new Response(null, {
          status: 303,
          headers: {
            Location: "/login",
            "Content-Type": "application/json",
          },
        });

      default:
        const email: string = data.get("email")?.toString() as string;
        const password: string = data.get("password")?.toString() as string;
        const authData = await login({ email, password });

        req.cookies.set("access_token", authData.access_token as string, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge:
            Number((process.env.ACCESS_TOKEN_TTL as string).replace("m", "")) *
            60,
        });

        req.cookies.set("refresh_token", authData.refresh_token as string, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge:
            Number((process.env.REFRESH_TOKEN_TTL as string).replace("m", "")) *
            60,
        });

        return new Response(null, {
          status: 303,
          headers: {
            Location: "/",
            "Content-Type": "application/json",
          },
        });
    }
  } else {
    return new Response(totalHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
}
