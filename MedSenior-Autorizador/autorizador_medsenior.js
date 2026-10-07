(async () => {
    // ============================================================
    // AUTOMATIZADOR DE PROCEDIMENTOS
    // ============================================================

    const CONFIG = {
        timeoutLinha: 15000,
        timeoutDescricao: 20000,
        intervalo: 100
    };

    // ============================================================
    // AUXILIARES
    // ============================================================

    const dormir = ms =>
        new Promise(resolve => setTimeout(resolve, ms));

    const esperar = (condicao, timeout = 10000, intervalo = 100) => {
        return new Promise(resolve => {

            const inicio = Date.now();

            const timer = setInterval(() => {

                try {

                    const resultado = condicao();

                    if (resultado) {
                        clearInterval(timer);
                        resolve(resultado);
                        return;
                    }

                    if (Date.now() - inicio >= timeout) {
                        clearInterval(timer);
                        resolve(false);
                    }

                } catch (e) {}

            }, intervalo);
        });
    };


    // ============================================================
    // APAGA TODOS OS MODAL-BACKDROP EM MASSA
    // Executado somente após o último exame ser preenchido
    // ============================================================

    function apagarTodosBackdrops(documentoInicial = document) {

        let total = 0;
        const documentosVisitados = new Set();

        function limparDocumento(doc) {

            if (!doc || documentosVisitados.has(doc)) {
                return;
            }

            documentosVisitados.add(doc);

            try {

                // Apaga TODOS os elementos iguais a:
                // <div class="modal-backdrop fade"></div>
                // Também pega o mesmo elemento caso tenha classes extras.
                const backdrops =
                    doc.querySelectorAll("div.modal-backdrop.fade");

                backdrops.forEach(el => {

                    console.log(
                        "[AUTOMATIZADOR] Apagando backdrop:",
                        el
                    );

                    el.remove();
                    total++;
                });

                // Procura também dentro dos iframes acessíveis.
                const frames = doc.querySelectorAll("iframe");

                for (const frame of frames) {

                    try {

                        const docFrame =
                            frame.contentDocument ||
                            frame.contentWindow?.document;

                        if (docFrame) {
                            limparDocumento(docFrame);
                        }

                    } catch (e) {
                        // iframe de outro domínio: ignorar
                    }
                }

            } catch (e) {}
        }

        // Documento onde o script está rodando.
        limparDocumento(documentoInicial);

        // Também tenta subir até o documento principal, caso o script
        // esteja sendo executado dentro de um iframe.
        try {
            let janela = documentoInicial.defaultView;

            while (janela && janela.parent && janela.parent !== janela) {
                janela = janela.parent;
                limparDocumento(janela.document);
            }
        } catch (e) {}

        return total;
    }


    // ============================================================
    // PROCURA ELEMENTO EM DOCUMENTO + IFRAMES
    // ============================================================

    function procurarEmFrames(seletor, documento = document) {

        // Procura no documento atual
        const elemento = documento.querySelector(seletor);

        if (elemento) {
            return elemento;
        }

        // Procura dentro dos iframes
        const frames = documento.querySelectorAll("iframe");

        for (const frame of frames) {

            try {

                const docFrame =
                    frame.contentDocument ||
                    frame.contentWindow.document;

                if (!docFrame) continue;

                const encontrado =
                    procurarEmFrames(seletor, docFrame);

                if (encontrado) {
                    return encontrado;
                }

            } catch (e) {
                // iframe de outro domínio: ignorar
            }
        }

        return null;
    }


    // ============================================================
    // PROCURA O BOTÃO
    // ============================================================

    function localizarBotaoAdicionar() {

        console.log(
            "[AUTOMATIZADOR] Procurando botão..."
        );

        // --------------------------------------------------------
        // ID EXATO
        // --------------------------------------------------------

        let botao =
            procurarEmFrames("#button2");

        if (botao) {

            console.log(
                "[AUTOMATIZADOR] Botão encontrado pelo ID:",
                botao
            );

            return botao;
        }


        // --------------------------------------------------------
        // NAME
        // --------------------------------------------------------

        botao =
            procurarEmFrames(
                'input[name="button2"]'
            );

        if (botao) {

            console.log(
                "[AUTOMATIZADOR] Botão encontrado pelo NAME:",
                botao
            );

            return botao;
        }


        // --------------------------------------------------------
        // VALOR
        // --------------------------------------------------------

        const documentos = [document];

        // Coleta documentos dos iframes acessíveis
        function coletarFrames(doc) {

            const frames =
                doc.querySelectorAll("iframe");

            for (const frame of frames) {

                try {

                    const docFrame =
                        frame.contentDocument ||
                        frame.contentWindow.document;

                    if (docFrame) {

                        documentos.push(docFrame);

                        coletarFrames(docFrame);
                    }

                } catch (e) {}
            }
        }

        coletarFrames(document);


        for (const doc of documentos) {

            const elementos =
                doc.querySelectorAll(
                    'input[type="button"], button'
                );

            for (const elemento of elementos) {

                const texto =
                    (
                        elemento.value ||
                        elemento.textContent ||
                        ""
                    ).trim();

                if (
                    texto ===
                    "Adicionar Procedimento/Serviço"
                ) {

                    console.log(
                        "[AUTOMATIZADOR] Botão encontrado pelo texto:",
                        elemento
                    );

                    return elemento;
                }
            }
        }


        return null;
    }


    // ============================================================
    // LOCALIZA CAMPO DE CÓDIGO
    // ============================================================

    function localizarCampoCodigo(numero) {

        return procurarEmFrames(
            `#item_medico_${numero}`
        ) || procurarEmFrames(
            `input[name="item_medico_${numero}"]`
        );
    }


    // ============================================================
    // LOCALIZA DESCRIÇÃO
    // ============================================================

    function localizarDescricao(numero) {

        return procurarEmFrames(
            `#nome_item_proc_${numero}`
        ) || procurarEmFrames(
            `input[name="nome_item_proc_${numero}"]`
        );
    }


    // ============================================================
    // LÊ DESCRIÇÃO
    // ============================================================

    function obterDescricao(numero) {

        const campo =
            localizarDescricao(numero);

        if (!campo) {
            return "";
        }

        return (
            campo.value ||
            ""
        ).trim();
    }


    // ============================================================
    // COLOCA VALOR NO INPUT
    // ============================================================

    function colocarValor(campo, valor) {

        campo.focus();

        const setter =
            Object.getOwnPropertyDescriptor(
                HTMLInputElement.prototype,
                "value"
            )?.set;

        if (setter) {
            setter.call(campo, valor);
        } else {
            campo.value = valor;
        }

        // INPUT
        campo.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );

        // CHANGE
        campo.dispatchEvent(
            new Event("change", {
                bubbles: true
            })
        );

        // KEYUP
        campo.dispatchEvent(
            new KeyboardEvent("keyup", {
                bubbles: true,
                key: "Enter",
                code: "Enter"
            })
        );

        // BLUR
        campo.blur();
    }


    // ============================================================
    // INTERFACE
    // ============================================================

    const antigo =
        document.getElementById(
            "__auto_proc"
        );

    if (antigo) {
        antigo.remove();
    }


    const fundo =
        document.createElement("div");

    fundo.id =
        "__auto_proc";

    fundo.style.cssText = `
        position:fixed;
        inset:0;
        z-index:9999999;
        background:rgba(0,0,0,.55);
        display:flex;
        align-items:center;
        justify-content:center;
        font-family:Arial,sans-serif;
    `;


    const caixa =
        document.createElement("div");

    caixa.style.cssText = `
        width:600px;
        max-width:90%;
        background:white;
        padding:20px;
        border-radius:10px;
        box-shadow:0 10px 40px rgba(0,0,0,.4);
    `;


    caixa.innerHTML = `
        <h2 style="margin-top:0">
            Automatizar Procedimentos
        </h2>

        <div style="margin-bottom:8px">
            Cole os códigos abaixo,
            <b>um código por linha</b>:
        </div>

        <textarea
            id="__auto_codigos"
            style="
                width:100%;
                height:220px;
                box-sizing:border-box;
                resize:vertical;
                padding:10px;
                font-family:monospace;
                font-size:14px;
            "
            placeholder="4030XXXX
4030YYYY
4030ZZZZ"></textarea>

        <div
            id="__auto_status"
            style="
                margin-top:12px;
                min-height:22px;
                font-size:13px;
            "
        ></div>

        <div style="
            display:flex;
            justify-content:flex-end;
            gap:10px;
            margin-top:15px;
        ">
            <button
                id="__auto_cancelar"
                style="
                    padding:9px 18px;
                    cursor:pointer;
                "
            >
                Cancelar
            </button>

            <button
                id="__auto_iniciar"
                style="
                    padding:9px 20px;
                    cursor:pointer;
                    background:#0d6efd;
                    color:white;
                    border:0;
                    border-radius:4px;
                    font-weight:bold;
                "
            >
                Iniciar
            </button>
        </div>
    `;

    fundo.appendChild(caixa);

    document.body.appendChild(fundo);


    const textarea =
        document.getElementById(
            "__auto_codigos"
        );

    const status =
        document.getElementById(
            "__auto_status"
        );

    const iniciar =
        document.getElementById(
            "__auto_iniciar"
        );

    const cancelar =
        document.getElementById(
            "__auto_cancelar"
        );


    textarea.focus();


    cancelar.onclick = () => {
        fundo.remove();
    };


    // ============================================================
    // INICIAR
    // ============================================================

    iniciar.onclick = async () => {

        try {

            iniciar.disabled = true;
            cancelar.disabled = true;

            // ----------------------------------------------------
            // PEGA CÓDIGOS
            // ----------------------------------------------------

            const codigos =
                textarea.value
                    .split(/\r?\n/)
                    .map(x => x.trim())
                    .filter(Boolean);


            if (!codigos.length) {
                throw new Error(
                    "Nenhum código foi informado."
                );
            }


            console.log(
                "[AUTOMATIZADOR] Códigos:",
                codigos
            );


            // ----------------------------------------------------
            // LOCALIZA BOTÃO
            // ----------------------------------------------------

            status.textContent =
                "Localizando botão Adicionar Procedimento/Serviço...";


            const botao =
                localizarBotaoAdicionar();


            // ----------------------------------------------------
            // VERIFICA SE A FUNÇÃO EXISTE
            // ----------------------------------------------------

            let funcaoAdicionar = null;

            try {

                if (
                    typeof window.IncluirProcedimento ===
                    "function"
                ) {
                    funcaoAdicionar =
                        window.IncluirProcedimento;
                }

            } catch (e) {}


            if (!botao && !funcaoAdicionar) {

                throw new Error(
                    "Não consegui encontrar o botão #button2 nem a função IncluirProcedimento()."
                );
            }


            console.log(
                "[AUTOMATIZADOR] Botão:",
                botao
            );

            console.log(
                "[AUTOMATIZADOR] Função IncluirProcedimento:",
                !!funcaoAdicionar
            );


            // ----------------------------------------------------
            // CRIA AS LINHAS
            // ----------------------------------------------------

            for (
                let i = 1;
                i <= codigos.length;
                i++
            ) {

                status.textContent =
                    `Criando linha ${i} de ${codigos.length}...`;


                // Se a linha já existir,
                // não cria outra.
                if (
                    localizarCampoCodigo(i)
                ) {

                    console.log(
                        `[AUTOMATIZADOR] Linha ${i} já existe.`
                    );

                } else {

                    // --------------------------------------------
                    // PRIMEIRA OPÇÃO:
                    // função interna da página
                    // --------------------------------------------

                    if (funcaoAdicionar) {

                        console.log(
                            `[AUTOMATIZADOR] Executando IncluirProcedimento('S') para linha ${i}`
                        );

                        funcaoAdicionar("S");

                    }

                    // --------------------------------------------
                    // SEGUNDA OPÇÃO:
                    // botão
                    // --------------------------------------------

                    else if (botao) {

                        console.log(
                            `[AUTOMATIZADOR] Clicando botão para linha ${i}`
                        );

                        botao.click();

                    }


                    // --------------------------------------------
                    // ESPERA A LINHA EXISTIR
                    // --------------------------------------------

                    const campo =
                        await esperar(
                            () =>
                                localizarCampoCodigo(i),
                            CONFIG.timeoutLinha,
                            CONFIG.intervalo
                        );


                    if (!campo) {

                        throw new Error(
                            `A linha ${i} não apareceu.`
                        );
                    }
                }

                await dormir(150);
            }


            // ----------------------------------------------------
            // TODAS AS LINHAS EXISTEM
            // ----------------------------------------------------

            console.log(
                "[AUTOMATIZADOR] Todas as linhas foram criadas."
            );


            // ----------------------------------------------------
            // PREENCHER CÓDIGOS
            // ----------------------------------------------------

            for (
                let i = 0;
                i < codigos.length;
                i++
            ) {

                const numero =
                    i + 1;

                const codigo =
                    codigos[i];


                status.textContent =
                    `Linha ${numero}/${codigos.length}: colocando ${codigo}...`;


                // --------------------------------------------
                // ESPERA CAMPO
                // --------------------------------------------

                const campo =
                    await esperar(
                        () =>
                            localizarCampoCodigo(numero),
                        CONFIG.timeoutLinha,
                        CONFIG.intervalo
                    );


                if (!campo) {

                    throw new Error(
                        `Campo item_medico_${numero} não encontrado.`
                    );
                }


                // --------------------------------------------
                // GUARDA DESCRIÇÃO ANTERIOR
                // --------------------------------------------

                const descricao =
                    localizarDescricao(numero);


                const descricaoAntes =
                    descricao
                        ? descricao.value
                        : "";


                // --------------------------------------------
                // COLOCA CÓDIGO
                // --------------------------------------------

                colocarValor(
                    campo,
                    codigo
                );


                // ------------------------------------------------
                // IMPORTANTE:
                //
                // O HTML original mostra:
                //
                // onchange="
                // this.value=Trim(this.value);
                // CarregaGridProcedimento(1);
                // "
                //
                // Portanto tentamos executar a função diretamente.
                // ------------------------------------------------

                try {

                    if (
                        typeof window.CarregaGridProcedimento ===
                        "function"
                    ) {

                        window.CarregaGridProcedimento(
                            numero
                        );

                    }

                } catch (e) {

                    console.warn(
                        "Não foi possível chamar CarregaGridProcedimento diretamente:",
                        e
                    );
                }


                // ------------------------------------------------
                // ESPERA DESCRIÇÃO
                // ------------------------------------------------

                status.textContent =
                    `Linha ${numero}/${codigos.length}: aguardando descrição...`;


                const sucesso =
                    await esperar(
                        () => {

                            const atual =
                                obterDescricao(numero);

                            return (
                                atual.length > 0 &&
                                atual !==
                                    String(
                                        descricaoAntes || ""
                                    ).trim()
                            );

                        },
                        CONFIG.timeoutDescricao,
                        CONFIG.intervalo
                    );


                if (!sucesso) {

                    throw new Error(
                        `A descrição da linha ${numero} não apareceu.\n\n` +
                        `Código: ${codigo}\n` +
                        `Campo: nome_item_proc_${numero}`
                    );
                }


                const descricaoFinal =
                    obterDescricao(numero);


                console.log(
                    `[AUTOMATIZADOR] Linha ${numero}:`,
                    codigo,
                    "→",
                    descricaoFinal
                );


                status.innerHTML =
                    `Linha <b>${numero}/${codigos.length}</b> OK — ` +
                    `${codigo} → ${descricaoFinal}`;


                // Pequena pausa antes do próximo
                await dormir(200);
            }


            // ============================================================
            // TODOS OS EXAMES FORAM PREENCHIDOS
            // APAGA EM MASSA TODOS OS <div class="modal-backdrop fade">
            // ============================================================

            status.textContent =
                "Último exame concluído. Removendo bloqueios da página...";

            // Três varreduras rápidas para pegar também backdrops
            // que o Bootstrap crie com alguns milissegundos de atraso.
            await dormir(30);
            let removidos = apagarTodosBackdrops();

            await dormir(70);
            removidos += apagarTodosBackdrops();

            await dormir(150);
            removidos += apagarTodosBackdrops();

            console.log(
                `[AUTOMATIZADOR] ${removidos} backdrop(s) removido(s) em massa.`
            );


            // ------------------------------------------------------------
            // FINAL
            // ------------------------------------------------------------

            status.innerHTML = `
                <span style="
                    color:#198754;
                    font-weight:bold;
                    font-size:15px;
                ">
                    ✓ Concluído com sucesso!
                </span>
                <br>
                <span style="font-size:13px;">
                    ${codigos.length} código(s) processado(s).
                </span>
            `;

            // Guarda o container dos botões
            const containerBotoes = iniciar.parentElement;

            // Remove os botões antigos
            iniciar.remove();
            cancelar.remove();

            // Cria somente o botão CONCLUIR
            const concluir = document.createElement("button");

            concluir.textContent = "Concluir";

            concluir.style.cssText = `
                padding:10px 28px;
                cursor:pointer;
                background:#198754;
                color:white;
                border:none;
                border-radius:5px;
                font-weight:bold;
                font-size:14px;
            `;

            // Fecha o painel
            concluir.onclick = () => {
                fundo.remove();
            };

            // Coloca o único botão restante
            containerBotoes.appendChild(concluir);

            console.log(
                `[AUTOMATIZADOR] FINALIZADO — ${codigos.length} códigos processados.`
            );

        } catch (erro) {

            console.error(
                "[AUTOMATIZADOR] ERRO:",
                erro
            );

            status.innerHTML = `
                <span style="
                    color:#dc3545;
                    font-weight:bold;
                    font-size:15px;
                ">
                    ✗ Erro
                </span>

                <br><br>

                <pre style="
                    white-space:pre-wrap;
                    font-family:Arial;
                    font-size:12px;
                    color:#333;
                ">${String(
                    erro.message || erro
                )}</pre>
            `;

            iniciar.disabled = false;
            cancelar.disabled = false;
        }

    };

})();
