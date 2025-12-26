
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Zyra Home">
      <div className="rounded-lg bg-primary p-2">
        <LayoutGrid className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="hidden text-xl font-bold tracking-tight text-foreground sm:inline-block">
        Zyra
      </span>
    </Link>
  );
}
