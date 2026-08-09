'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { obterStatusExame } from '../lib/utils';

export interface Funcionario {
    nome: string;
    empresa: string;
    cnpj: string;
    area: string;
    cargo: string;
    tipoExame: string;
    dataExame: string;
}

export default function TabelaFuncionarios({ data }: { data: Funcionario[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [filtroNome, setFiltroNome] = useState('');
    const [filtroEmpresa, setFiltroEmpresa] = useState('');
    const [filtroCargo, setFiltroCargo] = useState('');
    const [filtroExame, setFiltroExame] = useState('');

    // useMemo garante que as listas únicas só sejam recalculadas se os dados da planilha mudarem
    const empresasUnicas = useMemo(() => Array.from(new Set(data.map(f => f.empresa).filter(Boolean))).sort(), [data]);
    const cargosUnicos = useMemo(() => Array.from(new Set(data.map(f => f.cargo).filter(Boolean))).sort(), [data]);
    const examesUnicos = useMemo(() => Array.from(new Set(data.map(f => f.tipoExame).filter(Boolean))).sort(), [data]);

    // useMemo protege a performance do filtro
    const dadosFiltrados = useMemo(() => {
        return data.filter((func) => {
            const nomeBate = func.nome.toLowerCase().includes(filtroNome.toLowerCase());
            const empresaBate = filtroEmpresa === '' || func.empresa === filtroEmpresa;
            const cargoBate = filtroCargo === '' || func.cargo === filtroCargo;
            const exameBate = filtroExame === '' || func.tipoExame === filtroExame;
            return nomeBate && empresaBate && cargoBate && exameBate;
        });
    }, [data, filtroNome, filtroEmpresa, filtroCargo, filtroExame]);

    if (!data || data.length === 0) return null;

    const atualizarDados = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 bg-slate-50/50">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800">Prontuários Recentes</h2>
                    <button
                        onClick={atualizarDados}
                        disabled={isPending}
                        className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 ${isPending ? 'animate-spin text-indigo-600' : 'text-slate-500'}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        {isPending ? 'Atualizando...' : 'Atualizar Dados'}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Funcionário</label>
                        <input
                            type="text"
                            placeholder="Digite o nome..."
                            value={filtroNome}
                            onChange={(e) => setFiltroNome(e.target.value)}
                            className="w-full px-3 py-2 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Empresa</label>
                        <select
                            value={filtroEmpresa}
                            onChange={(e) => setFiltroEmpresa(e.target.value)}
                            className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            <option value="">Todas</option>
                            {empresasUnicas.map((empresa, i) => <option key={i} value={empresa}>{empresa}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Função / Cargo</label>
                        <select
                            value={filtroCargo}
                            onChange={(e) => setFiltroCargo(e.target.value)}
                            className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            <option value="">Todas</option>
                            {cargosUnicos.map((cargo, i) => <option key={i} value={cargo}>{cargo}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Tipo de Exame</label>
                        <select
                            value={filtroExame}
                            onChange={(e) => setFiltroExame(e.target.value)}
                            className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            <option value="">Todos</option>
                            {examesUnicos.map((exame, i) => <option key={i} value={exame}>{exame}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-auto max-h-[700px]">
                <table className="w-full text-left text-sm whitespace-nowrap relative">
                    <thead className="bg-white text-slate-500 sticky top-0 z-10 shadow-[0_1px_0_0_#e2e8f0]">
                    <tr>
                        <th className="px-6 py-4 font-semibold w-[30%]">Funcionário</th>
                        <th className="px-6 py-4 font-semibold w-[25%]">Empresa</th>
                        <th className="px-6 py-4 font-semibold w-[15%]">Função</th>
                        <th className="px-6 py-4 font-semibold w-[10%]">Tipo de Exame</th>
                        <th className="px-6 py-4 font-semibold w-[10%]">Data</th>
                        <th className="px-6 py-4 font-semibold w-[10%]">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {dadosFiltrados.length > 0 ? (
                        dadosFiltrados.map((func, index) => {
                            const status = obterStatusExame(func.dataExame);
                            return (
                                <tr key={index} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4"><p className="font-bold text-slate-800">{func.nome}</p></td>
                                    <td className="px-6 py-4"><p className="font-medium text-slate-700">{func.empresa}</p></td>
                                    <td className="px-6 py-4 text-slate-600">{func.cargo}</td>
                                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
                        {func.tipoExame}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">{func.dataExame}</td>
                                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${status.cor}`}>
                        {status.texto}
                      </span>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                Nenhum registro encontrado para os filtros aplicados.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 font-medium z-20 relative">
                Mostrando {dadosFiltrados.length} registro(s)
            </div>
        </div>
    );
}