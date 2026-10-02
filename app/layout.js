import './styles.css';

export const metadata = {
  title: 'Auto Market Analyzer',
  description: 'Prosty MVP do obserwowania rynku samochodów'
};

export default function RootLayout({ children }) {
  return <html lang="pl"><body>{children}</body></html>;
}
