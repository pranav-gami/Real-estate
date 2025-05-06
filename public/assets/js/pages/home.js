document.addEventListener("DOMContentLoaded", function () {
  const propertyMenu = document.querySelector(".home_property__menu");

  function showAlert(
    type,
    title,
    text,
    showConfirmButton = true,
    confirmButtonText = "OK"
  ) {
    return Swal.fire({
      icon: type,
      title: title,
      text: text,
      confirmButtonText: confirmButtonText,
      showConfirmButton: showConfirmButton,
      allowOutsideClick: false,
    });
  }

  async function fetchProperties() {
    try {
      const response = await fetch(`/api/property/get`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Data`);
      }
      const result = await response.json();
      if (!result || !Array.isArray(result.data)) {
        throw new Error("Invalid response.");
      }
      const data = result.data;
      propertyMenu.innerHTML = "";

      if (data.length === 0) {
        await showAlert(
          "info",
          "No Properties Found",
          "Currently there are no properties available. Please check back later."
        );
        propertyMenu.innerHTML =
          "<p style='justify-self:center; align-self:center;colspan:3;font-size:2rem'>No properties found.</p>";
        return;
      }

      data.forEach((property) => {
        const propertyCard = createPropertyCard(property);
        propertyMenu.appendChild(propertyCard);
      });
    } catch (error) {
      console.error("Error fetching properties:", error);

      await showAlert(
        "error",
        "Failed to Load Properties",
        "Something went wrong while loading the properties. Please try again.",
        true,
        "Retry"
      );
      fetchProperties();
    }
  }

  function createPropertyCard(property) {
    const card = document.createElement("div");
    card.classList.add("property_card");

    const formattedPrice = Number(property.price).toLocaleString("en-IN");
    const fullAddress = `${property.addressId?.city}, ${property.addressId?.district}, ${property.addressId?.state}`;

    const firstImage =
      property.images && property.images.length > 0
        ? `/assets/media/properties/${property.images[0]}`
        : "/default-property.jpg";

    const showRoomsParking = property.propertyType !== "Plot";

    const bedrooms = property.bedrooms !== undefined ? property.bedrooms : "-";
    const parking = property.parking !== undefined ? property.parking : "-";
    const size = property.size || "-";

    card.innerHTML = `
      <div class="property_image">
        <div class="property_image_overlay"></div>
        <img src="${firstImage}" alt="${property.title}">
        <div class="badges">
          <span class="badge badge_type">${property.propertyType}</span>
          <span class="badge badge_sale">${property.status}</span>
        </div>
        <button class="view_btn" data-id="${
          property._id
        }"><i class="bi bi-eye-fill"></i></button>
      </div>

      <div class="property_content">
        <h3 class="property_title text-truncate d-inline-block" style="max-width: 250px;">
          ${property.title}
        </h3>

        <p class="property_location"><i class="bi bi-geo-alt-fill"></i> ${fullAddress}</p>

        <div class="property_info">
          ${
            showRoomsParking
              ? `
            <div><i class="bi bi-house-door-fill"></i> ${bedrooms} Bedrooms</div>
            <div><i class="bi bi-car-front-fill"></i> ${parking} Parking</div>
            <div><i class="bi bi-arrows-fullscreen"></i> ${size} sqft</div>
          `
              : `<div><i class="bi bi-arrows-fullscreen"></i> ${size} sqft</div>`
          }
        </div>

        <div class="property_footer">
          <span class="proprty_price"><i class="bi bi-currency-rupee"></i>${formattedPrice}</span>
          <a href="/buildstate/property/${
            property._id
          }"><button class="viewProperty_btn">View</button></a>
        </div>
      </div>
    `;

    const eyeBtn = card.querySelector(".view_btn");
    eyeBtn.addEventListener("click", function () {
      const propertyId = this.getAttribute("data-id");
      window.location.href = `/buildstate/property/${propertyId}`;
    });

    return card;
  }

  fetchProperties();
});
