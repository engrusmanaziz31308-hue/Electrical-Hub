// ============ App state ============
const STATE = {
  lang: (localStorage.getItem('eh_lang')) || 'en',
  page: 'home',
  load: {},          // per-appliance {checked, qty, hrs, watt}
  customLoads: [],   // user-added loads {id, name, watt, qty, hrs, checked}
  solar: { dailyEnergy: 3000, peakLoad: 1000, sentFromLoad:false },
  quotation: loadQuotationState(),
};

APPLIANCES.forEach(a => {
  STATE.load[a.key] = { checked:false, qty:1, hrs:a.hrs, watt:a.watt };
});

let customLoadSeq = 1;

const NAV_ITEMS = [
  { key:'home', labelKey:'navHome' },
  { key:'load', labelKey:'navLoad' },
  { key:'solar', labelKey:'navSolar' },
  { key:'basics', labelKey:'navBasics' },
  { key:'wire', labelKey:'navWire' },
  { key:'converter', labelKey:'navConverter' },
  { key:'glossary', labelKey:'navGlossary' },
  { key:'quotation', labelKey:'navQuotation' },
];

// ============ Language ============
function setLang(lang){
  STATE.lang = lang;
  localStorage.setItem('eh_lang', lang);
  document.getElementById('htmlRoot').setAttribute('lang', lang === 'ur' ? 'ur' : 'en');
  document.getElementById('htmlRoot').setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');
  document.getElementById('btnEn').classList.toggle('active', lang==='en');
  document.getElementById('btnUr').classList.toggle('active', lang==='ur');
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    el.textContent = tr(el.getAttribute('data-i18n'), lang);
  });
  renderNav();
  renderPage(STATE.page);
}

// ============ Nav & routing ============
function renderNav(){
  const nav = document.getElementById('mainNav');
  nav.innerHTML = '';
  NAV_ITEMS.forEach(item=>{
    const btn = document.createElement('button');
    btn.textContent = tr(item.labelKey, STATE.lang);
    btn.className = item.key === STATE.page ? 'active' : '';
    btn.onclick = () => navigate(item.key);
    nav.appendChild(btn);
  });
}

function navigate(page){
  STATE.page = page;
  renderNav();
  renderPage(page);
  window.scrollTo({top:0, behavior:'smooth'});
}

function renderPage(page){
  const main = document.getElementById('mainContent');
  const renderers = {
    home: renderHome,
    load: renderLoad,
    solar: renderSolar,
    basics: renderBasics,
    wire: renderWire,
    converter: renderConverter,
    glossary: renderGlossary,
    quotation: renderQuotation,
  };
  main.innerHTML = '<div class="page active" id="pageWrap"></div>';
  (renderers[page] || renderHome)(document.getElementById('pageWrap'));
}

const L = (key) => tr(key, STATE.lang);
const fmt = (n, d=1) => Number(n).toLocaleString(undefined, {maximumFractionDigits:d, minimumFractionDigits:0});

// ============ HOME ============
function renderHome(el){
  const tools = [
    { icon:'Σ', titleKey:'toolLoadTitle', descKey:'toolLoadDesc', page:'load' },
    { icon:'☀', titleKey:'toolSolarTitle', descKey:'toolSolarDesc', page:'solar' },
    { icon:'V', titleKey:'toolBasicsTitle', descKey:'toolBasicsDesc', page:'basics' },
    { icon:'⏚', titleKey:'toolWireTitle', descKey:'toolWireDesc', page:'wire' },
    { icon:'⇄', titleKey:'toolConverterTitle', descKey:'toolConverterDesc', page:'converter' },
    { icon:'?', titleKey:'toolGlossaryTitle', descKey:'toolGlossaryDesc', page:'glossary' },
    { icon:'🧾', titleKey:'toolQuotationTitle', descKey:'toolQuotationDesc', page:'quotation' },
  ];
  el.innerHTML = `
    <div class="home-hero">
      <div class="eyebrow">Electrical Hub</div>
      <h1>${L('homeHeroTitle')}</h1>
      <p>${L('homeHeroDesc')}</p>
    </div>
    <div class="grid grid-3" id="toolGrid"></div>
  `;
  const grid = el.querySelector('#toolGrid');
  tools.forEach(t=>{
    const card = document.createElement('button');
    card.className = 'tool-card';
    card.onclick = () => navigate(t.page);
    card.innerHTML = `
      <div class="tool-icon">${t.icon}</div>
      <h4>${L(t.titleKey)}</h4>
      <p>${L(t.descKey)}</p>
      <div class="go">${L('goOpen')}</div>
    `;
    grid.appendChild(card);
  });
}

// ============ LOAD CALCULATOR ============
function renderLoad(el){
  el.innerHTML = `
    <div class="eyebrow">${L('navLoad')}</div>
    <h1 class="page-title">${L('loadPageTitle')}</h1>
    <p class="page-desc">${L('loadPageDesc')}</p>
    <div class="card">
      <div style="overflow-x:auto;">
      <table>
        <thead><tr>
          <th></th>
          <th>${L('colAppliance')}</th>
          <th>${L('colWatt')}</th>
          <th>${L('colQty')}</th>
          <th>${L('colHours')}</th>
          <th>${L('colEnergy')}</th>
          <th></th>
        </tr></thead>
        <tbody id="loadRows"></tbody>
      </table>
      </div>
      <p class="note">${L('loadWattEditNote')}</p>
      <div id="addLoadForm" style="margin-top:16px; padding-top:16px; border-top:1px solid var(--line-soft);">
        <label style="margin-bottom:8px;">${L('loadAddCustom')}</label>
        <div class="field-row" style="align-items:flex-end;">
          <div class="field" style="flex:2;">
            <input type="text" id="newLoadName" placeholder="${L('loadCustomNamePh')}">
          </div>
          <div class="field" style="flex:1;">
            <div class="unit-suffix"><input type="text" id="newLoadWatt" min="0" value="100"><span>W</span></div>
          </div>
          <div class="field" style="flex:0 0 80px;">
            <input type="text" id="newLoadQty" min="0" value="1" title="${L('colQty')}">
          </div>
          <div class="field" style="flex:0 0 80px;">
            <input type="text" id="newLoadHrs" min="0" step="0.5" value="1" title="${L('colHours')}">
          </div>
          <div class="field" style="flex:0 0 auto;">
            <button class="btn" onclick="addCustomLoad()">${L('loadCustomAdd')}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-2" style="margin-top:16px;">
      <div class="card">
        <h3>${L('loadTotalLoad')}</h3>
        <div class="result-box">
          <div class="result-row"><span class="result-label">${L('loadTotalLoad')}</span><span class="result-value big" id="loadTotalW">0 W</span></div>
          <div class="result-row"><span class="result-label">${L('loadTotalEnergy')}</span><span class="result-value big green" id="loadTotalWh">0 Wh</span></div>
        </div>
      </div>
      <div class="card" style="display:flex; flex-direction:column; justify-content:center; align-items:flex-start; gap:10px;">
        <p style="font-size:13px; color:var(--text-muted);">${STATE.lang==='ur' ? 'یہ اعداد و شمار سولر ڈیزائن پیج میں بھیجیں تاکہ پینل اور بیٹری کا حساب لگایا جا سکے۔' : 'Send these totals to Solar Design to size your panels and battery.'}</p>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn" onclick="sendLoadToSolar()">${L('loadSendToSolar')}</button>
          <button class="btn-ghost" onclick="downloadLoadPdf()">${L('downloadPdf')}</button>
        </div>
        <span id="sentMsg" style="display:none; color:var(--green); font-size:12.5px; font-weight:600;">${L('loadSentMsg')}</span>
      </div>
    </div>
  `;
  const rows = el.querySelector('#loadRows');
  APPLIANCES.forEach(a=>{
    const s = STATE.load[a.key];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" ${s.checked?'checked':''} onchange="onLoadChange('${a.key}','checked',this.checked)"></td>
      <td>${STATE.lang==='ur' ? a.ur : a.en}</td>
      <td><input class="qty-input" style="width:74px;" type="text" min="0" value="${s.watt}" onchange="onLoadChange('${a.key}','watt',this.value)"></td>
      <td><input class="qty-input" type="text" min="0" value="${s.qty}" onchange="onLoadChange('${a.key}','qty',this.value)"></td>
      <td><input class="qty-input" type="text" min="0" step="0.5" value="${s.hrs}" onchange="onLoadChange('${a.key}','hrs',this.value)"></td>
      <td class="mono" id="wh_${a.key}">0</td>
      <td></td>
    `;
    rows.appendChild(tr);
  });
  renderCustomLoadRows();
  recalcLoad();
}

function renderCustomLoadRows(){
  const rows = document.getElementById('loadRows');
  if(!rows) return;
  STATE.customLoads.forEach(c=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" ${c.checked?'checked':''} onchange="onCustomLoadChange('${c.id}','checked',this.checked)"></td>
      <td><input type="text" style="width:100%;" value="${c.name}" onchange="onCustomLoadChange('${c.id}','name',this.value)"></td>
      <td><input class="qty-input" style="width:74px;" type="text" min="0" value="${c.watt}" onchange="onCustomLoadChange('${c.id}','watt',this.value)"></td>
      <td><input class="qty-input" type="text" min="0" value="${c.qty}" onchange="onCustomLoadChange('${c.id}','qty',this.value)"></td>
      <td><input class="qty-input" type="text" min="0" step="0.5" value="${c.hrs}" onchange="onCustomLoadChange('${c.id}','hrs',this.value)"></td>
      <td class="mono" id="wh_c_${c.id}">0</td>
      <td><button class="btn-ghost" style="padding:5px 10px; font-size:11.5px;" onclick="removeCustomLoad('${c.id}')">${L('loadCustomRemove')}</button></td>
    `;
    rows.appendChild(tr);
  });
}

