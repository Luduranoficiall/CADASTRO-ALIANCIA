import os
from cryptography.fernet import Fernet, InvalidToken

CRYPTO_KEY = os.getenv("CRYPTO_KEY", "troque-por-uma-chave-muito-forte").encode()

# Gera uma chave Fernet válida se necessário
if len(CRYPTO_KEY) != 44:
    # Se não for base64, gera a partir de 32 bytes hex
    import base64
    if len(CRYPTO_KEY) == 32:
        CRYPTO_KEY = base64.urlsafe_b64encode(CRYPTO_KEY)
    else:
        # Gera uma chave padrão (NÃO use em produção)
        CRYPTO_KEY = Fernet.generate_key()

fernet = Fernet(CRYPTO_KEY)

def encrypt_data(data: str) -> str:
    return fernet.encrypt(data.encode()).decode()

def decrypt_data(token: str) -> str:
    try:
        return fernet.decrypt(token.encode()).decode()
    except InvalidToken:
        return "[DADO CORROMPIDO OU CHAVE ERRADA]"
