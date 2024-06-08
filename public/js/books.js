(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = window.location.href;

    function displayBooks() {
      const bookList = document.getElementById("book-list");

      getBooks().then((booksData) => {
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

    displayBooks();
  });
})();
