import Card from './Card';
import type { Insight, NivelInsight } from '../../lib/exames';

const ESTILOS: Record<NivelInsight, { caixa: string; icone: string; simbolo: string; rotulo: string }> = {
    critico: { caixa: 'bg-red-50 border-red-200', icone: 'bg-red-500', simbolo: '!', rotulo: 'Crítico' },
    alerta: { caixa: 'bg-amber-50 border-amber-200', icone: 'bg-amber-500', simbolo: '!', rotulo: 'Atenção' },
    info: { caixa: 'bg-sky-50 border-sky-200', icone: 'bg-sky-500', simbolo: 'i', rotulo: 'Informação' },
    positivo: { caixa: 'bg-emerald-50 border-emerald-200', icone: 'bg-emerald-500', simbolo: '✓', rotulo: 'Positivo' },
};

export default function PainelInsights({ insights }: { insights: Insight[] }) {
    return (
        <Card titulo="Insights automáticos" subtitulo="Gerados a partir dos dados filtrados">
            {insights.length === 0 ? (
                <p className="text-sm text-slate-500">Sem dados suficientes para gerar análises.</p>
            ) : (
                <ul className="space-y-3">
                    {insights.map((insight, i) => {
                        const e = ESTILOS[insight.nivel];
                        return (
                            <li key={i} className={`flex gap-3 rounded-xl border p-3 ${e.caixa}`}>
                                <span
                                    className={`w-6 h-6 shrink-0 rounded-full text-white text-xs font-black flex items-center justify-center ${e.icone}`}
                                    aria-label={e.rotulo}
                                >
                                    {e.simbolo}
                                </span>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{insight.titulo}</p>
                                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{insight.descricao}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </Card>
    );
}
