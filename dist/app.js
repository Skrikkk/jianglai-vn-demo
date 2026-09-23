/* 小型姜崃漫游 H5 功能Demo · 260923 AMD#8 */
(() => {
  "use strict";

  const APP_VERSION = "260923 AMD#8";
  const STORAGE_KEY = "jianglai-vn-demo-player-v1";
  const LOG_KEY = "jianglai-vn-demo-debug-log-v1";
  const ENDINGS = ["E1", "E2", "E3", "E4"];
  const SCENE_ART = {
    L: ["1.jpg", "卢卡"], C: ["2.jpg", "ChiChi"], S: ["3.jpg", "学生1"],
    R: ["4.jpg", "Richard"], A: ["5.jpg", "阿辽沙"], AN: ["6.jpg", "安欣"],
    E1: ["3.jpg", "学生1"], E2: ["4.jpg", "Richard"], E3: ["5.jpg", "阿辽沙"], E4: ["6.jpg", "安欣"],
    E5: ["7.jpg", "姜崃"],
  };
  const ENDING_INFO = {
    E1: { title: "外面的世界很宽广，很大！", text: "青春之火燃烧，年轻的心悸动。\n\n你是这样相信的，也因此逃离了。\n\n世界，你好啊！" },
    E2: { title: "大房间归我自己", text: "贪婪的占有，命运的合奏。\n\n恶劣迎来了对手，羁绊融化了自由。\n\n或许你也向往高墙外的天空？" },
    E3: { title: "明明是一颗天真的心从未爱过", text: "初生的神祇，对人世还一无所知。\n\n可心灵早已做出选择，怜悯如先知。\n\n牵众人的手，行你的路；\n我们承诺永不相忘。" },
    E4: { title: "头顶的天空没变过 依然透明", text: "再回去选一次，一切仍不会变。\n\n周遭颜色万千，你胆色如从前。\n\n做正义的事吧，结局已经注定：\n\n你一生平凡，你终身灿烂。" },
    E5: { title: "真正的世界", text: "花园在姜崃的身后消失，仿佛未曾存在过。\n\n就像每个平常的一天，姜崃回到自己的房间。\n\n关上窗，拖了地，做完了猫饭。\n把剧本和谱子放进包里。\n\n他把猫饭递给猫，“生日蛋糕，分你一块。”\n\n睡个好觉\n面朝世界\n成为自己" },
  };

  const STORY = {
    P1: {
      name: "初次前言",
      html: `
        <p>有些没有脚的东西，能比现实走得更远。</p>
        <p>我们称之为——孩子的幻想。</p>
        <p>幻想的光亮澄明，站在此刻就能看到将来。</p>
        <p>未曾遍历的远方，离散为分岔的小径；<br>把所有可能收集，就诞生了诗意的花园。</p>
        <p>一切开始前，我想给你讲一个传说。</p>
        <p><em>在世界上的某个地方，有一名总督辞去了高官厚禄，一心想要写一部伟大的小说。<br>他写了整整十三年，直到被一个不速之客刺杀。<br>它在纸面上落笔的那一刻，就成为了一座人造的、困难的花园。<br>小说没人发现，花园也无人问津。<br>这座花园里，时间永远分岔，通向无数的将来。</em></p>
        <p>从这里向前走，分岔的时间就开始了转动。</p>
        <p>那么，现在出发吗？</p>`,
    },
    L: {
      name: "卢卡",
      html: `<p>卢卡，好名字。</p><p>在成为天使以前，我只是一只白色小鸟。<br>脑仁不大，翅膀可以保温。<br>面对提问，总是招架不住。</p><p>想要成为怎样的人——真是复杂的问题。<br>想要度过怎样的一生——别让一只鸟回答这个。<br>其实我只关心，如果我成为一个人，我会有私人的神吗。</p><p>做人会让我获得什么？</p>`,
    },
    C: {
      name: "ChiChi",
      html: `<p>皮鞋、西装、父亲锃亮的手枪。</p><p>ChiChi Bochetti，黑手党家族教父的幼子。</p><p>……</p><p>ChiChi Bochetti，<del>黑手党家族教父的幼子。</del><br>令人闻风丧胆的大反派。</p><p>这是我为自己选择的身份。</p><p>胆小鬼拥有悲伤的结尾，<br>故事、戏剧，都这么写。</p><p>我的命运，没这么写。<br>陀思妥耶夫斯基摔掉了他的笔，我还没走到终点。</p><p>这一切都因为我捧着一颗花蕊一样珍贵的爱，并决定：</p>`,
    },
    S: {
      name: "学生1",
      html: `<p>知识是浩如烟海的渴望，是鲜艳欲滴的诅咒。<br>把人的面孔变得模糊，化开流逝的时间。</p><p>学生1就是学生1，没有别的姓名。</p><p>在教会学校念书时，我们得到善意无私的教导：</p><p>不<em>必</em>挂念外面的世界。<br>不<em>能</em>看向外面的世界。<br>不<strong>准</strong>肖想外面的世界。<br>不——</p>`,
    },
    R: {
      name: "Richard",
      html: () => `<p>把一只鸟捕进望远镜还不够。<br>把一只鸟输进大脑也不够。<br>把一只鸟做成标本还不够。</p><p>Richard意气风发，Richard心想事成。<br>Richard是哈佛法学院最有前途的新生。</p><p>世界是，一座樊笼。<br>我，戴着镣铐。</p><p>噢，我记得最开始我是一只 ${state.richardBird ? '<button class="interactive-word bird-action" data-action="bird">鸟</button>' : '鸟'}。</p><p>这时候，你要对我做什么？</p>`,
    },
    A: {
      name: "阿辽沙",
      html: `<p>拯救一个当街殴打潦倒老人的人，愿他真心为此忏悔。<br>拯救一个试图和魔鬼抗辩的人，愿他的内心得到宁静。<br>拯救一个未被世界善待的病人，愿他下世后重获幸福。<br>拯救一个向我要爱的人……</p><p>我，阿列克塞·卡拉马佐夫，能做的，只有伸出我的手。</p><p>如果我的双眼没有看见你，<br>如果我的心不能被纯洁的激情打动，<br>如果我不曾流泪、没有犯罪，或者觉得这世界和我没有关系……</p><p>我无法拯救你。我是在向你要一个回答。</p><p>我对于这世界来说，是什么？</p>`,
    },
    AN: {
      name: "安欣",
      html: `<p>我的脚踩在地面，我的手握住证据和战友。</p><p>这一切不是梦：<br>警察安欣，背负沉重的执念行走。<br>走得艰难，但还活着。</p><p>愿望简单，所求不多。<br>唯一怀念的是，<br>如果可以，请让我再一次站在这一刻：</p>`,
    },
    P2: {
      name: "二阶段前言",
      html: `<p>有些没有脚的东西，能比现实走得更远。</p><p>我们称之为——孩子的幻想。</p><p>幻想的光亮澄明，站在将来却看不清此刻。</p><p>走遍了分岔的小径，远方之外还有远方；<br>在诗意的花园中休息，抓住一些飞舞的尘埃。</p><p>一切开始后，我想再讲一遍这个传说。</p><p><em>在世界上的某个地方，有一名总督辞去了高官厚禄，一心想要写一部伟大的小说。<br>他写了整整十三年，直到被一个不速之客刺杀。<br>它在纸面上落笔的那一刻，就成为了一座人造的、困难的花园。<br>小说没人发现，花园也无人问津。<br>这座花园里，时间永远分岔，通向无数的将来。</em></p><p>而你，来到了这里。</p><p>这是小径分岔的花园，一个平平无奇的起点。<br>从这里向前走，永恒的岁月便发生了扰动。</p><p>那么，现在出发吗？</p>`,
    },
  };

  const NODE_NAMES = {
    menu: "主菜单", P1: "初次前言", L: "卢卡", C: "ChiChi", S: "学生1", R: "Richard", A: "阿辽沙", AN: "安欣", P2: "二阶段前言", TE_IDENTITY: "TE：身份选择", TE_ERASE: "TE：擦除互动", TE_EMPTY: "TE：没有别的选项", TE_LAST: "TE：还有最后一个", TE_YOU: "TE：最后选项", TE_FINAL: "TE：你成为你", E1: "结局1", E2: "结局2", E3: "结局3", E4: "结局4", E5: "真正的世界",
  };

  const app = document.querySelector("#app");
  let storageOK = true;
  let state = loadState();
  let debugOpen = false;
  let modal = null;
  let debugProfile = null;
  let debugLogs = loadLogs();
  let toastTimer = null;
  let erasePointer = null;
  let pageHistory = [];

  function blankState() {
    return {
      node: "menu",
      resumeNode: null,
      endings: [],
      richardBird: false,
      alyoshaFool: false,
      teChosen: [],
      erasure: 0,
      settings: { textSpeed: 100, music: 70, sound: 70 },
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...blankState(), ...(saved || {}), settings: { ...blankState().settings, ...(saved?.settings || {}) } };
    } catch (_) {
      storageOK = false;
      return blankState();
    }
  }

  function saveState() {
    if (debugProfile) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (_) { storageOK = false; }
  }

  function loadLogs() {
    try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; }
    catch (_) { return []; }
  }

  function saveLogs() {
    try { localStorage.setItem(LOG_KEY, JSON.stringify(debugLogs.slice(-80))); }
    catch (_) { /* Debug history is optional. */ }
  }

  function effectiveEndings() {
    return [...new Set([...(state.endings || []), ...(debugProfile?.endings || [])])];
  }

  function ordinaryEndingComplete() { return ENDINGS.every((id) => effectiveEndings().includes(id)); }
  function isEnding(node) { return Object.prototype.hasOwnProperty.call(ENDING_INFO, node); }
  function log(from, action, to, detail = "") {
    debugLogs.push({ time: new Date().toLocaleTimeString("zh-CN", { hour12: false }), from, action, to, detail });
    debugLogs = debugLogs.slice(-80);
    saveLogs();
  }

  function go(node, { action = "系统", recordEnding = true, remember = true } = {}) {
    const from = state.node;
    if (remember && from !== node) pageHistory.push(from);
    if (pageHistory.length > 40) pageHistory.shift();
    if (recordEnding && !debugProfile && isEnding(node) && !state.endings.includes(node)) state.endings.push(node);
    state.node = node;
    if (node === "menu" && from !== "menu") state.resumeNode = from;
    if (node !== "menu") state.resumeNode = null;
    if (node !== "R") state.richardBird = false;
    if (node !== "A") state.alyoshaFool = false;
    if (node !== "TE_IDENTITY") { state.teChosen = []; }
    if (node !== "TE_ERASE") state.erasure = 0;
    log(from, action, node);
    saveState();
    render();
  }

  async function beginExperience() {
    await requestLandscape();
    const target = ordinaryEndingComplete() ? "P2" : "P1";
    state.richardBird = false;
    state.alyoshaFool = false;
    go(target, { action: "开始体验" });
  }

  async function requestLandscape() {
    try {
      if (screen.orientation?.lock) await screen.orientation.lock("landscape");
    } catch (_) {
      showToast("浏览器未锁定横屏，请横向握持设备继续。");
    }
  }

  function choicesFor(node) {
    if (node === "P1") return [{ label: "出发吧", to: "L", id: "A01", primary: true }, { label: "我再想想", stay: true, id: "A02" }];
    if (node === "L") return [{ label: "优渥的生活", to: "C", id: "A03" }, { label: "大量的知识", to: "S", id: "A04" }];
    if (node === "C") return [{ label: "控制", to: "R", id: "A05" }, { label: "救赎", to: "A", id: "A06" }];
    if (node === "S") return [{ label: "不可丢弃外面的世界", to: "AN", id: "A07" }, { label: "不许小瞧外面的世界", to: "E1", id: "A08" }];
    if (node === "R") return [{ label: "让我在监狱里被关着吧", to: "E2", id: "A09" }, ...(state.richardBird ? [] : [{ label: "帮我离开", action: "arm-bird", id: "A10" }])];
    if (node === "A") return [{ label: "一个学生", to: "S", id: "A12" }, { label: state.alyoshaFool ? "一位愚者" : "一位智者", action: state.alyoshaFool ? "finish-fool" : "arm-fool", id: state.alyoshaFool ? "A14" : "A13" }];
    if (node === "AN") return [{ label: "十三岁那一天", to: "C", id: "A15" }, { label: "那个小鱼摊", to: "E4", id: "A16" }];
    if (node === "P2") return [{ label: "出发吧", to: "L", id: "B08", primary: true }, { label: "我再想想", stay: true, id: "B09" }, { label: "我想回去", to: "TE_IDENTITY", id: "B10" }];
    return [];
  }

  function selectChoice(id) {
    const choice = choicesFor(state.node).find((item) => item.id === id);
    if (!choice) return;
    if (choice.stay) {
      log(state.node, choice.label, state.node, "停留");
      showToast("你还停在这里。");
      return;
    }
    if (choice.action === "arm-bird") {
      state.richardBird = true;
      log("R", choice.label, "R", "鸟已激活");
      saveState(); render(); showToast("有一个词，似乎在等你。 ");
      return;
    }
    if (choice.action === "arm-fool") {
      state.alyoshaFool = true;
      log("A", choice.label, "A", "智者变为愚者");
      saveState(); render();
      return;
    }
    if (choice.action === "finish-fool") { go("E3", { action: choice.label }); return; }
    go(choice.to, { action: choice.label });
  }

  function render() {
    const node = state.node;
    app.innerHTML = `<div class="app-shell"><section class="game-stage" aria-label="小型姜崃漫游功能Demo">
      ${renderScreen(node)}
    </section></div>
    <aside class="rotate-guard"><div><p>本Demo按横屏16:9设计。请横向握持手机后继续；浏览器允许时可尝试锁定横屏。</p><button class="btn primary" data-action="landscape">尝试横屏</button></div></aside>
    ${debugOpen ? renderDebugDrawer() : ""}${modal ? renderModal() : ""}`;
    bindEvents();
  }

  function renderScreen(node) {
    if (node === "menu") return renderMenu();
    if (isEnding(node)) return renderEnding(node);
    if (node === "TE_IDENTITY") return renderIdentity();
    if (node === "TE_ERASE") return renderErase();
    if (node === "TE_EMPTY") return renderClickStage("没有别的选项了。", "继续", "TE_LAST");
    if (node === "TE_LAST") return renderClickStage("……还有最后一个。", "继续", "TE_YOU");
    if (node === "TE_YOU") return renderClickStage("1 - 你", "你", "TE_FINAL", "最后一个选项");
    if (node === "TE_FINAL") return renderClickStage("你的名字是：姜崃。<br><br><strong>你 成 为 你。</strong>", "继续", "E5");
    const story = STORY[node];
    if (!story) return renderClickStage("节点不存在。", "返回主菜单", "menu");
    const html = typeof story.html === "function" ? story.html() : story.html;
    const choices = choicesFor(node);
    return renderDialoguePage({
      speaker: speakerFor(node),
      content: html,
      controls: choices.map((choice) => `<button class="choice ${choice.primary ? "primary" : ""}" data-choice="${choice.id}">${escapeHtml(choice.label)}</button>`).join(""),
      note: node === "R" && state.richardBird ? "“帮我离开”已经消失。" : node === "A" && state.alyoshaFool ? "称谓已经改变。" : "",
    });
  }

  function renderMenu() {
    const endings = effectiveEndings();
    const marks = ENDINGS.map((id) => endings.includes(id) ? "◆" : "◇").join(" ");
    return `<div class="menu-screen"><section class="menu-cover"><span class="node-label menu-node-label">主菜单</span><p class="menu-kicker">Forking Paths To The Future</p><h1 class="menu-title">小型姜崃漫游</h1><p class="menu-subtitle">循着分岔的小径，翻开这一页。</p><div class="menu-actions">
      <button class="btn primary" data-action="start">${ordinaryEndingComplete() ? "再次出发" : "开始漫游"}</button>
      ${state.resumeNode && !debugProfile ? '<button class="btn" data-action="continue">继续阅读</button>' : ""}
      <button class="btn" data-action="endings">结局回看</button><button class="btn" data-action="settings">设置</button><button class="btn debug-toggle" data-action="debug">调试</button>
    </div><p class="progress-line">结局收集 <span class="progress-mark">${marks}</span>　${endings.filter((id) => ENDINGS.includes(id)).length}/4</p>
    ${ordinaryEndingComplete() ? '<p class="demo-note">二阶段前言已解锁。</p>' : '<p class="demo-note">收集四个普通结局后，前言会发生变化。</p>'}
    ${debugProfile ? `<p class="demo-note">调试档：${escapeHtml(debugProfile.label)}（不会写入玩家进度）</p>` : ""}</section></div>`;
  }

  function renderEnding(id) {
    const ending = ENDING_INFO[id];
    return renderDialoguePage({
      speaker: id === "E5" ? "旁白" : "后日谈",
      content: `<p class="ending-number">${id === "E5" ? "TRUE END" : `ENDING ${id.slice(1)}`}</p><h1 class="ending-title">${escapeHtml(ending.title)}</h1>${paragraphs(ending.text)}`,
      controls: '<button class="choice primary" data-action="return-menu">返回主菜单</button>',
      note: id !== "E5" ? "本结局已记录。" : "真正的世界。",
    });
  }

  function renderIdentity() {
    const items = [["luca", "卢卡", "天真是轻盈的"], ["chichi", "ChiChi", "爱恨是杂陈的"], ["student", "学生1", "年轻是痛苦的"], ["richard", "Richard", "骄矜是狂喜的"], ["alyosha", "阿辽沙", "怜悯是酸楚的"], ["anxin", "安欣", "信仰是沉郁的"]];
    return renderDialoguePage({
      speaker: "旁白",
      content: `<p>找到了真正世界的入口，才算穿过了这座可能性的花园。</p><p>离开这里后，幻想的魔力就要消失了。</p><p>结束前的最后一个问题是——</p><p><strong>你最想要成为谁？</strong></p>`,
      controls: `<div class="identity-grid">${items.map(([id, name, changed]) => `<button class="identity ${state.teChosen.includes(id) ? "changed" : ""}" data-identity="${id}" ${state.teChosen.includes(id) ? "disabled" : ""}>${state.teChosen.includes(id) ? changed : name}</button>`).join("")}</div>${state.teChosen.length ? `<p class="identity-complete">${state.teChosen.length}/6</p>` : ""}`,
      note: "每一个身份都需要被看见。",
    });
  }

  function renderErase() {
    const progress = Math.round(state.erasure);
    return renderDialoguePage({
      speaker: "旁白",
      content: "<p>那些名字已经说完了。</p><p>现在，请把它们从这里擦去。</p>",
      controls: `<div class="erase-area"><div class="erase-pad" data-erase aria-label="按住并拖动以擦除身份">卢卡　ChiChi　学生1　Richard　阿辽沙　安欣</div><div class="erase-progress"><span>擦除进度</span><span>${progress}% / 60%</span></div><div class="erase-meter"><span style="width:${Math.min(progress, 100)}%"></span></div><p><button class="btn small" data-action="erase-fallback">无法拖动？直接继续</button></p></div>`,
      note: "按住文字区域拖动即可完成；达到60%会自动继续。",
    });
  }

  function renderClickStage(copy, button, next, title = "") {
    return renderDialoguePage({ speaker: title || "旁白", content: copy.startsWith("<") ? copy : `<p>${copy}</p>`, controls: `<button class="choice primary" data-next="${next}">${escapeHtml(button)}</button>` });
  }

  function renderDialoguePage({ speaker, content, controls = "", note = "" }) {
    const art = SCENE_ART[state.node];
    const image = art
      ? `<img class="scene-art" src="assets/scenes/${art[0]}" alt="${escapeHtml(art[1])}的剧情插画${art[0] === "3.jpg" ? "" : "草稿"}" />`
      : `<div class="scene-placeholder" aria-hidden="true"><span>小径分岔的花园</span></div>`;
    return `<div class="play-area book-view"><nav class="book-rail" aria-label="游戏操作"><span class="rail-mark" aria-hidden="true">✧</span>
      <button class="rail-button" data-action="menu" aria-label="主菜单" title="主菜单">☰</button>
      <button class="rail-button" data-action="settings" aria-label="设置" title="设置">⚙</button>
      <button class="rail-button" data-action="endings" aria-label="结局回看" title="结局回看">◇</button>
      <button class="rail-button" data-action="back" aria-label="返回上一剧情页" title="返回上一剧情页" ${pageHistory.length ? "" : "disabled"}>↶</button>
      <button class="rail-button debug-toggle" data-action="debug" aria-label="调试" title="调试">⌘</button>
      <span class="node-label">${escapeHtml(NODE_NAMES[state.node] || state.node)}</span></nav>
      <div class="book-spread"><div class="book-page illustration-page">${image}</div>
      <section class="book-page text-page" aria-label="剧情与选项"><header class="page-heading"><span class="speaker-tag">${escapeHtml(speaker)}</span><span class="page-rule" aria-hidden="true">✧</span></header>
      <div class="dialogue-content story-copy">${content}</div><div class="dialogue-controls" aria-label="选项">${controls}</div><div class="choice-note">${note}</div></section></div></div>`;
  }

  function speakerFor(node) {
    return ({ P1: "旁白", P2: "旁白", L: "卢卡", C: "ChiChi", S: "学生1", R: "Richard", A: "阿辽沙", AN: "安欣" })[node] || "旁白";
  }

  function renderDebugDrawer() {
    const options = Object.entries(NODE_NAMES).map(([id, label]) => `<option value="${id}" ${state.node === id ? "selected" : ""}>${id}｜${escapeHtml(label)}</option>`).join("");
    const viewState = { node: state.node, playerEndings: state.endings, effectiveEndings: effectiveEndings(), richardBird: state.richardBird, alyoshaFool: state.alyoshaFool, teChosen: state.teChosen, erasure: Math.round(state.erasure), debugProfile: debugProfile?.label || null, storageOK };
    return `<aside class="drawer" aria-label="开发调试面板"><div class="drawer-header"><h2>开发调试</h2><button class="btn small" data-action="debug">关闭</button></div>
      <p class="status-warn">调试跳转和预设档不会写入玩家结局。当前运行的是同一套剧情播放器。</p>
      <section class="debug-section"><h3>跳到节点</h3><select class="debug-select" id="debug-node">${options}</select><p><button class="btn small" data-action="debug-jump">跳转（不记录结局）</button></p></section>
      <section class="debug-section"><h3>测试进度</h3><div class="debug-grid"><button class="debug-button" data-profile="new">新玩家</button><button class="debug-button" data-profile="missing-e4">只差结局4</button><button class="debug-button" data-profile="all">收齐普通结局</button><button class="debug-button" data-profile="te">TE进行中</button><button class="debug-button" data-action="debug-normal">恢复玩家档</button><button class="debug-button" data-action="reload-scene">重载当前场景</button></div></section>
      <section class="debug-section"><h3>当前状态</h3><pre class="state-box">${escapeHtml(JSON.stringify(viewState, null, 2))}</pre></section>
      <section class="debug-section"><h3>辅助</h3><div class="debug-grid"><button class="debug-button" data-action="show-hitboxes">显示点击区域</button><button class="debug-button" data-action="copy-log">复制路由日志</button><button class="debug-button" data-action="clear-log">清空日志</button><button class="debug-button" data-action="simulate-storage">模拟存档失败</button></div></section>
      <section class="debug-section"><h3>路由日志</h3><pre class="log-box">${escapeHtml(debugLogs.map((row) => `${row.time}  ${row.from} --[${row.action}]--> ${row.to}${row.detail ? ` (${row.detail})` : ""}`).join("\n") || "暂无操作")}</pre></section>
      <section class="debug-section"><h3>玩家数据</h3><button class="btn small danger" data-action="reset-player">重置全部玩家进度</button></section>
    </aside>`;
  }

  function renderModal() {
    if (modal === "endings") {
      const all = ["E1", "E2", "E3", "E4", "E5"];
      return `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-label="结局回看"><div class="modal-header"><h2>结局回看</h2><button class="btn small" data-action="close-modal">关闭</button></div><div class="ending-list">${all.map((id) => { const unlocked = effectiveEndings().includes(id); return `<div class="ending-row ${unlocked ? "" : "locked"}"><div><strong>${id}</strong>　${unlocked ? escapeHtml(ENDING_INFO[id].title) : "尚未解锁"}</div>${unlocked ? `<button class="btn small" data-ending-view="${id}">查看</button>` : ""}</div>`; }).join("")}</div></section></div>`;
    }
    if (modal === "settings") return `<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-label="设置"><div class="modal-header"><h2>设置</h2><button class="btn small" data-action="close-modal">关闭</button></div><p class="status-warn">本Demo没有音频素材；以下音量会保存，以便后续接入音乐和音效。</p>${rangeRow("文字速度", "textSpeed", state.settings.textSpeed)}${rangeRow("音乐音量", "music", state.settings.music)}${rangeRow("音效音量", "sound", state.settings.sound)}<div class="settings-row"><span>横屏</span><button class="btn small" data-action="landscape">尝试锁定横屏</button></div></section></div>`;
    return "";
  }

  function rangeRow(label, key, value) { return `<label class="settings-row"><span>${label}</span><input type="range" min="0" max="100" value="${value}" data-setting="${key}"><output>${value}</output></label>`; }

  function bindEvents() {
    app.querySelectorAll("[data-action]").forEach((element) => element.addEventListener("click", (event) => handleAction(event, element.dataset.action)));
    app.querySelectorAll("[data-choice]").forEach((element) => element.addEventListener("click", () => selectChoice(element.dataset.choice)));
    app.querySelectorAll("[data-next]").forEach((element) => element.addEventListener("click", () => go(element.dataset.next, { action: element.textContent.trim() })));
    app.querySelectorAll("[data-identity]").forEach((element) => element.addEventListener("click", () => chooseIdentity(element.dataset.identity)));
    app.querySelectorAll("[data-ending-view]").forEach((element) => element.addEventListener("click", (event) => { event.stopPropagation(); modal = null; go(element.dataset.endingView, { action: "结局回看", recordEnding: false }); }));
    app.querySelectorAll("[data-setting]").forEach((element) => element.addEventListener("input", () => { state.settings[element.dataset.setting] = Number(element.value); const out = element.closest("label").querySelector("output"); out.textContent = element.value; saveState(); }));
    const erase = app.querySelector("[data-erase]");
    if (erase) bindErase(erase);
  }

  function handleAction(event, action) {
    if (action === "close-modal" && event.target === event.currentTarget) { modal = null; render(); return; }
    if (action === "start") { beginExperience(); return; }
    if (action === "continue") { const target = state.resumeNode; if (target) { state.resumeNode = null; go(target, { action: "继续" }); } return; }
    if (action === "back") { const previous = pageHistory.pop(); if (previous) go(previous, { action: "返回上一剧情页", recordEnding: false, remember: false }); return; }
    if (action === "menu" || action === "return-menu") { modal = null; go("menu", { action: "返回主菜单", recordEnding: false, remember: false }); return; }
    if (action === "endings" || action === "settings") { modal = action; render(); return; }
    if (action === "close-modal") { modal = null; render(); return; }
    if (action === "debug") { debugOpen = !debugOpen; render(); return; }
    if (action === "landscape") { requestLandscape(); return; }
    if (action === "bird") { go("menu", { action: "鸟", recordEnding: false }); showToast("一切重新开始。收集进度被保留。"); return; }
    if (action === "erase-fallback") { go("TE_EMPTY", { action: "擦除替代完成" }); return; }
    if (action === "debug-jump") { const to = app.querySelector("#debug-node").value; pageHistory = []; go(to, { action: "调试跳转", recordEnding: false, remember: false }); return; }
    if (action === "debug-normal") { debugProfile = null; pageHistory = []; state = loadState(); log("调试", "恢复玩家档", state.node); render(); return; }
    if (action === "reload-scene") { log(state.node, "重载当前场景", state.node); render(); return; }
    if (action === "show-hitboxes") { document.querySelectorAll(".choice, .interactive-word, .identity, .erase-pad").forEach((el) => { el.style.outline = "2px dashed #ffdc76"; }); showToast("当前场景的交互区域已用黄线标出。"); return; }
    if (action === "copy-log") { copyLog(); return; }
    if (action === "clear-log") { debugLogs = []; saveLogs(); render(); return; }
    if (action === "simulate-storage") { storageOK = false; showToast("已模拟存档失败：本次仅保留在内存。刷新页面会恢复原档。 "); render(); return; }
    if (action === "reset-player") { if (window.confirm("确定重置所有玩家结局和当前进度吗？此操作不会影响调试日志。")) { debugProfile = null; pageHistory = []; state = blankState(); saveState(); log("玩家档", "重置全部进度", "menu"); render(); } return; }
  }

  function chooseIdentity(id) {
    if (state.teChosen.includes(id)) return;
    state.teChosen.push(id);
    log("TE_IDENTITY", id, "TE_IDENTITY", `${state.teChosen.length}/6`);
    if (state.teChosen.length === 6) { go("TE_ERASE", { action: "六项身份完成" }); return; }
    saveState(); render();
  }

  function bindErase(target) {
    target.addEventListener("pointerdown", (event) => { erasePointer = { x: event.clientX, y: event.clientY }; target.setPointerCapture?.(event.pointerId); event.preventDefault(); });
    target.addEventListener("pointermove", (event) => {
      if (!erasePointer) return;
      const distance = Math.hypot(event.clientX - erasePointer.x, event.clientY - erasePointer.y);
      erasePointer = { x: event.clientX, y: event.clientY };
      if (distance < 2) return;
      state.erasure = Math.min(100, state.erasure + distance * 0.33);
      if (state.erasure >= 60) { erasePointer = null; go("TE_EMPTY", { action: "擦除达到60%" }); return; }
      saveState(); render();
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach((name) => target.addEventListener(name, () => { erasePointer = null; }));
  }

  function applyProfile(profile) {
    const profiles = {
      new: { label: "新玩家", endings: [], node: "menu", teChosen: [] },
      "missing-e4": { label: "只差结局4", endings: ["E1", "E2", "E3"], node: "menu", teChosen: [] },
      all: { label: "收齐普通结局", endings: ["E1", "E2", "E3", "E4"], node: "menu", teChosen: [] },
      te: { label: "TE进行中", endings: ["E1", "E2", "E3", "E4"], node: "TE_IDENTITY", teChosen: ["luca", "chichi"] },
    };
    debugProfile = profiles[profile];
    pageHistory = [];
    state = { ...blankState(), node: debugProfile.node, teChosen: debugProfile.teChosen };
    log("调试", `载入预设：${debugProfile.label}`, state.node);
    render();
  }

  function copyLog() {
    const text = debugLogs.map((row) => `${row.time} ${row.from} --[${row.action}]--> ${row.to}${row.detail ? ` (${row.detail})` : ""}`).join("\n");
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => showToast("路由日志已复制。"), () => showToast("浏览器未允许复制。"));
    else showToast("浏览器未提供复制接口。可直接从日志框复制。 ");
  }

  function paragraphs(text) { return text.split("\n\n").map((piece) => `<p>${escapeHtml(piece).replace(/\n/g, "<br>")}</p>`).join(""); }
  function escapeHtml(text) { return String(text).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]); }
  function showToast(message) { const old = document.querySelector(".toast"); old?.remove(); const toast = document.createElement("div"); toast.className = "toast"; toast.textContent = message; document.body.append(toast); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.remove(), 2600); }

  document.addEventListener("click", (event) => {
    const profileButton = event.target.closest("[data-profile]");
    if (profileButton) applyProfile(profileButton.dataset.profile);
  });
  render();
})();
