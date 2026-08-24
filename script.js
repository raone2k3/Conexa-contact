// ==========================================
// FORM ELEMENTS
// ==========================================

const form = document.querySelector(".contact-form");

const profileImage = document.querySelector("#profile-image");
const fullName = document.querySelector("#full-name");
const homeTown = document.querySelector("#home-town");
const purpose = document.querySelector("#purpose");

const categories = document.querySelectorAll(
    'input[name="category"]'
);

const uploadText = document.querySelector(
    ".upload-text strong"
);


// ==========================================
// CONTACT SECTION
// ==========================================

const addContactSection = document.querySelector(
    ".add-contact-section"
);

const addUserBtn = document.querySelector(
    ".add-user-btn"
);

const contactGrid = document.querySelector(
    ".contact-grid"
);
// ==========================================
// DELETE MODAL
// ==========================================

const deleteModal =
    document.querySelector("#delete-modal");

const deleteContactName =
    document.querySelector("#delete-contact-name");

const cancelDelete =
    document.querySelector("#cancel-delete");

const confirmDelete =
    document.querySelector("#confirm-delete");

const contactCount = document.querySelector(
    ".contact-count"
);

let contactToDelete = null;

// ==========================================
// SEARCH
// ==========================================

const searchForm = document.querySelector(
    ".search-box"
);

const searchInput = document.querySelector(
    "#user-search"
);


// ==========================================
// LOCAL STORAGE
// ==========================================

function getUsers() {

    return JSON.parse(
        localStorage.getItem("users")
    ) || [];

}
function fixUserIds() {

    const users = getUsers();

    let changed = false;

    users.forEach(function (user) {

        if (!user.id) {

            user.id = crypto.randomUUID();

            changed = true;
        }

    });

    if (changed) {

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

    }

    return users;
}

function saveUser(user) {

    const users = getUsers();

    users.push(user);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

}


// ==========================================
// CONTACT COUNT
// ==========================================

function updateContactCount() {

    const count = getUsers().length;

    contactCount.textContent =
        `${count} ${count === 1 ? "Contact" : "Contacts"}`;

}


// ==========================================
// CREATE CONTACT CARD
// ==========================================

function createCard(user) {
    return `
        <article class="contact-card" data-id="${user.id}">

            <div class="contact-image">

                <img
                    src="${user.image}"
                    alt="${user.name}'s profile picture"
                >

                <span class="status-badge ${user.category}">
                    ${user.category}
                </span>

            </div>


            <div class="contact-content">

                <div class="contact-title">

                    <div>

                        <h3>${user.name}</h3>

                        <p class="contact-role">
                            ${user.purpose}
                        </p>

                    </div>


                    <!-- CARD MENU -->

                    <div class="card-menu">

                        <button
                            type="button"
                            class="more-btn"
                            aria-label="More options"
                        >
                            ⋮
                        </button>


                        <div class="contact-menu">

                            <button
                                type="button"
                                class="delete-btn"
                                data-id="${user.id}"
                            >
                                <span>🗑</span>
                                Delete Contact
                            </button>

                        </div>

                    </div>

                </div>


                <div class="contact-info">

                    <div>
                        <span>📍</span>
                        <p>${user.town}</p>
                    </div>

                </div>


                <div class="card-actions">

                    <button
                        type="button"
                        class="primary-btn"
                    >
                        Call
                    </button>

                    <button
                        type="button"
                        class="secondary-btn"
                    >
                        Message
                    </button>

                </div>

            </div>

        </article>
    `;
}


// ==========================================
// DISPLAY CONTACTS
// ==========================================

function displayUsers(users) {

    if (users.length === 0) {

        contactGrid.innerHTML = `
            <div class="user-not-found">

                <h3>User Not Found</h3>

                <p>
                    No contacts found.
                </p>

            </div>
        `;

        return;
    }


    contactGrid.innerHTML = users
        .map(function (user) {
            return createCard(user);
        })
        .join("");

}

// ==========================================
// OPEN CARD MENU
// ==========================================

contactGrid.addEventListener(
    "click",
    function (event) {

        const moreButton =
            event.target.closest(".more-btn");

        if (!moreButton) {
            return;
        }

        const cardMenu =
            moreButton.closest(".card-menu");

        if (!cardMenu) {
            return;
        }

        document
            .querySelectorAll(".card-menu.active")
            .forEach(function (menu) {

                if (menu !== cardMenu) {
                    menu.classList.remove("active");
                }

            });

        cardMenu.classList.toggle("active");
    }
);

// ==========================================
// CLOSE CARD MENU ON OUTSIDE CLICK
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const openMenu =
            document.querySelector(".card-menu.active");

        if (!openMenu) {
            return;
        }

        if (openMenu.contains(event.target)) {
            return;
        }

        openMenu.classList.remove("active");
    }
);

// ==========================================
// CLOSE CARD MENU ON ESCAPE
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }

        const openMenu =
            document.querySelector(".card-menu.active");

        if (openMenu) {
            openMenu.classList.remove("active");
        }

    }
);

