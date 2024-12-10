from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from models import Book, Member, Borrowing

class BookSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Book
        load_instance = True

    subject = fields.String(required=False) 


class MemberSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Member
        load_instance = True

class BorrowingSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Borrowing
        load_instance = True
    
    member = fields.Nested(MemberSchema)
    book = fields.Nested(BookSchema)
