"use client"

import * as React from "react"
import Link from "next/link"
import { cn, formatCurrency } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { 
  Baby, 
  Shirt, 
  Gamepad2, 
  BookOpen, 
  Heart, 
  Star, 
  HelpCircle, 
  ChevronRight, 
  LifeBuoy, 
  Sparkles, 
  Tag,
  Package
} from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function MainNav({ onSearch, searchValue, searchResults, onResultClick }: { 
  onSearch?: (v: string) => void, 
  searchValue?: string, 
  searchResults?: any[], 
  onResultClick?: () => void 
}) {
  const [categories, setCategories] = useState<{ name: string; slug: string; description: string }[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        setCategories(data.map((cat: any) => ({ name: cat.name, slug: cat.slug, description: cat.description || "" })))
      } catch (error) {
        // Optionally handle error
      }
    }
    fetchCategories()
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-base font-medium h-10 px-4 py-2 hover:bg-accent/80">
            Shop
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[550px] p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground px-3">Categories</h4>
                  {categories.slice(0, 4).map((category) => (
                    <CategoryLink key={category.slug} category={category} />
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground px-3">More Categories</h4>
                  {categories.slice(4, 8).map((category) => (
                    <CategoryLink key={category.slug} category={category} />
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link
                  href="/products"
                  className="flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-primary/10 text-primary font-semibold"
                >
                  <span>View All Products</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/deals" legacyBehavior passHref>
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent text-base font-medium h-10 px-4 py-2 hover:bg-accent/80",
              isActive("/deals") && "bg-accent text-accent-foreground"
            )}>
              <Tag className="h-4 w-4 mr-2" /> Deals
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/products" legacyBehavior passHref>
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent text-base font-medium h-10 px-4 py-2 hover:bg-accent/80",
              isActive("/products") && "bg-accent text-accent-foreground"
            )}>
              <Package className="h-4 w-4 mr-2" /> All Products
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-base font-medium h-10 px-4 py-2 hover:bg-accent/80">
            Support
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="w-[350px] p-3 space-y-1">
              <SupportLink href="/contact" icon={HelpCircle} title="Contact Us" description="Get in touch with our team" />
              <SupportLink href="/faq" icon={LifeBuoy} title="FAQ & Support" description="Find answers to common questions" />
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function getCategoryIcon(categoryName: string) {
  const name = categoryName.toLowerCase();
  const iconProps = { className: "h-5 w-5 text-primary shrink-0" };
  
  if (name.includes("baby")) return <Baby {...iconProps} />;
  if (name.includes("clothing")) return <Shirt {...iconProps} />;
  if (name.includes("toy")) return <Gamepad2 {...iconProps} />;
  if (name.includes("book")) return <BookOpen {...iconProps} />;
  if (name.includes("accessory")) return <Heart {...iconProps} />;
  if (name.includes("special")) return <Star {...iconProps} />;
  
  return <Sparkles {...iconProps} />;
}

const CategoryLink = ({ category }: { category: { name: string, slug: string, description: string } }) => (
  <Link 
    href={`/category/${category.slug}`} 
    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-primary/10 focus:bg-primary/10"
  >
    {getCategoryIcon(category.name)}
    <div className="flex flex-col">
      <span className="text-base font-medium text-foreground">{category.name}</span>
      <span className="text-xs text-muted-foreground line-clamp-1">{category.description}</span>
    </div>
  </Link>
)

const SupportLink = ({ href, icon: Icon, title, description }: { 
  href: string, 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <Link 
    href={href} 
    className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-primary/10 focus:bg-primary/10"
  >
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mt-0.5">
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex flex-col">
      <span className="text-base font-medium text-foreground">{title}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </div>
  </Link>
)