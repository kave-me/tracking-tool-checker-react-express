import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Check, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from '@/components/ui/sheet';

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  
  const navLinks = [
    { href: '/', label: 'Home', isActive: location === '/' },
    { href: '/#tool', label: 'Tag Checker', isActive: false },
    { href: '/blog', label: 'Blog', isActive: location === '/blog' || location.startsWith('/blog/') },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M9 4.5H7.5C5.84315 4.5 4.5 5.84315 4.5 7.5V16.5C4.5 18.1569 5.84315 19.5 7.5 19.5H16.5C18.1569 19.5 19.5 18.1569 19.5 16.5V15" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M9 14.25L12 17.25L19.5 9.75" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="ml-2 text-xl font-bold text-primary-900">Track to Measure</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    link.isActive 
                      ? "border-primary text-gray-900" 
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button size="default" asChild>
              <a href="#subscribe">Get Updates</a>
            </Button>
          </div>
          <div className="sm:hidden flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col gap-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M9 4.5H7.5C5.84315 4.5 4.5 5.84315 4.5 7.5V16.5C4.5 18.1569 5.84315 19.5 7.5 19.5H16.5C18.1569 19.5 19.5 18.1569 19.5 16.5V15" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round"
                        />
                        <path 
                          d="M9 14.25L12 17.25L19.5 9.75" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="ml-2 text-xl font-bold text-primary-900">Track to Measure</span>
                    </div>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                    </SheetClose>
                  </div>
                  <div className="space-y-3">
                    {navLinks.map((link) => (
                      <SheetClose key={link.href} asChild>
                        <Link
                          href={link.href}
                          className={cn(
                            "flex w-full items-center py-2 text-base font-medium pl-3 border-l-4",
                            link.isActive
                              ? "bg-primary-50 border-primary text-primary"
                              : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                          )}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                  <SheetClose asChild>
                    <Button className="w-full" asChild>
                      <a href="#subscribe">Get Updates</a>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
