/**
 * Camada de análise dos exames ocupacionais.
 *
 * Todas as funções aqui são puras (sem React) para que possam ser usadas tanto
 * no servidor quanto no cliente. Datas são tratadas em UTC (meia-noite) e a
 * formatação é feita manualmente para evitar divergências de hidratação entre
 * o ICU do Node e o do navegador.
 */

export interface Funcionario {
    nome: string;
    empresa: string;
    cnpj: string;
    area: string;
    cargo: string;
    tipoExame: string;
    dataExame: string;
}

export type StatusExame = 'Válido' | 'Vencendo' | 'Vencido' | 'Sem data';

export const STATUS_ORDEM: StatusExame[] = ['Vencido', 'Vencendo', 'Válido', 'Sem data'];

export const STATUS_CORES: Record<StatusExame, string> = {
    'Válido': '#10b981',
    'Vencendo': '#f59e0b',
    'Vencido': '#ef4444',
    'Sem data': '#94a3b8',
};

/** Mesmas regras de negócio descritas no README. */
export const DIAS_VALIDADE = 365;
export const DIAS_ALERTA = 330;

const MS_POR_DIA = 86_400_000;
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const pad = (n: number) => String(n).padStart(2, '0');

/** Converte as linhas brutas da planilha (sem o cabeçalho) em funcionários. */
export function linhasParaFuncionarios(linhas: unknown[][]): Funcionario[] {
    const texto = (v: unknown) => (v === undefined || v === null || String(v).trim() === '' ? '-' : String(v).trim());
    return linhas.map((linha) => ({
        nome: texto(linha[0]),
        empresa: texto(linha[1]),
        cnpj: texto(linha[2]),
        area: texto(linha[3]),
        cargo: texto(linha[4]),
        tipoExame: texto(linha[5]),
        dataExame: texto(linha[6]),
    }));
}

/** "Hoje" (meia-noite UTC) no fuso informado. Calculado no servidor e enviado ao cliente. */
export function hojeReferencia(timeZone = 'America/Sao_Paulo'): number {
    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date());
    const obter = (tipo: string) => Number(partes.find((p) => p.type === tipo)?.value);
    return Date.UTC(obter('year'), obter('month') - 1, obter('day'));
}

/** Interpreta "dd/mm/aaaa" (ou "dd/mm/aa"). Retorna timestamp UTC ou null se inválida. */
export function parseDataBR(valor: string): number | null {
    if (!valor) return null;
    const m = valor.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
    if (!m) return null;
    const dia = Number(m[1]);
    const mes = Number(m[2]) - 1;
    let ano = Number(m[3]);
    if (ano < 100) ano += 2000;
    const ms = Date.UTC(ano, mes, dia);
    const d = new Date(ms);
    if (d.getUTCDate() !== dia || d.getUTCMonth() !== mes) return null;
    return ms;
}

export function formatarDataBR(ms: number): string {
    const d = new Date(ms);
    return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
}

export function rotuloMes(ms: number): string {
    const d = new Date(ms);
    return `${MESES[d.getUTCMonth()]}/${String(d.getUTCFullYear()).slice(2)}`;
}

export function formatarPercentual(valor: number, casas = 1): string {
    return `${valor.toFixed(casas).replace('.', ',')}%`;
}

export function plural(n: number, singular: string, pluralForma: string): string {
    return `${n} ${n === 1 ? singular : pluralForma}`;
}

export interface ExameAnalisado extends Funcionario {
    status: StatusExame;
    diasDesdeExame: number | null;
    /** Negativo = dias em atraso. */
    diasParaVencer: number | null;
    dataVencimento: number | null;
}

export function classificarPorDias(diasDesdeExame: number | null): StatusExame {
    if (diasDesdeExame === null) return 'Sem data';
    if (diasDesdeExame >= DIAS_VALIDADE) return 'Vencido';
    if (diasDesdeExame >= DIAS_ALERTA) return 'Vencendo';
    return 'Válido';
}

export function analisarExames(lista: Funcionario[], hojeMs: number): ExameAnalisado[] {
    return lista.map((f) => {
        const dataMs = parseDataBR(f.dataExame);
        const diasDesdeExame = dataMs === null ? null : Math.floor((hojeMs - dataMs) / MS_POR_DIA);
        return {
            ...f,
            status: classificarPorDias(diasDesdeExame),
            diasDesdeExame,
            diasParaVencer: diasDesdeExame === null ? null : DIAS_VALIDADE - diasDesdeExame,
            dataVencimento: dataMs === null ? null : dataMs + DIAS_VALIDADE * MS_POR_DIA,
        };
    });
}

export interface ResumoGrupo {
    nome: string;
    total: number;
    'Válido': number;
    'Vencendo': number;
    'Vencido': number;
    'Sem data': number;
    pendencias: number;
    conformidade: number;
}

