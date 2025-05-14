"use strict";
var KTAddProperty = (function () {
  var form, submitButton, validator;
  var imageInput, previewContainer;
  var addressSelect, ownerSelect, listingTypeSelect, typeSelect;

  const initSelect2AndRevalidate = () => {
    const selectPairs = [
      { el: addressSelect, name: "addressId" },
      { el: ownerSelect, name: "ownerId" },
      { el: listingTypeSelect, name: "listingType" },
      { el: typeSelect, name: "propertyType" },
    ];
    selectPairs.forEach(({ el, name }) => {
      $(el).select2();
      $(el).on("change", () => validator.revalidateField(name));
    });
  };

  const populateSelectOptions = async () => {
    try {
      const addressRes = await fetch("/api/address/get");
      const addresses = await addressRes.json();
      addressSelect.innerHTML = `<option></option>`;
      addresses.data.forEach((addr) => {
        const option = new Option(`${addr.city}, ${addr.district}`, addr._id);
        addressSelect.appendChild(option);
      });

      const userRes = await fetch("/api/user/get");
      const users = await userRes.json();
      ownerSelect.innerHTML = `<option></option>`;
      users.data
        .filter((u) => u.role === "AGENT")
        .forEach((user) => {
          const option = new Option(user.name, user._id);
          ownerSelect.appendChild(option);
        });

      initSelect2AndRevalidate();
    } catch (error) {
      Swal.fire("Error", "Failed to load address or owner data.", "error");
    }
  };

  const initImagePreview = () => {
    imageInput.addEventListener("change", () => {
      previewContainer.innerHTML = "";
      [...imageInput.files].forEach((file) => {
        if (!file.type.startsWith("image/jpeg")) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          Object.assign(img.style, {
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "8px",
            border: "1px solid #ddd",
            marginRight: "10px",
          });
          previewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    });
  };

  const handleSubmit = () => {
    submitButton.addEventListener("click", (e) => {
      e.preventDefault();

      validator.validate().then((status) => {
        if (status === "Valid") {
          const images = [...imageInput.files];
          if (images.length < 2 || images.length > 5) {
            Swal.fire("Image Error", "Upload 2-5 JPEG images only.", "error");
            return;
          }
          const formData = new FormData();

          // Append all form values manually
          formData.append("ownerId", ownerSelect.value);
          formData.append("addressId", addressSelect.value);
          formData.append("propertyType", propertyTypeSelect.value);
          formData.append("status", listingTypeSelect.value);

          formData.append(
            "title",
            form.querySelector('[name="property_name"]').value
          );
          formData.append(
            "description",
            form.querySelector('[name="property_description"]').value
          );
          formData.append(
            "size",
            form.querySelector('[name="property_size"]').value
          );
          formData.append("price", form.querySelector('[name="price"]').value);
          formData.append(
            "bedrooms",
            form.querySelector('[name="bedrooms"]').value
          );
          formData.append(
            "parking",
            form.querySelector('[name="parking"]').value
          );
          formData.append(
            "location",
            form.querySelector('[name="location"]').value
          );

          // Append images
          images.forEach((file) => {
            formData.append("images", file);
          });

          submitButton.setAttribute("data-kt-indicator", "on");
          submitButton.disabled = true;
          console.log(formData);
          fetch("/api/property/add", {
            method: "POST",
            body: formData,
          })
            .then((res) => res.json())
            .then((data) => {
              submitButton.removeAttribute("data-kt-indicator");
              submitButton.disabled = false;

              if (data.success) {
                Swal.fire(
                  "Success",
                  "Property added successfully!",
                  "success"
                ).then(() => {
                  window.location.href = "/admin/properties";
                });
              } else {
                Swal.fire(
                  "Error",
                  data.message || "Something went wrong.",
                  "error"
                );
              }
            })
            .catch((err) => {
              console.error("Add Property Error:", err);
              Swal.fire("Error", "Server error occurred.", "error");
              submitButton.removeAttribute("data-kt-indicator");
              submitButton.disabled = false;
            });
        } else {
          Swal.fire(
            "Invalid Form",
            "Please fill all required fields correctly.",
            "error"
          );
        }
      });
    });
  };

  const initValidation = () => {
    validator = FormValidation.formValidation(form, {
      fields: {
        property_name: {
          validators: {
            notEmpty: { message: "Property name is required" },
          },
        },
        property_description: {
          validators: {
            notEmpty: { message: "Description is required" },
          },
        },
        property_size: {
          validators: {
            notEmpty: { message: "Size is required" },
            numeric: { message: "Size must be a number" },
          },
        },
        price: {
          validators: {
            notEmpty: { message: "Price is required" },
            numeric: { message: "Price must be numeric" },
          },
        },
        listingType: {
          validators: {
            notEmpty: { message: "Listing type is required" },
          },
        },
        propertyType: {
          validators: {
            notEmpty: { message: "Property type is required" },
          },
        },
        addressId: {
          validators: {
            notEmpty: { message: "Address is required" },
          },
        },
        ownerId: {
          validators: {
            notEmpty: { message: "Owner (agent) is required" },
          },
        },
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap5: new FormValidation.plugins.Bootstrap5({
          rowSelector: ".fv-row",
        }),
        submitButton: new FormValidation.plugins.SubmitButton(),
      },
    });
  };

  return {
    init: async function () {
      form = document.querySelector("#kt_ecommerce_add_property_form");
      submitButton = document.querySelector(
        "#kt_ecommerce_add_properyt_submit"
      );
      imageInput = document.getElementById("property_images");
      previewContainer = document.getElementById("image_preview_container");

      addressSelect = document.getElementById("areaselect");
      ownerSelect = document.getElementById("ownerAgentSelect");
      listingTypeSelect = document.getElementById("listingTypeSelect");
      typeSelect = document.getElementById("propertyTypeSelect");

      await populateSelectOptions();
      initImagePreview();
      initValidation();
      handleSubmit();
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTAddProperty.init();
});
