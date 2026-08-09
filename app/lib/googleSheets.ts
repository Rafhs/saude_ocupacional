import { google } from 'googleapis';

export async function getExamesOcupacionais() {
    // 1. Validação de segurança: Verifica se a variável existe antes de prosseguir
    if (!process.env.SHEET_ID) {
        console.error("ERRO CRÍTICO: SHEET_ID não foi encontrado no arquivo .env.local");
        return [];
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 2. Agora é seguro fazer a chamada
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SHEET_ID,
            range: 'dados!A:G',
        });

        return response.data.values;
    } catch (error) {
        console.error("Erro ao buscar dados do Google Sheets:", error);
        return [];
    }
}