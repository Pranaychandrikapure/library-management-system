from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager, jwt_required,get_jwt_identity, get_jwt 
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Book, Member, Borrowing  # Import your models
from schemas import BookSchema, MemberSchema, BorrowingSchema  # Import your schemas
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from flask_cors import CORS
from auth import auth_bp  # Import the auth Blueprint

app = Flask(__name__)

# Enable CORS for all routes and methods
CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers=["Content-Type", "Authorization"])

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'  # Change to your database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Change to your JWT secret key
db.init_app(app)
ma = Marshmallow(app)
jwt = JWTManager(app)

# Register auth Blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')

# Create the database tables
with app.app_context():
    db.create_all()

# ============================================================ CRUD Routes for Books ============================================================

@app.route('/books', methods=['POST'])
@jwt_required()
def add_book():
    jwt_data = get_jwt()  # Get JWT data
    print(f"JWT Data: {jwt_data}")  # Debugging line

    user_role = jwt_data.get('sub', {}).get('role', None)
    print(user_role)  # Safely get 'role' from JWT

    if user_role != 'admin':
        return jsonify({"error": "Only admin can add a book"}), 403

    data = request.get_json()

    if 'title' not in data or 'author' not in data:
        return jsonify({"error": "Title and author are required"}), 400

    try:
        subject = str(data.get('subject', '')) 
    except (ValueError, TypeError):
        return jsonify({"error": "Subject must be a string"}), 400

    new_book = Book(
        title=data['title'],
        author=data['author'],
        subject=subject,
        published_date=data.get('published_date', ''),
        isbn=data.get('isbn', ''),
        genre=data.get('genre', ''),
        description=data.get('description', '')
    )

    try:
        db.session.add(new_book)
        db.session.commit()
        return jsonify({"message": "Book added successfully", "book": BookSchema().dump(new_book)}), 201
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"error": "An error occurred while adding the book."}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Update book 
@app.route('/books/<int:id>', methods=['PUT'])
@jwt_required()
def update_book(id):
    jwt_data = get_jwt()  # Extract JWT data
    print(f"JWT Data: {jwt_data}")  # Debugging

    # Verify the user role
    user_role = jwt_data.get('sub', {}).get('role', None)
    if user_role != 'admin':
        return jsonify({"error": "Only admins can update a book"}), 403

    data = request.get_json()  # Parse the request JSON
    if not data:
        return jsonify({"error": "Invalid request. JSON data is required"}), 400

    # Fetch the book from the database
    book = Book.query.get_or_404(id)

    # Validate the required fields if any need to be updated
    if 'title' in data and not isinstance(data['title'], str):
        return jsonify({"error": "Title must be a string"}), 400
    if 'author' in data and not isinstance(data['author'], str):
        return jsonify({"error": "Author must be a string"}), 400

    # Update fields dynamically from request data
    try:
        for key, value in data.items():
            if hasattr(book, key):
                setattr(book, key, value)

        db.session.commit()
        return jsonify({"message": "Book updated successfully", "book": BookSchema().dump(book)}), 200
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"error": "Database error occurred while updating the book."}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


