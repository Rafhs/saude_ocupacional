# 🏥 Dashboard de Saúde Ocupacional

Um sistema web desenvolvido para simplificar e automatizar a gestão de exames periódicos e prontuários médicos de funcionários. O painel consome dados dinâmicos de uma planilha do Google Sheets, calcula inteligentemente o status de vencimento dos exames e gera guias de encaminhamento de forma automática.

Projeto idealizado com foco em **People Analytics** e automação de processos de RH, otimizando o tempo de gestão em operações industriais e corporativas.

## ✨ Funcionalidades

*   📊 **Dashboard de Prontuários:** Visão geral de todos os colaboradores com filtros reativos e em tempo real (Nome, Empresa, Função e Exame).
*   🚨 **Status Inteligente de Exames:** Cálculo automático de vencimento baseado na data do último exame:
    *   🟢 **Válido:** Menos de 330 dias.
    *   🟡 **Vencendo:** Entre 330 e 364 dias.
    *   🔴 **Vencido:** 365 dias ou mais.
*   ⚠️ **Central de Encaminhamentos:** Uma página isolada focada apenas nas pendências, exibindo somente colaboradores com status *Vencendo* ou *Vencido*.
*   📄 **Geração Automática de Guias:** Emissão de texto padronizado para liberação de exames. Inclui formatação inteligente de texto (capitalização automática de nomes em *CAPS LOCK*) e botão de "Cópia Rápida" com feedback visual de sucesso.
*   🔄 **Atualização Assíncrona:** Sincronização de dados sob demanda com o Google Sheets sem necessidade de recarregar a página

## 🛠️ Tecnologias Utilizadas

*   **Framework React com App Router.
*   **Biblioteca JavaScript para construção de interfaces (Hooks, useMemo, useState).
*   **Tipagem estática para maior segurança do código.
*   **Estilização utilitária para um design responsivo, limpo e moderno.
*   **Integração de banco de dados diretamente via planilhas do Google.
*   **Hospedagem e CI/CD.
