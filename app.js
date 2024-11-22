const apiURL = "https://books.free.beeceptor.com"; // Beeceptor API URL

// Fetch and display items on the homepage
async function fetchItems() {
    const response = await fetch("https://books.free.beeceptor.com");
    const items = await response.json();

    const itemList = document.getElementById("item-list");
    itemList.innerHTML = ""; // Clear existing items

    items.forEach((item) => {
        appendBookToList(item);
    });
}

// Append a book to the list dynamically
function appendBookToList(book) {
    const itemList = document.getElementById("item-list");
    const li = document.createElement("li");
    li.setAttribute("id", `book-${book.id}`); // Unique ID for each list item
    li.innerHTML = `
        <h2>${book.title}</h2>
        <p>Author: ${book.author || "N/A"}</p>
        <p>Genre: ${book.genre || "N/A"}</p>
        <p>Pages: ${book.pages || "N/A"}</p>
        <p>Description: ${book.description || "No description available"}</p>
        <button onclick="editItem(${book.id})">Edit</button>
        <button onclick="deleteItem(${book.id})">Delete</button>
    `;
    itemList.appendChild(li);
}

// Redirect to edit page with item ID
function editItem(itemId) {
    localStorage.setItem("editItemId", itemId);
    location.href = "edit-item.html";
}

// Fetch item data for editing
async function fetchItemForEdit() {
    const itemId = localStorage.getItem("editItemId");
    const response = await fetch(`${apiURL}/${itemId}`);
    const book = await response.json();

    // Pre-fill the form with book data
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("genre").value = book.genre;
    document.getElementById("pages").value = book.pages;
    document.getElementById("description").value = book.description;

    const editForm = document.getElementById("edit-form");
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await updateItem(itemId);
        location.href = "index.html";
    });
}

// Update item
async function updateItem(itemId) {
    const updatedBook = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        genre: document.getElementById("genre").value,
        pages: document.getElementById("pages").value,
        description: document.getElementById("description").value,
    };

    const response = await fetch(`${apiURL}/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
    });

    const updatedData = await response.json();

    // Update the DOM dynamically
    const listItem = document.getElementById(`book-${itemId}`);
    if (listItem) {
        listItem.querySelector("h2").textContent = updatedData.title;
        listItem.querySelectorAll("p")[0].textContent = `Author: ${updatedData.author}`;
        listItem.querySelectorAll("p")[1].textContent = `Genre: ${updatedData.genre}`;
        listItem.querySelectorAll("p")[2].textContent = `Pages: ${updatedData.pages}`;
        listItem.querySelectorAll("p")[3].textContent = `Description: ${updatedData.description}`;
    }
}

// Delete item
async function deleteItem(itemId) {
    await fetch(`${apiURL}/${itemId}`, { method: "DELETE" });
    alert("Book deleted successfully!");

    // Remove the item from the DOM
    const listItem = document.getElementById(`book-${itemId}`);
    if (listItem) listItem.remove();
}

// Add a new item
const createForm = document.getElementById("create-form");
if (createForm) {
    createForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const newBook = {
            title: document.getElementById("title").value,
            author: document.getElementById("author").value,
            genre: document.getElementById("genre").value,
            pages: document.getElementById("pages").value,
            description: document.getElementById("description").value,
        };

        const response = await fetch(apiURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBook),
        });

        const createdBook = await response.json();
        alert("Book added successfully!");
        appendBookToList(createdBook); // Add the new book dynamically
        location.href = "index.html";
    });
}

// Initialize the appropriate functionality based on the page
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("item-list")) fetchItems();
    if (document.getElementById("edit-form")) fetchItemForEdit();
});
