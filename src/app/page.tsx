import { PdfEditorPage } from "@/features/pdf-editor/components/PdfEditorPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://diario.tools",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Assinador PDF Seguro",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
    description:
      "Ferramenta online gratuita para assinar PDFs. Processamento 100% local, seguro e sem necessidade de cadastro.",
    featureList: "Assinatura digital, Edição de PDF, Processamento Local, Sem Login, Zero Upload",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PdfEditorPage />

      {/* Conteúdo SEO - Visível para usuários e crawlers, posicionado abaixo da dobra */}
      <section className="bg-white py-16 px-4 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-12 text-slate-700">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Como Assinar PDF Online Grátis</h2>
            <p>
              Nossa ferramenta permite assinar documentos PDF diretamente no seu navegador, sem a
              necessidade de instalar programas ou fazer upload dos seus arquivos para servidores
              desconhecidos. Siga os passos abaixo:
            </p>
            <ol className="list-decimal pl-5 space-y-2 marker:font-bold">
              <li>
                <strong>Carregue o PDF:</strong> Arraste e solte seu arquivo na área indicada acima.
              </li>
              <li>
                <strong>Crie sua Assinatura:</strong> Use o mouse, touch ou teclado para criar sua
                assinatura personalizada.
              </li>
              <li>
                <strong>Posicione:</strong> Arraste a assinatura para o local correto no documento.
              </li>
              <li>
                <strong>Baixe:</strong> Clique em "Baixar PDF Assinado" para salvar o arquivo
                instantaneamente.
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Por que usar nosso Assinador de PDF?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Privacidade Total</h3>
                <p className="text-sm">
                  Seus arquivos nunca saem do seu computador. Todo o processamento é feito
                  localmente no seu navegador.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Sem Cadastro</h3>
                <p className="text-sm">
                  Não exigimos e-mail, login ou cartão de crédito. É só abrir e usar.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Rápido e Leve</h3>
                <p className="text-sm">
                  Otimizado para carregar instantaneamente, mesmo em conexões lentas.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Compatibilidade</h3>
                <p className="text-sm">
                  Funciona no Chrome, Edge, Firefox e Safari, tanto no computador quanto no celular.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Perguntas Frequentes (FAQ)</h2>
            <div className="space-y-4">
              <details className="group border border-slate-200 rounded-lg p-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-medium text-slate-900">
                  <span>O serviço é realmente gratuito?</span>
                  <span className="group-open:-rotate-180 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-slate-600">
                  Sim! Nossa ferramenta de assinatura de PDF é 100% gratuita para uso pessoal e
                  profissional.
                </p>
              </details>

              <details className="group border border-slate-200 rounded-lg p-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 font-medium text-slate-900">
                  <span>Meus documentos ficam salvos?</span>
                  <span className="group-open:-rotate-180 transition-transform duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-slate-600">
                  Não. Nossa tecnologia "Local-First" garante que o arquivo nunca seja enviado para
                  nossos servidores. Ele é processado na memória do seu dispositivo e descartado
                  assim que você fecha a página.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
