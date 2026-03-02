import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FormCraft — Beautiful Form Builder',
  description: 'Build Typeform-style forms with 10 field types, conditional logic, and submission tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
