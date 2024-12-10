import os

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-default-secret-key')  # Consider using a default only for local development
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI', 'sqlite:///library.db')  # Ensure to change for production
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-default-jwt-secret-key')  # Use defaults for local dev
