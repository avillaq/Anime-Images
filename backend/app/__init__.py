from flask import Flask
from backend.app.extensions import db, limiter, cache
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object({})

    db.init_app(app)
    limiter.init_app(app)
    cache.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Registrar los Blueprints
    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
