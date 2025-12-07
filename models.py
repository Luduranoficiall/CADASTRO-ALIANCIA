
class ComprovantePix(Base):
    __tablename__ = "comprovantes_pix"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String)
    status = Column(String, default="pendente")  # pendente, aprovado, rejeitado
    data_envio = Column(String)
    user = relationship("User")
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base



from crypto_utils import encrypt_data, decrypt_data

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    _telefone = Column("telefone", String)
    _endereco = Column("endereco", String)
    email = Column(String, unique=True, index=True)
    _cpf = Column("cpf", String, unique=True)
    data_nascimento = Column(String)
    senha_hash = Column(String, nullable=False)

    # 3 níveis
    patrocinador_1 = Column(Integer, ForeignKey("users.id"))
    patrocinador_2 = Column(Integer, ForeignKey("users.id"))
    patrocinador_3 = Column(Integer, ForeignKey("users.id"))

    filhos = relationship("User", remote_side=[id])

    # Gamificação
    nivel = Column(Integer, default=1)
    pontos = Column(Integer, default=0)

    @property
    def telefone(self):
        return decrypt_data(self._telefone) if self._telefone else None

    @telefone.setter
    def telefone(self, value):
        self._telefone = encrypt_data(value) if value else None

    @property
    def endereco(self):
        return decrypt_data(self._endereco) if self._endereco else None

    @endereco.setter
    def endereco(self, value):
        self._endereco = encrypt_data(value) if value else None

    @property
    def cpf(self):
        return decrypt_data(self._cpf) if self._cpf else None

    @cpf.setter
    def cpf(self, value):
        self._cpf = encrypt_data(value) if value else None


class Movimento(Base):
    __tablename__ = "movimentos"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    tipo = Column(String)
    valor = Column(Integer)
    data = Column(String)
