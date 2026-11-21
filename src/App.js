import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Coding from './components/Coding';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Education from './components/Education';
import Internships from './components/Internships';
import Leadership from './components/Leadership';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <a className="skip-link" href="#about">Skip to content</a>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Coding />
        <Achievements />
        <Education />
        <Internships />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
