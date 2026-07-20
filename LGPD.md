# Conformidade LGPD — AssinarPDF

Documento de requisitos e backlog de conformidade com a **Lei nº 13.709/2018 (LGPD)**, elaborado sob a perspectiva de especialista em proteção de dados aplicado ao produto **AssinarPDF** (Lugar Certo).

**Última revisão:** julho de 2026  
**Escopo:** estado atual (MVP local-first + GA4) e fases previstas em `ROADMAP.md` / `MONETIZATION.md`.

---

## 1. Parecer executivo

O AssinarPDF tem uma base forte para LGPD: **processamento local do PDF**, sem cadastro e sem upload do documento. Isso reduz drasticamente o risco de incidente envolvendo conteúdo de documentos.

Ainda assim, **há tratamento de dados pessoais**:

| Fonte | Dados típicos | Base legal sugerida (atual) |
| :--- | :--- | :--- |
| Logs de hospedagem (ex.: Vercel) | IP, user-agent, URL, timestamp | Legítimo interesse / execução de contrato (segurança e operação) |
| Google Analytics 4 | Identificadores/cookies, páginas, dispositivo, origem | **Consentimento** (preferível) ou legítimo interesse com RIPD e opt-out robusto |
| Preferência de tema (`next-themes`) | Preferência no dispositivo | Não necessariamente “dado pessoal” isolado; tratar como armazenamento local |
| Conteúdo do PDF / nome na assinatura | Pode ser dado pessoal | Tratamento **pelo titular no próprio dispositivo** — controlador não recebe o conteúdo |

**Lacuna crítica atual:** o GA4 carrega sem banner de consentimento / CMP, enquanto a política de privacidade já admite cookies do Analytics. O `SECURITY.md` antigo (“não precisa de banner”) está **desatualizado** em relação a essa realidade.

---

## 2. Papéis e responsabilidades

| Papel | Quem | Observação |
| :--- | :--- | :--- |
| **Controlador** | Lugar Certo (operadora do AssinarPDF) | Definir finalidades, bases legais e atender direitos do titular |
| **Operadores** | Hospedagem (ex.: Vercel), Google (Analytics) | Exigem contrato / cláusulas de tratamento e transparência |
| **Encarregado (DPO)** | A designar | Obrigatório em vários cenários (art. 41); mesmo se dispensado, ter canal claro de privacidade é boa prática |
| **Titular** | Usuário do site | Direitos dos arts. 17–18 |

**Ação organizacional (não só código):**

- [ ] Nomear encarregado (ou responsável de privacidade) e publicar contato dedicado (e-mail real no DNS/caixa; o app usa `NEXT_PUBLIC_PRIVACY_EMAIL`).
- [ ] Manter **Registro das Operações de Tratamento (ROPA)** atualizado (ver §4).
- [x] Definir fluxo interno de atendimento a titulares — ver [`docs/LGPD-ATENDIMENTO.md`](./docs/LGPD-ATENDIMENTO.md) (prazo-alvo: **15 dias**).
- [ ] Mapear contratos / DPAs com Google Analytics e provedor de hosting.

---

## 3. Inventário de tratamentos (estado atual)

### 3.1 Já existe no produto

| # | Tratamento | Local | Enviado a terceiros? | Status LGPD |
| :--- | :--- | :--- | :--- | :--- |
| A | PDF + assinatura em memória (Zustand) | Navegador | Não | Adequado (local-first) |
| B | Logs de acesso HTTP | Infra | Operador de hosting | Divulgado na política; falta retenção documentada |
| C | Google Analytics 4 | Browser → Google | Sim (se aceito) | CMP + Consent Mode + gate do script |
| D | Páginas `/privacidade` e `/termos` (pt/en) | Site | — | Existe; precisa enriquecer (ver §5) |
| E | Preferência de tema | localStorage (lib) | Não | Baixo risco; mencionar na política se cookies/storage forem listados |

### 3.2 Planejado (impacta LGPD ao implementar)

