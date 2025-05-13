document.addEventListener("DOMContentLoaded", function () {
  const propertyMenu = document.querySelector(".property__menu");
  const searchInput = document.getElementById("filter-search-input");

  const filterSelects = document.querySelectorAll(".filter-select");
  const propertyTypeFilter = filterSelects[0];
  const statusFilter = filterSelects[1];
  const sortByFilter = filterSelects[2];

  let allProperties = [];
  let initialFilteredProperties = [];

  // Utility: Levenshtein Distance (for fuzzy search)
  function levenshtein(a, b) {
    const matrix = Array.from({ length: b.length + 1 }, (_, i) =>
      Array.from({ length: a.length + 1 }, (_, j) =>
        i === 0 ? j : j === 0 ? i : 0
      )
    );

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b[i - 1] === a[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  // Format price
  function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  }

  // Fetch Properties
  async function fetchProperties() {
    try {
      const response = await fetch(`/api/property/get`);
      if (!response.ok) throw new Error("Failed to fetch properties");
      const result = await response.json();
      allProperties = result?.data || [];

      // Apply initial URL search query filter
      const query = new URLSearchParams(window.location.search).get("q");
      if (query) {
        const keyword = query.toLowerCase();
        initialFilteredProperties = allProperties.filter((p) => {
          const fields = [
            p.title,
            p.addressId.city,
            p.addressId.district,
            p.propertyType,
          ];
          return fields.some((field) => {
            const value = field.toLowerCase();
            return value.includes(keyword) || levenshtein(value, keyword) <= 2;
          });
        });
      } else {
        initialFilteredProperties = [...allProperties];
      }
      applyFilters();
    } catch (err) {
      console.error(err);
      propertyMenu.innerHTML = `<div class="no_results_message">
          <p>Failed to Load Properties</p>
        </div>`;
    }
  }

  // Render Property Cards
  function renderProperties(properties) {
    propertyMenu.innerHTML = "";

    if (properties.length === 0) {
      propertyMenu.innerHTML = `<div class="no_results_message">
          <p>Properties Not Found</p>
        </div>`;
      return;
    }

    properties.forEach((property) => {
      const imageSrc =
        property.images?.length > 0
          ? `/assets/media/properties/${property.images[0]}`
          : "default-image.jpg";
      const fullAddress = `${property.addressId?.city}, ${property.addressId?.district}, ${property.addressId?.state}`;

      const cardHTML = `
          <div class="property_card">
            <div class="property_image">
              <a href="/buildestate/property/${property._id}">
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
              <a href="/buildestate/property/${property._id}">
                <h3 class="title">${property.title}</h3>
              </a>
              <div class="price_section">
                <p class="label">Price</p>
                <p class="price">${
                  property.status === "Sale"
                    ? formatPrice(property.price)
                    : `${formatPrice(property.price)} ${
                        property.propertyType === "Villa" ? "/day" : "/month"
                      }`
                }</p>
              </div>
              <div class="info_boxes">
                ${
                  property.propertyType !== "Plot"
                    ? `<div class="info_box"><i class="bi bi-house-door"></i><p>${property.bedrooms} Beds</p></div>
                       <div class="info_box"><i class="bi bi-car-front-fill"></i><p>${property.parking} Parking</p></div>
                       <div class="info_box"><i class="bi bi-arrows-fullscreen"></i><p>${property.size} sqft</p></div>`
                    : `<div class="info_box"><i class="bi bi-arrows-fullscreen"></i><p>${property.size} sqft</p></div>`
                }
              </div>
            </div>
          </div>`;
      propertyMenu.insertAdjacentHTML("beforeend", cardHTML);
    });
  }

  // APPLIED FILTERS
  function applyFilters() {
    const keyword = searchInput.value.toLowerCase().trim();
    const selectedType = propertyTypeFilter.value.toLowerCase();
    const selectedStatus = statusFilter.value.toLowerCase();
    const sortOption = sortByFilter.value;

    let filtered = [...initialFilteredProperties];

    // SEARCHBAR FILTER
    if (keyword) {
      filtered = filtered.filter((p) => {
        const fields = [
          p.title,
          p.addressId.city,
          p.addressId.district,
          p.propertyType,
        ];

        return fields.some((field) => {
          const value = field.toLowerCase();
          return value.includes(keyword) || levenshtein(value, keyword) <= 2;
        });
      });
    }

    // Filter by type
    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter(
        (p) => p.propertyType.toLowerCase() === selectedType
      );
    }

    // Filter by status
    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(
        (p) => p.status.toLowerCase() === selectedStatus
      );
    }

    // Sorting
    if (sortOption === "price_low_high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price_high_low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    renderProperties(filtered);
  }

  // Live Search
  let debounceTimeout;
  searchInput.addEventListener("input", function () {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(applyFilters, 300);
  });

  // Dropdown Filters
  filterSelects.forEach((select) => {
    select.addEventListener("change", applyFilters);
  });

  fetchProperties();
});
