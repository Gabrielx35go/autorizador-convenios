/* ExFlow AI — Executor 01 | Cole este arquivo inteiro no Console do navegador. */
(async () => {
  const ROOT_ID = '__exflow_executor_01__';
  document.getElementById(ROOT_ID)?.remove();

  const state = { cancelled: false, running: false };
  const TABELA = '22 - Procedimentos e eventos em saúde';
  const MAX_TENTATIVAS = 3;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const cancelled = () => state.cancelled;
  const escapeHtml = value => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

  const host = document.createElement('div');
  host.id = ROOT_ID;
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <style>
      :host{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:rgba(33,24,67,.28);font:14px/1.4 Inter,ui-sans-serif,system-ui,sans-serif;color:#241b44}
      :host *{box-sizing:border-box} :host .card{width:min(760px,94vw);max-height:92vh;overflow:auto;border:1px solid #e9e5ff;border-radius:24px;background:#fff;box-shadow:0 28px 90px rgba(61,42,139,.25);padding:24px}
      #${ROOT_ID} .top{display:flex;gap:18px;align-items:center;border-bottom:1px solid #f0edff;padding-bottom:18px} #${ROOT_ID} h1{font-size:20px;margin:0} #${ROOT_ID} .sub{color:#756f91;margin:3px 0 0}
      #${ROOT_ID} .chibi{margin-left:auto;position:relative;width:68px;height:68px;border-radius:22px;background:linear-gradient(145deg,#eaf7ff,#efe9ff);border:1px solid #dcd3ff;overflow:hidden;flex:none}.chibi:before{content:'◕‿◕';position:absolute;left:11px;top:19px;font-size:23px;color:#5739c6}.chibi:after{content:'⌨';position:absolute;left:23px;top:42px;color:#62b8e6;font-size:22px}.working:after{animation:exflow-type .45s infinite alternate}.success:before{content:'^‿^';color:#21a06a}@keyframes exflow-type{to{transform:translateY(-4px) rotate(-8deg)}}
      #${ROOT_ID} label{display:block;font-weight:700;margin:18px 0 7px} #${ROOT_ID} textarea{width:100%;min-height:132px;padding:12px;border:1px solid #dcd5fa;border-radius:13px;resize:vertical;font:13px ui-monospace,monospace;outline:none} #${ROOT_ID} textarea:focus{border-color:#825cff;box-shadow:0 0 0 3px #eeeaff}
      #${ROOT_ID} .row{display:flex;align-items:center;gap:10px;margin-top:15px;flex-wrap:wrap} #${ROOT_ID} button{border:0;border-radius:10px;padding:10px 15px;font-weight:750;cursor:pointer} #${ROOT_ID} .start{background:linear-gradient(120deg,#6e45df,#8c65ff);color:#fff}.cancel{background:#edf9ff;color:#18709b}.close{background:#f0edff;color:#5335c2}#${ROOT_ID} button:disabled{opacity:.55;cursor:not-allowed}
      #${ROOT_ID} .status{margin-left:auto;color:#5a5280;font-weight:650} #${ROOT_ID} .bar{height:8px;border-radius:999px;background:#edf3ff;margin-top:16px;overflow:hidden}.fill{height:100%;width:0;background:linear-gradient(90deg,#8b63ff,#77cbef);transition:width .25s}.error{display:none;margin-top:14px;padding:10px 12px;border-radius:10px;background:#fff0f3;color:#a12b4a;white-space:pre-wrap}.logs{margin-top:16px;background:#fbfaff;border:1px solid #f0edff;border-radius:12px;padding:10px;height:126px;overflow:auto;font:12px/1.45 ui-monospace,monospace;color:#50496c}.hint{color:#756f91;font-size:12px}
    </style>
    <section class="card" role="dialog" aria-modal="true" aria-label="ExFlow AI Executor 01">
      <header class="top"><div><h1>ExFlow AI · Autorizador 01</h1><p class="sub">Tabela 22 · procedimentos e eventos em saúde</p></div><div class="chibi" data-chibi aria-label="Assistente trabalhando"></div></header>
      <label for="${ROOT_ID}-input">Códigos</label><div class="hint">Cole códigos separados por linha, espaço, vírgula ou ponto e vírgula. Repetições viram quantidade.</div>
      <textarea id="${ROOT_ID}-input" placeholder="4030XXXX&#10;4030YYYY&#10;4030XXXX"></textarea>
      <div class="row"><button class="start" data-start>Iniciar</button><button class="cancel" data-cancel>Cancelar</button><button class="close" data-close>Fechar</button></div>
      <div class="bar"><div class="fill" data-progress></div></div><div class="error" data-error></div><div class="logs" data-logs>Pronto. Nenhuma ação foi executada.</div>
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
    :host{background:#eef2fb!important;color:#202a42!important}.card{width:min(1180px,96vw)!important;height:min(720px,92vh)!important;max-height:92vh!important;padding:0!important;border-radius:16px!important;display:grid!important;grid-template-columns:208px minmax(0,1fr)!important;overflow:hidden!important;border:1px solid #dfe5f6!important;box-shadow:0 24px 70px rgba(48,68,128,.18)!important;background:#fafcff!important}.top{grid-column:1!important;grid-row:1!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:0!important;margin:0!important;padding:27px 18px!important;border:0!important;border-right:1px solid #e1e7f5!important;background:linear-gradient(180deg,#f8faff 0%,#f4f2ff 100%)!important}.exflow-brand{display:flex;align-items:center;gap:10px;color:#1d2940;font-size:17px;letter-spacing:2.8px;font-weight:500;margin:0 7px 52px}.exflow-mark{display:grid;place-items:center;width:29px;height:29px;border-radius:9px;background:linear-gradient(135deg,#356afb,#6b44ed);color:white;font-size:17px;letter-spacing:0}.rail-title{padding:0 10px 10px;color:#77839a;text-transform:uppercase;font-size:10px;letter-spacing:1.4px;font-weight:800}.rail-item{padding:12px 11px;border-radius:9px;color:#66748d;font-weight:650;margin:2px 0}.rail-item.active{background:#e8edff;color:#315fec;box-shadow:inset 0 0 0 1px #cbd8ff}.rail-footer{margin-top:auto;border-top:1px solid #dde4f1;padding:17px 9px 0;color:#68748a;font-size:11px;line-height:1.8}.rail-footer small{color:#8b95a8}.chibi{display:none!important}.workspace{grid-column:2!important;min-width:0!important;overflow:auto!important;padding:28px 42px 32px!important;background:radial-gradient(circle at 100% 0,#eef1ff 0,transparent 31%),#fafcff!important}.workspace-intro{font-size:15px;color:#68758b;max-width:760px}.workspace-intro .local-note{display:flex;gap:11px;align-items:center;margin-bottom:28px;padding:10px 13px;border:1px solid #d9ddff;border-radius:9px;background:#f3f4ff;color:#788097;font-size:12px}.workspace-intro .local-note b{color:#6453ef;font-weight:700}.workspace-intro p{margin:0 0 12px;color:#3866ed;font-size:12px;letter-spacing:1.65px;font-weight:800}.workspace-intro h2{margin:0 0 9px;color:#1b2540;font-size:38px;line-height:1.04;font-weight:450;letter-spacing:1px}.workspace label{margin-top:31px!important;color:#1f2941!important;font-size:15px}.workspace .hint{margin-top:-3px;color:#728098!important}.workspace textarea{min-height:112px!important;margin-top:10px!important;border-color:#dce3f2!important;border-radius:10px!important;background:white!important;color:#26324c!important;box-shadow:none!important}.workspace textarea:focus{border-color:#416cf3!important;box-shadow:0 0 0 3px #e7edff!important}.workspace .row{margin-top:18px!important;padding:14px!important;border:1px solid #e1e7f3!important;border-radius:11px!important;background:white!important}.workspace button{border-radius:8px!important;padding:10px 17px!important;font-size:13px!important}.workspace .start{background:#3e5be9!important;box-shadow:0 6px 14px rgba(62,91,233,.2)!important}.workspace .cancel{background:#eef2ff!important;color:#4264db!important}.workspace .close{background:transparent!important;color:#748097!important}.workspace .status{font-size:12px!important;color:#62708a!important}.workspace .bar{height:5px!important;margin:14px 0 0!important;background:#e9eef8!important}.workspace .fill{background:#3f63ed!important}.workspace .error{border:1px solid #ffd3dc!important;background:#fff8f9!important}.workspace .logs{height:105px!important;margin-top:16px!important;border:1px solid #e1e7f3!important;border-radius:10px!important;background:#fff!important;color:#66748c!important}
    @media(max-width:720px){.card{grid-template-columns:1fr!important;height:94vh!important}.top{display:none!important}.workspace{grid-column:1!important;padding:24px!important}.workspace-intro h2{font-size:30px!important}}
  `;
  root.appendChild(exflowTheme);
  const floatingTheme = document.createElement('style');
  floatingTheme.textContent = `
    :host{display:grid!important;place-items:center!important;background:rgba(232,237,250,.26)!important;pointer-events:none!important}.card{display:block!important;width:min(680px,94vw)!important;height:auto!important;max-height:88vh!important;border-radius:15px!important;pointer-events:auto!important}.top{display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between!important;padding:17px 21px!important;border:0!important;border-bottom:1px solid #e5eaf4!important;background:#fff!important}.exflow-brand{margin:0!important;font-size:15px!important}.workspace{display:block!important;padding:23px 26px 26px!important;background:#fafcff!important}.workspace-intro{margin-bottom:16px!important}.workspace-intro p{margin:0 0 7px!important;color:#3866ed!important;font-size:12px!important;letter-spacing:1.65px!important;font-weight:800!important}.exflow-instructions{color:#68758b;font-size:14px}.workspace .row{display:flex!important;gap:8px!important}.workspace .start{color:#fff!important}.panel-kind,.workspace>label,.workspace>.hint,.rail-title,.rail-item,.rail-footer{display:none!important}
  `;
  root.appendChild(floatingTheme);
  document.body.appendChild(host);
  const ui = {
    input: root.querySelector('textarea'), start: root.querySelector('[data-start]'), cancel: root.querySelector('[data-cancel]'), close: root.querySelector('[data-close]'),
    status: root.querySelector('[data-status]'), progress: root.querySelector('[data-progress]'), logs: root.querySelector('[data-logs]'), error: root.querySelector('[data-error]'), chibi: root.querySelector('[data-chibi]')
  };
  const log = message => { console.log('[ExFlow 01]', message); const line = document.createElement('div'); line.textContent = `${new Date().toLocaleTimeString()}  ${message}`; ui.logs.appendChild(line); ui.logs.scrollTop = ui.logs.scrollHeight; };
  const setStatus = (message, percent) => { ui.status.textContent = message; if (Number.isFinite(percent)) ui.progress.style.width = `${Math.max(0, Math.min(100, percent))}%`; };
  const fail = message => { ui.error.textContent = message; ui.error.style.display = 'block'; log(`ERRO: ${message}`); };
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
  function parseCodes(value) { const list = value.split(/[\s,;]+/).map(code => code.trim()).filter(Boolean); const quantities = {}; const codes = []; list.forEach(code => { if (!(code in quantities)) { codes.push(code); quantities[code] = 0; } quantities[code]++; }); return { codes, quantities }; }
  async function run() {
    const { codes, quantities } = parseCodes(ui.input.value); if (!codes.length) throw new Error('Informe pelo menos um código válido antes de iniciar.');
    const pending = () => { const saved = lerItensTabela(); return Object.fromEntries(codes.map(code => [code, Math.max(0, quantities[code] - (saved[code] || 0))]).filter(([, missing]) => missing > 0)); };
    ui.error.style.display = 'none'; state.running = true; state.cancelled = false; ui.start.disabled = true; ui.chibi.classList.add('working'); log(`${codes.length} código(s) único(s) recebido(s).`);
    try {
      setStatus('Validando a Tabela 22…', 3); if (!await selecionarTabela22()) throw new Error('Não encontrei ou não consegui selecionar o campo “Tabela” com a opção Tabela 22.');
      let pendingCodes = pending(); log(`Pendentes iniciais: ${Object.keys(pendingCodes).length}.`);
      for (let attempt = 1; attempt <= MAX_TENTATIVAS && Object.keys(pendingCodes).length; attempt++) {
        log(`Tentativa ${attempt}/${MAX_TENTATIVAS}.`); let index = 0;
        for (const code of codes) { checkCancelled(); const quantity = pendingCodes[code]; if (!quantity) continue; index++; setStatus(`Tentativa ${attempt}: ${code}`, 8 + ((attempt - 1) * 30) + Math.round((index / Math.max(1, Object.keys(pendingCodes).length)) * 28)); if (!await inserirCodigo(code, quantity)) log(`Não foi possível confirmar a inserção de ${code} nesta tentativa.`); }
        await sleep(700); pendingCodes = pending(); log(`Conferência ${attempt}: ${Object.keys(pendingCodes).length} código(s) ainda pendente(s).`);
      }
      const missing = pending(); const saved = lerItensTabela(); console.table(codes.map(code => ({ Codigo: code, Solicitado: quantities[code], Cadastrado: saved[code] || 0, Falta: missing[code] || 0 })));
      if (Object.keys(missing).length) { setStatus('Conferência final encontrou pendências', 100); throw new Error(`Conferência final: ainda faltam\n${Object.entries(missing).map(([code, quantity]) => `${code} → ${quantity}`).join('\n')}`); }
      setStatus('Concluído e conferido', 100); ui.chibi.classList.remove('working'); ui.chibi.classList.add('success'); log('Concluído somente após a conferência final das quantidades.');
    } finally { state.running = false; ui.start.disabled = false; if (!state.cancelled) ui.chibi.classList.remove('working'); }
  }
  ui.start.onclick = () => run().catch(error => { setStatus(state.cancelled ? 'Cancelado' : 'Interrompido', 0); ui.chibi.classList.remove('working'); fail(error.message || error); });
  ui.cancel.onclick = () => { state.cancelled = true; ui.cancel.disabled = true; setStatus('Cancelamento solicitado…'); log('Cancelamento solicitado; a operação atual será encerrada no próximo ponto seguro.'); setTimeout(() => { ui.cancel.disabled = false; }, 300); };
  ui.close.onclick = () => { if (!state.running || confirm('Uma execução está em andamento. Cancelar e fechar o painel?')) { state.cancelled = true; host.remove(); } };
  ui.input.focus();
})();
