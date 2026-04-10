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

	var fieldMap = {
		companyName: {
			element: document.getElementById("companyName"),
			error: document.getElementById("companyNameError"),
			message: "Company name must have at least 2 characters"
		},
		contactPerson: {
			element: document.getElementById("contactPerson"),
			error: document.getElementById("contactPersonError"),
			message: "Enter first and last name of contact"
		},
		corporateEmail: {
			element: document.getElementById("corporateEmail"),
			error: document.getElementById("corporateEmailError"),
			message: "Enter a valid corporate email (example: name@company.com)"
		},
		phone: {
			element: document.getElementById("phone"),
			error: document.getElementById("phoneError"),
			message: "Phone must include country code (example: +1 213 555 0147)"
		},
		website: {
			element: document.getElementById("website"),
			error: document.getElementById("websiteError"),
			message: "If you include website, it must be a valid URL"
		},
		operatingCountry: {
			element: document.getElementById("operatingCountry"),
			error: document.getElementById("operatingCountryError"),
			message: "Select main operating country"
		},
		productType: {
			element: document.getElementById("productType"),
			error: document.getElementById("productTypeError"),
			message: "Select the type of product you handle"
		},
		shippingVolume: {
			element: document.getElementById("shippingVolume"),
			error: document.getElementById("shippingVolumeError"),
			message: "Select estimated monthly volume"
		},
		comments: {
			element: document.getElementById("comments"),
			error: document.getElementById("commentsError"),
			message: "Comments cannot exceed 500 characters"
		},
		privacyPolicy: {
			element: document.getElementById("privacyPolicy"),
			error: document.getElementById("privacyPolicyError"),
			message: "You must accept the privacy policy to continue"
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
			showError(fieldMap.companyName.error, fieldMap.companyName.message);
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
			showError(fieldMap.contactPerson.error, fieldMap.contactPerson.message);
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
			showError(fieldMap.corporateEmail.error, fieldMap.corporateEmail.message);
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
			showError(fieldMap.phone.error, fieldMap.phone.message);
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
			showError(fieldMap.website.error, fieldMap.website.message);
			return false;
		}
		try {
			new URL(value);
		} catch (error) {
			setErrorState(fieldMap.website.element);
			showError(fieldMap.website.error, fieldMap.website.message);
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
			showError(item.error, item.message);
			return false;
		}
		setValidState(item.element);
		hideError(item.error);
		return true;
	}

	function validateComments() {
		var length = fieldMap.comments.element.value.length;
		commentsCounter.textContent = length + " / 500 characters";
		if (length > 500) {
			setErrorState(fieldMap.comments.element);
			showError(fieldMap.comments.error, fieldMap.comments.message);
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
			showError(fieldMap.privacyPolicy.error, fieldMap.privacyPolicy.message);
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
			showError(servicesError, "Select at least one service of interest");
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
			showError(threeplError, "Indicate if you currently work with another logistics provider");
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
		commentsCounter.textContent = "0 / 500 characters";
		lowVolumeWarning.classList.add("hidden");
		lowVolumeConfirmed = false;
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
});
