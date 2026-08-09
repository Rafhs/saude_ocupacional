import { getExamesOcupacionais } from '../lib/googleSheets';
import { obterStatusExame } from '../lib/utils';
import TabelaEncaminhamentos from '../components/TabelaEncaminhamentos';
import Header from '../components/Header';

export const revalidate = 60;

export default async function EncaminhamentosPage() {
    const dadosPlanilha = await getExamesOcupacionais();
    const linhas = (dadosPlanilha && dadosPlanilha.length > 1) ? dadosPlanilha.slice(1) : [];

    const listaParaEncaminhamento = linhas
        .map((linha: any[]) => {
            const dataExame = linha[6] || '-';
            const statusObj = obterStatusExame(dataExame);

            return {
                nome: linha[0] || '-',
                empresa: linha[1] || '-',
                cnpj: linha[2] || '-',
                cargo: linha[4] || '-',
                tipoExame: linha[5] || '-',
                dataExame: dataExame,
                status: statusObj.texto
            };
        })
        .filter(func => func.status === 'Vencido' || func.status === 'Vencendo');

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
            <Header />
            <main className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-6">
                <div className="mb-6">
                    <p className="text-slate-500">
                        Encontrados <strong className="text-slate-800">{listaParaEncaminhamento.length}</strong> funcionários com exames próximos ao vencimento ou atrasados.
                    </p>
                </div>

                {listaParaEncaminhamento.length > 0 ? (
                    <TabelaEncaminhamentos data={listaParaEncaminhamento} />
                ) : (
                    <div className="bg-emerald-50 rounded-2xl p-10 text-center border border-emerald-100 shadow-sm max-w-2xl mx-auto mt-10">
                        <h2 className="text-xl font-bold text-emerald-700 mb-2">Tudo em dia!</h2>
                        <p className="text-emerald-600">
                            Não há nenhum funcionário com exames vencendo ou vencidos no momento.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}