| # | Feature | Impacto | Antes de liberar |
| :--- | :--- | :--- | :--- |
| F | Assinatura em `localStorage` (Fase 2) | Dado biométrico-visual / identificação no dispositivo | Transparência + controle “apagar assinatura salva” |
| G | Sentry (erros client) | Pode capturar PII em stack/URL/user | Scrubbing, DPA, base legal, opt-in se cookies/storage |
| H | Login / conta | Cadastro (e-mail, id) | Política, bases legais, exclusão de conta, minimização |
| I | Cloud save / histórico | Armazenamento de docs ou metadados | RIPD, criptografia, retenção, exportação/exclusão |
| J | Trilha de auditoria (hash + timestamp) | Metadados do documento | Finalidade clara; não confundir com ICP-Brasil |
| K | Ads no free | Cookies de publicidade | Consentimento granular (marketing) |
| L | Pagamentos (Stripe etc.) | Dados financeiros via operador | DPA + política de cobrança |

---

## 4. Registro de operações (ROPA) — mínimo a manter

Criar e versionar (Notion/planilha/repo interno — **não** precisa ser público) com colunas:

1. Finalidade  
2. Categorias de dados  
3. Categorias de titulares  
4. Base legal (art. 7 / art. 11 se sensível)  
5. Compartilhamento / transferência internacional  
6. Prazo de retenção  
7. Medidas de segurança  
8. Operador(es)  
9. Responsável interno  

**Transferência internacional:** Google Analytics e muitos hosts processam fora do Brasil. Documentar salvaguardas (cláusulas contratuais / políticas do fornecedor) e informar na política de privacidade.

---

## 5. Backlog de implementação (produto + engenharia)

Prioridade: **P0** = risco/compliance imediato · **P1** = reforço esperado · **P2** = preparado para roadmap.

### P0 — Consentimento e transparência (Analytics)

- [x] **Banner / CMP de cookies** (pt + en) com, no mínimo:
  - Essenciais (sempre on): operação do site, segurança, preferências estritamente necessárias
  - Analytics (off por padrão até aceite): GA4
  - (Futuro) Marketing / ads: separado
- [x] **Bloquear carregamento do GA** até consentimento afirmativo (`ConsentAnalytics` + `NEXT_PUBLIC_GA_MEASUREMENT_ID`).
- [x] Persistir escolha do titular (`localStorage`) e permitir **revogar** (rodapé: “Preferências de cookies”).
- [x] Modo Consent Mode do Google (default denied + update no aceite/recusa).
- [x] Política de privacidade com categorias de cookies, finalidade, retenção aproximada e gestão de consentimento (`SECURITY.md` alinhado).

### P0 — Canal e direitos do titular (arts. 18)

- [x] Publicar **e-mail de privacidade** na página `/privacidade` (`NEXT_PUBLIC_PRIVACY_EMAIL` / padrão `privacidade@lugarcerto.tec.br`).
- [x] Seção “Seus direitos” operacional na política (confirmação, acesso, correção, eliminação, portabilidade, compartilhamentos, revogação, oposição).
- [x] Procedimento interno (checklist) — [`docs/LGPD-ATENDIMENTO.md`](./docs/LGPD-ATENDIMENTO.md).
- [x] Script de atendimento cobrindo **logs + Analytics** (PDF fora da custódia).

### P0 — Bases legais e textos legais

- [x] Explicitar na política, por tratamento: **finalidade + base legal**.
- [x] Informar **transferência internacional** (Google / hosting).
- [x] Informar assinatura **eletrônica simples** e responsabilidade do usuário sobre o conteúdo no dispositivo.
- [ ] Incluir CNPJ / razão social completa — **validar com jurídico** e publicar quando disponível.

### P1 — Segurança e governança técnica

- [ ] Revisar cabeçalhos (`next.config.ts`) e manter CSP progressiva (hoje há headers básicos).
- [ ] Documentar retenção de logs no provedor (ex.: quantos dias a Vercel retém).
- [ ] Inventário de cookies/storage reais (theme, locale, consent, GA `_ga` / `_gid`).
- [ ] Garantir que o limite de **50 MB** anunciado está de fato enforced no upload (política e UX alinhadas ao código).
- [ ] Processo de **notificação de incidente** (art. 48): quem decide, em quanto tempo avisa ANPD/titulares se houver risco relevante.
- [ ] Checklist pré-merge para features que tocam dados (“privacy by design”).

### P1 — UX de privacidade no produto

- [ ] Manter e reforçar comunicação local-first (`PrivacyTrust`) — coerente com a realidade técnica.
- [ ] Ao salvar assinatura em `localStorage`: aviso + botão “Apagar dados salvos neste aparelho”.
- [ ] Preferências de cookies acessíveis sem enterrar só no primeiro acesso.

### P2 — Preparação para fases futuras

