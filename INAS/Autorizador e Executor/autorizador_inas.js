(async () => {

    console.clear();
    console.log('%c=== AUTOMACAO DE PROCEDIMENTOS ===', 'font-weight:bold;font-size:16px');

    // ============================================================
    // CONFIGURAÇÕES
    // ============================================================

    const TABELA = '22 - Procedimentos e eventos em saúde';
    const MAX_TENTATIVAS = 3;


    // ============================================================
    // UTILITÁRIOS
    // ============================================================

    const sleep = ms =>
        new Promise(resolve => setTimeout(resolve, ms));


    async function esperar(condicao, timeout = 10000, intervalo = 100) {

        const inicio = Date.now();

        while (Date.now() - inicio < timeout) {

            try {

                const resultado = condicao();

                if (resultado) {
                    return resultado;
                }

            } catch (e) {}

            await sleep(intervalo);
        }

        return null;
    }


    function texto(el) {
        return (el?.textContent || '')
            .replace(/\s+/g, ' ')
            .trim();
    }


    function clicar(el) {

        if (!el) return false;

        el.scrollIntoView({
            block: 'center',
            inline: 'nearest'
        });

        el.focus?.();

        el.dispatchEvent(
            new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window
            })
        );

        el.dispatchEvent(
            new MouseEvent('mouseup', {
                bubbles: true,
                cancelable: true,
                view: window
            })
        );

        el.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            })
        );

        return true;
    }


    // ============================================================
    // ENCONTRAR O CONTAINER PELO LABEL
    // ============================================================

    function encontrarContainer(labelTexto) {

        const label = [
            ...document.querySelectorAll('label')
        ].find(l =>
            texto(l).replace('*', '').trim() === labelTexto
        );

        return label?.parentElement || null;
    }


    // ============================================================
    // ENCONTRAR INPUT DO REACT-SELECT PELO LABEL
    //
    // NÃO USA ID.
    // ============================================================

    function encontrarInputSelect(labelTexto) {

        const container =
            encontrarContainer(labelTexto);

        if (!container) return null;

        return container.querySelector(
            'input[role="combobox"]'
        );
    }


    // ============================================================
    // ABRIR SELECT
    // ============================================================

    async function abrirSelect(input) {

        if (!input) return false;

        input.focus();

        // Clique no próprio input.

        clicar(input);

        await sleep(100);

        // Clique no indicador desse mesmo container.

        const container =
            input.closest('.css-b62m3t-container') ||
            input.closest('.css-1lejura')?.parentElement;


        const indicador =
            container?.querySelector(
                '.css-1xc3v61-indicatorContainer'
            );


        if (indicador) {

            clicar(indicador);

        }


        // Tenta também abrir via ArrowDown.

        input.dispatchEvent(
            new KeyboardEvent('keydown', {
                key: 'ArrowDown',
                code: 'ArrowDown',
                keyCode: 40,
                which: 40,
                bubbles: true
            })
        );


        return !!(
            await esperar(
                () =>
                    document.querySelector(
                        '[role="listbox"]'
                    ),
                3000,
                100
            )
        );

    }


    // ============================================================
    // SELECIONAR TABELA 22
    // ============================================================

    async function selecionarTabela22() {

        const atual =
            [
                ...document.querySelectorAll(
                    '.css-1o0507n-singleValue'
                )
            ].some(el =>
                texto(el) === TABELA
            );


        if (atual) {

            console.log('✓ Tabela 22 já selecionada.');

            return true;
        }


        console.log('Abrindo campo Tabela...');


        const input =
            encontrarInputSelect('Tabela');


        if (!input) {

            console.error(
                '✗ Não encontrei o campo "Tabela".'
            );

            return false;
        }


        console.log('Campo Tabela encontrado:', input);


        for (let tentativa = 1; tentativa <= 3; tentativa++) {

            console.log(
                `Tabela 22: tentativa ${tentativa}/3`
            );


            await abrirSelect(input);


            const opcao =
                await esperar(() => {

                    const opcoes = [
                        ...document.querySelectorAll(
                            '[role="option"]'
                        )
                    ];


                    return opcoes.find(el =>
                        texto(el) === TABELA
                    );

                }, 5000, 100);


            if (!opcao) {

                console.warn(
                    'Opção da Tabela 22 não apareceu.'
                );

                // Fecha/reabre.

                input.focus();

                clicar(input);

                await sleep(300);

                continue;
            }


            console.log(
                '✓ Opção encontrada:',
                texto(opcao)
            );


            opcao.click();


            const confirmou =
                await esperar(
                    () =>
                        [
                            ...document.querySelectorAll(
                                '.css-1o0507n-singleValue'
                            )
                        ].some(el =>
                            texto(el) === TABELA
                        ),
                    3000,
                    100
                );


            if (confirmou) {

                console.log(
                    '✓ Tabela 22 selecionada.'
                );

                return true;
            }

        }


        console.error(
            '✗ Não foi possível selecionar Tabela 22.'
        );

        return false;

    }


    // ============================================================
    // ENCONTRAR CAMPO "CÓDIGO E DESCRIÇÃO"
    // ============================================================

    function encontrarCampoCodigo() {

        const labels = [
            ...document.querySelectorAll('label')
        ];


        const label = labels.find(l =>
            texto(l)
                .toLowerCase()
                .includes('código e descrição')
        );


        if (!label) return null;


        return label.parentElement?.querySelector(
            'input[role="combobox"]'
        ) || null;

    }


    // ============================================================
    // ALTERAR VALOR DE INPUT CONTROLADO PELO REACT
    // ============================================================

    function alterarValorReact(input, valor) {

        const setter =
            Object.getOwnPropertyDescriptor(
                HTMLInputElement.prototype,
                'value'
            ).set;


        setter.call(input, valor);


        input.dispatchEvent(
            new Event('input', {
                bubbles: true
            })
        );


        input.dispatchEvent(
            new Event('change', {
                bubbles: true
            })
        );

    }


    // ============================================================
    // PREENCHER CÓDIGO
    // ============================================================

    async function preencherCodigo(codigo) {

        const campo =
            encontrarCampoCodigo();


        if (!campo) {

            console.error(
                '✗ Campo "Código e descrição" não encontrado.'
            );

            return false;
        }


        console.log(
            `Digitando código: ${codigo}`
        );


        campo.focus();


        // Limpa.

        alterarValorReact(
            campo,
            ''
        );


        await sleep(100);


        // Coloca o código.

        alterarValorReact(
            campo,
            codigo
        );


        // Eventos adicionais usados pelo React Select.

        campo.dispatchEvent(
            new InputEvent('input', {
                bubbles: true,
                data: codigo,
                inputType: 'insertText'
            })
        );


        await sleep(500);


        return true;

    }


    // ============================================================
    // SELECIONAR RESULTADO DO CÓDIGO
    // ============================================================

    async function selecionarResultadoCodigo(codigo) {

        const opcao =
            await esperar(() => {

                const opcoes = [
                    ...document.querySelectorAll(
                        '[role="option"]'
                    )
                ];


                return opcoes.find(el => {

                    const t =
                        texto(el);

                    return (
                        t === codigo ||
                        t.startsWith(codigo + ' ') ||
                        t.startsWith(codigo + '-') ||
                        t.startsWith(codigo + ' -')
                    );

                });

            }, 8000, 100);


        if (!opcao) {

            console.error(
                `✗ Resultado do código ${codigo} não encontrado.`
            );

            return false;
        }


        console.log(
            '✓ Resultado encontrado:',
            texto(opcao)
        );


        opcao.click();


        return true;

    }


    // ============================================================
    // ENCONTRAR CAMPO DE QUANTIDADE
    // ============================================================

    function encontrarCampoQuantidade() {

        const label = [
            ...document.querySelectorAll('label')
        ].find(l =>
            texto(l)
                .replace('*', '')
                .trim()
                .toLowerCase() === 'quantidade'
        );


        return label
            ?.parentElement
            ?.querySelector(
                'input[type="number"]'
            ) || null;

    }


    // ============================================================
    // DEFINIR QUANTIDADE
    // ============================================================

    async function definirQuantidade(valor) {

        const campo =
            await esperar(
                encontrarCampoQuantidade,
                5000,
                100
            );


        if (!campo) {

            console.error(
                '✗ Campo Quantidade não encontrado.'
            );

            return false;
        }


        console.log(
            `Quantidade: ${valor}`
        );


        alterarValorReact(
            campo,
            String(valor)
        );


        campo.dispatchEvent(
            new Event('blur', {
                bubbles: true
            })
        );


        await sleep(150);


        return true;

    }


    // ============================================================
    // BOTÃO ADICIONAR
    // ============================================================

    async function clicarAdicionar() {

        const botao =
            await esperar(
                () => {

                    const b =
                        document.querySelector(
                            'button.button-add'
                        );


                    if (!b) return null;


                    // O site inicialmente deixa disabled.
                    // Esperamos ele ficar habilitado.

                    if (b.disabled) {
                        return null;
                    }


                    return b;

                },
                5000,
                100
            );


        if (!botao) {

            console.error(
                '✗ Botão Adicionar continua desabilitado.'
            );

            return false;
        }


        console.log(
            '✓ Botão Adicionar habilitado.'
        );


        clicar(botao);


        await sleep(500);


        return true;

    }


    // ============================================================
    // LER TABELA DE CÓDIGOS CADASTRADOS
    // ============================================================

    function lerItensTabela() {

        const resultado = {};


        document
            .querySelectorAll('tbody tr')
            .forEach(tr => {

                const codigo =
                    texto(
                        tr.querySelector(
                            'td.first-column'
                        )
                    );


                const quantidadeTexto =
                    texto(
                        tr.querySelector(
                            'td:nth-child(3)'
                        )
                    );


                if (!codigo) return;


                const quantidade =
                    Number(
                        quantidadeTexto
                            .replace(',', '.')
                    );


                resultado[codigo] =
                    (resultado[codigo] || 0) +
                    (
                        Number.isFinite(quantidade)
                            ? quantidade
                            : 1
                    );

            });


        return resultado;

    }


    // ============================================================
    // CALCULAR PENDENTES
    // ============================================================

    function obterPendentes() {

        const cadastrados =
            lerItensTabela();


        const pendentes = {};


        for (const codigo of codigos) {

            const solicitado =
                mapaQuantidades[codigo];


            const atual =
                cadastrados[codigo] || 0;


            const falta =
                solicitado - atual;


            if (falta > 0) {

                pendentes[codigo] =
                    falta;

            }

        }


        return pendentes;

    }


    // ============================================================
    // MOSTRAR CONFERÊNCIA
    // ============================================================

    function mostrarConferencia() {

        const cadastrados =
            lerItensTabela();


        console.table(
            codigos.map(codigo => {

                const solicitado =
                    mapaQuantidades[codigo];


                const cadastrado =
                    cadastrados[codigo] || 0;


                return {

                    Codigo: codigo,

                    Solicitado:
                        solicitado,

                    Cadastrado:
                        cadastrado,

                    Falta:
                        Math.max(
                            0,
                            solicitado -
                            cadastrado
                        )

                };

            })
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
            `%c→ ${codigo} | quantidade ${quantidade}`,
            'font-weight:bold'
        );


        // Tabela precisa estar selecionada.

        if (!(await selecionarTabela22())) {

            return false;
        }


        // Campo Código e descrição.

        if (!(await preencherCodigo(codigo))) {

            return false;
        }


        // Selecionar resultado.

        if (
            !(await selecionarResultadoCodigo(codigo))
        ) {

            return false;
        }


        // Quantidade.

        if (
            !(await definirQuantidade(quantidade))
        ) {

            return false;
        }


        // Adicionar.

        if (
            !(await clicarAdicionar())
        ) {

            return false;
        }


        // Espera tabela atualizar.

        await sleep(700);


        return true;

    }


    // ============================================================
    // RECEBER CÓDIGOS
    // ============================================================

    const entrada =
        prompt(
            'Cole os códigos dos exames:\n\n' +
            'Pode colocar um por linha ou separados por espaço, vírgula ou ponto e vírgula.'
        );


    if (!entrada) {

        console.log(
            'Automação cancelada.'
        );

        return;

    }


    // ============================================================
    // PROCESSAR CÓDIGOS
    // ============================================================

    const listaCodigos =
        entrada
            .split(/[\s,;]+/)
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

            codigos.push(codigo);

            mapaQuantidades[codigo] = 0;

        }


        mapaQuantidades[codigo]++;

    }


    console.log(
        '=========================================='
    );

    console.log(
        'CÓDIGOS RECEBIDOS:'
    );

    console.table(
        codigos.map(codigo => ({
            Codigo: codigo,
            Quantidade: mapaQuantidades[codigo]
        }))
    );


    // ============================================================
    // SELECIONAR TABELA
    // ============================================================

    if (!(await selecionarTabela22())) {

        alert(
            'Não consegui selecionar a Tabela 22.\n\n' +
            'Veja o Console para identificar o problema.'
        );

        return;

    }


    // ============================================================
    // VERIFICAR O QUE JÁ EXISTE
    // ============================================================

    let pendentes =
        obterPendentes();


    console.log(
        'PENDENTES ANTES DA INSERÇÃO:'
    );

    console.table(pendentes);


    // ============================================================
    // PROCESSAR
    // ============================================================

    for (
        let tentativa = 1;
        tentativa <= MAX_TENTATIVAS &&
        Object.keys(pendentes).length > 0;
        tentativa++
    ) {

        console.log(
            '=========================================='
        );

        console.log(
            `TENTATIVA ${tentativa}/${MAX_TENTATIVAS}`
        );


        // Sempre respeita a ordem original.

        for (const codigo of codigos) {

            const quantidade =
                pendentes[codigo];


            if (!quantidade) {

                continue;

            }


            try {

                const sucesso =
                    await inserirCodigo(
                        codigo,
                        quantidade
                    );


                if (!sucesso) {

                    console.warn(
                        `Não foi possível inserir ${codigo}.`
                    );

                }


            } catch (erro) {

                console.error(
                    `Erro em ${codigo}:`,
                    erro
                );

            }

        }


        // ========================================================
        // CONFERÊNCIA
        // ========================================================

        await sleep(700);


        pendentes =
            obterPendentes();


        console.log(
            `CONFERÊNCIA APÓS TENTATIVA ${tentativa}`
        );


        mostrarConferencia();

    }


    // ============================================================
    // CONFERÊNCIA FINAL
    // ============================================================

    const faltantes =
        obterPendentes();


    console.log(
        '=========================================='
    );

    console.log(
        'CONFERÊNCIA FINAL'
    );


    mostrarConferencia();


    if (
        Object.keys(faltantes).length === 0
    ) {

        console.log(
            '%c✓ TODOS OS CÓDIGOS ESTÃO CORRETOS.',
            'color:green;font-weight:bold;font-size:15px'
        );


        alert(
            'FINALIZADO!\n\n' +
            'Todos os códigos foram cadastrados ' +
            'nas quantidades corretas.'
        );


    } else {

        console.warn(
            'AINDA FALTAM:',
            faltantes
        );


        alert(
            'Atenção!\n\n' +
            'Ainda existem códigos pendentes:\n\n' +
            Object.entries(faltantes)
                .map(
                    ([codigo, qtd]) =>
                        `${codigo} → faltam ${qtd}`
                )
                .join('\n')
        );

    }

})();
