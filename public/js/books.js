(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => { 
      
    const baseUrl = window.location.href;   

    function displayBooks() {
      const bookList = document.getElementById("book-list");

      getBooks().then((booksData) => {
        const items = [];
        const buttons = [];

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

    displayBooks();
    addBook();
  });
})();
