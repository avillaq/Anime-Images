from app.extensions import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False)
    password = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    last_login = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db.func.now())

    def __repr__(self):
        return f"<User {self.email}>"

    def format(self):
        return {
            'id': self.id,
            'email': self.email,
            'last_login': self.fecha
        }

class Favorite(db.Model):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(255), nullable=False)
    source_api = db.Column(db.String(255), nullable=False)
    added_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<Favorites {self.user_id} {self.image_url}>"

    def format(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'image_url': self.image_url,
            'source_api': self.source_api,
        }

class Download_history(db.Model):
    __tablename__ = 'download_history'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(255), nullable=False)
    downloaded_at = db.Column(db.DateTime, server_default=db.func.now())
    ip_address = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"<Download_history {self.user_id} {self.image_url}>"

    def format(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'image_url': self.image_url,
            'downloaded_at': self.downloaded_at,
            'ip_address': self.ip_address,
        }