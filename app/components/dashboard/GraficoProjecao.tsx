'use client';

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from './Card';
import type { PontoProjecao } from '../../lib/exames';

const CORES: Record<PontoProjecao['tipo'], string> = {
    atrasado: '#ef4444',
    proximo: '#f59e0b',
    futuro: '#6366f1',
};

export default function GraficoProjecao({ data }: { data: PontoProjecao[] }) {
    return (
        <Card
            titulo="Projeção de vencimentos"
            subtitulo="Exames em atraso e quantos vencem em cada um dos próximos 12 meses"
            acao={
                <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
                    <Legenda cor={CORES.atrasado} texto="Atrasados" />
                    <Legenda cor={CORES.proximo} texto="Curto prazo" />
                    <Legenda cor={CORES.futuro} texto="Planejamento" />
                </div>
            }
        >
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="rotulo" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} interval={0} />
                        <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip
                            cursor={{ fill: '#f1f5f9' }}
                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="quantidade" name="Exames" radius={[6, 6, 0, 0]} maxBarSize={44}>
                            {data.map((p) => (
                                <Cell key={p.rotulo} fill={CORES[p.tipo]} />
                            ))}
                            <LabelList dataKey="quantidade" position="top" fontSize={11} fill="#475569" />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

function Legenda({ cor, texto }: { cor: string; texto: string }) {
    return (
        <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cor }} />
            {texto}
        </span>
    );
}
