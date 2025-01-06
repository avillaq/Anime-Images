from app.extensions import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False)
    hashed_password = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    MAX_FAVORITES = 50

    __table_args__ = (db.UniqueConstraint("username", name="username"),)

    def __repr__(self):
        return f"<User {self.username}>"
    
    def format(self):
        return {
            "id": self.id,
            "username": self.username
        }
    
    @property
    def identity(self):
        return self.id

    @property
    def rolenames(self):
        # Our user table does not have roles
        return []

    @property
    def password(self):
        return self.hashed_password

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

class Favorite(db.Model):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(255), nullable=False)
    added_at = db.Column(db.DateTime, server_default=db.func.now())

    __table_args__ = (db.UniqueConstraint("user_id", "image_url", name="user_id_image_url"),)

    def __repr__(self):
        return f"<Favorites {self.user_id} {self.image_url}>"

    def format(self):
        return {
            "image_url": self.image_url
        }