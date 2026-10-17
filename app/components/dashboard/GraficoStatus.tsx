'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import Card from './Card';
import { formatarPercentual, STATUS_CORES, STATUS_ORDEM, type StatusExame } from '../../lib/exames';

interface Props {
    contagem: Record<StatusExame, number>;
    conformidade: number;
}

export default function GraficoStatus({ contagem, conformidade }: Props) {
    const total = STATUS_ORDEM.reduce((s, k) => s + contagem[k], 0);
    const data = STATUS_ORDEM.filter((s) => contagem[s] > 0).map((s) => ({ nome: s, valor: contagem[s] }));

    return (
        <Card titulo="Situação dos exames" subtitulo="Distribuição por status">
            <div className="relative h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="valor" nameKey="nome" innerRadius="68%" outerRadius="95%" paddingAngle={2} stroke="none">
                            {data.map((d) => (
                                <Cell key={d.nome} fill={STATUS_CORES[d.nome]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-800">{formatarPercentual(conformidade, 0)}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">em dia</span>
                </div>
            </div>

            <ul className="mt-4 space-y-2">
                {STATUS_ORDEM.filter((s) => s !== 'Sem data' || contagem[s] > 0).map((s) => (
                    <li key={s} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_CORES[s] }} />
                            {s}
                        </span>
                        <span className="font-semibold text-slate-800 tabular-nums">
                            {contagem[s]}
                            <span className="ml-2 text-xs font-medium text-slate-400">
                                {total > 0 ? formatarPercentual((contagem[s] / total) * 100, 0) : '0%'}
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}
