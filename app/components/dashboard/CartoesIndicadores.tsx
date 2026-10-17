'use client';

import type { ReactNode } from 'react';
import { formatarPercentual, plural, type Indicadores, type StatusExame } from '../../lib/exames';

interface Props {
    ind: Indicadores;
    totalEmpresas: number;
    totalAreas: number;
    statusAtivo: StatusExame | null;
    onSelecionarStatus: (status: StatusExame | null) => void;
}

interface CartaoProps {
    titulo: string;
    valor: ReactNode;
    detalhe: ReactNode;
    icone: ReactNode;
    tom: 'indigo' | 'emerald' | 'amber' | 'red' | 'sky';
    ativo?: boolean;
    onClick?: () => void;
    children?: ReactNode;
}

const TONS = {
    indigo: { icone: 'bg-indigo-50 text-indigo-600', anel: 'ring-indigo-500', foco: 'focus-visible:ring-indigo-500' },
    emerald: { icone: 'bg-emerald-50 text-emerald-600', anel: 'ring-emerald-500', foco: 'focus-visible:ring-emerald-500' },
    amber: { icone: 'bg-amber-50 text-amber-600', anel: 'ring-amber-500', foco: 'focus-visible:ring-amber-500' },
    red: { icone: 'bg-red-50 text-red-600', anel: 'ring-red-500', foco: 'focus-visible:ring-red-500' },
    sky: { icone: 'bg-sky-50 text-sky-600', anel: 'ring-sky-500', foco: 'focus-visible:ring-sky-500' },
};

function Cartao({ titulo, valor, detalhe, icone, tom, ativo, onClick, children }: CartaoProps) {
    const t = TONS[tom];
    const base = 'text-left bg-white rounded-2xl border border-slate-200 shadow-sm p-5 transition-all';
    const conteudo = (
        <>
            <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{titulo}</p>
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.icone}`}>{icone}</span>
            </div>
            <p className="text-3xl font-black text-slate-800 mt-2 tabular-nums">{valor}</p>
            <p className="text-xs text-slate-500 mt-1">{detalhe}</p>
            {children}
        </>
    );

    if (!onClick) return <div className={base}>{conteudo}</div>;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={ativo}
            title={ativo ? 'Clique para remover o filtro' : 'Clique para filtrar a tabela'}
            className={`${base} cursor-pointer hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 ${t.foco} ${
                ativo ? `ring-2 ${t.anel}` : ''
            }`}
        >
            {conteudo}
        </button>
    );
}

const Icone = ({ d }: { d: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
);

export default function CartoesIndicadores({ ind, totalEmpresas, totalAreas, statusAtivo, onSelecionarStatus }: Props) {
    const alternar = (s: StatusExame) => onSelecionarStatus(statusAtivo === s ? null : s);
    const corBarra = ind.conformidade >= 90 ? 'bg-emerald-500' : ind.conformidade >= 75 ? 'bg-amber-500' : 'bg-red-500';

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            <Cartao
                titulo="Conformidade"
                valor={formatarPercentual(ind.conformidade)}
                detalhe={`${ind.contagem['Válido']} de ${ind.avaliados} exames em dia`}
                tom="emerald"
                ativo={statusAtivo === 'Válido'}
                onClick={() => alternar('Válido')}
                icone={<Icone d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />}
            >
                <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden" aria-hidden>
                    <div className={`h-full rounded-full ${corBarra}`} style={{ width: `${Math.min(100, ind.conformidade)}%` }} />
                </div>
            </Cartao>

            <Cartao
                titulo="Colaboradores"
                valor={ind.total}
                detalhe={`${plural(totalEmpresas, 'empresa', 'empresas')} · ${plural(totalAreas, 'área', 'áreas')}`}
                tom="indigo"
                icone={<Icone d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />}
            />

            <Cartao
                titulo="Vencidos"
                valor={ind.contagem['Vencido']}
                detalhe={ind.contagem['Vencido'] > 0 ? `Atraso médio de ${plural(ind.mediaAtraso, 'dia', 'dias')}` : 'Nenhum exame em atraso'}
                tom="red"
                ativo={statusAtivo === 'Vencido'}
                onClick={() => alternar('Vencido')}
                icone={<Icone d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />}
            />

            <Cartao
                titulo="Vencendo"
                valor={ind.contagem['Vencendo']}
                detalhe="Vencem nos próximos 35 dias"
                tom="amber"
                ativo={statusAtivo === 'Vencendo'}
                onClick={() => alternar('Vencendo')}
                icone={<Icone d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />}
            />

            <Cartao
                titulo="Próximos 90 dias"
                valor={ind.vencem90}
                detalhe={`${plural(ind.vencem30, 'vence', 'vencem')} em até 30 dias`}
                tom="sky"
                icone={<Icone d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />}
            />
        </div>
    );
}
