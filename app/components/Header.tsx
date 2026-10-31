'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BotaoTema from './BotaoTema';

export default function Header() {
    const pathname = usePathname();
    const isEncaminhamentos = pathname === '/encaminhamentos';

    return (
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm mb-8 sticky top-0 z-10">
            <div className="max-w-[95%] 2xl:max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">

                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isEncaminhamentos ? 'bg-amber-500' : 'bg-indigo-600'}`}>
            <span className="text-white font-bold text-xl leading-none">
              {isEncaminhamentos ? '!' : 'S'}
            </span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                        {isEncaminhamentos ? (
                            <>Central de <span className="text-amber-500 font-black">Encaminhamentos</span></>
                        ) : (
                            <>Saúde <span className="text-indigo-600 dark:text-indigo-400 font-black">Ocupacional</span></>
                        )}
                    </h1>
                </div>

                <nav className="flex items-center gap-2">
                    <Link
                        href="/"
                        className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                            !isEncaminhamentos
                                ? 'font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10'
                                : 'font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/encaminhamentos"
                        className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                            isEncaminhamentos
                                ? 'font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'
                                : 'font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                    >
                        Encaminhamentos
                    </Link>
                    <BotaoTema />
                </nav>

            </div>
        </header>
    );
}