"use strict";

const contactEmail = "YOUR-EMAIL-HERE";

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".nav-links");
const gallery = document.querySelector("#table-gallery");
const filterButtons = document.querySelectorAll(".filter-button");
const currentYear = document.querySelector("#current-year");

function setMenuState(isOpen) {
    if (!menuButton || !navigation) {
        return;
    }

    navigation.classList.toggle("open", isOpen);
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

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        setMenuState(!navigation.classList.contains("open"));
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            setMenuState(false);
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            setMenuState(false);
        }
    });
}

function getCategoryName(category) {
    const categories = {
        coffee: "Coffee Table",
        dining: "Dining Table",
        custom: "Custom Design"
    };

    return categories[category] || "Handcrafted Piece";
}

function getStatusClass(status) {
    return status.toLowerCase().replace(/\s+/g, "-");
}

function createInquiryLink(name) {
    const subject = encodeURIComponent(`Inquiry about ${name}`);
    return `mailto:${contactEmail}?subject=${subject}`;
}

function createTableCard(table) {
    return `
        <article class="piece-card">
            <a
                class="piece-image"
                href="table.html?id=${encodeURIComponent(table.id)}"
                aria-label="View ${table.name}"
            >
                <img
                    src="${table.image}"
                    alt="${table.name}"
                    loading="lazy"
                >

                <span class="piece-status ${getStatusClass(table.status)}">
                    ${table.status}
                </span>
            </a>

            <div class="piece-content">
                <p class="piece-collection">
                    ${table.collection}
                </p>

                <h3>
                    <a href="table.html?id=${encodeURIComponent(table.id)}">
                        ${table.name}
                    </a>
                </h3>

                <p class="piece-description">
                    ${table.description}
                </p>

                <dl class="piece-details">
                    <div>
                        <dt>Type</dt>
                        <dd>${getCategoryName(table.category)}</dd>
                    </div>

                    <div>
                        <dt>Wood</dt>
                        <dd>${table.wood}</dd>
                    </div>

                    <div>
                        <dt>Dimensions</dt>
                        <dd>${table.dimensions}</dd>
                    </div>
                </dl>

                <div class="piece-footer">
                    <span>${table.price}</span>

                    <a href="${createInquiryLink(table.name)}">
                        Inquire
                        <span aria-hidden="true">→</span>
                    </a>
                </div>
            </div>
        </article>
    `;
}

function displayTables(category = "all") {
    if (!gallery) {
        return;
    }

    if (
        typeof tables === "undefined" ||
        !Array.isArray(tables)
    ) {
        gallery.innerHTML = `
            <p class="empty-message">
                The collection could not be loaded.
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
        gallery.innerHTML = `
            <p class="empty-message">
                No pieces have been added to this category yet.
            </p>
        `;

        return;
    }

    gallery.innerHTML = filteredTables
        .map(createTableCard)
        .join("");
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((item) => {
            item.classList.remove("active");
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