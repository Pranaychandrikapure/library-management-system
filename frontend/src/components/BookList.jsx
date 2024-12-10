import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { fetchBooks, borrowBook, updateBook, deleteBook } from '../api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setMember] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null); // Store selected book for editing
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  const [formValues, setFormValues] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    description: '',
    quantity: 0, // Assuming quantity is part of the book data
  });

  useEffect(() => {
    const getBooks = async () => {
      try {
        const response = await fetchBooks();
        if (response && response.data && Array.isArray(response.data)) {
          setBooks(response.data);
        } else {
          console.error('No books found in the response');
          setBooks([]);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]);
      }
    };

    const checkUserRole = async () => {
      try {
        const response = await fetchBooks();
        const userRole = response.user_role;
        if (userRole === 'admin') {
          setIsAdmin(true);
        }
        if (userRole === 'member') {
          setMember(true);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    checkUserRole();
    getBooks();
  }, []);

  const handleBorrow = async (bookId) => {
    try {
      if (!bookId) {
        alert('Invalid book ID');
        return;
      }
      await borrowBook(bookId);
      alert('Book borrowed successfully!');
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Failed to borrow the book. Please try again.');
    }
  };

  const handleEdit = (book) => {
    // Set selected book and open the modal
    setSelectedBook(book);
    setFormValues({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre,
      description: book.description,
      quantity: book.quantity,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (bookId) => {
    try {
      await deleteBook(bookId);
      setBooks(books.filter((book) => book.id !== bookId));
      alert('Book deleted successfully!');
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete the book. Please try again.');
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update book using the form values
      await updateBook(selectedBook.id, formValues);
      setBooks(
        books.map((book) =>
          book.id === selectedBook.id ? { ...book, ...formValues } : book
        )
      );
      alert('Book updated successfully!');
      setIsModalOpen(false); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update the book. Please try again.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal without updating
  };

  return (
    <div className='container'>
      <h2>Book List</h2>
      {books && books.length > 0 ? (
        <div className="row">
          {books.map((book) => (
            <div className="col-12 col-sm-6 col-md-4" key={book.id}>
              <div className="card mb-4 book-card">
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <h6 className="card-subtitle mb-2 text-body-secondary">{book.author}</h6>
                  <p className="card-text">{book.description}</p>
                  <p className="card-text"><strong>Genre:</strong> {book.genre}</p>
                  <p className="card-text"><strong>Published Date:</strong> {book.published_date}</p>

                  {/* Borrow Button */}
                  {isMember && (<button 
                    className="btn btn-primary" 
                    onClick={() => handleBorrow(book.id)}
                  >
                    Borrow
                  </button>)}

                  {/* Admin Edit and Delete Buttons */}
                  {isAdmin && (
                    <div className="mt-2">
                      <button 
                        className="btn btn-warning mr-2" 
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No books available</p>
      )}

      {/* Modal for editing book details */}
      <Modal isOpen={isModalOpen} onRequestClose={handleModalClose}>
        <h2>Edit Book</h2>
        <form onSubmit={handleModalSubmit}>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={formValues.title}
              onChange={(e) =>
                setFormValues({ ...formValues, title: e.target.value })
              }
            />
          </div>
          <div>
            <label>Author</label>
            <input
              type="text"
              value={formValues.author}
              onChange={(e) =>
                setFormValues({ ...formValues, author: e.target.value })
              }
            />
          </div>
          <div>
            <label>ISBN</label>
            <input
              type="text"
              value={formValues.isbn}
              onChange={(e) =>
                setFormValues({ ...formValues, isbn: e.target.value })
              }
            />
          </div>
          <div>
            <label>Genre</label>
            <input
              type="text"
              value={formValues.genre}
              onChange={(e) =>
                setFormValues({ ...formValues, genre: e.target.value })
              }
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={formValues.description}
              onChange={(e) =>
                setFormValues({ ...formValues, description: e.target.value })
              }
            />
          </div>
          <div>
            <label>Quantity</label>
            <input
              type="number"
              value={formValues.quantity}
              onChange={(e) =>
                setFormValues({ ...formValues, quantity: e.target.value })
              }
            />
          </div>
          <button type="submit">Update</button>
          <button type="button" onClick={handleModalClose}>
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default BookList;