function addCustomLoad(){
  const nameEl = document.getElementById('newLoadName');
  const name = (nameEl.value || '').trim();
  if(!name){ alert(L('loadCustomNameRequired')); nameEl.focus(); return; }
  const watt = parseFloat(document.getElementById('newLoadWatt').value) || 0;
  const qty = parseFloat(document.getElementById('newLoadQty').value) || 1;
  const hrs = parseFloat(document.getElementById('newLoadHrs').value) || 1;
  STATE.customLoads.push({ id:'c'+(customLoadSeq++), name, watt, qty, hrs, checked:true });
  renderLoad(document.getElementById('pageWrap'));
}

function removeCustomLoad(id){
  STATE.customLoads = STATE.customLoads.filter(c => c.id !== id);
  renderLoad(document.getElementById('pageWrap'));
}

function onCustomLoadChange(id, field, value){
  const c = STATE.customLoads.find(c => c.id === id);
  if(!c) return;
  if(field === 'checked') c.checked = value;
  else if(field === 'name') c.name = value;
  else c[field] = parseFloat(value) || 0;
  recalcLoad();
}

function onLoadChange(key, field, value){
  if(field === 'checked') STATE.load[key].checked = value;
  else STATE.load[key][field] = parseFloat(value) || 0;
  recalcLoad();
}

function recalcLoad(){
  let totalW = 0, totalWh = 0;
  APPLIANCES.forEach(a=>{
    const s = STATE.load[a.key];
    const watt = s.watt;
    const wh = s.checked ? watt * s.qty * s.hrs : 0;
    const w = s.checked ? watt * s.qty : 0;
    totalW += w; totalWh += wh;
    const cell = document.getElementById('wh_'+a.key);
    if(cell) cell.textContent = fmt(wh,0);
  });
  STATE.customLoads.forEach(c=>{
    const wh = c.checked ? c.watt * c.qty * c.hrs : 0;
    const w = c.checked ? c.watt * c.qty : 0;
    totalW += w; totalWh += wh;
    const cell = document.getElementById('wh_c_'+c.id);
    if(cell) cell.textContent = fmt(wh,0);
  });
  const twEl = document.getElementById('loadTotalW');
  const whEl = document.getElementById('loadTotalWh');
  if(twEl) twEl.textContent = fmt(totalW,0) + ' W';
  if(whEl) whEl.textContent = fmt(totalWh,0) + ' Wh';
  STATE.load._totalW = totalW;
  STATE.load._totalWh = totalWh;
}

function sendLoadToSolar(){
  STATE.solar.dailyEnergy = STATE.load._totalWh || 0;
  STATE.solar.peakLoad = STATE.load._totalW || 0;
  STATE.solar.sentFromLoad = true;
  const msg = document.getElementById('sentMsg');
  if(msg) msg.style.display = 'inline';
  setTimeout(()=> navigate('solar'), 500);
}

// ============ SOLAR DESIGN ============
function renderSolar(el){
  const s = STATE.solar;
  el.innerHTML = `
    <div class="eyebrow">${L('navSolar')}</div>
    <h1 class="page-title">${L('solarPageTitle')}</h1>
    <p class="page-desc">${L('solarPageDesc')}</p>

    <div class="grid grid-2">
      <div class="card">
        <h3>${L('solarLoadCard')}</h3>
        <div class="field">
          <label>${L('solarDailyEnergy')}</label>
          <div class="unit-suffix"><input type="text" id="s_dailyEnergy" value="${s.dailyEnergy}" oninput="recalcSolar()"><span>Wh</span></div>
        </div>
        <div class="field">
          <label>${L('solarSafety')}</label>
          <div class="unit-suffix"><input type="text" id="s_safety" value="20" oninput="recalcSolar()"><span>%</span></div>
        </div>
        <div class="field" style="margin-bottom:0;">
          <label>${STATE.lang==='ur' ? 'مجموعی متصل لوڈ (پیک)' : 'Total connected / peak load'}</label>
          <div class="unit-suffix"><input type="text" id="s_peakLoad" value="${s.peakLoad}" oninput="recalcSolar()"><span>W</span></div>
        </div>
      </div>

      <div class="card">
        <h3>${L('solarPanelCard')}</h3>
        <div class="field-row">
          <div class="field">
            <label>${L('solarSunHours')}</label>
            <div class="unit-suffix"><input type="text" id="s_sunHours" value="5" step="0.1" oninput="recalcSolar()"><span>h</span></div>
          </div>
          <div class="field">
            <label>${L('solarSysEff')}</label>
            <div class="unit-suffix"><input type="text" id="s_sysEff" value="80" oninput="recalcSolar()"><span>%</span></div>
          </div>
        </div>
        <div class="field" style="margin-bottom:0;">
          <label>${L('solarPanelWp')}</label>
          <div class="unit-suffix"><input type="text" id="s_panelWp" value="330" oninput="recalcSolar()"><span>Wp</span></div>
        </div>
        <div class="result-box" style="margin-top:14px;">
          <div class="result-row"><span class="result-label">${L('solarReqArrayWp')}</span><span class="result-value" id="r_arrayWp">-</span></div>
          <div class="result-row"><span class="result-label">${L('solarPanelsNeeded')}</span><span class="result-value big" id="r_panels">-</span></div>
        </div>
      </div>

      <div class="card">
        <h3>${L('solarBatteryCard')}</h3>
        <div class="field-row">
          <div class="field">
            <label>${L('solarAutonomy')}</label>
            <div class="unit-suffix"><input type="text" id="s_autonomy" value="1" step="0.5" oninput="recalcSolar()"><span>d</span></div>
          </div>
          <div class="field">
            <label>${L('solarBattVoltage')}</label>
            <select id="s_battV" onchange="recalcSolar()">
              <option value="12">12 V</option>
              <option value="24" selected>24 V</option>
              <option value="48">48 V</option>
            </select>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label>${L('solarDOD')}</label>
            <div class="unit-suffix"><input type="text" id="s_dod" value="50" oninput="recalcSolar()"><span>%</span></div>
          </div>
          <div class="field">
            <label>${L('solarBattEff')}</label>
            <div class="unit-suffix"><input type="text" id="s_battEff" value="85" oninput="recalcSolar()"><span>%</span></div>
          </div>
        </div>
        <div class="field" style="margin-bottom:0;">
          <label>${L('solarBattUnit')}</label>
          <div class="unit-suffix"><input type="text" id="s_battUnit" value="100" oninput="recalcSolar()"><span>Ah</span></div>
        </div>
        <div class="result-box" style="margin-top:14px;">
          <div class="result-row"><span class="result-label">${L('solarReqAh')}</span><span class="result-value" id="r_reqAh">-</span></div>
          <div class="result-row"><span class="result-label">${L('solarBattCount')}</span><span class="result-value big" id="r_battCount">-</span></div>
        </div>
      </div>

      <div class="card">
        <h3>${L('solarInverterCard')}</h3>
        <div class="field-row">
          <div class="field">
            <label>${L('solarSurge')}</label>
            <div class="unit-suffix"><input type="text" id="s_surge" value="1.25" step="0.05" oninput="recalcSolar()"><span>×</span></div>
          </div>
          <div class="field">
            <label>${L('solarPF')}</label>
            <div class="unit-suffix"><input type="text" id="s_pf" value="0.8" step="0.05" oninput="recalcSolar()"><span></span></div>
          </div>
        </div>
        <div class="result-box" style="margin-top:8px;">
          <div class="result-row"><span class="result-label">${L('solarReqVA')}</span><span class="result-value big" id="r_inverter">-</span></div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px;">
      <h3>${L('solarDcCard')} <span class="tag">${L('dcTag')} ⏚</span></h3>
      <div class="result-box" id="r_dcWiring"></div>
      <p class="note">${L('solarDcNote')}</p>
    </div>

    <div class="card" style="margin-top:16px;">
      <h3>${L('solarSummaryCard')} <span class="tag">Σ</span></h3>
      <div class="result-box" id="r_summary"></div>
      <p class="note">${L('solarNote')}</p>
      <button class="btn-ghost" style="margin-top:14px;" onclick="downloadSolarPdf()">${L('downloadPdf')}</button>
    </div>
  `;
  if(s._battV) el.querySelector('#s_battV').value = s._battV;
  recalcSolar();
}

