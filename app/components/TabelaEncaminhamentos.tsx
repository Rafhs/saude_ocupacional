'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { capitalizar } from '../lib/utils';

export interface FuncionarioAlerta {
    nome: string;
    empresa: string;
    cnpj: string;
    cargo: string;
    tipoExame: string;
    dataExame: string;
    status: string;
}

export default function TabelaEncaminhamentos({ data }: { data: FuncionarioAlerta[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [guiaSelecionada, setGuiaSelecionada] = useState<FuncionarioAlerta | null>(null);

    const [filtroEmpresa, setFiltroEmpresa] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');

    const empresasUnicas = useMemo(() => Array.from(new Set(data.map(f => f.empresa).filter(Boolean))).sort(), [data]);
    const statusUnicos = useMemo(() => Array.from(new Set(data.map(f => f.status).filter(Boolean))).sort(), [data]);

    const dadosFiltrados = useMemo(() => {
        return data.filter((func) => {
            const empresaBate = filtroEmpresa === '' || func.empresa === filtroEmpresa;
            const statusBate = filtroStatus === '' || func.status === filtroStatus;
            return empresaBate && statusBate;
        });
    }, [data, filtroEmpresa, filtroStatus]);

    if (!data || data.length === 0) return null;

    const gerarTextoFormatado = (guia: FuncionarioAlerta) => {
        const nomeFormatado = capitalizar(guia.nome);
        const exameFormatado = capitalizar(guia.tipoExame);
        const cargoFormatado = capitalizar(guia.cargo);

        const textoBase = `Srs (as),

Autorizamos os funcionários abaixo a realizar exame Periódico pela empresa: ${guia.empresa}

Empresa: ${guia.empresa}
CNPJ: ${guia.cnpj}

Nome: ${nomeFormatado} | CPF: 
Tipo de Exame: ${exameFormatado}
Função: ${cargoFormatado}

Seguindo bateria de exames conforme PCMSO
Área: Carbonor`;

        return textoBase.replace(/CARBONOR/gi, 'Carbonor');
    };

    const copiarParaAreaDeTransferencia = () => {
        if (!guiaSelecionada) return;
        const texto = gerarTextoFormatado(guiaSelecionada);
        navigator.clipboard.writeText(texto);
        alert('Guia copiada com sucesso!');
    };

    const atualizarDados = () => {
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">

            <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <h2 className="text-lg font-bold text-slate-800">
                    Aguardando Encaminhamento
                </h2>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <select
                        value={filtroEmpresa}
                        onChange={(e) => setFiltroEmpresa(e.target.value)}
                        className="px-3 py-1.5 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer flex-1 lg:flex-none"
                    >
                        <option value="">Todas as Empresas</option>
                        {empresasUnicas.map((empresa, i) => <option key={i} value={empresa}>{empresa}</option>)}
                    </select>

                    <select
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        className="px-3 py-1.5 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer flex-1 lg:flex-none"
                    >
                        <option value="">Todos os Status</option>
                        {statusUnicos.map((status, i) => <option key={i} value={status}>{status}</option>)}
                    </select>

                    <button
                        onClick={atualizarDados}
                        disabled={isPending}
                        className="flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50 w-full sm:w-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 ${isPending ? 'animate-spin text-amber-600' : 'text-slate-500'}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        {isPending ? 'Atualizando...' : 'Atualizar Dados'}
                    </button>
                </div>
            </div>

            <div className="overflow-auto max-h-[500px]">
                <table className="w-full text-left text-sm whitespace-nowrap relative">
                    <thead className="bg-slate-50 text-slate-500 sticky top-0 z-10 shadow-[0_1px_0_0_#e2e8f0]">
                    <tr>
                        <th className="px-6 py-4 font-semibold w-[30%]">Funcionário</th>
                        <th className="px-6 py-4 font-semibold w-[20%]">Empresa</th>
                        <th className="px-6 py-4 font-semibold w-[15%]">Função / Exame</th>
                        <th className="px-6 py-4 font-semibold w-[15%]">Último Exame</th>
                        <th className="px-6 py-4 font-semibold w-[10%]">Status</th>
                        <th className="px-6 py-4 font-semibold w-[10%] text-right">Ação</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {dadosFiltrados.length > 0 ? (
                        dadosFiltrados.map((func, index) => {
                            const ehVencido = func.status === 'Vencido';
                            const estaSelecionado = guiaSelecionada?.nome === func.nome;
                            return (
                                <tr key={index} className={`transition-colors ${estaSelecionado ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}>
                                    <td className="px-6 py-4"><p className="font-bold text-slate-800">{func.nome}</p></td>
                                    <td className="px-6 py-4"><p className="font-medium text-slate-700">{func.empresa}</p></td>
                                    <td className="px-6 py-4">
                                        <p className="text-slate-800 font-medium">{func.tipoExame}</p>
                                        <p className="text-xs text-slate-500">{func.cargo}</p>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">{func.dataExame}</td>
                                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${ehVencido ? 'bg-red-50 text-red-700 ring-red-600/20' : 'bg-amber-50 text-amber-700 ring-amber-600/20'}`}>
                        {func.status}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setGuiaSelecionada(func)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                                        >
                                            Gerar Guia
                                        </button>
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
                Mostrando {dadosFiltrados.length} registro(s) para encaminhamento
            </div>

            {guiaSelecionada && (
                <div className="p-6 border-t border-slate-200 bg-slate-50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800 text-lg">Documento de Encaminhamento</h3>
                        <div className="flex gap-3">
                            <button onClick={() => setGuiaSelecionada(null)} className="text-slate-500 hover:text-slate-700 text-sm font-medium px-3 py-1.5">Fechar</button>
                            <button onClick={copiarParaAreaDeTransferencia} className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                </svg>
                                Copiar Texto
                            </button>
                        </div>
                    </div>
                    <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-inner text-slate-800 font-mono text-sm whitespace-pre-wrap">
                        {gerarTextoFormatado(guiaSelecionada)}
                    </div>
                </div>
            )}
        </div>
    );
}