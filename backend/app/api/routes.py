from app.api import bp
from flask import jsonify, request
from app.api.api_images import fetch_image, get_tags

from app.api.models import User, Favorite, Download_history
from app.extensions import db, limiter, cache, guard
import flask_praetorian

@bp.route("/")
def home():
    return jsonify({
        "message": "Welcome to the Anime Images API"
    }), 200

@bp.route("/auth/register", methods=["POST"])
def register():
    username = request.get_json(force=True).get("username", None)
    password = request.get_json(force=True).get("password", None)

    new_user = User(
        username=username,
        hashed_password=guard.hash_password(password),
    )
    try:
        db.session.add(new_user)
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify({
            "error": "Username already exists"
        }), 400

    return jsonify({
        "access_token": guard.encode_jwt_token(new_user)
    }), 201


@bp.route("/auth/login", methods=["POST"])
def login():
    username = request.get_json(force=True).get("username", None)
    password = request.get_json(force=True).get("password", None)
    user = guard.authenticate(username, password)
    return jsonify({
        "access_token": guard.encode_jwt_token(user)
    }), 200

@bp.route("/user/favorites", methods=["GET"])   
@flask_praetorian.auth_required
def get_favorites():
    return {"favorites": "favorites"}

@bp.route("/images/download", methods=["GET"])
def get_download():
    return {"download": "download"}

@bp.route("/images/random", methods=["POST"])
def get_image():
    type = request.get_json(force=True).get("type",None)
    tag = request.get_json(force=True).get("tag",None)
    image = fetch_image(tag, type)

    if image.get("error"):
        return jsonify(image), 400

    return jsonify(image), 200

@bp.route("/images/tags", methods=["GET"])
def search_image():
    tags = get_tags()
    return jsonify(tags), 200