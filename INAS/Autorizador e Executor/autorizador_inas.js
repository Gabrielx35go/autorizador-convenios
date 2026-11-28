/* ExFlow AI — Autorizador 01 (INAS) com divisão em lotes | Cole este arquivo inteiro no Console do navegador, já logado no Maida. */
(() => {
  async function exflowInasLotes() {
  const ROOT_ID = '__exflow_executor_01__';
  document.getElementById(ROOT_ID)?.remove();

  const state = { cancelled: false, running: false };
  const TABELA = '22 - Procedimentos e eventos em saúde';
  const MAX_TENTATIVAS = 3;
  /* Relógio em Web Worker: o Chrome/Edge atrasam setTimeout em aba de segundo plano, o do Worker não.
     Se o site bloquear o Worker, o setTimeout comum assume (race com folga de 2,5 s). */
  const relogio = (() => {
    try {
      const w = new Worker(URL.createObjectURL(new Blob(['onmessage=e=>setTimeout(()=>postMessage(e.data.id),e.data.ms)'], { type: 'text/javascript' })));
      const pendentes = new Map(); let contador = 0;
      w.onmessage = e => { const resolver = pendentes.get(e.data); if (resolver) { pendentes.delete(e.data); resolver(); } };
      return ms => new Promise(resolve => { const id = ++contador; pendentes.set(id, resolve); w.postMessage({ id, ms }); });
    } catch (_) { return null; }
  })();
  const sleep = ms => {
    if (!relogio) return new Promise(resolve => setTimeout(resolve, ms));
    let reserva; return Promise.race([relogio(ms), new Promise(resolve => { reserva = setTimeout(resolve, ms + 2500); })]).then(() => clearTimeout(reserva));
  };
  /* Mantém a aba "ativa" para o navegador: trava Web Lock (impede congelar/dormir) + áudio inaudível (impede o atraso de timers). */
  function manterAtiva() {
    const feito = [];
    try { if (navigator.locks) { navigator.locks.request('exflow-inas-ativo', () => new Promise(() => {})); feito.push('trava'); } } catch (_) {}
    try {
      const Audio = window.AudioContext || window.webkitAudioContext; const ctx = new Audio(); const osc = ctx.createOscillator(); const ganho = ctx.createGain();
      ganho.gain.value = 0.00002; osc.frequency.value = 20; osc.connect(ganho); ganho.connect(ctx.destination); osc.start(); window.__exflowAudio = ctx;
      const retomar = () => { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); };
      retomar(); ['pointerdown', 'keydown'].forEach(tipo => window.addEventListener(tipo, retomar, true));
      feito.push(ctx.state === 'running' ? 'áudio' : 'áudio (clique na aba para ativar)');
    } catch (_) {}
    return feito;
  }
  const cancelled = () => state.cancelled;

  /* ===== guias extras (abas novas) ===== */
  const CHAVE = id => `__exflow_inas_job_${id}`;
  const lerJob = id => { try { return JSON.parse(localStorage.getItem(CHAVE(id)) || 'null'); } catch (_) { return null; } };
  const gravarJob = (id, dados) => { try { localStorage.setItem(CHAVE(id), JSON.stringify({ ...(lerJob(id) || {}), ...dados, atualizado: Date.now() })); } catch (_) {} };
  const apagarJob = id => { try { localStorage.removeItem(CHAVE(id)); } catch (_) {} };
  const jobId = /^exflow-inas-/.test(window.name || '') ? window.name.slice('exflow-inas-'.length) : null;
  const job = jobId ? lerJob(jobId) : null;
  const filho = !!job; // esta aba foi aberta pelo painel da guia 1
  const fonteDoScript = `(${exflowInasLotes.toString()})()`;
  const LOTES = [{ id: 'tudo', rotulo: 'Tudo', n: Infinity }, { id: '30', rotulo: '30', n: 30 }, { id: '20', rotulo: '20', n: 20 }, { id: '10', rotulo: '10', n: 10 }];
  let lote = 'tudo';
  try { const salvo = localStorage.getItem('__exflow_inas_lote'); if (LOTES.some(item => item.id === salvo)) lote = salvo; } catch (_) {}
  const tamanhoLote = () => filho ? Infinity : LOTES.find(item => item.id === lote).n;

  const host = document.createElement('div');
  host.id = ROOT_ID;
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <style>
      :host{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:rgba(33,24,67,.28);font:14px/1.4 Inter,ui-sans-serif,system-ui,sans-serif;color:#241b44}:host *{box-sizing:border-box}:host .card{width:min(760px,94vw);max-height:92vh;overflow:auto;border:1px solid #e9e5ff;border-radius:24px;background:#fff;box-shadow:0 28px 90px rgba(61,42,139,.25);padding:24px}.top{display:flex;gap:18px;align-items:center;border-bottom:1px solid #f0edff;padding-bottom:18px}h1{font-size:20px;margin:0}.sub{color:#756f91;margin:3px 0 0}.chibi{margin-left:auto;position:relative;width:68px;height:68px;border-radius:22px;background:linear-gradient(145deg,#eaf7ff,#efe9ff);border:1px solid #dcd3ff;overflow:hidden;flex:none}.chibi:before{content:'◕‿◕';position:absolute;left:11px;top:19px;font-size:23px;color:#5739c6}.chibi:after{content:'⌨';position:absolute;left:23px;top:42px;color:#62b8e6;font-size:22px}.working:after{animation:exflow-type .45s infinite alternate}.success:before{content:'^‿^';color:#21a06a}@keyframes exflow-type{to{transform:translateY(-4px) rotate(-8deg)}}label{display:block;font-weight:700;margin:18px 0 7px}textarea{width:100%;min-height:132px;padding:12px;border:1px solid #dcd5fa;border-radius:13px;resize:vertical;font:13px ui-monospace,monospace;outline:none}textarea:focus{border-color:#825cff;box-shadow:0 0 0 3px #eeeaff}.row{display:flex;align-items:center;gap:10px;margin-top:15px;flex-wrap:wrap}button{border:0;border-radius:10px;padding:10px 15px;font-weight:750;cursor:pointer}.start{background:linear-gradient(120deg,#6e45df,#8c65ff);color:#fff}.cancel{background:#edf9ff;color:#18709b}.close{background:#f0edff;color:#5335c2}button:disabled{opacity:.55;cursor:not-allowed}.status{margin-left:auto;color:#5a5280;font-weight:650}.bar{height:8px;border-radius:999px;background:#edf3ff;margin-top:16px;overflow:hidden}.fill{height:100%;width:0;background:linear-gradient(90deg,#8b63ff,#77cbef);transition:width .25s}.error{display:none;margin-top:14px;padding:10px 12px;border-radius:10px;background:#fff0f3;color:#a12b4a;white-space:pre-wrap}.logs{margin-top:16px;background:#fbfaff;border:1px solid #f0edff;border-radius:12px;padding:10px;height:126px;overflow:auto;font:12px/1.45 ui-monospace,monospace;color:#50496c}.hint{color:#756f91;font-size:12px}
    </style>
    <section class="card" role="dialog" aria-modal="true" aria-label="ExFlow AI Executor 01">
      <header class="top"><div><h1>ExFlow AI · Autorizador 01</h1><p class="sub">Tabela 22 · procedimentos e eventos em saúde</p></div><div class="chibi" data-chibi aria-label="Assistente trabalhando"></div></header>
      <div class="lotes" data-lotes><span class="lotes-rotulo">Códigos por guia</span></div>
      <label for="${ROOT_ID}-input">Códigos</label><div class="hint">Cole códigos separados por linha, espaço, vírgula ou ponto e vírgula. Repetições viram quantidade.</div>
      <textarea id="${ROOT_ID}-input" placeholder="4030XXXX&#10;4030YYYY&#10;4030XXXX"></textarea>
      <div class="resumo" data-resumo></div>
      <div class="row"><button class="start" data-start>Iniciar</button><button class="cancel" data-cancel>Cancelar</button><button class="close" data-close>Fechar</button><span class="status" data-status></span></div>
      <div class="abas" data-abas></div><div class="bar"><div class="fill" data-progress></div></div><div class="error" data-error></div><div class="logs" data-logs>Pronto. Nenhuma ação foi executada.</div>
    </section>`;
  const panel = root.querySelector('.card');
  const header = panel.querySelector('.top');
  header.innerHTML = `<div class="exflow-brand"><span class="exflow-mark">✦</span><span>EXFLOW AI</span></div><div class="panel-kind">Autorizador 01 · Tabela 22</div><div class="chibi" data-chibi></div>`;
  const workspace = document.createElement('main');
  workspace.className = 'workspace';
  [...panel.childNodes].filter(node => node !== header).forEach(node => workspace.appendChild(node));
  const intro = document.createElement('div');
  intro.className = 'workspace-intro';
  intro.innerHTML = '<p>AUTORIZADOR DE EXAMES</p><div class="exflow-instructions">Cole os códigos TUSS no painel abaixo, somente os códigos numéricos.</div>';
  workspace.prepend(intro);
  panel.appendChild(workspace);
  const exflowTheme = document.createElement('style');
  exflowTheme.textContent = `
    :host{background:#eef2fb!important;color:#202a42!important}.card{width:min(1180px,96vw)!important;height:min(720px,92vh)!important;max-height:92vh!important;padding:0!important;border-radius:16px!important;display:grid!important;grid-template-columns:208px minmax(0,1fr)!important;overflow:hidden!important;border:1px solid #dfe5f6!important;box-shadow:0 24px 70px rgba(48,68,128,.18)!important;background:#fafcff!important}.top{grid-column:1!important;grid-row:1!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:0!important;margin:0!important;padding:27px 18px!important;border:0!important;border-right:1px solid #e1e7f5!important;background:linear-gradient(180deg,#f8faff 0%,#f4f2ff 100%)!important}.exflow-brand{display:flex;align-items:center;gap:10px;color:#1d2940;font-size:17px;letter-spacing:2.8px;font-weight:500;margin:0 7px 52px}.exflow-mark{display:grid;place-items:center;width:29px;height:29px;border-radius:9px;background:linear-gradient(135deg,#356afb,#6b44ed);color:white;font-size:17px;letter-spacing:0}.rail-title{padding:0 10px 10px;color:#77839a;text-transform:uppercase;font-size:10px;letter-spacing:1.4px;font-weight:800}.rail-item{padding:12px 11px;border-radius:9px;color:#66748d;font-weight:650;margin:2px 0}.rail-item.active{background:#e8edff;color:#315fec;box-shadow:inset 0 0 0 1px #cbd8ff}.rail-footer{margin-top:auto;border-top:1px solid #dde4f1;padding:17px 9px 0;color:#68748a;font-size:11px;line-height:1.8}.rail-footer small{color:#8b95a8}.chibi{display:none!important}.workspace{grid-column:2!important;min-width:0!important;overflow:auto!important;padding:28px 42px 32px!important;background:radial-gradient(circle at 100% 0,#eef1ff 0,transparent 31%),#fafcff!important}.workspace-intro{font-size:15px;color:#68758b;max-width:760px}.workspace-intro .local-note{display:flex;gap:11px;align-items:center;margin-bottom:28px;padding:10px 13px;border:1px solid #d9ddff;border-radius:9px;background:#f3f4ff;color:#788097;font-size:12px}.workspace-intro .local-note b{color:#6453ef;font-weight:700}.workspace-intro p{margin:0 0 12px;color:#3866ed;font-size:12px;letter-spacing:1.65px;font-weight:800}.workspace-intro h2{margin:0 0 9px;color:#1b2540;font-size:38px;line-height:1.04;font-weight:450;letter-spacing:1px}.workspace label{margin-top:31px!important;color:#1f2941!important;font-size:15px}.workspace .hint{margin-top:-3px;color:#728098!important}.workspace textarea{min-height:112px!important;margin-top:10px!important;border-color:#dce3f2!important;border-radius:10px!important;background:white!important;color:#26324c!important;box-shadow:none!important}.workspace textarea:focus{border-color:#416cf3!important;box-shadow:0 0 0 3px #e7edff!important}.workspace .row{margin-top:18px!important;padding:14px!important;border:1px solid #e1e7f3!important;border-radius:11px!important;background:white!important}.workspace button{border-radius:8px!important;padding:10px 17px!important;font-size:13px!important}.workspace .start{background:#3e5be9!important;box-shadow:0 6px 14px rgba(62,91,233,.2)!important}.workspace .cancel{background:#eef2ff!important;color:#4264db!important}.workspace .close{background:#dc3545!important;color:#fff!important;box-shadow:0 6px 14px rgba(220,53,69,.2)!important}.workspace .status{font-size:12px!important;color:#62708a!important}.workspace .bar{height:5px!important;margin:14px 0 0!important;background:#e9eef8!important}.workspace .fill{background:#3f63ed!important}.workspace .error{border:1px solid #ffd3dc!important;background:#fff8f9!important}.workspace .logs{height:105px!important;margin-top:16px!important;border:1px solid #e1e7f3!important;border-radius:10px!important;background:#fff!important;color:#66748c!important}
    @media(max-width:720px){.card{grid-template-columns:1fr!important;height:94vh!important}.top{display:none!important}.workspace{grid-column:1!important;padding:24px!important}.workspace-intro h2{font-size:30px!important}}
  `;
  root.appendChild(exflowTheme);
  const floatingTheme = document.createElement('style');
  floatingTheme.textContent = `
    :host{display:grid!important;place-items:center!important;background:rgba(232,237,250,.26)!important;pointer-events:auto!important}.card{display:block!important;width:min(680px,94vw)!important;height:auto!important;max-height:88vh!important;border-radius:15px!important;pointer-events:auto!important}.top{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between!important;padding:17px 21px!important;border:0!important;border-bottom:1px solid #e5eaf4!important;background:#fff!important}.exflow-brand{margin:0!important;font-size:15px!important}.workspace{display:block!important;padding:23px 26px 26px!important;background:#fafcff!important}.workspace-intro{margin-bottom:16px!important}.workspace-intro p{margin:0 0 7px!important;color:#3866ed!important;font-size:12px!important;letter-spacing:1.65px!important;font-weight:800!important}.exflow-instructions{color:#68758b;font-size:14px}.workspace .row{display:flex!important;gap:8px!important}.workspace .start{color:#fff!important}.panel-kind,.workspace>label,.workspace>.hint,.rail-title,.rail-item,.rail-footer{display:none!important}
  `;
  root.appendChild(floatingTheme);
  const estiloLotes = document.createElement('style');
  estiloLotes.textContent = `.lotes{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 14px}.lotes-rotulo{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b7791}.lotes button{border:1px solid #d6def0!important;background:#fff;color:#33415f;padding:8px 16px!important;font:600 13px Inter,system-ui,sans-serif;cursor:pointer}.lotes button[aria-pressed=true]{background:#3e5be9;border-color:#3e5be9!important;color:#fff;box-shadow:0 4px 12px rgba(62,91,233,.25)}.lotes button:disabled{opacity:.55;cursor:not-allowed}.resumo{margin-top:10px;font-size:12px;color:#62708a;min-height:16px}.abas{display:grid;gap:6px;margin-top:12px}.abas:empty{display:none}.aba{display:flex;align-items:center;gap:10px;padding:8px 12px;border:1px solid #e1e7f3;border-radius:10px;background:#fff;font-size:12px;color:#44506b}.aba b{color:#1f2941}.aba .aba-estado{flex:1}.aba.erro{border-color:#ffd3dc;background:#fff8f9;color:#a12b4a}.aba.ok{border-color:#c9ecd9;background:#f4fcf8;color:#1b7a52}`;
  root.appendChild(estiloLotes);
  document.body.appendChild(host);
  const ui = {
    input: root.querySelector('textarea'), start: root.querySelector('[data-start]'), cancel: root.querySelector('[data-cancel]'), close: root.querySelector('[data-close]'),
    status: root.querySelector('[data-status]'), progress: root.querySelector('[data-progress]'), logs: root.querySelector('[data-logs]'), error: root.querySelector('[data-error]'), chibi: root.querySelector('[data-chibi]'), resumo: root.querySelector('[data-resumo]'), abas: root.querySelector('[data-abas]'), lotes: root.querySelector('[data-lotes]')
  };
  const log = message => { console.log('[ExFlow 01]', message); const line = document.createElement('div'); line.textContent = `${new Date().toLocaleTimeString()}  ${message}`; ui.logs.appendChild(line); ui.logs.scrollTop = ui.logs.scrollHeight; };
  const setStatus = (message, percent) => { ui.status.textContent = message; if (Number.isFinite(percent)) ui.progress.style.width = `${Math.max(0, Math.min(100, percent))}%`; };
  const fail = message => { ui.error.textContent = message; ui.error.style.display = 'block'; log(`ERRO: ${message}`); if (filho) gravarJob(jobId, { status: 'erro', detalhe: String(message).slice(0, 400) }); };
  const checkCancelled = () => { if (cancelled()) throw new Error('Execução cancelada pelo usuário. Nenhuma nova ação será iniciada.'); };
  async function esperar(condition, timeout = 10000, interval = 100) { const start = Date.now(); while (Date.now() - start < timeout) { checkCancelled(); try { const result = condition(); if (result) return result; } catch (_) {} await sleep(interval); } return null; }
  function texto(element) { return (element?.textContent || '').replace(/\s+/g, ' ').trim(); }
  function clicar(element) { if (!element) return false; element.scrollIntoView({ block: 'center', inline: 'nearest' }); element.focus?.(); ['mousedown', 'mouseup', 'click'].forEach(type => element.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }))); return true; }
  const encontrarContainer = labelText => [...document.querySelectorAll('label')].find(label => texto(label).replace('*', '').trim() === labelText)?.parentElement || null;
  const encontrarInputSelect = labelText => encontrarContainer(labelText)?.querySelector('input[role="combobox"]') || null;
  async function abrirSelect(input) { if (!input) return false; input.focus(); clicar(input); await sleep(100); const container = input.closest('.css-b62m3t-container') || input.closest('.css-1lejura')?.parentElement; const indicator = container?.querySelector('.css-1xc3v61-indicatorContainer'); if (indicator) clicar(indicator); input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40, bubbles: true })); return !!await esperar(() => document.querySelector('[role="listbox"]'), 3000); }
  async function selecionarTabela22() { if ([...document.querySelectorAll('.css-1o0507n-singleValue')].some(element => texto(element) === TABELA)) return true; const input = encontrarInputSelect('Tabela'); if (!input) return false; for (let attempt = 1; attempt <= 3; attempt++) { checkCancelled(); log(`Selecionando Tabela 22 (${attempt}/3)…`); await abrirSelect(input); const option = await esperar(() => [...document.querySelectorAll('[role="option"]')].find(element => texto(element) === TABELA), 5000); if (!option) { clicar(input); await sleep(300); continue; } option.click(); if (await esperar(() => [...document.querySelectorAll('.css-1o0507n-singleValue')].some(element => texto(element) === TABELA), 3000)) return true; } return false; }
  const encontrarCampoCodigo = () => [...document.querySelectorAll('label')].find(label => texto(label).toLowerCase().includes('código e descrição'))?.parentElement?.querySelector('input[role="combobox"]') || null;
  function alterarValorReact(input, value) { const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set; if (!setter) throw new Error('Não foi possível alterar o campo da página.'); setter.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); }
  async function preencherCodigo(code) { const field = encontrarCampoCodigo(); if (!field) return false; field.focus(); alterarValorReact(field, ''); await sleep(100); checkCancelled(); alterarValorReact(field, code); field.dispatchEvent(new InputEvent('input', { bubbles: true, data: code, inputType: 'insertText' })); await sleep(500); return true; }
  async function selecionarResultadoCodigo(code) { const option = await esperar(() => [...document.querySelectorAll('[role="option"]')].find(element => { const value = texto(element); return value === code || value.startsWith(`${code} `) || value.startsWith(`${code}-`) || value.startsWith(`${code} -`); }), 8000); if (!option) return false; option.click(); return true; }
  const encontrarCampoQuantidade = () => [...document.querySelectorAll('label')].find(label => texto(label).replace('*', '').trim().toLowerCase() === 'quantidade')?.parentElement?.querySelector('input[type="number"]') || null;
  async function definirQuantidade(value) { const field = await esperar(encontrarCampoQuantidade, 5000); if (!field) return false; alterarValorReact(field, String(value)); field.dispatchEvent(new Event('blur', { bubbles: true })); await sleep(150); return true; }
  async function clicarAdicionar() { const button = await esperar(() => { const element = document.querySelector('button.button-add'); return element && !element.disabled ? element : null; }, 5000); if (!button) return false; clicar(button); await sleep(500); return true; }
  function lerItensTabela() { const result = {}; document.querySelectorAll('tbody tr').forEach(row => { const code = texto(row.querySelector('td.first-column')); const quantity = Number(texto(row.querySelector('td:nth-child(3)')).replace(',', '.')); if (code) result[code] = (result[code] || 0) + (Number.isFinite(quantity) ? quantity : 1); }); return result; }
  async function inserirCodigo(code, quantity) { checkCancelled(); log(`Inserindo ${code} · quantidade ${quantity}`); if (!await selecionarTabela22()) return false; if (!await preencherCodigo(code)) return false; if (!await selecionarResultadoCodigo(code)) return false; if (!await definirQuantidade(quantity)) return false; if (!await clicarAdicionar()) return false; await sleep(700); return true; }
  function parseCodes(value) { const list = String(value).match(/(?<!\d)\d{8}(?!\d)/g) || []; /* só códigos TUSS de 8 dígitos; o resto do texto colado é ignorado */ const quantities = {}; const codes = []; list.forEach(code => { if (!(code in quantities)) { codes.push(code); quantities[code] = 0; } quantities[code]++; }); return { codes, quantities }; }
  /* ===== lotes ===== */
  function dividir(codes, quantities) {
    const n = tamanhoLote(); const passo = Number.isFinite(n) ? n : Math.max(1, codes.length); const grupos = [];
    for (let i = 0; i < codes.length; i += passo) { const parte = codes.slice(i, i + passo); grupos.push({ codes: parte, quantities: Object.fromEntries(parte.map(code => [code, quantities[code]])) }); }
    return grupos;
  }
  function atualizarResumo() {
    const { codes, quantities } = parseCodes(ui.input.value);
    if (!codes.length) { ui.resumo.textContent = ''; return; }
    const grupos = dividir(codes, quantities);
    ui.resumo.textContent = grupos.length > 1 ? `${codes.length} códigos únicos → ${grupos.length} guias (${grupos.map(g => g.codes.length).join(' + ')}). A guia 1 fica nesta aba; as outras abrem sozinhas.` : `${codes.length} código(s) único(s) → 1 guia.`;
  }

  /* ===== ler / copiar o formulário da guia ===== */
  const IGNORAR = /^(tabela|código e descrição|quantidade|número da guia|procure pelo|tipo de documento|anexos|dados da solicitação)/i;
  const normalizar = value => String(value || '').replace(/\s+/g, ' ').trim();
  const soDigitos = value => String(value || '').replace(/\D/g, '').replace(/^0+/, '');
  function lerCarteirinha() { const rotulo = [...document.querySelectorAll('p')].find(p => texto(p) === 'Cartão do beneficiário'); return normalizar(rotulo?.nextElementSibling?.textContent); }
  function camposDoFormulario() {
    const contagem = {}; const lista = [];
    document.querySelectorAll('main label').forEach(label => {
      if (label.closest('#modal') || host.contains(label)) return;
      const nome = texto(label).replace(/\*/g, '').trim(); if (!nome || IGNORAR.test(nome)) return;
      const check = label.querySelector('input[type="checkbox"]');
      const container = check ? label : label.parentElement; if (!container) return;
      const combos = container.querySelectorAll('input[role="combobox"]'); const textos = container.querySelectorAll('input[type="text"]:not([tabindex="-1"]):not([role="combobox"]), input[type="number"], textarea');
      let campo = null;
      if (check) campo = { tipo: 'check', el: check };
      else if (combos.length === 1) campo = { tipo: 'select', el: combos[0], container, desabilitado: combos[0].disabled };
      else if (!combos.length && textos.length === 1) campo = { tipo: 'texto', el: textos[0], desabilitado: textos[0].disabled };
      if (!campo) return; // título de seção ou controle ambíguo
      contagem[nome] = (contagem[nome] || 0) + 1;
      lista.push({ ...campo, nome, chave: `${nome}#${contagem[nome]}` });
    });
    return lista;
  }
  const valorOcultoDoSelect = campo => normalizar(campo.container.querySelector('input[tabindex="-1"]')?.value);
  function lerFormulario() {
    const dados = {};
    camposDoFormulario().forEach(campo => {
      if (campo.desabilitado) return;
      if (campo.tipo === 'check') { dados[campo.chave] = { tipo: 'check', nome: campo.nome, valor: campo.el.checked }; return; }
      const valor = campo.tipo === 'select' ? valorOcultoDoSelect(campo) : normalizar(campo.el.value);
      if (!valor || (campo.el.type === 'number' && valor === '0')) return;
      dados[campo.chave] = { tipo: campo.tipo, nome: campo.nome, valor };
    });
    return dados;
  }
  async function selecionarOpcao(chave, alvo) {
    const pegar = () => camposDoFormulario().find(campo => campo.chave === chave);
    if (!pegar()) return false;
    if (valorOcultoDoSelect(pegar()) === alvo) return true;
    const partes = alvo.split(' - ');
    const buscas = [partes[0], alvo, partes.slice(1).join(' - ')].filter((valor, i, todos) => valor && todos.indexOf(valor) === i);
    for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
      checkCancelled(); const campo = pegar(); if (!campo) return false;
      const busca = buscas[(tentativa - 1) % buscas.length];
      await abrirSelect(campo.el); alterarValorReact(campo.el, busca); campo.el.dispatchEvent(new InputEvent('input', { bubbles: true, data: busca, inputType: 'insertText' }));
      const opcao = await esperar(() => { const opcoes = [...document.querySelectorAll('[role="option"]')]; return opcoes.find(o => normalizar(texto(o)) === alvo) || opcoes.find(o => normalizar(texto(o)).startsWith(alvo)); }, 8000);
      if (opcao) { opcao.click(); if (await esperar(() => { const atual = pegar(); return atual && valorOcultoDoSelect(atual) === alvo; }, 3000)) return true; }
      alterarValorReact(campo.el, ''); campo.el.blur?.(); document.body.click(); await sleep(300);
    }
    return false;
  }
  async function aplicarFormulario(dados) {
    const falhas = []; const chaves = Object.keys(dados);
    for (let i = 0; i < chaves.length; i++) {
      checkCancelled(); const chave = chaves[i]; const dado = dados[chave];
      setStatus(`Copiando a guia 1: ${dado.nome}`, 5 + Math.round((i / chaves.length) * 10));
      const campo = camposDoFormulario().find(item => item.chave === chave);
      if (!campo) { falhas.push(`${dado.nome}: campo não encontrado na nova aba`); continue; }
      if (dado.tipo === 'check') { if (campo.el.checked !== dado.valor) { campo.el.click(); await sleep(200); } continue; }
      if (dado.tipo === 'texto') {
        if (normalizar(campo.el.value) !== dado.valor) { campo.el.focus(); alterarValorReact(campo.el, dado.valor); campo.el.dispatchEvent(new Event('blur', { bubbles: true })); await sleep(250); }
        if (normalizar(camposDoFormulario().find(item => item.chave === chave)?.el.value) !== dado.valor) falhas.push(`${dado.nome}: não consegui preencher "${dado.valor}"`);
        continue;
      }
      if (!await selecionarOpcao(chave, dado.valor)) falhas.push(`${dado.nome}: não consegui selecionar "${dado.valor}"`);
      log(`${dado.nome}: ${dado.valor}`);
    }
    return falhas;
  }

  /* ===== aba nova: achar o paciente pela carteirinha ===== */
  async function buscarPaciente(carteirinha) {
    const campoBusca = await esperar(() => [...document.querySelectorAll('input')].find(input => /cpf ou n[úu]mero do cart[ãa]o/i.test(input.placeholder || '')), 25000);
    if (!campoBusca) throw new Error('Não encontrei o campo de busca da carteirinha na nova aba. Confira se você está logado no Maida.');
    const carregado = () => soDigitos(lerCarteirinha()) === soDigitos(carteirinha);
    const digitar = async valor => { campoBusca.focus(); clicar(campoBusca); alterarValorReact(campoBusca, ''); for (const digito of String(valor)) { alterarValorReact(campoBusca, campoBusca.value + digito); campoBusca.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: digito })); campoBusca.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: digito })); await sleep(30); } };
    log('Digitando a carteirinha na busca…'); await digitar(carteirinha);
    if (await esperar(carregado, 2500)) return true;
    // lista de resultados: clica no item que traz a carteirinha
    const alvoDigitos = soDigitos(carteirinha);
    const item = await esperar(() => [...document.querySelectorAll('main *')].filter(el => el !== campoBusca && !host.contains(el) && !el.children.length && soDigitos(el.textContent).includes(alvoDigitos) && el.offsetParent !== null).pop(), 6000);
    log(item ? `Resultado encontrado na lista: ${normalizar(item.textContent)}` : 'Nenhum resultado clicável apareceu na lista; tentando Enter…');
    if (item) { clicar(item.closest('li, a, button, tr, [role="option"], [role="button"]') || item); if (await esperar(carregado, 10000)) return true; }
    campoBusca.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', code: 'Enter', keyCode: 13, which: 13 }));
    if (await esperar(carregado, 10000)) return true;
    throw new Error(`Não consegui abrir o paciente da carteirinha ${carteirinha} na nova aba (a lista de resultados não respondeu).`);
  }
  async function prepararAbaNova() {
    gravarJob(jobId, { status: 'preparando', detalhe: 'buscando o paciente' }); setStatus('Buscando o paciente…', 3);
    await buscarPaciente(job.carteirinha); log(`Paciente ${job.carteirinha} carregado.`);
    await esperar(() => camposDoFormulario().length >= 3, 20000);
    gravarJob(jobId, { status: 'preparando', detalhe: 'copiando o formulário da guia 1' });
    const falhas = await aplicarFormulario(job.formulario);
    if (falhas.length) throw new Error(`Não consegui copiar estes campos da guia 1:\n${falhas.join('\n')}`);
    log('Formulário copiado da guia 1.');
  }

  /* ===== abrir as outras abas ===== */
  const abrirAba = id => { try { return window.open(`${location.origin}/solicitacoes/sp-sadt`, `exflow-inas-${id}`); } catch (_) { return null; } };
  async function injetar(extra) {
    const inicio = Date.now();
    while (Date.now() - inicio < 60000) {
      checkCancelled();
      try {
        if (extra.w.closed) throw new Error('A aba nova foi fechada antes de começar.');
        const doc = extra.w.document;
        if (doc.readyState === 'complete' && extra.w.location.pathname.startsWith('/solicitacoes') && [...doc.querySelectorAll('input')].some(input => /cpf ou n[úu]mero do cart[ãa]o/i.test(input.placeholder || ''))) { extra.w.eval(fonteDoScript); gravarJob(extra.id, { status: 'preparando', detalhe: 'aba iniciada' }); return; }
      } catch (erro) { if (/fechada/.test(erro.message)) throw erro; }
      await sleep(300);
    }
    throw new Error('A aba nova não carregou a tela de solicitação em 60s (sessão expirada?). Cole o script no console dela para continuar.');
  }
  const ESTADOS = { aguardando: 'abrindo…', preparando: 'preparando', preenchendo: 'adicionando os códigos', concluida: 'concluída e conferida ✓', erro: 'erro' };
  function desenharAbas(extras) {
    ui.abas.innerHTML = '';
    extras.forEach(extra => {
      const linha = document.createElement('div'); linha.className = 'aba'; linha.innerHTML = `<b>Guia ${extra.ordem}</b><span class="aba-estado"></span>`;
      const botao = document.createElement('button'); botao.className = 'cancel'; botao.textContent = `Abrir guia ${extra.ordem}`; botao.hidden = true;
      botao.onclick = () => { const w = abrirAba(extra.id); if (!w) { extra.bloqueada = true; return; } extra.w = w; extra.bloqueada = false; botao.hidden = true; injetar(extra).catch(erro => gravarJob(extra.id, { status: 'erro', detalhe: erro.message })); };
      linha.appendChild(botao); extra.linha = linha; extra.botao = botao; ui.abas.appendChild(linha);
    });
  }
  function atualizarAbas(extras) {
    extras.forEach(extra => {
      const dados = lerJob(extra.id) || {}; const estado = dados.status || 'aguardando';
      const rotulo = extra.bloqueada && estado === 'aguardando' ? 'o navegador bloqueou o pop-up: clique em “Abrir guia” (ou permita pop-ups para gdf.maida.health)' : `${ESTADOS[estado] || estado}${dados.detalhe && estado !== 'concluida' ? ` · ${dados.detalhe}` : ''}`;
      extra.linha.querySelector('.aba-estado').textContent = `${extra.total} códigos únicos · ${rotulo}`;
      extra.linha.classList.toggle('erro', estado === 'erro'); extra.linha.classList.toggle('ok', estado === 'concluida');
      extra.botao.hidden = !(extra.bloqueada && estado === 'aguardando');
    });
  }
  async function aguardarAbas(extras) {
    const limite = Date.now() + 20 * 60 * 1000;
    while (Date.now() < limite) {
      checkCancelled(); atualizarAbas(extras);
      const estados = extras.map(extra => lerJob(extra.id) || {});
      const erro = estados.findIndex(dado => dado.status === 'erro');
      if (erro >= 0) throw new Error(`Guia ${extras[erro].ordem}: ${estados[erro].detalhe || 'erro desconhecido'}`);
      if (estados.every(dado => dado.status === 'concluida')) return;
      await sleep(1000);
    }
    throw new Error('Tempo esgotado esperando as outras guias (20 min).');
  }

  async function run() {
    const ativa = manterAtiva();
    const lista = parseCodes(ui.input.value); if (!lista.codes.length) throw new Error('Informe pelo menos um código válido antes de iniciar.');
    const grupos = dividir(lista.codes, lista.quantities);
    const { codes, quantities } = grupos[0]; // códigos desta aba
    // Abas extras: abertas AQUI, antes de qualquer espera, para valer como clique do usuário (anti pop-up).
    let extras = [];
    if (!filho && grupos.length > 1) {
      const carteirinha = lerCarteirinha(); if (!carteirinha) throw new Error('Carregue o paciente (carteirinha) e preencha o formulário antes de dividir em lotes.');
      const formulario = lerFormulario(); const base = Date.now().toString(36);
      extras = grupos.slice(1).map((grupo, i) => {
        const id = `${base}${i}`; const extra = { id, ordem: i + 2, total: grupo.codes.length, bloqueada: false, w: null };
        gravarJob(id, { id, ordem: i + 2, de: grupos.length, carteirinha, formulario, lista: grupo.codes.flatMap(code => Array(grupo.quantities[code]).fill(code)), status: 'aguardando', detalhe: '' });
        extra.w = abrirAba(id); extra.bloqueada = !extra.w; return extra;
      });
      desenharAbas(extras); atualizarAbas(extras);
      log(`${grupos.length} guias: esta aba fica com ${codes.length} código(s); ${extras.length} aba(s) nova(s).`);
      extras.filter(extra => extra.w).forEach(extra => injetar(extra).catch(erro => gravarJob(extra.id, { status: 'erro', detalhe: erro.message })));
    }
    const timerAbas = extras.length ? setInterval(() => atualizarAbas(extras), 1000) : null;
    const pending = () => { const saved = lerItensTabela(); return Object.fromEntries(codes.map(code => [code, Math.max(0, quantities[code] - (saved[code] || 0))]).filter(([, missing]) => missing > 0)); };
    ui.error.style.display = 'none'; state.running = true; state.cancelled = false; ui.start.disabled = true; ui.lotes.querySelectorAll('button').forEach(b => { b.disabled = true; }); ui.chibi.classList.add('working'); log(`${codes.length} código(s) único(s) nesta guia.`); log(`Aba mantida ativa: ${ativa.join(' + ') || 'não foi possível (use a configuração do navegador)'}.`);
    try {
      if (filho) await prepararAbaNova();
      setStatus('Validando a Tabela 22…', 16); if (!await selecionarTabela22()) throw new Error('Não encontrei ou não consegui selecionar o campo “Tabela” com a opção Tabela 22.');
      if (filho) gravarJob(jobId, { status: 'preenchendo', detalhe: '' });
      let pendingCodes = pending(); log(`Pendentes iniciais: ${Object.keys(pendingCodes).length}.`);
      for (let attempt = 1; attempt <= MAX_TENTATIVAS && Object.keys(pendingCodes).length; attempt++) {
        log(`Tentativa ${attempt}/${MAX_TENTATIVAS}.`); let index = 0;
        for (const code of codes) { checkCancelled(); const quantity = pendingCodes[code]; if (!quantity) continue; index++; setStatus(`Tentativa ${attempt}: ${code}`, 18 + ((attempt - 1) * 25) + Math.round((index / Math.max(1, Object.keys(pendingCodes).length)) * 25)); if (!await inserirCodigo(code, quantity)) log(`Não foi possível confirmar a inserção de ${code} nesta tentativa.`); }
        await sleep(700); pendingCodes = pending(); log(`Conferência ${attempt}: ${Object.keys(pendingCodes).length} código(s) ainda pendente(s).`);
      }
      const missing = pending(); const saved = lerItensTabela(); console.table(codes.map(code => ({ Codigo: code, Solicitado: quantities[code], Cadastrado: saved[code] || 0, Falta: missing[code] || 0 })));
      if (Object.keys(missing).length) { setStatus('Conferência final encontrou pendências', 100); throw new Error(`Conferência final: ainda faltam\n${Object.entries(missing).map(([code, quantity]) => `${code} → ${quantity}`).join('\n')}`); }
      if (filho) gravarJob(jobId, { status: 'concluida', detalhe: '' });
      if (extras.length) { setStatus('Esta guia está conferida · aguardando as outras abas…', 100); log('Guia 1 conferida. Aguardando as outras abas…'); await aguardarAbas(extras); extras.forEach(extra => apagarJob(extra.id)); }
      setStatus(extras.length ? 'Todas as guias conferidas' : 'Concluído e conferido', 100); ui.chibi.classList.remove('working'); ui.chibi.classList.add('success'); log(extras.length ? `Concluído: ${extras.length + 1} guias conferidas. Revise e envie cada uma.` : 'Concluído somente após a conferência final das quantidades.');
    } finally { if (timerAbas) clearInterval(timerAbas); state.running = false; ui.start.disabled = false; ui.lotes.querySelectorAll('button').forEach(b => { b.disabled = false; }); if (!state.cancelled) ui.chibi.classList.remove('working'); }
  }
  ui.start.onclick = () => run().catch(error => { setStatus(state.cancelled ? 'Cancelado' : 'Interrompido', 0); ui.chibi.classList.remove('working'); fail(error.message || error); });
  ui.cancel.onclick = () => { state.cancelled = true; ui.cancel.disabled = true; setStatus('Cancelamento solicitado…'); log('Cancelamento solicitado; a operação atual será encerrada no próximo ponto seguro.'); setTimeout(() => { ui.cancel.disabled = false; }, 300); };
  ui.close.onclick = () => { if (!state.running || confirm('Uma execução está em andamento. Cancelar e fechar o painel?')) { state.cancelled = true; host.remove(); } };
  // Impede que atalhos de teclado da página bloqueiem o Backspace/Delete no painel
  ['keydown', 'keyup', 'keypress'].forEach(type => host.addEventListener(type, event => event.stopPropagation()));
  ui.input.addEventListener('keydown', event => {
    if ((event.key !== 'Backspace' && event.key !== 'Delete') || !event.defaultPrevented) return;
    event.preventDefault();
    const field = ui.input; let start = field.selectionStart, end = field.selectionEnd;
    if (start === end) { if (event.key === 'Backspace') start = Math.max(0, start - 1); else end = Math.min(field.value.length, end + 1); }
    field.setRangeText('', start, end, 'end');
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });
  LOTES.forEach(item => { const botao = document.createElement('button'); botao.type = 'button'; botao.textContent = item.rotulo; botao.dataset.lote = item.id; botao.setAttribute('aria-pressed', String(item.id === lote)); botao.onclick = () => { if (state.running) return; lote = item.id; try { localStorage.setItem('__exflow_inas_lote', lote); } catch (_) {} ui.lotes.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lote === lote))); atualizarResumo(); }; ui.lotes.appendChild(botao); });
  ui.input.addEventListener('input', atualizarResumo);
  if (filho) {
    ui.lotes.style.display = 'none'; ui.input.value = job.lista.join('\n'); ui.input.disabled = true; ui.resumo.textContent = `Guia ${job.ordem} de ${job.de} · aba aberta automaticamente`;
    root.querySelector('.panel-kind').textContent = `Autorizador 01 · Guia ${job.ordem}/${job.de}`;
    setTimeout(() => ui.start.onclick(), 300);
  } else { atualizarResumo(); ui.input.focus(); }
  }
  exflowInasLotes();
})();