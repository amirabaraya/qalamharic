import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { writeFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const browserPaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
];
const baseUrl = process.env.SCREENSHOT_BASE_URL ?? "http://localhost:3000";
const outDir = path.join(process.cwd(), "public", "readme");
const port = 9223;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getJson(url, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {
      // Chrome may still be opening.
    }
    await wait(250);
  }
  throw new Error(`Could not read ${url}`);
}

async function connectDebugger() {
  await getJson(`http://127.0.0.1:${port}/json/version`);
  const targets = await getJson(`http://127.0.0.1:${port}/json/list`);
  const page = targets.find((target) => target.type === "page" && target.webSocketDebuggerUrl);
  if (!page) throw new Error("No Chrome page target was available for screenshots.");

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });

  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", async (event) => {
    const raw = typeof event.data === "string" ? event.data : await event.data.text();
    const data = JSON.parse(raw);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(new Error(data.error.message));
      else resolve(data.result);
    }
  });

  function send(method, params = {}) {
    id += 1;
    ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  }

  return { ws, send };
}

async function navigate(send, url) {
  await send("Page.navigate", { url });
  await wait(1800);
}

async function screenshot(send, name) {
  await wait(600);
  const result = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(path.join(outDir, `${name}.png`), Buffer.from(result.data, "base64"));
}

async function evaluate(send, expression) {
  return send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const profileDir = path.join(os.tmpdir(), `fidelamharic-readme-${Date.now()}`);
  const browserPath = browserPaths.find(Boolean);
  const chrome = spawn(browserPath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "--remote-allow-origins=*",
    "--headless=new",
    "--disable-gpu",
    "--disable-breakpad",
    "--disable-crash-reporter",
    "--disable-extensions",
    "--hide-scrollbars",
    "--no-default-browser-check",
    "--no-first-run",
    "--window-size=1440,980",
    "about:blank"
  ], { stdio: "ignore" });

  try {
    const { ws, send } = await connectDebugger();
    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 980,
      deviceScaleFactor: 1,
      mobile: false
    });

    await navigate(send, `${baseUrl}/`);
    await screenshot(send, "landing");

    const stamp = Date.now();
    const email = `readme-shot-${stamp}@example.com`;
    const password = "password123";
    await navigate(send, `${baseUrl}/login`);
    await evaluate(send, `
      (async () => {
        await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Portfolio Learner', email: '${email}', password: '${password}' })
        });
        const csrf = await fetch('/api/auth/csrf').then((res) => res.json());
        const body = new URLSearchParams({
          csrfToken: csrf.csrfToken,
          email: '${email}',
          password: '${password}',
          redirect: 'false',
          json: 'true'
        });
        await fetch('/api/auth/callback/credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body
        });
        return true;
      })()
    `);

    const pages = [
      ["dashboard", "/dashboard"],
      ["course-map", "/course"],
      ["lesson", "/lesson?lesson=meet-fidel"],
      ["practice", "/practice"],
      ["profile", "/profile"]
    ];

    for (const [name, route] of pages) {
      await navigate(send, `${baseUrl}${route}`);
      await screenshot(send, name);
    }

    ws.close();
  } finally {
    chrome.kill();
    await wait(500);
    await rm(profileDir, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
