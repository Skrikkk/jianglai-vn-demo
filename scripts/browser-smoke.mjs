/**
 * 无依赖浏览器冒烟测试。
 * 用 Chrome/Edge 的远程调试端口检查真实DOM操作能走完 E1—E5。
 * 启动浏览器示例：
 * chrome --headless --remote-debugging-port=9222 --user-data-dir=<临时目录> http://127.0.0.1:4173/
 */
const endpoint = process.env.CDP_ENDPOINT || "http://127.0.0.1:9222";
const pages = await fetch(`${endpoint}/json`).then((response) => response.json());
const page = pages.find((item) => item.type === "page");
if (!page?.webSocketDebuggerUrl) throw new Error("No debuggable browser page found.");

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
let nextId = 1;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); }
});

function command(method, params = {}) {
  const id = nextId++;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, (message) => message.error ? reject(new Error(message.error.message)) : resolve(message.result)));
}
async function evaluate(expression) {
  const result = await command("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
const wait = (milliseconds = 90) => new Promise((resolve) => setTimeout(resolve, milliseconds));
async function click(selector) {
  const exists = await evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`);
  if (!exists) throw new Error(`Missing control: ${selector}`);
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  await wait();
}
async function assertNode(expected) {
  const value = await evaluate("document.querySelector('.node-label')?.textContent?.trim() || ''");
  if (!value.includes(expected)) throw new Error(`Expected node '${expected}', got '${value}'.`);
}
async function choose(id) { await click(`[data-choice="${id}"]`); }

await evaluate("localStorage.removeItem('jianglai-vn-demo-player-v1'); location.reload()");
await wait(250);
await assertNode("主菜单");

// Richard's hidden bird remains an interaction, not an ordinary ending.
await click('[data-action="start"]'); await choose("A01"); await choose("A03"); await choose("A05"); await choose("A10");
if (!await evaluate("Boolean(document.querySelector('[data-action=\"bird\"]'))")) throw new Error("Bird interaction was not activated.");
await click('[data-action="bird"]'); await assertNode("主菜单");
const afterBird = await evaluate("JSON.parse(localStorage.getItem('jianglai-vn-demo-player-v1')).endings");
if (afterBird.length !== 0) throw new Error("Bird path incorrectly recorded an ending.");

// E1: P1 → L → S → E1
await click('[data-action="start"]'); await assertNode("初次前言");
if (await evaluate("Boolean(document.fullscreenElement)")) throw new Error("Starting the game unexpectedly entered fullscreen.");
if (await evaluate("document.querySelector('.speaker-tag')?.textContent?.trim()") !== "旁白") throw new Error("Opening narration does not show the expected speaker tag.");
await choose("A01");
if (await evaluate("document.querySelector('.speaker-tag')?.textContent?.trim()") !== "卢卡") throw new Error("Luka does not show in the dialogue speaker tag.");
await choose("A04"); await choose("A08"); await assertNode("结局1");
if (await evaluate("document.querySelector('.speaker-tag')?.textContent?.trim()") !== "后日谈") throw new Error("Ending does not use the shared dialogue box speaker tag.");
await click('[data-action="return-menu"]');

// E2: P1 → L → C → R → E2
await click('[data-action="start"]'); await choose("A01"); await choose("A03"); await choose("A05"); await choose("A09"); await assertNode("结局2"); await click('[data-action="return-menu"]');

// E3: P1 → L → C → A → 智者 → 愚者 → E3
await click('[data-action="start"]'); await choose("A01"); await choose("A03"); await choose("A06"); await choose("A13");
if (await evaluate("document.querySelector('[data-choice=\"A14\"]')?.textContent") !== "一位愚者") throw new Error("Wisdom-to-fool interaction did not transform.");
await choose("A14"); await assertNode("结局3"); await click('[data-action="return-menu"]');

// E4: P1 → L → S → 安欣 → E4
await click('[data-action="start"]'); await choose("A01"); await choose("A04"); await choose("A07"); await choose("A16"); await assertNode("结局4"); await click('[data-action="return-menu"]');

// Full collection now uses the second prologue and completes TE.
await click('[data-action="start"]'); await assertNode("二阶段前言"); await choose("B10"); await assertNode("身份选择");
if (await evaluate("document.querySelector('.speaker-tag')?.textContent?.trim()") !== "旁白") throw new Error("TE does not use the shared dialogue box speaker tag.");
for (const id of ["luca", "chichi", "student", "richard", "alyosha", "anxin"]) await click(`[data-identity="${id}"]`);
await assertNode("擦除互动");
await evaluate(`(() => { const pad = document.querySelector('[data-erase]'); pad.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1, clientX: 10, clientY: 10 })); pad.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerId: 1, clientX: 300, clientY: 10 })); })()`);
await wait(); await assertNode("没有别的选项"); await click('[data-next="TE_LAST"]'); await click('[data-next="TE_YOU"]'); await click('[data-next="TE_FINAL"]'); await click('[data-next="E5"]'); await assertNode("真正的世界");

const outcomes = await evaluate("JSON.parse(localStorage.getItem('jianglai-vn-demo-player-v1')).endings.sort()");
if (JSON.stringify(outcomes) !== JSON.stringify(["E1", "E2", "E3", "E4", "E5"])) throw new Error(`Unexpected ending collection: ${JSON.stringify(outcomes)}`);

// The debug profile must be isolated from the player save.
await click('[data-action="debug"]'); await click('[data-profile="te"]'); await assertNode("身份选择");
await click('[data-action="debug-normal"]'); await assertNode("真正的世界");

console.log("PASS: bird, four normal endings, TE drag interaction, persistence, and isolated debug profile all work in the browser.");
socket.close();
