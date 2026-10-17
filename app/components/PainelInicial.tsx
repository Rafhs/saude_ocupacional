'use client';

import { useMemo, useRef, useState } from 'react';
import TabelaFuncionarios from './TabelaFuncionarios';
import CartoesIndicadores from './dashboard/CartoesIndicadores';
import PainelInsights from './dashboard/PainelInsights';
import GraficoProjecao from './dashboard/GraficoProjecao';
import GraficoStatus from './dashboard/GraficoStatus';
import GraficoGrupos from './dashboard/GraficoGrupos';
import ListaPrioridades from './dashboard/ListaPrioridades';
import {
    analisarExames,
    calcularIndicadores,
    formatarDataBR,
    type Funcionario,
    type StatusExame,
} from '../lib/exames';

interface Props {
    data: Funcionario[];
    /** "Hoje" calculado no servidor, para que servidor e cliente classifiquem igual. */
    hojeMs: number;
    demonstracao?: boolean;
}

const ordenar = (lista: string[]) => Array.from(new Set(lista.filter((v) => v && v !== '-'))).sort((a, b) => a.localeCompare(b, 'pt-BR'));

export default function PainelInicial({ data, hojeMs, demonstracao = false }: Props) {
    const [empresa, setEmpresa] = useState('');
    const [area, setArea] = useState('');
    const [statusTabela, setStatusTabela] = useState<StatusExame | null>(null);
    const tabelaRef = useRef<HTMLDivElement>(null);

    const analisados = useMemo(() => analisarExames(data, hojeMs), [data, hojeMs]);
    const empresas = useMemo(() => ordenar(analisados.map((i) => i.empresa)), [analisados]);
    const areas = useMemo(
        () => ordenar(analisados.filter((i) => !empresa || i.empresa === empresa).map((i) => i.area)),
        [analisados, empresa],
    );

    const escopo = useMemo(
        () => analisados.filter((i) => (!empresa || i.empresa === empresa) && (!area || i.area === area)),
        [analisados, empresa, area],
    );
    const ind = useMemo(() => calcularIndicadores(escopo, hojeMs), [escopo, hojeMs]);

    const dadosTabela = useMemo(
        () => (statusTabela ? escopo.filter((i) => i.status === statusTabela) : escopo),
        [escopo, statusTabela],
    );

    const totalEmpresas = useMemo(() => ordenar(escopo.map((i) => i.empresa)).length, [escopo]);
    const totalAreas = useMemo(() => ordenar(escopo.map((i) => i.area)).length, [escopo]);

    const selecionarStatus = (s: StatusExame | null) => {
        setStatusTabela(s);
        if (s) tabelaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const selecionarEmpresa = (nome: string) => {
        setEmpresa((atual) => (atual === nome ? '' : nome));
        setArea('');
    };

    const temFiltro = empresa || area || statusTabela;
    const seletor =
        'px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer min-w-0';

    return (
        <div className="space-y-6">
            {/* Cabeçalho e escopo da análise */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Visão geral</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Situação em {formatarDataBR(hojeMs)} · validade de 365 dias, alerta a partir de 330 dias
                        {demonstracao && (
                            <span className="ml-2 inline-flex rounded-md bg-violet-50 px-2 py-0.5 text-xs font-bold text-violet-700 ring-1 ring-inset ring-violet-600/20">
                                Dados de demonstração
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                    <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1">
                        Empresa
                        <select
                            className={seletor}
                            value={empresa}
                            onChange={(e) => {
                                setEmpresa(e.target.value);
                                setArea('');
                            }}
                        >
                            <option value="">Todas as empresas</option>
                            {empresas.map((e) => (
                                <option key={e} value={e}>
                                    {e}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col text-xs font-semibold text-slate-500 gap-1">
                        Área
                        <select className={seletor} value={area} onChange={(e) => setArea(e.target.value)}>
                            <option value="">Todas as áreas</option>
                            {areas.map((a) => (
                                <option key={a} value={a}>
                                    {a}
                                </option>
                            ))}
                        </select>
                    </label>
                    {temFiltro && (
                        <button
                            type="button"
                            onClick={() => {
                                setEmpresa('');
                                setArea('');
                                setStatusTabela(null);
                            }}
                            className="px-3 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Limpar filtros
                        </button>
                    )}
                </div>
            </div>

            <CartoesIndicadores
                ind={ind}
                totalEmpresas={totalEmpresas}
                totalAreas={totalAreas}
                statusAtivo={statusTabela}
                onSelecionarStatus={selecionarStatus}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <PainelInsights insights={ind.insights} />
                <div className="xl:col-span-2">
                    <GraficoProjecao data={ind.projecao} />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <GraficoStatus contagem={ind.contagem} conformidade={ind.conformidade} />
                <div className="xl:col-span-2">
                    <GraficoGrupos
                        titulo="Situação por empresa"
                        subtitulo={empresa ? 'Clique na barra para voltar a todas as empresas' : 'Clique numa barra para analisar apenas aquela empresa'}
                        data={ind.porEmpresa}
                        onSelecionar={selecionarEmpresa}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <GraficoGrupos
                    titulo="Pendências por área"
                    subtitulo="Setores com mais exames vencidos ou vencendo"
                    data={ind.porArea}
                    onSelecionar={(nome) => setArea((atual) => (atual === nome ? '' : nome))}
                    somentePendencias
                />
                <ListaPrioridades itens={ind.prioridades} />
            </div>

            {/* Tabela detalhada */}
            <div ref={tabelaRef} className="scroll-mt-24 space-y-3 pt-2">
                {statusTabela && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        Exibindo apenas exames com status
                        <button
                            type="button"
                            onClick={() => setStatusTabela(null)}
                            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                        >
                            {statusTabela} ✕
                        </button>
                    </div>
                )}
                {dadosTabela.length > 0 ? (
                    <TabelaFuncionarios data={dadosTabela} />
                ) : (
                    <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm">
                        <p className="text-slate-500">Nenhum registro para os filtros selecionados.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
