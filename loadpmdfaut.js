fetch("https://raw.githubusercontent.com/Gabrielx35go/autorizador-convenios/refs/heads/main/PMDF-Autorizador/autorizador_pmdf.js")
  .then(r => r.text())
  .then(eval);
