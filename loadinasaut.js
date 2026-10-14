fetch("https://raw.githubusercontent.com/Gabrielx35go/autorizador-convenios/refs/heads/main/INAS/Autorizador%20e%20Executor/autorizador_inas.js")
  .then(r => r.text())
  .then(eval);