const STD_INVERTER_SIZES = [800,1000,1500,2000,2500,3000,3500,4000,5000,6000,8000,10000];
function roundInverter(va){
  for(const v of STD_INVERTER_SIZES) if(va <= v) return v;
  return Math.ceil(va/1000)*1000;
}

// Pick smallest wire from WIRE_CHART whose rating covers current × 1.25 safety factor
function pickWireForCurrent(currentA){
  const sized = currentA * 1.25;
  for(const w of WIRE_CHART){
    if(parseFloat(w.rating) >= sized) return w;
  }
  return WIRE_CHART[WIRE_CHART.length - 1];
}
// Pick smallest standard breaker rating that covers current × 1.25 safety factor
function pickBreakerForCurrent(currentA){
  const sized = currentA * 1.25;
  for(const b of STD_BREAKER_SIZES){
    if(b >= sized) return b;
  }
  return STD_BREAKER_SIZES[STD_BREAKER_SIZES.length - 1];
}

function recalcSolar(){
  const g = id => document.getElementById(id);
  const dailyEnergy = parseFloat(g('s_dailyEnergy').value) || 0;
  const safety = parseFloat(g('s_safety').value) || 0;
  const peakLoad = parseFloat(g('s_peakLoad').value) || 0;
  const sunHours = parseFloat(g('s_sunHours').value) || 1;
  const sysEff = parseFloat(g('s_sysEff').value) || 1;
  const panelWp = parseFloat(g('s_panelWp').value) || 1;
  const autonomy = parseFloat(g('s_autonomy').value) || 1;
  const battV = parseFloat(g('s_battV').value) || 12;
  const dod = parseFloat(g('s_dod').value) || 50;
  const battEff = parseFloat(g('s_battEff').value) || 85;
  const battUnit = parseFloat(g('s_battUnit').value) || 100;
  const surge = parseFloat(g('s_surge').value) || 1;
  const pf = parseFloat(g('s_pf').value) || 0.8;

  STATE.solar._battV = battV;

  const adjEnergy = dailyEnergy * (1 + safety/100);
  const reqArrayWp = adjEnergy / (sunHours * (sysEff/100));
  const panelsNeeded = Math.ceil(reqArrayWp / panelWp);

  const reqAh = (adjEnergy * autonomy) / (battV * (dod/100) * (battEff/100));
  const battCount = Math.ceil(reqAh / battUnit);

  const inverterVA = (peakLoad * surge) / pf;
  const inverterRecommended = roundInverter(inverterVA);

  g('r_arrayWp').textContent = fmt(reqArrayWp,0) + ' Wp';
  g('r_panels').textContent = panelsNeeded + (STATE.lang==='ur' ? ' پینل' : ' panels');
  g('r_reqAh').textContent = fmt(reqAh,0) + ' Ah @ ' + battV + 'V';
  g('r_battCount').textContent = battCount + (STATE.lang==='ur' ? ' بیٹریاں' : ' batteries');
  g('r_inverter').textContent = fmt(inverterRecommended,0) + ' VA';

  // DC wiring & breaker sizing (battery↔inverter, solar array↔charge controller)
  const battInvCurrent = battV > 0 ? inverterRecommended / battV : 0;
  const battWire = pickWireForCurrent(battInvCurrent);
  const battBreaker = pickBreakerForCurrent(battInvCurrent);
  const pvCurrent = battV > 0 ? reqArrayWp / battV : 0;
  const pvWire = pickWireForCurrent(pvCurrent);
  const pvBreaker = pickBreakerForCurrent(pvCurrent);

  const isUr = STATE.lang === 'ur';
  g('r_dcWiring').innerHTML = `
    <div class="result-row"><span class="result-label">${L('solarDcBattInv')}</span><span class="result-value">${battWire.size} mm² <span class="mono" style="font-size:11px; color:var(--text-faint);">(~${fmt(battInvCurrent,1)} A)</span></span></div>
    <div class="result-row"><span class="result-label">${L('solarDcBattInvBreaker')}</span><span class="result-value green">${battBreaker} A</span></div>
    <div class="result-row"><span class="result-label">${L('solarDcPvCc')}</span><span class="result-value">${pvWire.size} mm² <span class="mono" style="font-size:11px; color:var(--text-faint);">(~${fmt(pvCurrent,1)} A)</span></span></div>
    <div class="result-row"><span class="result-label">${L('solarDcPvCcBreaker')}</span><span class="result-value green">${pvBreaker} A</span></div>
  `;

  g('r_summary').innerHTML = `
    <div class="result-row"><span class="result-label">${isUr?'روزانہ توانائی (مارجن سمیت)':'Daily energy (with margin)'}</span><span class="result-value">${fmt(adjEnergy,0)} Wh</span></div>
    <div class="result-row"><span class="result-label">${isUr?'سولر پینل':'Solar panels'}</span><span class="result-value green">${panelsNeeded} × ${panelWp} Wp (${fmt(panelsNeeded*panelWp,0)} Wp ${isUr?'مجموعی':'total'})</span></div>
    <div class="result-row"><span class="result-label">${isUr?'بیٹری بینک':'Battery bank'}</span><span class="result-value green">${battCount} × ${battUnit} Ah @ ${battV}V</span></div>
    <div class="result-row"><span class="result-label">${isUr?'انورٹر':'Inverter'}</span><span class="result-value green">${fmt(inverterRecommended,0)} VA (~${fmt(inverterRecommended/1000,1)} kVA)</span></div>
  `;

  // Store latest computed results for PDF report generation
  STATE.solar._computed = {
    dailyEnergy, safety, peakLoad, sunHours, sysEff, panelWp, autonomy, battV, dod, battEff, battUnit, surge, pf,
    adjEnergy, reqArrayWp, panelsNeeded, reqAh, battCount, inverterVA: inverterRecommended,
    battInvCurrent, battWire: battWire.size, battBreaker, pvCurrent, pvWire: pvWire.size, pvBreaker,
  };
}

