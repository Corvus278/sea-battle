import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="size-full">
      <body className={`antialiased size-full`}>{children}</body>
    </html>
  );
}
