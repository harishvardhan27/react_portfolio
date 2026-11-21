import { SectionHead, Note, Scribble } from './ui';

const internshipData = [
  {
    id: "agx",
    position: "Back End Developer",
    company: "AGX Solutions",
    shortName: "AGX",
    period: "Jul 2025 - Aug 2025",
    mode: "Remote",
    status: "Completed",
    tag: "Backend",
    highlights: ["Python", "REST APIs", "Postman", "Backend Engineering"],
    description: "Developed and maintained backend services and APIs for enterprise applications, designing scalable endpoints and validating them end-to-end with Postman."
  },
  {
    id: "iEDEO",
    position: "Artificial Intelligence Intern",
    company: "iedeo",
    shortName: "iEDEO",
    period: "May 2025 - Jun 2025",
    mode: "Remote",
    status: "Completed",
    tag: "AI/Backend",
    highlights: ["Python", "Gemini API", "Tesseract OCR", "Regex parsing", "Streamlit", "Excel"],
    description: "Built the backend AI module for a UPSC exam preparation app: OCR and regex pipelines extract MCQs from PDF, DOCX, PPT, TXT and image files, and the Google Gemini API enriches them with explanations, difficulty levels, subject tags and answer validation before export to the app's question bank."
  },
  {
    id: "pdc-ml",
    position: "Machine Learning Intern",
    company: "Project Development Cell (PDC), Coimbatore Institute of Technology",
    shortName: "PDC",
    period: "May 2025",
    mode: "Hybrid",
    status: "Completed",
    tag: "ML/Deep Learning",
    highlights: ["Python", "TensorFlow", "CNN", "SVM", "RNN", "FER-13"],
    description: "A 15-day intensive internship in machine learning and deep learning. Developed an FER-13 facial expression recognition model optimised for mobile integration, covering the full workflow from preprocessing to training, evaluation and deployment readiness."
  },
  {
    id: "tnau",
    position: "Machine Learning / Backend Intern",
    company: "TNAU (Tamil Nadu Agricultural University), Coimbatore via PDC(CIT)",
    shortName: "TNAU",
    period: "Dec 2024 - Feb 2025",
    mode: "Hybrid",
    status: "Completed",
    tag: "ML/App Dev",
    highlights: ["Python", "ANN", "TensorFlow Lite", "Google Colab", "R", "Kotlin app"],
    description: "Designed, trained and validated an ANN that predicts Low / Medium / High risk of Rice Blast and False Smut from weather data, converted it to TensorFlow Lite for TNAU's Android app, and built R pipelines for real-time weather data, giving farmers early warnings of paddy disease."
  },
  {
    id: "gssoc",
    position: "Open Source Contributor",
    company: "GirlScript Foundation (GSSoC Extd)",
    shortName: "GSSoC",
    period: "Oct 2024",
    mode: "Remote",
    status: "Completed",
    tag: "Open Source",
    highlights: ["Open-Source Development", "GitHub", "Collaboration"],
    description: "Contributed to GirlScript Summer of Code Extended, a one-month open-source programme: reviewed pull requests, raised issues and submitted patches to active repositories."
  },
  {
    id: "trainity",
    position: "Data Analyst Intern",
    company: "Trainity",
    shortName: "TRN",
    period: "Sep 2024 - Nov 2024",
    mode: "Remote",
    status: "Completed",
    tag: "Data Analytics",
    highlights: ["Microsoft Excel", "SQL", "EDA", "Regression", "Data Visualization"],
    description: "Delivered five analytics case studies, including a call-volume analysis that cut a CX team's call abandonment from 30% to 10%, plus IMDB movie success factors, hiring-process analytics, car pricing regression and a bank loan default EDA."
  }
];

const Internships = () => {
  return (
    <section id="internships" className="section section--paper internships" aria-labelledby="internships-title">
      <div className="container">
        <SectionHead id="internships-title" title="Internships" note="Professional experience" meta={`${internshipData.length} internships: backend, AI, ML, data & open source`} />

        <ol className="xp">
          {internshipData.map((intern) => (
            <li className="xp__item" key={intern.id}>
              <div className="xp__when">
                <span className="xp__node" aria-hidden="true">{intern.shortName}</span>
                <p className="xp__period">{intern.period}</p>
                <p className="xp__status">{intern.tag}, {intern.mode.toLowerCase()}</p>
              </div>
              <div className="xp__main">
                <h3 className="display xp__pos">{intern.position}</h3>
                <p className="xp__co">{intern.company}</p>
                <p className="xp__desc">{intern.description}</p>
                <ul className="tags">
                  {intern.highlights.map((h) => <li key={h} className="tag">{h}</li>)}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <div className="sec-close">
          <Note>Hands-on industry experience</Note>
          <Scribble />
        </div>
      </div>
    </section>
  );
};

export default Internships;