// ============ ELECTRICAL BASICS ============
let basicsTab = 'ohm';
function renderBasics(el){
  const tabs = [
    {k:'ohm', l:'tabOhm'}, {k:'power', l:'tabPower'}, {k:'energy', l:'tabEnergy'},
    {k:'p3', l:'tab3phase'}, {k:'vdrop', l:'tabVdrop'},
  ];
  el.innerHTML = `
    <div class="eyebrow">${L('navBasics')}</div>
    <h1 class="page-title">${L('basicsPageTitle')}</h1>
    <p class="page-desc">${L('basicsPageDesc')}</p>
    <div class="subtabs" id="basicsTabs"></div>
    <div id="basicsContent"></div>
  `;
  const tabWrap = el.querySelector('#basicsTabs');
  tabs.forEach(t=>{
    const b = document.createElement('button');
    b.textContent = L(t.l);
    b.className = basicsTab === t.k ? 'active' : '';
    b.onclick = () => { basicsTab = t.k; renderBasics(document.getElementById('pageWrap')); };
    tabWrap.appendChild(b);
  });
  const content = el.querySelector('#basicsContent');
  const map = { ohm:renderOhm, power:renderPowerCalc, energy:renderEnergyCalc, p3:renderP3Calc, vdrop:renderVdropCalc };
  map[basicsTab](content);
}

