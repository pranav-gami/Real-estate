document.addEventListener("DOMContentLoaded", function () {
  const propertyMenu = document.querySelector(".property__menu");
  const searchInput = document.getElementById("filter-search-input");
  const searchBtn = document.getElementById("filter-search-btn");

  const filterSelects = document.querySelectorAll(".filter-select");
  const propertyTypeFilter = filterSelects[0];
  const statusFilter = filterSelects[1];
  const sortByFilter = filterSelects[2];

  let allProperties = [];

  // FETCH DATA FROM API
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
      allProperties = result.data || [];
      applyFilters();
    } catch (error) {
      console.error("Error fetching properties:", error);
      propertyMenu.innerHTML = "<p>Failed to load properties.</p>";
    }
  }

  // FUNCTION TO RENDER CARDS
  function renderProperties(properties) {
    propertyMenu.innerHTML = "";

    if (properties.length === 0) {
      propertyMenu.innerHTML = "<p>No properties found.</p>";
      return;
    }

    properties.forEach((property) => {
      const imageSrc =
        property.images && property.images.length > 0
          ? `/assets/media/properties/${property.images[0]}`
          : "default-image.jpg";

      const fullAddress = `${property.addressId?.city}, ${property.addressId?.district}, ${property.addressId?.state}`;

      const cardHTML = `
        <div class="property_card">
          <div class="property_image">
            <a href="/buildstate/property/${property._id}">
              <img src="${imageSrc}" alt="${property.title}">
              <div class="badges">
                <span class="badge badge_type">${property.propertyType}</span>
                <span class="badge badge_sale">${property.status}</span>
              </div>
              <div class="share_button">
                <button><i class="bi bi-share-fill"></i></button>
              </div>
            </a>
          </div>
          <div class="property_content">
            <div class="property_content-header">
              <a target="_blank" href="${property.location}">
                <p class="location"><i class="bi bi-geo-alt-fill"></i> ${fullAddress}</p>
              </a>
            </div>
            <a href="/buildstate/property/${property._id}">
              <h3 class="title">${property.title}</h3>
            </a>
            <div class="price_section">
              <p class="label">Price</p>
              <p class="price"><i class="bi bi-currency-rupee"></i> ${property.price.toLocaleString(
                "en-IN"
              )}</p>
            </div>
            <div class="info_boxes">
              ${
                property.propertyType != "Plot"
                  ? `<div class="info_box"><i class="bi bi-house-door"></i><p>${property.bedrooms} Beds</p></div>
              <div class="info_box"><i class="bi bi-car-front-fill"></i><p>${property.parking} Parking</p></div>
              <div class="info_box"><i class="bi bi-arrows-fullscreen"></i><p>${property.size} sqft</p></div>`
                  : `
               <div class="info_box"><i class="bi bi-arrows-fullscreen"></i><p>${property.size} sqft</p></div>`
              }
            </div>
          </div>
        </div>
      `;
      propertyMenu.insertAdjacentHTML("beforeend", cardHTML);
    });
  }

  // APPLY ALL FILTERS TOGETHER
  function applyFilters() {
    const keyword = searchInput.value.toLowerCase().trim();
    const selectedType = propertyTypeFilter.value.toLowerCase();
    const selectedStatus = statusFilter.value.toLowerCase();
    const sortOption = sortByFilter.value;

    let filtered = [...allProperties];

    // Search filter (keyword in title, city, district, propertyType)
    if (keyword) {
      filtered = filtered.filter((p) => {
        return (
          p.title.toLowerCase().includes(keyword) ||
          p.addressId.city.toLowerCase().includes(keyword) ||
          p.addressId.district.toLowerCase().includes(keyword) ||
          p.propertyType.toLowerCase().includes(keyword)
        );
      });
    }

    // Property-Type Filter
    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter(
        (p) => p.propertyType.toLowerCase() === selectedType
      );
    }

    // Status Filter
    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(
        (p) => p.status.toLowerCase() === selectedStatus
      );
    }

    // Sort By Price
    if (sortOption === "price_low_high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price_high_low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    renderProperties(filtered);
  }

  // EVENT LISTENERS
  searchBtn.addEventListener("click", applyFilters);
  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      applyFilters();
    }
  });

  filterSelects.forEach((select) => {
    select.addEventListener("change", applyFilters);
  });

  // INITIAL FETCH
  fetchProperties();
});
