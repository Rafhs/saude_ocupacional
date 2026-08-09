export function obterStatusExame(dataString: string) {
    if (!dataString || dataString === '-') {
        return { texto: '-', cor: 'bg-slate-100 text-slate-600 ring-slate-500/20' };
    }

    const partes = dataString.split('/');
    if (partes.length !== 3) {
        return { texto: 'Data Inválida', cor: 'bg-slate-100 text-slate-600 ring-slate-500/20' };
    }

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const ano = parseInt(partes[2], 10);

    const dataExame = new Date(ano, mes, dia);
    const hoje = new Date();

    const diferencaEmDias = Math.floor((hoje.getTime() - dataExame.getTime()) / (1000 * 60 * 60 * 24));

    if (diferencaEmDias >= 365) return { texto: 'Vencido', cor: 'bg-red-50 text-red-700 ring-red-600/20' };
    if (diferencaEmDias >= 330) return { texto: 'Vencendo', cor: 'bg-amber-50 text-amber-700 ring-amber-600/20' };

    return { texto: 'Válido', cor: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' };
}

export function capitalizar(texto: string) {
    if (!texto || texto === '-') return '-';

    const palavras = texto.toLowerCase().split(' ');
    const excecoes = ['de', 'da', 'do', 'das', 'dos', 'e'];

    return palavras.map((palavra, index) => {
        if (index !== 0 && excecoes.includes(palavra)) return palavra;
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    }).join(' ');
}