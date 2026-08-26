import { google } from 'googleapis';

export async function getExamesOcupacionais() {
    try {
        // 1. Puxa as variáveis de ambiente com os nomes exatos do Vercel
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY;
        const sheetId = process.env.SHEET_ID;

        // Se faltar alguma variável no Vercel, ele avisa no painel de logs
        if (!clientEmail || !privateKey || !sheetId) {
            console.error("Faltam variáveis de ambiente (E-mail, Chave ou ID da Planilha).");
            return [];
        }

        // 2. O VERCEL QUEBRA AS LINHAS DA CHAVE. Esta linha conserta a chave magicamente!
        const chaveFormatada = privateKey.replace(/\\n/g, '\n');

        // 3. Faz a autenticação usando as variáveis isoladas
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: chaveFormatada,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 4. Faz a requisição dos dados
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'dados!A:G',
        });

        return response.data.values;
    } catch (error) {
        console.error("Erro ao buscar dados do Google Sheets:", error);
        return [];
    }
}