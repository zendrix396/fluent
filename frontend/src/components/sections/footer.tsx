import Link from "next/link";
import { Linkedin, Slack } from "@/icons/lucide";

const XIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 fill-current"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

const Footer = () => {
    
    return (
        <footer className="bg-background">
            <div className="container py-24">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <Link href="/">
                            <div className="text-2xl font-bold text-white">
                                Fluent
                            </div>
                        </Link>

                        <p className="mt-6 max-w-[320px] text-sm text-text-secondary leading-6">
                            Fluent transforms your raw data into mathematical insights and publication-ready visualizations with LaTeX export capabilities.
                        </p>

                        <div className="mt-8 flex items-center gap-5">
                            <Link href="#" className="text-text-secondary hover:text-white transition-colors">
                                <span className="sr-only">X</span>
                                <XIcon />
                            </Link>

                            <Link href="#" className="text-text-secondary hover:text-white transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin className="h-5 w-5" />
                            </Link>

                            <Link href="#" className="text-text-secondary hover:text-white transition-colors">
                                <span className="sr-only">Slack</span>
                                <Slack className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-2 gap-8 sm:grid-cols-3">
                        <div>
                            <p className="text-sm font-semibold text-white">Product</p>
                            <ul className="mt-6 space-y-4 text-sm">
                                <li><Link href="#" className="text-text-secondary hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="#" className="text-text-secondary hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="#" className="text-text-secondary hover:text-white transition-colors">API Reference</Link></li>
                                <li><Link href="#" className="text-text-secondary hover:text-white transition-colors">Documentation</Link></li>
                                <li><Link href="#" className="text-text-secondary hover:text-white transition-colors">Tutorials</Link></li>
                                <li><Link href="#" className="text-text-secondary hover:text-white transition-colors">Examples</Link></li>
                            </ul>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-white">Legal</p>
                            <ul className="mt-6 space-y-4 text-sm">
                                <li><Link href="#" className="text-text-secondary hover:text-white transition-colors">Terms of Service</Link></li>
                                <li><Link href="#" className="text-text-secondary hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="#" className="text-text-secondary hover:text-white transition-colors">Data Security</Link></li>
                                <li><Link href="#" className="text-text-secondary hover:text-white transition-colors">Academic License</Link></li>
                            </ul>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-white">Resources</p>
                            <ul className="mt-6 space-y-4 text-sm">
                                <li><Link href="#" className="text-text-secondary hover:text-white transition-colors">Research</Link></li>
                                <li><Link href="#" className="text-text-secondary hover:text-white transition-colors">Academic</Link></li>
                                <li><Link href="#" className="text-text-secondary hover:text-white transition-colors">Business Analytics</Link></li>
                                <li><Link href="#" className="text-text-secondary hover:text-white transition-colors">Support</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-border pt-8 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-text-muted">
                        Copyright © 2025 Fluent. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2.5">
                        <div className="h-2 w-2 rounded-full bg-success"></div>
                        <p className="text-sm text-text-muted">All systems operational</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;