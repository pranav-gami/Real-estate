"use strict";

const AdminLoginModule = (function () {
  let form = null;
  let emailInput = null;
  let passwordInput = null;
  let togglePasswordIcon = null;
  let loginErrorDiv = null;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const showError = (message) => {
    if (loginErrorDiv) loginErrorDiv.textContent = message;
  };

  const clearError = () => {
    if (loginErrorDiv) loginErrorDiv.textContent = "";
  };

  const validateField = (input, isValid) => {
    if (!input) return;
    input.style.boxShadow = isValid
      ? "0 0 0 0.2rem rgba(59, 113, 230, 0.25)"
      : "0 0 0 0.2rem rgba(205, 74, 74, 0.25)";
    input.style.borderColor = isValid ? "#2563eb" : "#dc3545";
  };

  const validateEmail = () => {
    if (!emailInput) return false;
    const value = emailInput.value.trim();
    const isValid = value && emailPattern.test(value);
    validateField(emailInput, isValid);
    return isValid;
  };

  const validatePassword = () => {
    if (!passwordInput) return false;
    const value = passwordInput.value.trim();
    const isValid = value && passwordRegex.test(value);
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
      clearError();

      const emailVal = emailInput.value.trim();
      const passwordVal = passwordInput.value.trim();

      if (!emailVal || !passwordVal) {
        showError("Please fill all mandatory fields.");
        validateField(emailInput, !!emailVal);
        validateField(passwordInput, !!passwordVal);
        return;
      }

      const emailValid = validateEmail();
      const passValid = validatePassword();

      if (!emailValid) {
        showError("Enter a valid email address.");
        return;
      }

      if (!passValid) {
        showError(
          "Password must contains 8 character with Uppercase,lowecase ,special character and Digits."
        );
        return;
      }

      try {
        const res = await fetch("/api/auth/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailVal, password: passwordVal }),
        });

        const data = await res.json();
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          Swal.fire({
            text: "Admin logged in successfully!",
            icon: "success",
            width: "480px",
            timer: 2000,
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
              confirmButton: "btn btn-primary",
              popup: "swal2-popup swal2-theme-default",
            },
            willClose: () => {
              form.reset();
              window.location.href = "/admin/dashboard";
            },
          });
        } else {
          showError(data.message || "Login failed. Please try again.");
        }
      } catch (error) {
        showError("Something went wrong. Please try again.");
      }
    });
  };

  return {
    init: () => {
      form = document.querySelector("form");
      emailInput = document.querySelector("#email");
      passwordInput = document.querySelector("#password");
      togglePasswordIcon = document.querySelector("#togglePassword");
      loginErrorDiv = document.querySelector("#loginError");

      emailInput?.addEventListener("input", () => {
        validateEmail();
        clearError();
      });

      passwordInput?.addEventListener("input", () => {
        validatePassword();
        clearError();
      });

      togglePasswordVisibility();
      submitForm();
    },
  };
})();

window.addEventListener("DOMContentLoaded", () => {
  AdminLoginModule.init();
});
