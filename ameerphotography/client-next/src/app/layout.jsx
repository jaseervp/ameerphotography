import './globals.css';
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Ameer Photography | Best Wedding Photographers in Kerala',
  description: 'Ameer Photography offers professional wedding photography and cinematic videography in Kerala. Specializing in Muslim wedding photography and creating timeless memories.',
  colorScheme: 'light',
  openGraph: {
    title: 'Ameer Photography | Best Wedding Photographers in Kerala',
    description: 'Ameer Photography offers professional wedding photography and cinematic videography in Kerala.',
    url: 'https://ameerphotography.in/',
    siteName: 'Ameer Photography',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ameer Photography',
    description: 'Ameer Photography offers professional wedding photography and cinematic videography in Kerala.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <body className="antialiased transition-colors duration-500 ease-out bg-base text-primary font-body">
        <AuthProvider>
          <Toaster position="top-right" expand={false} richColors />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