function agrupar(itens: ExameAnalisado[], chave: (i: ExameAnalisado) => string): ResumoGrupo[] {
    const mapa = new Map<string, ResumoGrupo>();
    for (const item of itens) {
        const nome = chave(item);
        let g = mapa.get(nome);
        if (!g) {
            g = { nome, total: 0, 'Válido': 0, 'Vencendo': 0, 'Vencido': 0, 'Sem data': 0, pendencias: 0, conformidade: 0 };
            mapa.set(nome, g);
        }
        g.total += 1;
        g[item.status] += 1;
    }
    return Array.from(mapa.values()).map((g) => {
        const avaliados = g.total - g['Sem data'];
        return {
            ...g,
            pendencias: g['Vencido'] + g['Vencendo'],
            conformidade: avaliados > 0 ? (g['Válido'] / avaliados) * 100 : 0,
        };
    });
}

export interface PontoProjecao {
    rotulo: string;
    quantidade: number;
    tipo: 'atrasado' | 'proximo' | 'futuro';
}

/** Barra "Atrasados" + quantidade de exames que vencem em cada um dos próximos meses. */
export function projetarVencimentos(itens: ExameAnalisado[], hojeMs: number, meses = 12): PontoProjecao[] {
    const hoje = new Date(hojeMs);
    const pontos: PontoProjecao[] = [
        { rotulo: 'Atrasados', quantidade: itens.filter((i) => i.status === 'Vencido').length, tipo: 'atrasado' },
    ];
    for (let i = 0; i < meses; i++) {
        const inicioMes = Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth() + i, 1);
        const fimMes = Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth() + i + 1, 1);
        // Apenas vencimentos futuros: os já vencidos estão na barra "Atrasados".
        const quantidade = itens.filter(
            (it) => it.dataVencimento !== null && it.dataVencimento > hojeMs && it.dataVencimento >= inicioMes && it.dataVencimento < fimMes,
        ).length;
        pontos.push({ rotulo: rotuloMes(inicioMes), quantidade, tipo: i <= 1 ? 'proximo' : 'futuro' });
    }
    return pontos;
}

export type NivelInsight = 'critico' | 'alerta' | 'positivo' | 'info';

export interface Insight {
    nivel: NivelInsight;
    titulo: string;
    descricao: string;
}

export interface Indicadores {
    total: number;
    avaliados: number;
    contagem: Record<StatusExame, number>;
    conformidade: number;
    mediaAtraso: number;
    maiorAtraso: ExameAnalisado | null;
    vencem30: number;
    vencem90: number;
    porEmpresa: ResumoGrupo[];
    porArea: ResumoGrupo[];
    porTipo: { nome: string; quantidade: number }[];
    projecao: PontoProjecao[];
    prioridades: ExameAnalisado[];
    insights: Insight[];
}

const ORDEM_NIVEL: Record<NivelInsight, number> = { critico: 0, alerta: 1, info: 2, positivo: 3 };

