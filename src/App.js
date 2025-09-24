import React from 'react';
import './App.css';
import useScrollReveal from './hooks/useScrollReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Education from './components/Education';
import Internships from './components/Internships';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  useScrollReveal();
  
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Achievements />
      <Education />
      <Internships />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;