def criar_token_reset(email):
    from datetime import datetime, timedelta
    from jose import jwt
    dados = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    return jwt.encode(dados, SECRET_KEY, algorithm=ALGORITHM)
from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "CHAVE_SUPER_SECRETA_ALIANCI.A_2025"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600

def criar_token(email: str):
    dados = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    return jwt.encode(dados, SECRET_KEY, algorithm=ALGORITHM)
