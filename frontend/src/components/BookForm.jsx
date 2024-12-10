import { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { addBook, updateBook } from '../api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const BookForm = ({ book }) => {
  const [title, setTitle] = useState(book ? book.title : '');
  const [author, setAuthor] = useState(book ? book.author : '');
  const [isbn, setIsbn] = useState(book ? book.isbn : '');
  const [genre, setGenre] = useState(book ? book.genre : '');
  const [description, setDescription] = useState(book ? book.description : '');
  const [quantity, setQuantity] = useState(book ? book.quantity : '');
  const [publishedDate, setPublishedDate] = useState(book ? book.published_date : ''); // New state for published date
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear any previous errors

    try {
      const bookData = { title, author, isbn, genre, description, published_date: publishedDate, quantity };
      
      if (book) {
        await updateBook(book.id, bookData);
        alert('Book updated successfully!');
      } else {
        await addBook(bookData);
        alert('Book added successfully!');
      }

      // After successfully adding or updating, navigate to '/books'
      navigate('/books');
    } catch (error) {
      setError('Error adding/updating book. Please try again.');
      console.error('Error adding/updating book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{book ? 'Update Book' : 'Add New Book'}</h2>
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        {/* Title Input */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Author Input */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder='Author'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        {/* ISBN Input */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder='ISBN'
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
        </div>

        {/* Genre Input */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder='Genre'
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </div>

        {/* Description Input */}
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Quantity Input */}
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder='Quantity'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        {/* Published Date Input */}
        <div className="mb-3">
          <input
            type="date"
            className="form-control"
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            required
          />
        </div>

        {/* Error Message */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
          {isLoading ? 'Saving...' : book ? 'Update Book' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

// Add prop validation
BookForm.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    author: PropTypes.string,
    isbn: PropTypes.string,
    genre: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.number,
    published_date: PropTypes.string, // Ensure published_date is a string (ISO 8601 format)
  }),
};

export default BookForm;
