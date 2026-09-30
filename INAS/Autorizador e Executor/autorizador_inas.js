```javascript
(async () => {

    // ============================================================
    // CONFIGURAÇÕES / FUNÇÕES AUXILIARES
    // ============================================================

    const TEXTO_TABELA = '22 - Procedimentos e eventos em saúde';

    const esperar = (
        condicao,
        timeout = 10000,
        intervalo = 100
    ) =>
        new Promise(resolve => {

            const inicio = Date.now();

            const timer = setInterval(() => {

                try {

                    if (condicao()) {
                        clearInterval(timer);
                        resolve(true);
                        return;
                    }

                    if (Date.now() - inicio >= timeout) {
                        clearInterval(timer);
                        resolve(false);
                    }

                } catch (e) {}

            }, intervalo);

        });


    const esperarElemento = (
        condicao,
        timeout = 10000,
        intervalo = 100
    ) =>
        new Promise(resolve => {

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
                        resolve(null);
                    }

                } catch (e) {}

            }, intervalo);

        });


    function dispararClique(elemento) {

        if (!elemento) return false;

        ['mousedown', 'mouseup', 'click'].forEach(evt => {

            elemento.dispatchEvent(
                new MouseEvent(evt, {
                    bubbles: true,
                    cancelable: true,
                    view: window
                })
            );

        });

        return true;
    }


    // ============================================================
    // LOCALIZAR CAMPO DA TABELA
    // ============================================================

    async function localizarCampoTabela() {

        return await esperarElemento(() => {

            const labelTabela = [...document.querySelectorAll('label')]
                .find(l =>
                    l.textContent?.trim().includes('Tabela')
                );

            return labelTabela
                ?.parentElement
                ?.querySelector('input[role="combobox"]');

        }, 10000, 100);

    }


    // ============================================================
    // VERIFICAR SE A TABELA 22 JÁ ESTÁ SELECIONADA
    // ============================================================

    function tabela22Selecionada() {

        return [...document.querySelectorAll(
            '.css-1o0507n-singleValue'
        )]
            .some(el =>
                el.textContent?.trim() === TEXTO_TABELA
            );

    }


    // ============================================================
    // SELECIONAR TABELA 22
    // ============================================================

    async function selecionarTabela22() {

        // Se já estiver selecionada, não faz nada.

        if (tabela22Selecionada()) {

            console.log('Tabela 22 já está selecionada.');

            return true;
        }


        for (let tentativa = 1; tentativa <= 3; tentativa++) {

            console.log(
                `Selecionando Tabela 22 — tentativa ${tentativa}/3`
            );


            const campoTabela =
                await localizarCampoTabela();


            if (!campoTabela) {

                console.warn(
                    'Campo da Tabela não encontrado.'
                );

                continue;
            }


            campoTabela.focus();

            dispararClique(campoTabela);


            // Mantém o seletor que você já descobriu.

            const setaTabela =
                campoTabela
                    ?.closest('.css-1lejura')
                    ?.parentElement
                    ?.querySelector(
                        '.css-1xc3v61-indicatorContainer'
                    );


            if (setaTabela) {

                dispararClique(setaTabela);

            }


            // Espera a lista abrir.

            const listaAberta =
                await esperarElemento(
                    () =>
                        document.querySelector(
                            '[role="listbox"]'
                        ),
                    3000,
                    100
                );


            if (!listaAberta) {

                console.warn(
                    'Lista da Tabela não abriu.'
                );

                continue;
            }


            // Procura exatamente a opção 22.

            const opcao22 =
                await esperarElemento(() => {

                    const lista =
                        document.querySelector(
                            '[role="listbox"]'
                        );

                    if (!lista) return null;

                    return [
                        ...lista.querySelectorAll(
                            '[role="option"]'
                        )
                    ]
                        .find(el =>
                            el.textContent?.trim() ===
                            TEXTO_TABELA
                        );

                }, 8000, 100);


            if (!opcao22) {

                console.warn(
                    'Tabela 22 não encontrada.'
                );

                continue;
            }


            opcao22.click();


            // Confirma visualmente que a tabela mudou.

            const confirmou =
                await esperar(
                    () => tabela22Selecionada(),
                    3000,
                    100
                );


            if (confirmou) {

                console.log(
                    'Tabela 22 confirmada.'
                );

                return true;
            }


            console.warn(
                'Tabela 22 não foi confirmada.'
            );

        }


        console.error(
            'Não foi possível selecionar a Tabela 22.'
        );

        return false;

    }


    // ============================================================
    // LER CÓDIGOS JÁ CADASTRADOS NA TABELA
    // ============================================================

    function lerItensTabela() {

        const itens = {};


        document
            .querySelectorAll('tbody tr')
            .forEach(tr => {

                const codigo =
                    tr.querySelector(
                        'td.first-column'
                    )
                    ?.textContent
                    ?.trim();


                const quantidadeTexto =
                    tr.querySelector(
                        'td:nth-child(3)'
                    )
                    ?.textContent
                    ?.trim();


                if (!codigo) return;


                const quantidade =
                    Number(
                        quantidadeTexto
                            ?.replace(',', '.')
                    );


                const valorQuantidade =
                    Number.isFinite(quantidade)
                        ? quantidade
                        : 1;


                itens[codigo] =
                    (itens[codigo] || 0) +
                    valorQuantidade;

            });


        return itens;

    }


    // ============================================================
    // LOCALIZAR CAMPO "CÓDIGO E DESCRIÇÃO"
    // ============================================================

    async function localizarCampoProcedimento() {

        return await esperarElemento(() => {

            return [...document.querySelectorAll('label')]
                .find(l =>
                    l.textContent
                        ?.includes('Código e descrição')
                )
                ?.parentElement
                ?.querySelector(
                    'input[role="combobox"]'
                );

        }, 5000, 100);

    }


    // ============================================================
    // PREENCHER CÓDIGO
    // ============================================================

    async function preencherCodigo(codigo) {

        const campo =
            await localizarCampoProcedimento();


        if (!campo) {

            console.warn(
                `Campo de código não encontrado: ${codigo}`
            );

            return false;
        }


        const setter =
            Object.getOwnPropertyDescriptor(
                HTMLInputElement.prototype,
                'value'
            ).set;


        campo.focus();


        // Limpa o campo.

        setter.call(campo, '');

        campo.dispatchEvent(
            new Event('input', {
                bubbles: true
            })
        );


        // Insere o código.

        setter.call(
            campo,
            codigo
        );


        campo.dispatchEvent(
            new InputEvent('input', {
                bubbles: true,
                data: codigo,
                inputType: 'insertText'
            })
        );


        return true;

    }


    // ============================================================
    // SELECIONAR OPÇÃO DO CÓDIGO
    // ============================================================

    async function selecionarOpcaoCodigo(codigo) {

        const opcao =
            await esperarElemento(() => {

                const listbox =
                    document.querySelector(
                        '[role="listbox"]'
                    );


                if (!listbox) return null;


                return [
                    ...listbox.querySelectorAll(
                        '[role="option"]'
                    )
                ]
                    .find(el =>
                        el.textContent
                            ?.trim()
                            .startsWith(codigo)
                    );

            }, 8000, 100);


        if (!opcao) {

            console.warn(
                `Opção não encontrada para o código ${codigo}`
            );

            return false;
        }


        opcao.click();


        return true;

    }


    // ============================================================
    // DEFINIR QUANTIDADE
    // ============================================================

    async function definirQuantidade(valor) {

        const campoQuantidade =
            await esperarElemento(() => {

                return [...document.querySelectorAll('label')]
                    .find(l =>
                        l.textContent
                            ?.includes('Quantidade')
                    )
                    ?.parentElement
                    ?.querySelector(
                        'input[type="number"]'
                    );

            }, 5000, 100);


        if (!campoQuantidade) {

            console.warn(
                'Campo de quantidade não encontrado.'
            );

            return false;
        }


        const setter =
            Object.getOwnPropertyDescriptor(
                HTMLInputElement.prototype,
                'value'
            ).set;


        setter.call(
            campoQuantidade,
            String(valor)
        );


        ['input', 'change', 'blur'].forEach(evt => {

            campoQuantidade.dispatchEvent(
                new Event(evt, {
                    bubbles: true
                })
            );

        });


        return true;

    }


    // ============================================================
    // CLICAR NO BOTÃO ADICIONAR
    // ============================================================

    async function adicionarCodigo() {

        const botao =
            await esperarElemento(
                () =>
                    document.querySelector(
                        '.button-add'
                    ),
                5000,
                100
            );


        if (!botao) {

            console.warn(
                'Botão Adicionar não encontrado.'
            );

            return false;
        }


        botao.click();


        // Dá tempo para a tabela atualizar.

        await new Promise(
            resolve => setTimeout(resolve, 300)
        );


        return true;

    }


    // ============================================================
    // CALCULAR O QUE ESTÁ FALTANDO
    // ============================================================

    function obterPendentes(
        codigos,
        mapaQuantidades
    ) {

        const cadastrados =
            lerItensTabela();


        const pendentes = {};


        for (const codigo of codigos) {

            const solicitado =
                mapaQuantidades[codigo];


            const cadastrado =
                cadastrados[codigo] || 0;


            const faltante =
                solicitado - cadastrado;


            if (faltante > 0) {

                pendentes[codigo] =
                    faltante;

            }

        }


        return pendentes;

    }


    // ============================================================
    // MOSTRAR SITUAÇÃO ATUAL
    // ============================================================

    function exibirConferencia(
        codigos,
        mapaQuantidades
    ) {

        const cadastrados =
            lerItensTabela();


        console.table(
            codigos.map(codigo => ({

                Codigo: codigo,

                Solicitado:
                    mapaQuantidades[codigo],

                Cadastrado:
                    cadastrados[codigo] || 0,

                Falta:
                    Math.max(
                        0,
                        mapaQuantidades[codigo] -
                        (cadastrados[codigo] || 0)
                    )

            }))
        );

    }


    // ============================================================
    // INSERIR UM CÓDIGO
    // ============================================================

    async function inserirCodigo(
        codigo,
        quantidade
    ) {

        console.log(
            `Inserindo ${codigo} — quantidade ${quantidade}`
        );


        // Garante que a tabela 22 está selecionada.

        if (!(await selecionarTabela22())) {

            return false;
        }


        // Preenche o campo.

        if (!(await preencherCodigo(codigo))) {

            return false;
        }


        // Seleciona a opção encontrada.

        if (!(await selecionarOpcaoCodigo(codigo))) {

            return false;
        }


        // Aguarda o campo de quantidade.

        const campoQuantidade =
            await esperarElemento(
                () =>
                    [...document.querySelectorAll('label')]
                        .some(l =>
                            l.textContent
                                ?.includes('Quantidade') &&
                            l.parentElement
                                ?.querySelector(
                                    'input[type="number"]'
                                )
                        ),
                5000,
                100
            );


        if (!campoQuantidade) {

            console.warn(
                `Campo de quantidade não apareceu para ${codigo}`
            );

            return false;
        }


        // Define a quantidade.

        if (!(await definirQuantidade(quantidade))) {

            return false;
        }


        // Adiciona.

        if (!(await adicionarCodigo())) {

            return false;
        }


        console.log(
            `Código ${codigo} adicionado.`
        );


        return true;

    }


    // ============================================================
    // 1. RECEBER CÓDIGOS
    // ============================================================

    const entrada =
        prompt(
            'Cole os códigos dos exames:\n\n' +
            'Pode colar um por linha, separados por espaço, vírgula ou ponto e vírgula.'
        );


    if (!entrada) {

        alert(
            'Nenhum código informado.'
        );

        return;
    }


    // ============================================================
    // 2. PROCESSAR CÓDIGOS MANTENDO A ORDEM
    // ============================================================

    const listaCodigos =
        entrada
            .split(/[\s,;\n]+/)
            .map(c => c.trim())
            .filter(Boolean);


    if (!listaCodigos.length) {

        alert(
            'Nenhum código válido encontrado.'
        );

        return;
    }


    const mapaQuantidades = {};
    const codigos = [];


    for (const codigo of listaCodigos) {

        if (!(codigo in mapaQuantidades)) {

            // Guarda somente a primeira ocorrência.
            // Isso mantém a ordem original.

            codigos.push(codigo);

            mapaQuantidades[codigo] = 0;

        }


        mapaQuantidades[codigo]++;

    }


    console.log(
        '================================================'
    );

    console.log(
        'CÓDIGOS NA ORDEM ORIGINAL:'
    );

    console.log(codigos);


    console.log(
        'QUANTIDADES SOLICITADAS:'
    );

    console.table(mapaQuantidades);


    // ============================================================
    // 3. SELECIONAR TABELA 22
    // ============================================================

    console.log(
        'Selecionando Tabela 22...'
    );


    if (!(await selecionarTabela22())) {

        alert(
            'Não foi possível selecionar a Tabela 22.\n\n' +
            'Nenhum código foi inserido.'
        );

        return;
    }


    // ============================================================
    // 4. CONFERIR O QUE JÁ EXISTE
    // ============================================================

    console.log(
        'Conferindo códigos já cadastrados...'
    );


    let pendentes =
        obterPendentes(
            codigos,
            mapaQuantidades
        );


    exibirConferencia(
        codigos,
        mapaQuantidades
    );


    // ============================================================
    // 5. PRIMEIRA INSERÇÃO
    // ============================================================

    console.log(
        '================================================'
    );

    console.log(
        'INICIANDO PRIMEIRA INSERÇÃO'
    );


    for (const codigo of codigos) {

        const quantidade =
            pendentes[codigo];


        // Se já estiver completo,
        // não mexe nesse código.

        if (!quantidade) {

            console.log(
                `${codigo}: já está completo.`
            );

            continue;
        }


        try {

            await inserirCodigo(
                codigo,
                quantidade
            );

        } catch (erro) {

            console.error(
                `Erro ao inserir ${codigo}:`,
                erro
            );

        }

    }


    // ============================================================
    // 6. PRIMEIRA CONFERÊNCIA
    // ============================================================

    await new Promise(
        resolve => setTimeout(resolve, 500)
    );


    console.log(
        '================================================'
    );

    console.log(
        'PRIMEIRA CONFERÊNCIA'
    );


    pendentes =
        obterPendentes(
            codigos,
            mapaQuantidades
        );


    exibirConferencia(
        codigos,
        mapaQuantidades
    );


    // ============================================================
    // 7. RETENTATIVAS — SOMENTE FALTANTES
    // ============================================================

    const MAX_TENTATIVAS = 3;

    let tentativa = 1;


    while (
        Object.keys(pendentes).length &&
        tentativa <= MAX_TENTATIVAS
    ) {

        console.log(
            '================================================'
        );

        console.log(
            `RETENTATIVA ${tentativa}/${MAX_TENTATIVAS}`
        );


        console.table(pendentes);


        // IMPORTANTE:
        // só percorre os códigos que realmente faltaram.

        for (const codigo of codigos) {

            const quantidade =
                pendentes[codigo];


            if (!quantidade) continue;


            console.log(
                `Tentando novamente: ${codigo} — falta ${quantidade}`
            );


            try {

                await inserirCodigo(
                    codigo,
                    quantidade
                );

            } catch (erro) {

                console.error(
                    `Erro na retentativa de ${codigo}:`,
                    erro
                );

            }

        }


        // Aguarda atualização da tabela.

        await new Promise(
            resolve => setTimeout(resolve, 500)
        );


        // Nova conferência.

        pendentes =
            obterPendentes(
                codigos,
                mapaQuantidades
            );


        exibirConferencia(
            codigos,
            mapaQuantidades
        );


        tentativa++;

    }


    // ============================================================
    // 8. CONFERÊNCIA FINAL
    // ============================================================

    console.log(
        '================================================'
    );

    console.log(
        'CONFERÊNCIA FINAL'
    );


    const faltantesFinais =
        obterPendentes(
            codigos,
            mapaQuantidades
        );


    exibirConferencia(
        codigos,
        mapaQuantidades
    );


    // ============================================================
    // 9. RESULTADO
    // ============================================================

    if (
        Object.keys(faltantesFinais).length === 0
    ) {

        console.log(
            '================================================'
        );

        console.log(
            '✓ TODOS OS CÓDIGOS E QUANTIDADES ESTÃO CORRETOS.'
        );


        alert(
            'FINALIZADO!\n\n' +
            'Todos os códigos solicitados foram cadastrados ' +
            'nas quantidades corretas.'
        );


        return;

    }


    // Ainda existem pendências.

    console.warn(
        '================================================'
    );

    console.warn(
        'CÓDIGOS AINDA PENDENTES:',
        faltantesFinais
    );


    alert(
        'ATENÇÃO!\n\n' +
        'Alguns códigos ainda estão pendentes.\n\n' +
        Object.entries(faltantesFinais)
            .map(
                ([codigo, quantidade]) =>
                    `${codigo} → faltam ${quantidade}`
            )
            .join('\n') +
        '\n\n' +
        'Verifique a tabela.'
    );

})();
```
