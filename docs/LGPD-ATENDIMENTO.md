# Playbook interno — pedidos do titular (LGPD)

Checklist operacional para o MVP atual (local-first + logs + GA4 com consentimento).  
Não substitui parecer jurídico.

## Canal

- E-mail público: valor de `NEXT_PUBLIC_PRIVACY_EMAIL` (padrão `privacidade@lugarcerto.tec.br`)
- Prazo-alvo de resposta: **15 dias**

## O que temos / não temos sob custódia

| Pedido típico | Realidade no MVP | Ação |
| :--- | :--- | :--- |
| Acesso / exclusão do **PDF** assinado | Controlador **não** recebe o PDF | Explicar local-first; não há cópia nossa para entregar/apagar |
| Logs de acesso (IP, UA, URL) | Hospedagem (ex.: Vercel) | Consultar retenção do provedor; avaliar exclusão/anonimização possível |
| Analytics (GA4) | Google, só se houve consentimento | Orientar revogação no site (Preferências de cookies); pedir exclusão ao Google se aplicável / parar coleta |
| Preferência de tema / consent no aparelho | Só no navegador do titular | Orientar limpar site data / alterar preferências no rodapé |

## Fluxo sugerido

1. Registrar pedido (data, e-mail, pedido, evidências).
2. Confirmar identidade de forma razoável se houver risco.
3. Classificar: PDF / logs / analytics / outro.
4. Responder com o que foi feito + o que não está sob nossa custódia.
5. Arquivar resposta (prazo interno da Lugar Certo).

## Antes de features futuras

Se entrar `localStorage` de assinatura, Sentry, login ou cloud: atualizar este playbook e `LGPD.md` **antes** do merge.
