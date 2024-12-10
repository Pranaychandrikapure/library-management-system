import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container mt-5">
  <h2 className="text-center mb-4">Admin Dashboard</h2>
  
  {/* Navigation Buttons */}
  <nav className="mb-4">
    <div className="d-flex justify-content-center gap-3">
      <Link to="/book/add" className="btn btn-success">Add Book</Link>
      <Link to="/all-members" className="btn btn-danger">Manage Members</Link>
    </div>
  </nav>
  
  {/* Available Books Section */}
  <div className="mt-4">
    <h3 className="text-center mb-4">Available Books</h3>
    <div className="d-flex justify-content-center">
      <Link to="/books" className="btn btn-primary">Manage Books</Link>
    </div>
  </div>
</div>

  );
};

export default AdminDashboard;
