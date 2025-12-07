
class ComprovantePixUpload(BaseModel):
    user_id: int

class ComprovantePixOut(BaseModel):
    id: int
    user_id: int
    filename: str
    status: str
    data_envio: str

    class Config:
        orm_mode = True
from pydantic import BaseModel, EmailStr

class RecuperarSenha(BaseModel):
    email: EmailStr
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    nome: str
    telefone: str
    endereco: str
    email: EmailStr
    cpf: str
    data_nascimento: str
    senha: str
    patrocinador_1: int | None = None
    patrocinador_2: int | None = None
    patrocinador_3: int | None = None

class UserOut(BaseModel):
    id: int
    nome: str
    email: str
    telefone: str
    endereco: str
    cpf: str
    data_nascimento: str
    patrocinador_1: int | None
    patrocinador_2: int | None
    patrocinador_3: int | None

    class Config:
        orm_mode = True

class Login(BaseModel):
    email: EmailStr
    senha: str
