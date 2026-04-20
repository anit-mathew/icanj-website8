(function() {

const COLORS_KEY = 'icanj_colors';

const defaults = {
  teal:       '#00C5CD',
  tealDark:   '#00a8b5',
  bg:         '#C8C8C8',
  bgSoft:     '#D4D4D4',
  bgCard:     '#DEDEDE',
  bgWhite:    '#EBEBEB',
  dark:       '#2a2a2a',
  dark2:      '#222222',
  ink:        '#1a1a1a',
  body:       '#333333',
  muted:      '#666666'
};

const presets = {
  'Grey 300':    { teal:'#00C5CD', tealDark:'#00a8b5', bg:'#C8C8C8', bgSoft:'#D4D4D4', bgCard:'#DEDEDE', bgWhite:'#EBEBEB', dark:'#2a2a2a', dark2:'#222222', ink:'#1a1a1a', body:'#333333', muted:'#666666' },
  'Dark':        { teal:'#00C5CD', tealDark:'#00a8b5', bg:'#141414', bgSoft:'#1c1c1c', bgCard:'#222222', bgWhite:'#2a2a2a', dark:'#0d0d0d', dark2:'#111111', ink:'#f0f0f0', body:'#a0a0a0', muted:'#666666' },
  'Warm Peach':  { teal:'#00C5CD', tealDark:'#00a8b5', bg:'#fffbf8', bgSoft:'#fef0e6', bgCard:'#fde4d2', bgWhite:'#fff5ee', dark:'#1a3d5c', dark2:'#12293d', ink:'#2a1a10', body:'#5a4535', muted:'#9a8070' },
  'Coastal':     { teal:'#00C5CD', tealDark:'#00a8b5', bg:'#e8f4fa', bgSoft:'#cce8f4', bgCard:'#b8ddf0', bgWhite:'#f5fbff', dark:'#0a4a6b', dark2:'#082d42', ink:'#082d42', body:'#2d5a72', muted:'#6a9cb4' },
  'Pure White':  { teal:'#00C5CD', tealDark:'#00a8b5', bg:'#ffffff', bgSoft:'#f4f4f4', bgCard:'#f9f9f9', bgWhite:'#ffffff', dark:'#1a1a1a', dark2:'#111111', ink:'#1a1a1a', body:'#444444', muted:'#888888' },
  'Slate':       { teal:'#00C5CD', tealDark:'#00a8b5', bg:'#e8eaf0', bgSoft:'#dde0ea', bgCard:'#d2d5e0', bgWhite:'#eef0f5', dark:'#1e2130', dark2:'#161824', ink:'#1e2130', body:'#3d4060', muted:'#7880a0' },
};

// Load saved or use defaults
let colors = Object.assign({}, defaults);
try {
  const saved = localStorage.getItem(COLORS_KEY);
  if (saved) colors = Object.assign({}, defaults, JSON.parse(saved));
} catch(e) {}

// Inject CSS variable tag
const styleTag = document.createElement('style');
styleTag.id = 'icanj-color-vars';
document.head.appendChild(styleTag);

function applyColors() {
  styleTag.textContent = `:root {
    --teal: ${colors.teal} !important;
    --teal-dark: ${colors.tealDark} !important;
    --teal-light: ${hexRgba(colors.teal, 0.12)} !important;
    --bg: ${colors.bg} !important;
    --bg-soft: ${colors.bgSoft} !important;
    --bg-card: ${colors.bgCard} !important;
    --bg-white: ${colors.bgWhite} !important;
    --dark: ${colors.dark} !important;
    --dark-2: ${colors.dark2} !important;
    --ink: ${colors.ink} !important;
    --body: ${colors.body} !important;
    --muted: ${colors.muted} !important;
  }`;
  // Also update announce bar, header bg directly
  document.querySelectorAll('.announce-bar').forEach(el => el.style.background = colors.teal);
  document.querySelectorAll('.site-header').forEach(el => el.style.background = colors.bgSoft);
  document.querySelectorAll('.btn-give').forEach(el => el.style.background = colors.teal);
  try { localStorage.setItem(COLORS_KEY, JSON.stringify(colors)); } catch(e) {}
}

function hexRgba(hex, a) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

// ── BUILD PANEL UI ──
const panelHTML = `
<div id="cm-toggle" title="Color Manager" style="position:fixed;bottom:24px;right:24px;z-index:9999;width:48px;height:48px;border-radius:50%;background:var(--teal);box-shadow:0 4px 20px rgba(0,0,0,0.25);cursor:pointer;display:flex;align-items:center;justify-content:center;border:none;transition:transform 0.2s;" onclick="window._cmToggle()">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    <circle cx="12" cy="12" r="7" stroke-dasharray="3 3"/>
  </svg>
</div>

<div id="cm-panel" style="position:fixed;top:0;right:-360px;width:360px;height:100vh;background:#1e1e1e;z-index:9998;display:flex;flex-direction:column;transition:right 0.3s cubic-bezier(0.16,1,0.3,1);box-shadow:-8px 0 40px rgba(0,0,0,0.3);font-family:'Inter',sans-serif;">

  <div style="background:#161616;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.07);flex-shrink:0;">
    <div style="font-size:13px;font-weight:800;color:#fff;letter-spacing:-0.01em;">Color Manager</div>
    <button onclick="window._cmToggle()" style="width:30px;height:30px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.5);cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;">✕</button>
  </div>

  <div style="overflow-y:auto;flex:1;padding:16px 20px;">

    <div style="margin-bottom:20px;">
      <div style="font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#666;margin-bottom:10px;">Presets</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;" id="cm-presets"></div>
    </div>

    <div style="margin-bottom:20px;">
      <div style="font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#666;margin-bottom:10px;">Accent</div>
      <div id="cm-rows-accent"></div>
    </div>

    <div style="margin-bottom:20px;">
      <div style="font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#666;margin-bottom:10px;">Backgrounds</div>
      <div id="cm-rows-bg"></div>
    </div>

    <div style="margin-bottom:20px;">
      <div style="font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#666;margin-bottom:10px;">Dark Sections</div>
      <div id="cm-rows-dark"></div>
    </div>

    <div style="margin-bottom:20px;">
      <div style="font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#666;margin-bottom:10px;">Text</div>
      <div id="cm-rows-text"></div>
    </div>

  </div>

  <div style="padding:14px 20px;border-top:1px solid rgba(255,255,255,0.07);display:flex;gap:8px;flex-shrink:0;">
    <button onclick="window._cmReset()" style="flex:1;padding:10px;border-radius:7px;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.6);font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;">Reset</button>
    <button onclick="window._cmExport()" style="flex:2;padding:10px;border-radius:7px;border:none;background:var(--teal);color:#fff;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;">Export CSS →</button>
  </div>

</div>

<div id="cm-export-modal" style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:10000;display:none;align-items:center;justify-content:center;">
  <div style="background:#fff;border-radius:14px;width:560px;max-height:80vh;overflow:hidden;display:flex;flex-direction:column;margin:20px;">
    <div style="padding:18px 22px;border-bottom:1px solid #f0f0f0;display:flex;align-items:center;justify-content:space-between;">
      <div style="font-size:15px;font-weight:800;color:#1a1a1a;">Export — Paste into style.css</div>
      <button onclick="document.getElementById('cm-export-modal').style.display='none'" style="width:30px;height:30px;border:none;background:#f5f5f5;border-radius:6px;cursor:pointer;font-size:16px;color:#666;">✕</button>
    </div>
    <div style="padding:18px 22px;overflow-y:auto;flex:1;">
      <p style="font-size:12px;color:#888;margin-bottom:12px;">Replace the <code style="background:#f0f0f0;padding:1px 5px;border-radius:3px;">:root { }</code> block at the top of your style.css with this:</p>
      <pre id="cm-export-code" style="font-family:monospace;font-size:11px;line-height:1.8;color:#333;background:#f8f8f8;border-radius:8px;padding:14px;white-space:pre-wrap;word-break:break-all;"></pre>
    </div>
    <div style="padding:14px 22px;border-top:1px solid #f0f0f0;display:flex;gap:8px;justify-content:flex-end;">
      <button onclick="document.getElementById('cm-export-modal').style.display='none'" style="padding:9px 18px;border-radius:7px;border:1px solid #ddd;background:transparent;color:#555;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;">Close</button>
      <button onclick="window._cmCopy()" id="cm-copy-btn" style="padding:9px 20px;border-radius:7px;border:none;background:#00C5CD;color:#fff;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;">Copy to Clipboard</button>
    </div>
  </div>
</div>
`;

document.body.insertAdjacentHTML('beforeend', panelHTML);

// Build color rows
function buildRow(containerId, key, label, desc) {
  const c = colors[key];
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;';
  row.innerHTML = `
    <div style="flex:1;">
      <div style="font-size:12px;font-weight:500;color:#ccc;">${label}</div>
      ${desc ? `<div style="font-size:10px;color:#555;">${desc}</div>` : ''}
    </div>
    <div style="display:flex;align-items:center;gap:8px;">
      <div id="cm-hex-${key}" style="font-size:10px;font-weight:600;color:#888;font-family:monospace;min-width:62px;text-align:right;">${c}</div>
      <div style="width:28px;height:28px;border-radius:6px;border:1px solid rgba(255,255,255,0.15);overflow:hidden;position:relative;background:${c};cursor:pointer;" id="cm-sw-${key}">
        <input type="color" value="${c}" style="position:absolute;inset:-4px;width:calc(100%+8px);height:calc(100%+8px);opacity:0;cursor:pointer;"
          oninput="window._cmUpdate('${key}',this.value)"/>
      </div>
    </div>`;
  document.getElementById(containerId).appendChild(row);
}

buildRow('cm-rows-accent', 'teal',     'Brand Accent',   'Buttons, eyebrows, active nav');
buildRow('cm-rows-accent', 'tealDark', 'Accent Hover',   'Hover state');
buildRow('cm-rows-bg',     'bg',       'Page Background','Main site background');
buildRow('cm-rows-bg',     'bgSoft',   'Section BG',     'Alternating sections');
buildRow('cm-rows-bg',     'bgCard',   'Cards',          'Ministry, event, info cards');
buildRow('cm-rows-bg',     'bgWhite',  'Elevated Cards', 'Forms, top-level cards');
buildRow('cm-rows-dark',   'dark',     'Hero / Masthead','Page headers, stats band, footer');
buildRow('cm-rows-dark',   'dark2',    'Footer / Verse', 'Verse bands, footer bg');
buildRow('cm-rows-text',   'ink',      'Headings',       null);
buildRow('cm-rows-text',   'body',     'Body Text',      null);
buildRow('cm-rows-text',   'muted',    'Muted Text',     null);

// Build preset buttons
const presetsEl = document.getElementById('cm-presets');
Object.keys(presets).forEach(name => {
  const btn = document.createElement('button');
  btn.style.cssText = 'padding:8px 10px;border-radius:7px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);cursor:pointer;font-family:Inter,sans-serif;font-size:11px;font-weight:600;color:#aaa;text-align:left;transition:all 0.2s;display:flex;align-items:center;gap:6px;';
  const dot = document.createElement('span');
  dot.style.cssText = `width:10px;height:10px;border-radius:50%;background:${presets[name].bg};border:1px solid rgba(255,255,255,0.2);flex-shrink:0;`;
  btn.appendChild(dot);
  btn.appendChild(document.createTextNode(name));
  btn.onclick = () => {
    Object.assign(colors, presets[name]);
    syncUI();
    applyColors();
    presetsEl.querySelectorAll('button').forEach(b => b.style.borderColor='rgba(255,255,255,0.1)');
    btn.style.borderColor = colors.teal;
    btn.style.color = '#fff';
  };
  presetsEl.appendChild(btn);
});

function syncUI() {
  Object.entries(colors).forEach(([k,v]) => {
    const hex = document.getElementById('cm-hex-'+k);
    const sw  = document.getElementById('cm-sw-'+k);
    if (hex) hex.textContent = v;
    if (sw)  { sw.style.background = v; const inp = sw.querySelector('input'); if(inp) inp.value = v; }
  });
}

// Global functions
window._cmToggle = function() {
  const panel = document.getElementById('cm-panel');
  const isOpen = panel.style.right === '0px';
  panel.style.right = isOpen ? '-360px' : '0px';
  document.getElementById('cm-toggle').style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
};

window._cmUpdate = function(key, val) {
  colors[key] = val;
  const hex = document.getElementById('cm-hex-'+key);
  const sw  = document.getElementById('cm-sw-'+key);
  if (hex) hex.textContent = val;
  if (sw)  sw.style.background = val;
  applyColors();
};

window._cmReset = function() {
  Object.assign(colors, defaults);
  syncUI();
  applyColors();
};

window._cmExport = function() {
  const c = colors;
  const code = `:root {\n  /* Accent */\n  --teal:        ${c.teal};\n  --teal-dark:   ${c.tealDark};\n  --teal-light:  ${hexRgba(c.teal,0.12)};\n\n  /* Backgrounds */\n  --bg:          ${c.bg};\n  --bg-soft:     ${c.bgSoft};\n  --bg-card:     ${c.bgCard};\n  --bg-white:    ${c.bgWhite};\n\n  /* Dark sections */\n  --dark:        ${c.dark};\n  --dark-2:      ${c.dark2};\n\n  /* Text */\n  --ink:         ${c.ink};\n  --body:        ${c.body};\n  --muted:       ${c.muted};\n  --border:      rgba(0,0,0,0.1);\n  --border-mid:  rgba(0,0,0,0.18);\n}`;
  document.getElementById('cm-export-code').textContent = code;
  document.getElementById('cm-export-modal').style.display = 'flex';
};

window._cmCopy = function() {
  navigator.clipboard.writeText(document.getElementById('cm-export-code').textContent).then(() => {
    const btn = document.getElementById('cm-copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy to Clipboard', 2000);
  });
};

// Apply on load
applyColors();

})();
