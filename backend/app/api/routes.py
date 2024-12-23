from app.api import bp
from flask import jsonify, request, send_file
import requests
from io import BytesIO
from app.api.api_images import fetch_image, get_tags

from app.api.models import User, Favorite, Download_history
from app.extensions import db, limiter, guard
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
        "access_token": guard.encode_jwt_token(new_user),
        "message": "User created successfully"
    }), 201


@bp.route("/auth/login", methods=["POST"])
@limiter.limit("10/minute")
def login():
    username = request.get_json(force=True).get("username", None)
    password = request.get_json(force=True).get("password", None)
    user = guard.authenticate(username, password)
    return jsonify({
        "access_token": guard.encode_jwt_token(user),
        "message": "Login successful"
    }), 200

@bp.route("/user/favorites", methods=["GET"])   
@limiter.limit("5/minute")
@flask_praetorian.auth_required
def get_favorites():
    user = flask_praetorian.current_user()
    user_id = user.id

    favorites = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify(
        [favorite.format() for favorite in favorites]
    ), 200

@bp.route("/user/favorites", methods=["POST"])
@limiter.limit("50/minute")
@flask_praetorian.auth_required
def add_favorite():
    user = flask_praetorian.current_user()

    user_id = user.id
    image_url = request.get_json(force=True).get("image_url", None)
    source_api = request.get_json(force=True).get("source_api", None)

    new_favorite = Favorite(
        user_id=user_id,
        image_url=image_url,
        source_api=source_api
    )
    try:
        db.session.add(new_favorite)
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify({
            "error": "Image already exists in favorites"
        }), 400

    return jsonify({
        "message": "Image added to favorites"
    }), 201

@bp.route("/images/download", methods=["POST"])
@limiter.limit("50/minute")
def get_download():
    user_id = -1
    try:
        user = flask_praetorian.current_user()
        user_id = user.id
    except:
        # If the user is not authenticated, set the user_id to 6 (anonymous user)
        user_id = 6

    image_url = request.get_json(force=True).get("image_url", None)
    source_api = request.get_json(force=True).get("source_api", None)
    try: 
        response = requests.get(image_url)
    except:
        return jsonify({
            "error": "Image not found"
        }), 404
    
    new_download = Download_history(
        user_id=user_id,
        image_url=image_url,
    )
    try:
        db.session.add(new_download)
        db.session.commit()
    except:
        db.session.rollback()
        return jsonify({
            "error": "Unknown error"
    }), 400

    return send_file(
        BytesIO(response.content),
        mimetype='image/jpeg',
        as_attachment=True,
        download_name='image.jpg'
    )

@bp.route("/images/random", methods=["POST"])
@limiter.limit("50/minute")
def get_image():
    type = request.get_json(force=True).get("type",None)
    tag = request.get_json(force=True).get("tag",None)
    image = fetch_image(tag, type)

    if image.get("error"):
        return jsonify(image), 400

    return jsonify(image), 200

@bp.route("/images/tags", methods=["GET"])
@limiter.limit("10/minute")
def getAll_Tags():
    tags = get_tags()
    return jsonify(tags), 200

@bp.errorhandler(429)
def ratelimit_error(e):
    return jsonify({
        "error" : "Rate limit exceeded"
    }), 429