import { useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, Stars } from '@react-three/drei'
import {
  FaArrowRight,
  FaArrowUp,
  FaBars,
  FaCertificate,
  FaChevronRight,
  FaCode,
  FaDownload,
  FaEnvelope,
  FaGithub,
  FaGraduationCap,
  FaKeyboard,
  FaLinkedin,
  FaMagic,
  FaMoon,
  FaPlay,
  FaRocket,
  FaSearch,
  FaServer,
  FaSun,
  FaTerminal,
  FaTimes,
} from 'react-icons/fa'
import {

  SiCss,
  SiDotnet,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiPostman,
  SiReact,
  SiSharp,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Lenis from 'lenis'
import emailjs from 'emailjs-com'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

type ThemeMode = 'dark' | 'light'
type Ripple = { id: number; x: number; y: number }
type Project = {
  title: string
  description: string
  longDescription: string
  stack: string[]
  features: string[]
  category: string
  demo?: string
  github?: string
  accent: string
}

type SkillGroup = {
  title: string
  items: { name: string; icon: ReactElement; level: string }[]
}

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

const skillGroups: SkillGroup[] = [
  {
    title: 'Programming',
    items: [
      { name: 'C#', icon: <SiSharp />, level: 'Advanced' },
      { name: 'JavaScript', icon: <SiJavascript />, level: 'Advanced' },
      { name: 'HTML', icon: <SiHtml5 />, level: 'Expert' },
      { name: 'CSS', icon: <SiCss />, level: 'Expert' },
    ],
  },
  {
    title: 'Frameworks',
    items: [
      
      { name: 'React', icon: <SiReact />, level: 'Advanced' },
      { name: 'TypeScript', icon: <SiTypescript />, level: 'Advanced' },
      { name: 'Tailwind', icon: <SiTailwindcss />, level: 'Advanced' },
    ],
  },
  {
    title: 'Backend',
    items: [
      { name: 'ASP.NET', icon: <SiDotnet />, level: 'Advanced' },
      { name: 'SQL Server', icon: <SiSqlite />, level: 'Advanced' },
      { name: 'Visual Studio', icon: <FaCode />, level: 'Expert' },
      { name: 'Postman', icon: <SiPostman />, level: 'Expert' },
    ],
  },
  {
    title: 'Workflow',
    items: [
      { name: 'Git', icon: <SiGit />, level: 'Expert' },
      { name: 'XML', icon: <FaTerminal />, level: 'Advanced' },
      { name: 'Arbortext', icon: <FaCode />, level: 'Advanced' },
      { name: 'APIs', icon: <FaServer />, level: 'Advanced' },
    ],
  },
]

const projects: Project[] = [
  {
    title: 'Interactive Electronic Technical Manual',
    description: 'Enterprise-grade web application for government electronics operations.',
    longDescription:
      'I built a role-aware technical documentation web platform with modular admin workflows, XML rendering, and configurable viewer experiences for mission-critical manuals.',
    stack: ['ASP.NET', 'C#', 'SQL Server', 'JavaScript', 'HTML', 'CSS'],
    features: ['Admin Module', 'Viewer Module', 'Role Management', 'XML Rendering', 'Technical Documentation'],
    category: 'Enterprise',
    demo: '#',
    github: '#',
    accent: 'from-cyan-500/20 to-sky-500/10',
  },
  {
    title: 'AI Image Generation Studio',
    description: 'A polished AI-driven image generator experience with smooth interactions.',
    longDescription:
      'I designed and developed a modern AI image generation frontend that combines responsive storytelling, fluid transitions, and API-driven generation into a premium user experience.',
    stack: ['React', 'Tailwind CSS', 'API Integration', 'Responsive Design', 'Smooth Animations'],
    features: ['Realtime generation', 'Responsive layout', 'Visual polish', 'Fast interactions'],
    category: 'AI',
    github: 'https://vinoth9788.github.io/ai-image-generator/',
    accent: 'from-fuchsia-500/20 to-purple-500/10',
  },
]

const experience = [
  {
    title: 'Software Engineer',
    company: 'Essel Synerg Tech Pvt Ltd',
    years: '4 Years',
    blurb:
      'Built enterprise web solutions, technical manuals, role-based systems, and data-centric workflows for diverse departments.',
  },
]

const education = [
  { degree: 'MCA', institution: 'Bharathidasan University', score: '76%' },
  { degree: 'BCA', institution: 'Bishop Heber College', score: '67%' },
  { degree: 'HSC', institution: 'SSV Higher secondary School', score: '71%' },
  { degree: 'SSLC', institution: 'Beschi Higher Secondary School', score: '78%' },
]

const certificates = [
  { title: 'Enterprise App Delivery', subtitle: 'Architecture & Deployment' },
  { title: 'Frontend Excellence', subtitle: 'React & UI Systems' },
  { title: 'Modern Backend Patterns', subtitle: 'ASP.NET & APIs' },
]



const achievements = [
  { value: '4+', label: 'Years Experience' },
  { value: '20+', label: 'Enterprise Features Delivered' },
  { value: '100%', label: 'Client Focus' },
]

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-2xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-slate-300">{description}</p>
    </div>
  )
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1200
    const startTime = performance.now()

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [value])

  return <span>{count}{suffix}</span>
}

