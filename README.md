# 🏥 Dashboard de Saúde Ocupacional

Um sistema web desenvolvido para simplificar e automatizar a gestão de exames periódicos e prontuários médicos de funcionários. O painel consome dados dinâmicos de uma planilha do Google Sheets, calcula inteligentemente o status de vencimento dos exames e gera guias de encaminhamento de forma automática.

Projeto idealizado com foco em **People Analytics** e automação de processos de RH, otimizando o tempo de gestão em operações industriais e corporativas.

## ✨ Funcionalidades

*   🧠 **Dashboard Inteligente (página inicial):**
    *   **Indicadores (KPIs):** índice de conformidade, total de colaboradores, exames vencidos (com atraso médio), vencendo e vencimentos nos próximos 90 dias. Os cartões de status são clicáveis e filtram a tabela.
    *   **Insights automáticos:** alertas gerados a partir dos dados (conformidade abaixo da meta, caso mais antigo em atraso, empresa que concentra as pendências, área mais crítica, pico de vencimentos previsto, registros sem data).
    *   **Projeção de vencimentos:** atrasados + quantidade de exames que vencem em cada um dos próximos 12 meses, para planejar a agenda com a clínica.
    *   **Situação por empresa e por área:** gráficos empilhados por status; clicar numa barra filtra todo o dashboard.
    *   **Ações prioritárias:** colaboradores ordenados por urgência, com atalho para a Central de Encaminhamentos.
    *   **Filtros de escopo** por Empresa e Área que recalculam todos os indicadores.
*   📊 **Dashboard de Prontuários:** Visão geral de todos os colaboradores com filtros reativos e em tempo real (Nome, Empresa, Função e Exame).
*   🚨 **Status Inteligente de Exames:** Cálculo automático de vencimento baseado na data do último exame:
    *   🟢 **Válido:** Menos de 330 dias.
    *   🟡 **Vencendo:** Entre 330 e 364 dias.
    *   🔴 **Vencido:** 365 dias ou mais.
*   ⚠️ **Central de Encaminhamentos:** Uma página isolada focada apenas nas pendências, exibindo somente colaboradores com status *Vencendo* ou *Vencido*.
*   📄 **Geração Automática de Guias:** Emissão de texto padronizado para liberação de exames. Inclui formatação inteligente de texto (capitalização automática de nomes em *CAPS LOCK*) e botão de "Cópia Rápida" com feedback visual de sucesso.
*   🔄 **Atualização Assíncrona:** Sincronização de dados sob demanda com o Google Sheets sem necessidade de recarregar a página

## 📄 Estrutura da Planilha

A aplicação lê a aba **`dados`**, colunas **A:G**. A primeira linha é o cabeçalho:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Nome | Empresa | CNPJ | Área | Cargo | Tipo de Exame | Data do Exame (`dd/mm/aaaa`) |

## 🚀 Executando Localmente

1. Instale as dependências: `npm install`
2. Crie um arquivo `.env.local` (já ignorado pelo Git) com as credenciais da conta de serviço:

   ```env
   GOOGLE_CLIENT_EMAIL=sua-conta@projeto.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   SHEET_ID=id-da-planilha
   ```

   > Compartilhe a planilha com o e-mail da conta de serviço (permissão de leitor).

3. Rode `npm run dev` e acesse `http://localhost:3000`.

**Sem credenciais?** Use o modo de demonstração com dados fictícios: `USE_MOCK_DATA=true npm run dev`.

## 🛠️ Tecnologias Utilizadas

*   **Next.js** — Framework React com App Router.
*   **React** — Biblioteca JavaScript para construção de interfaces (Hooks, useMemo, useState).
*   **TypeScript** — Tipagem estática para maior segurança do código.
*   **Tailwind CSS** — Estilização utilitária para um design responsivo, limpo e moderno.
*   **Recharts** — Gráficos interativos do dashboard.
*   **Google Sheets API** — Integração de banco de dados diretamente via planilhas do Google.
*   **Vercel** — Hospedagem e CI/CD.
