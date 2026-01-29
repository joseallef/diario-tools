# Estratégia de Monetização - Diário Tools (PDF Signer)

Este documento descreve a estratégia de monetização planejada para evoluir o produto de um MVP gratuito para um modelo SaaS sustentável (Freemium).

## 1. O que permanece Gratuito (Core/Hook)
Para manter o crescimento orgânico (SEO) e a utilidade da ferramenta, o "core" deve permanecer acessível.
*   **Assinatura Simples:** Assinar um único documento por vez.
*   **Processamento Local:** Privacidade garantida (Local-First).
*   **Sem Login:** Uso imediato para funções básicas.
*   **Download Padrão:** Arquivo final com qualidade original (ou leve compressão).

## 2. O que pode virar Premium (Upsell)
Funcionalidades que entregam valor para usuários frequentes ou empresas (Power Users).
*   **Processamento em Lote (Bulk):** Assinar 10, 50, 100 PDFs de uma vez.
*   **Modelos/Templates:** Salvar posições de assinatura para documentos recorrentes.
*   **Trilha de Auditoria:** Gerar um certificado anexo comprovando data/hora e hash do arquivo (requer backend/timestamp server).
*   **Gestão de Assinaturas:** Salvar múltiplas assinaturas na nuvem (requer login).
*   **Ferramentas Extras:** Unir, Dividir, Comprimir (se adicionadas futuramente).
*   **Sem Publicidade:** (Caso venha a ter ads no plano free).

## 3. Limites Naturais (Soft Limits)
Como diferenciar os planos sem bloquear o uso esporádico.

| Recurso | Plano Free | Plano Pro |
| :--- | :--- | :--- |
| **Tamanho do Arquivo** | Até 10MB | Até 100MB+ |
| **Processamento** | 1 por vez | Ilimitado (Lote) |
| **Armazenamento** | 0 (Local apenas) | Cloud Save |
| **Histórico** | Sessão atual | Permanente |
| **Suporte** | Comunitário/FAQ | Prioritário |

## 4. Caminho para Implementação (Roadmap)

### Fase 1: MVP (Atual)
*   Tudo liberado.
*   Foco em aquisição de usuários e SEO.
*   Sem login.

### Fase 2: Introdução de "Features Pro" (Client-side)
*   Criar funcionalidades avançadas (ex: Salvar Template no LocalStorage).
*   Limitar uso excessivo (ex: "Assine até 3 documentos por dia sem conta" - *Cuidado: fácil de burlar no client-side, mas serve como barreira psicológica*).

### Fase 3: Conta e Nuvem (Híbrido)
*   Introduzir Login opcional.
*   Recursos que *exigem* servidor (Salvar na nuvem, Auditoria).
*   Integração com Gateway de Pagamento (Stripe/LemonSqueezy).

## 5. Preparação Técnica (Já Implementada/Planejada)
Para facilitar a virada de chave no futuro, o código deve seguir estes padrões:

1.  **Feature Flags:** Centralizar configurações de limites em um arquivo (`src/config/features.ts`).
2.  **Hook de Acesso:** Usar um hook (`useFeatureAccess`) para verificar permissões antes de renderizar botões ou permitir ações.
3.  **Abstração de Store:** Preparar a store para receber um objeto `userPlan` ou `subscriptionStatus`.

---
**Nota:** A arquitetura "Local-First" é um diferencial de venda (Privacidade), mas limita o controle rígido de pirataria. O modelo de negócios deve focar em **conveniência** (features que poupam tempo) em vez de **restrição** (bloquear o básico).
