from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from models import db, Member

auth_bp = Blueprint('auth', __name__)

# Registration Route
@auth_bp.route('/members', methods=['POST'])
def register():
    data = request.json

    # Check if the email already exists
    existing_member = Member.query.filter_by(email=data['email']).first()
    if existing_member:
        return jsonify({'message': 'Email already registered'}), 400

    # Hash the password using a supported method (e.g., 'pbkdf2')
    hashed_password = generate_password_hash(data['password'], method='pbkdf2')

    # Create the new member
    new_member = Member(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        phone=data.get('phone', ''),
        address=data.get('address', '')
    )
    
    db.session.add(new_member)
    db.session.commit()

    return jsonify({'message': 'Member registered successfully'}), 201

# Login Route for members
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    member = Member.query.filter_by(email=data['email']).first()

    if member and check_password_hash(member.password, data['password']):
        # Create access token with username and role as part of the identity
        access_token = create_access_token(identity={'username': member.email, 'role': 'member' , 'member_id':member.id}, fresh=True)
        return jsonify({'access_token': access_token}), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401


# Admin Login Route
@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.json

    # Predefined admin credentials (for simplicity)
    predefined_username = 'admin'
    predefined_password = 'adminpassword'

    username = data.get('username')
    password = data.get('password')

    # Verify the admin credentials
    if username == predefined_username and password == predefined_password:
    # Include role and other details in the token's identity
        access_token = create_access_token(identity={'username': username, 'role': 'admin'}, fresh=True)
        return jsonify({
        'access_token': access_token
        }), 200

    return jsonify({'message': 'Invalid admin credentials'}), 401
