import type { ReactNode } from 'react';

interface CardProps {
    titulo: string;
    subtitulo?: string;
    acao?: ReactNode;
    children: ReactNode;
    className?: string;
}

/** Contêiner padrão dos blocos do dashboard. */
export default function Card({ titulo, subtitulo, acao, children, className = '' }: CardProps) {
    return (
        <section className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col ${className}`}>
            <header className="flex items-start justify-between gap-4 mb-5">
                <div>
                    <h2 className="text-base font-bold text-slate-800">{titulo}</h2>
                    {subtitulo && <p className="text-xs text-slate-500 mt-0.5">{subtitulo}</p>}
                </div>
                {acao}
            </header>
            <div className="flex-1 min-h-0">{children}</div>
        </section>
    );
}
