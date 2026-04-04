// ============================================================
//  ICF-SL  ai_agent.js  — GAS-backed · Tab Panel + Float Button
//  All Claude calls go through your Google Apps Script proxy.
//  No API key in the browser.
// ============================================================
(function () {
    'use strict';

    const GAS_URL = 'https://script.google.com/macros/s/AKfycbymRy-M5v0fVLWUjw4IXYhd1oIR2ZvnP_Dzr_iGR-Th0cMIpmE2ntGeujWYH7-C6NHIzA/exec';

    // ════════════════════════════════════════════════════════
    //  STYLES
    // ════════════════════════════════════════════════════════
    const style = document.createElement('style');
    style.textContent = `
    .tab-nav{display:flex;background:#002d5a;border-bottom:3px solid #c8991a;overflow-x:auto;-webkit-overflow-scrolling:touch;}
    .tab-nav::-webkit-scrollbar{display:none;}
    .tab-btn{display:flex;align-items:center;gap:7px;padding:13px 22px;font-family:'Oswald',sans-serif;font-size:13px;font-weight:500;letter-spacing:.8px;text-transform:uppercase;color:rgba(255,255,255,.50);background:none;border:none;border-bottom:3px solid transparent;margin-bottom:-3px;cursor:pointer;white-space:nowrap;transition:color .2s,border-color .2s;flex-shrink:0;}
    .tab-btn svg{width:16px;height:16px;stroke:currentColor;fill:none;}
    .tab-btn:hover{color:rgba(255,255,255,.80);}
    .tab-btn.active{color:#f0c040;border-bottom-color:#f0c040;}
    .tab-panel{display:none;}
    .tab-panel.active{display:block;}
    @media(max-width:480px){.tab-btn{padding:12px 14px;font-size:11px;}.tab-btn .tab-lbl{display:none;}.tab-btn svg{width:18px;height:18px;}}
    .dash-kpi-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:18px;}
    .dash-kpi{background:#fff;border:2px solid #d0dce8;border-radius:10px;padding:18px 14px;text-align:center;}
    .dash-kpi.kpi-green{border-color:#28a745;}.dash-kpi.kpi-red{border-color:#dc3545;}.dash-kpi.kpi-gold{border-color:#c8991a;}
    .dash-kpi-val{font-family:'Oswald',sans-serif;font-size:32px;font-weight:700;color:#004080;line-height:1;}
    .dash-kpi.kpi-green .dash-kpi-val{color:#28a745;}.dash-kpi.kpi-red .dash-kpi-val{color:#dc3545;}.dash-kpi.kpi-gold .dash-kpi-val{color:#b8860b;}
    .dash-kpi-lbl{font-size:11px;color:#607080;text-transform:uppercase;letter-spacing:.5px;margin-top:5px;font-family:'Oswald',sans-serif;}
    .dash-section-hdr{background:#004080;color:#fff;padding:11px 18px;border-radius:8px 8px 0 0;font-family:'Oswald',sans-serif;font-size:13px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;}
    .dash-table-outer{border:2px solid #d0dce8;border-top:none;border-radius:0 0 8px 8px;overflow-x:auto;margin-bottom:18px;}
    .dash-tbl{width:100%;border-collapse:collapse;font-size:13px;}
    .dash-tbl th{background:#f4f7fa;padding:9px 13px;font-family:'Oswald',sans-serif;font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:#607080;border-bottom:1px solid #d0dce8;text-align:left;}
    .dash-tbl td{padding:9px 13px;border-bottom:1px solid #f0f4f8;}
    .dash-tbl tr:last-child td{border-bottom:none;}.dash-tbl tr:hover td{background:#f8fafc;}
    .dash-prog-bar{background:#e4eaf2;border-radius:4px;height:7px;overflow:hidden;}
    .dash-prog-fill{height:100%;border-radius:4px;background:#004080;}.dash-prog-fill.done{background:#28a745;}
    @media(max-width:480px){.dash-kpi-row{grid-template-columns:repeat(2,1fr);}}
    .ai-panel-wrap{display:flex;flex-direction:column;height:calc(100vh - 220px);min-height:400px;}
    .ai-chat-topbar{display:flex;align-items:center;gap:12px;padding:11px 16px;background:#fff;border-bottom:1px solid #d0dce8;}
    .ai-avatar-circle{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#004080,#1a6abf);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .ai-avatar-circle svg{width:18px;height:18px;stroke:#fff;fill:none;}
    .ai-topbar-name{font-family:'Oswald',sans-serif;font-size:14px;font-weight:600;color:#004080;letter-spacing:.5px;text-transform:uppercase;}
    .ai-topbar-status{font-size:11px;color:#28a745;display:flex;align-items:center;gap:4px;}
    .ai-topbar-status::before{content:'';width:6px;height:6px;border-radius:50%;background:#28a745;display:inline-block;}
    .ai-stats-strip{background:#e8f1fa;border-bottom:2px solid #c5d9f0;padding:7px 14px;display:flex;gap:14px;overflow-x:auto;flex-shrink:0;}
    .ai-stats-strip::-webkit-scrollbar{display:none;}
    .ai-stat-item{text-align:center;white-space:nowrap;}
    .ai-stat-val{font-family:'Oswald',sans-serif;font-size:15px;font-weight:700;color:#004080;line-height:1;}
    .ai-stat-lbl{font-size:9px;color:#555;text-transform:uppercase;letter-spacing:.4px;margin-top:1px;}
    .ai-stat-div{width:1px;background:#bcd3eb;align-self:stretch;margin:2px 0;}
    .ai-clear-chat{margin-left:auto;background:#f4f7fa;border:1px solid #d0dce8;border-radius:7px;padding:5px 12px;font-family:'Oswald',sans-serif;font-size:11px;letter-spacing:.5px;text-transform:uppercase;color:#607080;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:5px;}
    .ai-clear-chat svg{width:12px;height:12px;stroke:currentColor;fill:none;}
    .ai-clear-chat:hover{background:#dc3545;color:#fff;border-color:#dc3545;}
    .ai-chips{padding:8px 14px;background:#f8fafc;border-bottom:1px solid #e8edf2;display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0;}
    .ai-chip{padding:5px 11px;background:#eef3fa;border:1px solid #c0d0e0;border-radius:20px;font-size:11px;color:#004080;cursor:pointer;transition:all .15s;white-space:nowrap;font-family:'Oswald',sans-serif;font-weight:500;}
    .ai-chip:hover{background:#004080;color:#fff;border-color:#004080;}
    .ai-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:11px;background:#f0f4f8;}
    .ai-messages::-webkit-scrollbar{width:4px;}
    .ai-messages::-webkit-scrollbar-thumb{background:#b0c4d8;border-radius:2px;}
    .ai-msg{display:flex;gap:8px;align-items:flex-start;}
    .ai-msg.user-msg{flex-direction:row-reverse;}
    .ai-msg-av{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;}
    .ai-msg .ai-msg-av{background:linear-gradient(135deg,#004080,#1a6abf);}
    .ai-msg.user-msg .ai-msg-av{background:#f0a500;}
    .ai-msg-av svg{width:14px;height:14px;stroke:#fff;fill:none;}
    .ai-bub{max-width:calc(100% - 44px);padding:10px 13px;border-radius:13px;font-size:13px;line-height:1.55;word-break:break-word;}
    .ai-msg .ai-bub{background:#fff;border:1.5px solid #c5d9f0;border-top-left-radius:4px;color:#222;box-shadow:0 1px 4px rgba(0,64,128,.07);}
    .ai-msg.user-msg .ai-bub{background:#004080;color:#fff;border-top-right-radius:4px;}
    .ai-bub strong{font-weight:700;}.ai-bub code{background:rgba(0,64,128,.08);border-radius:3px;padding:1px 4px;font-family:monospace;font-size:12px;}
    .ai-msg.user-msg .ai-bub code{background:rgba(255,255,255,.18);}
    .ai-typing-dots{display:flex;align-items:center;gap:4px;padding:4px 2px;}
    .ai-dot{width:7px;height:7px;background:#004080;border-radius:50%;animation:ai-bnc .9s ease-in-out infinite;}
    .ai-dot:nth-child(2){animation-delay:.15s;}.ai-dot:nth-child(3){animation-delay:.30s;}
    @keyframes ai-bnc{0%,100%{transform:translateY(0);opacity:.4;}50%{transform:translateY(-5px);opacity:1;}}
    .ai-welcome-card{background:#fff;border:2px solid #c5d9f0;border-radius:12px;padding:20px 16px;text-align:center;}
    .ai-welcome-card-icon{font-size:30px;margin-bottom:8px;}
    .ai-welcome-card-title{font-family:'Oswald',sans-serif;font-size:15px;color:#004080;font-weight:600;letter-spacing:.5px;margin-bottom:6px;}
    .ai-welcome-card-body{font-size:12px;color:#555;line-height:1.6;}
    .ai-input-area{background:#fff;border-top:2px solid #d0dce8;padding:10px 14px;flex-shrink:0;}
    .ai-input-row{display:flex;gap:9px;align-items:flex-end;}
    #aiInput{flex:1;border:2px solid #c5d9f0;border-radius:22px;padding:9px 15px;font-size:13px;font-family:'Oswald','Segoe UI',Arial,sans-serif;outline:none;resize:none;max-height:100px;line-height:1.4;background:#f4f7fa;transition:border .2s;}
    #aiInput:focus{border-color:#004080;background:#fff;}
    #aiInput::placeholder{color:#9090a0;}
    #aiSendBtn{width:42px;height:42px;border-radius:50%;background:#004080;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s,transform .1s;flex-shrink:0;}
    #aiSendBtn:hover{background:#00306a;transform:scale(1.06);}
    #aiSendBtn:disabled{background:#aaa;cursor:not-allowed;transform:none;}
    #aiSendBtn svg{width:17px;height:17px;stroke:#fff;fill:none;}
    .ai-input-hint{font-size:10px;color:#9090a0;margin-top:5px;text-align:center;}
    #icfAiBtn{position:fixed;bottom:24px;right:20px;z-index:9000;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#004080 0%,#0066cc 100%);border:3px solid #fff;box-shadow:0 4px 20px rgba(0,64,128,.45);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s;animation:icf-pulse 2.8s ease-in-out infinite;}
    #icfAiBtn:hover{transform:scale(1.1);}
    #icfAiBtn svg{width:26px;height:26px;stroke:#fff;}
    @keyframes icf-pulse{0%,100%{box-shadow:0 4px 20px rgba(0,64,128,.45);}50%{box-shadow:0 4px 30px rgba(0,64,128,.75);}}
    #icfAiBadge{position:absolute;top:-4px;right:-4px;background:#f0a500;color:#fff;border-radius:10px;font-size:9px;font-weight:700;font-family:'Oswald',sans-serif;padding:2px 6px;letter-spacing:.4px;border:2px solid #fff;}
    #icfAiOverlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9100;display:none;justify-content:center;align-items:flex-end;padding:12px;}
    #icfAiOverlay.show{display:flex;}
    #icfAiModal{background:#fff;border-radius:16px 16px 12px 12px;border:3px solid #004080;width:100%;max-width:680px;max-height:88vh;display:flex;flex-direction:column;box-shadow:0 12px 48px rgba(0,0,0,.35);overflow:hidden;}
    .icf-ai-head{background:linear-gradient(135deg,#002d5a 0%,#004080 100%);color:#fff;padding:14px 18px;display:flex;align-items:center;gap:12px;flex-shrink:0;}
    .icf-ai-head-icon{width:36px;height:36px;background:rgba(255,255,255,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .icf-ai-head-icon svg{width:20px;height:20px;stroke:#fff;}
    .icf-ai-head-info{flex:1;}
    .icf-ai-head-title{font-family:'Oswald',sans-serif;font-size:16px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;line-height:1.2;}
    .icf-ai-head-sub{font-size:10px;color:rgba(255,255,255,.7);}
    .icf-ai-head-actions{display:flex;gap:6px;}
    .icf-ai-hbtn{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);border-radius:8px;padding:6px 10px;cursor:pointer;color:#fff;font-family:'Oswald',sans-serif;font-size:11px;letter-spacing:.5px;display:flex;align-items:center;gap:5px;transition:background .15s;}
    .icf-ai-hbtn:hover{background:rgba(255,255,255,.22);}
    .icf-ai-hbtn svg{width:13px;height:13px;stroke:#fff;}
    .icf-ai-hbtn.gold{background:rgba(240,165,0,.25);border-color:rgba(240,165,0,.5);}
    .icf-ai-stats{background:#e8f1fa;border-bottom:2px solid #c5d9f0;padding:8px 16px;display:flex;gap:16px;flex-shrink:0;overflow-x:auto;}
    .icf-ai-stat{text-align:center;white-space:nowrap;}
    .icf-ai-stat-val{font-family:'Oswald',sans-serif;font-size:17px;font-weight:700;color:#004080;line-height:1;}
    .icf-ai-stat-lbl{font-size:9px;color:#555;text-transform:uppercase;letter-spacing:.5px;margin-top:2px;}
    .icf-ai-stat-div{width:1px;background:#bcd3eb;align-self:stretch;margin:2px 0;}
    #icfAiMessages{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:12px;background:#f8fafd;}
    .icf-msg{display:flex;gap:8px;align-items:flex-start;}.icf-msg.user{flex-direction:row-reverse;}
    .icf-msg-av{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;}
    .icf-msg.ai .icf-msg-av{background:#004080;}.icf-msg.user .icf-msg-av{background:#f0a500;}
    .icf-msg-av svg{width:14px;height:14px;stroke:#fff;}
    .icf-bub{max-width:calc(100% - 44px);padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.55;word-break:break-word;}
    .icf-msg.ai .icf-bub{background:#fff;border:1.5px solid #c5d9f0;border-top-left-radius:4px;color:#222;}
    .icf-msg.user .icf-bub{background:#004080;color:#fff;border-top-right-radius:4px;}
    .icf-bub strong{font-weight:700;}.icf-bub code{background:rgba(0,64,128,.08);border-radius:4px;padding:1px 5px;font-family:monospace;font-size:12px;}
    .icf-msg.user .icf-bub code{background:rgba(255,255,255,.18);}
    .icf-typing{display:flex;align-items:center;gap:4px;padding:6px 0;}
    .icf-typing span{width:7px;height:7px;background:#004080;border-radius:50%;animation:icf-bnc .9s ease-in-out infinite;}
    .icf-typing span:nth-child(2){animation-delay:.15s;}.icf-typing span:nth-child(3){animation-delay:.30s;}
    @keyframes icf-bnc{0%,100%{transform:translateY(0);opacity:.4;}50%{transform:translateY(-5px);opacity:1;}}
    .icf-samples{padding:8px 16px 6px;flex-shrink:0;border-top:1px solid #e0eaf5;}
    .icf-sq-lbl{font-size:9px;font-family:'Oswald',sans-serif;color:#888;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}
    .icf-sq-row{display:flex;gap:6px;flex-wrap:wrap;}
    .icf-sq{background:#e8f1fa;border:1.5px solid #b3cde8;border-radius:20px;padding:5px 12px;font-size:11px;color:#004080;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .15s,border-color .15s;font-family:'Oswald',sans-serif;}
    .icf-sq:hover{background:#004080;color:#fff;border-color:#004080;}
    .icf-inp-row{display:flex;gap:8px;padding:10px 14px 12px;border-top:2px solid #dce8f5;background:#fff;flex-shrink:0;align-items:flex-end;}
    #icfAiInput{flex:1;border:2px solid #c5d9f0;border-radius:24px;padding:9px 16px;font-size:13px;font-family:'Oswald','Segoe UI',Arial,sans-serif;outline:none;resize:none;transition:border-color .2s;line-height:1.4;}
    #icfAiInput:focus{border-color:#004080;}
    #icfAiSend{background:#004080;border:none;border-radius:50%;width:42px;height:42px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:background .2s,transform .15s;}
    #icfAiSend:hover{background:#00306a;transform:scale(1.08);}
    #icfAiSend:disabled{background:#aaa;cursor:not-allowed;transform:none;}
    #icfAiSend svg{width:18px;height:18px;stroke:#fff;}
    .icf-clr{background:none;border:none;font-size:10px;color:#aaa;cursor:pointer;letter-spacing:.4px;text-transform:uppercase;font-family:'Oswald',sans-serif;padding:0 4px;transition:color .15s;}
    .icf-clr:hover{color:#dc3545;}
    .icf-pill{display:inline-flex;align-items:center;gap:5px;font-size:10px;padding:3px 10px;border-radius:12px;font-family:'Oswald',sans-serif;margin-bottom:8px;}
    .icf-pill.ok{background:#d4edda;color:#155724;}.icf-pill.err{background:#f8d7da;color:#721c24;}.icf-pill.chk{background:#e2e3e5;color:#383d41;}
    .icf-dot{width:7px;height:7px;border-radius:50%;}
    .ok .icf-dot{background:#28a745;}.err .icf-dot{background:#dc3545;}.chk .icf-dot{background:#888;animation:icf-bnc .9s ease-in-out infinite;}
    .icf-welcome{background:#fff;border:2px solid #c5d9f0;border-radius:12px;padding:18px 16px;text-align:center;}
    .icf-welcome-icon{font-size:32px;margin-bottom:8px;}
    .icf-welcome-title{font-family:'Oswald',sans-serif;font-size:15px;color:#004080;font-weight:600;letter-spacing:.5px;margin-bottom:6px;}
    .icf-welcome-body{font-size:12px;color:#555;line-height:1.6;}
    .icf-foot{font-size:10px;color:#aaa;text-align:center;padding:4px;font-style:italic;font-family:'Oswald',sans-serif;}
    @media(max-width:520px){#icfAiModal{max-height:93vh;border-radius:14px 14px 0 0;}}
    `;
    document.head.appendChild(style);

    // ════════════════════════════════════════════════════════
    //  FLOATING BUTTON + MODAL HTML
    // ════════════════════════════════════════════════════════
    document.body.insertAdjacentHTML('beforeend', `
    <button id="icfAiBtn" title="Ask the AI Agent" onclick="icfAiOpen()">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        <circle cx="9" cy="10" r="1" fill="white" stroke="none"/>
        <circle cx="12" cy="10" r="1" fill="white" stroke="none"/>
        <circle cx="15" cy="10" r="1" fill="white" stroke="none"/>
      </svg>
      <span id="icfAiBadge">AI</span>
    </button>

    <div id="icfAiOverlay" onclick="icfAiOverlayClick(event)">
      <div id="icfAiModal">
        <div class="icf-ai-head">
          <div class="icf-ai-head-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          </div>
          <div class="icf-ai-head-info">
            <div class="icf-ai-head-title">ICF Data Agent</div>
            <div class="icf-ai-head-sub">AI · Google Apps Script + Claude</div>
          </div>
          <div class="icf-ai-head-actions">
            <button class="icf-ai-hbtn gold" onclick="icfAiRefreshStats()">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M21 2v6h-6M3 12a9 9 0 0115.36-6.36L21 8M3 22v-6h6M21 12a9 9 0 01-15.36 6.36L3 16"/></svg>
              SYNC
            </button>
            <button class="icf-ai-hbtn" onclick="icfAiClose()">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              CLOSE
            </button>
          </div>
        </div>
        <div class="icf-ai-stats" id="icfAiStats"><div style="margin:auto;font-size:11px;color:#888;">Loading…</div></div>
        <div id="icfAiMessages">
          <div class="icf-welcome">
            <div class="icf-welcome-icon">🤖</div>
            <div class="icf-welcome-title">Hello! I'm your ICF Data Agent.</div>
            <div class="icf-welcome-body">
              I analyse all submitted ITN distribution data — coverage, enrollment,
              gender breakdown, class-level stats and more.<br><br>
              Powered by <strong>Google Apps Script</strong> + <strong>Claude AI</strong>.
              Your API key stays securely on the server.
            </div>
          </div>
          <div id="icfGasStatus"></div>
        </div>
        <div class="icf-samples">
          <div class="icf-sq-lbl">✦ Try asking</div>
          <div class="icf-sq-row" id="icfSqRow"></div>
        </div>
        <div class="icf-inp-row">
          <button class="icf-clr" onclick="icfAiClearChat()">↺ Clear</button>
          <textarea id="icfAiInput" rows="1" placeholder="Ask about the ITN distribution data…"
            onkeydown="icfAiKeydown(event)" oninput="icfAiAutoResize(this)"></textarea>
          <button id="icfAiSend" onclick="icfAiSend()">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <div class="icf-foot">Session state + Google Sheet · API key never leaves the server</div>
      </div>
    </div>`);

    // ════════════════════════════════════════════════════════
    //  SHARED HELPERS
    // ════════════════════════════════════════════════════════
    const SAMPLES = [
        'How many schools have been submitted?',
        'What is the overall ITN coverage rate?',
        'Which district has the most submissions?',
        'Show coverage breakdown by gender',
        'How many ITNs were distributed in total?',
        'List schools with coverage below 80%',
        'What is the average enrollment per school?',
        'How many schools are still pending?',
        'Compare boys vs girls ITN coverage',
        'Which schools received IG2 nets?',
        'What proportion of pupils are girls?',
        'How many ITNs remain after distribution?',
        'Give me a summary by chiefdom',
        'Which class has the highest coverage?',
        'Who submitted the most records?',
        'Which school has the highest total pupils?',
        'Are there any schools where ITNs exceeded enrollment?',
    ];

    function pickSamples(n) {
        const pool = [...SAMPLES], out = [];
        while (out.length < n && pool.length) {
            const i = Math.floor(Math.random() * pool.length);
            out.push(pool.splice(i, 1)[0]);
        }
        return out;
    }

    function md(t) {
        return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
            .replace(/\*(.+?)\*/g,'<em>$1</em>')
            .replace(/`(.+?)`/g,'<code>$1</code>')
            .replace(/^#{1,3} (.+)$/gm,'<strong style="font-size:13px;text-transform:uppercase;letter-spacing:.5px;color:#004080;display:block;margin-top:6px">$1</strong>')
            .replace(/^- (.+)$/gm,'<span style="display:block;padding-left:14px;margin:2px 0">• $1</span>')
            .replace(/\n\n/g,'<br><br>').replace(/\n/g,'<br>');
    }

    function escHtml(t) {
        return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
    }

    // ════════════════════════════════════════════════════════
    //  DATA CONTEXT BUILDER
    // ════════════════════════════════════════════════════════
    function buildContext() {
        try {
            const s   = window.state || {};
            const all = [
                ...(s.submittedSchools || []).map(r => r.data || r),
                ...(s.pendingSubmissions || [])
            ];
            if (!all.length) return null;
            let tp=0,ti=0,tb=0,tg=0,tbi=0,tgi=0,tr=0,trem=0;
            const byDist={}, schools=[];
            all.forEach(r => {
                const vp=parseInt(r.total_pupils)||0,vi=parseInt(r.total_itn)||0,
                      vb=parseInt(r.total_boys)||0,vg=parseInt(r.total_girls)||0,
                      vbi=parseInt(r.total_boys_itn)||0,vgi=parseInt(r.total_girls_itn)||0,
                      vr=parseInt(r.itns_received)||0,vrem=parseInt(r.itns_remaining||r.itns_remaining_val)||0;
                tp+=vp;ti+=vi;tb+=vb;tg+=vg;tbi+=vbi;tgi+=vgi;tr+=vr;trem+=vrem;
                const d=r.district||'Unknown';
                if(!byDist[d]) byDist[d]={s:0,p:0,i:0};
                byDist[d].s++;byDist[d].p+=vp;byDist[d].i+=vi;
                schools.push({
                    school:r.school_name||'—',com:r.community||'—',chief:r.chiefdom||'—',dist:r.district||'—',
                    date:r.distribution_date||'—',by:r.submitted_by||'—',
                    pupils:vp,boys:vb,girls:vg,itn:vi,bITN:vbi,gITN:vgi,rec:vr,rem:vrem,
                    cov:vp>0?Math.round((vi/vp)*100)+'%':'0%',
                    types:[r.itn_type_pbo==='Yes'?'PBO':'',r.itn_type_ig2==='Yes'?'IG2':''].filter(Boolean).join(',')||'—',
                    c1b:+r.c1_boys||0,c1g:+r.c1_girls||0,c1bi:+r.c1_boys_itn||0,c1gi:+r.c1_girls_itn||0,
                    c2b:+r.c2_boys||0,c2g:+r.c2_girls||0,c2bi:+r.c2_boys_itn||0,c2gi:+r.c2_girls_itn||0,
                    c3b:+r.c3_boys||0,c3g:+r.c3_girls||0,c3bi:+r.c3_boys_itn||0,c3gi:+r.c3_girls_itn||0,
                    c4b:+r.c4_boys||0,c4g:+r.c4_girls||0,c4bi:+r.c4_boys_itn||0,c4gi:+r.c4_girls_itn||0,
                    c5b:+r.c5_boys||0,c5g:+r.c5_girls||0,c5bi:+r.c5_boys_itn||0,c5gi:+r.c5_girls_itn||0,
                });
            });
            const ov=tp>0?Math.round((ti/tp)*100):0,bc=tb>0?Math.round((tbi/tb)*100):0,gc=tg>0?Math.round((tgi/tg)*100):0;
            let ctx=`=== ICF-SL ITN SESSION DATA (${new Date().toLocaleDateString()}) ===\n`;
            ctx+=`Schools:${all.length} | Pupils:${tp}(${tb}B/${tg}G) | Received:${tr} | Distributed:${ti} | Remaining:${trem}\n`;
            ctx+=`Coverage:${ov}% overall | ${bc}% boys | ${gc}% girls\n\nBY DISTRICT:\n`;
            Object.entries(byDist).forEach(([d,v])=>{ctx+=`  ${d}: ${v.s} schools, ${v.p} pupils, ${v.p>0?Math.round((v.i/v.p)*100):0}% cov\n`;});
            ctx+=`\nSCHOOL RECORDS:\n`;
            schools.forEach((s,i)=>{
                ctx+=`[${i+1}] ${s.school} (${s.com}, ${s.chief}, ${s.dist}) | ${s.date} | by:${s.by}\n`;
                ctx+=`  Pupils:${s.pupils}(${s.boys}B/${s.girls}G) | ITN:${s.itn} | Rem:${s.rem} | Cov:${s.cov} | Types:${s.types}\n`;
                ctx+=`  C1:${s.c1b}B/${s.c1g}G(${s.c1bi}/${s.c1gi}) C2:${s.c2b}B/${s.c2g}G(${s.c2bi}/${s.c2gi}) C3:${s.c3b}B/${s.c3g}G(${s.c3bi}/${s.c3gi}) C4:${s.c4b}B/${s.c4g}G(${s.c4bi}/${s.c4gi}) C5:${s.c5b}B/${s.c5g}G(${s.c5bi}/${s.c5gi})\n`;
            });
            return ctx;
        } catch { return null; }
    }

    // ════════════════════════════════════════════════════════
    //  GAS CALL  (shared by both chats)
    // ════════════════════════════════════════════════════════
    async function callGAS(msg, history) {
        const res = await fetch(GAS_URL, {
            method:'POST', redirect:'follow',
            headers:{'Content-Type':'text/plain;charset=utf-8'},
            body: JSON.stringify({
                action:'ai_query', message:msg,
                history:(history||[]).slice(-10),
                context: buildContext() || ''
            })
        });
        if (!res.ok) throw new Error('GAS HTTP ' + res.status);
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'GAS error');
        return data.reply;
    }

    // ════════════════════════════════════════════════════════
    //  STATS HTML  (shared renderer)
    // ════════════════════════════════════════════════════════
    function statsHTML(sheetCount) {
        const s   = window.state || {};
        const sess= (s.submittedSchools||[]).length;
        const pend= (s.pendingSubmissions||[]).length;
        const drft= (s.drafts||[]).length;
        let tp=0,ti=0;
        [...(s.submittedSchools||[]).map(r=>r.data||r),...(s.pendingSubmissions||[])].forEach(r=>{
            tp+=parseInt(r.total_pupils||0)||0; ti+=parseInt(r.total_itn||0)||0;
        });
        const pct=tp>0?Math.round((ti/tp)*100):0;
        const sep='<div class="icf-ai-stat-div"></div>';
        return [
            `<div class="icf-ai-stat"><div class="icf-ai-stat-val">${sess}</div><div class="icf-ai-stat-lbl">Session</div></div>`,sep,
            `<div class="icf-ai-stat"><div class="icf-ai-stat-val" style="color:#28a745">${sheetCount!==null?sheetCount:'…'}</div><div class="icf-ai-stat-lbl">In Sheet</div></div>`,sep,
            `<div class="icf-ai-stat"><div class="icf-ai-stat-val" style="color:#e6a800">${pend}</div><div class="icf-ai-stat-lbl">Pending</div></div>`,sep,
            `<div class="icf-ai-stat"><div class="icf-ai-stat-val">${drft}</div><div class="icf-ai-stat-lbl">Drafts</div></div>`,sep,
            `<div class="icf-ai-stat"><div class="icf-ai-stat-val">${tp.toLocaleString()}</div><div class="icf-ai-stat-lbl">Pupils</div></div>`,sep,
            `<div class="icf-ai-stat"><div class="icf-ai-stat-val">${ti.toLocaleString()}</div><div class="icf-ai-stat-lbl">ITNs</div></div>`,sep,
            `<div class="icf-ai-stat"><div class="icf-ai-stat-val" style="color:${pct>=80?'#28a745':pct>=50?'#e6a800':'#dc3545'}">${pct}%</div><div class="icf-ai-stat-lbl">Coverage</div></div>`
        ].join('');
    }

    async function fetchSheetCount() {
        try {
            const r = await fetch(GAS_URL + '?action=count');
            const d = await r.json();
            return d.count !== undefined ? d.count : '?';
        } catch { return '?'; }
    }

    // ════════════════════════════════════════════════════════
    //  FLOATING MODAL CHAT
    // ════════════════════════════════════════════════════════
    let floatHistory = [];

    function floatMsg(role, text) {
        const w = document.getElementById('icfAiMessages'); if (!w) return;
        const d = document.createElement('div'); d.className = 'icf-msg ' + role;
        const isAI = role === 'ai';
        d.innerHTML = `<div class="icf-msg-av">${isAI
            ? '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
        }</div><div class="icf-bub"></div>`;
        w.appendChild(d);
        d.querySelector('.icf-bub').innerHTML = md(text);
        w.scrollTop = w.scrollHeight;
    }

    function floatTyping(show) {
        if (show) {
            const w=document.getElementById('icfAiMessages'); if(!w) return;
            const d=document.createElement('div'); d.className='icf-msg ai'; d.id='icfTyp';
            d.innerHTML='<div class="icf-msg-av"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div><div class="icf-bub"><div class="icf-typing"><span></span><span></span><span></span></div></div>';
            w.appendChild(d); w.scrollTop=w.scrollHeight;
        } else {
            const e=document.getElementById('icfTyp'); if(e) e.remove();
        }
    }

    function setGasStatus(type, msg) {
        const el = document.getElementById('icfGasStatus');
        if (el) el.innerHTML = `<div class="icf-pill ${type}"><div class="icf-dot"></div>${msg}</div>`;
    }

    window.icfAiRefreshStats = async function () {
        const el = document.getElementById('icfAiStats');
        if (el) el.innerHTML = statsHTML(null);
        setGasStatus('chk', 'Checking GAS connection…');
        const count = await fetchSheetCount();
        if (el) el.innerHTML = statsHTML(count);
        setGasStatus(count === '?' ? 'err' : 'ok',
            count === '?' ? 'GAS unreachable — check deployment URL' : 'GAS connected · ' + count + ' records in Sheet');
    };

    function floatRenderSamples() {
        const row = document.getElementById('icfSqRow'); if (!row) return;
        row.innerHTML = '';
        pickSamples(4).forEach(q => {
            const b = document.createElement('button'); b.className='icf-sq'; b.textContent=q;
            b.onclick = () => icfAiAskQuestion(q); row.appendChild(b);
        });
    }

    window.icfAiSend = async function () {
        const inp=document.getElementById('icfAiInput'), btn=document.getElementById('icfAiSend');
        if (!inp) return; const q=inp.value.trim(); if (!q) return;
        inp.value=''; icfAiAutoResize(inp);
        floatMsg('user',q); floatHistory.push({role:'user',content:q});
        floatTyping(true); if(btn) btn.disabled=true;
        try {
            const reply = await callGAS(q, floatHistory);
            floatTyping(false); floatMsg('ai',reply);
            floatHistory.push({role:'assistant',content:reply}); floatRenderSamples();
        } catch(err) {
            floatTyping(false);
            floatMsg('ai',`⚠️ **Error:** ${err.message}\n\nVerify GAS URL and "Who has access: Anyone".`);
        } finally { if(btn) btn.disabled=false; if(inp) inp.focus(); }
    };

    window.icfAiAskQuestion = function (q) {
        const inp=document.getElementById('icfAiInput');
        if(inp){inp.value=q; icfAiAutoResize(inp);} icfAiSend();
    };
    window.icfAiKeydown    = e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();icfAiSend();} };
    window.icfAiAutoResize = el => { el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,110)+'px'; };
    window.icfAiClearChat  = function () {
        floatHistory=[];
        const w=document.getElementById('icfAiMessages');
        if(w) w.innerHTML='<div class="icf-welcome"><div class="icf-welcome-icon">🔄</div><div class="icf-welcome-title">Chat cleared</div><div class="icf-welcome-body">Ask me anything about your ITN distribution data.</div></div><div id="icfGasStatus"></div>';
        floatRenderSamples();
    };
    window.icfAiOpen = function () {
        document.getElementById('icfAiOverlay').classList.add('show');
        const el=document.getElementById('icfAiStats'); if(el) el.innerHTML=statsHTML(null);
        floatRenderSamples(); icfAiRefreshStats();
        setTimeout(()=>{const i=document.getElementById('icfAiInput');if(i)i.focus();},200);
    };
    window.icfAiClose        = () => document.getElementById('icfAiOverlay').classList.remove('show');
    window.icfAiOverlayClick = e => { if(e.target.id==='icfAiOverlay') icfAiClose(); };
    document.addEventListener('keydown', e => { if(e.key==='Escape') icfAiClose(); });

    // ════════════════════════════════════════════════════════
    //  TAB PANEL AI CHAT  (same GAS proxy)
    // ════════════════════════════════════════════════════════
    let tabHistory = [], tabInited = false, tabBusy = false;

    function tabInitChat() {
        tabInited = true;
        const msgs = document.getElementById('aiMessages'); if (!msgs) return;
        let user='there';
        try{user=(window.state&&window.state.currentUser)?window.state.currentUser:'there';}catch(e){}
        msgs.innerHTML = `
          <div class="ai-welcome-card">
            <div class="ai-welcome-card-icon">🤖</div>
            <div class="ai-welcome-card-title">ICF Data Agent</div>
            <div class="ai-welcome-card-body">
              Hello, <strong>${user}</strong>! I analyse all submitted ITN data — coverage,
              enrollment, gender breakdown, class-level stats and more.<br><br>
              Powered by <strong>Google Apps Script + Claude AI</strong>.
              API key stays securely on the server.
            </div>
          </div>`;
        // chips
        const chips = document.getElementById('aiChips');
        if (chips) {
            chips.innerHTML = '';
            pickSamples(6).forEach(q => {
                const b=document.createElement('span'); b.className='ai-chip'; b.textContent=q;
                b.onclick=()=>tabAiAsk(q); chips.appendChild(b);
            });
        }
        // stats strip in tab
        const strip = document.getElementById('aiStatsStrip');
        if (strip) { strip.innerHTML=statsHTML(null); fetchSheetCount().then(c=>strip.innerHTML=statsHTML(c)); }
    }

    function tabAiAsk(q) {
        const inp=document.getElementById('aiInput');
        if(inp){inp.value=q; aiAutoResize(inp);} aiSend();
    }
    window.tabAiAskQuestion = tabAiAsk;

    function tabMsg(role, text) {
        const msgs=document.getElementById('aiMessages'); if(!msgs) return;
        const isUser = role==='user';
        const div=document.createElement('div'); div.className='ai-msg'+(isUser?' user-msg':'');
        let init='U';
        try{init=(window.state&&window.state.currentUser)?window.state.currentUser.slice(0,2).toUpperCase():'U';}catch(e){}
        div.innerHTML=`<div class="ai-msg-av">${isUser
            ?`<span style="font-family:'Oswald',sans-serif;font-size:11px;font-weight:700;color:#fff;">${init}</span>`
            :'<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
        }</div><div class="ai-bub"></div>`;
        msgs.appendChild(div);
        div.querySelector('.ai-bub').innerHTML = isUser ? escHtml(text) : md(text);
        msgs.scrollTop=msgs.scrollHeight;
    }

    function tabTyping(show) {
        if(show){
            const msgs=document.getElementById('aiMessages'); if(!msgs) return;
            const d=document.createElement('div'); d.className='ai-msg'; d.id='aiTabTyp';
            d.innerHTML='<div class="ai-msg-av"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div><div class="ai-bub"><div class="ai-typing-dots"><div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div></div></div>';
            msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight;
        } else { const e=document.getElementById('aiTabTyp'); if(e) e.remove(); }
    }

    window.aiSend = async function () {
        const inp=document.getElementById('aiInput'), btn=document.getElementById('aiSendBtn');
        if(!inp) return; const q=inp.value.trim(); if(!q||tabBusy) return;
        inp.value=''; inp.style.height='auto';
        const chips=document.getElementById('aiChips'); if(chips) chips.style.display='none';
        tabMsg('user',q); tabHistory.push({role:'user',content:q});
        tabBusy=true; if(btn) btn.disabled=true; tabTyping(true);
        try {
            const reply = await callGAS(q, tabHistory);
            tabTyping(false); tabMsg('ai',reply); tabHistory.push({role:'assistant',content:reply});
        } catch(err) {
            tabTyping(false);
            tabMsg('ai',`⚠️ **Error:** ${err.message}\n\nCheck your GAS deployment URL.`);
        } finally { tabBusy=false; if(btn) btn.disabled=false; if(inp) inp.focus(); }
    };

    window.clearAIChat = function () { tabHistory=[]; tabInited=false; tabInitChat(); };
    window.aiAutoResize = el => { el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,110)+'px'; };
    window.aiKeydown    = e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();aiSend();} };

    // ════════════════════════════════════════════════════════
    //  DASHBOARD TAB
    // ════════════════════════════════════════════════════════
    function refreshDashboard() {
        const wrap=document.getElementById('dashWrap'); if(!wrap) return;
        let submitted=[],pending=[];
        try{submitted=JSON.parse(localStorage.getItem('itn_submitted')||'[]');pending=JSON.parse(localStorage.getItem('itn_pending')||'[]');}catch(e){}
        let tp=0,ti=0;
        submitted.forEach(s=>{const d=s.data||s;tp+=parseInt(d.total_pupils||0);ti+=parseInt(d.total_itn||0);});
        const cov=tp>0?Math.round((ti/tp)*100):0;
        const dd={};
        submitted.forEach(s=>{const d=s.data||s,dist=d.district||'Unknown';if(!dd[dist])dd[dist]={n:0,p:0,i:0};dd[dist].n++;dd[dist].p+=parseInt(d.total_pupils||0);dd[dist].i+=parseInt(d.total_itn||0);});
        const distRows=Object.keys(dd).length===0
            ?'<tr><td colspan="5" style="text-align:center;padding:20px;color:#8090a0;">No submissions yet</td></tr>'
            :Object.entries(dd).sort().map(([dist,v])=>{
                const c=v.p>0?Math.round((v.i/v.p)*100):0;
                return `<tr><td style="font-weight:600;">${dist}</td><td style="text-align:center;">${v.n}</td><td style="text-align:center;">${v.p.toLocaleString()}</td><td style="text-align:center;">${v.i.toLocaleString()}</td><td style="min-width:110px;"><div class="dash-prog-bar"><div class="dash-prog-fill ${c>=80?'done':''}" style="width:${Math.min(100,c)}%"></div></div><div style="font-size:10px;color:#8090a0;margin-top:2px;">${c}%</div></td></tr>`;
              }).join('');
        const recent=[...submitted].reverse().slice(0,8);
        const recentRows=recent.length===0
            ?'<tr><td colspan="5" style="text-align:center;padding:20px;color:#8090a0;">No submissions yet</td></tr>'
            :recent.map(s=>{const d=s.data||s,c=parseInt(d.coverage_total||0),col=c>=80?'#28a745':c>=50?'#b8860b':'#dc3545';return`<tr><td style="font-weight:600;">${d.school_name||'—'}</td><td>${d.community||'—'}</td><td>${d.district||'—'}</td><td>${d.submitted_by||'—'}</td><td style="text-align:center;font-weight:700;color:${col};">${c}%</td></tr>`;}).join('');
        wrap.innerHTML=`
          <div class="dash-kpi-row">
            <div class="dash-kpi"><div class="dash-kpi-val">${submitted.length}</div><div class="dash-kpi-lbl">Schools Submitted</div></div>
            <div class="dash-kpi kpi-green"><div class="dash-kpi-val">${tp.toLocaleString()}</div><div class="dash-kpi-lbl">Total Pupils</div></div>
            <div class="dash-kpi kpi-gold"><div class="dash-kpi-val">${ti.toLocaleString()}</div><div class="dash-kpi-lbl">ITNs Distributed</div></div>
            <div class="dash-kpi ${cov>=80?'kpi-green':cov<50?'kpi-red':''}"><div class="dash-kpi-val">${cov}%</div><div class="dash-kpi-lbl">Coverage</div></div>
            <div class="dash-kpi kpi-red"><div class="dash-kpi-val">${pending.length}</div><div class="dash-kpi-lbl">Pending Sync</div></div>
          </div>
          <div style="margin-bottom:18px;"><div style="display:flex;justify-content:space-between;font-family:'Oswald',sans-serif;font-size:11px;color:#8090a0;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;"><span>ITN Coverage</span><span>${cov}% / Target ≥80%</span></div><div class="dash-prog-bar" style="height:12px;"><div class="dash-prog-fill ${cov>=80?'done':''}" style="width:${Math.min(100,cov)}%;height:12px;"></div></div></div>
          <div class="dash-section-hdr">By District</div>
          <div class="dash-table-outer"><table class="dash-tbl"><thead><tr><th>District</th><th>Schools</th><th>Pupils</th><th>ITNs</th><th>Coverage</th></tr></thead><tbody>${distRows}</tbody></table></div>
          <div class="dash-section-hdr">Recent Submissions</div>
          <div class="dash-table-outer"><table class="dash-tbl"><thead><tr><th>School</th><th>Community</th><th>District</th><th>By</th><th>Coverage</th></tr></thead><tbody>${recentRows}</tbody></table></div>`;
    }

    // ════════════════════════════════════════════════════════
    //  TAB SWITCHING
    // ════════════════════════════════════════════════════════
    window.switchMainTab = function (tab) {
        document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
        const btn=document.getElementById('tab-btn-'+tab), panel=document.getElementById('tab-panel-'+tab);
        if(btn) btn.classList.add('active');
        if(panel) panel.classList.add('active');
        if(tab==='dashboard') refreshDashboard();
        if(tab==='ai'&&!tabInited) tabInitChat();
        if(tab==='ai'&&tabInited){const s=document.getElementById('aiStatsStrip');if(s){s.innerHTML=statsHTML(null);fetchSheetCount().then(c=>s.innerHTML=statsHTML(c));}}
    };

    // ════════════════════════════════════════════════════════
    //  DOM READY INIT
    // ════════════════════════════════════════════════════════
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
        const dp=document.getElementById('tab-panel-data'); if(dp) dp.classList.add('active');
        const db=document.getElementById('tab-btn-data'); if(db) db.classList.add('active');
        const inp=document.getElementById('aiInput');
        if(inp){
            inp.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();aiSend();}});
            inp.addEventListener('input',()=>aiAutoResize(inp));
        }
    });

    console.log('[ICF AI Agent — GAS Edition + Tabs] Loaded ✓');
})();
