from flask import Flask
from app.extensions import db, limiter, cache, cors, guard, blacklist
from app.api.models import User
from flask_migrate import Migrate

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    db.init_app(app)
    Migrate(app, db)
    limiter.init_app(app)
    cache.init_app(app, config = {
        "CACHE_TYPE": "SimpleCache"
    })
    cors.init_app(app, 
                resources=r"/api/*",
                origins=["*"],
                methods=["GET", "POST", "PUT", "DELETE"],
                allow_headers = ["Content-Type", "Authorization"],
                expose_headers = ["Content-Range", "X-Content-Range"],
                supports_credentials=False,
        )

    guard.init_app(app, User,is_blacklisted=blacklist.is_blacklisted)

    # Register blueprints
    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    return app
