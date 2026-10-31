'use client';

import { useSyncExternalStore } from 'react';

/**
 * Alterna entre tema claro e escuro.
 *
 * O tema é apenas a classe `dark` no <html> (aplicada antes da pintura pelo
 * script em layout.tsx), então trocar de tema é uma operação de CSS: nenhum
 * dado é recarregado e nenhum componente do dashboard é recalculado.
 */

export const CHAVE_TEMA = 'tema';

function assinar(aoMudar: () => void) {
    const observador = new MutationObserver(aoMudar);
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observador.disconnect();
}

const lerTemaEscuro = () => document.documentElement.classList.contains('dark');
// No servidor o tema é desconhecido; o ícone só aparece após a hidratação.
const lerNoServidor = () => null;

export default function BotaoTema() {
    const escuro = useSyncExternalStore(assinar, lerTemaEscuro, lerNoServidor);

    const alternar = () => {
        const proximo = !document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark', proximo);
        try {
            localStorage.setItem(CHAVE_TEMA, proximo ? 'escuro' : 'claro');
        } catch {
            // Armazenamento indisponível (ex.: modo privado restrito): o tema vale só para esta sessão.
        }
    };

    const rotulo = escuro ? 'Ativar tema claro' : 'Ativar tema escuro';

    return (
        <button
            type="button"
            onClick={alternar}
            aria-label={rotulo}
            title={rotulo}
            className="ml-1 w-9 h-9 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
            {escuro === null ? (
                <span className="w-5 h-5" aria-hidden />
            ) : escuro ? (
                // Sol
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
            ) : (
                // Lua
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
            )}
        </button>
    );
}
