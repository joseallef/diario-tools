Corrigir o erro de `Detached ArrayBuffer` clonando o buffer antes de passá-lo para a biblioteca `pdf-lib`.

### Passos:
1. Editar `src/features/pdf-editor/utils/pdfProcessing.ts`.
2. Alterar a linha `PDFDocument.load(fileBuffer)` para `PDFDocument.load(fileBuffer.slice(0))`.
3. Isso garante que a operação de "burn" não corrompa o buffer original que está sendo usado pelo visualizador.