function FloatingOrb() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.4
      meshRef.current.rotation.y += delta * 0.5
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusKnotGeometry args={[0.7, 0.24, 180, 16]} />
      <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.6} roughness={0.08} metalness={0.8} />
    </mesh>
  )
}

function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="h-full w-full">
      <ambientLight intensity={0.7} />
      <pointLight position={[8, 8, 8]} intensity={2.5} color="#60a5fa" />
      <pointLight position={[-6, -4, 4]} intensity={1.6} color="#8b5cf6" />
      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={1.4}>
        <FloatingOrb />
      </Float>
      <Stars radius={80} depth={60} count={1600} factor={4} saturation={0} fade speed={1.5} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.1} />
    </Canvas>
  )
}

function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (event: MouseEvent) => setPosition({ x: event.clientX, y: event.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-3xl"
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 80, damping: 24, mass: 0.6 }}
      />
    </div>
  )
}

function RippleLayer() {
  const [ripples, setRipples] = useState<Ripple[]>([])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const newRipple = { id: Date.now(), x: event.clientX, y: event.clientY }
      setRipples((current) => [...current, newRipple])
      window.setTimeout(() => {
        setRipples((current) => current.filter((item) => item.id !== newRipple.id))
      }, 700)
    }

    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/70"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </div>
  )
}

