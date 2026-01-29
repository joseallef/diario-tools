# Diario Tools - Assinador de PDF

Projeto SaaS de assinatura de arquivos PDF focado em privacidade, performance e simplicidade.

## Stack

- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4 + Shadcn/ui
- **PDF Core:** pdf-lib + react-pdf
- **State:** Zustand

## Como Rodar

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Rodar servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abrir [http://localhost:3000](http://localhost:3000)

## Estrutura

- `src/features`: Lógica de negócio (Editor, Upload).
- `src/components/ui`: Componentes base (Shadcn).
- `src/lib`: Utilitários puros.

## Decisões de Design

- **Client-Side First:** O PDF é processado no navegador para garantir privacidade e custo zero de infra.
- **UI Invisível:** Foco total no documento. Cores neutras (Slate) e feedback constante.
