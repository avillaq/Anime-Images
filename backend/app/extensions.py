from flask_sqlalchemy import SQLAlchemy
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache
from flask_cors import CORS
from flask_praetorian import Praetorian

# Conection to the database
db = SQLAlchemy()

# Configurations for rate limiting
limiter = Limiter(
    key_func=get_remote_address
)

# Configuration for caching
cache = Cache()

# Configuration for CORS
cors = CORS()

# Configuration for JWT
blacklist = set()
guard = Praetorian()