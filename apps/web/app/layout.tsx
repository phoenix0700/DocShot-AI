import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

// Enable Clerk only when keys are present (prod). In local dev without keys we skip it.
const enableClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export const metadata: Metadata = {
  title: 'DocShot AI',
  description: 'Automated screenshot capture and updates for documentation',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const content = (
    <html lang="en">
      <body>{children}</body>
    </html>
  );

  return enableClerk ? <ClerkProvider>{content}</ClerkProvider> : content;
}
