import Link from 'next/link';
import Logo from '@/components/shared/Logo';

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              A unified ecosystem for all your digital products and services.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-3">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Products</h4>
              <nav className="flex flex-col gap-2">
                <Link href="/products/nexus-flow" className="text-sm text-muted-foreground hover:text-foreground">NexusFlow</Link>
                <Link href="/products/pixel-forge" className="text-sm text-muted-foreground hover:text-foreground">PixelForge</Link>
                <Link href="/products/data-sphere" className="text-sm text-muted-foreground hover:text-foreground">DataSphere</Link>
                <Link href="/products/connect-iq" className="text-sm text-muted-foreground hover:text-foreground">ConnectIQ</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Company</h4>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Synergy Digital Suite. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
