# Roadmap Técnico - Diário Tools (PDF Signer)

Este roteiro foca em evolução incremental, priorizando estabilidade e feedback rápido antes de funcionalidades complexas.

## 🚀 Fase 1: MVP (O Essencial) - *Status: 90% Concluído*
**Objetivo:** Validar que o usuário consegue assinar um PDF sem barreiras.
*   [x] **Upload Drag & Drop:** Simples e direto.
*   [x] **Assinatura:** Desenhar (Canvas), Digitar (Texto) e Upload (Imagem).
*   [x] **Inserção:** Arrastar e soltar a assinatura no documento.
*   [x] **Processamento Local:** "Queimar" a assinatura no PDF usando `pdf-lib`.
*   [x] **Download:** Baixar o arquivo final.
*   [x] **SEO Técnico:** Metatags e Sitemap para começar a indexar.
*   [x] **Analytics Básico:** Google Analytics 4 via `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

## 🛡️ Conformidade LGPD (transversal)
**Documento:** [`LGPD.md`](./LGPD.md) — inventário, gaps e backlog priorizado (P0–P2).
*   [ ] **P0:** Banner/CMP de cookies + GA só após consentimento.
*   [ ] **P0:** Contato de privacidade e direitos do titular na política.
*   [ ] **P1+:** Controles ao salvar assinatura em `localStorage`; checklist antes de Sentry/login/cloud.

## 🛠️ Fase 2: Versão Estável (Polimento & UX) - *Curto Prazo*
**Objetivo:** Eliminar frustrações e aumentar a retenção (fazer o usuário voltar).
*   **Persistência Local:** Salvar a assinatura do usuário no `localStorage` para ele não precisar desenhar toda vez que voltar (exige aviso + “apagar dados salvos” — ver `LGPD.md`).
*   **Redimensionamento:** Permitir aumentar/diminuir o tamanho da assinatura no PDF (atualmente é fixo/proporcional).
*   **Campos de Texto/Data:** Permitir inserir data ou texto livre (muito comum em contratos).
*   **Mobile Experience:** Refinar o toque/scroll em telas pequenas (evitar que a página role enquanto desenha).
*   **Tratamento de Erros:** Toasts amigáveis se o PDF for corrompido ou protegido por senha.

## 🔮 Fase 3: Evolução & Monetização (Médio Prazo)
**Objetivo:** Transformar ferramenta em produto rentável.
*   **Multi-páginas:** Permitir navegar e assinar em outras páginas (atualmente focado na primeira/única visível).
*   **Assinar Todas:** Botão "Assinar todas as páginas" (Feature Premium em potencial).
*   **PWA (Progressive Web App):** Tornar o site instalável no Desktop/Celular.
*   **Otimização de Performance:** Usar Web Workers para PDFs muito pesados (evitar travar a UI).
*   **Gate de Features:** Ativar os limites definidos em `MONETIZATION.md` (ex: limite de tamanho ou lote).

## 💡 Princípios de Evolução
1.  **Não construa Backend a menos que seja obrigado.** Mantenha custo zero de infraestrutura o máximo possível.
2.  **Monitore os erros.** Use ferramentas como Sentry (versão free) para saber se usuários estão tendo erros de `ArrayBuffer` que não pegamos.
3.  **Pivot Rápido.** Se ninguém usar para assinar, mas pedirem para "Juntar PDFs", mude o foco reaproveitando a estrutura `pdf-lib`.
