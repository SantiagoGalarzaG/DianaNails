/* ═══════════════════════════════════════
   Diana Nails — app.js
   ↳ IMPORTANTE: cambia este número por el tuyo real
═══════════════════════════════════════ */
const WA_NUMBER  = "573204799613";
const WA_MESSAGE = "Hola%2C%20quiero%20reservar%20una%20cita%20en%20Diana%20Nails";

/* ════════════════════════════════════════
   HEADER DINÁMICO
════════════════════════════════════════ */
const headerSlot = document.getElementById("header");

async function fetchElements(url, campo, callback) {
	try {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Error: ${response.status}`);
		campo.innerHTML = await response.text();
		if (callback) callback();
	} catch (error) {
		console.error("Fetch error:", error.message);
		campo.innerHTML = `
			<div class="w-full bg-red-100 border border-red-300 text-red-700 text-sm text-center py-3 px-4">
				No se pudo cargar el componente. Asegúrate de usar Live Server.
			</div>`;
	}
}

fetchElements("header.html", headerSlot, () => {
	initMenu();
	initScroll();
	initActiveNav();
});

/* ════════════════════════════════════════
   MENÚ MÓVIL
════════════════════════════════════════ */
function initMenu() {
	const menuBtn    = document.getElementById("menuBtn");
	const mobileMenu = document.getElementById("mobileMenu");
	let isOpen = false;

	function toggleMenu(open) {
		isOpen = open;
		menuBtn.setAttribute("aria-expanded", open);
		menuBtn.classList.toggle("bar-open", open);
		if (open) {
			mobileMenu.classList.remove("max-h-0", "opacity-0", "py-0");
			mobileMenu.classList.add("max-h-96", "opacity-100", "py-4");
		} else {
			mobileMenu.classList.remove("max-h-96", "opacity-100", "py-4");
			mobileMenu.classList.add("max-h-0", "opacity-0", "py-0");
		}
	}

	menuBtn.addEventListener("click", () => toggleMenu(!isOpen));
	mobileMenu.querySelectorAll("a").forEach(link =>
		link.addEventListener("click", () => toggleMenu(false))
	);
}

/* ════════════════════════════════════════
   HEADER SCROLL
════════════════════════════════════════ */
function initScroll() {
	const headerEl = document.querySelector("header");
	window.addEventListener("scroll", () => {
		if (window.scrollY > 50) {
			headerEl.classList.add("bg-white/70", "backdrop-blur-md", "shadow-md");
			headerEl.classList.remove("bg-[#F8F5F8]", "shadow-sm");
		} else {
			headerEl.classList.remove("bg-white/70", "backdrop-blur-md", "shadow-md");
			headerEl.classList.add("bg-[#F8F5F8]", "shadow-sm");
		}
	}, { passive: true });
}

/* ════════════════════════════════════════
   NAV ACTIVA
════════════════════════════════════════ */
function initActiveNav() {
	const currentPage = window.location.pathname.split("/").pop() || "index.html";
	document.querySelectorAll("header nav a, #mobileMenu a").forEach(link => {
		const href = link.getAttribute("href");
		if (href === currentPage || (currentPage === "" && href === "index.html")) {
			link.classList.add("nav-active");
			link.setAttribute("aria-current", "page");
		}
	});
}

/* ════════════════════════════════════════
   CONTADORES ANIMADOS
════════════════════════════════════════ */
function initCounters() {
	const counters = document.querySelectorAll("[data-counter]");
	if (!counters.length) return;

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting && !entry.target.dataset.done) {
				entry.target.dataset.done = "1";
				const target   = parseInt(entry.target.dataset.counter, 10);
				const suffix   = entry.target.dataset.suffix || "";
				const duration = 1600;
				let start = null;

				const step = ts => {
					if (!start) start = ts;
					const p      = Math.min((ts - start) / duration, 1);
					const eased  = 1 - Math.pow(1 - p, 3);
					entry.target.textContent = Math.round(eased * target) + suffix;
					if (p < 1) requestAnimationFrame(step);
				};
				requestAnimationFrame(step);
			}
		});
	}, { threshold: 0.5 });

	counters.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════ */
function initScrollReveal() {
	const reveals = document.querySelectorAll(".reveal");
	if (!reveals.length) return;

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

	reveals.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════
   BOTÓN SCROLL TO TOP
════════════════════════════════════════ */
function initScrollTop() {
	const btn = document.getElementById("scrollTop");
	if (!btn) return;

	window.addEventListener("scroll", () => {
		if (window.scrollY > 400) {
			btn.classList.remove("opacity-0", "pointer-events-none");
			btn.classList.add("opacity-100");
		} else {
			btn.classList.add("opacity-0", "pointer-events-none");
			btn.classList.remove("opacity-100");
		}
	}, { passive: true });

	btn.addEventListener("click", () =>
		window.scrollTo({ top: 0, behavior: "smooth" })
	);
}

/* ════════════════════════════════════════
   TRANSICIÓN DE PÁGINA
════════════════════════════════════════ */
function initPageTransition() {
	document.body.classList.add("page-loaded");

	document.querySelectorAll("a[href]").forEach(link => {
		const href = link.getAttribute("href");
		const isInternal = href &&
			!href.startsWith("#") &&
			!href.startsWith("http") &&
			!href.startsWith("mailto") &&
			!href.startsWith("tel");

		if (isInternal) {
			link.addEventListener("click", e => {
				e.preventDefault();
				document.body.classList.remove("page-loaded");
				document.body.classList.add("page-leaving");
				setTimeout(() => { window.location.href = href; }, 300);
			});
		}
	});
}

/* ════════════════════════════════════════
   FILTROS DEL PORTAFOLIO
════════════════════════════════════════ */
function initFilters() {
	const filterBtns = document.querySelectorAll("[data-filter]");
	const items      = document.querySelectorAll("[data-category]");
	if (!filterBtns.length || !items.length) return;

	const activeClasses   = ["bg-gradient-to-r","from-pink-400","to-pink-600","text-white","shadow-md","shadow-pink-200","border-0"];
	const inactiveClasses = ["border","border-gray-300","text-gray-600"];

	filterBtns.forEach(btn => {
		btn.addEventListener("click", () => {
			const filter = btn.dataset.filter;

			// Actualizar botones
			filterBtns.forEach(b => {
				b.classList.remove(...activeClasses);
				b.classList.add(...inactiveClasses);
			});
			btn.classList.add(...activeClasses);
			btn.classList.remove(...inactiveClasses);

			// Filtrar items
			items.forEach(item => {
				const cats  = item.dataset.category.split(" ");
				const match = filter === "all" || cats.includes(filter);

				if (match) {
					item.style.transition = "opacity .3s ease, transform .3s ease";
					item.style.display    = "block";
					requestAnimationFrame(() => {
						item.style.opacity   = "1";
						item.style.transform = "scale(1)";
					});
				} else {
					item.style.transition = "opacity .3s ease, transform .3s ease";
					item.style.opacity    = "0";
					item.style.transform  = "scale(0.95)";
					setTimeout(() => {
						if (item.style.opacity === "0") item.style.display = "none";
					}, 320);
				}
			});
		});
	});
}

/* ════════════════════════════════════════
   LIGHTBOX
════════════════════════════════════════ */
function initLightbox() {
	const triggers = document.querySelectorAll(".lightbox-trigger");
	if (!triggers.length) return;

	const images = Array.from(triggers);
	let currentIndex = 0;

	// Crear el lightbox en el DOM
	const lb = document.createElement("div");
	lb.id = "lightbox";
	lb.setAttribute("role", "dialog");
	lb.setAttribute("aria-modal", "true");
	lb.setAttribute("aria-label", "Imagen ampliada");
	lb.innerHTML = `
		<div id="lb-overlay" class="lb-overlay"></div>
		<div class="lb-container">
			<button id="lb-close" aria-label="Cerrar" class="lb-close">✕</button>
			<button id="lb-prev"  aria-label="Anterior" class="lb-prev">‹</button>
			<img    id="lb-img"   src="" alt="" class="lb-img" />
			<button id="lb-next"  aria-label="Siguiente" class="lb-next">›</button>
			<p      id="lb-caption" class="lb-caption"></p>
		</div>`;
	document.body.appendChild(lb);

	function getImg(el) {
		return el.tagName === "IMG" ? el : el.querySelector("img");
	}

	function openAt(index) {
		currentIndex = index;
		const img = getImg(images[index]);
		document.getElementById("lb-img").src    = img.src;
		document.getElementById("lb-img").alt    = img.alt;
		document.getElementById("lb-caption").textContent = img.alt;
		lb.classList.add("lb-open");
		document.body.style.overflow = "hidden";
		document.getElementById("lb-close").focus();
	}

	function close() {
		lb.classList.remove("lb-open");
		document.body.style.overflow = "";
	}

	function navigate(dir) {
		currentIndex = (currentIndex + dir + images.length) % images.length;
		const img    = getImg(images[currentIndex]);
		const lbImg  = document.getElementById("lb-img");
		lbImg.style.opacity = "0";
		setTimeout(() => {
			lbImg.src = img.src;
			lbImg.alt = img.alt;
			document.getElementById("lb-caption").textContent = img.alt;
			lbImg.style.opacity = "1";
		}, 210);
	}

	triggers.forEach((el, i) => {
		el.style.cursor = "pointer";
		el.setAttribute("tabindex", "0");
		el.setAttribute("role", "button");
		el.setAttribute("aria-label", "Ver imagen ampliada");
		el.addEventListener("click",   () => openAt(i));
		el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") openAt(i); });
	});

	document.getElementById("lb-close").addEventListener("click", close);
	document.getElementById("lb-overlay").addEventListener("click", close);
	document.getElementById("lb-prev").addEventListener("click", () => navigate(-1));
	document.getElementById("lb-next").addEventListener("click", () => navigate(1));

	document.addEventListener("keydown", e => {
		if (!lb.classList.contains("lb-open")) return;
		if (e.key === "Escape")     close();
		if (e.key === "ArrowLeft")  navigate(-1);
		if (e.key === "ArrowRight") navigate(1);
	});
}

/* ════════════════════════════════════════
   FAQ ACORDEÓN
════════════════════════════════════════ */
function initFAQ() {
	const items = document.querySelectorAll(".faq-item");
	if (!items.length) return;

	items.forEach(item => {
		const question = item.querySelector(".faq-question");
		const answer   = item.querySelector(".faq-answer");
		const icon     = item.querySelector(".faq-icon");

		question.addEventListener("click", () => {
			const isOpen = answer.style.maxHeight && answer.style.maxHeight !== "0px";

			// Cerrar todos
			items.forEach(other => {
				other.querySelector(".faq-answer").style.maxHeight  = "0px";
				other.querySelector(".faq-icon").style.transform     = "rotate(0deg)";
				other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
				other.classList.remove("faq-open");
			});

			// Abrir este si estaba cerrado
			if (!isOpen) {
				answer.style.maxHeight = answer.scrollHeight + "px";
				icon.style.transform   = "rotate(45deg)";
				question.setAttribute("aria-expanded", "true");
				item.classList.add("faq-open");
			}
		});
	});
}

/* ════════════════════════════════════════
   HORARIO DINÁMICO
════════════════════════════════════════ */
function initDynamicHours() {
	const el = document.getElementById("dynamic-hours");
	if (!el) return;

	const now        = new Date();
	const day        = now.getDay();          // 0=Dom … 6=Sáb
	const totalHours = now.getHours() + now.getMinutes() / 60;
	const isOpenDay  = day >= 1 && day <= 6;  // Lun–Sáb
	const isOpenTime = totalHours >= 9 && totalHours < 19; // 9am–7pm
	const isOpen     = isOpenDay && isOpenTime;

	el.innerHTML = isOpen
		? `<span class="inline-flex items-center gap-1.5 text-green-400">
				<span class="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
				Abierto ahora &nbsp;·&nbsp; Cierra a las 7pm
			</span>`
		: `<span class="inline-flex items-center gap-1.5 text-red-400">
				<span class="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
				Cerrado ahora &nbsp;·&nbsp; Abre Lun–Sáb 9am
			</span>`;
}

/* ════════════════════════════════════════
   BANNER DE PROMOCIÓN
════════════════════════════════════════ */
function initPromoBanner() {
	const banner   = document.getElementById("promo-banner");
	const closeBtn = document.getElementById("promo-close");
	if (!banner || !closeBtn) return;

	if (sessionStorage.getItem("promo-dismissed")) {
		banner.remove();
		return;
	}

	closeBtn.addEventListener("click", () => {
		banner.style.maxHeight = "0";
		banner.style.opacity   = "0";
		setTimeout(() => banner.remove(), 420);
		sessionStorage.setItem("promo-dismissed", "1");
	});
}

/* ════════════════════════════════════════
   INIT — DOMContentLoaded
════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
	initCounters();
	initScrollReveal();
	initScrollTop();
	initPageTransition();
	initFilters();
	initLightbox();
	initFAQ();
	initDynamicHours();
	initPromoBanner();
});
