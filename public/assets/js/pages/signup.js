"use strict";
const SignupModule = (function () {
  let form = null;
  let nameInput = null;
  let emailInput = null;
  let passwordInput = null;
  let confirmPasswordInput = null;
  let togglePasswordIcon = null;
  let toggleConfirmPasswordIcon = null;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (input, isValid) => {
    if (!input) return;
    if (isValid) {
      input.style.boxShadow = "0 0 0 0.2rem rgba(59, 113, 230, 0.25)";
      input.style.borderColor = "#2563eb";
    } else {
      input.style.boxShadow = "0 0 0 0.2rem rgba(205, 74, 74, 0.25)";
      input.style.borderColor = "#dc3545";
    }
  };

  const validateName = () => {
    if (!nameInput) return false;
    const value = nameInput.value.trim();
    const isValid = value.length >= 3;
    validateField(nameInput, isValid);
    return isValid;
  };

  const validateEmail = () => {
    if (!emailInput) return false;
    const value = emailInput.value.trim();
    const isValid = value && emailPattern.test(value);
    validateField(emailInput, !!isValid);
    return !!isValid;
  };

  const validatePassword = () => {
    if (!passwordInput) return false;
    const value = passwordInput.value.trim();
    const isValid = passwordRegex.test(value);
    validateField(passwordInput, isValid);
    return isValid;
  };

  const validateConfirmPassword = () => {
    if (!confirmPasswordInput || !passwordInput) return false;
    const value = confirmPasswordInput.value.trim();
    const isValid = value === passwordInput.value.trim() && value.length > 0;
    validateField(confirmPasswordInput, isValid);
    return isValid;
  };

  const togglePasswordVisibility = (icon, input) => {
    if (!icon || !input) return;
    icon.addEventListener("click", () => {
      const type = input.type === "password" ? "text" : "password";
      input.type = type;
      icon.classList.toggle("bi-eye-slash", type === "password");
      icon.classList.toggle("bi-eye", type === "text");
    });
  };

  const showSwal = (text, icon = "error") => {
    Swal.fire({
      text,
      icon,
      width: "480px",
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-primary",
        popup: "swal2-popup swal2-theme-default",
      },
    });
  };

  const submitForm = () => {
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameValid = validateName();
      const emailValid = validateEmail();
      const passValid = validatePassword();
      const confirmPassValid = validateConfirmPassword();

      if (!nameValid || !emailValid || !passValid || !confirmPassValid) {
        showSwal("Please fill all fields correctly.");
        return;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      try {
        const res = await fetch("/api/user/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();

        if (data.success) {
          Swal.fire({
            text: "Account created successfully!",
            icon: "success",
            width: "480px",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
              popup: "swal2-popup swal2-theme-default",
            },
          }).then(() => {
            form.reset();
            window.location.href = "/signin";
          });
        } else {
          showSwal(data.message || "Signup failed. Please try again.");
        }
      } catch (error) {
        showSwal("Something went wrong. Please try again.");
      }
    });
  };

  return {
    init: () => {
      form = document.querySelector("#signupForm");
      nameInput = document.querySelector("#name");
      emailInput = document.querySelector("#email");
      passwordInput = document.querySelector("#password");
      confirmPasswordInput = document.querySelector("#confirmPassword");
      togglePasswordIcon = document.querySelector("#togglePassword");
      toggleConfirmPasswordIcon = document.querySelector(
        "#toggleConfirmPassword"
      );

      nameInput?.addEventListener("input", validateName);
      emailInput?.addEventListener("input", validateEmail);
      passwordInput?.addEventListener("input", validatePassword);
      confirmPasswordInput?.addEventListener("input", validateConfirmPassword);

      togglePasswordVisibility(togglePasswordIcon, passwordInput);
      togglePasswordVisibility(toggleConfirmPasswordIcon, confirmPasswordInput);

      submitForm();
    },
  };
})();

window.addEventListener("DOMContentLoaded", () => {
  SignupModule.init();
});
