import "./globals.css";

export const metadata = {
  title: "Technical-to-Buyer Translator | Ashley Pola",
  description:
    "Hold one technical fact constant, translate it into value-prop copy for different buyers — without losing what's actually true.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Technical-to-Buyer Translator",
    description:
      "Hold one technical fact constant, translate it into value-prop copy for different buyers — without losing what's actually true.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=neue-montreal@400,500,600,700&f[]=switzer@400,500,600,700,400i,500i&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
