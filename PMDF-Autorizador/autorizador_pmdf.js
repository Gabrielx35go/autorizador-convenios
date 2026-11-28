/* ExFlow AI — Executor 03 (Benner) | Cole este arquivo inteiro no Console do navegador. */
(() => {
  const ROOT_ID = '__exflow_executor_03__';
  document.getElementById(ROOT_ID)?.remove();
  const state = { cancelled: false, running: false };
  try { window.__exflowExecutor03?.cancel?.(); } catch (_) {}
  window.__exflowExecutor03 = { cancel: () => { state.cancelled = true; } };
  const pausa = ms => new Promise(resolve => setTimeout(resolve, ms));

  const host = document.createElement('div'); host.id = ROOT_ID;
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <style>
      :host{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:rgba(33,24,67,.28);font:14px/1.4 Inter,ui-sans-serif,system-ui,sans-serif;color:#241b44}:host *{box-sizing:border-box}:host .card{width:min(760px,94vw);max-height:92vh;overflow:auto;border:1px solid #e9e5ff;border-radius:24px;background:#fff;box-shadow:0 28px 90px rgba(61,42,139,.25);padding:24px}.top{display:flex;gap:18px;align-items:center;border-bottom:1px solid #f0edff;padding-bottom:18px}h1{font-size:20px;margin:0}.sub{color:#756f91;margin:3px 0 0}.chibi{margin-left:auto;position:relative;width:68px;height:68px;border-radius:22px;background:linear-gradient(145deg,#eaf7ff,#efe9ff);border:1px solid #dcd3ff;overflow:hidden;flex:none}.chibi:before{content:'◕‿◕';position:absolute;left:11px;top:19px;font-size:23px;color:#5739c6}.chibi:after{content:'⌨';position:absolute;left:23px;top:42px;color:#62b8e6;font-size:22px}.working:after{animation:exflow-type .45s infinite alternate}.success:before{content:'^‿^';color:#21a06a}@keyframes exflow-type{to{transform:translateY(-4px) rotate(-8deg)}}label{display:block;font-weight:700;margin:18px 0 7px}textarea{width:100%;min-height:132px;padding:12px;border:1px solid #dcd5fa;border-radius:13px;resize:vertical;font:13px ui-monospace,monospace;outline:none}textarea:focus{border-color:#825cff;box-shadow:0 0 0 3px #eeeaff}.summary{margin-top:12px;padding:10px 12px;border:1px solid #e1e7f3;border-radius:10px;background:#fff;color:#66748c;font-size:12px;line-height:1.5}.row{display:flex;align-items:center;gap:10px;margin-top:15px;flex-wrap:wrap}button{border:0;border-radius:10px;padding:10px 15px;font-weight:750;cursor:pointer}.start{background:linear-gradient(120deg,#6e45df,#8c65ff);color:#fff}.cancel{background:#edf9ff;color:#18709b}.close{background:#f0edff;color:#5335c2}button:disabled{opacity:.55;cursor:not-allowed}.status{margin-left:auto;color:#5a5280;font-weight:650}.bar{height:8px;border-radius:999px;background:#edf3ff;margin-top:16px;overflow:hidden}.fill{height:100%;width:0;background:linear-gradient(90deg,#8b63ff,#77cbef);transition:width .25s}.error{display:none;margin-top:14px;padding:10px 12px;border-radius:10px;background:#fff0f3;color:#a12b4a;white-space:pre-wrap}.logs{margin-top:16px;background:#fbfaff;border:1px solid #f0edff;border-radius:12px;padding:10px;height:126px;overflow:auto;font:12px/1.45 ui-monospace,monospace;color:#50496c}.hint{color:#756f91;font-size:12px}
    </style><section class="card" role="dialog" aria-modal="true" aria-label="ExFlow AI Autorizador 03"><header class="top"><div><h1>ExFlow AI · Autorizador 03</h1><p class="sub">Benner · inclusão automática de procedimentos</p></div><div class="chibi" data-chibi></div></header><label for="${ROOT_ID}-input">Códigos</label><div class="hint">Cole códigos separados por linha, espaço, vírgula ou ponto e vírgula. Repetições viram quantidade.</div><textarea id="${ROOT_ID}-input" placeholder="4030XXXX&#10;4030YYYY&#10;4030XXXX"></textarea><div class="summary" data-summary>Nenhum código informado.</div><div class="row"><button class="start" data-start>Iniciar</button><button class="cancel" data-cancel>Cancelar</button><button class="close" data-close>Fechar</button><span class="status" data-status></span></div><div class="bar"><div class="fill" data-progress></div></div><div class="error" data-error></div><div class="logs" data-logs>Pronto. Nenhuma ação foi executada.</div></section>`;
  const panel = root.querySelector('.card');
  const header = panel.querySelector('.top');
  header.innerHTML = `<div class="exflow-brand"><span class="exflow-mark">✦</span><span>EXFLOW AI</span></div><div class="panel-kind">Autorizador 03 · Benner</div><div class="chibi" data-chibi></div>`;
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
  document.body.appendChild(host);
  const ui = { input: root.querySelector('textarea'), summary: root.querySelector('[data-summary]'), start: root.querySelector('[data-start]'), cancel: root.querySelector('[data-cancel]'), close: root.querySelector('[data-close]'), status: root.querySelector('[data-status]'), progress: root.querySelector('[data-progress]'), logs: root.querySelector('[data-logs]'), error: root.querySelector('[data-error]'), chibi: root.querySelector('[data-chibi]') };
  const log = message => { String(message).split('\n').forEach(part => { if (!part.trim()) return; console.log('[ExFlow 03]', part); const line = document.createElement('div'); line.textContent = `${new Date().toLocaleTimeString()}  ${part}`; ui.logs.appendChild(line); }); ui.logs.scrollTop = ui.logs.scrollHeight; };
  const setStatus = (message, percent) => { ui.status.textContent = message; if (Number.isFinite(percent)) ui.progress.style.width = `${Math.max(0, Math.min(100, percent))}%`; };
  const fail = message => { ui.error.textContent = message; ui.error.style.display = 'block'; log(`ERRO: ${message}`); };

  /* ---------- Lógica Benner ---------- */
  function obterLista() {
    const codigos = (ui.input.value.match(/(?<!\d)(?:\d\.\d{2}\.\d{2}\.\d{2}-\d|\d{8})(?!\d)/g) || []).map(c => c.replace(/\D/g, '')); // só códigos TUSS de 8 dígitos; o resto do texto colado é ignorado
    if (!codigos.length) throw new Error('Nenhum código TUSS de 8 dígitos encontrado no texto.');
    const contagem = new Map();
    codigos.forEach(codigo => contagem.set(codigo, (contagem.get(codigo) || 0) + 1));
    return [...contagem].map(([codigo, quantidade]) => ({ codigo, quantidade }));
  }

  function atualizarResumo() {
    try {
      const lista = obterLista();
      if (!lista.length) { ui.summary.textContent = 'Nenhum código informado.'; return; }
      const total = lista.reduce((s, p) => s + p.quantidade, 0);
      ui.summary.innerHTML = `<strong>${lista.length}</strong> procedimentos diferentes · <strong>${total}</strong> ocorrências identificadas`;
    } catch (e) { ui.summary.textContent = e.message; }
  }

  function localizar(codigo) {
    const componente = document.querySelector('bc-guia-eventos-exibicao-termos-selecionados');
    if (!componente) return null;
    return [...componente.querySelectorAll('div[ng-repeat="item in eventos"]')].find(linha => {
      const campo = linha.querySelector('input[disabled]');
      return campo && campo.value.split('|')[0].trim() === codigo;
    }) || null;
  }

  async function esperar(codigo, timeout = 90000) {
    const inicio = Date.now();
    while (Date.now() - inicio < timeout) {
      if (state.cancelled) return null;
      const linha = localizar(codigo);
      if (linha) return linha;
      await pausa(400);
    }
    return null;
  }

  const obterCampoQuantidade = linha => linha?.querySelector('input[ng-model="item.QuantidadeSolicitada"]');
  const lerQuantidade = linha => { const campo = obterCampoQuantidade(linha); return campo ? campo.value.trim() : null; };

  function preencherQuantidade(linha, quantidade) {
    const campo = obterCampoQuantidade(linha);
    if (!campo) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    campo.focus();
    setter.call(campo, String(quantidade));
    campo.dispatchEvent(new Event('input', { bubbles: true }));
    campo.dispatchEvent(new Event('change', { bubbles: true }));
    campo.dispatchEvent(new Event('blur', { bubbles: true }));
    return campo.value.trim() === String(quantidade);
  }

  async function confirmarQuantidade(linha, quantidade) {
    for (let tentativa = 1; tentativa <= 3; tentativa++) {
      if (state.cancelled) return false;
      preencherQuantidade(linha, quantidade);
      await pausa(600);
      if (lerQuantidade(linha) === String(quantidade)) return true;
    }
    return false;
  }

  async function inserirProcedimento(procedimento, campo) {
    const { codigo, quantidade } = procedimento;
    let linha = localizar(codigo);
    if (!linha) {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      campo.focus();
      setter.call(campo, codigo);
      campo.dispatchEvent(new Event('input', { bubbles: true }));
      campo.dispatchEvent(new Event('change', { bubbles: true }));
      campo.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
      campo.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
      log(`⏳ ${codigo}: enviado, aguardando confirmação.`);
      linha = await esperar(codigo);
    } else {
      log(`ℹ️ ${codigo}: já estava na lista.`);
    }
    if (!linha) { log(`❌ ${codigo}: não apareceu na lista.`); return false; }
    log(`✓ ${codigo}: inclusão confirmada.`);
    const quantidadeOK = await confirmarQuantidade(linha, quantidade);
    if (!quantidadeOK) { log(`❌ ${codigo}: quantidade ${quantidade} não confirmada.`); return false; }
    log(`✓ ${codigo}: quantidade ${quantidade} confirmada.`);
    return true;
  }

  async function verificacaoFinal(lista) {
    setStatus('Conferência final dos procedimentos…', 90);
    log('========== CONFERÊNCIA FINAL ==========');
    const resultados = [];
    for (let i = 0; i < lista.length; i++) {
      if (state.cancelled) break;
      const { codigo, quantidade } = lista[i];
      let linha = localizar(codigo);
      if (!linha) linha = await esperar(codigo, 10000);
      if (!linha) {
        resultados.push({ codigo, esperado: quantidade, encontrado: 'Ausente', ok: false });
        log(`❌ ${codigo}: procedimento ausente.`);
        continue;
      }
      let atual = lerQuantidade(linha);
      if (atual !== String(quantidade)) {
        log(`⚠️ ${codigo}: quantidade divergente (${atual}). Corrigindo…`);
        await confirmarQuantidade(linha, quantidade);
        await pausa(500);
        linha = localizar(codigo);
        atual = lerQuantidade(linha);
      }
      const ok = atual === String(quantidade);
      resultados.push({ codigo, esperado: quantidade, encontrado: atual, ok });
      log(ok ? `✅ ${codigo}: conferido (${atual}).` : `❌ ${codigo}: esperado ${quantidade}, encontrado ${atual}.`);
      setStatus(`Conferindo ${i + 1}/${lista.length}…`, 90 + Math.round(((i + 1) / lista.length) * 10));
    }
    const aprovados = resultados.filter(r => r.ok).length;
    const pendentes = resultados.filter(r => !r.ok);
    log('========== RESULTADO ==========');
    log(`Conferidos: ${aprovados}/${lista.length}`);
    log(`Pendências: ${pendentes.length}`);
    console.table(resultados);
    if (state.cancelled) { setStatus('Conferência interrompida.'); return resultados; }
    if (!pendentes.length) {
      setStatus('Concluído: todos os procedimentos conferidos.', 100);
      ui.chibi.classList.add('success');
    } else {
      setStatus(`Concluído com ${pendentes.length} pendência(s).`, 100);
      fail(`Conferência final: pendências\n${pendentes.map(r => `${r.codigo} → esperado ${r.esperado}, encontrado ${r.encontrado}`).join('\n')}`);
    }
    return resultados;
  }

  async function iniciar() {
    if (state.running) return;
    ui.error.style.display = 'none';
    let lista;
    try { lista = obterLista(); } catch (e) { fail(e.message); return; }
    if (!lista.length) { fail('Cole os códigos antes de iniciar.'); return; }
    const campo = document.querySelector('#HandleTermo');
    if (!campo) { fail('Campo #HandleTermo não encontrado.'); return; }

    state.running = true; state.cancelled = false; ui.start.disabled = true;
    ui.chibi.classList.remove('success'); ui.chibi.classList.add('working');
    ui.progress.style.width = '0%';
    try {
      let falhou = false;
      for (let i = 0; i < lista.length; i++) {
        if (state.cancelled) break;
        setStatus(`Inserindo ${i + 1}/${lista.length}: ${lista[i].codigo}`, (i / lista.length) * 90);
        const ok = await inserirProcedimento(lista[i], campo);
        if (!ok) {
          falhou = true;
          if (!state.cancelled) { setStatus(`Interrompido por falha em ${lista[i].codigo}.`); fail(`Interrompido por falha em ${lista[i].codigo}.`); }
          break;
        }
        setStatus(`Inserido ${i + 1}/${lista.length}: ${lista[i].codigo}`, ((i + 1) / lista.length) * 90);
        await pausa(900);
      }
      if (!state.cancelled && !falhou) {
        await verificacaoFinal(lista);
      } else {
        if (state.cancelled) setStatus('Cancelado');
        log('⚠️ Não foi realizada a conferência final completa.');
      }
    } catch (erro) {
      setStatus('Erro durante o processamento.');
      fail(erro.message || String(erro));
    } finally {
      state.running = false; ui.start.disabled = false; ui.chibi.classList.remove('working');
    }
  }

  /* ---------- Eventos do painel ---------- */
  ui.input.addEventListener('input', atualizarResumo);
  ui.start.onclick = () => iniciar().catch(error => { setStatus('Interrompido', 0); ui.chibi.classList.remove('working'); fail(error.message || error); });
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
  if (!document.querySelector('#HandleTermo')) log('Atenção: não encontrei o campo #HandleTermo. Abra a tela “Nova Guia” (passo 3 · Dados da Solicitação) antes de iniciar.');
  ui.input.focus();
})();