// ==========================================
// OPEN DELETE CONFIRMATION
// ==========================================

contactGrid.addEventListener(
    "click",
    function (event) {

        const deleteButton =
            event.target.closest(".delete-btn");

        if (!deleteButton) {
            return;
        }

        const userId =
            deleteButton.dataset.id;

        const users = getUsers();

        const user =
            users.find(function (user) {
                return user.id === userId;
            });

        if (!user) {
            return;
        }

        contactToDelete = userId;

        deleteContactName.textContent =
            user.name;

        deleteButton
            .closest(".card-menu")
            .classList.remove("active");

        deleteModal.classList.add("active");

        deleteModal.setAttribute(
            "aria-hidden",
            "false"
        );
    }
);
// ==========================================
// CLOSE DELETE MODAL
// ==========================================

function closeDeleteModal() {

    deleteModal.classList.remove("active");

    deleteModal.setAttribute(
        "aria-hidden",
        "true"
    );

    contactToDelete = null;
}
cancelDelete.addEventListener(
    "click",
    function () {

        closeDeleteModal();

    }
);

// ==========================================
// CONFIRM DELETE
// ==========================================

confirmDelete.addEventListener(
    "click",
    function () {

        if (!contactToDelete) {
            return;
        }

        let users = getUsers();

        users = users.filter(
            function (user) {

                return user.id !== contactToDelete;

            }
        );

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        displayUsers(users);

        updateContactCount();

        closeDeleteModal();
    }
);

// ==========================================
// Add Escape
// ==========================================
deleteModal.addEventListener(
    "click",
    function (event) {

        if (event.target === deleteModal) {
            closeDeleteModal();
        }

    }
);

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            deleteModal.classList.contains("active")
        ) {

            closeDeleteModal();

        }

    }
);
// ==========================================
// ADD CONTACT BUTTON
// ==========================================

addUserBtn.addEventListener(
    "click",
    function () {

        addContactSection.style.display = "block";

        addContactSection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// ==========================================
// IMAGE NAME
// ==========================================

profileImage.addEventListener(
    "change",
    function () {

        const file = profileImage.files[0];

        if (!file) {

            uploadText.textContent =
                "Choose a profile image";

            return;
        }

        uploadText.textContent = file.name;

    }
);


// ==========================================
// FORM SUBMIT
// ==========================================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // ----------------------------------
        // Get values
        // ----------------------------------

        const name = fullName.value.trim();

        const town = homeTown.value.trim();

        const userPurpose = purpose.value.trim();

        const file = profileImage.files[0];


        // ----------------------------------
        // Validate
        // ----------------------------------

        if (
            !file ||
            !name ||
            !town ||
            !userPurpose
        ) {

            alert(
                "Please fill all the fields."
            );

            return;
        }


        // ----------------------------------
        // Get category
        // ----------------------------------

        const selectedCategory =
            document.querySelector(
                'input[name="category"]:checked'
            );


        if (!selectedCategory) {

            alert(
                "Please select a contact category."
            );

            return;
        }


        // ----------------------------------
        // Read image
        // ----------------------------------

        const reader = new FileReader();


        reader.onload = function () {

            const user = {

    id: crypto.randomUUID(),

    image: reader.result,

    name: name,

    town: town,

    purpose: userPurpose,

    category: selectedCategory.value

};


            // Save
            saveUser(user);


            // Update UI
            const users = getUsers();

            displayUsers(users);

            updateContactCount();


            // Reset form
            form.reset();

            uploadText.textContent =
                "Choose a profile image";


            // Hide form
            addContactSection.style.display =
                "none";


            // Scroll
            document
                .querySelector("#contacts")
                .scrollIntoView({
                    behavior: "smooth"
                });

        };


        reader.readAsDataURL(file);

    }
);


// ==========================================
// SEARCH
// ==========================================

function filterUsers() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const users = getUsers();


    if (!searchTerm) {

        displayUsers(users);

        return;
    }


    const filteredUsers =
        users.filter(function (user) {

            return (

                user.name
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                user.town
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                user.purpose
                    .toLowerCase()
                    .includes(searchTerm)

                ||

                user.category
                    .toLowerCase()
                    .includes(searchTerm)

            );

        });


    displayUsers(filteredUsers);

}


searchForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        filterUsers();

    }
);


searchInput.addEventListener(
    "input",
    filterUsers
);


// ==========================================
// INITIALIZE APP
// ==========================================

function init() {

    const users = fixUserIds();

    displayUsers(users);

    updateContactCount();

}


init();

// ===============================
// THEME TOGGLE
// ===============================

const themeToggle =
    document.querySelector("#theme-toggle");

    function setTheme(isDark) {

    document.body.classList.toggle(
        "dark-mode",
        isDark
    );

    themeToggle.checked = isDark;

    localStorage.setItem(
        "theme",
        isDark ? "dark" : "light"
    );
}

themeToggle.addEventListener(
    "change",
    function () {

        setTheme(themeToggle.checked);

    }
);

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {

    setTheme(true);

} else {

    setTheme(false);

}