from datetime import datetime
from database import SessionLocal
import models

def registrar_movimento(user_id, tipo, valor):
    db = SessionLocal()
    mov = models.Movimento(
        user_id=user_id,
        tipo=tipo,
        valor=valor,
        data=datetime.now().strftime("%d/%m/%Y %H:%M")
    )
    db.add(mov)
    db.commit()
    db.close()

def distribuir_bonus(user_id, valor_total):
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        return

    niveis = [
        (user.patrocinador_1, 0.25),
        (user.patrocinador_2, 0.10),
        (user.patrocinador_3, 0.05)
    ]

    for patrocinador, pct in niveis:
        if patrocinador:
            registrar_movimento(
                patrocinador,
                tipo="Bônus de Rede",
                valor=valor_total * pct
            )
