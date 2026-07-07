// ============================================================================
//  content.js  —  L'UNICO FILE CHE DEVI MODIFICARE
// ============================================================================
//  Qui c'è TUTTO quello che appare sul tuo portfolio: nome, presentazione,
//  skills, progetti, esperienze, istruzione, certificazioni, premi e contatti.
//  Per cambiare ciò che vedono i visitatori: modifica i valori qui sotto,
//  salva il file, poi fai commit & push (o ricarica index.html in locale).
//
//  NON SERVE SAPER PROGRAMMARE. Segui queste 4 regole e non rompi nulla:
//    1. Tieni le virgolette "" attorno a ogni testo.
//    2. Metti una virgola , dopo ogni elemento di una lista.
//    3. Non cancellare mai le parentesi quadre [ ] né le graffe { }.
//    4. Non cancellare mai l'ultima riga  };  in fondo al file.
//  Tutto ciò che segue due slash  //  è una NOTA per te (ignorata dal sito).
//  Per aggiungere un elemento: COPIA un blocco { ... }, e incollalo sotto.
// ============================================================================

window.PORTFOLIO = {

  // ---------------------------- INFO DI BASE --------------------------------
  name: "Alessio",
  title: "iOS Developer",
  about: "Hi, I'm Ale. A passionate iOS Developer having an experience in building mobile applications with Swift.",

  // ---------------------------- CONTATTI & LINK -----------------------------
  // NOTA: il vecchio portfolio usava "yodikko@protonmail.com". Ho lasciato la
  // gmail (già usata qui e nel tuo git). Cambiala se preferisci la protonmail.
  email: "alessioiodiceuni@gmail.com",
  phone: "+39 338 2183105",                                   // dal vecchio portfolio
  github: "Yoddikko",                                         // SOLO l'username
  linkedin: "https://www.linkedin.com/in/alessio-iodice-4a22131b0/",
  // CV: link dal vecchio portfolio (Google Drive). Puoi anche mettere "assets/cv.pdf".
  cvUrl: "https://drive.google.com/file/d/1xQOp-skncx-j7neIY_iMbyJ5SqhGXGVo/view?usp=sharing",

  // ---------------------------- SKILLS --------------------------------------
  //  L'emoji iniziale diventa un'icona: ⚡ fulmine · 🤖 robot · 🛸 razzo.
  skills: [
    "⚡ Develop highly interactive iOS applications",
    "🤖 Integration of different frameworks like CoreData, CoreML, AVFoundation, SceneKit, ARKit and much more",
    "🛸 I enjoy being creative and bringing my artistic vision into my projects. My passion for innovation and creativity drives me to always find original and surprising solutions",
  ],
  // Tecnologie principali (mostrate come riga "Stack" sotto le skills).
  stack: ["Swift", "C++", "AWS", "Git", "Figma"],

  // ---------------------------- PROGETTI ------------------------------------
  //  Campi: name, description, year, aiUsed (true/false), aiLevel
  //  (none|low|medium|high|vibecoded), links: [ {name, url}, ... ]
  projects: [
    {
      name: "Barefoot Suite",
      description: "Ongoing project born from the collaboration between the Apple Developer Academy and Barefoot College. The suite is two apps and a framework; the main app is Sakhi. I made the app fully offline, managing data and server synchronisation, refactoring and app logic. Built in UIKit.",
      year: "2023",
      aiUsed: false,
      aiLevel: "none",
      links: [
        { name: "More info", url: "https://www.behance.net/gallery/172661547/Barefoot-Suite-iOS-iPadOS-applications" },
      ],
    },
    {
      name: "Yodd AI Chat",
      description: "My first important solo open-source project, built in three weeks: a frontend app for OpenAI's ChatGPT API, with DALL-E image generation. Made with SwiftUI, MVVM, CoreData and SwiftLint.",
      year: "2023",
      aiUsed: false,
      aiLevel: "none",
      links: [
        { name: "GitHub", url: "https://github.com/Yoddikko/yoddChatGPT" },
        { name: "App Store", url: "https://apps.apple.com/us/app/yoddaichat/id1672839275" },
      ],
    },
    {
      name: "Muralink",
      description: "Walk through the city discovering the murals around you, see details in AR and collect them. Made with the Carismatica team during my student year at the Apple Academy, using SwiftUI, ARKit and Combine.",
      year: "2022",
      aiUsed: false,
      aiLevel: "none",
      links: [
        { name: "App Store", url: "https://apps.apple.com/ag/app/muralink/id6443503883" },
      ],
    },
    {
      name: "ASL Recognizer",
      description: "A one-week deliverable that analyses and recognises the sign-language alphabet using machine learning (CreateML and CoreML). Made during my student year at the Apple Academy.",
      year: "2022",
      aiUsed: false,
      aiLevel: "none",
      links: [
        { name: "GitHub", url: "https://github.com/Yoddikko/ASL-Recognizer" },
      ],
    },
    {
      name: "Now.",
      description: "WWDC 2023 winner — a short (under 3 minutes) experience for the WWDC 2023 Swift Student Challenge, built in less than a week. Now. is a safe space to pause, unwind and reflect on the present, inspired by Stoic philosophy.",
      year: "2023",
      aiUsed: false,
      aiLevel: "none",
      links: [
        { name: "GitHub", url: "https://github.com/Yoddikko/Now" },
        { name: "Video", url: "https://www.youtube.com/watch?v=p4cmUtHqRlM&ab_channel=Alessio" },
      ],
    },
  ],

  // ---------------------------- ESPERIENZE (recenti prima) ------------------
  //  Campi: role, company, period, details
  experience: [
    {
      role: "QA Automation Engineer",
      company: "M47 Labs",
      period: "August 2023 – Present",
      details: "M47 Labs is a multicultural AI-centered company based in Spain, contributing to innovative projects in a diverse and dynamic environment.",
    },
    {
      role: "iOS Developer",
      company: "Apple Developer Academy | Pier Program",
      period: "July 2022 – June 2023",
      details: "During my second year at the Apple Developer Academy (Pier program) I worked on a suite of apps developed with Barefoot College International. I took over a 4-year-old codebase supporting older iOS versions: UIKit for the interface, Filemaker as the online database and CoreData as the local one.",
    },
  ],

  // ---------------------------- ISTRUZIONE ----------------------------------
  //  Campi: degree (o ""), institution, year, details (o "")
  education: [
    {
      degree: "Bachelor's Degree in Computer Engineering",
      institution: "Università degli Studi di Napoli Parthenope",
      year: "September 2019 – Present",
      details: "Currently studying. Focus on C++.",
    },
    {
      degree: "",
      institution: "Apple Developer Academy — Pier Program",
      year: "July 2022 – June 2023",
      details: "Real-work-based program: a full year on a single project with the same team, agile/Scrum, interfacing with a stakeholder. Role: Backend Developer (CoreData, UIKit, FileMaker, API).",
    },
    {
      degree: "",
      institution: "Apple Developer Academy — Student Year",
      year: "September 2021 – June 2022",
      details: "9-month program (partnership between Università di Napoli Federico II and Apple): native iOS development, UI/UX, app business, CBL process, SwiftUI and Swift frameworks.",
    },
    {
      degree: "",
      institution: "iOS Foundation Program — Advanced Course",
      year: "June 2020 – July 2020",
      details: "Two months on watchOS/tvOS development and CreateML/CoreML (machine learning).",
    },
    {
      degree: "",
      institution: "iOS Foundation Program — Basic Course",
      year: "November 2019 – December 2019",
      details: "One-month intro to iOS app development, storytelling and app business (with Università Parthenope).",
    },
  ],

  // ---------------------------- CERTIFICAZIONI ------------------------------
  //  Campi: title, url (link alla certificazione; lascia "" se non c'è)
  certifications: [
    { title: "AWS Academy Graduate — Introduction to Cloud, Semester 2", url: "https://www.credly.com/badges/fb3b2d67-f006-4dcf-9492-973230d48565/linked_in?t=rw6q51" },
    { title: "AWS Academy Graduate — Introduction to Cloud, Semester 1", url: "https://www.credly.com/badges/533b8455-e410-45b5-bf7b-234a8c5ed5e9/linked_in_profile" },
    { title: "Cisco — Introduction to Cybersecurity", url: "https://www.credly.com/badges/9c4b7782-a924-4a6d-84d3-a5f936b7fab3/linked_in_profile" },
    { title: "Cisco — CCNA: Introduction to Networks", url: "https://www.credly.com/badges/ac2e0ab9-9687-474b-9b8c-3eb67235bb1c?source=linked_in_profile" },
  ],

  // ---------------------------- PREMI ---------------------------------------
  //  Campi: title, detail (o ""), url (o "")
  awards: [
    {
      title: "WWDC Swift Student Challenge 2023 — Winner",
      detail: "For \"Now.\", a Stoic mindfulness experience built in under a week.",
      url: "https://github.com/Yoddikko/Now",
    },
  ],

};
