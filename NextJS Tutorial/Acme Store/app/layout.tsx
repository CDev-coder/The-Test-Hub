import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* MAIN layout.tsx acts as the body element */}
      <body className={`${inter.className} antialiased`} id="Main_layout.tsx">
        {children}
      </body>
    </html>
  );
}
