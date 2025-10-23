// ==UserScript==
// @name         LinuxDo 超级分析助手 v19.6 (Deno 功能集成版)
// @namespace    http://tampermonkey.net/
// @version      19.6
// @description  新增了从 aianswergenerator-2api (Deno) 项目移植的 AI 生成答案功能，并为其添加了专属UI卡片、上下文支持和伪流式响应效果，同时完美适配深色/浅色主题。
// @author       Your AI Assistant & BiFangKNT
// @match        https://linux.do/*
// @icon         https://cdn.linux.do/uploads/default/optimized/3X/6/f/6f47356b54ada865485956b15a311c05b8f78a75_2_32x32.png
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @connect      goblin.tools
// @connect      dreaminterpreter.ai
// @connect      pjfuothbq9.execute-api.us-east-1.amazonaws.com
// @connect      www.mymap.ai
// @connect      api.decopy.ai
// @connect      thinkany.ai
// @connect      eyedance.net
// @connect      text.pollinations.ai
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置项 ---
    // [自动填充] 从 thinkany-2api 项目 .env 文件中提取的凭证
    const THINKANY_COOKIE = "NEXT_LOCALE=zh; cf_clearance=kV21zX2B7D46SAdA7xahQu0JjbTKY8MtHw3i_MUsdnw-1760888616-1.2.1.1-IXUjQqM0dc8FQW7UhGeQAhT29wyhu4Cq3jPTugyC2_4axJpdCjle7gS0bnEIYwzURta_sFGkcY4tVj7vRS_1vfStNXoh9Nj0PG_fmGlQYqlUueM_jUj4I9Y94jhMEucjzB.MutKg2TFGt7ucIYdL3r6Ay1DVNo__1f.ZWN6oyzjISlrJl712P9YZpBeBdGHbbund0CffNshh7T9efhqBBY6iceHIDEHQ8hxlmzvf50Q; __Host-authjs.csrf-token=edddff18840b5634a841ce61071f35d6cb6103c923f5eae82dc9977c2b55a45d%7C9de96d4353d1e7a24e065b10c81bfeb08e711d62042358aef91698a0b14a33b7; _ga=GA1.1.1833108751.1760888618; g_state={\"i_l\":0,\"i_ll\":1760888619014}; __Secure-authjs.callback-url=https%3A%2F%2Fthinkany.ai%2Fzh; __Secure-authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiV20tem9xUkM5VmRrZTRzcUs0STR4QzE2VXp4OXBDVHUyU2diaWtqdUI1eHZJS1BsRkRyOS1oYnQyYmZ6QVRRUzAwNDZHTXRBTy1NVmplSVVmaTZJYncifQ..nPe6ln2dZEwna9s1siQN4A.wTjJkxbzyfLtGYWFQRbKgPMvw_z1b02zwkEKcXiW91OrBRuJcgpefEeOI1D5GtrCTe5Kt__6mqK6D0xb1l5ty4fCA6U8f5Vojezz44zTR59nQM6YtpiYLmLdKWOBSXPOSOzZa3DV4WTCeDoRtrwC41dVYBcYAqzwNb2RfANxszuGsJsHeYDU7b743fL3AMJ1rzbN1nISYZW1ReBKcqvAf5zqa-BlEiuVGUkRlLl4qhsD4oLCdhR-4-_ldE-7rBxS9gfbT7K-RCbkpWoL0lq3jgdH_ljOpT3TsHrgFg-cjuYPw6z3xBB9cWbe8F6mFH0DIrl1TCSIVfpkYUIpxhzwOsMDUkcNUm2JAzEN9DdGkjz8tdfOQiUp6lwzaOqQprIQT8XeTis3iM-SSE3MqtulXiFovm2bqG0_InJqkl23LhdzqOpZJZqxVZ4EhmPfIKOu6Wg0h23sVcoi6MzVE_Vmybs4SKg22F3usBEYyOeyvbqbuUBqYJChlByg4_mULvJw8H7cH8f5VDMxEwy5-pPNyd8odT_qJZdX5lNnwj-AFiMM8R_-7xr9WDao3LhNkijW4WAyb4pw2Sv_NFmMuDZLrkXO_iZVZbED4hgmIsy5IKKhbDEXnLHLlS0bJ4ofqVyN.ICtpZfE96UIqt1vdIGxf1v6ZfevCWq9b26H2bML9Bxg; _ga_MEVJ0WH73J=GS2.1.s1760888618$$o1$$g1$$t1760890003$$j60$$l0$$h0";

    const USER_DREAM_COOKIE = '_gid=GA1.2.97987403.1760801156; _ga_NLE2X95C95=GS2.1.s1760801545$o1$g1$t1760801631$j42$l0$h0; _ga_BGQYNX5K42=GS2.1.s1760801155$o1$g1$t1760801645$j27$l0$h0; _ga=GA1.2.583687601.1760801155';
    const DECOPY_PRODUCT_CODE = "067003";
    const DECOPY_PRODUCT_SERIAL = "eb0f5222701cbd6e67799c0cb99ec32b";
    const GEOMETRY_STORAGE_KEY = 'topicTreeWindowGeometry_v1';
    const VIEW_STATE_STORAGE_KEY = 'topicTreeView_v1';
    const WINDOW_STATE_STORAGE_KEY = 'topicTreeWindowState_v1';
    const THEME_STORAGE_KEY = 'superAnalyzerTheme_v1';

    // --- 2. 样式定义 ---
    GM_addStyle(`
        /* 全局拖动时禁用文本选择 */
        body.dragging-no-select { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }

        /* 帖子跳转时的高亮效果 */
        .post-highlight-temp {
            box-shadow: 0 0 12px 4px #f0ad4e !important;
            transition: box-shadow 0.3s ease-in-out;
        }

        /* 回复栏旁边的分析按钮 */
        .control-analyze-btn {
            background: rgba(255, 255, 255, 0.8); border: 1px solid #e9e9e9; width: 28px; height: 28px;
            border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;
            padding: 5px; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05); margin-left: 5px;
        }
        .control-analyze-btn:hover { transform: scale(1.1); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .control-analyze-btn img { width: 100%; height: 100%; border-radius: 3px; }

        /* 结果区域与卡片 */
        .goblin-results-wrapper { margin-top: 15px; padding: 10px; border-top: 2px solid #e9e9e9; display: flex; flex-direction: column; gap: 15px; }
        .goblin-card-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; font-weight: bold; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.5); }
        .goblin-card-content { padding: 12px; font-size: 14px; line-height: 1.7; white-space: pre-wrap; word-wrap: break-word; max-height: 70vh; overflow-y: auto; }
        .goblin-card-content.loading { color: #888; font-style: italic; }
        .goblin-toolbar button { background: none; border: none; cursor: pointer; opacity: 0.7; margin-left: 8px; padding: 2px; }
        .goblin-toolbar button:hover { opacity: 1; }
        .goblin-toolbar svg { width: 14px; height: 14px; vertical-align: middle; }
        .goblin-card-content h4, .goblin-card-content h2, .goblin-card-content h3 { margin: 1.2em 0 0.8em; padding-bottom: 0.3em; border-bottom: 1px solid rgba(0,0,0,0.1); font-size: 1.1em; }
        .goblin-card-content h4:first-child, .goblin-card-content h2:first-child, .goblin-card-content h3:first-child { margin-top: 0; }
        .goblin-card-content p { margin-bottom: 1em; }
        .goblin-card-content strong, .goblin-card-content b { color: #c7254e; background-color: #f9f2f4; padding: 2px 4px; border-radius: 4px; }
        .goblin-card-content em, .goblin-card-content i { color: #00529B; }
        .goblin-card-content ul, .goblin-card-content ol { padding-left: 20px; }
        .goblin-card-content ul { list-style: disc; }
        .goblin-card-content ol { list-style: decimal; }
        .goblin-card-content blockquote { border-left: 4px solid #ccc; padding-left: 10px; margin-left: 5px; color: #666; }
        .goblin-card-content .emotion-highlight { background-color: #fffbe6; color: #d46b08; font-weight: bold; padding: 1px 3px; border-radius: 3px; }
        .eyedance-image-grid { display: grid; grid-template-columns: 1fr; gap: 10px; text-align: center; }
        .eyedance-image-grid img { max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .eyedance-image-grid h4 { font-size: 0.9em; color: #555; margin-bottom: 5px; border: none; }

        /* 日志窗口 */
        .log-container { display: none; background: #2d2d2d; color: #f0f0f0; font-family: monospace; font-size: 12px; padding: 10px; margin-top: 10px; border-radius: 4px; max-height: 200px; overflow-y: auto; }
        .log-container.visible { display: block; }
        .log-container div { white-space: pre-wrap; word-break: break-all; }
        .log-entry.info { color: #87cefa; } .log-entry.error { color: #ff6b6b; } .log-entry.warn { color: #ffd700; } .log-entry.success { color: #98fb98; }

        /* --- 卡片美化 (浅色模式) --- */
        .goblin-result-card { border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .goblin-result-card[data-model="JudgeTone"] { background: linear-gradient(135deg, #e7f3ff, #f5faff); border-color: #b3d7ff; }
        .goblin-result-card[data-model="JudgeTone"] .goblin-card-header { background-color: #d0e8ff; color: #00529B; }
        .goblin-result-card[data-model="SuggestResponse"] { background: linear-gradient(135deg, #fff9e6, #fffdf5); border-color: #ffecb3; }
        .goblin-result-card[data-model="SuggestResponse"] .goblin-card-header { background-color: #ffe48d; color: #665200; }
        .goblin-formalizer-box { background: linear-gradient(135deg, #e6f7ff 0%, #eef8ff 100%); border-color: #b3d7ff; }
        .goblin-formalizer-box .goblin-card-header { background-color: #d0e8ff; color: #00529B; }
        .goblin-consultant-box { background: linear-gradient(135deg, #f0fff0 0%, #f6fff6 100%); border-color: #cce5cc; }
        .goblin-consultant-box .goblin-card-header { background-color: #d4edda; color: #155724; }
        .goblin-professor-box { background: linear-gradient(135deg, #f3e8ff 0%, #f8f3ff 100%); border-color: #d6baff; }
        .goblin-professor-box .goblin-card-header { background-color: #e9d5ff; color: #581c87; }
        .dream-result-card { background: linear-gradient(135deg, #f5f3ff 0%, #faf8ff 100%); border: 1px solid #d6bcfa; }
        .dream-result-card .goblin-card-header { background-color: #e9d8ff; color: #581c87; }
        .dream-result-card h2 { color: #581c87; padding-bottom: 0.5em; border-bottom: 1px solid #d6bcfa; margin-bottom: 1em; }
        .summarizer-result-card { background: linear-gradient(135deg, #f0f9ff 0%, #f7fcff 100%); border: 1px solid #b9e0f2; }
        .summarizer-result-card .goblin-card-header { background-color: #cceefc; color: #0c5460; }
        .mymap-result-card { background: linear-gradient(135deg, #fdf8e1 0%, #fffdf0 100%); border-color: #fceec9; }
        .mymap-result-card .goblin-card-header { background-color: #fbe5a2; color: #7a5c00; }
        .decopy-result-card { background: linear-gradient(135deg, #e6fffb 0%, #f0fffb 100%); border-color: #b5f5ec; }
        .decopy-result-card .goblin-card-header { background-color: #87e8de; color: #00474f; }
        .ai-reply-card { background: linear-gradient(135deg, #fde2e4 0%, #fff1f2 100%); border-color: #fecdd3; }
        .ai-reply-card .goblin-card-header { background-color: #fbb4b9; color: #881337; }
        .eyedance-image-card { background: linear-gradient(135deg, #d1fae5 0%, #f0fdf4 100%); border-color: #a7f3d0; }
        .eyedance-image-card .goblin-card-header { background-color: #6ee7b7; color: #047857; }
        .web-search-card { background: linear-gradient(135deg, #e0e7ff 0%, #eef2ff 100%); border-color: #c7d2fe; }
        .web-search-card .goblin-card-header { background-color: #a5b4fc; color: #3730a3; }
        /* 新增 Deno Port 卡片样式 (浅色) */
        .ai-answer-generator-card { background: linear-gradient(135deg, #e0fff8 0%, #f0fffb 100%); border-color: #a3f0e0; }
        .ai-answer-generator-card .goblin-card-header { background-color: #79e8d1; color: #004d40; }

        /* --- 多维分析 & 顾问卡片内部颜色区分 (浅色) --- */
        .formalizer-section, .consultant-section { padding: 8px; margin-bottom: 10px; border-left: 3px solid; border-radius: 4px; transition: background-color 0.3s; }
        .formalizer-section h4, .consultant-section h4 { margin: 0 0 8px 0; padding: 0; border: none; font-size: 1em; font-weight: bold; }
        .formalizer-section-0 { border-color: #2980b9; background-color: rgba(41, 128, 185, 0.05); }
        .formalizer-section-0 h4 { color: #2980b9; }
        .formalizer-section-1 { border-color: #27ae60; background-color: rgba(39, 174, 96, 0.05); }
        .formalizer-section-1 h4 { color: #27ae60; }
        .formalizer-section-2 { border-color: #d35400; background-color: rgba(211, 84, 0, 0.05); }
        .formalizer-section-2 h4 { color: #d35400; }
        .formalizer-section-3 { border-color: #8e44ad; background-color: rgba(142, 68, 173, 0.05); }
        .formalizer-section-3 h4 { color: #8e44ad; }
        .formalizer-section-4 { border-color: #c0392b; background-color: rgba(192, 57, 43, 0.05); }
        .formalizer-section-4 h4 { color: #c0392b; }
        .consultant-pros { border-color: #27ae60; background-color: rgba(39, 174, 96, 0.05); }
        .consultant-pros h4 { color: #27ae60; }
        .consultant-cons { border-color: #d35400; background-color: rgba(211, 84, 0, 0.05); }
        .consultant-cons h4 { color: #d35400; }
        .consultant-advice { border-color: #8e44ad; background-color: rgba(142, 68, 173, 0.05); }
        .consultant-advice h4 { color: #8e44ad; }
        .professor-explanation h4 { color: #2980b9; }
        .professor-example h4 { color: #27ae60; }

        /* --- [v19.5] 动态深色模式样式 --- */
        body.sa-dark-theme .goblin-results-wrapper { border-top-color: #45475a; }
        body.sa-dark-theme .control-analyze-btn { background: rgba(49, 50, 68, 0.9); border-color: #45475a; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
        body.sa-dark-theme .control-analyze-btn:hover { background: rgba(69, 71, 90, 0.95); box-shadow: 0 3px 10px rgba(0,0,0,0.4); }

        /* 卡片基础样式 (深色) */
        body.sa-dark-theme .goblin-result-card { border-radius: 8px; border: 1px solid #585b70; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.3); color: #f5f5f5; background-color: #1e1e2e; }
        body.sa-dark-theme .goblin-card-header { border-bottom-color: #45475a; }
        body.sa-dark-theme .goblin-card-header span { color: #ffffff; font-weight: 700; }
        body.sa-dark-theme .goblin-card-content { color: #f5f5f5; }

        /* 各类卡片深色样式 */
        body.sa-dark-theme .goblin-result-card[data-model="JudgeTone"] { background: linear-gradient(135deg, #1a1d2e, #13151f); border-color: #89b4fa; }
        body.sa-dark-theme .goblin-result-card[data-model="JudgeTone"] .goblin-card-header { background-color: #4a7bc4; color: #ffffff; }
        body.sa-dark-theme .goblin-result-card[data-model="SuggestResponse"] { background: linear-gradient(135deg, #1e1c12, #15130a); border-color: #f9e2af; }
        body.sa-dark-theme .goblin-result-card[data-model="SuggestResponse"] .goblin-card-header { background-color: #b89850; color: #ffffff; }
        body.sa-dark-theme .goblin-formalizer-box { background: linear-gradient(135deg, #1a1d2e, #13151f); border-color: #89b4fa; }
        body.sa-dark-theme .goblin-formalizer-box .goblin-card-header { background-color: #4a7bc4; color: #ffffff; }
        body.sa-dark-theme .goblin-consultant-box { background: linear-gradient(135deg, #151d15, #0d140d); border-color: #a6e3a1; }
        body.sa-dark-theme .goblin-consultant-box .goblin-card-header { background-color: #5a965a; color: #ffffff; }
        body.sa-dark-theme .goblin-professor-box { background: linear-gradient(135deg, #1f1a27, #15111b); border-color: #cba6f7; }
        body.sa-dark-theme .goblin-professor-box .goblin-card-header { background-color: #8a5fb8; color: #ffffff; }
        body.sa-dark-theme .dream-result-card { background: linear-gradient(135deg, #1f1a27, #15111b); border-color: #cba6f7; }
        body.sa-dark-theme .dream-result-card .goblin-card-header { background-color: #8a5fb8; color: #ffffff; }
        body.sa-dark-theme .dream-result-card h2 { color: #e0c5ff; border-bottom-color: #585b70; }
        body.sa-dark-theme .summarizer-result-card { background: linear-gradient(135deg, #131c1e, #0c1416); border-color: #74c7ec; }
        body.sa-dark-theme .summarizer-result-card .goblin-card-header { background-color: #4a8aaa; color: #ffffff; }
        body.sa-dark-theme .mymap-result-card { background: linear-gradient(135deg, #1e1812, #15110a); border-color: #fab387; }
        body.sa-dark-theme .mymap-result-card .goblin-card-header { background-color: #b87a50; color: #ffffff; }
        body.sa-dark-theme .decopy-result-card { background: linear-gradient(135deg, #131e1c, #0c1614); border-color: #94e2d5; }
        body.sa-dark-theme .decopy-result-card .goblin-card-header { background-color: #52a399; color: #ffffff; }
        body.sa-dark-theme .ai-reply-card { background: linear-gradient(135deg, #1f131a, #160d12); border-color: #f38ba8; }
        body.sa-dark-theme .ai-reply-card .goblin-card-header { background-color: #b05873; color: #ffffff; }
        body.sa-dark-theme .eyedance-image-card { background: linear-gradient(135deg, #151d15, #0d140d); border-color: #a6e3a1; }
        body.sa-dark-theme .eyedance-image-card .goblin-card-header { background-color: #5a965a; color: #ffffff; }
        body.sa-dark-theme .web-search-card { background: linear-gradient(135deg, #1a1d2e, #13151f); border-color: #b4befe; }
        body.sa-dark-theme .web-search-card .goblin-card-header { background-color: #6a75c4; color: #ffffff; }
        /* 新增 Deno Port 卡片样式 (深色) */
        body.sa-dark-theme .ai-answer-generator-card { background: linear-gradient(135deg, #0f2e29, #112220); border-color: #4db6ac; }
        body.sa-dark-theme .ai-answer-generator-card .goblin-card-header { background-color: #26a69a; color: #ffffff; }


        /* 内容文字样式 (深色) */
        body.sa-dark-theme .goblin-card-content h4, body.sa-dark-theme .goblin-card-content h2, body.sa-dark-theme .goblin-card-content h3 { color: #d0d8ff; border-bottom-color: #585b70; font-weight: 600; }
        body.sa-dark-theme .goblin-card-content p { color: #f5f5f5; margin-bottom: 1em; }
        body.sa-dark-theme .goblin-card-content strong, body.sa-dark-theme .goblin-card-content b { color: #ffe8a3; background-color: rgba(249, 226, 175, 0.2); padding: 2px 6px; border-radius: 3px; }
        body.sa-dark-theme .goblin-card-content em, body.sa-dark-theme .goblin-card-content i { color: #9fe6f5; }
        body.sa-dark-theme .goblin-card-content blockquote { border-left-color: #89b4fa; background-color: rgba(137, 180, 250, 0.1); color: #e0e0e0; padding: 8px 12px; }
        body.sa-dark-theme .goblin-card-content code { background-color: #313244; color: #ff9db8; padding: 2px 6px; border-radius: 4px; font-family: 'Consolas', 'Monaco', monospace; }
        body.sa-dark-theme .goblin-card-content .emotion-highlight { background-color: rgba(249, 226, 175, 0.25); color: #ffe8a3; font-weight: 600; padding: 2px 6px; }
        body.sa-dark-theme .goblin-card-content ul li, body.sa-dark-theme .goblin-card-content ol li { color: #f5f5f5; margin-bottom: 0.5em; }
        body.sa-dark-theme .goblin-card-content a { color: #89b4fa; text-decoration: underline; }
        body.sa-dark-theme .goblin-card-content a:hover { color: #b4befe; }
        body.sa-dark-theme .goblin-card-content.loading { color: #e0e0e0; font-style: italic; }

        /* 多维分析和顾问卡片 (深色) */
        body.sa-dark-theme .formalizer-section, body.sa-dark-theme .consultant-section { background-color: rgba(137, 180, 250, 0.1); border-left-width: 4px; color: #f5f5f5; padding: 8px; margin-bottom: 10px; border-radius: 4px; }
        body.sa-dark-theme .formalizer-section h4, body.sa-dark-theme .consultant-section h4 { font-weight: 600; margin: 0 0 8px 0; }
        body.sa-dark-theme .formalizer-section p, body.sa-dark-theme .consultant-section p { color: #f5f5f5; }
        body.sa-dark-theme .formalizer-section-0 { border-color: #89b4fa; background-color: rgba(137, 180, 250, 0.12); }
        body.sa-dark-theme .formalizer-section-0 h4 { color: #b4d4ff; }
        body.sa-dark-theme .formalizer-section-1 { border-color: #a6e3a1; background-color: rgba(166, 227, 161, 0.12); }
        body.sa-dark-theme .formalizer-section-1 h4 { color: #c0f5bc; }
        body.sa-dark-theme .formalizer-section-2 { border-color: #fab387; background-color: rgba(250, 179, 135, 0.12); }
        body.sa-dark-theme .formalizer-section-2 h4 { color: #ffc89f; }
        body.sa-dark-theme .formalizer-section-3 { border-color: #cba6f7; background-color: rgba(203, 166, 247, 0.12); }
        body.sa-dark-theme .formalizer-section-3 h4 { color: #e0c5ff; }
        body.sa-dark-theme .formalizer-section-4 { border-color: #f38ba8; background-color: rgba(243, 139, 168, 0.12); }
        body.sa-dark-theme .formalizer-section-4 h4 { color: #ffa5c0; }
        body.sa-dark-theme .consultant-pros { border-color: #a6e3a1; background-color: rgba(166, 227, 161, 0.12); }
        body.sa-dark-theme .consultant-pros h4 { color: #c0f5bc; }
        body.sa-dark-theme .consultant-cons { border-color: #fab387; background-color: rgba(250, 179, 135, 0.12); }
        body.sa-dark-theme .consultant-cons h4 { color: #ffc89f; }
        body.sa-dark-theme .consultant-advice { border-color: #cba6f7; background-color: rgba(203, 166, 247, 0.12); }
        body.sa-dark-theme .consultant-advice h4 { color: #e0c5ff; }
        body.sa-dark-theme .professor-explanation h4 { color: #89b4fa; }
        body.sa-dark-theme .professor-example h4 { color: #a6e3a1; }

        /* 图片网格 (深色) */
        body.sa-dark-theme .eyedance-image-grid h4 { color: #e0e0e0; font-weight: 500; }
        body.sa-dark-theme .eyedance-image-grid img { border: 1px solid #45475a; }

        /* 工具栏和按钮 (深色) */
        body.sa-dark-theme .goblin-toolbar button { opacity: 0.85; filter: brightness(1.3); }
        body.sa-dark-theme .goblin-toolbar button:hover { opacity: 1; filter: brightness(1.5); }
        body.sa-dark-theme .goblin-toolbar svg { fill: #e0e0e0; }

        /* 帖子结构树窗口 (深色) */
        body.sa-dark-theme #topic-tree-window { background-color: #1e1e2e; color: #f5f5f5; box-shadow: 0 10px 40px rgba(0,0,0,0.6); }
        body.sa-dark-theme #topic-tree-window-header { background-color: #181825; border-bottom-color: #45475a; }
        body.sa-dark-theme #topic-tree-window-title { color: #f0f0f0; font-weight: 600; }
        body.sa-dark-theme #topic-tree-window-toolbar .toolbar-button { background-color: #313244; border-color: #45475a; color: #e5e5e5; }
        body.sa-dark-theme #topic-tree-window-toolbar .toolbar-button:hover { background-color: #45475a; border-color: #585b70; color: #ffffff; }
        body.sa-dark-theme #topic-tree-window-toolbar label { background: #313244; color: #e5e5e5; border: 1px solid #45475a; }
        body.sa-dark-theme #topic-tree-window-toolbar label:hover { background: #45475a; color: #ffffff; }
        body.sa-dark-theme #tree-window-close-btn { color: #e5e5e5; }
        body.sa-dark-theme #tree-window-close-btn:hover { color: #ff9db8; }
        body.sa-dark-theme .topic-tree-svg .node > rect { fill: #11111b; stroke-width: 2; }
        body.sa-dark-theme .topic-tree-svg .node .title { fill: #f0f0f0; font-weight: 600; }
        body.sa-dark-theme .topic-tree-svg .node .content-text { fill: #d0d0d0; }
        body.sa-dark-theme .topic-tree-svg .link { stroke: #45475a; stroke-width: 2px; }
        body.sa-dark-theme #topic-tree-window-body { background-color: #181825; background-image: linear-gradient(45deg, #1e1e2e 25%, transparent 25%), linear-gradient(-45deg, #1e1e2e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e1e2e 75%), linear-gradient(-45deg, transparent 75%, #1e1e2e 75%); }

        /* 思维导图 (深色) */
        body.sa-dark-theme .mymap-svg-container { background-color: #181825; background-image: linear-gradient(45deg, #1e1e2e 25%, transparent 25%), linear-gradient(-45deg, #1e1e2e 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e1e2e 75%), linear-gradient(-45deg, transparent 75%, #1e1e2e 75%); border-color: #45475a; }
        body.sa-dark-theme .mymap-svg-container .node rect { fill: #11111b; stroke-width: 2; }
        body.sa-dark-theme .mymap-svg-container .node .title { fill: inherit; font-weight: 600; }
        body.sa-dark-theme .mymap-svg-container .node .desc { fill: #d0d0d0; }
        body.sa-dark-theme .mymap-svg-container .link { stroke: #585b70; stroke-width: 2px; }

        /* 悬浮球 (深色) */
        body.sa-dark-theme #goblin-fab-button { background-color: #313244; box-shadow: 0 4px 16px rgba(0,0,0,0.5); border: 1px solid #45475a; }
        body.sa-dark-theme #goblin-fab-button:hover { background-color: #45475a; box-shadow: 0 6px 20px rgba(0,0,0,0.6); }
        body.sa-dark-theme #goblin-fab-menu { background-color: #1e1e2e; box-shadow: 0 8px 24px rgba(0,0,0,0.6); border: 1px solid #45475a; }
        body.sa-dark-theme .goblin-fab-menu-button { background-color: #313244; border-color: #45475a; color: #e5e5e5; }
        body.sa-dark-theme .goblin-fab-menu-button:hover { background-color: #45475a; color: #ffffff; }

        /* 设置模态框 (深色) */
        body.sa-dark-theme #goblin-modal-overlay { background: rgba(0,0,0,0.7); }
        body.sa-dark-theme #goblin-settings-modal { background: #1e1e2e; box-shadow: 0 10px 40px rgba(0,0,0,0.8); border: 1px solid #45475a; }
        body.sa-dark-theme #goblin-settings-header { border-bottom-color: #45475a; color: #f0f0f0; background-color: #181825; }
        body.sa-dark-theme #goblin-settings-close-btn { color: #e5e5e5; }
        body.sa-dark-theme #goblin-settings-close-btn:hover { color: #ff9db8; }
        body.sa-dark-theme #goblin-settings-body { background-color: #1e1e2e; }
        body.sa-dark-theme .goblin-setting-item label { color: #e5e5e5; }
        body.sa-dark-theme .goblin-setting-item label:hover { color: #ffffff; }
        body.sa-dark-theme .goblin-setting-item input[type="checkbox"] { accent-color: #89b4fa; cursor: pointer; }

        /* 全新思维导图渲染样式 */
        .mymap-svg-container { width: 100%; height: 500px; cursor: grab; background-image: linear-gradient(45deg, #f5f5f5 25%, transparent 25%), linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f5 75%), linear-gradient(-45deg, transparent 75%, #f5f5f5 75%); background-size: 20px 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
        .mymap-svg-container:active { cursor: grabbing; }
        .mymap-svg-container .node { cursor: pointer; }
        .mymap-svg-container .node > rect { transition: filter 0.2s ease, stroke-dasharray 0.3s ease, stroke 0.3s, stroke-width 0.3s; }
        .mymap-svg-container .node:hover > rect { filter: drop-shadow(0 3px 6px rgba(0,0,0,0.15)); }
        .mymap-svg-container .node rect { stroke-width: 1.5; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.1)); }
        .mymap-svg-container .node.collapsed > rect { stroke-dasharray: 4 2; }
        .mymap-svg-container .node text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; user-select: none; }
        .mymap-svg-container .node .title { font-size: 14px; font-weight: 600; }
        .mymap-svg-container .node .desc { font-size: 11px; fill: #555; }
        .mymap-svg-container .link { stroke: #a9a9a9; stroke-width: 1.5px; fill: none; transition: opacity 0.3s ease, d 0.3s ease; }
        .mymap-svg-container .node .collapse-handle { fill: #888; }
        .mymap-svg-container .node.collapsed .collapse-handle-minus { display: none; }
        .mymap-svg-container .node:not(.collapsed) .collapse-handle-plus { display: none; }
        .mymap-svg-container g > g { transition: transform 0.3s ease; } /* Smooth transition for nodes */


        /* 悬浮球与设置 */
        #goblin-fab-container { position: fixed; bottom: 40px; right: 40px; z-index: 9998; }
        #goblin-fab-button { width: 48px; height: 48px; border-radius: 50%; background-color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.2); cursor: grab; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; padding: 8px; }
        #goblin-fab-button:hover { transform: scale(1.05); }
        #goblin-fab-button img { width: 100%; height: 100%; border-radius: 4px; pointer-events: none; }
        #goblin-fab-menu { position: absolute; bottom: 60px; right: 0; background-color: white; border-radius: 8px; box-shadow: 0 6px 16px rgba(0,0,0,0.2); padding: 8px; display: flex; flex-direction: column; gap: 8px; z-index: 9999; visibility: hidden; opacity: 0; transform: translateY(10px); transition: visibility 0.2s, opacity 0.2s, transform 0.2s; }
        #goblin-fab-menu.visible { visibility: visible; opacity: 1; transform: translateY(0); }
        .goblin-fab-menu-button { background-color: #f0f0f0; border: 1px solid #ddd; color: #333; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 14px; text-align: center; white-space: nowrap; }
        .goblin-fab-menu-button:hover { background-color: #e5e5e5; }
        #goblin-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 10000; display: none; justify-content: center; align-items: center; }
        #goblin-modal-overlay.visible { display: flex; }
        #goblin-settings-modal { background: #fff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 90%; max-width: 600px; }
        #goblin-settings-header { padding: 16px; font-size: 18px; font-weight: 600; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        #goblin-settings-close-btn { font-size: 24px; cursor: pointer; color: #888; line-height: 1; border: none; background: none; }
        #goblin-settings-body { padding: 20px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .goblin-setting-item label { display: flex; align-items: center; cursor: pointer; font-size: 15px; }
        .goblin-setting-item input { width: 16px; height: 16px; margin-right: 8px; }

        /* --- 帖子结构树浮动窗口样式 (v18.1 美化) --- */
        #topic-tree-window {
            display: none;
            position: fixed;
            z-index: 10001;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            width: 800px;
            height: 600px;
            top: 100px;
            left: 100px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            min-width: 400px;
            min-height: 300px;
        }
        #topic-tree-window-header {
            padding: 10px 15px;
            font-size: 16px;
            font-weight: 600;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            cursor: move;
            background-color: #f7f7f7;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            user-select: none;
        }
        #topic-tree-window-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 15px; }
        #topic-tree-window-toolbar { display: flex; align-items: center; gap: 8px; }
        #topic-tree-window-toolbar .toolbar-button {
            background-color: #fff; border: 1px solid #ccc; color: #333; padding: 4px 10px;
            border-radius: 6px; cursor: pointer; font-size: 13px; transition: background-color 0.2s, border-color 0.2s;
            display: flex; align-items: center; gap: 4px;
        }
        #topic-tree-window-toolbar .toolbar-button:hover { background-color: #f0f0f0; border-color: #bbb; }
        #topic-tree-window-toolbar .toolbar-button svg { width: 14px; height: 14px; }
        #topic-tree-window-toolbar label { font-size: 13px; font-weight: normal; display: flex; align-items: center; gap: 5px; cursor: pointer; padding: 4px 8px; background: #f0f0f0; border-radius: 6px; }
        #tree-window-close-btn { font-size: 22px; padding: 0 8px; line-height: 1; border: none; background: none; color: #888; }
        #topic-tree-window-body {
            flex-grow: 1;
            overflow: hidden;
            position: relative;
            cursor: grab;
            background-image: linear-gradient(45deg, #f9f9f9 25%, transparent 25%), linear-gradient(-45deg, #f9f9f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f9f9f9 75%), linear-gradient(-45deg, transparent 75%, #f9f9f9 75%);
            background-size: 20px 20px;
        }
        #topic-tree-window-body:active { cursor: grabbing; }
        .topic-tree-svg .node { cursor: pointer; }
        .topic-tree-svg .node > rect {
            stroke-width: 1.5;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.08));
            transition: filter 0.2s ease, stroke-width 0.2s ease;
        }
        .topic-tree-svg .node:hover > rect { filter: drop-shadow(0 4px 8px rgba(0,0,0,0.12)); }
        .topic-tree-svg .node.highlighted > rect { stroke: #ff4500 !important; stroke-width: 3px; filter: drop-shadow(0 0 8px rgba(255, 69, 0, 0.7)); }
        .topic-tree-svg .node .title { font-size: 14px; font-weight: 600; user-select: none; }
        .topic-tree-svg .node .content-text { font-size: 12px; fill: #555; user-select: none; white-space: pre; }
        .topic-tree-svg .link { stroke: #aaa; stroke-width: 1.5px; fill: none; transition: d 0.3s ease; }
        .topic-tree-svg g.svg-pan-zoom_viewport { transition: transform 0.3s ease-out; }
        #topic-tree-window .log-container { position: absolute; bottom: 0; left: 0; right: 0; height: 150px; border-top: 1px solid #444; z-index: 10; margin: 0; border-radius: 0 0 11px 11px; }
        .resize-handle { user-select: none; }
        #topic-tree-window .resize-handle { position: absolute; z-index: 5; }
        #topic-tree-window .resize-handle-n { top: -5px; left: 0; right: 0; height: 10px; cursor: ns-resize; }
        #topic-tree-window .resize-handle-s { bottom: -5px; left: 0; right: 0; height: 10px; cursor: ns-resize; }
        #topic-tree-window .resize-handle-e { top: 0; right: -5px; bottom: 0; width: 10px; cursor: ew-resize; }
        #topic-tree-window .resize-handle-w { top: 0; left: -5px; bottom: 0; width: 10px; cursor: ew-resize; }
        #topic-tree-window .resize-handle-ne { top: -5px; right: -5px; width: 12px; height: 12px; cursor: nesw-resize; }
        #topic-tree-window .resize-handle-nw { top: -5px; left: -5px; width: 12px; height: 12px; cursor: nwse-resize; }
        #topic-tree-window .resize-handle-se { bottom: -5px; right: -5px; width: 12px; height: 12px; cursor: nwse-resize; }
        #topic-tree-window .resize-handle-sw { bottom: -5px; left: -5px; width: 12px; height: 12px; cursor: nesw-resize; }
    `);

    // --- 3. 核心 API 请求函数 (Promise-based) ---
    const ICONS_SVG = {
        log: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/><path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM9 8.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H9.5a.5.5 0 0 1-.5-.5zm-2 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1H7.5a.5.5 0 0 1-.5-.5z"/></svg>`,
        refresh: `<svg viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/></svg>`,
        copy: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 12.5 2h-9ZM3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-9Z"/><path d="M.5 0A.5.5 0 0 0 0 .5v9a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 0-1h-2v-9h9v2a.5.5 0 0 0 1 0v-2A.5.5 0 0 0 10.5 0h-10Z"/></svg>`,
        close: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/></svg>`,
        recenter: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3.5a.5.5 0 0 0-1 0V5.5a.5.5 0 0 0 .5.5H9.5a.5.5 0 0 0 0-1H8V3.5zM5.5 8a.5.5 0 0 0-.5.5v1.5a.5.5 0 0 0 1 0V8.5H7.5a.5.5 0 0 0 0-1H5.5zM8 10.5a.5.5 0 0 0-1 0V12.5a.5.5 0 0 0 .5.5h1.5a.5.5 0 0 0 0-1H8v-1.5zM10.5 8a.5.5 0 0 0-.5.5v1.5a.5.5 0 0 0 1 0V8.5h1.5a.5.5 0 0 0 0-1H10.5z"/><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 1 0 0 14A7 7 0 0 0 8 1z"/></svg>`,
        export_txt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4z"/><path d="M4.5 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/></svg>`,
        export_md: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 14.5 0h-13zM2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-13z"/><path d="M3 7.5a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3.5a.5.5 0 0 1-.5-.5v-1zm3.5-1a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-3zM9 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-3zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-.5v1.5h.5a.5.5 0 0 1 0 1h-1a.5.5 0 0 1 0-1h.5V7.5h-.5a.5.5 0 0 1-.5-.5z"/></svg>`,
    };
    const escapeHtml = (text) => { const d = document.createElement('div'); d.textContent = text; return d.innerHTML; };
    const URL_REGEX = /https?:\/\/[^\s/$.?#].[^\s]*/i;

    function callApi(config) {
        return new Promise((resolve, reject) => {
            const { service, log } = config;
            log('info', `[API Call] 发起请求到 ${service}...`);
            log('info', `[API Call] URL: ${config.method || 'POST'} ${config.url}`);
            GM_xmlhttpRequest({
                method: config.method || "POST",
                url: config.url,
                headers: config.headers,
                data: config.data,
                timeout: 60000,
                onload: res => {
                    if (res.status >= 200 && res.status < 300) {
                        log('success', `[API Call] ${service} 请求成功, 状态码: ${res.status}`);
                        resolve(res.responseText);
                    } else {
                        log('error', `[API Call] ${service} 请求失败, 状态码: ${res.status}, 响应: ${res.responseText}`);
                        reject(`${service}请求失败: ${res.status}`);
                    }
                },
                onerror: res => {
                    log('error', `[API Call] ${service} 网络错误: ${res.statusText || '无法连接'}`);
                    reject(`${service}网络错误: ${res.statusText || '无法连接'}`);
                },
                ontimeout: () => {
                    log('error', `[API Call] ${service} 请求超时。`);
                    reject(`${service}请求超时。`);
                }
            });
        });
    }

    // --- 4. 各模块实现 ---
    const ANALYSIS_TOOLS = {
        aiAnswerGenerator: { create: createAIAnswerGeneratorCard, label: 'AI 生成答案 (Deno Port)' },
        aiReply: { create: (post) => createThinkAnyCard(post, 'chat', 'AI 回复 (ThinkAny)', 'ai-reply-card'), label: 'AI 回复 (ThinkAny)' },
        webSearch: { create: (post) => createThinkAnyCard(post, 'search', '网络搜索 (ThinkAny)', 'web-search-card'), label: '网络搜索 (ThinkAny)' },
        eyedanceImage: { create: createEyeDanceCard, label: '文生图 (EyeDance)' },
        judgeTone: { create: (post) => createGoblinCard(post, 'JudgeTone', '语气评判'), label: '语气评判' },
        suggestResponse: { create: (post) => createGoblinCard(post, 'SuggestResponse', '建议回应'), label: '建议回应' },
        formalizer: { create: createFormalizerBox, label: '多维分析' },
        consultant: { create: createConsultantBox, label: '顾问 (利弊)' },
        professor: { create: createProfessorBox, label: '教授 (解析)' },
        dream: { create: createDreamCard, label: '梦境解答' },
        summarizer: { create: createSummarizerCard, label: '文章摘要', requiresUrl: true },
        mymap: { create: createMyMapCard, label: '思维导图' },
        decopy: { create: createDecopyCard, label: '简洁回复' },
    };

    function getContextualContent(post, role) {
        const topicTitle = document.querySelector("#topic-title .fancy-title")?.innerText.trim() || '当前帖子';
        const postContent = post.querySelector('.cooked')?.innerText.trim();
        if (!postContent) return null;
        return `请以“${role}”的身份，为以下内容生成分析。\n\n主题是：“${topicTitle}”\n\n具体内容如下：\n${postContent}`;
    }

    function getThinkAnyContext(post) {
        const topicTitle = document.querySelector("#topic-title .fancy-title")?.innerText.trim() || '当前帖子';
        const firstPostCooked = document.querySelector('article.topic-post[data-post-number="1"] .cooked');
        const firstPostContent = firstPostCooked ? firstPostCooked.innerText.trim() : '（无法获取主楼内容）';
        const currentPostContent = post.querySelector('.cooked')?.innerText.trim();
        if (!currentPostContent) return null;

        let context = `请你结合以下整个帖子的上下文，对“当前帖子内容”进行分析或回复。\n\n`;
        context += `== 帖子主题 ==\n${topicTitle}\n\n`;
        context += `== 楼主内容 ==\n${firstPostContent}\n\n`;
        context += `== 当前帖子内容 ==\n${currentPostContent}`;

        return context;
    }

    // 新增：为 aianswergenerator 获取上下文的函数
    function getAIAnswerGeneratorContext(post) {
        const topicTitle = document.querySelector("#topic-title .fancy-title")?.innerText.trim() || '未知主题';
        const postContent = post.querySelector('.cooked')?.innerText.trim();
        if (!postContent) return null;

        return `帖子主题（帖子讨论的话题等等）：\n\n${topicTitle}\n\n当前用户的评论：\n\n${postContent}`;
    }


    function simpleMarkdownParse(text) {
        // Pre-process to escape HTML, then apply markdown
        let html = escapeHtml(text)
            .replace(/&lt;br&gt;/g, '\n') // Restore newlines that might have been escaped
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        const lines = html.split('\n');
        let inUl = false;
        let inOl = false;
        let resultHtml = '';

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // Headers
            if (line.startsWith('#')) {
                const match = line.match(/^(#+)\s*(.*)/);
                if (match) {
                    line = `<h${match[1].length}>${match[2].trim()}</h${match[1].length}>`;
                }
            }
            // Blockquotes
            else if (line.startsWith('>')) {
                line = `<blockquote>${line.substring(1).trim()}</blockquote>`;
            }
            // Unordered lists
            else if (line.trim().startsWith('- ')) {
                if (!inUl) { resultHtml += '<ul>\n'; inUl = true; }
                line = `<li>${line.trim().substring(2).trim()}</li>`;
            }
            // Ordered lists
            else if (line.trim().match(/^\d+\.\s/)) {
                if (!inOl) { resultHtml += '<ol>\n'; inOl = true; }
                line = `<li>${line.trim().replace(/^\d+\.\s/, '').trim()}</li>`;
            }
            // Normal paragraph
            else {
                if (inUl) { resultHtml += '</ul>\n'; inUl = false; }
                if (inOl) { resultHtml += '</ol>\n'; inOl = false; }
                if (line.trim() !== '') {
                    line = `<p>${line}</p>`;
                }
            }
            resultHtml += line + '\n';
        }

        if (inUl) resultHtml += '</ul>\n';
        if (inOl) resultHtml += '</ol>\n';

        // Apply inline styles after block processing
        resultHtml = resultHtml
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>');

        return resultHtml.replace(/<p>\s*<\/p>/g, '').replace(/\n/g, '');
    }


    function createCard(post, { cardClass, title, analyzeFn }) {
        const card = document.createElement('div');
        card.className = `goblin-result-card ${cardClass}`;
        card.innerHTML = `<div class="goblin-card-header"><span>${title}</span><div class="goblin-toolbar"><button class="goblin-log-btn" title="日志">${ICONS_SVG.log}</button><button class="goblin-refresh-btn" title="刷新">${ICONS_SVG.refresh}</button><button class="goblin-copy-btn" title="复制">${ICONS_SVG.copy}</button><button class="goblin-close-btn" title="关闭">${ICONS_SVG.close}</button></div></div><div class="goblin-card-content loading">正在分析中...</div><div class="log-container"></div>`;
        const contentDiv = card.querySelector('.goblin-card-content');
        const logContainer = card.querySelector('.log-container');
        let rawTextResult = '';

        const log = (level, message) => {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry ${level}`;
            logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            logContainer.appendChild(logEntry);
            logContainer.scrollTop = logContainer.scrollHeight;
        };

        const doAnalyze = () => {
            logContainer.innerHTML = '';
            log('info', '开始分析...');
            contentDiv.innerHTML = '正在分析中...'; contentDiv.classList.add('loading');
            analyzeFn(post, (html, raw) => {
                log('success', '分析成功完成。');
                contentDiv.innerHTML = html; rawTextResult = raw; contentDiv.classList.remove('loading');
                const event = new CustomEvent('card-rendered', { detail: { card: card } });
                document.dispatchEvent(event);
            }, (err) => {
                log('error', `分析失败: ${err}`);
                contentDiv.textContent = `分析失败: ${err}`; contentDiv.classList.remove('loading');
            }, log, contentDiv);
        };

        card.querySelector('.goblin-log-btn').addEventListener('click', () => logContainer.classList.toggle('visible'));
        card.querySelector('.goblin-refresh-btn').addEventListener('click', doAnalyze);
        card.querySelector('.goblin-copy-btn').addEventListener('click', () => { if (rawTextResult) GM_setClipboard(rawTextResult); });
        card.querySelector('.goblin-close-btn').addEventListener('click', () => card.remove());
        doAnalyze(); return card;
    }

    // --- [v19.6] 新增 Deno Port 功能卡片 ---
    function createAIAnswerGeneratorCard(post) {
        return createCard(post, {
            cardClass: 'ai-answer-generator-card',
            title: 'AI 生成答案 (Deno Port)',
            analyzeFn: (p, success, error, log, contentDiv) => {
                const contextualContent = getAIAnswerGeneratorContext(p);
                if (!contextualContent) {
                    return error('错误：无法获取帖子内容或上下文。');
                }

                const encodedPrompt = encodeURIComponent(contextualContent);
                const upstreamUrl = `https://text.pollinations.ai/${encodedPrompt}?model=openai`;

                const headers = {
                    "Accept": "*/*",
                    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "Origin": "https://aianswergenerator.pro",
                    "Referer": "https://aianswergenerator.pro/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                };

                log('info', `请求上游 URL: GET ${upstreamUrl}`);

                callApi({
                    service: 'AIAnswerGenerator',
                    log,
                    url: upstreamUrl,
                    method: 'GET',
                    headers: headers,
                }).then(fullText => {
                    log('info', `收到上游完整响应，长度: ${fullText.length} characters.`);
                    log('info', "开始执行伪流式生成...");
                    contentDiv.classList.remove('loading');
                    contentDiv.innerHTML = ''; // 清空加载状态

                    let accumulatedText = '';
                    const chars = Array.from(fullText); // 使用 Array.from 支持 Unicode
                    let i = 0;
                    const streamDelay = 10; // 伪流式延迟（毫秒）

                    function streamCharacter() {
                        if (i < chars.length) {
                            accumulatedText += chars[i];
                            // 每隔几个字符更新一次DOM，以提高性能
                            if (i % 2 === 0 || i === chars.length - 1) {
                                contentDiv.innerHTML = simpleMarkdownParse(accumulatedText);
                                contentDiv.scrollTop = contentDiv.scrollHeight; // 自动滚动到底部
                            }
                            i++;
                            setTimeout(streamCharacter, streamDelay);
                        } else {
                            // 确保最终内容被完全解析和渲染
                            contentDiv.innerHTML = simpleMarkdownParse(accumulatedText);
                            log('success', '伪流式生成完成。');
                            // 调用 success 回调函数，以便复制等功能能获取到最终结果
                            success(simpleMarkdownParse(accumulatedText), accumulatedText);
                        }
                    }
                    streamCharacter();

                }).catch(e => {
                    error(`AIAnswerGenerator 请求失败: ${e.message || e}`);
                });
            }
        });
    }


    // --- [v19.4] 核心功能卡片 ---

    function createThinkAnyCard(post, mode, title, cardClass) {
        return createCard(post, {
            cardClass, title,
            analyzeFn: (p, success, error, log) => {
                const contextualContent = getThinkAnyContext(p);
                if (!contextualContent) return error('错误：无法获取帖子内容或上下文。');

                const headers = {
                    "Content-Type": "application/json", "Cookie": THINKANY_COOKIE,
                    "Origin": "https://thinkany.ai", "Referer": "https://thinkany.ai/zh",
                };
                const payload = {
                    "conv_uuid": `m-${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`,
                    "uuid": crypto.randomUUID(),
                    "role": "user", "content": contextualContent,
                    "llm_model": "gpt-4o-mini", "locale": "zh", "mode": mode,
                    "source": "all", "action": `init_${mode}`
                };

                log('info', `准备请求 ThinkAny (模式: ${mode})，已包含上下文...`);
                callApi({
                    service: 'ThinkAny', log,
                    url: "https://thinkany.ai/api/chat/completions",
                    headers: headers, data: JSON.stringify(payload),
                }).then(responseText => {
                    log('info', 'ThinkAny 数据流接收完毕，开始解析...');
                    let fullContent = '';
                    const lines = responseText.trim().split('\n');

                    lines.forEach(line => {
                        if (!line.startsWith('data:')) return;
                        const contentStr = line.substring(5).trim();
                        if (!contentStr || contentStr === '[DONE]') return;

                        try {
                            const data = JSON.parse(contentStr);
                            let md_part = '';
                            if (data.object === "stream.event") {
                                const msg = data.metadata?.msg;
                                if (msg?.questions && !fullContent.includes('### 搜索过程')) {
                                    md_part = `### 搜索过程\n${msg.questions.map(q => `- ${q}`).join('\n')}\n\n`;
                                }
                                if (msg?.rag_results && !fullContent.includes('### 来源')) {
                                    md_part = `### 来源\n${msg.rag_results.map((r, i) => `${i+1}. [${r.title}](${r.link})`).join('\n')}\n\n`;
                                }
                            } else if (data.object === "chat.completion.chunk") {
                                if (fullContent === '' && mode === 'search' && !fullContent.includes('### 答案')) {
                                    md_part = '### 答案\n';
                                }
                                md_part += data.choices[0]?.delta?.content || '';
                            }
                            fullContent += md_part;
                        } catch (e) {
                            log('warn', `解析SSE数据块失败: ${e}, 内容: ${contentStr}`);
                        }
                    });
                    success(simpleMarkdownParse(fullContent), fullContent);
                }).catch(e => error(`ThinkAny 请求失败: ${e.message || e}`));
            }
        });
    }

    function createEyeDanceCard(post) {
        return createCard(post, {
            cardClass: 'eyedance-image-card', title: '文生图 (EyeDance)',
            analyzeFn: (p, success, error, log, contentDiv) => {
                const postContent = p.querySelector('.cooked')?.innerText.trim();
                if (!postContent) return error('错误：无法获取帖子内容。');

                contentDiv.innerHTML = `
                    <div class="eyedance-image-grid">
                        <div id="eyedance-flux"><h4>Flux-Krea</h4><p class="loading">正在生成...</p></div>
                    </div>`;

                const models = ['Flux-Krea'];
                const promises = models.map(modelKey => {
                    const apiModelName = modelKey;

                    const headers = {
                        "Content-Type": "application/json", "Origin": "https://eyedance.net",
                        "Referer": "https://eyedance.net/es/flux-krea",
                        "Cookie": "NEXT_LOCALE=es; active_theme=default"
                    };

                    const payload = {
                        "prompt": postContent, "width": 600, "height": 450, "steps": 20,
                        "batch_size": 1, "model": apiModelName, "seed": Math.floor(Math.random() * 1000000)
                    };

                    log('info', `开始为模型 ${apiModelName} 生成图像...`);
                    return callApi({
                        service: `EyeDance-${apiModelName}`, log,
                        url: "https://eyedance.net/api/generate",
                        headers: headers, data: JSON.stringify(payload)
                    }).then(res => ({ modelKey, res })).catch(err => ({ modelKey, err }));
                });

                Promise.all(promises).then(results => {
                    results.forEach(result => {
                        const container = contentDiv.querySelector(`#eyedance-flux`);
                        if (result.err) {
                            log('error', `模型 ${result.modelKey} 生成失败: ${result.err}`);
                            container.innerHTML = `<h4>${result.modelKey}</h4><p style="color:red;">生成失败</p>`;
                        } else {
                            try {
                                const data = JSON.parse(result.res);
                                const b64 = data.imageUrl.split(',')[1];
                                log('success', `模型 ${result.modelKey} 生成成功。`);
                                container.innerHTML = `<h4>${result.modelKey}</h4><img src="data:image/png;base64,${b64}" />`;
                            } catch (e) {
                                log('error', `解析模型 ${result.modelKey} 响应失败: ${e}`);
                                container.innerHTML = `<h4>${result.modelKey}</h4><p style="color:red;">解析失败</p>`;
                            }
                        }
                    });
                });
            }
        });
    }


    // --- 原有卡片创建函数 ---

    function createGoblinCard(post, model, title) {
        return createCard(post, {
            cardClass: ``, 'data-model': model, title,
            analyzeFn: (p, success, error, log) => {
                const contextualContent = getContextualContent(p, title);
                if (!contextualContent) return error('错误：无法获取帖子内容。');
                log('info', '已生成上下文内容，准备请求 Goblin.tools...');
                callApi({
                    service: 'Goblin.tools', log,
                    url: model === 'JudgeTone' ? "https://goblin.tools/api/ToneJudger/JudgeTone" : "https://goblin.tools/api/ToneJudger/SuggestResponse",
                    headers: { "Content-Type": "application/json", "Referer": "https://goblin.tools/Judge" },
                    data: JSON.stringify({ "Texts": [contextualContent] }),
                }).then(res => {
                    log('info', '响应接收成功，正在进行最终渲染...');
                    if (model === 'JudgeTone') {
                        const keywords = ["困惑", "焦虑", "担忧", "不满", "烦恼", "失望", "不安", "不确定感", "愤怒", "失落感", "渴望"];
                        let highlightedRes = escapeHtml(res);
                        keywords.forEach(kw => {
                            highlightedRes = highlightedRes.replace(new RegExp(kw, "g"), `<span class="emotion-highlight">${kw}</span>`);
                        });
                        success(highlightedRes, res);
                    } else {
                        success(simpleMarkdownParse(res), res);
                    }
                }).catch(error);
            }
        });
    }

    function createFormalizerBox(post) {
        return createCard(post, {
            cardClass: 'goblin-formalizer-box', title: 'AI 多维分析',
            analyzeFn: (p, success, error, log, contentDiv) => {
                const postContent = p.querySelector('.cooked')?.innerText.trim();
                if (!postContent) return error('错误：无法获取帖子内容。');

                const FORMALIZER_CONVERSIONS = [
                    { type: 'accessible', label: '更易懂' }, { type: 'readable', label: '更容易理解' },
                    { type: 'technical', label: '更技术化' }, { type: 'professional', label: '更专业' },
                    { type: 'bullets', label: '要点' }
                ];

                const container = document.createElement('div');
                FORMALIZER_CONVERSIONS.forEach((conv, index) => {
                    const itemDiv = document.createElement('div');
                    itemDiv.id = `formalizer-section-${index}`;
                    itemDiv.className = `formalizer-section formalizer-section-${index}`;
                    itemDiv.innerHTML = `<h4 class="loading-text">正在分析 (${conv.label})...</h4>`;
                    container.appendChild(itemDiv);
                });
                success(container.innerHTML, '');

                const allRawTexts = {};

                FORMALIZER_CONVERSIONS.forEach((conv, index) => {
                    const contextualContent = getContextualContent(p, `将其转换为“${conv.label}”的风格`);
                    log('info', `多维分析: 请求转换风格为 "${conv.label}"...`);

                    callApi({
                        service: 'Goblin.tools', log, url: "https://goblin.tools/api/Formalizer",
                        headers: { "Content-Type": "application/json", "Referer": "https://goblin.tools/Formalizer" },
                        data: JSON.stringify({ "Text": contextualContent, "Conversion": conv.type, "Spiciness": "3" }),
                    }).then(res => {
                        log('success', `多维分析: "${conv.label}" 风格转换成功。`);
                        const itemDiv = contentDiv.querySelector(`#formalizer-section-${index}`);
                        if (itemDiv) {
                            itemDiv.innerHTML = `<h4>答案 (${conv.label}):</h4>${simpleMarkdownParse(res)}`;
                        }
                        allRawTexts[conv.label] = res;
                    }).catch(err => {
                        log('error', `多维分析: "${conv.label}" 风格转换失败: ${err}`);
                        const itemDiv = contentDiv.querySelector(`#formalizer-section-${index}`);
                        if (itemDiv) {
                            itemDiv.innerHTML = `<h4>答案 (${conv.label}):</h4><span style="color:red;">${escapeHtml(String(err))}</span>`;
                        }
                        allRawTexts[conv.label] = `错误: ${err}`;
                    });
                });
            }
        });
    }

    function createConsultantBox(post) {
        return createCard(post, {
            cardClass: 'goblin-consultant-box', title: '顾问 (利弊分析)',
            analyzeFn: (p, success, error, log) => {
                const contextualContent = getContextualContent(p, '顾问');
                if (!contextualContent) return error('错误：无法获取帖子内容。');
                log('info', '已生成上下文内容，准备请求 Goblin.tools (顾问)...');
                callApi({
                    service: 'Goblin.tools', log, url: "https://goblin.tools/api/decider",
                    headers: { "Content-Type": "application/json", "Referer": "https://goblin.tools/Consultant" },
                    data: JSON.stringify({ "Text": contextualContent }),
                }).then(res => {
                    log('info', '响应接收成功，正在解析JSON...');
                    const result = JSON.parse(res);
                    const html = `
                        <div class="consultant-section consultant-pros">
                            <h4>利 (Pros):</h4>
                            <p>${escapeHtml(result.pro)}</p>
                        </div>
                        <div class="consultant-section consultant-cons">
                            <h4>弊 (Cons):</h4>
                            <p>${escapeHtml(result.con)}</p>
                        </div>
                        <div class="consultant-section consultant-advice">
                            <h4>综合建议:</h4>
                            <p>${escapeHtml(result.advice)}</p>
                        </div>`;
                    const raw = `利 (Pros):\n${result.pro}\n\n弊 (Cons):\n${result.con}\n\n综合建议:\n${result.advice}`;
                    success(html, raw);
                }).catch(error);
            }
        });
    }

    function createProfessorBox(post) {
        return createCard(post, {
            cardClass: 'goblin-professor-box', title: '教授 (深度解析)',
            analyzeFn: (p, success, error, log) => {
                const contextualContent = getContextualContent(p, '教授');
                if (!contextualContent) return error('错误：无法获取帖子内容。');
                log('info', '已生成上下文内容，准备请求 Goblin.tools (教授)...');
                callApi({
                    service: 'Goblin.tools', log, url: "https://goblin.tools/api/explainer",
                    headers: { "Content-Type": "application/json", "Referer": "https://goblin.tools/Professor" },
                    data: JSON.stringify({ "Text": contextualContent, "Spiciness": "3" }),
                }).then(res => {
                    log('info', '响应接收成功，正在解析JSON...');
                    const result = JSON.parse(res);
                    const html = `<div class="professor-explanation"><h4>解释 (Explanation):</h4><p>${escapeHtml(result.explanation)}</p></div><div class="professor-example"><h4>示例 (Example):</h4><p>${escapeHtml(result.example)}</p></div>`;
                    const raw = `解释 (Explanation):\n${result.explanation}\n\n示例 (Example):\n${result.example}`;
                    success(html, raw);
                }).catch(error);
            }
        });
    }

    function createDreamCard(post) {
        return createCard(post, {
            cardClass: 'dream-result-card', title: '梦境解答',
            analyzeFn: (p, success, error, log) => {
                const postContent = p.querySelector('.cooked')?.innerText.trim();
                if (!postContent) return error('错误：无法获取帖子内容。');
                const finalDreamCookie = USER_DREAM_COOKIE.replace(/\$\$/g, '$');
                if (!finalDreamCookie || finalDreamCookie.includes("在此处粘贴")) return error("错误：尚未配置有效的梦境解答 Cookie。");
                log('info', '准备请求 DreamInterpreter.ai...');
                callApi({
                    service: 'DreamInterpreter', log, url: "https://www.dreaminterpreter.ai/",
                    headers: { "Content-Type": "text/plain;charset=UTF-8", "Referer": "https://www.dreaminterpreter.ai/", "Cookie": finalDreamCookie, "next-action": "40f12b58f04c47f0b77d33de1b8e910dbff9059260" },
                    data: JSON.stringify([{"dream": postContent, "country": "CN", "language": "zh-CN", "userID": crypto.randomUUID()}]),
                }).then(res => {
                    log('info', '响应接收成功，正在解析...');
                    const jsonStartIndex = res.indexOf('1:');
                    if (jsonStartIndex === -1) throw new Error("响应格式错误");
                    const data = JSON.parse(res.substring(jsonStartIndex + 2));
                    const { title, interpretation } = data.dream;
                    const rawInterpretation = interpretation.replace(/\\n/g, '\n');
                    const interpretationHtml = simpleMarkdownParse(rawInterpretation);
                    const html = `<h2>${escapeHtml(title)}</h2>${interpretationHtml}`;
                    const raw = `## ${title}\n\n${rawInterpretation}`;
                    success(html, raw);
                }).catch(e => error(`解析响应失败: ${e.message || e}`));
            }
        });
    }

    function createSummarizerCard(post) {
        return createCard(post, {
            cardClass: 'summarizer-result-card', title: '文章摘要',
            analyzeFn: (p, success, error, log) => {
                const postContent = p.querySelector('.cooked')?.innerText.trim();
                const match = postContent.match(URL_REGEX);
                if (!match) return error('未在帖子内容中找到有效链接。');
                const link = match[0];
                log('info', `已提取链接: ${link}，准备请求 ArticleSummarizer...`);
                callApi({
                    service: 'ArticleSummarizer', log, url: "https://pjfuothbq9.execute-api.us-east-1.amazonaws.com/upload-link",
                    headers: { "Content-Type": "application/json", "Origin": "https://articlesummarizer.com", "Referer": "https://articlesummarizer.com/" },
                    data: JSON.stringify({ "link": link, "website": "article-summarizer" }),
                }).then(res => {
                    log('info', '响应接收成功，正在解析...');
                    const outer = JSON.parse(res);
                    const bodyStr = outer.result?.body;
                    if (!bodyStr) throw new Error("响应格式不正确，未找到 'result.body'。");
                    const inner = JSON.parse(bodyStr);
                    const summary = inner.summary;
                    if (!summary) throw new Error("摘要内容为空。");
                    success(`<p>${escapeHtml(summary)}</p>`, summary);
                }).catch(e => error(`解析摘要响应失败: ${e.message || e}`));
            }
        });
    }

    function createMyMapCard(post) {
        return createCard(post, {
            cardClass: 'mymap-result-card', title: '思维导图 / 流程图',
            analyzeFn: (p, success, error, log) => {
                const contextualContent = getContextualContent(p, '为以下内容生成思维导图');
                if (!contextualContent) return error('错误：无法获取帖子内容。');
                log('info', '已生成上下文内容，准备请求 MyMap.ai...');
                callApi({
                    service: 'MyMap.ai', log, url: "https://www.mymap.ai/sapi/aichat",
                    headers: { "Content-Type": "application/json", "Referer": "https://www.mymap.ai/", "X-Distinct-Id": crypto.randomUUID() },
                    data: JSON.stringify({ messages: [{ type: "text", content: contextualContent }], board_id: crypto.randomUUID().replace(/-/g, '').substring(0, 13), playground: true }),
                }).then(res => {
                    log('info', '响应接收成功，正在查找可视化数据块...');
                    const visualMatch = res.match(/<visual[\s\S]*?<\/visual>/);
                    if (visualMatch) {
                        log('success', '已找到可视化数据，开始渲染...');
                        const visualHtml = renderMyMapVisual(visualMatch[0]);
                        success(visualHtml, res);
                    } else {
                        log('warn', '未能从响应中找到可视化数据块。');
                        const errorMessage = `未能生成可视化图表。API返回了以下文本信息，这通常意味着输入内容无法被解析为图表：\n\n---\n\n${escapeHtml(res)}`;
                        success(`<p>${errorMessage.replace(/\n/g, '<br>')}</p>`, res);
                    }
                }).catch(error);
            }
        });
    }

    function createDecopyCard(post) {
        return createCard(post, {
            cardClass: 'decopy-result-card', title: '简洁回复',
            analyzeFn: (p, success, error, log) => {
                const contextualContent = getContextualContent(p, '简洁回复');
                if (!contextualContent) return error('错误：无法获取帖子内容。');

                const boundary = `----WebKitFormBoundary${crypto.randomUUID()}`;
                let data = `--${boundary}\r\n` +
                    `Content-Disposition: form-data; name="entertext"\r\n\r\n${contextualContent}\r\n` +
                    `--${boundary}\r\n` +
                    `Content-Disposition: form-data; name="chat_id"\r\n\r\n${crypto.randomUUID()}\r\n` +
                    `--${boundary}\r\n` +
                    `Content-Disposition: form-data; name="model"\r\n\r\nDeepSeek-V3\r\n` +
                    `--${boundary}--\r\n`;

                log('info', '已构造 multipart/form-data 请求体，准备提交 Decopy 任务...');
                callApi({
                    service: 'Decopy.ai', log, url: "https://api.decopy.ai/api/decopy/ask-ai/create-job",
                    method: 'POST',
                    headers: { "Content-Type": `multipart/form-data; boundary=${boundary}`, "product-code": DECOPY_PRODUCT_CODE, "product-serial": DECOPY_PRODUCT_SERIAL },
                    data: data,
                }).then(res => {
                    log('info', '创建任务响应成功，正在解析 Job ID...');
                    const jobData = JSON.parse(res);
                    if (jobData.code !== 100000 || !jobData.result?.job_id) {
                        throw new Error(jobData.message?.zh || '创建任务失败');
                    }
                    const jobId = jobData.result.job_id;
                    log('info', `任务创建成功, Job ID: ${jobId}。开始轮询结果...`);
                    pollDecopyJob(jobId, success, error, log);
                }).catch(e => error(`处理Decopy任务创建响应失败: ${e.message || e}`));
            }
        });
    }

    function pollDecopyJob(jobId, success, error, log, retries = 15) {
        if (retries <= 0) return error('获取Decopy结果超时。');
        log('info', `正在轮询 Decopy 结果... (剩余尝试: ${retries})`);
        setTimeout(() => {
            callApi({
                service: 'Decopy.ai', log, url: `https://api.decopy.ai/api/decopy/ask-ai/get-job/${jobId}`, method: 'GET',
                headers: { "product-code": DECOPY_PRODUCT_CODE, "product-serial": DECOPY_PRODUCT_SERIAL },
            }).then(res => {
                const lines = res.trim().split('\n');
                let fullContent = '';
                let finished = false;
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const dataStr = line.substring(5).trim();
                        if (dataStr === 'Data transfer completed.') { finished = true; break; }
                        if (dataStr) {
                            try {
                                const data = JSON.parse(dataStr);
                                if (data.data) fullContent += data.data;
                            } catch(e) {
                                log('warn', `无法解析Decopy JSON块: ${dataStr}`);
                            }
                        }
                    }
                }
                if (fullContent) {
                    log('success', '成功获取到 Decopy 结果。');
                    success(simpleMarkdownParse(fullContent), fullContent);
                } else if (finished) {
                    log('warn', 'Decopy 流结束但未返回任何内容。');
                    error('Decopy 未返回有效内容。');
                } else {
                    pollDecopyJob(jobId, success, error, log, retries - 1);
                }
            }).catch(err => {
                log('warn', `轮询时遇到错误: ${err}, 继续轮询...`);
                pollDecopyJob(jobId, success, error, log, retries - 1);
            });
        }, 2000);
    }

    function renderMyMapVisual(xmlString) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlString, "application/xml");
            if (doc.getElementsByTagName("parsererror").length) throw new Error("XML解析失败");
            const root = doc.documentElement;
            const tree = markdownToTree(root.textContent);
            if (!tree) return `<p style="color:orange;">内容无法解析为思维导图。</p>`;
            const svgContainerId = `map-${crypto.randomUUID()}`;
            const container = document.createElement('div');
            container.className = 'mymap-svg-container';
            container.id = svgContainerId;
            container.innerHTML = generateMindmapSVG(tree);
            container.dataset.tree = JSON.stringify(tree, (key, value) => {
                if (key === 'parent') return undefined;
                return value;
            });
            return container.outerHTML;
        } catch (e) {
            return `<p style="color:red;">渲染可视化内容失败: ${e.message}</p><pre>${escapeHtml(xmlString)}</pre>`;
        }
    }

    function markdownToTree(markdown) {
        const lines = markdown.trim().split('\n');
        const root = { text: 'Root', children: [], level: 0, description: '', id: 'root' };
        const stack = [root];
        lines.forEach(line => {
            const match = line.match(/^(#+)\s*(.*)/);
            if (match) {
                const level = match[1].length;
                const text = match[2].trim();
                const newNode = { text, children: [], level, description: '', id: crypto.randomUUID(), collapsed: false };
                while (stack.length > level) stack.pop();
                newNode.parent = stack[stack.length - 1];
                stack[stack.length - 1].children.push(newNode);
                stack.push(newNode);
            } else if (stack.length > 1) {
                stack[stack.length - 1].description += ` ${line.trim()}`;
            }
        });
        return root.children[0];
    }

    function generateMindmapSVG(rootNode) {
        if (!rootNode) return '';
        const nodeW = 180, nodeH = 65, hSpace = 40, vSpace = 20;
        const colors = ["#3498db", "#8e44ad", "#27ae60", "#f39c12", "#d35400", "#c0392b"];
        const allNodes = [];

        function traverseAndLayout(node, level = 0, y_offset = { y: vSpace }) {
            node.x = level * (nodeW + hSpace);
            node.y = y_offset.y;
            node.level = level;
            allNodes.push(node);

            y_offset.y += nodeH + vSpace;

            if (!node.collapsed) {
                for (const child of node.children) {
                    traverseAndLayout(child, level + 1, y_offset);
                }
            }
        }

        traverseAndLayout(rootNode);

        if (allNodes.length === 0) return '<p style="text-align:center; color: #888;">无法渲染，没有可见节点。</p>';

        let nodesHtml = '', linksHtml = '';
        allNodes.forEach(node => {
            const color = colors[node.level % colors.length];
            const desc = node.description ? `<tspan x="15" dy="1.2em" class="desc">${escapeHtml(node.description.substring(0, 25))}${node.description.length > 25 ? '...' : ''}</tspan>` : '';
            const collapseHandle = node.children.length > 0 ? `
                <g class="collapse-handle">
                    <circle cx="${nodeW}" cy="${nodeH / 2}" r="8" fill="#f0f0f0" stroke="${color}" />
                    <line class="collapse-handle-minus" x1="${nodeW - 4}" y1="${nodeH / 2}" x2="${nodeW + 4}" y2="${nodeH / 2}" stroke="${color}" stroke-width="2" />
                    <line class="collapse-handle-plus" x1="${nodeW}" y1="${nodeH / 2 - 4}" x2="${nodeW}" y2="${nodeH / 2 + 4}" stroke="${color}" stroke-width="2" />
                </g>` : '';

            nodesHtml += `
                <g class="node ${node.collapsed ? 'collapsed' : ''}" id="node-${node.id}" data-id="${node.id}" transform="translate(${node.x}, ${node.y})">
                    <rect width="${nodeW}" height="${nodeH}" rx="10" fill="#fff" stroke="${color}"></rect>
                    <text x="15" y="25" class="title" fill="${color}">${escapeHtml(node.text)}</text>
                    <text x="15" y="25" dy="1.4em">${desc}</text>
                    ${collapseHandle}
                </g>`;

            if (node.parent) {
                linksHtml += `<path class="link" id="link-to-${node.id}" data-target-id="${node.id}" d="M ${node.parent.x + nodeW} ${node.parent.y + nodeH / 2} C ${node.parent.x + nodeW + hSpace / 2} ${node.parent.y + nodeH / 2}, ${node.x - hSpace / 2} ${node.y + nodeH / 2}, ${node.x} ${node.y + nodeH / 2}"></path>`;
            }
        });

        const bbox = {
            minX: Math.min(...allNodes.map(n => n.x)),
            minY: Math.min(...allNodes.map(n => n.y)),
            maxX: Math.max(...allNodes.map(n => n.x + nodeW)),
            maxY: Math.max(...allNodes.map(n => n.y + nodeH)),
        };
        const viewWidth = bbox.maxX - bbox.minX;
        const viewHeight = bbox.maxY - bbox.minY;

        return `<svg width="100%" height="100%" viewBox="${bbox.minX - 40} ${bbox.minY - 20} ${viewWidth + 120} ${viewHeight + 40}"><g>${linksHtml}${nodesHtml}</g></svg>`;
    }


    // --- 5. 设置、主题与悬浮球 ---
    const SETTINGS_KEY = 'superAnalyzerSettings_v4';
    const DEFAULT_SETTINGS = Object.keys(ANALYSIS_TOOLS).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    let intersectionObserver = null;

    function loadSettings() {
        try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY)) }; }
        catch (e) { return DEFAULT_SETTINGS; }
    }
    function saveSettings(settings) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('sa-dark-theme');
        } else {
            document.body.classList.remove('sa-dark-theme');
        }
        const themeButton = document.querySelector('[data-action="toggle-theme"]');
        if (themeButton) {
            themeButton.textContent = theme === 'dark' ? '切换到浅色模式' : '切换到深色模式';
        }
    }

    function toggleTheme() {
        const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
        applyTheme(newTheme);
    }

    function createMainUI() {
        const faviconUrl = document.querySelector('link[rel="icon"]')?.href || 'https://cdn.linux.do/uploads/default/optimized/3X/6/f/6f47356b54ada865485956b15a311c05b8f78a75_2_32x32.png';
        const fabContainer = document.createElement('div'); fabContainer.id = 'goblin-fab-container';

        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
        const themeButtonText = savedTheme === 'dark' ? '切换到浅色模式' : '切换到深色模式';

        fabContainer.innerHTML = `
            <div id="goblin-fab-menu">
                <button class="goblin-fab-menu-button" data-action="toggle-theme">${themeButtonText}</button>
                <button class="goblin-fab-menu-button" data-action="settings">打开设置</button>
                <button class="goblin-fab-menu-button" data-action="topic-tree">帖子结构树</button>
                <button class="goblin-fab-menu-button" data-action="close-all">关闭所有卡片</button>
            </div>
            <div id="goblin-fab-button" title="助手菜单"><img src="${faviconUrl}"></div>`;
        document.body.appendChild(fabContainer);

        const modalOverlay = document.createElement('div'); modalOverlay.id = 'goblin-modal-overlay';
        modalOverlay.innerHTML = `<div id="goblin-settings-modal"><div id="goblin-settings-header"><span>显示设置</span><button id="goblin-settings-close-btn">&times;</button></div><div id="goblin-settings-body"></div></div>`;
        document.body.appendChild(modalOverlay);

        const treeWindow = document.createElement('div');
        treeWindow.id = 'topic-tree-window';
        treeWindow.style.display = 'none';
        treeWindow.innerHTML = `
          <div class="resize-handle resize-handle-n"></div><div class="resize-handle resize-handle-ne"></div><div class="resize-handle resize-handle-e"></div><div class="resize-handle resize-handle-se"></div><div class="resize-handle resize-handle-s"></div><div class="resize-handle resize-handle-sw"></div><div class="resize-handle resize-handle-w"></div><div class="resize-handle resize-handle-nw"></div>
          <div id="topic-tree-window-header">
            <span id="topic-tree-window-title">帖子结构树</span>
            <div id="topic-tree-window-toolbar">
              <label><input type="checkbox" id="tree-toggle-content" checked> 显示内容</label>
              <button id="tree-recenter-btn" class="toolbar-button" title="居中视图">${ICONS_SVG.recenter}</button>
              <button id="tree-copy-btn" class="toolbar-button" title="复制结构为文本">${ICONS_SVG.copy}</button>
              <button id="tree-export-txt-btn" class="toolbar-button" title="将结构导出为 .txt 文件">${ICONS_SVG.export_txt} 导出文本</button>
              <button id="tree-export-md-btn" class="toolbar-button" title="将结构导出为 .md 文件">${ICONS_SVG.export_md} 导出MD</button>
              <button id="tree-log-btn" class="toolbar-button" title="显示/隐藏日志">${ICONS_SVG.log}</button>
              <button id="tree-window-close-btn" title="关闭">&times;</button>
            </div>
          </div>
          <div id="topic-tree-window-body"><p style="text-align:center; padding: 20px;">请先打开一个帖子</p></div>
          <div class="log-container" id="topic-tree-log-container"></div>`;
        document.body.appendChild(treeWindow);

        // 应用已保存的窗口几何信息
        const savedGeometry = localStorage.getItem(GEOMETRY_STORAGE_KEY);
        if (savedGeometry) {
            const { top, left, width, height } = JSON.parse(savedGeometry);
            treeWindow.style.top = top;
            treeWindow.style.left = left;
            treeWindow.style.width = width;
            treeWindow.style.height = height;
        }

        const settingsBody = document.getElementById('goblin-settings-body');
        let currentSettings = loadSettings();
        for (const key in ANALYSIS_TOOLS) {
            const item = document.createElement('div'); item.className = 'goblin-setting-item';
            item.innerHTML = `<label><input type="checkbox" data-setting="${key}" ${currentSettings[key] ? 'checked' : ''}> ${ANALYSIS_TOOLS[key].label}</label>`;
            settingsBody.appendChild(item);
        }

        settingsBody.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                currentSettings[e.target.dataset.setting] = e.target.checked;
                saveSettings(currentSettings);
            }
        });

        const fabButton = document.getElementById('goblin-fab-button');
        const fabMenu = document.getElementById('goblin-fab-menu');
        fabButton.addEventListener('click', () => fabMenu.classList.toggle('visible'));
        document.addEventListener('click', (e) => { if (!fabContainer.contains(e.target)) fabMenu.classList.remove('visible'); });

        fabMenu.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action === 'settings') modalOverlay.classList.add('visible');
            if (action === 'topic-tree') toggleTopicTreeWindow();
            if (action === 'close-all') document.querySelectorAll('.goblin-results-wrapper').forEach(w => w.remove());
            if (action === 'toggle-theme') toggleTheme();
            fabMenu.classList.remove('visible');
        });

        document.getElementById('goblin-settings-close-btn').addEventListener('click', () => modalOverlay.classList.remove('visible'));
        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) modalOverlay.classList.remove('visible'); });

        document.getElementById('tree-window-close-btn').addEventListener('click', () => {
            toggleTopicTreeWindow(); // Use the main toggle function to handle state saving
        });
        document.getElementById('tree-log-btn').addEventListener('click', () => {
            document.getElementById('topic-tree-log-container').classList.toggle('visible');
        });

        makeDraggable(treeWindow, document.getElementById('topic-tree-window-header'));
        makeResizable(treeWindow);
        makeDraggable(fabContainer, fabButton);
    }

    function saveWindowGeometry(element) {
        const geometry = {
            top: element.style.top,
            left: element.style.left,
            width: element.style.width,
            height: element.style.height,
        };
        localStorage.setItem(GEOMETRY_STORAGE_KEY, JSON.stringify(geometry));
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = function(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.body.classList.add('dragging-no-select');
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
            document.body.classList.remove('dragging-no-select');
            document.onmouseup = null;
            document.onmousemove = null;
            if (element.id === 'topic-tree-window') {
                saveWindowGeometry(element);
            }
        }
    }

    function makeResizable(element) {
        const handles = element.querySelectorAll('.resize-handle');
        let original_width = 0, original_height = 0, original_x = 0, original_y = 0, original_mouse_x = 0, original_mouse_y = 0;

        handles.forEach(handle => {
            handle.addEventListener('mousedown', function(e) {
                e.preventDefault();
                original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
                original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
                original_x = element.getBoundingClientRect().left;
                original_y = element.getBoundingClientRect().top;
                original_mouse_x = e.pageX;
                original_mouse_y = e.pageY;
                document.body.classList.add('dragging-no-select');
                window.addEventListener('mousemove', resize);
                window.addEventListener('mouseup', stopResize);
            });

            function resize(e) {
                const className = handle.className;
                if (className.includes('resize-handle-se') || className.includes('resize-handle-e') || className.includes('resize-handle-ne')) {
                    const width = original_width + (e.pageX - original_mouse_x);
                    if (width > 400) element.style.width = width + 'px';
                }
                if (className.includes('resize-handle-se') || className.includes('resize-handle-s')) {
                    const height = original_height + (e.pageY - original_mouse_y);
                    if (height > 300) element.style.height = height + 'px';
                }
                if (className.includes('resize-handle-sw') || className.includes('resize-handle-w')) {
                    const width = original_width - (e.pageX - original_mouse_x);
                    if (width > 400) {
                        element.style.width = width + 'px';
                        element.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
                    }
                }
                if (className.includes('resize-handle-nw') || className.includes('resize-handle-n') || className.includes('resize-handle-ne')) {
                    const height = original_height - (e.pageY - original_mouse_y);
                    if (height > 300) {
                        element.style.height = height + 'px';
                        element.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
                    }
                }
            }

            function stopResize() {
                document.body.classList.remove('dragging-no-select');
                window.removeEventListener('mousemove', resize);
                if (element.id === 'topic-tree-window') {
                    saveWindowGeometry(element);
                }
            }
        });
    }

    // --- 6. 页面扫描与按钮注入 ---
    function onAnalyzeButtonClick(e) {
        const post = e.currentTarget.closest('article.boxed'); if (!post) return;
        let resultsWrapper = post.querySelector('.goblin-results-wrapper');
        if (resultsWrapper) { resultsWrapper.remove(); }
        else {
            resultsWrapper = document.createElement('div'); resultsWrapper.className = 'goblin-results-wrapper';
            post.querySelector('.post__contents')?.insertAdjacentElement('afterend', resultsWrapper);
            const settings = loadSettings();
            const postContent = post.querySelector('.cooked')?.innerText.trim() || '';
            const hasUrl = URL_REGEX.test(postContent);
            let hasEnabledTool = false;
            for (const key in settings) {
                if (settings[key] && ANALYSIS_TOOLS[key]) {
                    if (ANALYSIS_TOOLS[key].requiresUrl && !hasUrl) continue;
                    resultsWrapper.appendChild(ANALYSIS_TOOLS[key].create(post));
                    hasEnabledTool = true;
                }
            }
            if (!hasEnabledTool) resultsWrapper.innerHTML = '<div style="text-align:center; color:#888;">没有已启用且适用的分析工具。</div>';
            resultsWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function processPost(post) {
        if (post.dataset.superAnalyzer) return;
        post.dataset.superAnalyzer = 'true';
        const controls = post.querySelector('nav.post-controls .actions');
        if (!controls) return;
        const faviconUrl = document.querySelector('link[rel="icon"]')?.href || 'https://cdn.linux.do/uploads/default/optimized/3X/6/f/6f47356b54ada865485956b15a311c05b8f78a75_2_32x32.png';
        const analyzeBtn = document.createElement('button');
        analyzeBtn.className = 'control-analyze-btn';
        analyzeBtn.title = 'AI 分析 (点击切换)';
        analyzeBtn.innerHTML = `<img src="${faviconUrl}">`;
        analyzeBtn.addEventListener('click', onAnalyzeButtonClick);
        const replyButton = controls.querySelector('.reply');
        if (replyButton) replyButton.parentNode.insertBefore(analyzeBtn, replyButton);
        else controls.appendChild(analyzeBtn);
    }

    // --- 7. 帖子结构树核心功能 ---
    let topicTreeData = null;
    let svgTextMeasurer = null;
    let postLoadObserver = null;
    let postLoadTimeout = null;

    function logToTreeWindow(level, message) {
        const logContainer = document.getElementById('topic-tree-log-container');
        if (!logContainer) return;
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${level}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    function toggleTopicTreeWindow() {
        const windowEl = document.getElementById('topic-tree-window');
        const isOpen = windowEl.style.display === 'none';

        if (isOpen) {
            windowEl.style.display = 'flex';
            localStorage.setItem(WINDOW_STATE_STORAGE_KEY, JSON.stringify({ isOpen: true }));
            refreshTopicTree();
        } else {
            windowEl.style.display = 'none';
            localStorage.setItem(WINDOW_STATE_STORAGE_KEY, JSON.stringify({ isOpen: false }));
            if (intersectionObserver) {
                intersectionObserver.disconnect();
                intersectionObserver = null;
            }
            if (postLoadObserver) {
                postLoadObserver.disconnect();
                postLoadObserver = null;
            }
        }
    }

    function refreshTopicTree() {
        const body = document.getElementById('topic-tree-window-body');
        const logContainer = document.getElementById('topic-tree-log-container');
        logContainer.innerHTML = '';
        body.innerHTML = '<p style="text-align:center; padding: 20px;">正在等待帖子加载...</p>';
        logToTreeWindow('info', '开始刷新，等待帖子加载...');
        waitForPostsToLoad((postCount) => {
            logToTreeWindow('success', `帖子加载稳定，共 ${postCount} 个。开始解析...`);
            try {
                topicTreeData = parseTopicTree();
                logToTreeWindow('success', `帖子解析成功，共找到 ${topicTreeData.children.length} 个顶级节点。`);
                document.getElementById('topic-tree-window-title').textContent = topicTreeData.text;
                renderAndAttachTopicTree(topicTreeData);
                setupTreeInteractions(topicTreeData, true); // isFirstLoad = true
            } catch (error) {
                console.error("生成结构树失败:", error);
                logToTreeWindow('error', `生成结构树失败: ${error.message}`);
                body.innerHTML = `<p style="text-align:center; padding: 20px; color: red;">生成结构树失败: ${error.message}</p>`;
            }
        });
    }

    function waitForPostsToLoad(callback) {
        const selector = 'div.post-stream'; // More reliable container selector
        let attempts = 0;
        const maxAttempts = 50; // 50 * 200ms = 10 seconds timeout
        const interval = setInterval(() => {
            const postStream = document.querySelector(selector);
            logToTreeWindow('info', `正在轮询帖子容器... 第 ${attempts + 1} 次`);

            if (postStream) {
                clearInterval(interval);
                logToTreeWindow('success', '成功找到帖子容器，开始监控帖子内容加载...');

                if (postLoadObserver) postLoadObserver.disconnect();

                const debouncedCallback = () => {
                    if (postLoadObserver) postLoadObserver.disconnect();
                    postLoadObserver = null;
                    const finalPostCount = postStream.querySelectorAll('article.topic-post').length;
                    callback(finalPostCount);
                };

                postLoadObserver = new MutationObserver(() => {
                    logToTreeWindow('info', '检测到帖子列表变化，重置计时器...');
                    clearTimeout(postLoadTimeout);
                    postLoadTimeout = setTimeout(debouncedCallback, 1000); // Wait 1s for stability
                });

                postLoadObserver.observe(postStream, { childList: true, subtree: true });
                clearTimeout(postLoadTimeout);
                postLoadTimeout = setTimeout(debouncedCallback, 1000);

            } else {
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    logToTreeWindow('error', `超时：在 ${maxAttempts * 200 / 1000} 秒内未找到帖子容器 '${selector}'`);
                    const body = document.getElementById('topic-tree-window-body');
                    body.innerHTML = `<p style="text-align:center; padding: 20px; color: red;">错误：无法加载帖子列表，请确保您在帖子页面内。</p>`;
                }
            }
        }, 200);
    }

    function parseTopicTree() {
        logToTreeWindow('info', '正在查找帖子元素...');
        const posts = Array.from(document.querySelectorAll('div.topic-post[data-post-number]'));
        logToTreeWindow('info', `找到 ${posts.length} 个帖子元素。`);
        if (posts.length === 0) throw new Error("页面上没有找到任何帖子。请确保您在帖子页面。");

        const topicTitle = document.querySelector("#topic-title .fancy-title")?.innerText.trim() || '未知主题';
        const nodes = new Map();
        const root = { id: 0, text: topicTitle, children: [], isRoot: true, content: '', htmlContent: '' };

        posts.forEach(postEl => {
            const postNumber = postEl.dataset.postNumber;
            const author = postEl.querySelector('a[data-user-card]')?.innerText.trim() || postEl.querySelector('.username')?.innerText.trim() || '未知作者';
            const cookedEl = postEl.querySelector('.cooked');
            const content = cookedEl?.innerText.trim() || '';
            const htmlContent = cookedEl?.innerHTML.trim() || '';
            const quote = postEl.querySelector('aside.quote[data-post]');
            const parentId = quote ? quote.dataset.post : (postNumber === '1' ? 0 : null);

            nodes.set(postNumber, {
                id: postNumber,
                text: `#${postNumber} - ${author}`,
                author: author,
                content: content,
                htmlContent: htmlContent,
                parentId: parentId,
                children: [],
                collapsed: false
            });
        });
        logToTreeWindow('info', '帖子数据提取完成，正在构建树结构...');

        const treeRoot = nodes.get('1');
        if (treeRoot) {
            root.children.push(treeRoot);
        }

        nodes.forEach(node => {
            if (node.parentId && nodes.has(node.parentId)) {
                const parent = nodes.get(node.parentId);
                parent.children.push(node);
            } else if (node.id !== '1') {
                root.children.push(node);
            }
        });
        logToTreeWindow('info', '树结构构建完成。');
        return root;
    }

    function renderAndAttachTopicTree(treeData) {
        const body = document.getElementById('topic-tree-window-body');
        const showContent = document.getElementById('tree-toggle-content').checked;
        logToTreeWindow('info', '开始渲染SVG...');
        body.innerHTML = generateTopicTreeSVG(treeData, showContent);
        logToTreeWindow('success', 'SVG渲染完成。');

        if (intersectionObserver) intersectionObserver.disconnect();
        const options = { root: null, rootMargin: '-40% 0px -60% 0px', threshold: 0 };
        intersectionObserver = new IntersectionObserver((entries) => {
            const intersectingEntry = entries.find(e => e.isIntersecting);
            if (intersectingEntry) {
                const postNumber = intersectingEntry.target.dataset.postNumber;
                const svg = body.querySelector('svg');
                if (!svg) return;
                svg.querySelectorAll('.node.highlighted').forEach(n => n.classList.remove('highlighted'));
                const targetNode = svg.querySelector(`#node-post-${postNumber}`);
                if (targetNode) {
                    targetNode.classList.add('highlighted');
                }
            }
        }, options);
        document.querySelectorAll('div.topic-post[data-post-number]').forEach(post => intersectionObserver.observe(post));
        logToTreeWindow('info', '滚动高亮功能已启动。');
    }

    function generateTopicTreeSVG(rootNode, showContent) {
        if (!rootNode) return '';
        const nodeW = 220, baseNodeH = 50, hSpace = 50, vSpace = 20;
        const padding = { x: 15, y: 10 };
        const titleH = 25, lineH = 18, maxContentLines = 5;
        const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"];
        const allNodes = [];

        // 智能文本换行核心函数
        function wrapTextWithSVGEnhancement(text, maxWidth) {
            if (!text) return [];
            if (!svgTextMeasurer) {
                const svg = document.getElementById('topic-tree-window-body').querySelector('svg');
                if (!svg) return text.split(' '); // Fallback
                svgTextMeasurer = document.createElementNS("http://www.w3.org/2000/svg", "text");
                svgTextMeasurer.setAttribute('class', 'content-text');
                svgTextMeasurer.style.visibility = 'hidden';
                svg.appendChild(svgTextMeasurer);
            }
            const words = text.replace(/\n/g, ' ').split(' ');
            let lines = [];
            let currentLine = '';
            for (const word of words) {
                const testLine = currentLine + (currentLine ? ' ' : '') + word;
                svgTextMeasurer.textContent = testLine;
                if (svgTextMeasurer.getComputedTextLength() > maxWidth) {
                    if (currentLine) {
                        lines.push(currentLine);
                        currentLine = word;
                    } else { // Word itself is too long
                        let tempWord = word;
                        while (tempWord.length > 0) {
                            let sliceIndex = tempWord.length;
                            svgTextMeasurer.textContent = tempWord.slice(0, sliceIndex);
                            while (svgTextMeasurer.getComputedTextLength() > maxWidth && sliceIndex > 1) {
                                sliceIndex--;
                                svgTextMeasurer.textContent = tempWord.slice(0, sliceIndex) + '...';
                            }
                            lines.push(svgTextMeasurer.textContent);
                            tempWord = tempWord.slice(sliceIndex);
                        }
                        currentLine = '';
                    }
                } else {
                    currentLine = testLine;
                }
            }
            if (currentLine) lines.push(currentLine);
            return lines;
        }

        // 动态计算节点高度
        function calculateNodeMetrics(node) {
            if (node.metrics) return node.metrics;
            let height = baseNodeH;
            let contentLines = [];
            if (showContent && node.content) {
                const wrapped = wrapTextWithSVGEnhancement(node.content, nodeW - padding.x * 2);
                contentLines = wrapped.slice(0, maxContentLines);
                if (wrapped.length > maxContentLines) {
                    contentLines[maxContentLines - 1] = contentLines[maxContentLines - 1].slice(0, -3) + '...';
                }
                height = padding.y + titleH + (contentLines.length > 0 ? padding.y / 2 : 0) + contentLines.length * lineH + padding.y;
            }
            node.metrics = { height, contentLines };
            return node.metrics;
        }

        function layout(node, level = 0, yOffset = { y: vSpace }) {
            node.x = level * (nodeW + hSpace);
            node.y = yOffset.y;
            node.level = level;
            allNodes.push(node);
            const { height } = calculateNodeMetrics(node);
            yOffset.y += height + vSpace;
            if (!node.collapsed && node.children) {
                node.children.forEach(child => layout(child, level + 1, yOffset));
            }
        }

        layout(rootNode, -1);

        let nodesHtml = '', linksHtml = '';
        allNodes.forEach(node => {
            if (node.isRoot) return;
            const color = colors[node.level % colors.length];
            const { height, contentLines } = calculateNodeMetrics(node);
            let contentHtml = contentLines.map((line, i) =>
                `<tspan x="${padding.x}" dy="${i === 0 ? lineH + 5 : lineH}">${escapeHtml(line)}</tspan>`
            ).join('');
            const collapseHandle = node.children && node.children.length > 0 ? `
                <g class="collapse-handle" data-id="${node.id}">
                    <circle cx="${nodeW}" cy="${height / 2}" r="8" fill="#f0f0f0" stroke="${color}" />
                    <line class="collapse-handle-minus" x1="${nodeW - 4}" y1="${height / 2}" x2="${nodeW + 4}" y2="${height / 2}" stroke="${color}" stroke-width="2" style="${node.collapsed ? 'display:none;' : ''}" />
                    <line class="collapse-handle-plus" x1="${nodeW}" y1="${height / 2 - 4}" x2="${nodeW}" y2="${height / 2 + 4}" stroke="${color}" stroke-width="2" style="${node.collapsed ? '' : 'display:none;'}" />
                </g>` : '';
            nodesHtml += `
                <g class="node ${node.collapsed ? 'collapsed' : ''}" id="node-post-${node.id}" data-id="${node.id}" transform="translate(${node.x}, ${node.y})">
                    <rect width="${nodeW}" height="${height}" rx="12" fill="#fff" stroke="${color}"></rect>
                    <text x="${padding.x}" y="${padding.y + 15}" class="title" fill="${color}">${escapeHtml(node.text)}</text>
                    <text class="content-text" x="${padding.x}" y="${padding.y + titleH}">${contentHtml}</text>
                    ${collapseHandle}
                </g>`;
            if (node.parent && !node.parent.isRoot) {
                const parentMetrics = calculateNodeMetrics(node.parent);
                linksHtml += `<path class="link" d="M ${node.parent.x + nodeW} ${node.parent.y + parentMetrics.height / 2} C ${node.parent.x + nodeW + hSpace / 2} ${node.parent.y + parentMetrics.height / 2}, ${node.x - hSpace / 2} ${node.y + height / 2}, ${node.x} ${node.y + height / 2}"></path>`;
            }
        });

        const visibleNodes = allNodes.filter(n => !n.isRoot);
        if (visibleNodes.length === 0) return '<p style="text-align:center; padding: 20px;">没有可显示的帖子。</p>';

        return `<svg class="topic-tree-svg" width="100%" height="100%"><g class="svg-pan-zoom_viewport">${linksHtml}${nodesHtml}</g></svg>`;
    }

    function setupTreeInteractions(treeData, isFirstLoad = false) {
        const body = document.getElementById('topic-tree-window-body');
        const svg = body.querySelector('svg');
        if (!svg) return;
        const g = svg.querySelector('g');

        body.onclick = (e) => {
            const handle = e.target.closest('.collapse-handle');
            const nodeEl = e.target.closest('.node');

            if (handle) {
                e.stopPropagation(); // 防止触发节点跳转
                const nodeId = handle.dataset.id;
                function findAndToggle(node) {
                    if (node.id == nodeId) { node.collapsed = !node.collapsed; return true; }
                    if (node.children) { for (const child of node.children) { if (findAndToggle(child)) return true; } }
                    return false;
                }
                findAndToggle(treeData);
                renderAndAttachTopicTree(treeData);
                setupTreeInteractions(treeData, false); // Not first load anymore
            } else if (nodeEl) {
                const postId = nodeEl.dataset.id;
                const postOnPage = document.querySelector(`div.topic-post[data-post-number="${postId}"]`);
                if (postOnPage) {
                    postOnPage.scrollIntoView({ behavior: 'auto', block: 'center' });
                    // The highlight is applied to the article inside the div for better visual effect
                    const articleEl = postOnPage.querySelector('article');
                    if (articleEl) {
                        articleEl.classList.add('post-highlight-temp');
                        setTimeout(() => { articleEl.classList.remove('post-highlight-temp'); }, 1500);
                    }
                    logToTreeWindow('info', `已跳转到帖子 #${postId}`);
                }
            }
        };

        function exportTree(format) {
            let text = `主题: ${treeData.text}\n\n`;
            function traverseForExport(node, depth = 0) {
                if (node.isRoot) { node.children.forEach(child => traverseForExport(child, depth)); return; }
                text += `${'  '.repeat(depth)}[#${node.id}] ${node.author}:\n`;
                let contentToExport = format === 'md' ? htmlToMarkdown(node.htmlContent) : node.content;
                text += `${'  '.repeat(depth)}  ${contentToExport.replace(/\n/g, `\n${'  '.repeat(depth)}  `)}\n\n`;
                if (node.children) node.children.forEach(child => traverseForExport(child, depth + 1));
            }
            traverseForExport(treeData);
            return text;
        }

        document.getElementById('tree-copy-btn').onclick = () => { GM_setClipboard(exportTree('txt')); logToTreeWindow('success', '结构树文本已复制到剪贴板。'); };
        document.getElementById('tree-export-txt-btn').onclick = () => { downloadFile(exportTree('txt'), `${treeData.text.substring(0, 30).replace(/[\\/:*?"<>|]/g, '_')}.txt`, 'text/plain'); logToTreeWindow('success', '结构树 TXT 文件已开始下载。'); };
        document.getElementById('tree-export-md-btn').onclick = () => { downloadFile(exportTree('md'), `${treeData.text.substring(0, 30).replace(/[\\/:*?"<>|]/g, '_')}.md`, 'text/markdown'); logToTreeWindow('success', '结构树 Markdown 文件已开始下载。'); };
        document.getElementById('tree-toggle-content').onchange = () => { renderAndAttachTopicTree(treeData); setupTreeInteractions(treeData, false); };

        let isDragging = false, startX, startY, transformX = 0, transformY = 0, scale = 1;

        function saveViewState() {
            const state = { tx: transformX, ty: transformY, scale: scale };
            localStorage.setItem(VIEW_STATE_STORAGE_KEY, JSON.stringify(state));
        }

        function fitAndCenter() {
            const containerRect = body.getBoundingClientRect();
            const bbox = g.getBBox();
            if (bbox.width === 0 || bbox.height === 0) return;
            const padding = 80;
            scale = Math.min((containerRect.width - padding) / bbox.width, (containerRect.height - padding) / bbox.height, 1.5);
            transformX = (containerRect.width / 2) - (bbox.x + bbox.width / 2) * scale;
            transformY = (containerRect.height / 2) - (bbox.y + bbox.height / 2) * scale;
            g.style.transition = 'transform 0.3s ease-out';
            g.setAttribute('transform', `translate(${transformX}, ${transformY}) scale(${scale})`);
            setTimeout(() => g.style.transition = '', 300);
            saveViewState();
            logToTreeWindow('info', '视图已自动居中。');
        }

        if (isFirstLoad) {
            const savedViewState = localStorage.getItem(VIEW_STATE_STORAGE_KEY);
            if (savedViewState) {
                const { tx, ty, scale: s } = JSON.parse(savedViewState);
                transformX = tx; transformY = ty; scale = s || 1;
                g.setAttribute('transform', `translate(${transformX}, ${transformY}) scale(${scale})`);
                logToTreeWindow('info', '已恢复上次视图位置。');
            } else {
                fitAndCenter();
            }
        } else {
            const savedViewState = JSON.parse(localStorage.getItem(VIEW_STATE_STORAGE_KEY) || '{}');
            transformX = savedViewState.tx || 0;
            transformY = savedViewState.ty || 0;
            scale = savedViewState.scale || 1;
            g.setAttribute('transform', `translate(${transformX}, ${transformY}) scale(${scale})`);
        }


        document.getElementById('tree-recenter-btn').onclick = fitAndCenter;

        body.onmousedown = (e) => {
            if (e.target.closest('.node')) return;
            isDragging = true;
            startX = e.clientX - transformX;
            startY = e.clientY - transformY;
            document.body.classList.add('dragging-no-select');
        };
        const stopDrag = () => {
            if (isDragging) {
                isDragging = false;
                document.body.classList.remove('dragging-no-select');
                saveViewState();
            }
        };
        body.addEventListener('mouseup', stopDrag);
        body.addEventListener('mouseleave', stopDrag);
        body.onmousemove = (e) => {
            if (isDragging) {
                transformX = e.clientX - startX;
                transformY = e.clientY - startY;
                g.setAttribute('transform', `translate(${transformX}, ${transformY}) scale(${scale})`);
            }
        };
        body.onwheel = (e) => {
            e.preventDefault();
            const scaleAmount = 0.1;
            const oldScale = scale;
            scale *= (e.deltaY > 0 ? (1 - scaleAmount) : (1 + scaleAmount));
            scale = Math.max(0.1, Math.min(scale, 5));
            const containerRect = body.getBoundingClientRect();
            const mouseX = e.clientX - containerRect.left;
            const mouseY = e.clientY - containerRect.top;
            transformX = mouseX - (mouseX - transformX) * (scale / oldScale);
            transformY = mouseY - (mouseY - transformY) * (scale / oldScale);
            g.setAttribute('transform', `translate(${transformX}, ${transformY}) scale(${scale})`);
            saveViewState();
        };
    }

    function htmlToMarkdown(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        tempDiv.querySelectorAll('img').forEach(img => {
            const alt = img.alt || 'image';
            const src = img.src || '';
            img.replaceWith(`\n![${alt}](${src})\n`);
        });
        return tempDiv.innerText.trim();
    }

    function downloadFile(content, fileName, contentType) {
        const blob = new Blob([content], { type: contentType + ';charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    // --- 8. 初始化与执行 ---
    function initialize() {
        // 应用保存的主题
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'light';
        applyTheme(savedTheme);

        createMainUI();
        const postObserver = new MutationObserver(() => document.querySelectorAll('article.boxed').forEach(processPost));
        postObserver.observe(document.body, { childList: true, subtree: true });

        const titleObserver = new MutationObserver(() => {
            if (window.location.pathname.includes('/t/')) {
                const treeWindow = document.getElementById('topic-tree-window');
                if (treeWindow && treeWindow.style.display !== 'none') {
                    refreshTopicTree();
                }
            }
        });
        const titleEl = document.querySelector('title');
        if (titleEl) {
            titleObserver.observe(titleEl, { childList: true });
        }

        // 自动打开上次打开的窗口
        try {
            const state = JSON.parse(localStorage.getItem(WINDOW_STATE_STORAGE_KEY));
            if (state && state.isOpen && window.location.pathname.includes('/t/')) {
                toggleTopicTreeWindow();
            }
        } catch (e) { /* ignore parsing error */ }


        document.addEventListener('card-rendered', (e) => {
            const svgContainer = e.detail.card.querySelector('.mymap-svg-container');
            if (svgContainer && svgContainer.dataset.tree) {
                let treeData = JSON.parse(svgContainer.dataset.tree);

                function findNodeById(node, id) {
                    if (node.id === id) return node;
                    for (const child of node.children) {
                        const found = findNodeById(child, id);
                        if (found) return found;
                    }
                    return null;
                }

                function reattachParents(node, parent = null) {
                    node.parent = parent;
                    node.children.forEach(child => reattachParents(child, node));
                }
                reattachParents(treeData);


                function updateSVG() {
                    svgContainer.innerHTML = generateMindmapSVG(treeData);
                }

                svgContainer.addEventListener('click', (ev) => {
                    const nodeEl = ev.target.closest('.node');
                    if (nodeEl) {
                        const nodeId = nodeEl.dataset.id;
                        const node = findNodeById(treeData, nodeId);
                        if (node && node.children.length > 0) {
                            node.collapsed = !node.collapsed;
                            updateSVG();
                        }
                    }
                });

                let isDragging = false, startX, startY, transformX = 0, transformY = 0, scale = 1;
                const g = svgContainer.querySelector('g');
                const svg = svgContainer.querySelector('svg');
                if (!g || !svg) return;

                const bbox = g.getBBox();
                const containerRect = svgContainer.getBoundingClientRect();
                if (bbox.width > 0 && bbox.height > 0) {
                    const scaleX = containerRect.width / (bbox.width + 120);
                    const scaleY = containerRect.height / (bbox.height + 40);
                    scale = Math.min(scaleX, scaleY, 1);
                    transformX = (containerRect.width / 2) - (bbox.x + bbox.width / 2) * scale;
                    transformY = (containerRect.height / 2) - (bbox.y + bbox.height / 2) * scale;
                    g.style.transition = 'transform 0.3s ease-out';
                    g.setAttribute('transform', `translate(${transformX}, ${transformY}) scale(${scale})`);
                    setTimeout(() => g.style.transition = '', 300);
                }

                svgContainer.addEventListener('mousedown', (ev) => {
                    if (ev.target.closest('.node')) return;
                    ev.preventDefault(); isDragging = true;
                    startX = ev.clientX - transformX; startY = ev.clientY - transformY;
                    svgContainer.style.cursor = 'grabbing';
                    document.body.classList.add('dragging-no-select');
                });
                const stopDrag = () => {
                    isDragging = false;
                    svgContainer.style.cursor = 'grab';
                    document.body.classList.remove('dragging-no-select');
                };
                svgContainer.addEventListener('mouseup', stopDrag);
                svgContainer.addEventListener('mouseleave', stopDrag);
                svgContainer.addEventListener('mousemove', (ev) => {
                    if (isDragging) {
                        ev.preventDefault();
                        transformX = ev.clientX - startX; transformY = ev.clientY - startY;
                        g.setAttribute('transform', `translate(${transformX}, ${transformY}) scale(${scale})`);
                    }
                });
                svgContainer.addEventListener('wheel', (ev) => {
                    ev.preventDefault();
                    const scaleAmount = 0.1; const oldScale = scale;
                    scale *= (ev.deltaY > 0 ? (1 - scaleAmount) : (1 + scaleAmount));
                    scale = Math.max(0.1, Math.min(scale, 5));
                    const mouseX = ev.clientX - containerRect.left; const mouseY = ev.clientY - containerRect.top;
                    transformX = mouseX - (mouseX - transformX) * (scale / oldScale);
                    transformY = mouseY - (mouseY - transformY) * (scale / oldScale);
                    g.setAttribute('transform', `translate(${transformX}, ${transformY}) scale(${scale})`);
                });
            }
        });
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initialize); }
    else { initialize(); }

})();
