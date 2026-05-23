import "./globals.css";

export const metadata = {
  title: "Sosial Media Fake Generator",
  description: "Bikin fake chat buat seru-seruan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      {/* Tambahin class font-sans di sini biar narik settingan Tailwind */}
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}