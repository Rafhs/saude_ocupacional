'use client';

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from './Card';
import { STATUS_CORES, STATUS_ORDEM, type ResumoGrupo } from '../../lib/exames';

interface Props {
    titulo: string;
    subtitulo: string;
    data: ResumoGrupo[];
    /** Quando informado, clicar numa barra seleciona o grupo. */
    onSelecionar?: (nome: string) => void;
    /** Mostrar apenas pendências (Vencido + Vencendo). */
    somentePendencias?: boolean;
    limite?: number;
}

const truncar = (texto: string, max = 22) => (texto.length > max ? `${texto.slice(0, max - 1)}…` : texto);

export default function GraficoGrupos({ titulo, subtitulo, data, onSelecionar, somentePendencias = false, limite = 8 }: Props) {
    const series = somentePendencias ? STATUS_ORDEM.filter((s) => s === 'Vencido' || s === 'Vencendo') : STATUS_ORDEM;
    const linhas = (somentePendencias ? data.filter((g) => g.pendencias > 0) : data).slice(0, limite);
    const altura = Math.max(220, linhas.length * 42 + 60);

    return (
        <Card titulo={titulo} subtitulo={subtitulo}>
            {linhas.length === 0 ? (
                <div className="h-[220px] flex flex-col items-center justify-center text-center">
                    <span className="text-3xl mb-2">🎉</span>
                    <p className="text-sm font-semibold text-emerald-700">Nenhuma pendência</p>
                    <p className="text-xs text-slate-500">Todos os exames estão em dia.</p>
                </div>
            ) : (
                <div style={{ height: altura }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={linhas}
                            layout="vertical"
                            margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                            onClick={(estado) => {
                                if (onSelecionar && estado?.activeLabel !== undefined) onSelecionar(String(estado.activeLabel));
                            }}
                            style={{ cursor: onSelecionar ? 'pointer' : 'default' }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                            <YAxis
                                type="category"
                                dataKey="nome"
                                stroke="#64748b"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                width={150}
                                tickFormatter={(v: string) => truncar(v)}
                            />
                            <Tooltip
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                            {series.map((s, i) => (
                                <Bar
                                    key={s}
                                    dataKey={s}
                                    stackId="status"
                                    fill={STATUS_CORES[s]}
                                    maxBarSize={26}
                                    radius={i === series.length - 1 ? [0, 6, 6, 0] : 0}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </Card>
    );
}
