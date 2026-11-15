const METRIC_SLIDERS = {
  business: [
    {
      src: "/images/infografica/RIGAMONTI_Milioni di fatturato.png",
      alt: "267,4 milioni di euro di fatturato",
    },
    {
      src: "/images/infografica/RIGAMONTI_Tonnellate_vendute.png",
      alt: "16.385 tonnellate di prodotto venduto",
    },
    {
      src: "/images/infografica/RIGAMONTI_vendite_italiane.png",
      alt: "88% delle vendite generate in Italia",
    },
  ],
  people: [
    {
      src: "/images/infografica/RIGAMONTI_Persone.png",
      alt: "468 persone nella forza lavoro complessiva",
    },
    {
      src: "/images/infografica/RIGAMONTI_Dipendenti.png",
      alt: "368 dipendenti a tempo indeterminato",
    },
    {
      src: "/images/infografica/RIGAMMONTI-Formazione.png",
      alt: "3.418 ore di formazione",
    },
  ],
  planet: [
    {
      src: "/images/infografica/RIGAMONTI_Energia.png",
      alt: "291.770 gigajoule di energia consumata dall'organizzazione",
    },
    {
      src: "/images/infografica/RIGAMONTI_Acqua.png",
      alt: "356 megalitri di acqua prelevata",
    },
    {
      src: "/images/infografica/RIGAMONTI_Rifiuti.png",
      alt: "75% dei rifiuti destinati a recupero",
    },
  ],
};

const CERTS_BY_BRAND = {
  RIGAMONTI: [
    "CERTIFICAZIONE_IFS.png",
    "CERTIFICAZIONE_CSQA_430.png",
    "CERTIFICAZIONE_CSQA_8595.png",
    "CERTIFICAZIONE_Indicazione_geografica_protetta.png",
    "CERTIFICAZIONE_22005.png",
    "CERTIFICAZIONE_Prodotto_CSQA40598.png",
    "CERTIFICAZIONE_Biologica.png",
    "LOGO_Certificazione_HALAITALIA.png",
  ],
  PRINCIPE: [
    "CERTIFICAZIONE_IFS.png",
    "CERTIFICAZIONE_CSQA_430.png",
    "CERTIFICAZIONE_EMAS.png",
    "CERTIFICAZIONE_Brocs.png",
    "CERTIFICAZIONE_Biologica.png",
    "CERTIFICAZIONE_DOP.png",
    "CERTIFICAZIONE_Indicazione_geografica_protetta.png",
  ],
  KINGS: [
    "CERTIFICAZIONE_IFS.png",
    "CERTIFICAZIONE_Brocs.png",
    "CERTIFICAZIONE_Biologica.png",
    "CERTIFICAZIONE_DOP.png",
    "CERTIFICAZIONE_Indicazione_geografica_protetta.png",
  ],
  "SIA.MO.CI": ["CERTIFICAZIONE_IFS.png", "CERTIFICAZIONE_CSQA_430.png"],
};

const CERT_ALT = {
  "CERTIFICAZIONE_IFS.png": "IFS Food",
  "CERTIFICAZIONE_CSQA_430.png": "CSQA",
  "CERTIFICAZIONE_CSQA_8595.png": "CSQA",
  "CERTIFICAZIONE_22005.png": "ISO 22005",
  "CERTIFICAZIONE_Biologica.png": "Agricoltura biologica UE",
  "LOGO_Certificazione_HALAITALIA.png": "Halal Italia",
  "CERTIFICAZIONE_Indicazione_geografica_protetta.png": "Indicazione Geografica Protetta",
  "CERTIFICAZIONE_Prodotto_CSQA40598.png": "Prodotto certificato CSQA",
  "CERTIFICAZIONE_EMAS.png": "EMAS",
  "CERTIFICAZIONE_Brocs.png": "BRCGS Food Safety Certified",
  "CERTIFICAZIONE_DOP.png": "Denominazione di Origine Protetta",
};