function renderOhm(el){
  el.innerHTML = `
    <div class="card" style="max-width:520px;">
      <h3>${L('ohmTitle')}</h3>
      <p style="font-size:12.5px; color:var(--text-muted); margin-bottom:16px;">${L('ohmDesc')}</p>
      <div class="field"><label>${L('voltage')}</label><input type="text" id="ohmV" oninput="recalcOhm('V')"></div>
      <div class="field"><label>${L('current')}</label><input type="text" id="ohmI" oninput="recalcOhm('I')"></div>
      <div class="field"><label>${L('resistance')}</label><input type="text" id="ohmR" oninput="recalcOhm('R')"></div>
      <div class="result-box">
        <div class="result-row"><span class="result-label">${L('power')}</span><span class="result-value big" id="ohmP">-</span></div>
      </div>
      <button class="btn-ghost" style="margin-top:12px;" onclick="clearOhm()">${L('clearAll')}</button>
    </div>
  `;
}
function clearOhm(){
  ['ohmV','ohmI','ohmR'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('ohmP').textContent = '-';
}
function recalcOhm(changed){
  const V = document.getElementById('ohmV').value;
  const I = document.getElementById('ohmI').value;
  const R = document.getElementById('ohmR').value;
  const vN = parseFloat(V), iN = parseFloat(I), rN = parseFloat(R);
  const has = { V: V!=='', I: I!=='', R: R!=='' };
  const filledCount = Object.values(has).filter(Boolean).length;

  if(filledCount >= 2){
    if(!has.V && has.I && has.R) document.getElementById('ohmV').value = (iN*rN).toFixed(3);
    else if(!has.I && has.V && has.R) document.getElementById('ohmI').value = (rN!==0 ? (vN/rN).toFixed(3) : '');
    else if(!has.R && has.V && has.I) document.getElementById('ohmR').value = (iN!==0 ? (vN/iN).toFixed(3) : '');
  }
  const V2 = parseFloat(document.getElementById('ohmV').value);
  const I2 = parseFloat(document.getElementById('ohmI').value);
  const R2 = parseFloat(document.getElementById('ohmR').value);
  let P = null;
  if(!isNaN(V2) && !isNaN(I2)) P = V2*I2;
  else if(!isNaN(I2) && !isNaN(R2)) P = I2*I2*R2;
  else if(!isNaN(V2) && !isNaN(R2) && R2!==0) P = (V2*V2)/R2;
  document.getElementById('ohmP').textContent = P!==null ? fmt(P,2) + ' W' : '-';
}

function renderPowerCalc(el){
  el.innerHTML = `
    <div class="card" style="max-width:520px;">
      <h3>${L('powerTitle')}</h3>
      <p style="font-size:12.5px; color:var(--text-muted); margin-bottom:16px;">${L('powerDesc')}</p>
      <div class="field">
        <label>${L('phaseType')}</label>
        <select id="pw_phase" onchange="recalcPower()">
          <option value="1">${L('singlePhase')}</option>
          <option value="3">${L('threePhase')}</option>
        </select>
      </div>
      <div class="field-row">
        <div class="field"><label>${L('voltage')}</label><input type="text" id="pw_v" value="230" oninput="recalcPower()"></div>
        <div class="field"><label>${L('current')}</label><input type="text" id="pw_i" value="5" oninput="recalcPower()"></div>
      </div>
      <div class="field"><label>${L('powerFactor')}</label><input type="text" id="pw_pf" value="0.9" step="0.05" oninput="recalcPower()"></div>
      <div class="result-box">
        <div class="result-row"><span class="result-label">${L('realPower')}</span><span class="result-value big" id="pw_real">-</span></div>
        <div class="result-row"><span class="result-label">${L('apparentPower')}</span><span class="result-value" id="pw_apparent">-</span></div>
      </div>
    </div>
  `;
  recalcPower();
}
function recalcPower(){
  const phase = parseFloat(document.getElementById('pw_phase').value);
  const V = parseFloat(document.getElementById('pw_v').value) || 0;
  const I = parseFloat(document.getElementById('pw_i').value) || 0;
  const pf = parseFloat(document.getElementById('pw_pf').value) || 0;
  const mult = phase === 3 ? Math.sqrt(3) : 1;
  const apparent = mult * V * I;
  const real = apparent * pf;
  document.getElementById('pw_real').textContent = fmt(real,1) + ' W';
  document.getElementById('pw_apparent').textContent = fmt(apparent,1) + ' VA';
}

function renderEnergyCalc(el){
  el.innerHTML = `
    <div class="card" style="max-width:520px;">
      <h3>${L('energyTitle')}</h3>
      <p style="font-size:12.5px; color:var(--text-muted); margin-bottom:16px;">${L('energyDesc')}</p>
      <div class="field-row">
        <div class="field"><label>${L('loadWatt')}</label><input type="text" id="en_w" value="1000" oninput="recalcEnergy()"></div>
        <div class="field"><label>${L('hoursPerDay')}</label><input type="text" id="en_h" value="5" oninput="recalcEnergy()"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>${L('daysPerMonth')}</label><input type="text" id="en_d" value="30" oninput="recalcEnergy()"></div>
        <div class="field"><label>${L('ratePerUnit')}</label><input type="text" id="en_r" value="45" oninput="recalcEnergy()"></div>
      </div>
      <div class="result-box">
        <div class="result-row"><span class="result-label">${L('unitsDay')}</span><span class="result-value" id="en_ud">-</span></div>
        <div class="result-row"><span class="result-label">${L('unitsMonth')}</span><span class="result-value" id="en_um">-</span></div>
        <div class="result-row"><span class="result-label">${L('costMonth')}</span><span class="result-value big green" id="en_cost">-</span></div>
      </div>
    </div>
  `;
  recalcEnergy();
}
function recalcEnergy(){
  const w = parseFloat(document.getElementById('en_w').value) || 0;
  const h = parseFloat(document.getElementById('en_h').value) || 0;
  const d = parseFloat(document.getElementById('en_d').value) || 0;
  const r = parseFloat(document.getElementById('en_r').value) || 0;
  const unitsDay = (w*h)/1000;
  const unitsMonth = unitsDay*d;
  const cost = unitsMonth*r;
  document.getElementById('en_ud').textContent = fmt(unitsDay,2) + ' kWh';
  document.getElementById('en_um').textContent = fmt(unitsMonth,2) + ' kWh';
  document.getElementById('en_cost').textContent = 'PKR ' + fmt(cost,0);
}

function renderP3Calc(el){
  el.innerHTML = `
    <div class="card" style="max-width:520px;">
      <h3>${L('p3Title')}</h3>
      <p style="font-size:12.5px; color:var(--text-muted); margin-bottom:16px;">${L('p3Desc')}</p>
      <div class="field-row">
        <div class="field"><label>${L('lineVoltage')}</label><input type="text" id="p3_v" value="400" oninput="recalcP3()"></div>
        <div class="field"><label>${L('lineCurrent')}</label><input type="text" id="p3_i" value="10" oninput="recalcP3()"></div>
      </div>
      <div class="field"><label>${L('powerFactor')}</label><input type="text" id="p3_pf" value="0.9" step="0.05" oninput="recalcP3()"></div>
      <div class="result-box">
        <div class="result-row"><span class="result-label">${L('realPower')}</span><span class="result-value big" id="p3_real">-</span></div>
        <div class="result-row"><span class="result-label">${L('apparentPower')}</span><span class="result-value" id="p3_apparent">-</span></div>
      </div>
    </div>
  `;
  recalcP3();
}
function recalcP3(){
  const V = parseFloat(document.getElementById('p3_v').value) || 0;
  const I = parseFloat(document.getElementById('p3_i').value) || 0;
  const pf = parseFloat(document.getElementById('p3_pf').value) || 0;
  const apparent = Math.sqrt(3)*V*I;
  const real = apparent*pf;
  document.getElementById('p3_real').textContent = fmt(real,1) + ' W';
  document.getElementById('p3_apparent').textContent = fmt(apparent,1) + ' VA';
}

function renderVdropCalc(el){
  el.innerHTML = `
    <div class="card" style="max-width:520px;">
      <h3>${L('vdTitle')}</h3>
      <p style="font-size:12.5px; color:var(--text-muted); margin-bottom:16px;">${L('vdDesc')}</p>
      <div class="field-row">
        <div class="field"><label>${L('current')}</label><input type="text" id="vd_i" value="10" oninput="recalcVdrop()"></div>
        <div class="field"><label>${L('cableLength')}</label><input type="text" id="vd_len" value="20" oninput="recalcVdrop()"></div>
      </div>
      <div class="field"><label>${L('cableSize')}</label><input type="text" id="vd_size" value="2.5" step="0.5" oninput="recalcVdrop()"></div>
      <div class="field"><label>${L('voltage')}</label><input type="text" id="vd_v" value="230" oninput="recalcVdrop()"></div>
      <div class="result-box">
        <div class="result-row"><span class="result-label">${L('vdResult')}</span><span class="result-value big" id="vd_drop">-</span></div>
        <div class="result-row"><span class="result-label">${L('vdPercent')}</span><span class="result-value" id="vd_pct">-</span></div>
      </div>
      <p class="note" id="vd_status"></p>
    </div>
  `;
  recalcVdrop();
}
function recalcVdrop(){
  const I = parseFloat(document.getElementById('vd_i').value) || 0;
  const len = parseFloat(document.getElementById('vd_len').value) || 0;
  const size = parseFloat(document.getElementById('vd_size').value) || 1;
  const V = parseFloat(document.getElementById('vd_v').value) || 230;
  const rho = 0.0175; // ohm*mm^2/m for copper
  const drop = (2 * rho * len * I) / size;
  const pct = (drop / V) * 100;
  document.getElementById('vd_drop').textContent = fmt(drop,2) + ' V';
  document.getElementById('vd_pct').textContent = fmt(pct,2) + ' %';
  const statusEl = document.getElementById('vd_status');
  statusEl.textContent = pct <= 3 ? L('vdOk') : L('vdHigh');
  statusEl.style.color = pct <= 3 ? 'var(--green)' : 'var(--red)';
  statusEl.style.borderColor = pct <= 3 ? 'var(--green)' : 'var(--red)';
}

// ============ WIRE CHART ============
let wireTab = 'metric';
function renderWire(el){
  const isUr = STATE.lang === 'ur';
  const tabs = [
    { k:'metric',   l:'tabWireMetric' },
    { k:'imperial', l:'tabWireImperial' },
    { k:'breaker',  l:'tabBreakerChart' },
  ];
  el.innerHTML = `
    <div class="eyebrow">${L('navWire')}</div>
    <h1 class="page-title">${L('wirePageTitle')}</h1>
    <p class="page-desc">${L('wirePageDesc')}</p>
    <div class="subtabs" id="wireTabs"></div>
    <div id="wireContent"></div>
  `;
  const tabWrap = el.querySelector('#wireTabs');
  tabs.forEach(t=>{
    const b = document.createElement('button');
    b.textContent = L(t.l);
    b.className = wireTab === t.k ? 'active' : '';
    b.onclick = () => { wireTab = t.k; renderWire(document.getElementById('pageWrap')); };
    tabWrap.appendChild(b);
  });

  const content = el.querySelector('#wireContent');
  if(wireTab === 'breaker'){
    content.innerHTML = `
      <div class="card">
        <div style="overflow-x:auto;">
        <table>
          <thead><tr>
            <th>${L('colBreakerAmp')}</th>
            <th>${L('colMatchedWire')}</th>
            <th>${L('colBreakerCurve')}</th>
            <th>${L('colTypicalUse')}</th>
          </tr></thead>
          <tbody>
            ${BREAKER_CHART.map(b => `
              <tr>
                <td class="mono">${b.amp} A</td>
                <td class="mono">${b.wire}</td>
                <td class="mono">${b.curve}</td>
                <td>${isUr ? b.use_ur : b.use_en}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        </div>
        <p class="note">${L('breakerChartNote')}</p>
      </div>
    `;
  } else if(wireTab === 'imperial'){
    content.innerHTML = `
      <div class="card">
        <div style="overflow-x:auto;">
        <table>
          <thead><tr>
            <th>${L('colImperialSize')}</th>
            <th>${L('colEquivMm')}</th>
            <th>${L('colCurrentRating')}</th>
            <th>${L('colBreaker')}</th>
            <th>${L('colTypicalUse')}</th>
          </tr></thead>
          <tbody>
            ${WIRE_CHART.map(w => `
              <tr>
                <td class="mono">${w.imperial}</td>
                <td class="mono">${w.size}</td>
                <td class="mono">${w.rating}</td>
                <td class="mono">${w.breaker}</td>
                <td>${isUr ? w.use_ur : w.use_en}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        </div>
        <p class="note">${L('wireImperialNote')}</p>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div class="card">
        <div style="overflow-x:auto;">
        <table>
          <thead><tr>
            <th>${L('colCableSize')}</th>
            <th>${L('colSwg')}</th>
            <th>${L('colCurrentRating')}</th>
            <th>${L('colBreaker')}</th>
            <th>${L('colTypicalUse')}</th>
          </tr></thead>
          <tbody>
            ${WIRE_CHART.map(w => `
              <tr>
                <td class="mono">${w.size}</td>
                <td class="mono">${w.swg}</td>
                <td class="mono">${w.rating}</td>
                <td class="mono">${w.breaker}</td>
                <td>${isUr ? w.use_ur : w.use_en}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        </div>
      </div>
    `;
  }
}

// ============ UNIT CONVERTER ============
let convTab = 'length';
function renderConverter(el){
  const tabs = [
    { k:'length', l:'tabConvLength' },
    { k:'power',  l:'tabConvPower' },
    { k:'energy', l:'tabConvEnergy' },
    { k:'wire',   l:'tabConvWire' },
  ];
  el.innerHTML = `
    <div class="eyebrow">${L('navConverter')}</div>
    <h1 class="page-title">${L('converterPageTitle')}</h1>
    <p class="page-desc">${L('converterPageDesc')}</p>
    <div class="subtabs" id="convTabs"></div>
    <div id="convContent"></div>
  `;
  const tabWrap = el.querySelector('#convTabs');
  tabs.forEach(t=>{
    const b = document.createElement('button');
    b.textContent = L(t.l);
    b.className = convTab === t.k ? 'active' : '';
    b.onclick = () => { convTab = t.k; renderConverter(document.getElementById('pageWrap')); };
    tabWrap.appendChild(b);
  });
  const content = el.querySelector('#convContent');
  const map = { length: renderUnitConv(LENGTH_UNITS,'toM'), power: renderUnitConv(POWER_UNITS,'toW'), energy: renderUnitConv(ENERGY_UNITS,'toWh') };
  if(convTab === 'wire') renderWireConv(content);
  else map[convTab](content);
}

function renderUnitConv(units, baseKey){
  return function(el){
    el.innerHTML = `
      <div class="card" style="max-width:520px;">
        <div class="field">
          <label>${L('convValue')}</label>
          <input type="text" id="conv_value" value="1" oninput="recalcUnitConv()">
        </div>
        <div class="field-row">
          <div class="field">
            <label>${L('convFrom')}</label>
            <select id="conv_from" onchange="recalcUnitConv()">
              ${units.map(u => `<option value="${u.key}">${STATE.lang==='ur' ? u.ur : u.en}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label>${L('convTo')}</label>
            <select id="conv_to" onchange="recalcUnitConv()">
              ${units.map((u,i) => `<option value="${u.key}" ${i===1?'selected':''}>${STATE.lang==='ur' ? u.ur : u.en}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="result-box">
          <div class="result-row"><span class="result-label">${L('convResult')}</span><span class="result-value big" id="conv_result">-</span></div>
        </div>
      </div>
    `;
    el.dataset.units = JSON.stringify(units);
    el.dataset.baseKey = baseKey;
    window._convUnits = units;
    window._convBaseKey = baseKey;
    recalcUnitConv();
  };
}

function recalcUnitConv(){
  const units = window._convUnits;
  const baseKey = window._convBaseKey;
  const value = parseFloat(document.getElementById('conv_value').value) || 0;
  const fromKey = document.getElementById('conv_from').value;
  const toKey = document.getElementById('conv_to').value;
  const from = units.find(u => u.key === fromKey);
  const to = units.find(u => u.key === toKey);
  if(!from || !to) return;
  const base = value * from[baseKey];
  const result = base / to[baseKey];
  document.getElementById('conv_result').textContent = fmt(result, 6) + ' ' + to.key;
}

function renderWireConv(el){
  el.innerHTML = `
    <div class="card">
      <div style="overflow-x:auto;">
      <table>
        <thead><tr>
          <th>${L('convWireMm2')}</th>
          <th>${L('convWireAwg')}</th>
        </tr></thead>
        <tbody>
          ${WIRE_MM2_AWG.map(w => `
            <tr><td class="mono">${w.mm2}</td><td class="mono">${w.awg}</td></tr>
          `).join('')}
        </tbody>
      </table>
      </div>
      <p class="note">${L('convWireNote')}</p>
    </div>
  `;
}

// ============ PDF REPORTS (via print) ============
function getPrintArea(){
  let el = document.getElementById('printArea');
  if(!el){
    el = document.createElement('div');
    el.id = 'printArea';
    document.body.appendChild(el);
  }
  return el;
}

function reportHeader(titleKey){
  const isUr = STATE.lang === 'ur';
  const now = new Date();
  const dateStr = now.toLocaleDateString(isUr ? 'ur-PK' : 'en-PK', { year:'numeric', month:'long', day:'numeric' });
  return `
    <div class="rep-header">
      <div class="rep-brand">⚡ ${L('brandName')}</div>
      <h1>${L(titleKey)}</h1>
      <div class="rep-meta">${L('reportGenerated')}: ${dateStr}</div>
    </div>
  `;
}

function reportFooter(){
  return `<div class="rep-footer">${L('reportFooterNote')}</div>`;
}

function renderPrintReport(innerHtml){
  const area = getPrintArea();
  const isUr = STATE.lang === 'ur';
  area.setAttribute('dir', isUr ? 'rtl' : 'ltr');
  area.className = isUr ? 'lang-ur' : 'lang-en';
  area.innerHTML = innerHtml;
  setTimeout(() => window.print(), 60);
}

function downloadLoadPdf(){
  const isUr = STATE.lang === 'ur';
  const rowsHtml = [];
  APPLIANCES.forEach(a=>{
    const s = STATE.load[a.key];
    if(!s.checked) return;
    const wh = s.watt * s.qty * s.hrs;
    rowsHtml.push(`<tr><td>${isUr ? a.ur : a.en}</td><td>${s.watt}</td><td>${s.qty}</td><td>${s.hrs}</td><td>${fmt(wh,0)}</td></tr>`);
  });
  STATE.customLoads.forEach(c=>{
    if(!c.checked) return;
    const wh = c.watt * c.qty * c.hrs;
    rowsHtml.push(`<tr><td>${c.name}</td><td>${c.watt}</td><td>${c.qty}</td><td>${c.hrs}</td><td>${fmt(wh,0)}</td></tr>`);
  });
  const totalW = STATE.load._totalW || 0;
  const totalWh = STATE.load._totalWh || 0;
  const html = `
    ${reportHeader('reportLoadSection')}
    <table class="rep-table">
      <thead><tr><th>${L('colAppliance')}</th><th>${L('colWatt')}</th><th>${L('colQty')}</th><th>${L('colHours')}</th><th>${L('colEnergy')}</th></tr></thead>
      <tbody>${rowsHtml.join('') || `<tr><td colspan="5">${L('noResults')}</td></tr>`}</tbody>
    </table>
    <table class="rep-summary">
      <tr><td>${L('loadTotalLoad')}</td><td>${fmt(totalW,0)} W</td></tr>
      <tr><td>${L('loadTotalEnergy')}</td><td>${fmt(totalWh,0)} Wh</td></tr>
    </table>
    ${reportFooter()}
  `;
  renderPrintReport(html);
}

function downloadSolarPdf(){
  const isUr = STATE.lang === 'ur';
  if(!STATE.solar._computed && document.getElementById('s_dailyEnergy')) recalcSolar();
  const cc = STATE.solar._computed;
  if(!cc) return;
  const html = `
    ${reportHeader('reportSolarSection')}
    <table class="rep-summary">
      <tr><td>${L('solarDailyEnergy')}</td><td>${fmt(cc.dailyEnergy,0)} Wh</td></tr>
      <tr><td>${L('solarSafety')}</td><td>${cc.safety}%</td></tr>
      <tr><td>${isUr ? 'مجموعی متصل لوڈ (پیک)' : 'Total connected / peak load'}</td><td>${fmt(cc.peakLoad,0)} W</td></tr>
      <tr><td>${L('solarSunHours')}</td><td>${cc.sunHours} h</td></tr>
      <tr><td>${L('solarPanelWp')}</td><td>${cc.panelWp} Wp</td></tr>
      <tr><td>${L('solarReqArrayWp')}</td><td>${fmt(cc.reqArrayWp,0)} Wp</td></tr>
      <tr><td>${L('solarPanelsNeeded')}</td><td>${cc.panelsNeeded} × ${cc.panelWp} Wp</td></tr>
      <tr><td>${L('solarAutonomy')}</td><td>${cc.autonomy} d</td></tr>
      <tr><td>${L('solarBattVoltage')}</td><td>${cc.battV} V</td></tr>
      <tr><td>${L('solarDOD')}</td><td>${cc.dod}%</td></tr>
      <tr><td>${L('solarReqAh')}</td><td>${fmt(cc.reqAh,0)} Ah</td></tr>
      <tr><td>${L('solarBattCount')}</td><td>${cc.battCount} × ${cc.battUnit} Ah</td></tr>
      <tr><td>${L('solarReqVA')}</td><td>${fmt(cc.inverterVA,0)} VA</td></tr>
    </table>
    <div class="rep-subhead">${L('reportDcSection')}</div>
    <table class="rep-summary">
      <tr><td>${L('solarDcBattInv')}</td><td>${cc.battWire} mm² (~${fmt(cc.battInvCurrent,1)} A)</td></tr>
      <tr><td>${L('solarDcBattInvBreaker')}</td><td>${cc.battBreaker} A</td></tr>
      <tr><td>${L('solarDcPvCc')}</td><td>${cc.pvWire} mm² (~${fmt(cc.pvCurrent,1)} A)</td></tr>
      <tr><td>${L('solarDcPvCcBreaker')}</td><td>${cc.pvBreaker} A</td></tr>
    </table>
    ${reportFooter()}
  `;
  renderPrintReport(html);
}

// ============ GLOSSARY ============
function renderGlossary(el){
  el.innerHTML = `
    <div class="eyebrow">${L('navGlossary')}</div>
    <h1 class="page-title">${L('glossaryPageTitle')}</h1>
    <p class="page-desc">${L('glossaryPageDesc')}</p>
    <div class="search-box">
      <input type="text" id="glossarySearch" placeholder="${L('searchPlaceholder')}" oninput="filterGlossary()">
    </div>
    <div id="glossaryList"></div>
  `;
  filterGlossary();
}
function filterGlossary(){
  const q = (document.getElementById('glossarySearch')?.value || '').toLowerCase();
  const isUr = STATE.lang === 'ur';
  const list = document.getElementById('glossaryList');
  const filtered = GLOSSARY.filter(g =>
    g.en.toLowerCase().includes(q) || g.ur.includes(q) || g.def_en.toLowerCase().includes(q)
  );
  if(filtered.length === 0){
    list.innerHTML = `<p style="color:var(--text-muted); font-size:13.5px;">${L('noResults')}</p>`;
    return;
  }
  list.innerHTML = filtered.map(g => `
    <div class="glossary-item">
      <div class="term">${g.en} <span class="ur">${g.ur}</span></div>
      <div class="def">${isUr ? g.def_ur : g.def_en}</div>
      ${g.formula ? `<div class="chip">${L('glossaryFormula')}: ${g.formula}</div>` : ''}
      ${(isUr ? g.detail_ur : g.detail_en) ? `<div class="def" style="margin-top:6px; color:var(--text-faint);">${isUr ? g.detail_ur : g.detail_en}</div>` : ''}
    </div>
  `).join('');
}

// ============ QUOTATION MAKER ============
function defaultQuotation(){
  return {
    number: '', date: '', validity: '',
    custName: '', custCompany: '', custPhone: '', custAddress: '',
    items: [ { name:'', spec:'', qty:1, price:0 } ],
    discount: 0, notes: '',
  };
}
function loadQuotationState(){
  try{
    const raw = localStorage.getItem('eh_quotation');
    if(!raw) return defaultQuotation();
    const parsed = JSON.parse(raw);
    if(!parsed || !Array.isArray(parsed.items) || parsed.items.length === 0) return defaultQuotation();
    return Object.assign(defaultQuotation(), parsed);
  }catch(e){
    return defaultQuotation();
  }
}
function saveQuotationState(){
  try{ localStorage.setItem('eh_quotation', JSON.stringify(STATE.quotation)); }catch(e){}
}
function genQuotationNumber(){
  const d = new Date();
  const ymd = d.getFullYear() + String(d.getMonth()+1).padStart(2,'0') + String(d.getDate()).padStart(2,'0');
  return 'Q-' + ymd + '-' + String(Math.floor(100 + Math.random()*900));
}
function todayStr(){
  const d = new Date();
  return String(d.getDate()).padStart(2,'0') + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + d.getFullYear();
}
function escapeAttr(s){
  return String(s==null?'':s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
}
function escapeHtml(s){
  return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderQuotation(el){
  const q = STATE.quotation;
  if(!q.number) q.number = genQuotationNumber();
  if(!q.date) q.date = todayStr();

  el.innerHTML = `
    <div class="eyebrow">${L('navQuotation')}</div>
    <h1 class="page-title">${L('quotationPageTitle')}</h1>
    <p class="page-desc">${L('quotationPageDesc')}</p>

    <div class="card" style="margin-bottom:16px;">
      <h3>${L('quotationMetaCard')} <span class="tag">#</span></h3>
      <div class="field-row">
        <div class="field"><label>${L('quotationNumber')}</label><input type="text" id="q_number" value="${escapeAttr(q.number)}" oninput="updateQuotationMeta()"></div>
        <div class="field"><label>${L('quotationDate')}</label><input type="text" id="q_date" value="${escapeAttr(q.date)}" oninput="updateQuotationMeta()"></div>
        <div class="field"><label>${L('quotationValidity')}</label><input type="text" id="q_validity" placeholder="${L('quotationValidityPh')}" value="${escapeAttr(q.validity)}" oninput="updateQuotationMeta()"></div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px;">
      <h3>${L('quotationCustomerCard')} <span class="tag">☺</span></h3>
      <div class="field-row">
        <div class="field"><label>${L('custName')}</label><input type="text" id="q_custName" value="${escapeAttr(q.custName)}" oninput="updateQuotationMeta()"></div>
        <div class="field"><label>${L('custCompany')}</label><input type="text" id="q_custCompany" value="${escapeAttr(q.custCompany)}" oninput="updateQuotationMeta()"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>${L('custPhone')}</label><input type="text" id="q_custPhone" value="${escapeAttr(q.custPhone)}" oninput="updateQuotationMeta()"></div>
        <div class="field"><label>${L('custAddress')}</label><input type="text" id="q_custAddress" value="${escapeAttr(q.custAddress)}" oninput="updateQuotationMeta()"></div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px;">
      <h3>${L('quotationItemsCard')} <span class="tag">Σ</span></h3>
      <div style="overflow-x:auto;">
      <table>
        <thead><tr>
          <th style="width:36px;">${L('colSr')}</th>
          <th style="min-width:140px;">${L('colItemName')}</th>
          <th style="min-width:160px;">${L('colSpecification')}</th>
          <th style="width:64px;">${L('colQty')}</th>
          <th style="width:100px;">${L('colUnitPrice')}</th>
          <th style="width:100px;">${L('colAmount')}</th>
          <th style="width:36px;"></th>
        </tr></thead>
        <tbody id="q_itemsBody"></tbody>
      </table>
      </div>
      <button class="btn-ghost" style="margin-top:12px;" onclick="addQuotationItem()">${L('quotationAddItem')}</button>

      <div class="result-box" style="margin-top:18px; max-width:320px; margin-left:auto;">
        <div class="result-row"><span class="result-label">${L('quotationSubtotal')}</span><span class="result-value" id="q_subtotal">0</span></div>
        <div class="result-row"><span class="result-label">${L('quotationDiscount')}</span><span class="result-value"><input type="text" id="q_discount" style="width:90px; text-align:right; padding:6px 8px;" value="${escapeAttr(q.discount || 0)}" oninput="recalcQuotationTotals()"></span></div>
        <div class="result-row"><span class="result-label">${L('quotationGrandTotal')}</span><span class="result-value big green" id="q_grandTotal">0</span></div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px;">
      <h3>${L('quotationNotesCard')} <span class="tag">i</span></h3>
      <div class="field">
        <textarea id="q_notes" rows="3" placeholder="${L('quotationNotesPh')}" oninput="updateQuotationMeta()">${escapeHtml(q.notes)}</textarea>
      </div>
    </div>

    <div style="display:flex; gap:10px; flex-wrap:wrap;">
      <button class="btn" onclick="downloadQuotationPdf()">${L('quotationDownloadPdf')}</button>
      <button class="btn-ghost" onclick="clearQuotationForm()">${L('quotationClear')}</button>
    </div>
  `;

  renderQuotationItemsBody();
  recalcQuotationTotals();
  saveQuotationState();
}

function renderQuotationItemsBody(){
  const body = document.getElementById('q_itemsBody');
  if(!body) return;
  const items = STATE.quotation.items;
  body.innerHTML = items.map((it, i) => `
    <tr>
      <td class="mono">${i+1}</td>
      <td><input type="text" value="${escapeAttr(it.name)}" oninput="updateQuotationItem(${i},'name',this.value)"></td>
      <td><input type="text" value="${escapeAttr(it.spec)}" oninput="updateQuotationItem(${i},'spec',this.value)"></td>
      <td><input type="text" class="qty-input" value="${it.qty}" oninput="updateQuotationItem(${i},'qty',this.value)"></td>
      <td><input type="text" class="mono" value="${it.price}" oninput="updateQuotationItem(${i},'price',this.value)"></td>
      <td class="mono" id="q_amt_${i}">${fmt(it.qty * it.price, 0)}</td>
      <td><button class="btn-ghost" style="padding:6px 9px; font-size:12px;" onclick="removeQuotationItem(${i})" title="${L('quotationClear')}">✕</button></td>
    </tr>
  `).join('') || `<tr><td colspan="7" style="text-align:center; color:var(--text-faint);">${L('noResults')}</td></tr>`;
}

function updateQuotationItem(i, field, value){
  const items = STATE.quotation.items;
  if(!items[i]) return;
  if(field === 'qty' || field === 'price'){
    items[i][field] = parseFloat(value) || 0;
    const cell = document.getElementById('q_amt_' + i);
    if(cell) cell.textContent = fmt(items[i].qty * items[i].price, 0);
  } else {
    items[i][field] = value;
  }
  recalcQuotationTotals();
}

function addQuotationItem(){
  STATE.quotation.items.push({ name:'', spec:'', qty:1, price:0 });
  renderQuotationItemsBody();
  recalcQuotationTotals();
}

function removeQuotationItem(i){
  STATE.quotation.items.splice(i, 1);
  if(STATE.quotation.items.length === 0) STATE.quotation.items.push({ name:'', spec:'', qty:1, price:0 });
  renderQuotationItemsBody();
  recalcQuotationTotals();
}

function updateQuotationMeta(){
  const g = id => document.getElementById(id);
  const q = STATE.quotation;
  if(g('q_number')) q.number = g('q_number').value;
  if(g('q_date')) q.date = g('q_date').value;
  if(g('q_validity')) q.validity = g('q_validity').value;
  if(g('q_custName')) q.custName = g('q_custName').value;
  if(g('q_custCompany')) q.custCompany = g('q_custCompany').value;
  if(g('q_custPhone')) q.custPhone = g('q_custPhone').value;
  if(g('q_custAddress')) q.custAddress = g('q_custAddress').value;
  if(g('q_notes')) q.notes = g('q_notes').value;
  saveQuotationState();
}

function recalcQuotationTotals(){
  const items = STATE.quotation.items;
  const subtotal = items.reduce((s, it) => s + (it.qty * it.price), 0);
  const discount = parseFloat(document.getElementById('q_discount')?.value) || 0;
  STATE.quotation.discount = discount;
  const grand = Math.max(subtotal - discount, 0);
  const st = document.getElementById('q_subtotal'); if(st) st.textContent = fmt(subtotal, 0);
  const gt = document.getElementById('q_grandTotal'); if(gt) gt.textContent = fmt(grand, 0);
  saveQuotationState();
}

function clearQuotationForm(){
  if(!confirm(L('quotationClearConfirm'))) return;
  STATE.quotation = defaultQuotation();
  saveQuotationState();
  renderQuotation(document.getElementById('pageWrap'));
}

function downloadQuotationPdf(){
  updateQuotationMeta();
  const q = STATE.quotation;
  const rows = q.items.map((it, i) => `
    <tr>
      <td>${i+1}</td>
      <td>${escapeHtml(it.name) || '-'}</td>
      <td>${escapeHtml(it.spec) || '-'}</td>
      <td>${fmt(it.qty, 0)}</td>
      <td>${fmt(it.price, 0)}</td>
      <td>${fmt(it.qty * it.price, 0)}</td>
    </tr>
  `).join('');
  const subtotal = q.items.reduce((s, it) => s + (it.qty * it.price), 0);
  const discount = q.discount || 0;
  const grand = Math.max(subtotal - discount, 0);

  const html = `
    <div class="rep-header quote-header">
      <div class="quote-brand">
        <img src="icon-512.png" alt="logo">
        <div>
          <div class="rep-brand">${L('brandName')}</div>
          <div class="quote-tag">${L('brandTag')}</div>
        </div>
      </div>
      <div class="quote-titleblock">
        <h1>${L('quotationPrintTitle')}</h1>
        <div class="rep-meta">${L('quotationNumber')}: ${escapeHtml(q.number)}</div>
        <div class="rep-meta">${L('quotationDate')}: ${escapeHtml(q.date)}</div>
        ${q.validity ? `<div class="rep-meta">${L('quotationValidity')}: ${escapeHtml(q.validity)}</div>` : ''}
      </div>
    </div>

    <div class="rep-subhead">${L('quotationCustomerCard')}</div>
    <table class="rep-summary">
      <tr><td>${L('custName')}</td><td>${escapeHtml(q.custName) || '-'}</td></tr>
      <tr><td>${L('custCompany')}</td><td>${escapeHtml(q.custCompany) || '-'}</td></tr>
      <tr><td>${L('custPhone')}</td><td>${escapeHtml(q.custPhone) || '-'}</td></tr>
      <tr><td>${L('custAddress')}</td><td>${escapeHtml(q.custAddress) || '-'}</td></tr>
    </table>

    <table class="rep-table">
      <thead><tr>
        <th>${L('colSr')}</th><th>${L('colItemName')}</th><th>${L('colSpecification')}</th>
        <th>${L('colQty')}</th><th>${L('colUnitPrice')}</th><th>${L('colAmount')}</th>
      </tr></thead>
      <tbody>${rows || `<tr><td colspan="6">${L('noResults')}</td></tr>`}</tbody>
    </table>

    <table class="rep-summary" style="max-width:320px; margin-left:auto;">
      <tr><td>${L('quotationSubtotal')}</td><td>${fmt(subtotal, 0)}</td></tr>
      ${discount ? `<tr><td>${L('quotationDiscount')}</td><td>-${fmt(discount, 0)}</td></tr>` : ''}
      <tr><td><strong>${L('quotationGrandTotal')}</strong></td><td><strong>${fmt(grand, 0)}</strong></td></tr>
    </table>

    ${q.notes ? `<div class="rep-subhead">${L('quotationNotesCard')}</div><p class="quote-notes">${escapeHtml(q.notes).replace(/\n/g,'<br>')}</p>` : ''}

    <div class="quote-sign">
      <div class="sign-box"><div class="sign-line">${L('quotationSignCustomer')}</div></div>
      <div class="sign-box"><div class="sign-line">${L('quotationSignAuthorized')}</div></div>
    </div>

    ${reportFooter()}
  `;
  renderPrintReport(html);
}

// ============ Init ============
document.addEventListener('DOMContentLoaded', () => {
  setLang(STATE.lang);
});

// PWA service worker registration (optional, only works when served over http/https)
if('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
