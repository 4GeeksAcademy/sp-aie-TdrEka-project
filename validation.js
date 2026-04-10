document.addEventListener("DOMContentLoaded", function () {
	var form = document.getElementById("requestForm");
	if (!form) {
		return;
	}

	var successMessage = document.getElementById("successMessage");
	var lowVolumeWarning = document.getElementById("lowVolumeWarning");
	var confirmLowVolume = document.getElementById("confirmLowVolume");
	var comments = document.getElementById("comments");
	var commentsCounter = document.getElementById("commentsCounter");
	var servicesGroup = document.getElementById("servicesGroup");
	var servicesError = document.getElementById("servicesError");
	var threeplError = document.getElementById("threeplError");
	var i18n = window.TrackFlowI18n;

	function t(key, vars) {
		if (i18n && typeof i18n.t === "function") {
			return i18n.t(key, vars);
		}
		return key;
	}

	var fieldMap = {
		companyName: {
			element: document.getElementById("companyName"),
			error: document.getElementById("companyNameError"),
			messageKey: "validation.companyName"
		},
		contactPerson: {
			element: document.getElementById("contactPerson"),
			error: document.getElementById("contactPersonError"),
			messageKey: "validation.contactPerson"
		},
		corporateEmail: {
			element: document.getElementById("corporateEmail"),
			error: document.getElementById("corporateEmailError"),
			messageKey: "validation.email"
		},
		phone: {
			element: document.getElementById("phone"),
			error: document.getElementById("phoneError"),
			messageKey: "validation.phone"
		},
		website: {
			element: document.getElementById("website"),
			error: document.getElementById("websiteError"),
			messageKey: "validation.website"
		},
		operatingCountry: {
			element: document.getElementById("operatingCountry"),
			error: document.getElementById("operatingCountryError"),
			messageKey: "validation.country"
		},
		productType: {
			element: document.getElementById("productType"),
			error: document.getElementById("productTypeError"),
			messageKey: "validation.product"
		},
		shippingVolume: {
			element: document.getElementById("shippingVolume"),
			error: document.getElementById("shippingVolumeError"),
			messageKey: "validation.volume"
		},
		comments: {
			element: document.getElementById("comments"),
			error: document.getElementById("commentsError"),
			messageKey: "validation.comments"
		},
		privacyPolicy: {
			element: document.getElementById("privacyPolicy"),
			error: document.getElementById("privacyPolicyError"),
			messageKey: "validation.privacy"
		}
	};

	var serviceCheckboxes = Array.from(document.querySelectorAll(".service-checkbox"));
	var threeplRadios = Array.from(document.querySelectorAll('input[name="threepl"]'));
	var lowVolumeConfirmed = false;

	function setNeutralState(field) {
		field.setAttribute("aria-invalid", "false");
		field.classList.remove("border-red-500", "border-green-500", "focus:ring-red-200", "focus:ring-green-200");
		field.classList.add("border-slate-300", "focus:ring-orange-200");
	}

	function setErrorState(field) {
		field.setAttribute("aria-invalid", "true");
		field.classList.remove("border-slate-300", "border-green-500", "focus:ring-orange-200", "focus:ring-green-200");
		field.classList.add("border-red-500", "focus:ring-red-200");
	}

	function setValidState(field) {
		field.setAttribute("aria-invalid", "false");
		field.classList.remove("border-slate-300", "border-red-500", "focus:ring-orange-200", "focus:ring-red-200");
		field.classList.add("border-green-500", "focus:ring-green-200");
	}

	function showError(errorEl, message) {
		errorEl.textContent = message;
		errorEl.classList.remove("hidden");
	}

	function hideError(errorEl) {
		errorEl.textContent = "";
		errorEl.classList.add("hidden");
	}

	function validateCompanyName() {
		var value = fieldMap.companyName.element.value.trim();
		if (value.length < 2) {
			setErrorState(fieldMap.companyName.element);
			showError(fieldMap.companyName.error, t(fieldMap.companyName.messageKey));
			return false;
		}
		setValidState(fieldMap.companyName.element);
		hideError(fieldMap.companyName.error);
		return true;
	}

	function validateContactPerson() {
		var value = fieldMap.contactPerson.element.value.trim();
		var words = value.split(/\s+/).filter(Boolean);
		if (words.length < 2) {
			setErrorState(fieldMap.contactPerson.element);
			showError(fieldMap.contactPerson.error, t(fieldMap.contactPerson.messageKey));
			return false;
		}
		setValidState(fieldMap.contactPerson.element);
		hideError(fieldMap.contactPerson.error);
		return true;
	}

	function validateCorporateEmail() {
		var value = fieldMap.corporateEmail.element.value.trim();
		var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(value)) {
			setErrorState(fieldMap.corporateEmail.element);
			showError(fieldMap.corporateEmail.error, t(fieldMap.corporateEmail.messageKey));
			return false;
		}
		setValidState(fieldMap.corporateEmail.element);
		hideError(fieldMap.corporateEmail.error);
		return true;
	}

	function validatePhone() {
		var value = fieldMap.phone.element.value.trim();
		if (!/^\+[\d\s().-]+$/.test(value)) {
			setErrorState(fieldMap.phone.element);
			showError(fieldMap.phone.error, t(fieldMap.phone.messageKey));
			return false;
		}
		setValidState(fieldMap.phone.element);
		hideError(fieldMap.phone.error);
		return true;
	}

	function validateWebsite() {
		var value = fieldMap.website.element.value.trim();
		if (value === "") {
			setNeutralState(fieldMap.website.element);
			hideError(fieldMap.website.error);
			return true;
		}
		if (!/^https?:\/\//i.test(value)) {
			setErrorState(fieldMap.website.element);
			showError(fieldMap.website.error, t(fieldMap.website.messageKey));
			return false;
		}
		try {
			new URL(value);
		} catch (error) {
			setErrorState(fieldMap.website.element);
			showError(fieldMap.website.error, t(fieldMap.website.messageKey));
			return false;
		}
		setValidState(fieldMap.website.element);
		hideError(fieldMap.website.error);
		return true;
	}

	function validateSelect(fieldKey) {
		var item = fieldMap[fieldKey];
		if (!item.element.value) {
			setErrorState(item.element);
			showError(item.error, t(item.messageKey));
			return false;
		}
		setValidState(item.element);
		hideError(item.error);
		return true;
	}

	function validateComments() {
		var length = fieldMap.comments.element.value.length;
		commentsCounter.textContent = t("validation.counter", { count: length });
		if (length > 500) {
			setErrorState(fieldMap.comments.element);
			showError(fieldMap.comments.error, t(fieldMap.comments.messageKey, { remaining: Math.max(0, 500 - length) }));
			return false;
		}
		if (length === 0) {
			setNeutralState(fieldMap.comments.element);
		} else {
			setValidState(fieldMap.comments.element);
		}
		hideError(fieldMap.comments.error);
		return true;
	}

	function validatePrivacyPolicy() {
		if (!fieldMap.privacyPolicy.element.checked) {
			setErrorState(fieldMap.privacyPolicy.element);
			showError(fieldMap.privacyPolicy.error, t(fieldMap.privacyPolicy.messageKey));
			return false;
		}
		setValidState(fieldMap.privacyPolicy.element);
		hideError(fieldMap.privacyPolicy.error);
		return true;
	}

	function validateServices() {
		var hasSelection = serviceCheckboxes.some(function (checkbox) {
			return checkbox.checked;
		});
		serviceCheckboxes.forEach(function (checkbox) {
			checkbox.setAttribute("aria-invalid", hasSelection ? "false" : "true");
		});
		servicesGroup.classList.remove("border-slate-200", "border-red-500", "border-green-500");
		if (!hasSelection) {
			servicesGroup.classList.add("border-red-500");
			showError(servicesError, t("validation.services"));
			return false;
		}
		servicesGroup.classList.add("border-green-500");
		hideError(servicesError);
		return true;
	}

	function validateThreepl() {
		var checked = threeplRadios.some(function (radio) {
			return radio.checked;
		});
		threeplRadios.forEach(function (radio) {
			radio.setAttribute("aria-invalid", checked ? "false" : "true");
		});
		if (!checked) {
			showError(threeplError, t("validation.threepl"));
			return false;
		}
		hideError(threeplError);
		return true;
	}

	function shouldShowLowVolumeWarning() {
		return fieldMap.shippingVolume.element.value === "0-100" && fieldMap.productType.element.value !== "";
	}

	function refreshLowVolumeWarning() {
		if (shouldShowLowVolumeWarning()) {
			lowVolumeWarning.classList.remove("hidden");
		} else {
			lowVolumeWarning.classList.add("hidden");
			lowVolumeConfirmed = false;
		}
	}

	function firstInvalidElement() {
		if (!validateCompanyName()) return fieldMap.companyName.element;
		if (!validateContactPerson()) return fieldMap.contactPerson.element;
		if (!validateCorporateEmail()) return fieldMap.corporateEmail.element;
		if (!validatePhone()) return fieldMap.phone.element;
		if (!validateWebsite()) return fieldMap.website.element;
		if (!validateSelect("operatingCountry")) return fieldMap.operatingCountry.element;
		if (!validateSelect("productType")) return fieldMap.productType.element;
		if (!validateSelect("shippingVolume")) return fieldMap.shippingVolume.element;
		if (!validateServices()) return serviceCheckboxes[0] || servicesGroup;
		if (!validateThreepl()) return threeplRadios[0];
		if (!validateComments()) return fieldMap.comments.element;
		if (!validatePrivacyPolicy()) return fieldMap.privacyPolicy.element;
		return null;
	}

	function clearAllValidationStates() {
		Object.keys(fieldMap).forEach(function (key) {
			var field = fieldMap[key].element;
			setNeutralState(field);
			hideError(fieldMap[key].error);
		});
		servicesGroup.classList.remove("border-red-500", "border-green-500");
		servicesGroup.classList.add("border-slate-200");
		serviceCheckboxes.forEach(function (checkbox) {
			checkbox.setAttribute("aria-invalid", "false");
		});
		threeplRadios.forEach(function (radio) {
			radio.setAttribute("aria-invalid", "false");
		});
		hideError(servicesError);
		hideError(threeplError);
		commentsCounter.textContent = t("validation.counter", { count: 0 });
		lowVolumeWarning.classList.add("hidden");
		lowVolumeConfirmed = false;
	}

	function refreshVisibleMessages() {
		Object.keys(fieldMap).forEach(function (key) {
			var item = fieldMap[key];
			if (!item.error.classList.contains("hidden")) {
				if (key === "comments") {
					showError(item.error, t(item.messageKey, { remaining: Math.max(0, 500 - item.element.value.length) }));
				} else {
					showError(item.error, t(item.messageKey));
				}
			}
		});

		if (!servicesError.classList.contains("hidden")) {
			showError(servicesError, t("validation.services"));
		}
		if (!threeplError.classList.contains("hidden")) {
			showError(threeplError, t("validation.threepl"));
		}
		commentsCounter.textContent = t("validation.counter", { count: fieldMap.comments.element.value.length });
	}

	fieldMap.companyName.element.addEventListener("blur", validateCompanyName);
	fieldMap.companyName.element.addEventListener("input", validateCompanyName);

	fieldMap.contactPerson.element.addEventListener("blur", validateContactPerson);
	fieldMap.contactPerson.element.addEventListener("input", validateContactPerson);

	fieldMap.corporateEmail.element.addEventListener("blur", validateCorporateEmail);
	fieldMap.corporateEmail.element.addEventListener("input", validateCorporateEmail);

	fieldMap.phone.element.addEventListener("blur", validatePhone);
	fieldMap.phone.element.addEventListener("input", validatePhone);

	fieldMap.website.element.addEventListener("blur", validateWebsite);
	fieldMap.website.element.addEventListener("input", validateWebsite);

	fieldMap.operatingCountry.element.addEventListener("blur", function () {
		validateSelect("operatingCountry");
	});
	fieldMap.operatingCountry.element.addEventListener("change", function () {
		validateSelect("operatingCountry");
	});

	fieldMap.productType.element.addEventListener("blur", function () {
		validateSelect("productType");
		refreshLowVolumeWarning();
	});
	fieldMap.productType.element.addEventListener("change", function () {
		validateSelect("productType");
		refreshLowVolumeWarning();
		lowVolumeConfirmed = false;
	});

	fieldMap.shippingVolume.element.addEventListener("blur", function () {
		validateSelect("shippingVolume");
		refreshLowVolumeWarning();
	});
	fieldMap.shippingVolume.element.addEventListener("change", function () {
		validateSelect("shippingVolume");
		refreshLowVolumeWarning();
		lowVolumeConfirmed = false;
	});

	serviceCheckboxes.forEach(function (checkbox) {
		checkbox.addEventListener("change", validateServices);
	});

	threeplRadios.forEach(function (radio) {
		radio.addEventListener("change", validateThreepl);
	});

	comments.addEventListener("blur", validateComments);
	comments.addEventListener("input", validateComments);

	fieldMap.privacyPolicy.element.addEventListener("change", validatePrivacyPolicy);
	fieldMap.privacyPolicy.element.addEventListener("blur", validatePrivacyPolicy);

	confirmLowVolume.addEventListener("click", function () {
		lowVolumeConfirmed = true;
		lowVolumeWarning.classList.add("hidden");
	});

	form.addEventListener("submit", function (event) {
		event.preventDefault();
		var invalidElement = firstInvalidElement();
		refreshLowVolumeWarning();

		if (invalidElement) {
			invalidElement.scrollIntoView({ behavior: "smooth", block: "center" });
			invalidElement.focus();
			return;
		}

		if (shouldShowLowVolumeWarning() && !lowVolumeConfirmed) {
			lowVolumeWarning.classList.remove("hidden");
			lowVolumeWarning.scrollIntoView({ behavior: "smooth", block: "center" });
			confirmLowVolume.focus();
			return;
		}

		form.classList.add("hidden");
		successMessage.classList.remove("hidden");
		successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
	});

	form.addEventListener("reset", function () {
		setTimeout(function () {
			clearAllValidationStates();
		}, 0);
	});

	document.addEventListener("trackflow:language-changed", function () {
		refreshVisibleMessages();
	});
});
