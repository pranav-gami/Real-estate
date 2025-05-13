"use strict";

const KTUserViewDetails = (function () {
  // Update DOM with user details
  const updateUserDetailsUI = (data) => {
    const imgEle = document.querySelector(".user_img");
    if (imgEle) {
      imgEle.src = `/assets/media/users/${data.image}`;
    }

    document
      .querySelectorAll(".username")
      .forEach((ele) => (ele.textContent = data.name));
    document.querySelector(".language").textContent = "Hindi,English";
    document.querySelector(".address").textContent = data.city;
    document.querySelectorAll(".email").forEach((el) => {
      el.textContent = data.email;
    });
    document.querySelectorAll(".role").forEach((el) => {
      el.textContent = data.role;
    });
    document.querySelectorAll(".isAcitve").forEach((el) => {
      el.textContent = data.isActive ? "YES" : "NO";
    });
    document.querySelector(".phone").textContent = data.phone;
  };

  // Fetch and load user details from API
  const loadUserDetails = async (userId) => {
    try {
      const response = await fetch(`/api/user/get/${userId}`);
      const result = await response.json();

      if (result.success) {
        updateUserDetailsUI(result.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Failed to load user data. Please try again later.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Something went wrong while fetching user details.",
      });
      console.error("Error fetching user details:", error);
    }
  };

  //   Load Dyanamically Cart details
  //   async function loadCartDetails(userId) {
  //     try {
  //       const response = await fetch(
  //         `/api/cartProducts/getCartByUserId/${userId}`
  //       );
  //       const result = await response.json();

  //       if (result.success) {
  //         const cartItems = result.data;
  //         const tbody = document.getElementById("cart-details-body");
  //         const totalElement = document.getElementById("cart-total");

  //         tbody.innerHTML = "";
  //         let total = 0;
  //         if (cartItems.length != 0) {
  //           cartItems.forEach((item) => {
  //             const { title, price } = item.product;
  //             const quantity = item.quantity;
  //             const subtotal = price * quantity;
  //             total += subtotal;

  //             const row = `
  //                 <tr>
  //                 <td>${title}</td>
  //                 <td>${quantity}</td>
  //                 <td>₹${price.toLocaleString()}</td>
  //                 <td>₹${subtotal.toLocaleString()}</td>
  //                 </tr>
  //                 `;
  //             tbody.insertAdjacentHTML("beforeend", row);
  //           });
  //           totalElement.textContent = `₹${total.toLocaleString()}`;
  //         } else {
  //           tbody.innerHTML =
  //             "<h4 class='p-4 pt-5 text-muted'>User's Cart is Empty!</h4>";
  //         }
  //       } else {
  //         Swal.fire("Error", "Failed to fetch cart items", "error");
  //       }
  //     } catch (error) {
  //       console.error("Error loading cart:", error);
  //       Swal.fire(
  //         "Error",
  //         "An error occurred while fetching cart items.",
  //         "error"
  //       );
  //     }
  //   }

  return {
    init: function () {
      const userId = document.querySelector("#kt_app_content").dataset.userId;
      if (userId) {
        loadUserDetails(userId);
        // loadCartDetails(userId);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Missing User ID",
          text: "No user ID found in the URL. Cannot load user details.",
        });
        console.warn("No user ID found in URL parameters.");
      }
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTUserViewDetails.init();
});
