(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = window.location.href;

    function displayBooks() {
      const bookList = document.getElementById("book-list");
      getBooks().then((booksData) => {
        const buttons = [];
        const items = [];

        booksData.forEach((book, index) => {
          const isbnItem = document.createElement("li");
          isbnItem.setAttribute("data-id", book.id);
          items.push(isbnItem);
          isbnItem.classList.add("grid-item");
          isbnItem.textContent = book.id;
          bookList.appendChild(isbnItem);

          const titleItem = document.createElement("li");
          titleItem.setAttribute("data-id", book.id);
          items.push(titleItem);
          titleItem.classList.add("grid-item");
          titleItem.classList.add(book.id);
          titleItem.textContent = book.title;
          bookList.appendChild(titleItem);

          const dateItem = document.createElement("li");
          dateItem.setAttribute("data-id", book.id);
          items.push(dateItem);
          dateItem.classList.add("grid-item");
          dateItem.classList.add(book.id);
          const displayedDate = moment(book.releaseDate).format("DD/MM/YYYY");
          dateItem.textContent = displayedDate;
          bookList.appendChild(dateItem);

          const editItem = document.createElement("li");
          editItem.setAttribute("data-id", book.id);
          items.push(editItem);
          editItem.classList.add("grid-item");
          const button = document.createElement("button");
          buttons.push(button);
          button.setAttribute("data-id", book.id);
          button.setAttribute("id", index + 1);
          button.innerHTML = "modifier";
          button.classList.add("edit-button");
          button.classList.add("update");
          editItem.appendChild(button);

          const deleteButton = document.createElement("button");
          deleteButton.setAttribute("data-id", book.id);
          deleteButton.innerHTML = "supprimer";
          deleteButton.classList.add("delete-button");
          deleteButton.classList.add("delete");
          editItem.appendChild(deleteButton);
          bookList.appendChild(editItem);
        });
        getBookFromButtons();
        deleteBookFromButtons();
      });
    }

    function getBooks() {
      return fetch(baseUrl + "api/books")
        .then((booksData) => {
          if (!booksData.ok) {
            throw new Error("Erreur lors de la récupération des données");
          }
          return booksData.json();
        })
        .catch((error) => {
          console.error("Erreur :", error);
        });
    }

    function addBook() {
      const form = document.getElementById("add-form");

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const dateInput = form.querySelector("#added-date");
        const dateObject = moment(dateInput.value);
        const formattedDate = dateObject.toISOString();

        const bookData = {
          title: form.querySelector("#added-title").value,
          releaseDate: formattedDate,
        };

        fetch(baseUrl + "api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ book: bookData }),
        })
          .then((bookData) => {
            if (!bookData.ok) {
              throw new Error("Problème avec la requête Fetch");
            }
            return bookData.json();
          })
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            console.error("Erreur:", error);
          });
      });
    }

    function getBookFromButtons() {
      const editButtons = document.querySelectorAll(".update");

      const buttonsNodeList = [];
      for (let i = 1; i < editButtons.length + 1; i++) {
        buttonsNodeList.push(document.getElementById(i));
      }

      buttonsNodeList.forEach((button) => {
        button.addEventListener("click", function () {
          const isbn = this.getAttribute("data-id");
          const bookItem = document.getElementById("book-item");
          if (bookItem.innerHTML == "") {
            displayOneBook(isbn);
            updateBook(isbn);
          } else {
            bookItem.innerHTML = "";
            displayOneBook(isbn);
            updateBook(isbn);
          }
        });
      });
    }

    function updateBook(id) {
      const form = document.querySelector("#update-form");

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const url = `${baseUrl}api/books/${id}`;

        const bookData = {
          title: document.querySelector("#updated-title").value,
          releaseDate: form.querySelector("#updated-date").value,
        };

        fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ book: bookData }),
        })
          .then((booksData) => {
            if (!booksData.ok) {
              throw new Error("Problème avec la requête Fetch");
            }
          })
          .then(() => {
            window.location.reload();
          })
          .catch((error) => {
            console.error("Erreur:", error);
          });
      });
    }

    function getOneBook(id) {
      return fetch(baseUrl + "api/books/" + id)
        .then((bookData) => {
          if (!bookData.ok) {
            throw new Error("Erreur lors de la récupération des données");
          }
          return bookData.json();
        })
        .catch((error) => {
          console.error("Erreur :", error);
        });
    }

    function displayOneBook(id) {
      getOneBook(id)
        .then((bookData) => {
          const bookItem = document.getElementById("book-item");

          const isbnItem = document.createElement("li");
          isbnItem.classList.add("grid-item");
          isbnItem.textContent = bookData.book.id;
          bookItem.appendChild(isbnItem);

          const titleItem = document.createElement("li");
          titleItem.classList.add("grid-item");
          const titleInput = document.createElement("input");
          titleInput.setAttribute("type", "text");
          titleInput.setAttribute("id", "updated-title");
          titleInput.setAttribute("name", "title");
          titleInput.setAttribute("placeholder", "saisir un titre");
          titleInput.setAttribute("placeholder", bookData.book.title);
          titleItem.appendChild(titleInput);
          bookItem.appendChild(titleItem);

          const dateItem = document.createElement("li");
          dateItem.classList.add("grid-item");
          const dateInput = document.createElement("input");
          dateInput.setAttribute("type", "date");
          dateInput.setAttribute("id", "updated-date");
          dateInput.setAttribute("name", "date");
          dateItem.appendChild(dateInput);
          bookItem.appendChild(dateItem);

          const submitItem = document.createElement("li");
          submitItem.classList.add("grid-item");
          const submitButton = document.createElement("button");
          submitButton.innerHTML = "Confirmer";
          submitButton.classList.add("edit-button");
          submitButton.setAttribute("id", "update-button");
          submitItem.appendChild(submitButton);
          bookItem.appendChild(submitItem);
        })
        .catch((error) => {
          console.error("Erreur :", error);
        });
    }

    function deleteBookFromButtons() {
      const deleteButtons = document.querySelectorAll(".delete");

      deleteButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const isbn = this.getAttribute("data-id");
          deleteOneBook(isbn);
        });
      });
    }

    function deleteOneBook(id) {
      const deletedItems = document.getElementsByClassName(id);

      const bookData = {
        title: deletedItems[0].textContent,
        releaseDate: deletedItems[1].textContent,
      };

      fetch(baseUrl + "api/books/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book: bookData }),
      })
        .then((booksData) => {
          if (!booksData.ok) {
            throw new Error("Problème avec la requête Fetch");
          }
          console.log(bookData);
        })
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.error("Erreur:", error);
        });
    }

    displayBooks();
    addBook();
  });
})();
