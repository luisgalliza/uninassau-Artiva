// Respeita quem desativa animações no sistema
const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!semMovimento) {

    // ---------- FOGOS DE ARTIFÍCIO ----------
    const cores = ["#a15ee8", "#b889ff", "#7cff9b", "#ffffff"];

    function explosao(x, y) {
        for (let i = 0; i < 22; i++) {
            const faisca = document.createElement("div");
            const angulo = (Math.PI * 2 * i) / 22 + Math.random() * 0.4;
            const distancia = 50 + Math.random() * 70;

            faisca.className = "faisca";
            faisca.style.left = x + "px";
            faisca.style.top = y + "px";
            faisca.style.setProperty("--cor", cores[Math.floor(Math.random() * cores.length)]);
            faisca.style.setProperty("--dx", Math.cos(angulo) * distancia + "px");
            faisca.style.setProperty("--dy", Math.sin(angulo) * distancia + "px");

            document.body.appendChild(faisca);
            setTimeout(() => faisca.remove(), 1000);
        }
    }

    const destaque = document.querySelector(".inicio h1 span");
    let soltando = false;

    if (destaque) {
        destaque.addEventListener("mouseenter", () => {
            if (soltando) return;
            soltando = true;

            const area = destaque.getBoundingClientRect();
            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    explosao(
                        area.left + Math.random() * area.width,
                        area.top + Math.random() * area.height
                    );
                }, i * 180);
            }
            setTimeout(() => (soltando = false), 1400);
        });
    }

    // ---------- BRILHO QUE SEGUE O MOUSE ----------
    const brilho = document.createElement("div");
    brilho.className = "brilho-mouse";
    document.body.appendChild(brilho);

    window.addEventListener("mousemove", (e) => {
        brilho.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    // ---------- CARDS INCLINAM COM O MOUSE ----------
    document.querySelectorAll(".card-lista, .card-artista").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform =
                `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });

    // ---------- EFEITOS ESPECÍFICOS DE CADA ARTISTA ----------
    const temas = {
        djavan: { simbolos: ["🎸", "🎵", "🎶"], modo: "sobe" },
        stones: { simbolos: ["💋", "🎸", "🤘"], modo: "explode" },
        bieber: { simbolos: ["★"], cores: ["#a15ee8", "#ffd84a"], modo: "explode" },
        anitta: { simbolos: ["🌴", "🌿", "🌺"], modo: "sobe", fogos: true },
        matue: { simbolos: ["🦇"], modo: "lateral" },
        luan: { simbolos: ["💧", "😢", "💧"], modo: "cai" },
        bunny: { simbolos: ["💀", "🌵", "🌶️", "🇵🇷"], modo: "explode" },
        alok: { simbolos: ["🛸", "🚁"], modo: "lateral", laser: true }
    };

    const sorteia = (lista) => lista[Math.floor(Math.random() * lista.length)];

    function particula(r, t) {
        const p = document.createElement("div");
        let x = r.left + Math.random() * r.width;
        let y = r.top + Math.random() * r.height;
        let dx = 0, dy = 0;

        if (t.modo === "sobe") { y = r.bottom - 20; dx = (Math.random() - 0.5) * 80; dy = -(120 + Math.random() * 120); }
        if (t.modo === "cai") { y = r.top; dx = (Math.random() - 0.5) * 30; dy = 140 + Math.random() * 160; }
        if (t.modo === "explode") {
            const a = Math.random() * Math.PI * 2, d = 70 + Math.random() * 90;
            dx = Math.cos(a) * d; dy = Math.sin(a) * d;
        }
        if (t.modo === "lateral") {
            const lado = Math.random() < 0.5 ? -1 : 1;
            x = lado < 0 ? r.left : r.right;
            dx = lado * (90 + Math.random() * 130);
            dy = (Math.random() - 0.5) * 120;
        }

        p.className = "particula";
        p.textContent = sorteia(t.simbolos);
        if (t.cores) p.style.color = sorteia(t.cores);
        p.style.fontSize = 18 + Math.random() * 16 + "px";
        p.style.left = x + "px";
        p.style.top = y + "px";
        p.style.setProperty("--dx", dx + "px");
        p.style.setProperty("--dy", dy + "px");
        p.style.setProperty("--rot", (Math.random() - 0.5) * 60 + "deg");
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1700);
    }

    function laser(r) {
        const l = document.createElement("div");
        l.className = "laser";
        l.style.left = r.left + r.width / 2 + "px";
        l.style.top = r.bottom + "px";
        l.style.setProperty("--ang", Math.random() * 120 - 60 + "deg");
        l.style.setProperty("--cor", Math.random() < 0.5 ? "#7cff9b" : "#a15ee8");
        document.body.appendChild(l);
        setTimeout(() => l.remove(), 700);
    }

    document.querySelectorAll(".card-lista[data-tema]").forEach((card) => {
        const t = temas[card.dataset.tema];
        let timer, n = 0;
        if (!t) return;

        card.addEventListener("mouseenter", () => {
            clearInterval(timer);
            timer = setInterval(() => {
                n++;
                const r = card.getBoundingClientRect();
                particula(r, t);
                if (t.laser) laser(r);
                if (t.fogos && n % 5 === 0) explosao(r.left + Math.random() * r.width, r.top + Math.random() * r.height * 0.6);
            }, 160);
        });
        card.addEventListener("mouseleave", () => clearInterval(timer));
    });
}

// ---------- CONTADORES (Sobre nós) ----------
document.querySelectorAll(".contador").forEach((el) => {
    const alvo = Number(el.dataset.alvo);
    el.textContent = "0";
    const obs = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        let n = 0;
        const id = setInterval(() => {
            n++;
            el.textContent = n;
            if (n >= alvo) clearInterval(id);
        }, 130);
    });
    obs.observe(el);
});

// ---------- PÁGINA CONTRATAR ----------
(function () {
    const form = document.getElementById("form-contratar");
    if (!form) return;

    const por = (id) => document.getElementById(id);
    const reais = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

    // data mínima = hoje
    const hoje = new Date();
    hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
    form.elements["data"].min = hoje.toISOString().split("T")[0];

    // artista escolhido pela URL (ex.: contratar.html?artista=djavan)
    const idUrl = new URLSearchParams(location.search).get("artista");
    if (idUrl) {
        const opcao = form.querySelector(`input[name="artista"][data-id="${idUrl}"]`);
        if (opcao) opcao.checked = true;
    }

    // máscara do WhatsApp
    form.elements["telefone"].addEventListener("input", (e) => {
        let d = e.target.value.replace(/\D/g, "").slice(0, 11);
        if (d.length > 6) d = d.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, "($1) $2-$3");
        else if (d.length > 2) d = d.replace(/^(\d{2})(\d*)/, "($1) $2");
        else if (d.length) d = "(" + d;
        e.target.value = d;
    });

    // marca o campo como "tocado" ao sair dele
    form.addEventListener("focusout", (e) => {
        const campo = e.target.closest(".campo");
        if (campo) campo.classList.add("tocado");
    });

    // ---------- RESUMO + PROGRESSO ----------
    function escreve(id, texto) {
        const el = por(id);
        el.textContent = texto || "—";
        el.classList.toggle("preenchido", !!texto);
    }

    function dataBR(v) {
        if (!v) return "";
        const [a, m, d] = v.split("-");
        return `${d}/${m}/${a}`;
    }

    function atualizar() {
        const f = form.elements;
        const extras = [...form.querySelectorAll('input[name="extras"]:checked')].map((i) => i.value);
        const orc = Number(f["orcamento"].value);
        const max = Number(f["orcamento"].max);

        por("orcamento-valor").textContent = reais.format(orc) + (orc >= max ? "+" : "");
        por("contagem").textContent = f["mensagem"].value.length;

        escreve("r-artista", f["artista"].value);
        escreve("r-tipo", f["tipo"].value);
        escreve("r-data", dataBR(f["data"].value));
        escreve("r-cidade", f["cidade"].value.trim());
        escreve("r-convidados", f["convidados"].value ? f["convidados"].value + " pessoas" : "");
        escreve("r-orcamento", reais.format(orc) + (orc >= max ? "+" : ""));
        escreve("r-duracao", f["duracao"].value);
        escreve("r-extras", extras.join(", "));

        // progresso: conta os campos obrigatórios preenchidos
        const obrigatorios = ["artista", "tipo", "data", "cidade", "convidados", "nome", "email", "telefone", "termos"];
        let ok = 0;
        obrigatorios.forEach((nome) => {
            const campo = f[nome];
            if (nome === "artista") { if (campo.value) ok++; }
            else if (nome === "termos") { if (campo.checked) ok++; }
            else if (campo.value && campo.checkValidity()) ok++;
        });
        const pct = Math.round((ok / obrigatorios.length) * 100);
        por("barra").style.width = pct + "%";
        por("pct").textContent = pct + "%";
    }

    form.addEventListener("input", atualizar);
    form.addEventListener("change", atualizar);
    atualizar();

    // ---------- FOGOS (usa o CSS .faisca que já existe) ----------
    function fogos(x, y) {
        const paleta = ["#a15ee8", "#b889ff", "#7cff9b", "#ffffff"];
        for (let i = 0; i < 26; i++) {
            const f = document.createElement("div");
            const ang = (Math.PI * 2 * i) / 26 + Math.random() * 0.4;
            const dist = 60 + Math.random() * 90;
            f.className = "faisca";
            f.style.left = x + "px";
            f.style.top = y + "px";
            f.style.setProperty("--cor", paleta[Math.floor(Math.random() * paleta.length)]);
            f.style.setProperty("--dx", Math.cos(ang) * dist + "px");
            f.style.setProperty("--dy", Math.sin(ang) * dist + "px");
            document.body.appendChild(f);
            setTimeout(() => f.remove(), 1000);
        }
    }

    // ---------- ENVIO ----------
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add("tentou");
            const invalido = form.querySelector(":invalid");
            invalido.scrollIntoView({ behavior: "smooth", block: "center" });
            const alvo = invalido.closest(".campo") || invalido.closest(".etapa");
            alvo.classList.remove("treme");
            void alvo.offsetWidth;
            alvo.classList.add("treme");
            return;
        }

        const f = form.elements;
        const extras = [...form.querySelectorAll('input[name="extras"]:checked')].map((i) => i.value);
        const protocolo = "ART-" + Date.now().toString().slice(-6);
        por("protocolo").textContent = protocolo;

        const corpo = [
            `Protocolo: ${protocolo}`,
            `Artista: ${f["artista"].value}`,
            `Evento: ${f["tipo"].value} em ${dataBR(f["data"].value)}`,
            `Local: ${f["cidade"].value}`,
            `Convidados: ${f["convidados"].value}`,
            `Orçamento: ${reais.format(Number(f["orcamento"].value))}`,
            `Duração: ${f["duracao"].value}`,
            `Extras: ${extras.join(", ") || "nenhum"}`,
            `Contato: ${f["nome"].value} | ${f["email"].value} | ${f["telefone"].value}`,
            f["mensagem"].value ? `Mensagem: ${f["mensagem"].value}` : ""
        ].filter(Boolean).join("\n");

        por("btn-email").href =
            "mailto:contato@artiva.com.br?subject=" +
            encodeURIComponent(`Pedido de proposta ${protocolo} - ${f["artista"].value}`) +
            "&body=" + encodeURIComponent(corpo);

        document.querySelector(".progresso").hidden = true;
        por("area-form").hidden = true;
        por("sucesso").hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });

        if (!semMovimento) {
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    fogos(
                        window.innerWidth * (0.25 + Math.random() * 0.5),
                        window.innerHeight * (0.2 + Math.random() * 0.4)
                    );
                }, i * 250);
            }
        }
    });
})();