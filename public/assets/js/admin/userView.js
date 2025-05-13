"use strict";

const KTUserViewDetails = (function () {
  // Update DOM with user details
  const updateUserDetailsUI = (data) => {
    const imgEle = document.querySelector(".user_img");
    if (imgEle) {
      imgEle.src = `/assets/media/users/${
        data.image ? data.image : "defualt_user.jpeg"
      }`;
    }

    document
      .querySelectorAll(".username")
      .forEach((ele) => (ele.textContent = data.name));
    document.querySelector(".language").textContent = "Hindi,English";
    document.querySelector(".address").textContent = data.city || "N/A";
    document
      .querySelectorAll(".email")
      .forEach((el) => (el.textContent = data.email));
    document
      .querySelectorAll(".role")
      .forEach((el) => (el.textContent = data.role));
    document
      .querySelectorAll(".isAcitve")
      .forEach((el) => (el.textContent = data.isActive ? "YES" : "NO"));
    document.querySelector(".phone").textContent = data.phone;

    // Handle tab visibility and data based on role
    if (data.role.toLowerCase() === "agent") {
      document.getElementById("properties-tab").style.display = "block";
      loadAgentProperties(data.properties); // Load properties if agent
    } else if (data.role.toLowerCase() === "user") {
      document.querySelector(
        '[href="#kt_user_view_overview_security"]'
      ).parentElement.style.display = "block";
      loadUserInquiries(data.inquiries);
    }
  };

  // Fetch and load user details from API
  const loadUserDetails = async (userId) => {
    try {
      const response = await fetch(`/api/user/get/${userId}`);
      const result = await response.json();

      if (result.success) {
        updateUserDetailsUI(result.data);
      } else {
        Swal.fire(
          "Error",
          "Failed to load user data. Please try again later.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Network Error",
        "Something went wrong while fetching user details.",
        "error"
      );
      console.error("Error fetching user details:", error);
    }
  };

  // Load Inquiries for regular user
  const loadUserInquiries = async (inquiries) => {
    try {
      const tbody = document.getElementById("inquiry-details-body");
      tbody.innerHTML = "";

      if (inquiries.length > 0) {
        inquiries.forEach((inquiry) => {
          const row = `
            <tr style="color:#565656">
              <td class="text-truncate mw-100px inquiry_property" title="${
                inquiry.propertyId?.title || "N/A"
              }">
                ${inquiry.propertyId?.title || "N/A"}
              </td>
              <td class="question">${inquiry.message}</td>
            </tr>`;
          tbody.insertAdjacentHTML("beforeend", row);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="2" class="text-center fs-2 mt-3 text-muted">No inquiries found.</td></tr>`;
      }
    } catch (error) {
      console.error("Error loading inquiries:", error);
      Swal.fire("Error", "Failed to load inquiries.", "error");
    }
  };

  function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  }

  // Load Properties for Agent
  const loadAgentProperties = async (properties) => {
    try {
      const tbody = document.getElementById("properties-body");
      tbody.innerHTML = "";

      if (properties.length > 0) {
        properties.forEach((property) => {
          const row = `
            <tr style="color:#565656">
              <td class="text-truncate mw-150px" >${property.title}</td>
              <td>${property.propertyType}</td>
              <td>${property.addressId.district}</td>
              <td>${formatPrice(property.price)}</td>
              <td>${property.status}</td>
            </tr>`;
          tbody.insertAdjacentHTML("beforeend", row);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center fs-2 mt-3 text-muted">No properties listed.</td></tr>`;
      }
    } catch (error) {
      console.error("Error loading properties:", error);
      Swal.fire("Error", "Failed to load agent properties.", "error");
    }
  };

  return {
    init: function () {
      const userId = document.querySelector("#kt_app_content").dataset.userId;
      if (userId) {
        loadUserDetails(userId);
      } else {
        Swal.fire(
          "Missing User ID",
          "No user ID found. Cannot load user details.",
          "warning"
        );
        console.warn("No user ID found in dataset.");
      }
    },
  };
})();

// Initialize on DOM ready
KTUtil.onDOMContentLoaded(function () {
  KTUserViewDetails.init();
});
