'use client';

export interface ResumoEmpresa {
    empresa: string;
    quantidade: number;
}

export default function ResumoEmpresas({ data }: { data: ResumoEmpresa[] }) {
    if (!data || data.length === 0) return null;

    return (
        <div className="mb-10">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Visão Geral por Empresa
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all duration-300 group"
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">
                                {item.empresa}
                            </p>
                            <h3 className="text-3xl font-bold text-slate-800">
                                {item.quantidade}
                            </h3>
                        </div>

                        {/* Ícone decorativo corporativo */}
                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}