import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function PromoSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-600 to-teal-900">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
            <div className="relative p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="max-w-md">
                <h3 className="text-2xl font-bold text-white sm:text-3xl">Summer Sale</h3>
                <p className="mt-2 text-lg text-white/90">Save up to 40% on selected items. Limited time offer.</p>
                <Button asChild className="mt-6 bg-white text-blue-600 hover:bg-white/90">
                  <a href="/deals">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-2/3 max-w-sm">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="Summer Sale"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-violet-800">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
            <div className="relative p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="max-w-md">
                <h3 className="text-2xl font-bold text-white sm:text-3xl">New Arrivals</h3>
                <p className="mt-2 text-lg text-white/90">
                  Discover the latest tech innovations. Be the first to experience the future.
                </p>
                <Button asChild className="mt-6 bg-white text-purple-600 hover:bg-white/90">
                  <a href="/new-arrivals">
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-2/3 max-w-sm">
              <Image
                src="/placeholder.svg?height=300&width=300"
                alt="New Arrivals"
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
