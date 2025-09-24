import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="size-full">
      <head>
        <meta name="theme-color" content="#1c1917" />
        <title>Морской boy</title>
      </head>
      <body className={`antialiased size-full`}>{children}</body>
    </html>
  );
}
