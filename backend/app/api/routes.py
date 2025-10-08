from app.api import bp
from app.api.api_images import fetch_image, get_tags
from app.api.models import User, Favorite
from app.extensions import db, limiter, guard, cache, blacklist
import flask_praetorian
from flask import jsonify, request, send_file
import requests
from io import BytesIO
from PIL import Image 
from dotenv import load_dotenv
import os
from sqlalchemy import func

load_dotenv()

@bp.route("/")
def home():
    return jsonify({
        "message": "Welcome to the Anime Images API"
    }), 200

@bp.route("/db/health", methods=["GET"])
def health_check():
    try:
        result = db.session.execute(db.select(func.now()))
        
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "timestamp": str(result.scalar())
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy", 
            "database": "disconnected",
            "error": str(e)
        }), 503


@bp.route("/auth/register", methods=["POST"])
@limiter.limit("5/minute")
def register():
    username = request.get_json().get("username", None)
    password = request.get_json().get("password", None)

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
            "error": {
                "username": "Username is already taken"
            }
        }), 400

    return jsonify({
        "access_token": guard.encode_jwt_token(new_user),
        "message": "User created successfully"
    }), 201


@bp.route("/auth/login", methods=["POST"])
@limiter.limit("5/minute")
def login():
    username = request.get_json().get("username", None)
    password = request.get_json().get("password", None)
    try:
        user = guard.authenticate(username, password)
    except:
        return jsonify({
            "error": {
                "username": "Username or password is incorrect",
                "password": "Username or password is incorrect"
            }
        }), 400
    
    return jsonify({
        "access_token": guard.encode_jwt_token(user),
        "message": "Login successful"
    }), 200

@bp.route("/auth/logout", methods=["POST"])
@flask_praetorian.auth_required
def logout():
    token = guard.read_token_from_header()
    data = guard.extract_jwt_token(token)
    blacklist.add_token(token, data["exp"])
    return jsonify({
        "message": "Logged out successfully"
    }), 200

@bp.route("/auth/refresh", methods=["POST"])
def refresh():
    old_token = guard.read_token_from_header()
    new_token = guard.refresh_jwt_token(old_token)
    return jsonify({
        "access_token": new_token
    }), 200


@bp.route("/user/favorites", methods=["GET"])   
#@limiter.limit("5/minute")
@flask_praetorian.auth_required
def get_favorites():
    user = flask_praetorian.current_user()

    favorites = Favorite.query.filter_by(user_id=user.id).order_by(Favorite.added_at.desc())

    return jsonify({
        "total": favorites.count(),
        "favorites": [favorite.format() for favorite in favorites]
    }), 200

@bp.route("/user/favorites/<path:image_url>", methods=["GET"])   
@flask_praetorian.auth_required
def get_favorite(image_url):
    user = flask_praetorian.current_user()
    user_id = user.id

    favorite = Favorite.query.filter_by(user_id=user_id, image_url=image_url).first()
    if not favorite:
        return jsonify({
            "error": "Image not found in favorites"
        }), 404

    return jsonify(favorite.format()), 200

@bp.route("/user/favorites", methods=["POST"])
@limiter.limit("20/minute")
@flask_praetorian.auth_required
def add_favorite():
    user = flask_praetorian.current_user()

    fav_count = Favorite.query.filter_by(user_id=user.id).count()
    
    if fav_count >= User.MAX_FAVORITES:
        return jsonify({
            "error": "Favorites limit reached"
        }), 400

    user_id = user.id
    image_url = request.get_json().get("image_url", None) 
    
    if "https://i.waifu.pics/" not in image_url and "https://cdn.waifu.im/" not in image_url:
        return jsonify({
            "error": "Invalid image URL"
        }), 400

    try:
        response = requests.get(image_url)
        img = Image.open(BytesIO(response.content))
        width, height = img.size
        
        new_favorite = Favorite(
            user_id=user_id,
            image_url=image_url,
            width=width,
            height=height
        )
    except:
        return jsonify({
            "error": "Image download failed"
        }), 400
    try:
        db.session.add(new_favorite)
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({
            "error": "Image already exists in favorites"
        }), 400

    return jsonify({
        "message": "Image added to favorites"
    }), 201


@bp.route("/user/favorites/<path:image_url>", methods=["DELETE"])
@limiter.limit("20/minute")
@flask_praetorian.auth_required
def delete_favorite(image_url):
    user = flask_praetorian.current_user()
    user_id = user.id

    favorite = Favorite.query.filter_by(user_id=user_id, image_url=image_url).first()
    if not favorite:
        return jsonify({
            "error": "Image not found in favorites"
        }), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({
        "message": "Image removed from favorites"
    }), 200


@bp.route("/images/download", methods=["POST"])
@limiter.limit("30/minute")
def get_download():
    image_url = request.get_json().get("image_url", None)

    if "https://i.waifu.pics/" not in image_url and "https://cdn.waifu.im/" not in image_url:
        return jsonify({
            "error": "Invalid image URL"
        }), 400

    cached_response = cache.get(image_url)
    if cached_response is not None:
        return send_file(
            BytesIO(cached_response["content"]),
            mimetype=cached_response["content_type"],
            as_attachment=True,
            download_name=cached_response["filename"]
        )

    try: 
        response = requests.get(image_url)
    except:
        return jsonify({
            "error": "Download failed"
        }), 400
    
    filename = image_url.split("/")[-1]
    content_type = response.headers.get("Content-Type", "image/jpeg")

    cache.set(image_url, {
        "content": response.content,
        "content_type": content_type,
        "filename": filename
    })

    return send_file(
        BytesIO(response.content),
        mimetype=content_type,
        as_attachment=True,
        download_name=filename
    )


@bp.route("/images/random", methods=["POST"])
@limiter.limit("20/minute")
def get_image():
    type = request.get_json().get("type",None)
    tag = request.get_json().get("tag",None)
    image = fetch_image(tag, type)

    if image.get("error"):
        return jsonify(image), 400

    return jsonify(image), 200


@bp.route("/images/tags", methods=["GET"])
@cache.cached(timeout=3600)
def get_all_tags():
    tags = get_tags()
    return jsonify(tags), 200


@bp.route("/admin/users", methods=["GET"])
def get_all_users():
    secret_key = request.args.get("secret_key")
    if not secret_key or secret_key != os.getenv("SECRET_KEY"):
        return jsonify({
            "error": "Invalid Secret key"
        }), 401
        
    users = User.query.all()
    return jsonify({
        "total": len(users),
        "users": [user.format() for user in users]
    }), 200


@bp.route("/admin/favorites", methods=["GET"])
def get_all_favorites():
    secret_key = request.args.get("secret_key")
    if not secret_key or secret_key != os.getenv("SECRET_KEY"):
        return jsonify({
            "error": "Invalid Secret key"
        }), 401
        
    favorites = Favorite.query.all()
    return jsonify({
        "total": len(favorites),
        "favorites": [favorite.format() for favorite in favorites]
    }), 200


@bp.route("/admin/users/<int:user_id>/favorites", methods=["GET"])
def get_user_favorites(user_id):
    secret_key = request.args.get("secret_key")
    if not secret_key or secret_key != os.getenv("SECRET_KEY"):
        return jsonify({
            "error": "Invalid Secret key"
        }), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({
            "error": "User not found"
        }), 404
        
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify({
        "id": user.id,
        "username": user.username,
        "total": len(favorites),
        "favorites": [favorite.format() for favorite in favorites]
    }), 200


@bp.errorhandler(429)
def ratelimit_error(e):
    return jsonify({
        "error" : "Rate limit exceeded, please wait a while before trying again"
    }), 429