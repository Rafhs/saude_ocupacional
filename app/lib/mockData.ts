/**
 * Gera dados fictícios no mesmo formato da aba "dados" da planilha (A:G).
 * Usado apenas quando USE_MOCK_DATA=true, para desenvolvimento local sem
 * credenciais do Google. A semente fixa torna o resultado reproduzível.
 */

const EMPRESAS = [
    { nome: 'METALÚRGICA AURORA LTDA', cnpj: '12.345.678/0001-90' },
    { nome: 'TRANSPORTES RIO VERDE S.A.', cnpj: '23.456.789/0001-01' },
    { nome: 'QUÍMICA BOA VISTA LTDA', cnpj: '34.567.890/0001-12' },
    { nome: 'CONSTRUTORA HORIZONTE LTDA', cnpj: '45.678.901/0001-23' },
];

const AREAS: Record<string, string[]> = {
    'Produção': ['Operador de Máquinas', 'Soldador', 'Auxiliar de Produção'],
    'Manutenção': ['Mecânico Industrial', 'Eletricista'],
    'Logística': ['Operador de Empilhadeira', 'Conferente', 'Motorista'],
    'Administrativo': ['Analista de RH', 'Assistente Administrativo'],
    'Qualidade': ['Inspetor de Qualidade', 'Técnico de Laboratório'],
    'SESMT': ['Técnico de Segurança'],
};

const NOMES = ['ANA', 'BRUNO', 'CARLA', 'DIEGO', 'EDUARDA', 'FELIPE', 'GABRIELA', 'HUGO', 'ISABELA', 'JOÃO', 'KARINA', 'LUCAS', 'MARIANA', 'NATÁLIA', 'OTÁVIO', 'PAULA', 'RAFAEL', 'SABRINA', 'THIAGO', 'VANESSA'];
const SOBRENOMES = ['SILVA', 'SANTOS', 'OLIVEIRA', 'SOUZA', 'LIMA', 'PEREIRA', 'COSTA', 'RODRIGUES', 'ALMEIDA', 'NASCIMENTO', 'CARVALHO', 'DA ROCHA'];

const TIPOS: [string, number][] = [
    ['Periódico', 0.6],
    ['Admissional', 0.2],
    ['Retorno ao Trabalho', 0.08],
    ['Mudança de Função', 0.07],
    ['Demissional', 0.05],
];

export function gerarDadosDemonstracao(quantidade = 140): string[][] {
    let semente = 20261015;
    const rand = () => {
        semente = (semente * 16807) % 2147483647;
        return (semente - 1) / 2147483646;
    };
    const escolher = <T,>(lista: T[]) => lista[Math.floor(rand() * lista.length)];
    const escolherTipo = () => {
        let r = rand();
        for (const [tipo, peso] of TIPOS) {
            if ((r -= peso) <= 0) return tipo;
        }
        return TIPOS[0][0];
    };

    const hoje = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const linhas: string[][] = [['Nome', 'Empresa', 'CNPJ', 'Área', 'Cargo', 'Tipo de Exame', 'Data do Exame']];

    for (let i = 0; i < quantidade; i++) {
        const empresaIdx = Math.floor(rand() * EMPRESAS.length);
        const empresa = EMPRESAS[empresaIdx];
        const area = escolher(Object.keys(AREAS));
        const cargo = escolher(AREAS[area]);
        const nome = `${escolher(NOMES)} ${escolher(SOBRENOMES)} ${escolher(SOBRENOMES)}`;

        // A terceira empresa tem um histórico mais atrasado, para gerar cenários de alerta.
        const diasAtras = empresaIdx === 2 ? 200 + Math.floor(rand() * 320) : Math.floor(rand() * 420);
        const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - diasAtras);
        const dataTexto = rand() < 0.03 ? '' : `${pad(data.getDate())}/${pad(data.getMonth() + 1)}/${data.getFullYear()}`;

        linhas.push([nome, empresa.nome, empresa.cnpj, area, cargo, escolherTipo(), dataTexto]);
    }

    return linhas;
}
