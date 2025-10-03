import { 
  Laptop, Smartphone, Headphones, Camera, Watch, Tv, 
  Monitor, Mouse, Keyboard, Speaker, Printer, Router, Server, 
  GamepadIcon, Battery, Bluetooth, Wifi, Cloud, Database, 
  ShoppingBag, Package, Box, Gift, Tag, Star 
} from "lucide-react"

// Create a mapping of icon names to their components
export const iconComponents = {
  Laptop,
  Smartphone,
  Headphones,
  Camera,
  Watch,
  Tv,
  Monitor,
  Mouse,
  Keyboard,
  Speaker,
  Printer,
  Router,
  Server,
  GamepadIcon,
  Battery,
  Bluetooth,
  Wifi,
  Cloud,
  Database,
  ShoppingBag,
  Package,
  Box,
  Gift,
  Tag,
  Star
}

export const renderIcon = (iconName: string, className = "h-6 w-6") => {
  const IconComponent = iconComponents[iconName as keyof typeof iconComponents]
  return IconComponent ? <IconComponent className={className} /> : null
} 