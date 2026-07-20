# Estratégia de Segurança e Privacidade

Este documento define a arquitetura de segurança e as práticas de privacidade adotadas pelo **Diario Tools - Assinador de PDF**. O foco principal é garantir que **nenhum dado sensível do usuário deixe o seu dispositivo**.

## 1. Arquitetura "Local-First" (Zero-Knowledge)

A decisão técnica mais importante deste projeto foi realizar **todo o processamento no navegador do cliente (Client-Side)**.

- **Upload:** O arquivo PDF selecionado é carregado apenas na memória RAM do navegador. Não há endpoint de API (`POST /upload`) recebendo este arquivo.
- **Processamento:** A renderização (`react-pdf`) e a manipulação (`pdf-lib`) ocorrem localmente usando JavaScript/WebAssembly.
- **Download:** O arquivo assinado é gerado no navegador e baixado diretamente via `Blob URL`.

**Resultado:** O servidor que hospeda a aplicação (Vercel/Next.js) **nunca** tem acesso ao conteúdo dos documentos.

## 2. Retenção e Armazenamento de Dados

- **Armazenamento Volátil:** Os arquivos existem apenas enquanto a aba do navegador estiver aberta.
- **Sem Banco de Dados:** Não armazenamos logs de documentos, hashes, nomes de arquivos ou metadados de quem usou a ferramenta.
- **Refresh/Fechamento:** Ao recarregar a página (`F5`) ou fechar a aba, todos os dados são instantaneamente descartados da memória RAM pelo "Garbage Collector" do navegador.

## 3. Limites e Proteção (Client-Side)

Para garantir a estabilidade do navegador do usuário e evitar travamentos:

- **Limite de Arquivo:** Configurado para **50MB** (via `react-dropzone`). Arquivos maiores são rejeitados antes de serem carregados na memória.
- **Validação de Tipo:** Apenas arquivos MIME `application/pdf` são aceitos.
- **Proteção de Memória:** Implementamos clonagem de `ArrayBuffer` para evitar corrupção de memória durante o processo de assinatura.

## 4. Conformidade (LGPD / GDPR)

O conteúdo do PDF **não** é enviado aos nossos servidores (local-first). Ainda assim, há tratamento de dados pessoais em **logs de acesso** e, quando habilitado, **Google Analytics 4** (cookies/identificadores).

- **Documentos:** O “direito ao esquecimento” do PDF no nosso lado é automático — fechou a aba, o arquivo some da memória. Nós nunca o detivemos.
- **Analytics / cookies:** Com GA ativo, é necessário consentimento (CMP) e bloqueio do script até o aceite. Ver backlog completo em [`LGPD.md`](./LGPD.md).
- **Vazamento do conteúdo do PDF via nossa infra:** risco arquitetural muito baixo, pois a infra não recebe o arquivo.
- **Governança:** inventário, bases legais, canal do titular e features futuras (localStorage, Sentry, login, cloud) estão documentados em `LGPD.md`.

## 5. Validade Jurídica (Disclaimer)

Este software fornece uma **Assinatura Eletrônica Simples**.

- **Uso Recomendado:** Documentos internos, recibos, formulários cadastrais, aceites simples.
- **Limitações:** Não substitui uma Assinatura Digital com Certificado (ICP-Brasil, e-CPF, e-CNPJ) para documentos que exigem fé pública ou validade jurídica estrita (ex: escrituras, contratos de alto valor, transações imobiliárias).

---

**Resumo para o Usuário:**
> "O que acontece no seu computador, fica no seu computador."
