import React, { useEffect, useState } from "react";
import BookCreate from "./components/BookCreate";
import BookList from "./components/BookList";
import axios from "axios";

const App = () => {
  const [books, setBooks] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const fetchBooks = async () => {
    const response = await axios.get("http://localhost:3001/books");

    setBooks(response.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // DONT DO THIS this will cause infinite loop
  // fetchBooks();

  const createBook = async (title) => {
    const response = await axios.post("http://localhost:3001/books", {
      title,
    });

    const updateBooks = [...books, response.data];
    setBooks(updateBooks);
  };
  const deleteBookById = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book"
    );

    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:3001/books/${id}`);
      const deleteBook = books.filter((book) => {
        return book.id !== id;
      });
      setBooks(deleteBook);
      setShowAlert(true);
    } catch (err) {
      console.log("Error deleting Book", err);
      window.alert("An error occurred while deleting the book.");
    }
  };

  const editBookById = async (id, newTitle) => {
    const response = await axios.put(`http://localhost:3001/books/${id}`, {
      title: newTitle,
    });

    console.log(response);
    const updateBook = books.map((book) => {
      if (book.id === id) {
        return { ...book, ...response.data };
      }
      return book;
    });
    setBooks(updateBook);
  };

  return (
    <div className="app">
      <h1>Reading List</h1>
      <BookList onEdit={editBookById} onDelete={deleteBookById} books={books} />
      <BookCreate onCreate={createBook} />
    </div>
  );
};

export default App;
