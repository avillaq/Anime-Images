from app.api import bp
from flask import jsonify, request

from app.api.models import User, Favorite, Download_history
from app.extensions import db, limiter, cache

@bp.route("/")
def home():
    return jsonify({
        "message": "Welcome to the Anime Images API"
    })

@bp.route("/auth/register", methods=["POST"])
def register():
    return {"register": "register"}

@bp.route("/auth/login", methods=["POST"])
def login():
    return {"login": "login"}

@bp.route("/user/favorites", methods=["GET"])   
def get_favorites():
    return {"favorites": "favorites"}

@bp.route("/images/download", methods=["GET"])
def get_download():
    return {"download": "download"}

@bp.route("/images/random", methods=["GET"])
def get_image():
    return {"image": "image"}