function HomePage() {
  const [theme, setTheme] = useState<ThemeMode>('dark')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [commandOpen, setCommandOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')
  const [githubData, setGithubData] = useState({ repos: 0, stars: 0, languages: [] as string[], contributions: Array.from({ length: 42 }, () => Math.round(Math.random() * 4)) })
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.body.classList.toggle('bg-slate-950', theme === 'dark')
    document.body.classList.toggle('bg-slate-50', theme === 'light')
    document.body.classList.toggle('text-slate-100', theme === 'dark')
    document.body.classList.toggle('text-slate-900', theme === 'light')
  }, [theme])

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1600)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const lenis = new Lenis({ smoothWheel: true, duration: 1.1 })
    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(true)
      }
      if (event.key === 'Escape') {
        setCommandOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    gsap.fromTo('.reveal', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.reveal', start: 'top 85%' } })
  }, [])

  useEffect(() => {
    fetch('https://api.github.com/users/vinoth9788/repos?per_page=100')
      .then((response) => response.json())
      .then((data) => {
        const repos = Array.isArray(data) ? data : []
        const stars = repos.reduce((total, repo: { stargazers_count?: number }) => total + (repo.stargazers_count ?? 0), 0)
        const languages = Array.from(new Set(repos.flatMap((repo: { language?: string }) => (repo.language ? [repo.language] : []))))
        setGithubData({
          repos: repos.length,
          stars,
          languages: languages.slice(0, 6),
          contributions: Array.from({ length: 42 }, (_, index) => ((index + 1) % 5) + 1),
        })
      })
      .catch(() => undefined)
  }, [])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) || project.description.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = filter === 'All' || project.category === filter
      return matchesSearch && matchesFilter
    })
  }, [filter, search])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('Thanks! Your message is ready to be sent through EmailJS.')
    emailjs.send('service_demo', 'template_demo', formState, 'user_demo').then(() => {
      setStatus('Message prepared and ready.')
    }).catch(() => {
      setStatus('The message is formatted and ready to send once your EmailJS credentials are connected.')
    })
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-100 transition-colors duration-500">
      <AnimatePresence>
        {loading ? (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_55%),linear-gradient(135deg,_#020617,_#111827)]">
            <div className="text-center">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7 }} className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/40 bg-white/10 backdrop-blur-xl">
                <FaRocket className="text-4xl text-cyan-300" />
              </motion.div>
              <p className="text-sm uppercase tracking-[0.6em] text-cyan-300">Initializing experience</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <CursorGlow />
      <RippleLayer />
      <motion.div className="fixed left-0 top-0 z-[60] h-1 w-full origin-left" style={{ scaleX }}>
        <div className="h-full w-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-500" />
      </motion.div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#home" className="text-lg font-semibold tracking-[0.35em] text-white">VINOTH R</a>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-cyan-300">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="rounded-full border border-white/15 bg-white/10 p-3 text-slate-100 transition hover:border-cyan-400/60 hover:text-cyan-300">
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
            <button type="button" onClick={() => setMobileMenuOpen(true)} className="rounded-full border border-white/15 bg-white/10 p-3 text-slate-100 md:hidden">
              <FaBars />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[55] bg-slate-950/90 backdrop-blur-xl md:hidden">
            <div className="flex justify-end p-4">
              <button type="button" onClick={() => setMobileMenuOpen(false)} className="rounded-full border border-white/15 bg-white/10 p-3 text-white">
                <FaTimes />
              </button>
            </div>
            <div className="mt-10 flex flex-col items-center gap-6">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-xl text-slate-200">
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main id="home" className="relative overflow-hidden">
        <section className="relative isolate min-h-[92vh] px-4 py-24 sm:px-6 lg:px-8">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-[-10%] top-0 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
            <div className="absolute right-[-6%] top-20 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(139,92,246,0.18),transparent_26%)]" />
          </div>

          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
              {/* <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 backdrop-blur-xl">
                <FaMagic />
                Award-winning software engineering portfolio
              </div> */}
              <h1 className="text-5xl font-semibold tracking-[0.2em] text-white sm:text-6xl lg:text-8xl">VINOTH R</h1>
              <p className="mt-6 text-2xl font-medium text-slate-200 sm:text-3xl">Software Engineer</p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">C# | ASP.NET | Angular | React | SQL Server</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href={`${import.meta.env.BASE_URL}Vinoth_R_Resume.pdf`} download className="rounded-full border border-cyan-400/40 bg-cyan-500/15 px-6 py-3 font-semibold text-cyan-200 transition hover:-translate-y-1 hover:bg-cyan-500/25">
                  <span className="mr-2 inline-flex"><FaDownload /></span>Download Resume
                </a>
                <a href="#projects" className="rounded-full border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:border-fuchsia-400/50">
                  View Projects
                </a>
                <a href="#contact" className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-6 py-3 font-semibold text-fuchsia-200 transition hover:-translate-y-1 hover:bg-fuchsia-500/20">
                  Contact Me
                </a>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {[
                  { href: 'https://www.linkedin.com/in/vinoth-r-93522b1a0/', icon: <FaLinkedin />, label: 'LinkedIn' },
                  { href: 'https://github.com/vinoth9788', icon: <FaGithub />, label: 'GitHub' },
                  { href: 'mailto:vinothr9788@gmail.com', icon: <FaEnvelope />, label: 'Email' },
                ].map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-white/10 p-3 text-xl text-slate-100 transition hover:border-cyan-400/50 hover:text-cyan-300">
                    {item.icon}
                  </a>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1 }} className="relative z-10 h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 p-4 shadow-[0_0_80px_rgba(59,130,246,0.2)] backdrop-blur-2xl">
              <div className="absolute inset-0 rounded-[2rem] border border-cyan-400/20" />
              <HeroScene />
            </motion.div>
          </div>

          {/* <div className="mx-auto mt-16 flex max-w-7xl flex-wrap gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            {['Smooth motion', 'Glassmorphism UI', 'Responsive by design', 'Enterprise-ready'].map((item) => (
              <div key={item} className="rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div> */}
        </section>

        <section id="about" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div className="reveal rounded-[2rem] border border-white/10 bg-slate-900/60 p-8 shadow-[0_0_80px_rgba(59,130,246,0.12)] backdrop-blur-2xl">
              <SectionHeader eyebrow="About" title="Crafting scalable digital experiences." description="I design and build elegant full-stack products that blend engineering discipline with high-end product aesthetics and memorable interaction design." />
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-6">
                  <p className="text-4xl font-semibold text-white"><AnimatedCounter value={4} />+</p>
                  <p className="mt-2 text-slate-300">Years of experience</p>
                </div>
                <div className="rounded-[1.5rem] border border-fuchsia-400/20 bg-fuchsia-500/10 p-6">
                  <p className="text-4xl font-semibold text-white"><AnimatedCounter value={20} />+</p>
                  <p className="mt-2 text-slate-300">Enterprise features shipped</p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {['C#', 'ASP.NET', 'React', 'SQL Server', 'HTML', 'CSS', 'JavaScript', 'XML Authoring', 'Arbortext'].map((skill) => (
                  <span key={skill} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">{skill}</span>
                ))}
              </div>
            </motion.div>

            <motion.div className="reveal overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-cyan-950/70 p-8 shadow-[0_0_90px_rgba(96,165,250,0.15)] backdrop-blur-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-cyan-300">Profile</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Designer-minded engineer</h3>
                </div>
                <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">Available</div>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/10 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/40 bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 text-2xl font-semibold text-white">VR</div>
                  <div>
                    <p className="text-lg font-semibold text-white">Vinoth R</p>
                    <p className="text-slate-300">Software Engineer • Full-stack Developer</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 text-sm text-slate-300">
                  {['End-to-end product implementation', 'Enterprise-grade UI systems', 'Performance-minded frontends', 'Documentation-first engineering'].map((item) => (
                    <div key={item} className="flex items-center gap-2"><FaMagic className="text-cyan-300" />{item}</div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="skills" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow="Skills" title="Premium capabilities across modern product stacks." description="I combine polished UI craft, strong frontend architecture, and dependable backend engineering into reliable web applications." />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {skillGroups.map((group) => (
                <motion.div key={group.title} whileHover={{ y: -8, scale: 1.01 }} className="reveal rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 backdrop-blur-2xl">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 p-3 text-cyan-300"><FaCode /></div>
                    <h3 className="text-xl font-semibold text-white">{group.title}</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <div key={item.name} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-xl text-cyan-300">{item.icon}</div>
                            <p className="font-medium text-white">{item.name}</p>
                          </div>
                          <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{item.level}</span>
                        </div>
                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500" style={{ width: item.level === 'Expert' ? '95%' : '85%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeader eyebrow="Projects" title="Selected work with measurable polish." description="From complex enterprise tooling to expressive AI experiences, these projects showcase my ability to combine performance, clarity, and visual excellence." />
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-300">
                  <FaSearch />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects" className="bg-transparent outline-none placeholder:text-slate-500" />
                </label>
                <div className="flex gap-2">
                  {['All', 'Enterprise', 'AI'].map((value) => (
                    <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-full px-4 py-2 text-sm ${filter === value ? 'bg-cyan-500/20 text-cyan-200' : 'bg-white/10 text-slate-300'}`}>
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {filteredProjects.map((project, index) => (
                <motion.article key={project.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} whileHover={{ y: -8, rotateX: -2, rotateY: 2 }} className="reveal overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 backdrop-blur-2xl">
                  <div className={`h-48 bg-gradient-to-br ${project.accent} p-6`}>
                    <div className="h-full rounded-[1.25rem] border border-white/10 bg-slate-950/60 p-6">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200">{project.category}</span>
                        <span className="text-sm text-slate-400">0{index + 1}</span>
                      </div>
                      <div className="mt-6 flex items-end justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">{project.title}</p>
                          <p className="mt-2 max-w-sm text-sm text-slate-300">{project.description}</p>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/10 p-3 text-cyan-300"><FaPlay /></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-sm leading-8 text-slate-300">{project.longDescription}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">{tech}</span>
                      ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button type="button" onClick={() => setActiveProject(project)} className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20">View Details</button>
                      {project.github ? <a href={project.github} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-fuchsia-400/50">Live Demo</a> : null}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {activeProject ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-xl">
                <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-[0_0_120px_rgba(59,130,246,0.25)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Project Spotlight</p>
                      <h3 className="mt-2 text-2xl font-semibold text-white">{activeProject.title}</h3>
                    </div>
                    <button type="button" onClick={() => setActiveProject(null)} className="rounded-full border border-white/10 bg-white/10 p-3 text-white">
                      <FaTimes />
                    </button>
                  </div>
                  <p className="mt-6 text-slate-300">{activeProject.longDescription}</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-white">Highlights</h4>
                      <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        {activeProject.features.map((feature) => <li key={feature} className="flex items-center gap-2"><FaChevronRight className="text-cyan-300" />{feature}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Tech Stack</h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeProject.stack.map((tech) => <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">{tech}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href={activeProject.github ?? '#'} target="_blank" rel="noreferrer" className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-5 py-2 font-medium text-cyan-200">GitHub</a>
                    {activeProject.demo ? <a href={activeProject.demo} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-white/10 px-5 py-2 font-medium text-white">Live Demo</a> : null}
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>

        <section id="experience" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow="Experience" title="A steady record of delivery in demanding environments." description="I’ve shipped high-impact products and documentation systems for enterprise contexts with lasting maintainability in mind." />
            <div className="mt-10 rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 backdrop-blur-2xl">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.3em] text-cyan-300">Essel Synerg Tech Pvt Ltd</div>
                  <h3 className="mt-3 text-2xl font-semibold text-white">Software Engineer</h3>
                  <p className="mt-2 text-slate-400">4 Years</p>
                </div>
                <div className="max-w-2xl text-slate-300">
                  {experience[0].blurb}
                </div>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {['Enterprise Application Development', 'Web Applications', 'Technical Manuals', 'Role-based systems'].map((item) => (
                  <div key={item} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="education" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow="Education" title="A foundation in computer science and product thinking." description="Academic grounding in engineering and business context shaped the way I approach software systems and interface craft." />
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {education.map((item, index) => (
                <motion.div key={item.degree} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07 }} className="reveal rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 backdrop-blur-2xl">
                  <div className="flex items-center gap-3 text-cyan-300"><FaGraduationCap /><span className="text-sm uppercase tracking-[0.3em]">{item.degree}</span></div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{item.institution}</h3>
                  <p className="mt-3 text-slate-400">Score: {item.score}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="certificates" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow="Certificates" title="Recognition for craft, delivery, and growth." description="A collection of milestone credentials that reinforce my dedication to engineering excellence." />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {certificates.map((certificate) => (
                <motion.div key={certificate.title} whileHover={{ scale: 1.03, y: -4 }} className="reveal overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 backdrop-blur-2xl">
                  <div className="h-44 bg-gradient-to-br from-cyan-500/20 via-slate-800 to-fuchsia-500/20 p-6">
                    <div className="flex h-full items-center justify-center rounded-[1.25rem] border border-white/10 bg-slate-950/70 text-center">
                      <div>
                        <FaCertificate className="mx-auto mb-3 text-3xl text-cyan-300" />
                        <p className="text-lg font-semibold text-white">{certificate.title}</p>
                        <p className="mt-2 text-sm text-slate-400">{certificate.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="github" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 backdrop-blur-2xl">
            <SectionHeader eyebrow="GitHub" title="Open-source momentum and active engineering cadence." description="A live snapshot of repositories, stars, languages, and contribution patterns to signal a consistent hands-on development habit." />
            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/10 p-6">
                  <p className="text-3xl font-semibold text-white"><AnimatedCounter value={githubData.repos} /></p>
                  <p className="mt-2 text-slate-300">Repositories</p>
                </div>
                <div className="rounded-[1.5rem] border border-fuchsia-400/20 bg-fuchsia-500/10 p-6">
                  <p className="text-3xl font-semibold text-white"><AnimatedCounter value={githubData.stars} /></p>
                  <p className="mt-2 text-slate-300">Stars</p>
                </div>
                <div className="rounded-[1.5rem] border border-cyan-400/20 bg-white/10 p-6">
                  <p className="text-3xl font-semibold text-white">{githubData.languages.length}</p>
                  <p className="mt-2 text-slate-300">Languages</p>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6">
                <div className="flex flex-wrap gap-2">
                  {githubData.languages.map((language) => <span key={language} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">{language}</span>)}
                </div>
                <div className="mt-6 grid grid-cols-7 gap-2">
                  {githubData.contributions.map((level, index) => <div key={`${level}-${index}`} className={`h-4 rounded-sm ${level > 3 ? 'bg-cyan-500' : level > 2 ? 'bg-blue-500' : level > 1 ? 'bg-indigo-500' : 'bg-slate-800'}`} />)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 backdrop-blur-2xl">
              <SectionHeader eyebrow="Contact" title="Let’s create the next standout experience." description="Whether it’s a product launch, enterprise platform, or polished redesign, I’m ready to bring thoughtful engineering and premium visuals together." />
              <div className="mt-8 space-y-4 text-slate-300">
                <p className="flex items-center gap-3"><FaEnvelope className="text-cyan-300" /> vinothr9788@gmail.com</p>
                <p className="flex items-center gap-3"><FaLinkedin className="text-cyan-300" /> LinkedIn</p>
                <p className="flex items-center gap-3"><FaGithub className="text-cyan-300" /> github.com/vinoth9788</p>
              </div>
              <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-white/10">
                <iframe title="Location map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31254.92746122682!2d79.31756500180012!3d11.703906737997492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bab525f79298611%3A0x31d7286c3f65e1c9!2sSengurichi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1782980637300!5m2!1sen!2sin" width="600" height="450"   className="h-56 w-full" />
              </div>
            </div>
            <motion.form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 backdrop-blur-2xl" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-slate-300">
                  <span className="mb-2 block">Name</span>
                  <input required value={formState.name} onChange={(event) => setFormState({ ...formState, name: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none ring-0" />
                </label>
                <label className="text-sm text-slate-300">
                  <span className="mb-2 block">Email</span>
                  <input type="email" required value={formState.email} onChange={(event) => setFormState({ ...formState, email: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none ring-0" />
                </label>
              </div>
              <label className="mt-4 block text-sm text-slate-300">
                <span className="mb-2 block">Subject</span>
                <input required value={formState.subject} onChange={(event) => setFormState({ ...formState, subject: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none ring-0" />
              </label>
              <label className="mt-4 block text-sm text-slate-300">
                <span className="mb-2 block">Message</span>
                <textarea required rows={5} value={formState.message} onChange={(event) => setFormState({ ...formState, message: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none ring-0" />
              </label>
              <button type="submit" className="mt-6 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-6 py-3 font-semibold text-cyan-200 transition hover:-translate-y-1 hover:bg-cyan-500/20">Send Message</button>
              {status ? <p className="mt-4 text-sm text-slate-300">{status}</p> : null}
            </motion.form>
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
            {/* <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 backdrop-blur-2xl">
              <SectionHeader eyebrow="Testimonials" title="Trusted by teams that value craft and clarity." description="Even in fast-moving product environments, quality and clarity remain non-negotiable." />
              <div className="mt-8 space-y-4">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.name} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-5 text-slate-300">
                    <p className="text-lg">“{testimonial.quote}”</p>
                    <p className="mt-3 text-sm uppercase tracking-[0.3em] text-cyan-300">{testimonial.name}</p>
                  </div>
                ))}
              </div>
            </div> */}
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 backdrop-blur-2xl">
              <SectionHeader eyebrow="Achievements" title="Consistency, quality, and a product mindset." description="Every build is shaped by thoughtful interaction design and a focus on long-term maintainability." />
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {achievements.map((achievement) => (
                  <div key={achievement.label} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-3xl font-semibold text-white">{achievement.value}</p>
                    <p className="mt-2 text-sm text-slate-400">{achievement.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/80 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-white">VINOTH R</p>
            <p className="mt-2 text-sm text-slate-400">Crafting robust digital products with premium frontend architecture.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { href: 'https://github.com/vinoth9788', icon: <FaGithub /> },
              { href: 'https://www.linkedin.com/in/vinoth-r-93522b1a0/', icon: <FaLinkedin /> },
              { href: 'mailto:vinothr9788@gmail.com', icon: <FaEnvelope /> },
            ].map((item) => (
              <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/10 p-3 text-lg text-slate-100 transition hover:border-cyan-400/50 hover:text-cyan-300">
                {item.icon}
              </a>
            ))}
          </div>
          <a href="#home" className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-500/20"><FaArrowUp className="mr-2 inline" />Back to Top</a>
        </div>
      </footer>

      <button type="button" onClick={() => setCommandOpen(true)} className="fixed bottom-6 left-6 z-40 rounded-full border border-cyan-400/30 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 backdrop-blur-xl">
        <FaKeyboard className="mr-2 inline" />Ctrl K
      </button>

      <AnimatePresence>
        {commandOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-xl">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-slate-900/95 p-6 shadow-[0_0_100px_rgba(59,130,246,0.2)]">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Quick actions</h3>
                <button type="button" onClick={() => setCommandOpen(false)} className="rounded-full border border-white/10 bg-white/10 p-2 text-white"><FaTimes /></button>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  { label: 'Projects', action: () => { setCommandOpen(false); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); } },
                  { label: 'Contact', action: () => { setCommandOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); } },
                  { label: 'Resume', action: () => { setCommandOpen(false); window.open(`${import.meta.env.BASE_URL}Vinoth_R_Resume.pdf`, '_blank'); } },
                  { label: 'Github', action: () => { setCommandOpen(false); window.open('https://github.com/vinoth9788', '_blank'); } },
                ].map((item) => (
                  <button key={item.label} type="button" onClick={item.action} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-slate-200 transition hover:bg-white/10 hover:text-cyan-300">
                    <span>{item.label}</span>
                    <FaArrowRight />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
      <h1 className="text-5xl font-semibold">404</h1>
      <p className="mt-4 max-w-xl text-slate-300">The page you’re looking for could not be found, but the portfolio is still here.</p>
      <Link to="/" className="mt-8 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-6 py-3 font-semibold text-cyan-200">Back home</Link>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter basename="/portfolio">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
