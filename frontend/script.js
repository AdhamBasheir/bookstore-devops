// The book title can contain number like the famous books "1984" or "Fahrenheit 451"


// variables
const booksNumberForm = document.getElementById("booksNumberForm");
const booksNumberInput = document.getElementById("booksNumber");
const booksNumberError = document.getElementById("booksNumberError");

const bookForm = document.getElementById("bookForm");
const booksTable = document.getElementById("booksTable");
const tableBtns = document.querySelector(".buttons-container");
const addNewBooksBtn = document.getElementById("addNewBooksBtn");
const deleteBooksBtn = document.getElementById("deleteBooks");
const tbody = booksTable.querySelector("tbody");

let addBooksCount = 0;
let booksData = [];
let newBooks = [];
let nextID = 0;


// classes
class Author {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

class Book {
  constructor(_id, name, quantity, author) {
    this.id = generateID();
    this._id = _id; 
    this.name = name;
    this.quantity = quantity;
    this.author = author;
  }
}


// onload
booksNumberForm.style.display = "block";
document.getElementById("numBtn").addEventListener("click", numberBook);
document.getElementById("numBtnCancel").addEventListener("click", numberBookCancel);
document.getElementById("addBtn").addEventListener("click", addBookForm);
document.getElementById("endBtn").addEventListener("click", endBookForm);
document.getElementById("abortBtn").addEventListener("click", abortBookForm);
addNewBooksBtn.addEventListener("click", addBookTable);
deleteBooksBtn.addEventListener("click", deleteBooksTable);
fetchBooksFromBackend();


// form handlers
function numberBook() {
  const value = parseFloat(booksNumberInput.value);

  if (!isPositiveInteger(value)) {
    booksNumberError.textContent = "Please enter a positive integer.";
  }
  else {
    clearBooksNumberForm();
    addBooksCount = value;
    booksNumberForm.style.display = "none";
    bookForm.style.display = "block";
  }
}

function numberBookCancel() {
  clearBooksNumberForm();

  booksNumberForm.style.display = "none";
  showTable();

  if (booksData.length === 0) {
    booksTable.style.display = "none";
    deleteBooksBtn.style.display = "none";
  }
}

function addBookForm() {
  const bookName = document.getElementById("bookName").value.trim();
  const quantity = parseFloat(document.getElementById("quantity").value);
  const authorName = document.getElementById("authorName").value.trim();
  const email = document.getElementById("email").value.trim();

  resetErrorsForm();
  let isValid = validateBookForm(bookName, quantity, authorName, email);

  if (isValid) {
    const author = new Author(authorName, email);
    const book = new Book(null, bookName, quantity, author);

    newBooks.push(book);
    bookForm.reset();
    addBooksCount--;

    if (addBooksCount == 0) {
      endBookForm();
    }
  }
}

function endBookForm() {
  submitBooksToBackend();
  newBooks = [];
  formToTable();
}

function abortBookForm() {
  if (confirm("Are you sure you want to abort adding new books?"))
    formToTable();
}

// Transition from Book Form to Book Table
function formToTable() {
  bookForm.reset();
  bookForm.style.display = "none";
  showTable();
}

// table handler
function showTable() {
  tbody.innerHTML = "";
  booksData.forEach((book) => {
    const row = createTableRow(book);
    tbody.appendChild(row);
  });

  booksTable.style.display = "table";
  tableBtns.style.display = "flex";
  addNewBooksBtn.style.display = "block";
  deleteBooksBtn.style.display = "block";
}

function addBookTable() {
  booksTable.style.display = "none";
  tableBtns.style.display = "none";
  addNewBooksBtn.style.display = "none";
  deleteBooksBtn.style.display = "none";
  booksNumberForm.style.display = "block";
}

function deleteBooksTable() {
  if (confirm("Are you sure you want to delete all the books?")) {
    booksData = [];
    tbody.innerHTML = "";
    booksTable.style.display = "none";
    deleteBooksBtn.style.display = "none";
  }
}

function editBook(event) {
  const bookID = findBookID(event.target.id);
  const book = booksData.find(b => b.id === bookID);
  const row = event.target.closest("tr");

  row.innerHTML = `
    <td>
      <input type="text" value="${book.name}" class="editBookName">
      <span class="error" id="bookErrorTable${bookID}"></span>
    </td>
    <td>
      <input type="number" value="${book.quantity.toFixed(2)}" class="editquantity" step="0.01">
      <span class="error" id="quantityErrorTable${bookID}"></span>
    </td>
    <td>
      <input type="text" value="${book.author.name}" class="editAuthorName">
      <span class="error" id="nameErrorTable${bookID}"></span>
    </td>
    <td>
      <input type="email" value="${book.author.email}" class="editEmail">
      <span class="error" id="emailErrorTable${bookID}"></span>
    </td>
    <td>
      <button class="confirmBtn" id="confirm${bookID}">Confirm</button>
    </td>
    <td>
      <button class="cancelBtn" id="cancel${bookID}">Cancel</button>
    </td>
  `;

  confirmCancelBtns(row);
}

function deleteBook(event) {
  const bookID = findBookID(event.target.id);
  const row = event.target.closest("tr");

  if (confirm("Are you sure you want to delete this book?")) {
    row.remove();
    booksData = booksData.filter(book => book.id !== bookID);

    if (booksData.length === 0) {
      booksTable.style.display = "none";
      deleteBooksBtn.style.display = "none";
    }
  }
}

function confirmBtnFn(event) {
  const bookID = findBookID(event.target.id);
  const row = event.target.closest("tr");

  const bookName = row.querySelector(".editBookName").value.trim();
  const quantity = parseFloat(row.querySelector(".editquantity").value);
  const authorName = row.querySelector(".editAuthorName").value.trim();
  const email = row.querySelector(".editEmail").value.trim();

  if (validateBookTable(bookName, quantity, authorName, email, bookID)) {
    const book = booksData.find(b => b.id === bookID);
    book.name = bookName;
    book.quantity = quantity;
    book.author.name = authorName;
    book.author.email = email;

    const index = booksData.findIndex(b => b.id === book.id);
    booksData[index] = book;

    row.innerHTML = createTableRow(book).innerHTML;
    editDeleteBtns(row);
  }
}

function cancelBtnFn(event) {
  const bookID = findBookID(event.target.id);
  const row = event.target.closest("tr");

  const book = booksData.find(b => b.id === bookID);
  row.innerHTML = createTableRow(book).innerHTML;
  editDeleteBtns(row);
}


// helper functions
function generateID() {
  return nextID++;
}

function findBookID(key) {
  return parseInt(key.match(/\d+/));
}

function createTableRow(book) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${book.name}</td>
    <td>${book.quantity.toFixed(2)}</td>
    <td>${book.author.name}</td>
    <td>${book.author.email}</td>
    <td><button class="editBtn" id="edit${book.id}">Edit</button></td>
    <td><button class="deleteBtn" id="delete${book.id}">Delete</button></td>
  `;

  editDeleteBtns(row);
  return row;
}

function editDeleteBtns(row) {
  row.querySelector(".editBtn").addEventListener("click", editBook);
  row.querySelector(".deleteBtn").addEventListener("click", deleteBook);
}

function confirmCancelBtns(row) {
  row.querySelector(".confirmBtn").addEventListener("click", confirmBtnFn);
  row.querySelector(".cancelBtn").addEventListener("click", cancelBtnFn);
}

function clearBooksNumberForm() {
  booksNumberInput.value = "";
  booksNumberError.textContent = "";
}

// validation and errors
function isPositiveInteger(value) {
  return !isNaN(value) && value > 0 && value % 1 === 0;
}

function validateBookForm(bookName, quantity, authorName, email) {
  let isValid = true;

  if (bookName === "") {
    document.getElementById("bookErrorForm").textContent = "Book name is required.";
    isValid = false;
  }

  if (isNaN(quantity) || quantity <= 0 || !/^\d+(\.\d{1,2})?$/.test(quantity)) {
    document.getElementById("quantityErrorForm").textContent = "quantity must be a positive number with up to 2 decimal places.";
    isValid = false;
  }

  if (!/^[A-Za-z\s-]+$/.test(authorName)) {
    document.getElementById("nameErrorForm").textContent = "Author name must contain only letters and spaces.";
    isValid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById("emailErrorForm").textContent = "Please enter a valid email address.";
    isValid = false;
  }

  return isValid;
}

function validateBookTable(bookName, quantity, authorName, email, bookID) {
  let isValid = true;
  resetErrorsTable(bookID);

  if (bookName === "") {
    document.getElementById(`bookErrorTable${bookID}`).textContent = "Book name is required.";
    isValid = false;
  }

  if (isNaN(quantity) || quantity <= 0 || !/^\d+(\.\d{1,2})?$/.test(quantity)) {
    document.getElementById(`quantityErrorTable${bookID}`).textContent = "quantity must be a positive number with up to 2 decimal places.";
    isValid = false;
  }

  if (!/^[A-Za-z\s-]+$/.test(authorName)) {
    document.getElementById(`nameErrorTable${bookID}`).textContent = "Author name must contain only letters and spaces.";
    isValid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById(`emailErrorTable${bookID}`).textContent = "Please enter a valid email address.";
    isValid = false;
  }

  return isValid;
}

function resetErrorsForm() {
  document.getElementById("bookErrorForm").textContent = "";
  document.getElementById("quantityErrorForm").textContent = "";
  document.getElementById("nameErrorForm").textContent = "";
  document.getElementById("emailErrorForm").textContent = "";
}

function resetErrorsTable(bookID) {
  document.getElementById(`bookErrorTable${bookID}`).textContent = "";
  document.getElementById(`quantityErrorTable${bookID}`).textContent = "";
  document.getElementById(`nameErrorTable${bookID}`).textContent = "";
  document.getElementById(`emailErrorTable${bookID}`).textContent = "";
}

// backend functions
async function submitBooksToBackend() {
  try {
    const response = await fetch('http://localhost:3000/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooks),
    });

    const result = await response.json();
    if (response.ok) {
      alert('✅ Books submitted successfully to backend!');
      fetchBooksFromBackend();
      console.log(result);
    } else {
      alert('❌ Backend error: ' + result.error);
    }
  } catch (error) {
    console.error('❌ Network or server error:', error);
    alert('Failed to submit books to backend.');
  }
}

async function fetchBooksFromBackend() {
  try {
    const response = await fetch('http://localhost:3000/api/books');
    const booksFromDB = await response.json();

    booksData = booksFromDB.map(b => {
      const author = new Author(b.author.name, b.author.email);
      return new Book(b._id, b.name, b.quantity, author);
    });
    booksData.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error('❌ Failed to load books from backend:', err);
    alert('Could not load books from server.');
  }
}
