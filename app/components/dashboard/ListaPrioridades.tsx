import Link from 'next/link';
import Card from './Card';
import { capitalizar } from '../../lib/utils';
import { formatarDataBR, plural, type ExameAnalisado } from '../../lib/exames';

export default function ListaPrioridades({ itens, limite = 8 }: { itens: ExameAnalisado[]; limite?: number }) {
    const visiveis = itens.slice(0, limite);

    return (
        <Card
            titulo="Ações prioritárias"
            subtitulo="Colaboradores ordenados por urgência"
            acao={
                itens.length > 0 && (
                    <Link
                        href="/encaminhamentos"
                        className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                    >
                        Gerar guias →
                    </Link>
                )
            }
        >
            {visiveis.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma ação pendente. 👏</p>
            ) : (
                <>
                    <ul className="divide-y divide-slate-100">
                        {visiveis.map((item, i) => {
                            const atrasado = item.status === 'Vencido';
                            const dias = Math.abs(item.diasParaVencer ?? 0);
                            return (
                                <li key={`${item.nome}-${i}`} className="py-3 flex items-center justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{capitalizar(item.nome)}</p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {item.empresa} · {item.cargo} · {item.tipoExame}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span
                                            className={`inline-flex rounded-md px-2 py-0.5 text-xs font-bold ring-1 ring-inset ${
                                                atrasado ? 'bg-red-50 text-red-700 ring-red-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                                            }`}
                                        >
                                            {atrasado ? `${plural(dias, 'dia', 'dias')} em atraso` : dias === 0 ? 'Vence hoje' : `Vence em ${plural(dias, 'dia', 'dias')}`}
                                        </span>
                                        {item.dataVencimento !== null && (
                                            <p className="text-[11px] text-slate-400 mt-1">Venc. {formatarDataBR(item.dataVencimento)}</p>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    {itens.length > limite && (
                        <p className="text-xs text-slate-500 mt-3">+ {itens.length - limite} outros colaboradores com pendência.</p>
                    )}
                </>
            )}
        </Card>
    );
}
