"use strict";
const LoginModule = (function () {
  let form = null;
  let emailInput = null;
  let passwordInput = null;
  let togglePasswordIcon = null;

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

  const togglePasswordVisibility = () => {
    if (!togglePasswordIcon || !passwordInput) return;
    togglePasswordIcon.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      togglePasswordIcon.classList.toggle("bi-eye-slash", type === "password");
      togglePasswordIcon.classList.toggle("bi-eye", type === "text");
    });
  };

  const submitForm = () => {
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailValid = validateEmail();
      const passValid = validatePassword();
      if (!emailValid || !passValid) return;

      const email = emailInput?.value.trim();
      const password = passwordInput?.value.trim();
      if (!email || !password) return;

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          await fetch(`/api/user/updatestatus/${data.user._id}`);

          Swal.fire({
            text: "You have successfully logged in!",
            icon: "success",
            width: "480px",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
              popup: "swal2-popup swal2-theme-default",
            },
          }).then(() => {
            form?.reset();
            window.location.href = "/health";
          });
        } else {
          Swal.fire({
            text: data.message || "Login failed. Please try again.",
            icon: "error",
            width: "480px",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
              popup: "swal2-popup swal2-theme-default",
            },
          });
        }
      } catch (error) {
        Swal.fire({
          text: "Something went wrong. Please try again.",
          icon: "error",
          width: "480px",
          buttonsStyling: false,
          confirmButtonText: "Ok, got it!",
          customClass: {
            confirmButton: "btn btn-primary",
            popup: "swal2-popup swal2-theme-default",
          },
        });
      }
    });
  };

  return {
    init: () => {
      form = document.querySelector("form");
      emailInput = document.querySelector("#email");
      passwordInput = document.querySelector("#password");
      togglePasswordIcon = document.querySelector("#togglePassword");

      emailInput?.addEventListener("input", validateEmail);
      passwordInput?.addEventListener("input", validatePassword);

      togglePasswordVisibility();
      submitForm();
    },
  };
})();

window.addEventListener("DOMContentLoaded", () => {
  LoginModule.init();
});
