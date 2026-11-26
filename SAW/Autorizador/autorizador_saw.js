/* ExFlow AI — Executor 04 (SAW · SP/SADT TISS 4.0) | Favorito ou Console. */
(() => {
  const URL_TELA = 'https://saw.trixti.com.br/saw/tiss/SolicitacaoDeSPSADT40.do?method=abrirTelaDeSolicitacaoDeSPSADT';
  const ROOT_ID = '__exflow_executor_04__';
  document.getElementById(ROOT_ID)?.remove();
  const state = { cancelled: false, running: false };
  /* O SAW atende dois convênios na mesma tela. O código da operadora vai nos campos 13 e 29. */
  const CONVENIOS = { proasa: { nome: 'PROASA', codigo: '9883' }, cnu: { nome: 'CNU', codigo: '002305275' } };
  let convenio = 'proasa';
  try { const salvo = localStorage.getItem('__exflow_saw_convenio'); if (CONVENIOS[salvo]) convenio = salvo; } catch (_) {}
  const CODIGO = () => CONVENIOS[convenio].codigo;
  try { window.__exflowExecutor04?.cancel?.(); } catch (_) {}
  window.__exflowExecutor04 = { cancel: () => { state.cancelled = true; } };
  const pausa = ms => new Promise(resolve => setTimeout(resolve, ms));

  function procurarEmFrames(selector, documentToSearch = document) { const found = documentToSearch.querySelector(selector); if (found) return found; for (const frame of documentToSearch.querySelectorAll('iframe, frame')) { try { const nested = procurarEmFrames(selector, frame.contentDocument || frame.contentWindow?.document); if (nested) return nested; } catch (_) {} } return null; }
  function localizarFuncaoEmFrames(name, documentToSearch = document) { try { const pageWindow = documentToSearch.defaultView; if (typeof pageWindow?.[name] === 'function') return pageWindow[name].bind(pageWindow); } catch (_) {} for (const frame of documentToSearch.querySelectorAll('iframe, frame')) { try { const nested = localizarFuncaoEmFrames(name, frame.contentDocument || frame.contentWindow?.document); if (nested) return nested; } catch (_) {} } return null; }

  /* ---------- Fora da tela de SP/SADT: abre a tela em uma nova guia ---------- */
  const naTela = () => /\/saw\/tiss\/solicitacaodespsadt40\.do/i.test(location.pathname) || !!procurarEmFrames('#tissSolicitacaoDeSPSADT40Form');
  const modoNavegacao = !naTela();
  if (modoNavegacao) { const aberta = window.open(URL_TELA, '_blank'); if (aberta) return; }

  const host = document.createElement('div'); host.id = ROOT_ID;
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `
    <style>
      :host{position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:rgba(33,24,67,.28);font:14px/1.4 Inter,ui-sans-serif,system-ui,sans-serif;color:#241b44}:host *{box-sizing:border-box}:host .card{width:min(760px,94vw);max-height:92vh;overflow:auto;border:1px solid #e9e5ff;border-radius:24px;background:#fff;box-shadow:0 28px 90px rgba(61,42,139,.25);padding:24px}.top{display:flex;gap:18px;align-items:center;border-bottom:1px solid #f0edff;padding-bottom:18px}h1{font-size:20px;margin:0}.sub{color:#756f91;margin:3px 0 0}.chibi{margin-left:auto;position:relative;width:68px;height:68px;border-radius:22px;background:linear-gradient(145deg,#eaf7ff,#efe9ff);border:1px solid #dcd3ff;overflow:hidden;flex:none}.chibi:before{content:'◕‿◕';position:absolute;left:11px;top:19px;font-size:23px;color:#5739c6}.chibi:after{content:'⌨';position:absolute;left:23px;top:42px;color:#62b8e6;font-size:22px}.working:after{animation:exflow-type .45s infinite alternate}.success:before{content:'^‿^';color:#21a06a}@keyframes exflow-type{to{transform:translateY(-4px) rotate(-8deg)}}label{display:block;font-weight:700;margin:18px 0 7px}textarea{width:100%;min-height:132px;padding:12px;border:1px solid #dcd5fa;border-radius:13px;resize:vertical;font:13px ui-monospace,monospace;outline:none}textarea:focus{border-color:#825cff;box-shadow:0 0 0 3px #eeeaff}.summary{margin-top:12px;padding:10px 12px;border:1px solid #e1e7f3;border-radius:10px;background:#fff;color:#66748c;font-size:12px;line-height:1.5}.row{display:flex;align-items:center;gap:10px;margin-top:15px;flex-wrap:wrap}button{border:0;border-radius:10px;padding:10px 15px;font-weight:750;cursor:pointer}.start{background:linear-gradient(120deg,#6e45df,#8c65ff);color:#fff}.cancel{background:#edf9ff;color:#18709b}.close{background:#f0edff;color:#5335c2}button:disabled{opacity:.55;cursor:not-allowed}.status{margin-left:auto;color:#5a5280;font-weight:650}.bar{height:8px;border-radius:999px;background:#edf3ff;margin-top:16px;overflow:hidden}.fill{height:100%;width:0;background:linear-gradient(90deg,#8b63ff,#77cbef);transition:width .25s}.error{display:none;margin-top:14px;padding:10px 12px;border-radius:10px;background:#fff0f3;color:#a12b4a;white-space:pre-wrap}.logs{margin-top:16px;background:#fbfaff;border:1px solid #f0edff;border-radius:12px;padding:10px;height:126px;overflow:auto;font:12px/1.45 ui-monospace,monospace;color:#50496c}.hint{color:#756f91;font-size:12px}
    </style><section class="card" role="dialog" aria-modal="true" aria-label="ExFlow AI Autorizador 04"><header class="top"><div><h1>ExFlow AI · Autorizador 04</h1><p class="sub">SAW · SP/SADT · guia completa</p></div><div class="chibi" data-chibi></div></header><div class="conv" data-conv><span class="conv-label">Convênio</span><button type="button" data-conv-btn="proasa">PROASA</button><button type="button" data-conv-btn="cnu">CNU · Central Nacional Unimed</button></div><label for="${ROOT_ID}-input">Códigos</label><div class="hint">Cole códigos separados por linha, espaço, vírgula ou ponto e vírgula. Repetições viram quantidade.</div><textarea id="${ROOT_ID}-input" placeholder="4030XXXX&#10;4030YYYY&#10;4030XXXX"></textarea><div class="summary" data-summary>Nenhum código informado.</div><div class="row"><button class="start" data-start>Iniciar</button><button class="cancel" data-cancel>Cancelar</button><button class="close" data-close>Fechar</button><span class="status" data-status></span></div><div class="bar"><div class="fill" data-progress></div></div><div class="error" data-error></div><div class="logs" data-logs>Pronto. Nenhuma ação foi executada.</div></section>`;
  const panel = root.querySelector('.card');
  const header = panel.querySelector('.top');
  header.innerHTML = `<div class="exflow-brand"><span class="exflow-mark">✦</span><span>EXFLOW AI</span></div><div class="panel-kind">Autorizador 04 · SAW</div><div class="chibi" data-chibi></div>`;
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
  const estiloConv = document.createElement('style');
  estiloConv.textContent = `.conv{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 14px}.conv-label{font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b7791}.conv button{border:1px solid #d6def0;background:#fff;color:#33415f;border-radius:10px;padding:8px 14px;font:600 13px Inter,system-ui,sans-serif;cursor:pointer}.conv button[aria-pressed=true]{background:#3e5be9;border-color:#3e5be9;color:#fff;box-shadow:0 4px 12px rgba(62,91,233,.25)}.conv button:disabled{opacity:.55;cursor:not-allowed}`;
  root.appendChild(estiloConv);
  const botoesConv = [...root.querySelectorAll('[data-conv-btn]')];
  const marcarConv = () => { botoesConv.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.convBtn === convenio))); const sub = root.querySelector('.sub'); if (sub) sub.textContent = `SAW · SP/SADT · ${CONVENIOS[convenio].nome} · guia completa`; };
  botoesConv.forEach(b => { b.onclick = () => { if (state.running) return; convenio = b.dataset.convBtn; try { localStorage.setItem('__exflow_saw_convenio', convenio); } catch (_) {} marcarConv(); }; });
  marcarConv();
  const log = message => { String(message).split('\n').forEach(part => { if (!part.trim()) return; console.log('[ExFlow 04]', part); const line = document.createElement('div'); line.textContent = `${new Date().toLocaleTimeString()}  ${part}`; ui.logs.appendChild(line); }); ui.logs.scrollTop = ui.logs.scrollHeight; };
  const setStatus = (message, percent) => { ui.status.textContent = message; if (Number.isFinite(percent)) ui.progress.style.width = `${Math.max(0, Math.min(100, percent))}%`; };
  const fail = message => { ui.error.textContent = message; ui.error.style.display = 'block'; log(`ERRO: ${message}`); };

  /* ---------- Lógica SAW (Trixti) ---------- */
  const PREF = 'manterTISSSPSADT40DTO.tissSolicitacaoDeSPSADTDTO.';
  const MAX_TENTATIVAS = 3;
  const alertas = [];
  const janelasComAlerta = [];
  let ultimaTabela = [];

  const checkCancelled = () => { if (state.cancelled) throw new Error('Execução cancelada pelo usuário.'); };
  async function esperar(condition, timeout = 10000, intervalo = 100) { const inicio = Date.now(); while (Date.now() - inicio < timeout) { checkCancelled(); try { const resultado = condition(); if (resultado) return resultado; } catch (_) {} await pausa(intervalo); } return null; }
  // Busca só no formulário principal (a página tem um "formClone" com campos de mesmo id).
  const campo = chave => { const form = procurarEmFrames('#tissSolicitacaoDeSPSADT40Form'); return form ? form.querySelector(`[id="${chave}"]`) || form.querySelector(`[name="${chave}"]`) : null; };
  const hdr = chave => campo(PREF + chave);
  const janelaDe = el => el?.ownerDocument?.defaultView || window;
  const valor = el => (el?.value ?? '').toString().trim();

  function setarValor(el, novo) {
    const win = janelaDe(el);
    const proto = el.tagName === 'SELECT' ? win.HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? win.HTMLTextAreaElement.prototype : win.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setter) setter.call(el, novo); else el.value = novo;
    el.dispatchEvent(new win.Event('input', { bubbles: true }));
    el.dispatchEvent(new win.Event('change', { bubbles: true }));
  }

  const semZeros = t => String(t ?? '').trim().replace(/^0+/, '');
  const mesmoCodigo = (a, b) => semZeros(a) === semZeros(b);

  function ocupado() {
    const aguarde = procurarEmFrames('#divAguarde'); const win = janelaDe(aguarde);
    let visivel = false, carregando = false;
    try { visivel = !!aguarde && win.getComputedStyle(aguarde).display !== 'none'; } catch (_) {}
    try { carregando = typeof win.isStatusCarregando === 'function' && !!win.isStatusCarregando(); } catch (_) {}
    return visivel || carregando;
  }
  async function aguardarLivre(timeout = 15000) { const livre = await esperar(() => !ocupado(), timeout); if (!livre) log('Aviso: a página continuou ocupada; seguindo mesmo assim.'); return !!livre; }
  async function estabilizar(el) { let ultimo = el.value, estavel = 0; const inicio = Date.now(); while (estavel < 5 && Date.now() - inicio < 3000) { checkCancelled(); await pausa(100); if (el.value === ultimo) estavel++; else { estavel = 0; ultimo = el.value; } } }

  function instalarCapturaDeAlertas(win) {
    try {
      if (!win || win.__exflowAlertOriginal) return;
      win.__exflowAlertOriginal = win.alert;
      win.alert = mensagem => { const texto = String(mensagem ?? '').replace(/\s+/g, ' ').trim(); alertas.push(texto); log(`⚠️ Mensagem do sistema: ${texto}`); };
      janelasComAlerta.push(win);
    } catch (_) {}
  }
  function restaurarAlertas() { while (janelasComAlerta.length) { const win = janelasComAlerta.pop(); try { win.alert = win.__exflowAlertOriginal; delete win.__exflowAlertOriginal; } catch (_) {} } }
  const alertasRecentes = () => alertas.length ? `\nMensagens do sistema:\n${alertas.slice(-3).map(m => `• ${m}`).join('\n')}` : '';

  async function tentar(rotulo, fn) {
    for (let t = 1; t <= MAX_TENTATIVAS; t++) {
      checkCancelled();
      try { if (await fn(t)) return true; } catch (erro) { if (state.cancelled) throw erro; log(`${rotulo}: erro — ${erro.message || erro}`); }
      if (t < MAX_TENTATIVAS) { log(`${rotulo}: tentativa ${t}/${MAX_TENTATIVAS} sem êxito.`); await pausa(1000); }
    }
    return false;
  }

  /* ----- lista de códigos ----- */
  function obterLista() {
    const todos = ui.input.value.split(/[\s,;|]+/).map(c => c.trim()).filter(Boolean);
    const invalidos = todos.filter(c => !/^\d{1,10}$/.test(c));
    if (invalidos.length) throw new Error(`Existem códigos inválidos (use só números, até 10 dígitos): ${invalidos.slice(0, 5).join(', ')}${invalidos.length > 5 ? '…' : ''}`);
    const contagem = new Map();
    todos.forEach(c => contagem.set(c, (contagem.get(c) || 0) + 1));
    return [...contagem].map(([codigo, quantidade]) => ({ codigo, quantidade }));
  }
  function atualizarResumo() {
    try {
      const lista = obterLista();
      if (!lista.length) { ui.summary.textContent = 'Nenhum código informado.'; return; }
      const total = lista.reduce((soma, p) => soma + p.quantidade, 0);
      ui.summary.innerHTML = `<strong>${lista.length}</strong> procedimentos diferentes · <strong>${total}</strong> ocorrências identificadas`;
    } catch (e) { ui.summary.textContent = e.message; }
  }

  /* ----- linhas de procedimento ----- */
  const pTabela = n => campo(`procedimentosSolicitados[${n}].tipoTabela`);
  const pCodigo = n => campo(`procedimentosSolicitados[${n}].codigo`);
  const pDesc = n => campo(`procedimentosSolicitados[${n}].descricao`);
  const pQtd = n => campo(`procedimentosSolicitados[${n}].quantidade`);
  const contarLinhas = () => { let total = 0; while (pCodigo(total)) total++; return total; };

  function chamarPagina(nomeFuncao, seletorBotao) {
    const botao = procurarEmFrames(seletorBotao);
    if (botao) { botao.click(); return true; }
    const funcao = localizarFuncaoEmFrames(nomeFuncao);
    if (funcao) { funcao(); return true; }
    return false;
  }

  async function ajustarLinhas(alvo) {
    for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
      let atual = contarLinhas();
      if (atual === alvo) return true;
      log(`Ajustando as linhas de procedimento: ${atual} → ${alvo} (tentativa ${tentativa}/${MAX_TENTATIVAS}).`);
      while (atual !== alvo) {
        checkCancelled(); await aguardarLivre();
        const antes = atual;
        const acionou = atual < alvo ? chamarPagina('adicionarProcedimentoSolicitado', 'input[name="btnAdicionarProcedimentoSolicitado"]') : chamarPagina('removerProcedimentoSolicitado', 'input[name="btnRemoverProcedimentoSolicitado"]');
        if (!acionou) throw new Error('Não encontrei os botões Adicionar/Remover da lista de procedimentos.');
        if (!await esperar(() => contarLinhas() !== antes, 5000)) break;
        await pausa(200);
        atual = contarLinhas();
      }
      if (contarLinhas() === alvo) return true;
      await pausa(1000);
    }
    return false;
  }

  async function preencherLinha(n, codigo, quantidade) {
    const tabela = pTabela(n), cod = pCodigo(n), desc = pDesc(n), qtd = pQtd(n);
    if (!tabela || !cod || !desc || !qtd) return { ok: false, motivo: 'campos da linha não encontrados' };
    await aguardarLivre();
    if (tabela.value !== '22') {
      setarValor(tabela, '22'); await pausa(400); await aguardarLivre();
      if (tabela.value !== '22') return { ok: false, motivo: 'não consegui selecionar a tabela “TUSS - Procedimentos e eventos em saúde”' };
    }
    if (cod.value.trim() !== codigo || !desc.value.trim()) {
      const antes = desc.value.trim();
      setarValor(cod, codigo);
      const apareceu = await esperar(() => { const atual = desc.value.trim(); return atual && atual !== antes; }, 15000);
      if (!apareceu) return { ok: false, motivo: 'a descrição não apareceu' };
      await estabilizar(desc); await aguardarLivre();
    }
    if (Number(qtd.value) !== quantidade) { setarValor(qtd, String(quantidade)); await pausa(300); await aguardarLivre(); }
    if (Number(qtd.value) !== quantidade) return { ok: false, motivo: `a quantidade ficou ${qtd.value || '(vazia)'} em vez de ${quantidade}` };
    return { ok: true };
  }

  async function garantirLinha(n, codigo, quantidade) {
    let ultimo = { ok: false, motivo: 'não tentou' };
    for (let t = 1; t <= MAX_TENTATIVAS; t++) {
      checkCancelled();
      try { ultimo = await preencherLinha(n, codigo, quantidade); } catch (erro) { if (state.cancelled) throw erro; ultimo = { ok: false, motivo: erro.message || String(erro) }; }
      if (ultimo.ok) return ultimo;
      log(`Linha ${n + 1} (${codigo}): tentativa ${t}/${MAX_TENTATIVAS} falhou — ${ultimo.motivo}.`);
      await pausa(800);
    }
    return ultimo;
  }

  /* ----- cabeçalho e dados do atendimento ----- */
  async function passoSelect(rotulo, el, esperado) {
    if (!el) throw new Error(`Campo “${rotulo}” não encontrado na tela.`);
    const ok = await tentar(rotulo, async () => {
      if (el.value !== esperado) { setarValor(el, esperado); await pausa(400); await aguardarLivre(); }
      return el.value === esperado;
    });
    if (!ok) throw new Error(`${rotulo}: não consegui definir o valor depois de ${MAX_TENTATIVAS} tentativas.${alertasRecentes()}`);
  }

  async function passoContratadoSolicitante() {
    const f13 = hdr('contratadoSolicitante.codigo'), f14 = hdr('contratadoSolicitante.nome');
    if (!f13 || !f14) throw new Error('Campos 13/14 (contratado solicitante) não encontrados.');
    const caixa = () => f13.ownerDocument.getElementById('ajaxAuto_' + f13.id);
    const ok = await tentar('13-Código na Operadora', async () => {
      if (!mesmoCodigo(valor(f13), CODIGO()) || !valor(f14)) {
        const win = janelaDe(f13);
        f13.focus();
        setarValor(f13, CODIGO());
        ['keydown', 'keyup'].forEach(tipo => f13.dispatchEvent(new win.KeyboardEvent(tipo, { bubbles: true, key: '5', keyCode: 53 })));
        // se a lista de sugestões aparecer, escolhe o prestador correspondente ao código
        const lista = await esperar(() => { const c = caixa(); return c && win.getComputedStyle(c).display !== 'none' && c.querySelector('li') ? c : null; }, 3500);
        if (lista) {
          const itens = [...lista.querySelectorAll('li')];
          const alvo = itens.find(li => li.textContent.includes(CODIGO()) || li.textContent.includes(semZeros(CODIGO()))) || itens[0];
          ['mouseover', 'mousedown', 'mouseup', 'click'].forEach(tipo => alvo.dispatchEvent(new win.MouseEvent(tipo, { bubbles: true, cancelable: true, view: win })));
        }
        await esperar(() => valor(f14) && !ocupado(), 10000);
      }
      return mesmoCodigo(valor(f13), CODIGO()) && !!valor(f14);
    });
    if (!ok) throw new Error(`13-Código na Operadora: o nome do contratado (campo 14) não apareceu para o código ${CODIGO()} depois de ${MAX_TENTATIVAS} tentativas.${alertasRecentes()}`);
  }

  const CAMPOS_PROFISSIONAL = ['nome', 'conselhoProfissional', 'crm', 'ufDoCrm', 'cbos'];
  const profissionalOk = () => CAMPOS_PROFISSIONAL.every(k => valor(hdr('profissionalSolicitante.' + k)));
  async function passoProfissional() {
    const ok = await tentar('Profissional solicitante (15 a 19)', async () => { await esperar(profissionalOk, 4000); return profissionalOk(); });
    if (!ok) throw new Error('O profissional solicitante (campos 15 a 19) não está preenchido. Preencha e clique em Iniciar novamente.');
  }

  const opcaoDoCodigo = (sel, codigo) => [...sel.options].find(o => o.value && (mesmoCodigo(o.value, codigo) || mesmoCodigo(o.text.split(/\s*-+\s*/)[0], codigo)));
  async function passoExecutante() {
    const sel = hdr('contratadoExecutante.codigo'), nome = hdr('contratadoExecutante.nome');
    if (!sel || !nome) throw new Error('Campos 29/30 (contratado executante) não encontrados.');
    const ok = await tentar('29-Cód. na Operadora (executante)', async () => {
      const opt = opcaoDoCodigo(sel, CODIGO());
      if (!opt) return false;
      if (sel.value !== opt.value || !valor(nome)) { setarValor(sel, opt.value); await esperar(() => valor(nome) && !ocupado(), 8000); }
      return sel.value === opt.value && !!valor(nome);
    });
    if (!ok) {
      const opcoes = [...sel.options].map(o => o.text.trim()).filter(Boolean).join(' | ');
      throw new Error(`29-Cód. na Operadora: não consegui selecionar o código ${CODIGO()} (${CONVENIOS[convenio].nome}) depois de ${MAX_TENTATIVAS} tentativas. Opções disponíveis no campo: ${opcoes || '(nenhuma)'}.${alertasRecentes()}`);
    }
  }

  /* ----- conferência ----- */
  function conferir(lista) {
    const p = [];
    const igual = (rotulo, el, esperado) => { if (valor(el) !== esperado) p.push(`${rotulo}: esperado ${esperado}, encontrado ${el ? (valor(el) || '(vazio)') : 'campo ausente'}`); };
    const preenchido = (rotulo, el) => { if (!valor(el)) p.push(`${rotulo}: está vazio`); };
    if (!mesmoCodigo(valor(hdr('contratadoSolicitante.codigo')), CODIGO())) p.push(`13-Código na Operadora: esperado ${CODIGO()}, encontrado ${valor(hdr('contratadoSolicitante.codigo')) || '(vazio)'}`);
    preenchido('14-Nome do Contratado', hdr('contratadoSolicitante.nome'));
    [['15-Nome do Profissional', 'nome'], ['16-Conselho Profissional', 'conselhoProfissional'], ['17-Número no Conselho', 'crm'], ['18-UF', 'ufDoCrm'], ['19-Código CBO', 'cbos']].forEach(([rotulo, k]) => preenchido(rotulo, hdr('profissionalSolicitante.' + k)));
    igual('21-Caráter do Atendimento (Eletiva)', hdr('caraterDeSolicitacao'), '1');
    { const el29 = hdr('contratadoExecutante.codigo'); const opt = el29 && el29.selectedOptions && el29.selectedOptions[0]; if (!opt || !el29.value || !(mesmoCodigo(el29.value, CODIGO()) || mesmoCodigo(opt.text.split(/\s*-+\s*/)[0], CODIGO()))) p.push(`29-Cód. na Operadora: esperado ${CODIGO()}, encontrado ${opt ? (opt.text.trim() || '(vazio)') : 'campo ausente'}`); }
    preenchido('30-Nome do Contratado Executante', hdr('contratadoExecutante.nome'));
    const total = contarLinhas();
    if (total !== lista.length) p.push(`Linhas de procedimento: esperado ${lista.length}, encontrado ${total}`);
    const tabela = lista.map((item, i) => {
      const linha = { Linha: i + 1, Codigo: item.codigo, Tabela: valor(pTabela(i)), CodigoNaTela: valor(pCodigo(i)), Descricao: valor(pDesc(i)), Esperado: item.quantidade, Atual: Number(valor(pQtd(i))) || 0 };
      if (linha.Tabela !== '22') p.push(`Linha ${i + 1}: tabela esperada 22, encontrada ${linha.Tabela || '(vazia)'}`);
      if (linha.CodigoNaTela !== item.codigo) p.push(`Linha ${i + 1}: código esperado ${item.codigo}, encontrado ${linha.CodigoNaTela || '(vazio)'}`);
      if (!linha.Descricao) p.push(`Linha ${i + 1} (${item.codigo}): descrição vazia`);
      if (linha.Atual !== item.quantidade) p.push(`Linha ${i + 1} (${item.codigo}): quantidade esperada ${item.quantidade}, encontrada ${linha.Atual}`);
      return linha;
    });
    igual('32-Tipo Atendimento (Exame)', hdr('tipoDeAtendimento'), '23');
    igual('33-Indicação de Acidente (Não Acidente)', hdr('indicacaoDeAcidente'), '9');
    igual('34-Tipo de Consulta (Por encaminhamento)', hdr('tipoDeConsulta'), '4');
    igual('91-Regime de atendimento (Ambulatorial)', hdr('regimeDeAtendimento'), '01');
    ultimaTabela = tabela;
    return { problemas: p, tabela };
  }

  /* ----- fluxo ----- */
  async function aplicarTudo(lista) {
    const n = lista.length;
    setStatus('13-Código na Operadora…', 4); await passoContratadoSolicitante();
    setStatus('Conferindo o profissional solicitante…', 8); await passoProfissional();
    setStatus('21-Caráter do Atendimento…', 11); await passoSelect('21-Caráter do Atendimento (Eletiva)', hdr('caraterDeSolicitacao'), '1');
    setStatus('29-Cód. na Operadora (executante)…', 14); await passoExecutante();
    setStatus(`Preparando ${n} linha(s) de procedimento…`, 18);
    if (!await ajustarLinhas(n)) throw new Error(`Não consegui deixar a lista com ${n} linha(s) de procedimento depois de ${MAX_TENTATIVAS} tentativas (tem ${contarLinhas()}).${alertasRecentes()}`);
    for (let i = 0; i < n; i++) {
      checkCancelled();
      const { codigo, quantidade } = lista[i];
      setStatus(`Linha ${i + 1}/${n}: ${codigo} (qtd ${quantidade})`, 20 + Math.round((i / n) * 60));
      const resultado = await garantirLinha(i, codigo, quantidade);
      if (!resultado.ok) throw new Error(`Linha ${i + 1} · código ${codigo}: ${resultado.motivo}, mesmo depois de ${MAX_TENTATIVAS} tentativas.${alertasRecentes()}`);
      log(`✓ Linha ${i + 1}: ${codigo} → ${valor(pDesc(i))} · qtd ${valor(pQtd(i))}`);
      await pausa(200);
    }
    setStatus('Dados do atendimento (32, 33, 34 e 91)…', 85);
    await passoSelect('32-Tipo Atendimento (Exame)', hdr('tipoDeAtendimento'), '23');
    await passoSelect('33-Indicação de Acidente (Não Acidente)', hdr('indicacaoDeAcidente'), '9');
    await passoSelect('34-Tipo de Consulta (Por encaminhamento)', hdr('tipoDeConsulta'), '4');
    await passoSelect('91-Regime de atendimento (Ambulatorial)', hdr('regimeDeAtendimento'), '01');
  }

  async function executarTudo(lista) {
    let problemas = [];
    for (let rodada = 1; rodada <= MAX_TENTATIVAS; rodada++) {
      checkCancelled();
      if (rodada > 1) log(`Conferência encontrou divergências. Refazendo (rodada ${rodada}/${MAX_TENTATIVAS})…`);
      await aplicarTudo(lista);
      setStatus('Conferência final…', 95);
      ({ problemas } = conferir(lista));
      if (!problemas.length) return;
      problemas.forEach(texto => log(`❌ ${texto}`));
    }
    throw new Error(`Conferência final: ainda há divergências depois de ${MAX_TENTATIVAS} tentativas.\n${problemas.join('\n')}${alertasRecentes()}`);
  }

  async function iniciar() {
    if (state.running) return;
    ui.error.style.display = 'none';
    let lista;
    try { lista = obterLista(); } catch (e) { fail(e.message); return; }
    if (!lista.length) { fail('Cole os códigos antes de iniciar.'); return; }
    if (lista.some(p => p.quantidade > 999)) { fail('A quantidade de um procedimento passa de 999 (limite do campo).'); return; }
    const campoLimite = Number(valor(campo('quantidadeDeProcedimentos')));
    const limite = campoLimite > 0 ? campoLimite : 30;
    if (lista.length > limite) { fail(`A guia aceita no máximo ${limite} procedimentos e foram informados ${lista.length} diferentes. Divida em mais de uma guia.`); return; }
    const f13 = hdr('contratadoSolicitante.codigo');
    if (!f13) { fail('Não encontrei os campos da guia de SP/SADT nesta página. Abra a tela “SP/SADT” e tente de novo.'); return; }

    state.running = true; state.cancelled = false; ui.start.disabled = true; botoesConv.forEach(b => { b.disabled = true; }); log(`Convênio: ${CONVENIOS[convenio].nome} · código da operadora ${CODIGO()}`);
    ui.chibi.classList.remove('success'); ui.chibi.classList.add('working');
    ui.progress.style.width = '0%'; alertas.length = 0;
    instalarCapturaDeAlertas(janelaDe(f13));
    log(`${lista.length} procedimento(s) diferente(s); ${lista.reduce((s, p) => s + p.quantidade, 0)} ocorrência(s).`);
    if (!valor(hdr('beneficiario.codigo'))) log('Atenção: o beneficiário (campo 8) ainda não foi preenchido; a busca dos procedimentos pode falhar.');
    try {
      await executarTudo(lista);
      console.table(ultimaTabela);
      setStatus('Concluído e conferido', 100);
      ui.chibi.classList.add('success');
      log('✅ Tudo preenchido e conferido. Revise a guia e clique em Gravar.');
    } catch (erro) {
      const cancelado = state.cancelled;
      setStatus(cancelado ? 'Cancelado' : 'Interrompido — veja o aviso', 0);
      if (!cancelado) fail(erro.message || String(erro)); else log('Execução cancelada.');
    } finally {
      restaurarAlertas(); state.running = false; ui.start.disabled = false; botoesConv.forEach(b => { b.disabled = false; }); ui.chibi.classList.remove('working');
    }
  }

  /* ---------- Eventos do painel ---------- */
  ui.input.addEventListener('input', atualizarResumo);
  ui.cancel.onclick = () => { state.cancelled = true; ui.cancel.disabled = true; setStatus('Cancelamento solicitado…'); log('Cancelamento solicitado; a operação atual será encerrada no próximo ponto seguro.'); setTimeout(() => { ui.cancel.disabled = false; }, 300); };
  ui.close.onclick = () => { if (!state.running || confirm('Uma execução está em andamento. Cancelar e fechar o painel?')) { state.cancelled = true; restaurarAlertas(); host.remove(); } };
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
  if (modoNavegacao) {
    ui.input.disabled = true; ui.start.textContent = 'Abrir tela SP/SADT';
    setStatus('Fora da tela de SP/SADT');
    log('Você não está na tela de SP/SADT e o navegador bloqueou a nova guia. Clique em “Abrir tela SP/SADT”.');
    ui.start.onclick = () => { const aberta = window.open(URL_TELA, '_blank'); if (aberta) host.remove(); else fail('O navegador bloqueou a nova guia. Permita pop-ups para saw.trixti.com.br ou abra a tela pelo menu do SAW.'); };
  } else {
    ui.start.onclick = () => iniciar().catch(error => { setStatus('Interrompido', 0); ui.chibi.classList.remove('working'); fail(error.message || error); });
    ui.input.focus();
  }
})();
