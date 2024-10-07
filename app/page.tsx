'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatBubbleIcon, FileTextIcon, GearIcon } from "@radix-ui/react-icons"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <AnimatePresence>
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col min-h-screen"
        >
          <header className="px-4 lg:px-6 h-14 flex items-center">
            <Link className="flex items-center justify-center" href="#">
              <FileTextIcon className="h-6 w-6 mr-2" />
              <span className="font-bold">AeroContractReview</span>
            </Link>
            <nav className="ml-auto flex items-center gap-4 sm:gap-6">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </nav>
          </header>
          <main className="flex-1 flex flex-col">
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center">
              <div className="container px-4 md:px-6 max-w-5xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col items-center space-y-4 text-center"
                >
                  <motion.div 
                    animate={{ 
                      y: [0, -10, 0],
                      transition: {
                        y: {
                          repeat: Infinity,
                          duration: 5,
                          ease: "easeInOut",
                        }
                      }
                    }}
                    className="space-y-2"
                  >
                    <motion.h1 
                      className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      Revolutionize Your Aerospace Contract Reviews
                    </motion.h1>
                    <motion.p 
                      className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      Streamline your contract review process with our AI-powered platform tailored for the aerospace industry.
                    </motion.p>
                  </motion.div>
                  <motion.div 
                    className="space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <Button>Request Access</Button>
                    <Button variant="outline">Learn More</Button>
                  </motion.div>
                </motion.div>
              </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <div className="container px-4 md:px-6 max-w-5xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
                  Key Features
                </h2>
                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                  {[{
                    icon: <GearIcon className="h-12 w-12 mb-4 text-primary" />,
                    title: "Custom Review Criteria",
                    description: "Tailor your contract review process to your specific needs and industry standards.",
                  },
                  {
                    icon: <FileTextIcon className="h-12 w-12 mb-4 text-primary" />,
                    title: "Comprehensive Analysis",
                    description: "Get in-depth insights and analysis for every clause in your aerospace contracts.",
                  },
                  {
                    icon: <ChatBubbleIcon className="h-12 w-12 mb-4 text-primary" />,
                    title: "Document Chat",
                    description: "Interact with your contracts through our AI-powered chat interface for quick information retrieval.",
                  }].map((feature, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center text-center p-6 rounded-lg transition-all duration-300 ease-in-out ${
                        hoveredFeature === index
                          ? "transform -translate-y-2 shadow-lg bg-white dark:bg-gray-700"
                          : "bg-transparent"
                      }`}
                      onMouseEnter={() => setHoveredFeature(index)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      <div className={`transition-transform duration-300 ${
                        hoveredFeature === index ? "scale-110" : ""
                      }`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
              <div className="container px-4 md:px-6 max-w-5xl">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Ready to Transform Your Contract Review Process?
                    </h2>
                    <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                      Request access to our exclusive platform and experience the future of aerospace contract reviews.
                    </p>
                  </div>
                  <div className="w-full max-w-sm space-y-2">
                    <form className="flex space-x-2">
                      <Input
                        className="max-w-lg flex-1"
                        placeholder="Enter your work email"
                        type="email"
                      />
                      <Button type="submit">Request Access</Button>
                    </form>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      By requesting access, you agree to our terms of service and privacy policy.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2024 AeroContractReview. All rights reserved.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link className="text-xs hover:underline underline-offset-4" href="#">
                Terms of Service
              </Link>
              <Link className="text-xs hover:underline underline-offset-4" href="#">
                Privacy
              </Link>
            </nav>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  )
}