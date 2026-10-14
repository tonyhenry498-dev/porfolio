// contact.js - Contact form validation

const form = document.getElementById("contactForm");
const successBox = document.getElementById("formSuccess");

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
}

function clearError(field) {
  document.getElementById(field.id + "Error").textContent = "";
  field.classList.remove("invalid");
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
    showError(field, "Please enter a valid email address (e.g. name@example.com).");
    return false;
  }
  if (key === "phone" && !isDigitsOnly(value)) {
    showError(field, "Phone number must contain digits only.");
    return false;
  }
  return true;
}

// Live validation when a user leaves a field
Object.keys(fields).forEach(function (key) {
  fields[key].addEventListener("blur", function () { validateField(key); });
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  successBox.style.display = "none";

  let allValid = true;
  Object.keys(fields).forEach(function (key) {
    if (!validateField(key)) allValid = false;
  });

  if (allValid) {
    successBox.textContent =
      "Thank you, " + fields.name.value.trim() + "! Your message has been sent successfully.";
    successBox.style.display = "block";
    form.reset();
  }
});
