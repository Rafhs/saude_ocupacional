import { getExamesOcupacionais, usandoDadosDemonstracao } from './lib/googleSheets';
import { hojeReferencia, linhasParaFuncionarios } from './lib/exames';
import PainelInicial from './components/PainelInicial';
import Header from './components/Header';

export const revalidate = 60;

export default async function Home() {
  const dadosPlanilha = await getExamesOcupacionais();
  const linhas = (dadosPlanilha && dadosPlanilha.length > 1) ? dadosPlanilha.slice(1) : [];
  const listaFuncionarios = linhasParaFuncionarios(linhas);

  return (
      <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
        <Header />
        <main className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-6">
          {linhas.length > 0 ? (
              <PainelInicial data={listaFuncionarios} hojeMs={hojeReferencia()} demonstracao={usandoDadosDemonstracao()} />
          ) : (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm max-w-2xl mx-auto mt-10">
                <h2 className="text-xl font-bold text-slate-700 mb-2">Nenhum dado encontrado</h2>
                <p className="text-slate-500">Verifique sua planilha.</p>
              </div>
          )}
        </main>
      </div>
  );
}