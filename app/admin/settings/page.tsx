"use client"

import { Button } from "@/components/ui/button"
import { Settings2, Palette, ShieldCheck, Sparkles, Zap } from "lucide-react"

export default function SettingsUpgradePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-10 bg-gradient-to-br from-primary/10 to-background rounded-2xl shadow-2xl p-10">
      <div className="flex flex-col items-center gap-4">
        <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-500 p-6 shadow-lg mb-2">
          <Sparkles className="h-12 w-12 text-white drop-shadow-lg" />
        </span>
        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text tracking-tight leading-tight">Unlock Advanced Settings</h1>
        <p className="text-xl text-muted-foreground mb-4 font-medium">Upgrade your plan to access <span className="font-bold text-primary">advanced customization</span>, integrations, and security features. <br />Take full control of your store's experience and settings.</p>
        <Button size="lg" className="text-lg px-10 py-4 font-bold shadow-2xl bg-gradient-to-r from-primary to-blue-500 hover:from-blue-500 hover:to-primary transition rounded-full uppercase tracking-wider">Upgrade Now</Button>
      </div>
      <div className="flex flex-wrap justify-center gap-8 mt-8">
        <div className="bg-white/90 dark:bg-card/90 rounded-2xl p-8 shadow-xl w-72 flex flex-col items-center gap-3 border border-primary/10 hover:scale-105 transition-transform">
          <Zap className="h-10 w-10 text-primary mb-2" />
          <h2 className="text-2xl font-bold mb-1 text-primary">Custom Integrations</h2>
          <p className="text-base text-muted-foreground">Connect with third-party apps and automate your workflows.</p>
        </div>
        <div className="bg-white/90 dark:bg-card/90 rounded-2xl p-8 shadow-xl w-72 flex flex-col items-center gap-3 border border-primary/10 hover:scale-105 transition-transform">
          <Palette className="h-10 w-10 text-blue-500 mb-2" />
          <h2 className="text-2xl font-bold mb-1 text-blue-500">Brand Customization</h2>
          <p className="text-base text-muted-foreground">Personalize your store's look, feel, and domain.</p>
        </div>
        <div className="bg-white/90 dark:bg-card/90 rounded-2xl p-8 shadow-xl w-72 flex flex-col items-center gap-3 border border-primary/10 hover:scale-105 transition-transform">
          <ShieldCheck className="h-10 w-10 text-green-500 mb-2" />
          <h2 className="text-2xl font-bold mb-1 text-green-500">Enhanced Security</h2>
          <p className="text-base text-muted-foreground">Access advanced security settings and audit logs.</p>
        </div>
      </div>
    </div>
  )
} 