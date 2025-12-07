
def criar_comprovante_pix(db: Session, user_id: int, filename: str, data_envio: str):
    novo = models.ComprovantePix(user_id=user_id, filename=filename, data_envio=data_envio)
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo
from sqlalchemy.orm import Session
import models, schemas
from utils import hash_senha, verify_senha


def criar_usuario(db: Session, dados: schemas.UserCreate):
    senha_hash = hash_senha(dados.senha)
    novo = models.User(
        nome=dados.nome,
        email=dados.email,
        data_nascimento=dados.data_nascimento,
        senha_hash=senha_hash,
        patrocinador_1=dados.patrocinador_1,
        patrocinador_2=dados.patrocinador_2,
        patrocinador_3=dados.patrocinador_3
    )
    # setters criptografam
    novo.telefone = dados.telefone
    novo.endereco = dados.endereco
    novo.cpf = dados.cpf
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo

def autenticar(db: Session, email: str, senha: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return None
    if not verify_senha(senha, user.senha_hash):
        return None
    return user
