'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Code2, 
  Server, 
  Palette, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Zap,
  Target,
  Rocket,
  MessageSquare,
  Send,
  Loader2,
  Shield,
  Lock,
  LogOut,
  UserRound
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

// Navigation Component
function Navbar() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [credentials, setCredentials] = useState({ username: '', password: '' })

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoggingIn(true)
    setLoginError(null)

    try {
      const response = await signIn('credentials', {
        redirect: false,
        username: credentials.username,
        password: credentials.password,
      })

      if (!response?.ok) {
        setLoginError('Invalid username or password.')
        return
      }

      await update()
      setIsLoginOpen(false)
      setCredentials({ username: '', password: '' })
      router.refresh()
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    await update()
    router.refresh()
  }

  const navLinks = [
    { href: '#work', label: 'Work' },
    { href: '#philosophy', label: 'Philosophy' },
    { href: '#process', label: 'Process' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/75 backdrop-blur-2xl border-b border-border/60 shadow-[0_10px_40px_rgba(0,0,0,0.35)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          <motion.a
            href="#"
            className="flex items-center gap-3 text-lg sm:text-xl font-bold tracking-tight"
            whileHover={{ scale: 1.02 }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background/80 shadow-lg shadow-black/20 overflow-hidden">
              <img src="/icon.svg" alt="Logo" className="h-8 w-8" />
            </span>
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
              SK.Shafi Masthan Koushik
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/80"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {link.label}
              </motion.a>
            ))}
            {status === 'authenticated' && (
              <motion.a
                href="/admin/bookings"
                className="ml-2 inline-flex items-center gap-2 rounded-lg border border-border/70 bg-primary/10 px-4 py-2 text-sm font-medium text-foreground hover:bg-primary/15 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Shield className="h-4 w-4" />
                Admin
              </motion.a>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {status === 'authenticated' ? (
              <>
                <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground">
                  <UserRound className="h-3.5 w-3.5" />
                  {session?.user?.name ?? 'shafi'}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="hidden sm:inline-flex gap-2">
                    <Lock className="h-4 w-4" />
                    Login
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[420px] bg-background/95 backdrop-blur-xl border-border/70">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Login</DialogTitle>
                    <DialogDescription>
                      Use username shafi and password 1234.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4 mt-4" onSubmit={handleLogin}>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={credentials.username}
                        onChange={(event) => setCredentials((prev) => ({ ...prev, username: event.target.value }))}
                        placeholder="shafi"
                        autoComplete="username"
                        className="bg-background/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={credentials.password}
                        onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                        placeholder="1234"
                        autoComplete="current-password"
                        className="bg-background/80"
                      />
                    </div>
                    {loginError && <p className="text-sm text-destructive">{loginError}</p>}
                    <Button type="submit" className="w-full gap-2" disabled={isLoggingIn}>
                      <Lock className="h-4 w-4" />
                      {isLoggingIn ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg border border-border/60 bg-background/70 hover:bg-accent/80 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-2 border-t border-border/60 mt-2 space-y-2">
                  {status === 'authenticated' ? (
                    <>
                      <a
                        href="/admin/bookings"
                        className="block px-4 py-3 text-sm font-medium rounded-lg border border-border/60 bg-primary/10 text-foreground"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin
                      </a>
                      <button
                        type="button"
                        className="w-full px-4 py-3 text-sm font-medium text-left rounded-lg hover:bg-accent/80 transition-colors"
                        onClick={() => {
                          handleLogout()
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="w-full px-4 py-3 text-sm font-medium text-left rounded-lg hover:bg-accent/80 transition-colors"
                      onClick={() => {
                        setIsLoginOpen(true)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_28%),linear-gradient(135deg,rgba(7,7,10,1)_0%,rgba(12,12,16,1)_45%,rgba(18,18,24,1)_100%)]" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium bg-white/10 text-white border-white/10">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              CSE Student & Developer
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white"
          >
            <span className="block">Developer &</span>
            <span className="block mt-2 bg-gradient-to-r from-white via-white/85 to-white/60 bg-clip-text text-transparent">
              Tech Enthusiast
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10"
          >
            I develop efficient, scalable software solutions and optimize performance for modern applications. 
            Passionate about creating impactful technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <BookingModal>
              <Button size="lg" className="gap-2 min-w-[160px]">
                <Phone className="w-4 h-4" />
                Book a Call
              </Button>
            </BookingModal>
            <Button size="lg" variant="outline" className="gap-2 min-w-[160px] border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white" asChild>
              <a href="#work">
                View Work
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-white/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Work/Projects Section
function WorkSection() {
  const projects = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: 'Front-End Development',
      description: 'Modern, responsive user interfaces built with React, Next.js, and cutting-edge web technologies. Focus on performance and accessibility.',
      tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      gradient: 'from-emerald-500/10 to-teal-500/10'
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: 'Back-End Development',
      description: 'Robust REST APIs and server architectures with scalable design patterns. Efficient data handling and optimized database operations.',
      tags: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'],
      gradient: 'from-orange-500/10 to-amber-500/10'
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Creative Projects',
      description: '3D modeling, visualization work, and creative coding experiments. Exploring the intersection of technology and art.',
      tags: ['Blender', 'Three.js', 'WebGL', 'Creative Coding'],
      gradient: 'from-violet-500/10 to-purple-500/10'
    },
  ]

  return (
    <section id="work" className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">Portfolio</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Selected Work</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of projects showcasing my expertise in software development
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`h-full bg-gradient-to-br ${project.gradient} border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg group`}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {project.icon}
                  </div>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground mb-4">
                    {project.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Philosophy Section
function PhilosophySection() {
  return (
    <section id="philosophy" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <Badge variant="outline" className="mb-4">Philosophy</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-12">My Philosophy</h2>
          
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -top-8 -left-4 text-8xl text-primary/10 font-serif">&ldquo;</div>
            <p className="text-xl sm:text-2xl md:text-3xl font-medium leading-relaxed text-foreground/90 italic">
              Sometimes the answer lies beyond your current field of vision. 
              Shift your perspective, and you may discover what was hidden in plain sight.
            </p>
            <div className="absolute -bottom-8 -right-4 text-8xl text-primary/10 font-serif">&rdquo;</div>
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  )
}

// Process Section
function ProcessSection() {
  const steps = [
    {
      number: '01',
      icon: <Target className="w-5 h-5" />,
      title: 'Discover the Problem',
      description: 'Deep dive into requirements and understand user needs through research and analysis.'
    },
    {
      number: '02',
      icon: <Zap className="w-5 h-5" />,
      title: 'Plan & Strategize',
      description: 'Architecture and technical planning for optimal results and scalable solutions.'
    },
    {
      number: '03',
      icon: <Code2 className="w-5 h-5" />,
      title: 'Design & Prototype',
      description: 'Create prototypes and validate concepts with stakeholders iteratively.'
    },
    {
      number: '04',
      icon: <Rocket className="w-5 h-5" />,
      title: 'Optimize & Launch',
      description: 'Performance tuning, testing, and production deployment with monitoring.'
    },
    {
      number: '05',
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'Review & Refine',
      description: 'Gather feedback and implement continuous improvements based on real usage.'
    },
  ]

  return (
    <section id="process" className="py-24 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">Workflow</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">My Process</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A systematic approach to building exceptional software
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          <div className="space-y-8 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative lg:flex lg:items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'}`}>
                  <Card className="bg-background border-border/50 hover:border-border transition-colors">
                    <CardContent className="p-6">
                      <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                        <span className="text-2xl font-bold text-primary/60">{step.number}</span>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {step.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Timeline dot */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Skills Section
function SkillsSection() {
  const softSkills = [
    { name: 'Communication', description: 'Explaining complex technical concepts clearly and practically.' },
    { name: 'Collaboration', description: 'Fostering teamwork and peer mentorship in HackOps club.' },
    { name: 'Adaptability', description: 'Quickly learning and applying new tools and workflows.' },
    { name: 'Problem-Solving', description: 'Resourceful in finding efficient, real-world solutions.' },
    { name: 'Confidence', description: 'Energized and proud when achieving smooth performance.' },
    { name: 'Organization', description: 'Structured, modular approach to tasks and explanations.' },
  ]

  const strengths = [
    { name: 'Technical Savvy', description: 'Deep understanding and optimization of systems.' },
    { name: 'Practical Focus', description: 'Prioritizing real-world performance over theoretical specs.' },
    { name: 'Efficiency', description: 'Optimizing code usage and benchmarking workflows.' },
    { name: 'Peer Engagement', description: 'Sharing insights and motivating others through demos.' },
    { name: 'Creativity', description: 'Brainstorming solutions and exploring future industry trends.' },
    { name: 'Resilience', description: 'Thriving under constraints and finding actionable results.' },
  ]

  return (
    <section id="skills" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">Expertise</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Soft Skills & Strengths</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A practical blend of communication, execution, and technical decision-making
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Soft Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full bg-gradient-to-br from-primary/5 to-transparent border-border/50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Soft Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {softSkills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="p-4 rounded-xl bg-background/50 border border-border/30 hover:border-border transition-colors"
                    >
                      <h4 className="font-semibold mb-1">{skill.name}</h4>
                      <p className="text-sm text-muted-foreground">{skill.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full bg-gradient-to-bl from-accent/10 to-transparent border-border/50">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {strengths.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="p-4 rounded-xl bg-background/50 border border-border/30 hover:border-border transition-colors"
                    >
                      <h4 className="font-semibold mb-1">{skill.name}</h4>
                      <p className="text-sm text-muted-foreground">{skill.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Booking Modal Component
function BookingModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    reason: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          location: formData.address,
          reason: formData.reason,
        }),
      })

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null)
        const message = errorResponse?.error ?? 'Failed to submit booking. Please try again.'
        setSubmitError(message)
        return
      }

      setIsSuccess(true)
    } catch {
      setSubmitError('Failed to submit booking. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    // Reset state after animation
    setTimeout(() => {
      setIsSuccess(false)
      setSubmitError(null)
      setFormData({ name: '', email: '', address: '', reason: '' })
    }, 200)
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) handleClose()
      else setOpen(true)
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-xl border-border/70">
        {isSuccess ? (
          <div className="py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
            >
              <motion.svg
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DialogTitle className="text-2xl mb-2">Booking Confirmed!</DialogTitle>
              <DialogDescription className="text-base mb-6">
                Thank you, <span className="font-medium text-foreground">{formData.name}</span>! 
                <br />
                I&apos;ll get back to you at <span className="font-medium text-foreground">{formData.email}</span> soon.
              </DialogDescription>
              <Button onClick={handleClose} className="gap-2">
                <Sparkles className="w-4 h-4" />
                Done
              </Button>
            </motion.div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Book a Call</DialogTitle>
              <DialogDescription>
                Fill out the form below and I&apos;ll get back to you as soon as possible.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Location</Label>
                <Input
                  id="address"
                  placeholder="City, Country"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Contact</Label>
                <Textarea
                  id="reason"
                  placeholder="Tell me about your project or inquiry..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              {submitError && (
                <p className="text-sm text-destructive">{submitError}</p>
              )}
              <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Booking
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Contact Section
function ContactSection() {
  return (
    <section id="contact" className="py-24 sm:py-32 bg-white/[0.03]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <Badge variant="outline" className="mb-4">Connect</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Let&apos;s Build Something Exceptional
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
            Have a project in mind or just want to chat? I&apos;m always open to discussing new opportunities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="gap-2" asChild>
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=91-8142726417.830@zohomail.in" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Mail className="w-4 h-4" />
                Get In Touch
              </a>
            </Button>
            <BookingModal>
              <Button size="lg" variant="outline" className="gap-2">
                <Phone className="w-4 h-4" />
                Book a Call
              </Button>
            </BookingModal>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4">
            {[
              { icon: <Github className="w-5 h-5" />, href: 'https://github.com/KNKDark', label: 'GitHub' },
              { icon: <Linkedin className="w-5 h-5" />, href: 'https://www.linkedin.com/in/shafi-masthan-koushik-shaik-b79ba7356', label: 'LinkedIn' },
              {
                icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.633 7.584H.48l8.6-9.83L0 1.154h7.594l5.243 6.932L18.9 1.153Zm-1.29 19.495h2.04L6.486 3.24H4.298L17.61 20.648Z" />
                  </svg>
                ),
                href: 'https://x.com/shafi_2340',
                label: 'X'
              },
              { icon: <Mail className="w-5 h-5" />, href: 'https://mail.google.com/mail/?view=cm&fs=1&to=91-8142726417.830@zohomail.in', label: 'Email' },
            ].map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
function Footer({ className }: { className?: string }) {
  return (
    <footer className={`py-8 border-t border-border/50 ${className || ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SK.Shafi Masthan Koushik. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#work" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Work
            </a>
            <a href="#skills" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Skills
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main Page Component
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <WorkSection />
      <PhilosophySection />
      <ProcessSection />
      <SkillsSection />
      <ContactSection />
      <Footer className="mt-auto" />
    </main>
  )
}
