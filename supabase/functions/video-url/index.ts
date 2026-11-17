// Entrega la dirección de un video de Bunny Stream solo a quien puede verlo.
// La app manda { video: '<id de Bunny>' } con la sesión del usuario (o sin ella). La base de datos
// decide (acceso_video: plan vigente y nivel suficiente, o lección gratis) y aquí se firma la carpeta
// del video por unas horas con la llave de «Token Authentication» de Bunny.
//
// Secretos de la función (Supabase → Edge Functions → Secrets):
//   BUNNY_TOKEN_KEY  llave de autenticación por token de la zona de Bunny. Sin ella el enlace sale
//                    sin firma (sirve mientras Bunny no exija token).
//   BUNNY_CDN_HOST   opcional; por defecto el de js/content.js.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const HORAS = 6;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" } });

async function firma(key: string, path: string, expires: number) {
  const data = new TextEncoder().encode(`${key}${path}${expires}token_path=${path}`);
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", data));
  const b64 = btoa(String.fromCharCode(...hash));
  return "HS256-" + b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ ok: false, error: "metodo" }, 405);

  let video = "";
  try { video = String((await req.json()).video ?? ""); } catch { /* cuerpo vacío o inválido */ }
  if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(video)) return json({ ok: false, error: "video" }, 400);

  // Solo una sesión de usuario (un JWT) cuenta como identidad; la llave pública de la app, no.
  const bearer = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const headers: Record<string, string> = bearer.split(".").length === 3 ? { Authorization: `Bearer ${bearer}` } : {};
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers }, auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await sb.rpc("acceso_video", { p_video: video });
  if (error) return json({ ok: false, error: "sesion" }, 401);
  if (data !== true) return json({ ok: false, error: "sin_acceso" }, 403);

  const host = Deno.env.get("BUNNY_CDN_HOST") || "vz-2449e89f-b51.b-cdn.net";
  const key = Deno.env.get("BUNNY_TOKEN_KEY");
  if (!key) return json({ ok: true, base: `https://${host}/${video}`, firmado: false });

  const expires = Math.floor(Date.now() / 1000) + HORAS * 3600;
  const path = `/${video}/`;
  const token = await firma(key, path, expires);
  return json({
    ok: true, firmado: true, expira: expires,
    base: `https://${host}/bcdn_token=${token}&expires=${expires}&token_path=${encodeURIComponent(path)}/${video}`,
  });
});
