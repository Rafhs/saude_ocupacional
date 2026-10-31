import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saúde Ocupacional | Dashboard",
  description: "Gestão inteligente de exames ocupacionais, vencimentos e encaminhamentos.",
};

/**
 * Aplica o tema salvo (ou o do sistema operacional) antes da primeira pintura,
 * evitando o "flash" de tema claro. A chave 'tema' é a mesma usada em BotaoTema.
 */
const scriptTema = `(function(){try{var t=localStorage.getItem('tema');var e=t?t==='escuro':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',e);}catch(_){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
