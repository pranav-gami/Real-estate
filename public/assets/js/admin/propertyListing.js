"use strict";

var KTAppRealEstateProperties = (function () {
  let tableElement;
  let dataTable;
  let allProperties = [];

  function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  }

  function renderPropertyRow(property) {
    return `
      <tr>
        <td>
          <div class="form-check form-check-sm form-check-custom form-check-solid">
            <input class="form-check-input" type="checkbox" value="${
              property._id
            }" />
          </div>
        </td>
        <td>
          <div class="d-flex align-items-center">
            <a href="" class="symbol symbol-50px">
              <span class="symbol-label" style="background-image: url('/assets/media/properties/${
                property.images?.[0] || "default.jpg"
              }'); background-size: cover;"></span>
            </a>
            <div class="ms-5">
              <a href="/admin/properties/edit/${property._id}"
                class="text-gray-800 text-hover-primary fs-5 fw-bold text-truncate d-inline-block"
                style="max-width: 150px"
                title="${property.title}">
                ${property.title}
              </a>
            </div>
          </div>
        </td>
        <td class="text-end pe-0">
          <span class="fw-bold text-truncate d-inline-block" style="max-width:180px">${
            property.description || ""
          }</span>
        </td>
        <td class="text-end pe-0">${formatPrice(property.price)}</td>
        <td class="text-end pe-0">${property.propertyType}</td>
        <td class="text-center pe-0">
          <div class="badge badge-light-primary">${property.status}</div>
        </td>
        <td class="text-end">
          <a href="#" class="btn btn-sm btn-light btn-active-light-primary"
             data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">Actions
            <span class="svg-icon svg-icon-5 m-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                   xmlns="http://www.w3.org/2000/svg">
                <path d="M11.4343 12.7344L7.25 8.55005C6.83579 8.13583 6.16421 8.13584 5.75 8.55005C5.33579 
                8.96426 5.33579 9.63583 5.75 10.05L11.2929 15.5929C11.6834 15.9835 12.3166 15.9835 
                12.7071 15.5929L18.25 10.05C18.6642 9.63584 18.6642 8.96426 18.25 8.55005C17.8358 
                8.13584 17.1642 8.13584 16.75 8.55005L12.5657 12.7344C12.2533 13.0468 11.7467 
                13.0468 11.4343 12.7344Z" fill="currentColor"/>
              </svg>
            </span>
          </a>
          <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
               data-kt-menu="true">
            <div class="menu-item px-3">
              <a href="/admin/properties/edit/${
                property._id
              }" class="menu-link px-3">Edit</a>
            </div>
            <div class="menu-item px-3">
              <a href="#" class="menu-link px-3" data-kt-ecommerce-property-filter="delete_row" data-id="${
                property._id
              }">Delete</a>
            </div>
          </div>
        </td>
      </tr>
    `;
  }

  function handleDeleteRows() {
    tableElement
      .querySelectorAll('[data-kt-ecommerce-property-filter="delete_row"]')
      .forEach((btn) => {
        btn.addEventListener("click", async (event) => {
          event.preventDefault();
          const row = event.target.closest("tr");
          const name =
            row.querySelector("a.text-hover-primary")?.innerText ||
            "this property";
          const id = btn.getAttribute("data-id");

          const result = await Swal.fire({
            text: `Are you sure you want to delete ${name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete!",
            cancelButtonText: "No, cancel",
            buttonsStyling: false,
            customClass: {
              confirmButton: "btn fw-bold btn-danger",
              cancelButton: "btn fw-bold btn-active-light-primary",
            },
          });

          if (result.isConfirmed) {
            await fetch(`/api/property/delete/${id}`, {
              method: "DELETE",
            });
            Swal.fire({
              text: `${name} has been deleted!`,
              icon: "success",
              confirmButtonText: "Ok, got it!",
              buttonsStyling: false,
              customClass: { confirmButton: "btn fw-bold btn-primary" },
            }).then(() => {
              dataTable.row($(row)).remove().draw();
            });
          } else {
            Swal.fire({
              text: `${name} was not deleted.`,
              icon: "error",
              confirmButtonText: "Ok, got it!",
              buttonsStyling: false,
              customClass: { confirmButton: "btn fw-bold btn-primary" },
            });
          }
        });
      });
  }

  function renderTable(properties) {
    tableElement.querySelector("tbody").innerHTML = "";

    if ($.fn.DataTable.isDataTable(tableElement)) {
      dataTable.clear().draw();
    } else {
      dataTable = $(tableElement).DataTable({
        info: false,
        order: [],
        pageLength: 10,
        columnDefs: [{ orderable: false, targets: [0, 6] }],
      });

      dataTable.on("draw", () => {
        handleDeleteRows();
        KTMenu.createInstances();
      });
    }

    properties.forEach((property) => {
      const rowHTML = renderPropertyRow(property);
      const rowElement = $(rowHTML);
      dataTable.row.add(rowElement);
    });

    dataTable.draw();

    handleDeleteRows();
    KTMenu.createInstances();
  }

  async function loadProperties() {
    try {
      const res = await fetch("/api/property/get");
      const result = await res.json();
      allProperties = result.data;
      renderTable(allProperties);
    } catch (err) {
      console.error("Failed to load properties:", err);
    }
  }

  function handleSearchFilter() {
    const searchInput = document.querySelector(
      '[data-kt-property-filter="search"]'
    );

    if (searchInput) {
      searchInput.addEventListener("keyup", (e) => {
        const value = e.target.value.toLowerCase();
        const filteredProperties = allProperties.filter(
          (property) =>
            property.title.toLowerCase().includes(value) ||
            property.propertyType.toLowerCase().includes(value) ||
            property.status.toLowerCase().includes(value)
        );
        renderTable(filteredProperties);
      });
    }
  }

  function handlePriceFilter() {
    const $select = $("#propertyFilter");

    if (!$select.length) {
      console.error("Price filter select element not found!");
      return;
    }

    $select.on("change", function () {
      const selectedValue = this.value;
      let sortedProperties = [...allProperties];

      if (selectedValue === "lowtohigh") {
        sortedProperties.sort((a, b) => a.price - b.price);
      } else if (selectedValue === "hightolow") {
        sortedProperties.sort((a, b) => b.price - a.price);
      }

      renderTable(sortedProperties);
    });
  }

  return {
    init: function () {
      tableElement = document.querySelector("#kt_properties_table");
      if (!tableElement) return;
      loadProperties();
      handleSearchFilter();
      handlePriceFilter();
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTAppRealEstateProperties.init();
});
