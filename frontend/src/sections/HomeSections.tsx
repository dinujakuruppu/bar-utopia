'use client'

import Hero from '@/components/Hero'
import ExperienceHighlights from '@/components/ExperienceHighlights'
import About from '@/components/About'
import Menu from '@/components/Menu'
import SeafoodHighlight from '@/components/SeafoodHighlight'
import Surfing from '@/components/Surfing'
import SurfPackages from '@/components/SurfPackages'
import FreeSunbeds from '@/components/FreeSunbeds'
import Accommodation from '@/components/Accommodation'
import Gallery from '@/components/Gallery'
import VideoSection from '@/components/VideoSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import Contact from '@/components/Contact'
import Location from '@/components/Location'

export default function Home() {
  return (
    <>
      <Hero />
      <ExperienceHighlights />
      <About />
      <Menu />
      <SeafoodHighlight />
      <Surfing />
      <SurfPackages />
      <FreeSunbeds />
      <Accommodation />
      <Gallery />
      <VideoSection />
      <WhyChooseUs />
      <Contact />
      <Location />
    </>
  )
}
