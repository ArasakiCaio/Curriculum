(() => {
    const main = document.getElementById('main-content');
    if(!main) return;

    const buttonPTBR = document.getElementById('button-ptbr');
    const buttonEN = document.getElementById('button-en');

    const originalHTML = main.innerHTML;
    const originalTitle = document.title

    async function loadFile(file) {
        try {
            const res = await fetch(file, { cache: 'no-store'});
            if (!res.ok) throw new Error('Falha ao carregar ' + file);
            const text = await res.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');

            const newMain = doc.getElementById('main-content');
            main.innerHTML = newMain ? newMain.innerHTML : doc.body.innerHTML;

            if (doc.title) document.title = doc.title;

            buttonPTBR && buttonPTBR.setAttribute('aria-pressed', String(file ==="index.html"));
            buttonEN && buttonEN.setAttribute('aria-pressed', String(file === 'index_en.html'));
        } catch (err) {
            console.error(err);
            alert('Não foi possível carregar a versão traduzida');
        }
    }

    buttonEN && buttonEN.addEventListener('click', (e) => {
        e.preventDefault();
        loadFile(buttonEN.dataset.file);
    })

    buttonPTBR && buttonPTBR.addEventListener('click', (e) => {
        e.preventDefault();
        main.innerHTML = originalHTML;
        document.title = originalTitle;
        buttonPTBR.setAttribute('aria-pressed', 'true');
        buttonEN.setAttribute('aria-pressed', 'false');
        history.pushState({ lang: 'index' }, '', '?lang=pt');
    });

    window.addEventListener('popstate', (ev) => {
        const state = ev.state;
        if (!state) {
            main.innerHTML = originalHTML;
            document.title = originalTitle;
            buttonPTBR.setAttribute('aria-pressed', 'true');
            buttonEN.setAttribute('aria-pressed', 'false');
            return;
        }
        if (state.lang === 'index_en.html') loadFile('index_en.html');
        else {
            main.innerHTML = originalHTML;
            document.title = originalTitle;
            buttonPTBR.setAttribute('aria-pressed', 'true');
            buttonEN.setAttribute('aria-pressed', 'false');
        }
    })
    
})();