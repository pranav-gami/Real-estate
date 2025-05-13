document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user")) || null;

  // FETCH REQUESTED PROPERTYID FROM URL
  function getPropertyIdFromURL() {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const propertyIndex = pathParts.indexOf("property");

    if (propertyIndex !== -1 && pathParts[propertyIndex + 1]) {
      const propertyId = pathParts[propertyIndex + 1];
      const objectIdPattern = /^[a-f\d]{24}$/i;
      if (objectIdPattern.test(propertyId)) {
        return propertyId;
      }
    }
    return null;
  }

  // UTILITY FUNCTION TO FORMAT PRICE(INR)
  function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  }

  // FETCHING PROPERTIES FROM DATABASE
  async function fetchPropertyDetails(id) {
    try {
      const response = await fetch(`/api/property/get/${id}`);
      const result = await response.json();

      if (!result.success) {
        Swal.fire("Error", "Failed to fetch property details.", "error");
        return;
      }

      const property = result.data;
      populatePropertyDetails(property);
      setupInquiryForm(property._id);
    } catch (err) {
      Swal.fire(
        "Error",
        "An error occurred while fetching property details.",
        "error"
      );
      console.error(err);
    }
  }

  // SETTING ALL PROPERTIES DETAILS (MANIPULATING DOM ELEMENTS)
  function populatePropertyDetails(property) {
    document.querySelector(".property_title").textContent =
      property.title || "";
    document.querySelector(
      ".property_location"
    ).innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${
      property.addressId.city || "N/A"
    }, ${property.addressId.district || "N/A"}`;
    document.querySelector(
      ".property_address"
    ).innerHTML = `<i class="bi bi-geo-alt"></i> ${
      property.addressId.city || ""
    }, ${property.addressId.district || ""}, ${property.addressId.state || ""}`;
    const mapLink = document.querySelector(".map_link");
    if (mapLink) mapLink.href = property.location || "";

    document.querySelector(".description_section p").textContent =
      property.description || "";
    document.querySelector(".sellerName").textContent =
      property.ownerId.name || "N/A";
    document.querySelector(".sellerContact").textContent =
      property.ownerId.phone || "N/A";

    const formattedPrice = formatPrice(property.price || 0);
    const priceText =
      property.status === "Sale"
        ? `${formattedPrice}`
        : `${formattedPrice} ${
            property.propertyType === "Villa" ? "/day" : "/month"
          }`;
    document.querySelector(".property_price").textContent = priceText;
    document.querySelector(".price-box p").textContent = `Available for ${
      property.status.toLowerCase() || "N/A"
    }`;

    buildImageSlider(property);
    populateBasicInfo(property);
  }

  function populateBasicInfo(property) {
    const infoBoxes = document.querySelector(".info_boxes");
    if (!infoBoxes) return;

    infoBoxes.innerHTML = "";
    if ((property.propertyType || "").toLowerCase() !== "plot") {
      infoBoxes.innerHTML += `
        <div class="info_box"><i class="bi bi-house-door"></i><p>${
          property.bedrooms ?? "0"
        } Beds</p></div>
        <div class="info_box"><i class="bi bi-car-front-fill"></i><p>${
          property.parking ?? "0"
        } Parking</p></div>
        <div class="info_box"><i class="bi bi-arrows-fullscreen"></i><p>${
          property.size ?? "N/A"
        } sqft</p></div>
      `;
    } else {
      infoBoxes.innerHTML += `
        <div class="info_box"><i class="bi bi-arrows-fullscreen"></i><p>${
          property.size ?? "N/A"
        } sqft</p></div>
      `;
    }
  }

  // CRAETING SLIDER OD PROPERTIES IMAGES
  function buildImageSlider(property) {
    const slidesContainer = document.querySelector(".slides");
    if (!slidesContainer) return;

    slidesContainer.innerHTML = "";
    if (!Array.isArray(property.images)) return;

    property.images.forEach((img, idx) => {
      const imgTag = document.createElement("img");
      imgTag.src = `/assets/media/properties/${img}`;
      imgTag.alt = `${property.title} image ${idx + 1}`;
      if (idx === 0) imgTag.classList.add("active");
      slidesContainer.appendChild(imgTag);
    });

    buildSliderControls(property.images.length);
  }

  function buildSliderControls(numSlides) {
    const slides = document.querySelectorAll(".slides img");
    const controls = document.querySelector(".slider-controls");
    if (!controls) return;

    controls.innerHTML = "";

    let currentSlide = 0;
    let slideInterval;

    slides.forEach((_, idx) => {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (idx === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        showSlide(idx);
        restartAutoSlide();
      });
      controls.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dot");

    function showSlide(index) {
      slides.forEach((img, i) => {
        img.classList.toggle("active", i === index);
        dots[i]?.classList.toggle("active", i === index);
      });
      currentSlide = index;
    }

    function nextSlide() {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    }

    function startAutoSlide() {
      slideInterval = setInterval(nextSlide, 3000);
    }

    function restartAutoSlide() {
      clearInterval(slideInterval);
      startAutoSlide();
    }

    showSlide(currentSlide);
    startAutoSlide();
  }

  // INQUIRY FORM HANDELING
  function setupInquiryForm(propertyId) {
    const form = document.getElementById("inquiryForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleInquiryFormSubmit(propertyId);
    });
  }

  async function handleInquiryFormSubmit(propertyId) {
    const errorDiv = document.querySelector("#loginError");
    const inquiryText = document.getElementById("userQuery")?.value.trim();
    const contactNumber = document
      .getElementById("contactNumber")
      ?.value.trim();

    if (!inquiryText || !contactNumber) {
      errorDiv.textContent = "Please Fill All mandetory Fields";
      return;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(contactNumber)) {
      errorDiv.textContent = "Please enter 10 digit Correct Phone number";
      return;
    }

    if (!user || !user._id) {
      Swal.fire("Unauthorized", "Please login to submit an inquiry.", "error");
      return;
    }

    try {
      const response = await fetch("/api/inquiry/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          userId: user._id,
          message: inquiryText,
        }),
      });

      const result = await response.json();
      if (result.success) {
        Swal.fire("Success", "Inquiry sent successfully!", "success");
        document.getElementById("inquiryForm")?.reset();
        const modalElement = document.getElementById("inquiryModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();
      } else {
        Swal.fire(
          "Error",
          result.message || "Failed to send inquiry.",
          "error"
        );
      }
    } catch (err) {
      Swal.fire(
        "Error",
        "Something went wrong. Please try again later.",
        "error"
      );
      console.error(err);
    }
  }

  // INITIALIZATION
  const propertyId = getPropertyIdFromURL();
  if (propertyId) {
    fetchPropertyDetails(propertyId);
  } else {
    Swal.fire("Error", "Invalid property ID in URL.", "error");
  }
});
