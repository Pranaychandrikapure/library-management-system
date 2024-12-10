from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask import Flask

app = Flask(__name__)
db = SQLAlchemy()
migrate = Migrate(app, db) 

# Book Model
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(100))  # Allow None or empty string
    published_date = db.Column(db.String(100))
    isbn = db.Column(db.String(20))
    genre = db.Column(db.String(50))
    description = db.Column(db.String(200))
    quantity = db.Column(db.Integer, default=1)

    def __init__(self, title, author, subject=None, published_date=None, isbn=None, genre=None, description=None, quantity=1):
        self.title = title
        self.author = author
        self.subject = subject
        self.published_date = published_date
        self.isbn = isbn
        self.genre = genre
        self.description = description
        self.quantity = quantity


# Member Model
class Member(db.Model):
    __tablename__ = 'member'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='member')  # Add role column here

    def __repr__(self):
        return f"<Member {self.name}>"


# Borrowing Model
class Borrowing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('member.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    borrow_date = db.Column(db.DateTime, default=datetime.utcnow)
    return_date = db.Column(db.DateTime, nullable=True)

    member = db.relationship('Member', backref=db.backref('borrowed_books', lazy=True))
    book = db.relationship('Book', backref=db.backref('borrowers', lazy=True))

    def __init__(self, member_id, book_id):
        self.member_id = member_id
        self.book_id = book_id
