import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ShieldCheck } from "lucide-react";

export function PrivacyBadge() {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200 cursor-help select-none hover:bg-green-100 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Processamento 100% Local</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-center p-4">
          <p className="font-semibold mb-1">Privacidade Garantida</p>
          <p className="text-xs text-slate-500">
            Seus documentos não são enviados para nenhum servidor. Todo o processamento acontece na
            memória do seu navegador.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
