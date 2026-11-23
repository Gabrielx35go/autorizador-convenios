(() => {
  const BASE = "https://raw.githubusercontent.com/Gabrielx35go/autorizador-convenios/refs/heads/main/INAS/Autorizador%20e%20Executor/";
  const path = location.pathname.replace(/\/+$/, "");
  let arquivo = null;

  if (location.origin === "https://gdf.maida.health") {
    if (path === "/solicitacoes/sp-sadt") {
      arquivo = "autorizador_inas.js";
    } else if (/^\/solicitacoes\/historico\/solicitacao\/detalhes\/sp-sadt\/.+/.test(path)) {
      arquivo = "executor_inas.js";
    }
  }

  if (!arquivo) {
    document.getElementById("__exflow_inas_aviso__")?.remove();
    const aviso = document.createElement("div");
    aviso.id = "__exflow_inas_aviso__";
    aviso.textContent = "ExFlow AI · INAS: abra a tela de SP/SADT (/solicitacoes/sp-sadt) ou os detalhes de uma solicitação do histórico.";
    aviso.style.cssText = "position:fixed;top:16px;right:16px;max-width:360px;z-index:2147483647;padding:12px 16px;border-radius:10px;background:#fff;color:#241b44;border:1px solid #dcd5fa;box-shadow:0 8px 30px rgba(61,42,139,.25);font:13px/1.4 system-ui,sans-serif";
    document.body.appendChild(aviso);
    setTimeout(() => aviso.remove(), 7000);
    return;
  }

  fetch(BASE + arquivo)
    .then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
    .then(eval);
})();
