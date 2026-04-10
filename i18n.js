window.TrackFlowI18n = (function () {
	var STORAGE_KEY = "trackflow_lang";
	var FALLBACK_LANG = "en";

	var translations = {
		en: {
			"common.skip": "Skip to main content",
			"common.nav.home": "Home",
			"common.nav.services": "Services",
			"common.nav.coverage": "Coverage",
			"common.nav.contact": "Contact",
			"common.footer.copyright": "© 2025 TrackFlow. All rights reserved.",
			"common.footer.linkedin": "LinkedIn",
			"common.lang.toEs": "ES",
			"common.lang.toEn": "EN",
			"common.lang.toggleAria": "Toggle language",
			"common.aria.homeLink": "TrackFlow home",
			"common.aria.toggleNav": "Toggle navigation menu",
			"common.aria.mainNavigation": "Main navigation",
			"common.aria.requestInfo": "Request information",

			"index.meta.title": "TrackFlow — Warehouse Management & Last-Mile Deliveries | US & Spain",
			"index.hero.badge": "Logistics Infrastructure Since 2009",
			"index.hero.headline.start": "Logistics",
			"index.hero.headline.middle": "that scales with your",
			"index.hero.headline.end": "e-commerce",
			"index.hero.subheadline": "Warehouse management, last-mile deliveries, and reverse logistics in the United States and Spain. Over 15 years helping fashion, electronics, and cosmetics brands grow without worrying about operations.",
			"index.cta.requestInfo": "Request information",
			"index.snapshot.title": "Operational Snapshot",
			"index.snapshot.warehouses": "Warehouses",
			"index.snapshot.years": "Years Supporting Brands",
			"index.snapshot.team": "Professional Team",
			"index.snapshot.markets": "Core Markets",
			"index.services.title": "Services",
			"index.services.subtitle": "Flexible logistics services built to keep your e-commerce promise at scale.",
			"index.services.warehouse.title": "Warehouse Management",
			"index.services.warehouse.b1": "Storage, picking, and packing workflows for daily order volume.",
			"index.services.warehouse.b2": "Real-time inventory visibility across SKUs and channels.",
			"index.services.warehouse.b3": "Strategic warehouses in Los Angeles and Zaragoza.",
			"index.services.lastmile.title": "Last-Mile Deliveries",
			"index.services.lastmile.b1": "Carrier network orchestration for consistent delivery SLAs.",
			"index.services.lastmile.b2": "Unified tracking for your team and customers.",
			"index.services.lastmile.b3": "Proactive incident management and resolution workflows.",
			"index.services.reverse.title": "Reverse Logistics",
			"index.services.reverse.b1": "Returns management from request to final disposition.",
			"index.services.reverse.b2": "Inspection and reconditioning processes for resale readiness.",
			"index.services.reverse.b3": "Integration with your e-commerce and ERP platforms.",
			"index.coverage.title": "Coverage",
			"index.coverage.us": "United States",
			"index.coverage.us.desc": "LA warehouse with direct operational coordination and distribution capabilities.",
			"index.coverage.us.warehouse": "Warehouse: Los Angeles",
			"index.coverage.us.carriers": "Carriers: UPS, FedEx, DHL",
			"index.coverage.es": "Spain",
			"index.coverage.es.desc": "Zaragoza fulfillment hub supporting national and cross-border delivery routes.",
			"index.coverage.es.warehouse": "Warehouse: Zaragoza",
			"index.coverage.es.carriers": "Carriers: MRW, SEUR, DHL",
			"index.why.title": "Why TrackFlow",
			"index.why.stat1": "2 Markets",
			"index.why.desc1": "Binational operation synchronized between the US and Spain.",
			"index.why.stat2": "130+",
			"index.why.desc2": "Professionals dedicated to operational excellence and service quality.",
			"index.why.stat3": "1 Platform",
			"index.why.desc3": "Own technology stack for live tracking, control, and automation.",
			"index.why.stat4": "15+ Years",
			"index.why.desc4": "E-commerce specialization across fashion, electronics, and cosmetics.",
			"index.contact.title": "Contact",
			"index.contact.email": "Email",
			"index.contact.la": "Los Angeles",
			"index.contact.zgz": "Zaragoza",
			"index.footerCta": "Ready to optimize your logistics in the United States and Spain?",

			"app.meta.title": "TrackFlow | Request Information",
			"app.hero.badge": "TrackFlow Intake Form",
			"app.hero.title": "Request information for your logistics operation",
			"app.hero.subtitle": "Tell us about your company, shipping profile, and service needs. Our team will respond with a tailored proposal for operations in the United States, Spain, or both.",
			"app.form.requiredNote": "Fields marked with * are required.",
			"app.fs.company": "Company info",
			"app.companyName.label": "Company name",
			"app.companyName.hint": "Minimum 2 characters.",
			"app.companyName.placeholder": "TrackFlow Retail Inc.",
			"app.contactPerson.label": "Contact person",
			"app.contactPerson.hint": "Include first and last name.",
			"app.contactPerson.placeholder": "Alex Morgan",
			"app.email.label": "Corporate email",
			"app.email.placeholder": "operations@company.com",
			"app.phone.label": "Phone",
			"app.phone.hint": "Must start with + and country code.",
			"app.phone.placeholder": "+1 213 555 0147",
			"app.website.label": "Company website",
			"app.website.hint": "Optional. Must be a valid URL if provided.",
			"app.website.placeholder": "https://yourcompany.com",
			"app.fs.logistics": "Logistics profile",
			"app.country.label": "Main operating country",
			"app.product.label": "Product type",
			"app.volume.label": "Estimated monthly shipping volume",
			"app.select.default": "Select one option",
			"app.country.us": "United States",
			"app.country.es": "Spain",
			"app.country.both": "Both",
			"app.country.other": "Other",
			"app.product.fashion": "Fashion",
			"app.product.electronics": "Electronics",
			"app.product.cosmetics": "Cosmetics",
			"app.product.food": "Food",
			"app.product.other": "Other",
			"app.volume.0_100": "0-100",
			"app.volume.101_500": "101-500",
			"app.volume.501_2000": "501-2000",
			"app.volume.2000_plus": "2000+",
			"app.volume.notSure": "Not sure",
			"app.lowVolume.warning": "For volumes under 100 monthly shipments, our services might not be the most efficient solution. Are you sure you want to continue?",
			"app.lowVolume.continue": "Yes, continue",
			"app.fs.services": "Services",
			"app.services.label": "Services of interest",
			"app.services.warehousing": "Warehousing",
			"app.services.lastmile": "Last mile",
			"app.services.reverse": "Reverse logistics",
			"app.threepl.label": "Do you currently work with another 3PL?",
			"app.threepl.yes": "Yes",
			"app.threepl.no": "No",
			"app.threepl.evaluating": "Evaluating options",
			"app.fs.additional": "Additional info",
			"app.comments.label": "Comments or specific needs",
			"app.comments.placeholder": "Tell us your expected SLAs, seasonality, integrations, or special requirements.",
			"app.privacy.label": "I accept the privacy policy",
			"app.button.submit": "Send request",
			"app.button.reset": "Clear form",
			"app.success.title": "Thank you for your interest in TrackFlow!",
			"app.success.bodyPrefix": "We have received your request. Our commercial team will review your information and contact you within the next 24-48 hours to schedule a call and learn about your logistics needs in detail. If you have any urgent inquiry, write to us directly at",
			"app.success.bodySuffix": ".",

			"validation.companyName": "Company name must have at least 2 characters",
			"validation.contactPerson": "Enter first and last name of contact",
			"validation.email": "Enter a valid corporate email (example: name@company.com)",
			"validation.phone": "Phone must include country code (example: +1 213 555 0147)",
			"validation.website": "If you include website, it must be a valid URL",
			"validation.country": "Select main operating country",
			"validation.product": "Select the type of product you handle",
			"validation.volume": "Select estimated monthly volume",
			"validation.services": "Select at least one service of interest",
			"validation.threepl": "Indicate if you currently work with another logistics provider",
			"validation.comments": "Comments cannot exceed 500 characters ({remaining} remaining)",
			"validation.privacy": "You must accept the privacy policy to continue",
			"validation.counter": "{count} / 500 characters"
		},
		es: {
			"common.skip": "Saltar al contenido principal",
			"common.nav.home": "Inicio",
			"common.nav.services": "Servicios",
			"common.nav.coverage": "Cobertura",
			"common.nav.contact": "Contacto",
			"common.footer.copyright": "© 2025 TrackFlow. Todos los derechos reservados.",
			"common.footer.linkedin": "LinkedIn",
			"common.lang.toEs": "ES",
			"common.lang.toEn": "EN",
			"common.lang.toggleAria": "Cambiar idioma",
			"common.aria.homeLink": "Inicio de TrackFlow",
			"common.aria.toggleNav": "Mostrar u ocultar menú de navegación",
			"common.aria.mainNavigation": "Navegación principal",
			"common.aria.requestInfo": "Solicitar información",

			"index.meta.title": "TrackFlow — Gestión de Almacenes y Entregas de Última Milla | EE. UU. y España",
			"index.hero.badge": "Infraestructura logística desde 2009",
			"index.hero.headline.start": "Logística",
			"index.hero.headline.middle": "que escala con tu",
			"index.hero.headline.end": "e-commerce",
			"index.hero.subheadline": "Gestión de almacenes, entregas de última milla y logística inversa en Estados Unidos y España. Más de 15 años ayudando a marcas de moda, electrónica y cosmética a crecer sin preocuparse por la operación.",
			"index.cta.requestInfo": "Solicitar información",
			"index.snapshot.title": "Resumen operativo",
			"index.snapshot.warehouses": "Almacenes",
			"index.snapshot.years": "Años apoyando marcas",
			"index.snapshot.team": "Equipo profesional",
			"index.snapshot.markets": "Mercados clave",
			"index.services.title": "Servicios",
			"index.services.subtitle": "Servicios logísticos flexibles para cumplir tu promesa e-commerce a escala.",
			"index.services.warehouse.title": "Gestión de almacenes",
			"index.services.warehouse.b1": "Procesos de almacenamiento, picking y packing para el volumen diario de pedidos.",
			"index.services.warehouse.b2": "Visibilidad de inventario en tiempo real por SKU y canal.",
			"index.services.warehouse.b3": "Almacenes estratégicos en Los Ángeles y Zaragoza.",
			"index.services.lastmile.title": "Entregas de última milla",
			"index.services.lastmile.b1": "Orquestación de red de carriers para cumplir SLA de entrega.",
			"index.services.lastmile.b2": "Seguimiento unificado para tu equipo y tus clientes.",
			"index.services.lastmile.b3": "Gestión proactiva de incidencias y resolución.",
			"index.services.reverse.title": "Logística inversa",
			"index.services.reverse.b1": "Gestión de devoluciones desde la solicitud hasta su cierre.",
			"index.services.reverse.b2": "Inspección y reacondicionamiento para reventa.",
			"index.services.reverse.b3": "Integración con tus plataformas e-commerce y ERP.",
			"index.coverage.title": "Cobertura",
			"index.coverage.us": "Estados Unidos",
			"index.coverage.us.desc": "Almacén en Los Ángeles con coordinación operativa y capacidad de distribución.",
			"index.coverage.us.warehouse": "Almacén: Los Ángeles",
			"index.coverage.us.carriers": "Carriers: UPS, FedEx, DHL",
			"index.coverage.es": "España",
			"index.coverage.es.desc": "Hub logístico en Zaragoza con soporte nacional y rutas transfronterizas.",
			"index.coverage.es.warehouse": "Almacén: Zaragoza",
			"index.coverage.es.carriers": "Carriers: MRW, SEUR, DHL",
			"index.why.title": "Por qué TrackFlow",
			"index.why.stat1": "2 mercados",
			"index.why.desc1": "Operación binacional sincronizada entre EE. UU. y España.",
			"index.why.stat2": "130+",
			"index.why.desc2": "Profesionales enfocados en excelencia operativa y calidad de servicio.",
			"index.why.stat3": "1 plataforma",
			"index.why.desc3": "Tecnología propia para seguimiento en vivo, control y automatización.",
			"index.why.stat4": "15+ años",
			"index.why.desc4": "Especialización e-commerce en moda, electrónica y cosmética.",
			"index.contact.title": "Contacto",
			"index.contact.email": "Correo",
			"index.contact.la": "Los Ángeles",
			"index.contact.zgz": "Zaragoza",
			"index.footerCta": "¿Listo para optimizar tu logística en Estados Unidos y España?",

			"app.meta.title": "TrackFlow | Solicitar información",
			"app.hero.badge": "Formulario comercial TrackFlow",
			"app.hero.title": "Solicita información para tu operación logística",
			"app.hero.subtitle": "Cuéntanos sobre tu empresa, perfil de envíos y necesidades de servicio. Nuestro equipo te responderá con una propuesta adaptada para operar en Estados Unidos, España o ambos mercados.",
			"app.form.requiredNote": "Los campos marcados con * son obligatorios.",
			"app.fs.company": "Información de la empresa",
			"app.companyName.label": "Nombre de la empresa",
			"app.companyName.hint": "Mínimo 2 caracteres.",
			"app.companyName.placeholder": "TrackFlow Retail S.L.",
			"app.contactPerson.label": "Persona de contacto",
			"app.contactPerson.hint": "Incluye nombre y apellido.",
			"app.contactPerson.placeholder": "Alex García",
			"app.email.label": "Correo corporativo",
			"app.email.placeholder": "operaciones@empresa.com",
			"app.phone.label": "Teléfono",
			"app.phone.hint": "Debe empezar por + y código de país.",
			"app.phone.placeholder": "+34 976 123 456",
			"app.website.label": "Sitio web de la empresa",
			"app.website.hint": "Opcional. Si lo incluyes, debe ser una URL válida.",
			"app.website.placeholder": "https://tuempresa.com",
			"app.fs.logistics": "Perfil logístico",
			"app.country.label": "País principal de operación",
			"app.product.label": "Tipo de producto",
			"app.volume.label": "Volumen mensual estimado de envíos",
			"app.select.default": "Selecciona una opción",
			"app.country.us": "Estados Unidos",
			"app.country.es": "España",
			"app.country.both": "Ambos",
			"app.country.other": "Otro",
			"app.product.fashion": "Moda",
			"app.product.electronics": "Electrónica",
			"app.product.cosmetics": "Cosmética",
			"app.product.food": "Alimentación",
			"app.product.other": "Otro",
			"app.volume.0_100": "0-100",
			"app.volume.101_500": "101-500",
			"app.volume.501_2000": "501-2000",
			"app.volume.2000_plus": "2000+",
			"app.volume.notSure": "No estoy seguro",
			"app.lowVolume.warning": "Para volúmenes por debajo de 100 envíos mensuales, nuestros servicios podrían no ser la solución más eficiente. ¿Seguro que deseas continuar?",
			"app.lowVolume.continue": "Sí, continuar",
			"app.fs.services": "Servicios",
			"app.services.label": "Servicios de interés",
			"app.services.warehousing": "Almacenaje",
			"app.services.lastmile": "Última milla",
			"app.services.reverse": "Logística inversa",
			"app.threepl.label": "¿Actualmente trabajas con otro operador 3PL?",
			"app.threepl.yes": "Sí",
			"app.threepl.no": "No",
			"app.threepl.evaluating": "Evaluando opciones",
			"app.fs.additional": "Información adicional",
			"app.comments.label": "Comentarios o necesidades específicas",
			"app.comments.placeholder": "Cuéntanos tus SLA esperados, estacionalidad, integraciones o requisitos especiales.",
			"app.privacy.label": "Acepto la política de privacidad",
			"app.button.submit": "Enviar solicitud",
			"app.button.reset": "Limpiar formulario",
			"app.success.title": "¡Gracias por tu interés en TrackFlow!",
			"app.success.bodyPrefix": "Hemos recibido tu solicitud. Nuestro equipo comercial revisará tu información y te contactará dentro de las próximas 24-48 horas para agendar una llamada y entender en detalle tus necesidades logísticas. Si tienes una consulta urgente, escríbenos directamente a",
			"app.success.bodySuffix": ".",

			"validation.companyName": "El nombre de la empresa debe tener al menos 2 caracteres",
			"validation.contactPerson": "Introduce nombre y apellido de la persona de contacto",
			"validation.email": "Introduce un correo corporativo válido (ejemplo: nombre@empresa.com)",
			"validation.phone": "El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)",
			"validation.website": "Si incluyes sitio web, debe ser una URL válida",
			"validation.country": "Selecciona el país principal de operación",
			"validation.product": "Selecciona el tipo de producto que gestionas",
			"validation.volume": "Selecciona el volumen mensual estimado",
			"validation.services": "Selecciona al menos un servicio de interés",
			"validation.threepl": "Indica si actualmente trabajas con otro proveedor logístico",
			"validation.comments": "Los comentarios no pueden superar los 500 caracteres ({remaining} restantes)",
			"validation.privacy": "Debes aceptar la política de privacidad para continuar",
			"validation.counter": "{count} / 500 caracteres"
		}
	};

	function getLanguage() {
		var saved = localStorage.getItem(STORAGE_KEY);
		return saved === "es" || saved === "en" ? saved : FALLBACK_LANG;
	}

	function setLanguage(lang) {
		var next = lang === "es" ? "es" : "en";
		localStorage.setItem(STORAGE_KEY, next);
		applyTranslations(next);
		document.dispatchEvent(new CustomEvent("trackflow:language-changed", { detail: { lang: next } }));
	}

	function interpolate(text, vars) {
		if (!vars) return text;
		return text.replace(/\{(\w+)\}/g, function (_, key) {
			return Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : "";
		});
	}

	function t(key, vars, lang) {
		var current = lang || getLanguage();
		var value = (translations[current] && translations[current][key]) || translations.en[key] || key;
		return interpolate(value, vars);
	}

	function applyTranslations(lang) {
		var current = lang || getLanguage();
		document.documentElement.lang = current;

		document.querySelectorAll("[data-i18n]").forEach(function (el) {
			el.textContent = t(el.getAttribute("data-i18n"), null, current);
		});

		document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
			el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder"), null, current));
		});

		document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
			el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria-label"), null, current));
		});

		var langButtons = document.querySelectorAll("[data-lang-toggle]");
		langButtons.forEach(function (button) {
			button.textContent = current === "en" ? t("common.lang.toEs", null, current) : t("common.lang.toEn", null, current);
			button.setAttribute("aria-label", t("common.lang.toggleAria", null, current));
		});
	}

	function init() {
		applyTranslations(getLanguage());
		document.querySelectorAll("[data-lang-toggle]").forEach(function (button) {
			button.addEventListener("click", function () {
				var current = getLanguage();
				setLanguage(current === "en" ? "es" : "en");
			});
		});
	}

	return {
		translations: translations,
		t: t,
		init: init,
		setLanguage: setLanguage,
		getLanguage: getLanguage,
		applyTranslations: applyTranslations
	};
})();

document.addEventListener("DOMContentLoaded", function () {
	window.TrackFlowI18n.init();
});