#Delete the book 
@app.route('/books/<int:book_id>', methods=['DELETE'])
@jwt_required()
def delete_book(book_id):
    jwt_data = get_jwt()
    user_role = jwt_data.get('sub', {}).get('role', None)

    if user_role != 'admin':
        return jsonify({"error": "Only admin can delete a book"}), 403

    book = Book.query.get_or_404(book_id)

    try:
        db.session.delete(book)
        db.session.commit()
        return jsonify({'message': 'Book deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# ============================================================ Admin Routes ============================================================
#Get all members
@app.route('/members', methods=['GET'])
@jwt_required()
def get_members():
    # Get the current user from JWT
    jwt_data = get_jwt()
    user_role = jwt_data.get('sub', {}).get('role', None)

    # Check if the current user is an admin
    if not user_role or user_role != 'admin':
        return jsonify({"error": "Only admin can access the members list"}), 403

    # Fetch all members from the database
    try:
        members = Member.query.all()  # Get all members from the Member table
        # Use the MemberSchema instance to serialize the member objects
        members_list = [MemberSchema().dump(member) for member in members]  
        return jsonify(members_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# Admin delete a member
@app.route('/members/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_member(id):
    current_user = get_jwt_identity()

    if not current_user or current_user.get('role') != 'admin':
        return jsonify({"error": "Only admin can delete a member"}), 403

    member = Member.query.get_or_404(id)
    try:
        db.session.delete(member)
        db.session.commit()
        return jsonify({'message': 'Member deleted successfully'}), 204
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ============================================================ Get Books Route ============================================================

@app.route('/books', methods=['GET'])
@jwt_required()
def get_books():
    # Get the current user's identity (access token)
    jwt_data = get_jwt() 
    print(jwt_data)

    # Get the role from JWT (assuming it's stored in the sub field)
    user_role = jwt_data.get('sub', {}).get('role', None)

    # Get query parameters for filtering books
    title = request.args.get('title', None)
    author = request.args.get('author', None)
    genre = request.args.get('genre', None)

    # Base query for books
    query = Book.query

    # Apply filters based on query parameters
    if title:
        query = query.filter(Book.title.ilike(f"%{title}%"))
    if author:
        query = query.filter(Book.author.ilike(f"%{author}%"))
    if genre:
        query = query.filter(Book.genre.ilike(f"%{genre}%"))

    # Fetch the filtered results
    books = query.all()

    # Serialize the results using BookSchema
    book_schema = BookSchema(many=True)
    books_data = book_schema.dump(books)

    # Add the user's role to the response
    response_data = {
        "data": books_data,
        "user_role": user_role  # Include the user's role
    }

    return jsonify(response_data), 200

#======================================================Book brorrow and return ===================================

@app.route('/borrow', methods=['POST'])
@jwt_required()
def borrow_book():
    data = request.json
    member_identity = get_jwt_identity()  # Get the current member's identity from JWT

    member_id = member_identity['member_id']  # Extract member ID from the JWT token

    # Check if book exists
    book = Book.query.get_or_404(data['book_id'])

    # Check if the book is already borrowed (you can add more logic here to handle availability)
    existing_borrow = Borrowing.query.filter_by(book_id=book.id, return_date=None).first()
    if existing_borrow:
        return jsonify({"msg": "This book is already borrowed."}), 400

    # Create a new borrowing record
    borrowing = Borrowing(member_id=member_id, book_id=book.id)
    db.session.add(borrowing)
    db.session.commit()

    return jsonify({"msg": f"Book '{book.title}' borrowed successfully."}), 200


@app.route('/return', methods=['POST'])
@jwt_required()
def return_book():
    data = request.json
    member_id = get_jwt_identity()  # Get the current member from JWT

    # Find the borrowing record
    borrowing = Borrowing.query.filter_by(book_id=data['book_id'], member_id=member_id, return_date=None).first()
    
    if not borrowing:
        return jsonify({"msg": "You have not borrowed this book or the book has already been returned."}), 400

    # Mark the book as returned by updating the return_date
    borrowing.return_date = datetime.utcnow()
    db.session.commit()

    return jsonify({"msg": "Book returned successfully."}), 200

# Get borrowed books of a member
@app.route('/my_borrowed_books', methods=['GET'])
@jwt_required()
def get_borrowed_books():
    member_id = get_jwt_identity()  # Get the current member from JWT

    # Fetch all borrowed books of the current member
    borrowed_books = Borrowing.query.filter_by(member_id=member_id, return_date=None).all()

    borrowed_books_schema = BorrowingSchema(many=True)
    return jsonify(borrowed_books=borrowed_books_schema.dump(borrowed_books))


# ============================================================ Running the app ============================================================

if __name__ == '__main__':
    app.run(debug=True)
