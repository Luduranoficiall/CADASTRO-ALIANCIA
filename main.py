
# --- IMPORTS ---
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from datetime import datetime
import logging
import os
from sqlalchemy.orm import Session
import models, schemas
from database import engine, SessionLocal
import crud
from auth import criar_token

# --- APP E DB ---

from fastapi import Response
app = FastAPI(title="ALIANCIA — Sistema de Cadastro 3 Níveis")

# Middleware de headers de segurança HTTP
@app.middleware("http")
async def security_headers(request, call_next):
    response: Response = await call_next(request)
    response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

# Configurar logging estruturado
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger(__name__)

# CORS seguro — em produção, ajuste para apenas os domínios do seu frontend!
origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://aliancia.app.br",
    # Exemplo: "https://seu-frontend.com",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Em produção, NUNCA deixe como ["*"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware para logging de requisições
@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"{request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Status: {response.status_code}")
    return response

# Middleware para tratamento global de exceções
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Erro inesperado: {exc}")
    return JSONResponse(status_code=500, content={"detail": "Erro interno inesperado. Tente novamente ou contate o suporte."})


# --- IMPORTS ---
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from datetime import datetime
import os
from sqlalchemy.orm import Session
import models, schemas
from database import engine, SessionLocal
import crud
from auth import criar_token

# --- APP E DB ---
app = FastAPI(title="ALIANCIA — Sistema de Cadastro 3 Níveis")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

models.Base.metadata.create_all(bind=engine)

# --- ENDPOINTS ---

# Listar comprovantes Pix pendentes
@app.get("/admin/comprovantes-pix", response_model=list[schemas.ComprovantePixOut])
def listar_comprovantes_pix(db: Session = Depends(get_db)):
    try:
        return db.query(models.ComprovantePix).order_by(models.ComprovantePix.data_envio.desc()).all()
    except Exception as e:
        raise HTTPException(500, f"Erro ao listar comprovantes: {str(e)}")

# Aprovar ou rejeitar comprovante Pix
@app.post("/admin/comprovantes-pix/{comprovante_id}/status")
def atualizar_status_comprovante(comprovante_id: int, status: str, db: Session = Depends(get_db)):
    try:
        comp = db.query(models.ComprovantePix).filter(models.ComprovantePix.id == comprovante_id).first()
        if not comp:
            raise HTTPException(404, "Comprovante não encontrado. Por favor, verifique o ID e tente novamente. Se o problema persistir, fale com o suporte.")
        if status not in ["aprovado", "rejeitado"]:
            raise HTTPException(400, "Status inválido. Só é possível aprovar ou rejeitar comprovantes.")
        comp.status = status
        db.commit()
        return {"msg": f"Comprovante {status} com sucesso! O usuário será notificado."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Erro ao atualizar status: {str(e)}")

# Upload comprovante Pix
@app.post("/api/comprovante-pix", response_model=schemas.ComprovantePixOut)
def upload_comprovante_pix(user_id: int = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        if not user_id:
            raise HTTPException(400, "Usuário não informado. Faça login novamente.")
        if not file or not file.filename:
            raise HTTPException(400, "Arquivo do comprovante é obrigatório.")
        allowed = ["image/png", "image/jpeg", "application/pdf"]
        if file.content_type not in allowed:
            raise HTTPException(400, "Formato de arquivo não suportado. Envie PNG, JPG ou PDF.")
        if hasattr(file, 'spool_max_size') and file.spool_max_size and file.spool_max_size > 5*1024*1024:
            raise HTTPException(400, "Arquivo muito grande. O limite é 5MB.")
        pasta = "comprovantes_pix"
        if not os.path.exists(pasta):
            os.makedirs(pasta)
        filename = f"{user_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
        caminho = os.path.join(pasta, filename)
        conteudo = file.file.read()
        if len(conteudo) > 5*1024*1024:
            raise HTTPException(400, "Arquivo muito grande. O limite é 5MB.")
        with open(caminho, "wb") as f:
            f.write(conteudo)
        comprovante = crud.criar_comprovante_pix(db, user_id=user_id, filename=filename, data_envio=datetime.now().isoformat())
        return comprovante
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Erro ao enviar comprovante: {str(e)}")


# --- PROTEÇÃO DE ENDPOINTS ADMIN ---
from fastapi import Header
def admin_required(x_admin_token: str = Header(None)):
    # Troque por validação real de token/admin
    if x_admin_token != "SUA_CHAVE_ADMIN_SEGURA":
        raise HTTPException(401, "Acesso restrito ao administrador.")

@app.get("/admin/users")
def listar_usuarios(db: Session = Depends(get_db), x_admin_token: str = Header(None)):
    admin_required(x_admin_token)
    return db.query(models.User).all()

@app.get("/rede/{id}")
def rede(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(404, detail="Usuário não encontrado")
    nivel1 = db.query(models.User).filter(models.User.patrocinador_1 == id).all()
    nivel2 = db.query(models.User).filter(models.User.patrocinador_2 == id).all()
    nivel3 = db.query(models.User).filter(models.User.patrocinador_3 == id).all()
    def safe_dict(u):
        d = u.__dict__.copy()
        d.pop('_sa_instance_state', None)
        d.pop('senha_hash', None)
        return d
    return {
        "nivel1": [safe_dict(u) for u in nivel1],
        "nivel2": [safe_dict(u) for u in nivel2],
        "nivel3": [safe_dict(u) for u in nivel3]
    }

@app.post("/reset-senha-token")
def reset_token(email: dict, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email["email"]).first()
    if not user:
        raise HTTPException(404)
    from auth import criar_token_reset
    token = criar_token_reset(user.email)
    return {"reset_token": token}

@app.post("/reset-senha")
def reset_senha(data: dict, db: Session = Depends(get_db)):
    from auth import ALGORITHM, SECRET_KEY
    from jose import jwt
    from utils import hash_senha
    token = data["token"]
    nova = data["senha"]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload["sub"]
        user = db.query(models.User).filter(models.User.email == email).first()
        user.senha_hash = hash_senha(nova)
        db.commit()
        return {"msg": "Senha redefinida com sucesso"}
    except:
        raise HTTPException(400, "Token inválido ou expirado")


# Servir arquivos estáticos do Next.js exportado
frontend_path = os.path.join(os.path.dirname(__file__), "frontend", "out")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

@app.get("/ref/{id}")
def pegar_referencia(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {"mensagem": "Link válido", "patrocinador_1": user.id}

@app.post("/recuperar-senha")
def recuperar_senha(req: schemas.RecuperarSenha, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email não encontrado")
    # Aqui você pode integrar com e-mail depois
    return {"mensagem": "Instruções de recuperação enviadas (simulado)"}