function buildMetricSliders() {
  document.querySelectorAll("[data-slider-mount]").forEach((mount) => {
    const id = mount.dataset.sliderMount;
    const slides = METRIC_SLIDERS[id];
    if (!slides) return;

    const slidesHtml = slides
      .map(
        (slide, i) => `
      <figure class="metric-slide${i === 0 ? " is-active" : ""}" data-index="${i}">
        <img src="${slide.src}" alt="${slide.alt}" width="861" height="779" loading="lazy" />
      </figure>`
      )
      .join("");

    const dots = slides
      .map(
        (_, i) =>
          `<button type="button" aria-label="Slide ${i + 1} di ${slides.length}" aria-current="${
            i === 0 ? "true" : "false"
          }" data-index="${i}"></button>`
      )
      .join("");

    mount.innerHTML = `
      <div class="metric-slider" data-slider="${id}">
        <div class="metric-slider__viewport">
          <div class="metric-slider__track">${slidesHtml}</div>
        </div>
        <div class="metric-slider__dots">${dots}</div>
      </div>`;

    initSlider(mount.querySelector(".metric-slider"));
  });
}

function initSlider(el) {
  const track = el.querySelector(".metric-slider__track");
  const slides = [...el.querySelectorAll(".metric-slide")];
  const dots = [...el.querySelectorAll(".metric-slider__dots button")];
  let index = 0;
  let timer;
  let inView = false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const go = (next) => {
    index = (next + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => dot.setAttribute("aria-current", i === index ? "true" : "false"));
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      go(Number(dot.dataset.index));
      restart();
    });
  });

  let startX = 0;
  el.addEventListener(
    "pointerdown",
    (e) => {
      startX = e.clientX;
    },
    { passive: true }
  );
  el.addEventListener(
    "pointerup",
    (e) => {
      const dx = e.clientX - startX;
      if (Math.abs(dx) < 40) return;
      go(index + (dx < 0 ? 1 : -1));
      restart();
    },
    { passive: true }
  );

  const restart = () => {
    clearInterval(timer);
    if (reduce || !inView) return;
    timer = setInterval(() => go(index + 1), 6500);
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        if (inView) restart();
        else clearInterval(timer);
      },
      { threshold: 0.45 }
    );
    io.observe(el);
  } else {
    inView = true;
    restart();
  }

  go(0);
}

function renderCerts(brand) {
  const grid = document.getElementById("certs-grid");
  if (!grid) return;
  const files = CERTS_BY_BRAND[brand] || [];
  if (!files.length) {
    grid.innerHTML = `<p class="certs__empty">Nessuna certificazione disponibile per questo brand.</p>`;
    return;
  }

  grid.innerHTML = files
    .map((file, i) => {
      const src = `/images/certificazioni/${encodeURIComponent(brand)}/${file}`;
      const alt = CERT_ALT[file] || "Certificazione";
      return `
        <div class="certs__item" style="transition-delay:${i * 35}ms">
          <img src="${src}" alt="${alt}" loading="lazy" />
        </div>`;
    })
    .join("");
}

function initCertSwitcher() {
  const buttons = [...document.querySelectorAll(".certs__brand")];
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const brand = btn.dataset.brand;
      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", active ? "true" : "false");
      });
      renderCerts(brand);
    });
  });
  renderCerts("RIGAMONTI");
}

function initReportForm() {
  const form = document.getElementById("report-form");
  const feedback = document.getElementById("report-feedback");
  if (!form || !feedback) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    feedback.hidden = false;
    feedback.textContent =
      "Grazie. Ti invieremo a breve il link per scaricare il Report di Sostenibilità 2025.";
    form.reset();
  });
}

function initDownloads() {
  document.querySelectorAll(".download-link[aria-disabled='true']").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
    });
  });
}

function initReveals() {
  const nodes = document.querySelectorAll(
    ".report__form-col, .report__visual, .certs__layout, .compliance__col"
  );
  nodes.forEach((el) => el.classList.add("reveal"));

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach((el) => io.observe(el));
}

function initMenuPlaceholder() {
  const btn = document.querySelector(".site-header__menu");
  if (!btn) return;
  btn.addEventListener("click", () => {
    btn.setAttribute("aria-expanded", "false");
  });
}

buildMetricSliders();
initCertSwitcher();
initReportForm();
initDownloads();
initReveals();
initMenuPlaceholder();
