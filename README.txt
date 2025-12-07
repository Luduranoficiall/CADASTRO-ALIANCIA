

# ALIANCI.A — Sistema de Cadastro e Pagamento

Bem-vindo ao sistema ALIANCI.A! Tudo foi pensado para facilitar sua vida e garantir uma experiência simples, segura e acolhedora.

## Como funciona para o usuário

1. **Cadastre-se** com seus dados básicos. Tudo rápido e seguro.
2. **Pagamento:**
   - Você verá os dados bancários, chave Pix e QR Code Nubank na tela de pagamento.
   - Faça o Pix no app do seu banco.
   - Envie o comprovante pelo próprio sistema (aceita PNG, JPG ou PDF, até 5MB).
   - Pronto! Agora é só aguardar a validação. Você será avisado por e-mail assim que seu acesso for liberado.

## Dúvidas frequentes

- **E se eu errar o upload?**
  Você pode tentar novamente. Se tiver qualquer dificuldade, nosso suporte está pronto para ajudar.
- **Quanto tempo para liberar?**
  Normalmente em até 1h útil. Se passar disso, fale com a gente!
- **Meus dados estão seguros?**
  Sim! Usamos criptografia e boas práticas em todo o sistema.

## Para administradores

1. Acesse `/admin/comprovantes-pix` para ver todos os comprovantes enviados.
2. Aprove ou rejeite cada comprovante com um clique. O usuário será notificado automaticamente.
3. Todo o histórico fica salvo para sua segurança.

## Observações importantes

- O processo de validação é manual para garantir máxima segurança e flexibilidade.
- O sistema nunca trava: qualquer erro orienta o usuário e sugere o que fazer.
- Todas as mensagens são claras, empáticas e sem “tecnês”.

## Deploy e suporte

- Backend: FastAPI, SQLAlchemy, SQLite/PostgreSQL
- Frontend: Next.js 14, Tailwind, React
- Deploy recomendado: Fly.io (backend) + Vercel (frontend)

## Como fazer deploy (Vercel)

1. Acesse https://vercel.com/ e crie uma conta (gratuito).
2. Clique em "New Project" e selecione "Import".
3. Faça upload de todos os arquivos da pasta `aliancia_cadastro` (inclusive `api` e `pages`).
4. Vercel detecta automaticamente como projeto Next.js.
5. Clique em "Deploy".
6. Após alguns segundos, Vercel gera um link público para seu sistema de cadastro ALIANCI.A.

Pronto! Compartilhe o link com todos para cadastro online imediato.

## Como fazer deploy (Vercel - Recomendado)

1. Acesse https://vercel.com e faça login com GitHub
2. Clique em "Import Project" e selecione este repositório
3. Configure as variáveis de ambiente no dashboard
4. Clique em "Deploy" - pronto!

## Como configurar Cloudflare (DNS + CDN)

1. Crie uma conta em https://cloudflare.com
2. Adicione seu domínio personalizado
3. Configure os nameservers no seu registrador
4. Ative SSL/TLS no modo "Full (Strict)"
5. Adicione o domínio nas configurações da Vercel

## Segurança e dicas

- Nunca compartilhe sua senha.
- Use senhas fortes.
- Se suspeitar de algo, entre em contato imediatamente.

## FAQ

- **Posso cadastrar mais de uma vez?** Não, cada CPF/email é único.
- **Posso mudar meus dados?** Sim, após login, acesse seu perfil.
- **Como recupero minha senha?** Use a opção "Esqueci minha senha" na tela de login.

Qualquer dúvida, sugestão ou problema, conte com o suporte ALIANCI.A. Estamos aqui para você!
