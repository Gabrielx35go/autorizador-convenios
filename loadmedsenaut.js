fetch("https://raw.githubusercontent.com/Gabrielx35go/autorizador_convenios/refs/heads/main/MedSenior-Autorizador/autorizador_medsenior.js")
  .then(r => r.text())
  .then(eval);
