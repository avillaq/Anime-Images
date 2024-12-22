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
    get_remote_address,
    default_limits=["200/day", "50/hour"],
)

# Configuration for caching
cache = Cache(config = {
    "DEBUG": True,
    "CACHE_TYPE": "SimpleCache",
    "CACHE_DEFAULT_TIMEOUT": 300
})

# Configuration for CORS
cors = CORS()

# Configuration for JWT
guard = Praetorian()