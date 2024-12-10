import axios from 'axios';

// Create an Axios instance with default settings
const api = axios.create({
    baseURL: 'http://127.0.0.1:5000', // Replace with your Flask server's URL
    headers: { 'Content-Type': 'application/json' },
  });

// Get token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// Set JWT token in request headers for authentication
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Register function (sending data object directly)
export const register = (data) => {
  return api.post('/auth/members', data)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error during registration:", error);
      throw error.response ? error.response.data : error;
    });
};

// Login function (login using email and password)
export const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response; // Return response if successful
    } catch (error) {
      // Log error details for debugging
      console.error('Error during login:', error.response ? error.response.data : error.message);
      throw error; // Propagate the error for handling in the Login component
    }
  };  

// Admin login function (login using username and password for admin)
export const adminLogin = async (username, password) => {
    try {
      const response = await api.post('/auth/admin/login', { username, password });
      return response.data;
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        // No response received
        console.error('No response from server:', error.request);
      } else {
        // Error setting up the request
        console.error('Error message:', error.message);
      }
      throw error;
    }
  };  
  
  
// Fetch books (example of a GET request with JWT)
export const fetchBooks = () => {
    return api.get('/books')
      .then((response) => response.data)  // Handles successful response
      .catch((error) => {
        console.error("Error fetching books:", error);  // Handles error response
        throw error.response ? error.response.data : error;
      });
  };
  

  export const borrowBook = (bookId) => {
    const bookIdString = String(bookId);  // Ensure book_id is a string
    
    return api.post('/borrow', { book_id: bookIdString })  // Sends book_id as a string in the request body
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error borrowing book:", error.response ? error.response.data : error);
        throw error.response ? error.response.data : error;
      });
  };
  
  
  

// Add new book (example of a POST request)
export const addBook = (bookData) => {
  return api.post('/books', bookData)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error adding book:", error);
      throw error.response ? error.response.data : error;
    });
};

// Update book (example of a PUT request)
export const updateBook = (bookId, bookData) => {
  return api.put(`/books/${bookId}`, bookData)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error updating book:", error);
      throw error.response ? error.response.data : error;
    });
};

// Delete book (example of a DELETE request)
export const deleteBook = (bookId) => {
  return api.delete(`/books/${bookId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error deleting book:", error);
      throw error.response ? error.response.data : error;
    });
};

//fetch the all membares in database
export const fetchAllMembers = () => {
  return api.get('/members') // Make a GET request to the /members endpoint
    .then((response) => response.data) // Return the data from the response
    .catch((error) => {
      console.error("Error fetching members:", error); // Log any errors
      throw error.response ? error.response.data : error; // Throw the error if one occurs
    });
};


// Delete member (example of a DELETE request)
export const deleteMember = (memberId) => {
  return api.delete(`/members/${memberId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error deleting member:", error);
      throw error.response ? error.response.data : error;
    });
};
