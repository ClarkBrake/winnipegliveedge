"use strict";

const contactEmail = "YOUR-EMAIL-HERE";

const menuButton = document.querySelector(".menu-button");
const navigationLinks = document.querySelector(".nav-links");
const tableGallery = document.querySelector("#table-gallery");
const filterButtons = document.querySelectorAll(".filter-button");
const currentYear = document.querySelector("#current-year");

function setMenuState(isOpen) {
    if (!menuButton || !navigationLinks) {
        return;
    }

    navigationLinks.classList.toggle("open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );

    menuButton.innerHTML = isOpen
        ? '<span aria-hidden="true">✕</span>'
        : '<span aria-hidden="true">☰</span>';
}

if (menuButton && navigationLinks) {
    menuButton.addEventListener("click", () => {
        const isCurrentlyOpen =
            navigationLinks.classList.contains("open");

        setMenuState(!isCurrentlyOpen);
    });

    navigationLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            setMenuState(false);
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 720) {
            setMenuState(false);
        }
    });
}

function getCategoryLabel(category) {
    if (category === "coffee") {
        return "Coffee Table";
    }

    if (category === "dining") {
        return "Dining Table";
    }

    return "Table";
}

function getStatusClass(status) {
    return status.toLowerCase().replace(/\s+/g, "-");
}

function createInquiryLink(tableName) {
    const subject = encodeURIComponent(
        `Inquiry about ${tableName}`
    );

    return `mailto:${contactEmail}?subject=${subject}`;
}

function createTableCard(table) {
    const categoryLabel = getCategoryLabel(table.category);
    const statusClass = getStatusClass(table.status);
    const inquiryLink = createInquiryLink(table.name);

    return `
        <article class="card">
            <div class="card-image-wrapper">
                <img
                    src="${table.image}"
                    alt="${table.name}"
                    loading="lazy"
                >

                <span class="status ${statusClass}">
                    ${table.status}
                </span>
            </div>

            <div class="card-content">
                <p class="card-category">
                    ${categoryLabel}
                </p>

                <h3>${table.name}</h3>

                <dl class="table-details">
                    <div>
                        <dt>Wood</dt>
                        <dd>${table.wood}</dd>
                    </div>

                    <div>
                        <dt>Dimensions</dt>
                        <dd>${table.dimensions}</dd>
                    </div>
                </dl>

                <p class="price">
                    ${table.price}
                </p>

                <a
                    class="card-link"
                    href="${inquiryLink}"
                >
                    Inquire About This Table
                    <span aria-hidden="true">→</span>
                </a>
            </div>
        </article>
    `;
}

function displayTables(category = "all") {
    if (!tableGallery) {
        return;
    }

    if (
        typeof tables === "undefined" ||
        !Array.isArray(tables)
    ) {
        tableGallery.innerHTML = `
            <p class="empty-message">
                Table information could not be loaded.
            </p>
        `;

        return;
    }

    const filteredTables =
        category === "all"
            ? tables
            : tables.filter(
                (table) => table.category === category
            );

    if (filteredTables.length === 0) {
        tableGallery.innerHTML = `
            <p class="empty-message">
                No tables are currently listed in this category.
            </p>
        `;

        return;
    }

    tableGallery.innerHTML = filteredTables
        .map(createTableCard)
        .join("");
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((filterButton) => {
            filterButton.classList.remove("active");
        });

        button.classList.add("active");

        displayTables(button.dataset.category);
    });
});

document.querySelectorAll(
    'a[href="mailto:YOUR-EMAIL-HERE"]'
).forEach((link) => {
    link.href = `mailto:${contactEmail}`;
});

if (currentYear) {
    currentYear.textContent =
        new Date().getFullYear().toString();
}

displayTables();