export function calcularIndicadores(itens: ExameAnalisado[], hojeMs: number): Indicadores {
    const contagem: Record<StatusExame, number> = { 'Válido': 0, 'Vencendo': 0, 'Vencido': 0, 'Sem data': 0 };
    for (const i of itens) contagem[i.status] += 1;

    const total = itens.length;
    const avaliados = total - contagem['Sem data'];
    const conformidade = avaliados > 0 ? (contagem['Válido'] / avaliados) * 100 : 0;

    const vencidos = itens.filter((i) => i.status === 'Vencido');
    const mediaAtraso = vencidos.length
        ? Math.round(vencidos.reduce((s, i) => s + -(i.diasParaVencer ?? 0), 0) / vencidos.length)
        : 0;

    const prioridades = itens
        .filter((i) => i.status === 'Vencido' || i.status === 'Vencendo')
        .sort((a, b) => (a.diasParaVencer ?? 0) - (b.diasParaVencer ?? 0));
    const maiorAtraso = vencidos.length ? prioridades[0] : null;

    const emJanela = (dias: number) =>
        itens.filter((i) => i.diasParaVencer !== null && i.diasParaVencer > 0 && i.diasParaVencer <= dias).length;
    const vencem30 = emJanela(30);
    const vencem90 = emJanela(90);

    const porEmpresa = agrupar(itens, (i) => i.empresa).sort((a, b) => b.pendencias - a.pendencias || b.total - a.total);
    const porArea = agrupar(itens, (i) => i.area).sort((a, b) => b.pendencias - a.pendencias || b.total - a.total);

    const tipos = new Map<string, number>();
    for (const i of itens) tipos.set(i.tipoExame, (tipos.get(i.tipoExame) ?? 0) + 1);
    const porTipo = Array.from(tipos, ([nome, quantidade]) => ({ nome, quantidade })).sort((a, b) => b.quantidade - a.quantidade);

    const projecao = projetarVencimentos(itens, hojeMs);

    // ---------- Insights automáticos ----------
    const insights: Insight[] = [];
    const totalPendencias = contagem['Vencido'] + contagem['Vencendo'];

    if (avaliados > 0) {
        if (conformidade >= 90) {
            insights.push({
                nivel: 'positivo',
                titulo: `Conformidade de ${formatarPercentual(conformidade)}`,
                descricao: 'O programa de exames está saudável. Mantenha o acompanhamento dos próximos vencimentos.',
            });
        } else if (conformidade >= 75) {
            insights.push({
                nivel: 'alerta',
                titulo: `Conformidade de ${formatarPercentual(conformidade)}`,
                descricao: `Abaixo da meta de 90%. Regularizar ${plural(totalPendencias, 'pendência', 'pendências')} elevaria o índice para 100%.`,
            });
        } else {
            insights.push({
                nivel: 'critico',
                titulo: `Conformidade crítica: ${formatarPercentual(conformidade)}`,
                descricao: `Apenas ${contagem['Válido']} de ${avaliados} exames estão em dia. Há risco de autuação (NR-07).`,
            });
        }
    }

    if (vencidos.length > 0 && maiorAtraso) {
        insights.push({
            nivel: 'critico',
            titulo: `${plural(vencidos.length, 'exame vencido', 'exames vencidos')}`,
            descricao: `Atraso médio de ${plural(mediaAtraso, 'dia', 'dias')}. O caso mais antigo é ${capitalizarNome(maiorAtraso.nome)} (${plural(-(maiorAtraso.diasParaVencer ?? 0), 'dia', 'dias')} de atraso).`,
        });
    } else if (avaliados > 0) {
        insights.push({ nivel: 'positivo', titulo: 'Nenhum exame vencido', descricao: 'Todos os exames com data registrada estão dentro do prazo.' });
    }

    if (vencem30 > 0) {
        insights.push({
            nivel: 'alerta',
            titulo: `${plural(vencem30, 'exame vence', 'exames vencem')} em até 30 dias`,
            descricao: 'Agende com a clínica agora para evitar que entrem em atraso.',
        });
    }

    const empresasComPendencia = porEmpresa.filter((e) => e.pendencias > 0);
    if (porEmpresa.length > 1 && empresasComPendencia.length > 0 && totalPendencias > 0) {
        const e = empresasComPendencia[0];
        insights.push({
            nivel: e.conformidade < 75 ? 'critico' : 'alerta',
            titulo: `${e.nome} concentra ${formatarPercentual((e.pendencias / totalPendencias) * 100, 0)} das pendências`,
            descricao: `${plural(e.pendencias, 'colaborador irregular', 'colaboradores irregulares')} de ${e.total}, conformidade de ${formatarPercentual(e.conformidade)}.`,
        });
    }

    const areasCriticas = porArea
        .filter((a) => a.pendencias > 0 && a.nome !== '-')
        .sort((a, b) => a.conformidade - b.conformidade || b.pendencias - a.pendencias);
    if (porArea.length > 1 && areasCriticas.length > 0) {
        const a = areasCriticas[0];
        insights.push({
            nivel: 'info',
            titulo: `Área com menor conformidade: ${a.nome}`,
            descricao: `${formatarPercentual(a.conformidade)} em dia, com ${plural(a.pendencias, 'pendência', 'pendências')}. Priorize a convocação desse setor.`,
        });
    }

    const futuros = projecao.filter((p) => p.tipo !== 'atrasado');
    const pico = futuros.reduce<PontoProjecao | null>((m, p) => (!m || p.quantidade > m.quantidade ? p : m), null);
    if (pico && pico.quantidade > 0) {
        const media = futuros.reduce((s, p) => s + p.quantidade, 0) / futuros.length;
        if (pico.quantidade >= media * 1.5 && pico.quantidade >= 3) {
            insights.push({
                nivel: 'info',
                titulo: `Pico de vencimentos em ${pico.rotulo}`,
                descricao: `${plural(pico.quantidade, 'exame vence', 'exames vencem')} nesse mês, ${formatarPercentual(((pico.quantidade - media) / media) * 100, 0)} acima da média mensal. Antecipe parte da agenda.`,
            });
        }
    }

    if (contagem['Sem data'] > 0) {
        insights.push({
            nivel: 'info',
            titulo: `${plural(contagem['Sem data'], 'registro', 'registros')} sem data válida`,
            descricao: 'Revise a planilha: sem a data do último exame não é possível calcular o vencimento.',
        });
    }

    insights.sort((a, b) => ORDEM_NIVEL[a.nivel] - ORDEM_NIVEL[b.nivel]);

    return {
        total,
        avaliados,
        contagem,
        conformidade,
        mediaAtraso,
        maiorAtraso,
        vencem30,
        vencem90,
        porEmpresa,
        porArea,
        porTipo,
        projecao,
        prioridades,
        insights,
    };
}

function capitalizarNome(texto: string): string {
    const excecoes = ['de', 'da', 'do', 'das', 'dos', 'e'];
    return texto
        .toLowerCase()
        .split(' ')
        .map((p, i) => (i !== 0 && excecoes.includes(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
        .join(' ');
}
