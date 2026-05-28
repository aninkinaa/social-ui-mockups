import "./globals.css";

export const metadata = {
  title: 'SocialUI | Pixel-Perfect Social Media Mockups',
  description: 'Generate hyper-realistic social media mockups in seconds. Lightning fast, completely free, and runs entirely in your browser.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}