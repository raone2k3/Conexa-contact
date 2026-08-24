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

const contactCount = document.querySelector(
    ".contact-count"
);


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
        <article class="contact-card">

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

                    <button
                        type="button"
                        class="more-btn"
                        aria-label="More options"
                    >
                        ⋮
                    </button>

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


    contactGrid.innerHTML =
        users.map(createCard).join("");

}


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

    const users = getUsers();

    displayUsers(users);

    updateContactCount();

}


init();