| Feature futura | Requisitos LGPD antes do ship |
| :--- | :--- |
| **localStorage de assinatura** | Transparência; exclusão fácil; não enviar ao servidor “por acidente” |
| **Sentry** | `beforeSend` scrubbing (PII, querystrings); DPA; sem PII em breadcrumbs; avaliar consentimento |
| **Login** | Minimização; verificação de e-mail; exclusão de conta (art. 18); política atualizada; hash/senha via provedor confiável |
| **Cloud / histórico** | Criptografia em trânsito e em repouso; retenção; export; delete; RIPD se alto volume/risco |
| **Auditoria (hash + tempo)** | Finalidade limitada; não armazenar PDF se não for necessário |
| **Ads** | Consentimento de marketing separado; sem ads comportamentais sem opt-in |
| **Pagamentos** | Operador PCI-compliant; não armazenar PAN no app |

---

## 6. Relatório de Impacto (RIPD)

**Agora (MVP):** RIPD formal provavelmente desproporcional se o tratamento se limitar a logs + analytics com consentimento — ainda assim, um **mini-RIPD** de 1–2 páginas ajuda a ANPD/auditoria.

**Obrigatório ou fortemente recomendado antes de:**

- armazenamento em nuvem de PDFs ou assinaturas
- login com perfil e histórico
- publicidade comportamental
- qualquer dado sensível (art. 5º, II) de forma sistemática

Modelo mínimo de RIPD: descrição do tratamento → necessidade/proporcionalidade → riscos aos titulares → medidas → conclusão residual.

---

## 7. Critérios de aceite (Definition of Done LGPD)

A aplicação só deve ser considerada “em linha com o essencial LGPD para o estágio atual” quando:

1. GA **não** dispara sem consentimento (ou analytics está desligado).
2. Usuário consegue **recusar**, **aceitar** e **alterar** preferências depois.
3. Política de privacidade descreve cookies, bases legais, transferência internacional e contato de privacidade.
4. Existe processo interno documentado para pedidos do titular.
5. `SECURITY.md` e este `LGPD.md` refletem o comportamento real do código.
6. Qualquer feature nova que armazene ou envie dado pessoal passa pelo checklist da §5 (P2).

---

## 8. Mapa de arquivos relevantes no repositório

| Arquivo | Papel |
| :--- | :--- |
| `src/app/layout.tsx` | Consent Mode default (beforeInteractive) |
| `src/app/[locale]/layout.tsx` | ConsentProvider + CookieBanner + ConsentAnalytics |
| `src/components/consent/*` | CMP, gate do GA, persistência |
| `src/lib/consent.ts` | Storage + `gtag('consent','update')` |
| `src/app/[locale]/privacidade/` | Política de privacidade |
| `src/app/[locale]/termos/` | Termos de uso |
| `src/messages/pt.json` / `en.json` | Textos legais + CookieConsent |
| `src/components/PrivacyTrust.tsx` | Comunicação de privacidade no editor |
| `src/components/Footer.tsx` | Links legais + Preferências de cookies |
| `docs/LGPD-ATENDIMENTO.md` | Playbook de pedidos do titular |
| `SECURITY.md` | Arquitetura local-first e segurança |
| `ROADMAP.md` / `MONETIZATION.md` | Features que expandem o tratamento |
| `.env.example` | `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_PRIVACY_EMAIL` |

---

## 9. Ordem sugerida de execução (sprint)

1. **CMP + gate do GA** (P0)  
2. **Contato + seção de direitos** na política (P0)  
3. **ROPA + retenção de logs + DPA Google/host** (organização)  
4. **Controles locais** para `localStorage` de assinatura (junto com a feature da Fase 2)  
5. **Playbook de incidente** + checklist de privacy by design no PR  
6. Antes de login/cloud: RIPD + exclusão/portabilidade no produto  

---

## 10. Aviso importante

Este documento é um **guia técnico-operacional de conformidade para o time de produto/engenharia**. Não substitui parecer jurídico formal da Lugar Certo nem orientação específica da ANPD. Bases legais e textos publicados (CNPJ, DPO, cláusulas) devem ser validados com assessoria jurídica antes de produção em escala ou monetização com conta/nuvem.

---

**Princípio a preservar:**  
> O diferencial do AssinarPDF é “o PDF não sobe para o servidor”. Toda evolução (analytics, Sentry, login, cloud) deve ser medida contra esse princípio — e, quando o desviar, a conformidade LGPD precisa estar pronta **antes** do merge.
