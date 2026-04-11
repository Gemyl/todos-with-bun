import type { BunRequest } from "bun";
import directus from "./directus";

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const data = await directus.login(
    { email: credentials.email, password: credentials.password },
    { mode: "json" },
  );
  return data;
};

export const checkSession = async (req: BunRequest) => {
  const accessToken = req.cookies.get("access_token")?.toString();
  const refreshToken = req.cookies.get("refresh_token")?.toString();

  if (!accessToken && refreshToken) {
    refreshSession(refreshToken, req);
    console.log("Token successully refreshed");
    return true;
  } else if (!accessToken && !refreshToken) {
    console.log("Token expired");
    return false;
  }

  return true;
};

const refreshSession = async (refreshToken: string, req: BunRequest) => {
  const authData = await directus.refresh({
    mode: "json",
    refresh_token: refreshToken,
  });
  req.cookies.set("access_token", authData.access_token as string, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge:
      Number((process.env.ACCESS_TOKEN_TTL as string).replace("m", "")) * 60,
  });
  req.cookies.set("refresh_token", authData.refresh_token as string, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge:
      Number((process.env.REFRESH_TOKEN_TTL as string).replace("m", "")) * 60,
  });
};
