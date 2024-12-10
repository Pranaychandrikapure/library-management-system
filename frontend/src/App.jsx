import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Switch is replaced by Routes
import Register from './components/Register';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import MemberList from './components/MembersList';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand fs-3" href="#">Library Management System</a>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav ms-auto">
                <a className="nav-link" href="/login">Login</a>
                <a className="nav-link" href="/register">Register</a>
                <a className="nav-link" href="/adminLogin">Admin Login</a>
              </div>
            </div>
          </div>
        </nav>
        <Routes> {/* Replace Switch with Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/book/add" element={<BookForm />} />
          <Route path="/book/:id" element={<BookForm />} />
          <Route path="/all-members" element={<MemberList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
