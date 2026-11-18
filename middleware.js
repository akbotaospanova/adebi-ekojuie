// Bilim Hub · Әдеби цифрлық экосистема
// Сайтқа тек админ кіре алады (Vercel Routing Middleware + Basic Auth).
// Логин мен құпиясөз КОДТА ЕМЕС, Vercel баптауларында сақталады:
//   Project → Settings → Environment Variables:
//     ADMIN_USER     = өз логиніңіз
//     ADMIN_PASSWORD = өз құпиясөзіңіз
// Айнымалылар қойылмаса, төмендегі ADMIN_HASH тексеріледі: онда логин мен
// құпиясөздің ашық мәтіні емес, тек SHA-256 хэші сақталған.

const ADMIN_HASH = "0281e7608e148c038772a03ddc27c9c1b80cd95102de8c33a97f45c20a6fa1c0";

export const config = { matcher: "/:path*" };

export default async function middleware(request) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;
  const auth = request.headers.get("authorization") || "";

  if (auth.startsWith("Basic ")) {
    try {
      const bytes = Uint8Array.from(atob(auth.slice(6)), (c) => c.charCodeAt(0));
      const decoded = new TextDecoder().decode(bytes);
      const i = decoded.indexOf(":");
      if (user && pass) {
        if (decoded.slice(0, i) === user && decoded.slice(i + 1) === pass) return; // рұқсат
      } else {
        const buf = await crypto.subtle.digest("SHA-256", bytes);
        const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
        if (hex === ADMIN_HASH) return; // рұқсат: сайт ашылады
      }
    } catch (e) {}
  }

  return new Response(
    "<!doctype html><meta charset=utf-8><title>Bilim Hub</title><body style='font-family:sans-serif;background:#06132e;color:#fff;display:grid;place-items:center;height:100vh;margin:0'><div style='text-align:center'><h2>🔒 Бұл бет тек әкімшіге арналған</h2><p>Кіру үшін логин мен құпиясөзді енгізіңіз.</p></div>",
    {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Bilim Hub admin", charset="UTF-8"',
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    }
  );
}
