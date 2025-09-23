import React from 'react';

const Projects = () => {
  const projects = [
    {
      title: "FundFlow – Blockchain-Based Fund Allocation System",
      icon: "fas fa-link",
      description: "Built a smart-contract-driven system to ensure transparent fund distribution for government projects and private organizations. Features tender-based allocation and hierarchical fund circulation, preventing fraud and improving accountability.",
      technologies: ["Solidity", "Blockchain", "Web3"],
      status: "85% Completed"
    },
    {
      title: "Cognitive Study Monitoring App",
      icon: "fas fa-eye",
      description: "Developed a cross-platform app using React Native that monitors study focus in real time using facial recognition and eye-tracking technology. Provides personalized insights and productivity recommendations.",
      technologies: ["React Native", "TensorFlow", "FaceMesh"],
      status: "Completed",
      contributors: ["Janani K", "Maushmi B"]
    },
    {
      title: "Real-Time Explicit Content Detection System",
      icon: "fas fa-shield-alt",
      description: "Designed an AI system to detect explicit content in multimedia uploads while streaming. Uses CNNs for video frames, DistilBERT for text detection, and Floyd's Two-Pointer approach for efficient scanning. Supports region-specific moderation policies.",
      technologies: ["Python", "DistilBERT", "CNN", "Floyd's Two-Pointer"],
      status: "In Development"
    },
    {
      title: "PDF/Document Reader App",
      icon: "fas fa-shield-alt",
      description: "Developed a React Native app for reading and annotating PDFs/documents. Features text highlighting, annotation extraction, MCQ generation, and chatbot integration for study assistance.",
      technologies: ["React Native", "Flask Backend", "AI Integration"],
      status: "Completed",
      contributors: ["Akiladithya R", "Farhan Abdul Hakkim", "Maushmi B"]
    },
     {
      title: "IntelliSafe – Stalker Detection System",
      icon: "fas fa-shield-alt",
      description: "Built a surveillance system using YOLOv8, DeepSORT, RFID tracking, and Streamlit. Detects potential stalking behavior, analyzes proximity patterns, and provides panic/report functionality.",
      technologies: ["Python", "OpenCV", "Streamlit", "YOLOv8", "DeepSORT"],
      status: "Completed (SOFTWARE PROJECT)",
      contributors: ["Bala Murali S R"]
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">Featured Projects</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-header">
                <i className={project.icon}></i>
                <h3>{project.title}</h3>
              </div>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.technologies.map((tech, techIndex) => (
                  <span key={techIndex}>{tech}</span>
                ))}
              </div>
              {project.contributors && (
                <div className="project-contributors">
                  <strong>Contributors:</strong>
                  <div className="contributors-list">
                    {project.contributors.map((contributor, contIndex) => (
                      <span key={contIndex} className="contributor-tag">{contributor}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="project-impact">
                <strong>Status:</strong> {project.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;