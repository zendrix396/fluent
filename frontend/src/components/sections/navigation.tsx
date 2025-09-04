import Link from 'next/link';
import {
  FlaskConical,
  TrendingUp,
  Calculator,
  Atom,
  FileText,
  PlayCircle,
  Database,
  Newspaper,
  Code,
} from '@/icons/lucide';

const Navigation = () => {
  const solutionsLinks = [
    { href: '/solutions/research', icon: FlaskConical, label: 'Research & Academia' },
    { href: '/solutions/business', icon: TrendingUp, label: 'Business Analytics' },
    { href: '/solutions/finance', icon: Calculator, label: 'Financial Modeling' },
    { href: '/solutions/science', icon: Atom, label: 'Scientific Computing' },
  ];

  const resourcesLinks = [
    { href: '/docs', icon: FileText, label: 'Documentation' },
    { href: '/tutorials', icon: PlayCircle, label: 'Tutorials' },
    { href: '/examples', icon: Database, label: 'Examples' },
    { href: '/blog', icon: Newspaper, label: 'Blog' },
    { href: '/api', icon: Code, label: 'API Reference' },
  ];

  const DropdownLink = ({ href, icon: Icon, label, external = false }: { href: string; icon?: React.ComponentType<{ className?: string }>; label: string; external?: boolean }) => {
    const linkContent = (
      <>
        <span className="relative z-10 flex h-3.5 w-3.5 shrink-0 items-center justify-center">
            {Icon && <Icon className="h-full w-full" />}
        </span>
        <span className="relative z-10 truncate -tracking-[0.01em]">{label}</span>
        <span className="absolute inset-0 rounded bg-[#18181C] opacity-0 transition-opacity duration-200 group-hover/link:opacity-100 group-focus-visible/link:opacity-100"></span>
      </>
    );

    const classNames = "text-gray-400 hover:text-white group/link relative flex items-center gap-2 overflow-hidden px-2 py-1 text-[14px] transition-colors duration-200 focus-visible:text-white";

    if (external) {
      return (
        <li>
          <a href={href} target="_blank" rel="noopener noreferrer" className={classNames}>
            {linkContent}
          </a>
        </li>
      );
    }

    return (
      <li>
        <Link href={href} className={classNames}>
          {linkContent}
        </Link>
      </li>
    );
  };

  return (
    <header className="absolute left-0 right-0 top-0 z-50 h-14 bg-background/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6" aria-label="Global">
        <div className="relative shrink-0">
          <Link href="/" className="transition-colors duration-200 flex cursor-pointer select-none py-5">
            <div className="text-2xl font-bold text-white">Fluent</div>
          </Link>
        </div>
        <ul className="flex translate-x-8 gap-x-2 md:hidden">
          <li>
            <Link className="flex items-center px-2.5 py-4 text-[15px] tracking-tight text-white transition-colors duration-200 hover:text-gray-400 focus-visible:text-gray-400" href="/pricing">
              Pricing
            </Link>
          </li>
          <li className="group relative">
            <button className="peer flex items-center gap-x-2 px-2.5 py-4 text-[15px] tracking-tight text-white group-hover:text-gray-400 group-has-[:focus-visible]:text-gray-400">
              Solutions
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="relative top-px shrink-0 rotate-90" aria-hidden="true">
                <path d="m1 1 4 4-4 4" stroke="#AFB1B6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="pointer-events-none absolute -left-1 top-[47px] origin-top-left opacity-0 transition-[opacity,transform] duration-200 [transform:rotateX(-12deg)_scale(0.9)] group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:[transform:none] peer-focus-visible:pointer-events-auto peer-focus-visible:visible peer-focus-visible:opacity-100 peer-focus-visible:[transform:none] has-[:focus-visible]:pointer-events-auto has-[:focus-visible]:visible has-[:focus-visible]:opacity-100 has-[:focus-visible]:[transform:none]">
              <ul className="relative flex min-w-[180px] flex-col gap-y-[5px] rounded-[10px] border border-[#1C1C21] bg-[#0F0F11] p-2">
                {solutionsLinks.map((link) => (
                  <DropdownLink key={link.href} {...link} />
                ))}
              </ul>
            </div>
          </li>
          <li className="group relative">
            <button className="peer flex items-center gap-x-2 px-2.5 py-4 text-[15px] tracking-tight text-white group-hover:text-gray-400 group-has-[:focus-visible]:text-gray-400">
              Resources
              <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="relative top-px shrink-0 rotate-90" aria-hidden="true">
                <path d="m1 1 4 4-4 4" stroke="#AFB1B6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="pointer-events-none absolute -left-1 top-[47px] origin-top-left opacity-0 transition-[opacity,transform] duration-200 [transform:rotateX(-12deg)_scale(0.9)] group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-hover:[transform:none] peer-focus-visible:pointer-events-auto peer-focus-visible:visible peer-focus-visible:opacity-100 peer-focus-visible:[transform:none] has-[:focus-visible]:pointer-events-auto has-[:focus-visible]:visible has-[:focus-visible]:opacity-100 has-[:focus-visible]:[transform:none]">
              <ul className="relative flex min-w-[156px] flex-col gap-y-[5px] rounded-[10px] border border-[#1C1C21] bg-[#0F0F11] p-2">
                {resourcesLinks.map((link) => (
                  <DropdownLink key={link.href} {...link} />
                ))}
              </ul>
            </div>
          </li>
        </ul>
        <div className="flex items-center gap-x-7 md:hidden">
          <Link className="py-1 text-[15px] font-medium tracking-tight text-white transition-colors duration-200 hover:text-gray-400 focus-visible:text-gray-400" href="/login">
            Log In
          </Link>
          <Link className="group relative inline-flex h-8 items-center justify-center rounded-md bg-white px-4 text-[14px] font-semibold tracking-tight text-black outline-none transition-colors duration-300 hover:bg-gray-200 focus-visible:bg-gray-200" href="/signup">
            Sign Up
          </Link>
        </div>
        <button className="relative hidden md:block" aria-label="Open menu">
          <div className="absolute -inset-4 sm:-inset-2.5"></div>
          <span className="relative block h-6 w-6">
            <span className="absolute right-0 top-[3px] block h-0.5 w-6 rounded-full bg-white transition-colors duration-200"></span>
            <span className="absolute right-0 top-[11px] block h-0.5 w-6 rounded-full bg-white transition-colors duration-200"></span>
            <span className="absolute bottom-[3px] right-0 block h-0.5 w-6 rounded-full bg-white transition-colors duration-200"></span>
          </span>
        </button>
      </nav>
    </header>
  );
};

export default Navigation;