"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  X, 
  Home, 
  Package, 
  Tag, 
  LifeBuoy, 
  ChevronRight, 
  Baby, 
  Shirt, 
  Gamepad2, 
  BookOpen, 
  Heart, 
  Star, 
  Sparkles 
} from "lucide-react"
import { usePathname } from "next/navigation"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  onSearch?: (v: string) => void
  searchValue?: string
  searchResults?: any[]
  onResultClick?: () => void
}

export function MobileNav({ isOpen, onClose, onSearch, searchValue, searchResults, onResultClick }: MobileNavProps) {
  const [categories, setCategories] = React.useState<any[]>([])
  const pathname = usePathname()

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="flex flex-col w-full max-w-sm p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground h-5 w-5"><path d="M12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10A10 10 0 0 0 12 2Z"/><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/><path d="M12 12a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/></svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-primary">BRANA</span>
              <span className="text-xs font-medium text-muted-foreground leading-tight">KIDS</span>
            </div>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-4">
            <div className="space-y-1">
              <NavLink href="/" label="Home" icon={Home} isActive={isActive('/')} onClick={onClose} />

              <Accordion type="single" collapsible className="w-full border-none">
                <AccordionItem value="shop" className="border-none">
                  <AccordionTrigger className="py-3 px-4 rounded-lg hover:bg-accent text-base font-medium">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5" />
                      <span>Shop by Category</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 pt-1">
                    <div className="grid gap-1 pl-2">
                      {categories.map((category) => (
                        <NavLink
                          key={category._id || category.slug}
                          href={`/category/${category.slug}`}
                          label={category.name}
                          icon={getCategoryIcon(category.name)}
                          isActive={isActive(`/category/${category.slug}`)}
                          onClick={onClose}
                          showChevron
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <NavLink href="/deals" label="Deals" icon={Tag} isActive={isActive('/deals')} onClick={onClose} />
              <NavLink href="/products" label="All Products" icon={Package} isActive={isActive('/products')} onClick={onClose} />
              
              <Accordion type="single" collapsible className="w-full border-none">
                <AccordionItem value="support" className="border-none">
                  <AccordionTrigger className="py-3 px-4 rounded-lg hover:bg-accent text-base font-medium">
                    <div className="flex items-center gap-3">
                      <LifeBuoy className="h-5 w-5" />
                      <span>Support</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 pt-1">
                    <div className="grid gap-1 pl-2">
                      <NavLink href="/contact" label="Contact Us" isActive={isActive('/contact')} onClick={onClose} />
                      <NavLink href="/faq" label="FAQ" isActive={isActive('/faq')} onClick={onClose} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t mt-auto">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} BRANA KIDS • Let Your Kid Smile
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function NavLink({ href, label, icon: Icon, isActive, onClick, showChevron = false }: {
  href: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  isActive: boolean
  onClick: () => void
  showChevron?: boolean
}) {
  return (
    <Link 
      href={href} 
      onClick={onClick} 
      className={`flex items-center gap-3 py-3 px-4 rounded-lg text-base font-medium transition-colors ${
        isActive 
          ? 'bg-primary/10 text-primary' 
          : 'hover:bg-accent'
      }`}
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span>{label}</span>
      {showChevron && <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />}
      {isActive && !showChevron && <div className="ml-auto w-1.5 h-5 rounded-full bg-primary" />}
    </Link>
  )
}

function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase();
  const iconProps = { className: "h-5 w-5" };
  
  if (name.includes("baby")) return <Baby {...iconProps} />;
  if (name.includes("clothing")) return <Shirt {...iconProps} />;
  if (name.includes("toy")) return <Gamepad2 {...iconProps} />;
  if (name.includes("book")) return <BookOpen {...iconProps} />;
  if (name.includes("accessory")) return <Heart {...iconProps} />;
  if (name.includes("special")) return <Star {...iconProps} />;
  
  return <Sparkles {...iconProps} />;
}