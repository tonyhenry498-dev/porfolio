// contact.js - Contact form validation

const form = document.getElementById("contactForm");
const successBox = document.getElementById("formSuccess");
const msgCount = document.getElementById("msgCount");

const fields = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  message: document.getElementById("message"),
};

function isEmpty(value) {
  return value.trim() === "";
}

function isValidEmail(value) {
  // simple pattern: something@something.something
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isDigitsOnly(value) {
  return /^[0-9]+$/.test(value.trim());
}

function showError(field, message) {
  document.getElementById(field.id + "Error").textContent = message;
  field.classList.add("invalid");
  field.setAttribute("aria-invalid", "true");
}

function clearError(field) {
  document.getElementById(field.id + "Error").textContent = "";
  field.classList.remove("invalid");
  field.removeAttribute("aria-invalid");
}

function validateField(key) {
  const field = fields[key];
  const value = field.value;
  clearError(field);

  if (isEmpty(value)) {
    showError(field, "This field cannot be empty.");
    return false;
  }
  if (key === "email" && !isValidEmail(value)) {
    showError(field, "Enter a valid email address, for example name@example.com.");
    return false;
  }
  if (key === "phone") {
    if (!isDigitsOnly(value)) {
      showError(field, "Use digits only, with no spaces or symbols.");
      return false;
    }
    if (value.trim().length < 10 || value.trim().length > 14) {
      showError(field, "Enter a phone number between 10 and 14 digits.");
      return false;
    }
  }
  if (key === "message" && value.trim().length < 10) {
    showError(field, "Write at least 10 characters so I know how to help.");
    return false;
  }
  return true;
}

// Live validation when a user leaves a field
Object.keys(fields).forEach(function (key) {
  fields[key].addEventListener("blur", function () { validateField(key); });
});

// Live character count
fields.message.addEventListener("input", function () {
  msgCount.textContent = fields.message.value.length;
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  successBox.style.display = "none";

  let firstInvalid = null;
  Object.keys(fields).forEach(function (key) {
    if (!validateField(key) && !firstInvalid) firstInvalid = fields[key];
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  successBox.textContent =
    "Thank you, " + fields.name.value.trim() + ". Your message has been sent.";
  successBox.style.display = "block";
  form.reset();
  msgCount.textContent = "0";
});
