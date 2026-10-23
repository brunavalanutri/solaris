import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'SOLARIS • Sua jornada de cuidado',description:'Metabolismo, hábitos e resultados. Acompanhamento integrado Solaris.'};
export default function Layout({children}: {children:React.ReactNode}) {return <html lang="pt-BR"><body>{children}</body></html>}
