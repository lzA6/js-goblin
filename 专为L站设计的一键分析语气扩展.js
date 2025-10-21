// ==UserScript==
// @name         Goblin.tools 助手 v4.2 (功能回归版)
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  终极修正版！恢复并稳定显示帖子旁的奥特曼分析按钮和可拖拽的悬浮球。支持手动精准分析和一键批量分析/关闭。
// @author       Your AI Assistant
// @match        https://linux.do/*
// @icon         https://raw.githubusercontent.com/Tiamat-KIT/ultraman-icon/main/ultraman-icon.svg
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      goblin.tools
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. SVG 图标 ---
    const ICONS = {
        ultraman: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 10C35 15 25 30 25 50C25 70 35 85 50 90C65 85 75 70 75 50C75 30 65 15 50 10Z" fill="white"/><path d="M50 10C50 10 50 35 50 50C50 65 50 90 50 90M50 10C35 15 25 30 25 50C25 70 35 85 50 90M50 10C65 15 75 30 75 50C75 70 65 85 50 90" stroke="#333" stroke-width="4"/><path d="M40 50C40 55.5228 44.4772 60 50 60C55.5228 60 60 55.5228 60 50C60 44.4772 55.5228 40 50 40C44.4772 40 40 44.4772 40 50Z" fill="#42A5F5"/></svg>`,
        refresh: `<svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>`,
        copy: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 12.5 2h-9ZM3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-9Z"/><path d="M.5 0A.5.5 0 0 0 0 .5v9a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 0-1h-2v-9h9v2a.5.5 0 0 0 1 0v-2A.5.5 0 0 0 10.5 0h-10Z"/></svg>`,
        close: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>`,
        ai_fallback: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="ai-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8e2de2;stop-opacity:1" /><stop offset="100%" style="stop-color:#4a00e0;stop-opacity:1" /></linearGradient></defs><path d="M50,90 C27.9,90 10,72.1 10,50 C10,27.9 27.9,10 50,10 C72.1,10 90,27.9 90,50 C90,62.3 84,73.3 75,80.6 M50,90 C59.7,82.4 65,70 65,56.5 C65,38.6 50,24 50,24 M50,90 C40.3,82.4 35,70 35,56.5 C35,38.6 50,24 50,24" stroke="url(#ai-grad)" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="60" cy="60" r="12" fill="none" stroke="#ffffff" stroke-width="5"/><line x1="68" y1="68" x2="75" y2="75" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/></svg>`
    };

    // --- 2. 样式定义 ---
    GM_addStyle(`
        .goblin-post-button { background: linear-gradient(145deg, #2c2c2c, #ffffff 50%, #ffab00); border: 1px solid rgba(0,0,0,0.2); width: 28px; height: 28px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .goblin-post-button:hover { transform: scale(1.1); box-shadow: 0 3px 8px rgba(0,0,0,0.2); }
        .goblin-post-button svg { width: 100%; height: 100%; }
        .goblin-results-wrapper { margin-top: 15px; padding: 10px; border-top: 2px solid #e9e9e9; display: flex; flex-direction: column; gap: 15px; }
        .goblin-result-card { border-radius: 8px; border: 1px solid #ddd; overflow: hidden; }
        .goblin-card-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; font-weight: bold; font-size: 13px; }
        .goblin-card-content { padding: 12px; font-size: 14px; line-height: 1.7; white-space: pre-wrap; word-wrap: break-word; max-height: 60vh; overflow-y: auto; }
        .goblin-card-content.loading { color: #888; font-style: italic; }
        .goblin-card-toolbar button { background: none; border: none; cursor: pointer; opacity: 0.6; margin-left: 8px; padding: 2px; }
        .goblin-card-toolbar button:hover { opacity: 1; }
        .goblin-card-toolbar svg { width: 14px; height: 14px; vertical-align: middle; }
        .goblin-result-card[data-model="JudgeTone"] { background-color: #e7f3ff; border-color: #b3d7ff; }
        .goblin-result-card[data-model="JudgeTone"] .goblin-card-header { background-color: #d0e8ff; color: #00529B; }
        .goblin-result-card[data-model="SuggestResponse"] { background-color: #fff9e6; border-color: #ffecb3; }
        .goblin-result-card[data-model="SuggestResponse"] .goblin-card-header { background-color: #ffe48d; color: #665200; }
        .goblin-result-card[data-model="SuggestResponse"] .goblin-card-content { font-weight: bold; }
        #goblin-fab-container { position: fixed; bottom: 40px; right: 40px; z-index: 9998; }
        #goblin-fab-button { width: 52px; height: 52px; border-radius: 50%; background-color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: grab; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
        #goblin-fab-button:hover { transform: scale(1.05); }
        #goblin-fab-button img, #goblin-fab-button svg { width: 32px; height: 32px; border-radius: 4px; pointer-events: none; }
        #goblin-fab-menu { position: absolute; bottom: 65px; right: 0; background-color: white; border-radius: 8px; box-shadow: 0 6px 16px rgba(0,0,0,0.2); padding: 8px; display: flex; flex-direction: column; gap: 8px; z-index: 9999; visibility: hidden; opacity: 0; transform: translateY(10px); transition: visibility 0.2s, opacity 0.2s, transform 0.2s; }
        #goblin-fab-menu.visible { visibility: visible; opacity: 1; transform: translateY(0); }
        .goblin-fab-menu-button { background-color: #f0f0f0; border: 1px solid #ddd; color: #333; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 14px; text-align: center; white-space: nowrap; }
        .goblin-fab-menu-button:hover { background-color: #e5e5e5; }
        #goblin-fab-menu-close { position: absolute; top: -5px; right: -5px; width: 20px; height: 20px; background: #333; color: white; border-radius: 50%; border: none; font-size: 12px; line-height: 20px; text-align: center; cursor: pointer; }
    `);

    // --- 3. 核心 API 请求函数 ---
    function callGoblinAPI(textToAnalyze, model, callback) {
        const urls = { JudgeTone: "https://goblin.tools/api/ToneJudger/JudgeTone", SuggestResponse: "https://goblin.tools/api/ToneJudger/SuggestResponse" };
        GM_xmlhttpRequest({
            method: "POST", url: urls[model],
            headers: { "Content-Type": "application/json", "Accept": "*/*", "Origin": "https://goblin.tools", "Referer": "https://goblin.tools/Judge", "Cookie": "gt_lang=zh-CN", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" },
            data: JSON.stringify({ "Texts": [textToAnalyze] }),
            onload: res => callback(res.status >= 200 && res.status < 300 ? res.responseText : `请求失败: ${res.status}`),
            onerror: res => callback(`网络错误: ${res.statusText || '无法连接'}`)
        });
    }

    // --- 4. UI 创建与管理 ---
    function createResultCard(post, model, title) {
        const card = document.createElement('div'); card.className = 'goblin-result-card'; card.dataset.model = model;
        card.innerHTML = `<div class="goblin-card-header"><span>${title}</span><div class="goblin-card-toolbar"><button class="goblin-refresh-btn" title="刷新">${ICONS.refresh}</button><button class="goblin-copy-btn" title="复制">${ICONS.copy}</button><button class="goblin-close-btn" title="关闭">${ICONS.close}</button></div></div><div class="goblin-card-content loading">正在分析中...</div>`;
        const contentDiv = card.querySelector('.goblin-card-content');
        const analyze = () => {
            contentDiv.textContent = '正在分析中...'; contentDiv.classList.add('loading');
            const postContent = post.querySelector('.cooked')?.innerText.trim();
            if (!postContent) { contentDiv.textContent = '错误：无法获取到帖子内容。'; contentDiv.classList.remove('loading'); return; }
            callGoblinAPI(postContent, model, (result) => { contentDiv.textContent = result; contentDiv.classList.remove('loading'); });
        };
        card.querySelector('.goblin-refresh-btn').addEventListener('click', analyze);
        card.querySelector('.goblin-copy-btn').addEventListener('click', () => { GM_setClipboard(contentDiv.textContent); });
        card.querySelector('.goblin-close-btn').addEventListener('click', () => {
            card.remove();
            const wrapper = post.querySelector('.goblin-results-wrapper');
            if (wrapper && wrapper.childElementCount === 0) wrapper.remove();
        });
        analyze(); return card;
    }
    function onMainButtonClick(e) {
        const button = e.currentTarget; const post = button.closest('article.boxed'); if (!post) return;
        let resultsWrapper = post.querySelector('.goblin-results-wrapper');
        if (!resultsWrapper) {
            resultsWrapper = document.createElement('div'); resultsWrapper.className = 'goblin-results-wrapper';
            const contentsDiv = post.querySelector('.post__contents');
            if (contentsDiv) contentsDiv.insertAdjacentElement('afterend', resultsWrapper); else post.appendChild(resultsWrapper);
        }
        if (!resultsWrapper.querySelector('[data-model="JudgeTone"]')) resultsWrapper.appendChild(createResultCard(post, 'JudgeTone', '语气评判'));
        if (!resultsWrapper.querySelector('[data-model="SuggestResponse"]')) resultsWrapper.appendChild(createResultCard(post, 'SuggestResponse', '建议回应'));
    }

    // --- 5. 悬浮球 (FAB) 逻辑 ---
    function createFAB() {
        const getFaviconUrl = () => {
            const iconLink = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
            return iconLink ? iconLink.href : '';
        };
        const fallbackIconDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(ICONS.ai_fallback)}`;

        const fabContainer = document.createElement('div'); fabContainer.id = 'goblin-fab-container';
        fabContainer.innerHTML = `<div id="goblin-fab-menu"><button id="goblin-fab-menu-close">&times;</button><button class="goblin-fab-menu-button" data-action="analyze-all">一键分析本页</button><button class="goblin-fab-menu-button" data-action="close-all">一键关闭所有</button></div><div id="goblin-fab-button" title="Goblin.tools 助手"><span id="goblin-fab-icon-wrapper"></span></div>`;
        document.body.appendChild(fabContainer);

        const fabIconWrapper = document.getElementById('goblin-fab-icon-wrapper');
        const faviconUrl = getFaviconUrl();
        if (faviconUrl) {
            const img = document.createElement('img');
            img.src = faviconUrl;
            img.onerror = () => { fabIconWrapper.innerHTML = ICONS.ai_fallback; };
            fabIconWrapper.appendChild(img);
        } else {
            fabIconWrapper.innerHTML = ICONS.ai_fallback;
        }

        const fabButton = document.getElementById('goblin-fab-button');
        const fabMenu = document.getElementById('goblin-fab-menu');

        fabButton.addEventListener('click', () => fabMenu.classList.toggle('visible'));
        document.getElementById('goblin-fab-menu-close').addEventListener('click', () => fabMenu.classList.remove('visible'));

        fabMenu.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action === 'analyze-all') {
                document.querySelectorAll('article.boxed').forEach(post => {
                    if (!post.querySelector('.goblin-results-wrapper')) {
                        post.querySelector('.goblin-post-button')?.click();
                    }
                });
                fabMenu.classList.remove('visible');
            } else if (action === 'close-all') {
                document.querySelectorAll('.goblin-results-wrapper').forEach(wrapper => wrapper.remove());
                fabMenu.classList.remove('visible');
            }
        });

        // 添加拖拽功能
        makeDraggable(fabContainer, fabButton);
    }

    // 拖拽功能实现
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = function(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        };
        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // --- 6. 页面扫描与按钮注入 ---
    function processPost(post) {
        if (post.dataset.goblinProcessed) return;
        post.dataset.goblinProcessed = 'true';

        const controls = post.querySelector('nav.post-controls .actions');
        if (!controls) return;

        const mainButton = document.createElement('button');
        mainButton.className = 'goblin-post-button';
        mainButton.title = '使用 Goblin.tools 进行 AI 分析';
        mainButton.innerHTML = ICONS.ultraman;

        mainButton.addEventListener('click', onMainButtonClick);

        const replyButton = controls.querySelector('.reply');
        if (replyButton) {
            replyButton.parentNode.insertBefore(mainButton, replyButton);
        } else {
            controls.appendChild(mainButton);
        }
    }

    function scanPage() {
        document.querySelectorAll('article.boxed').forEach(processPost);
    }

    // --- 7. 初始化与执行 ---
    function initialize() {
        scanPage(); // 首次加载时扫描
        createFAB(); // 创建悬浮球

        // 使用 MutationObserver 监听动态加载的帖子
        const observer = new MutationObserver(() => scanPage());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 延迟执行，确保页面元素加载完毕
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
