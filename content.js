// ============================================================================
//  content.js  —  L'UNICO FILE CHE DEVI MODIFICARE
// ============================================================================
//  Qui c'è TUTTO quello che appare sul portfolio. Modifica i valori, salva,
//  poi commit & push (o ricarica index.html in locale).
//  4 regole per non rompere nulla:
//    1. Tieni le virgolette "" attorno a ogni testo.
//    2. Metti una virgola , dopo ogni elemento di una lista.
//    3. Non cancellare mai [ ] né { }.
//    4. Non cancellare l'ultima riga  };  in fondo al file.
//  Tutto dopo // è una nota ignorata dal sito.
// ============================================================================

window.PORTFOLIO = {

  // ---------------------------- INFO DI BASE --------------------------------
  name: "Alessio Iodice",
  title: "QA Automation Engineer · Mobile Developer",
  location: "Madrid, Spain 🇪🇸",
  about: "I bring creativity, curiosity, and an out-of-the-box mindset to every project I work on. I'm constantly exploring new ideas — reflected in the variety of repositories and projects I build across different areas. I see myself as a versatile developer: wherever I'm placed, I adapt quickly, find solutions, and deliver value.",

  // ---------------------------- CONTATTI & LINK -----------------------------
  email: "alessioiodiceuni@gmail.com",
  phone: "+39 3382183105",
  github: "Yoddikko",                                        // SOLO l'username
  linkedin: "https://www.linkedin.com/in/alessio-iodice-4a22131b0/",
  behance: "https://behance.net/yoddale",
  // CV: il sito usa automaticamente la versione più alta presente in assets/,
  // con la convenzione  assets/cv-<N>.pdf  (es. cv-2.pdf per la 2.0, cv-3.pdf, …).
  // Lascia vuoto per l'auto-detect; imposta un URL/percorso solo per forzarlo.
  cvUrl: "",

  // ---------------------------- LINGUE & INTERESSI --------------------------
  languages: ["Italian (native)", "English (C1)", "Spanish (A1)"],
  interests: ["Video games", "Open source", "Privacy & technology"],

  // ---------------------------- TECH STACK (per categorie) ------------------
  //  Ogni voce: { category: "Titolo", items: ["...", "..."] }
  skills: [
    { category: "QA Automation & Testing", items: ["Quality Assurance", "XCTest", "Selenium", "Postman", "HTML Reports", "Jira"] },
    { category: "iOS & Mobile Development", items: ["Swift", "iOS", "Xcode", "MVVM", "SwiftLint"] },
    { category: "Development & DevOps", items: ["Python", "C++", "Git", "GitHub Actions", "AWS"] },
    { category: "AI & Automation", items: ["Claude Code", "Codex", "Generative AI"] },
    { category: "Design & Collaboration", items: ["Figma", "Sketch", "Miro"] },
  ],
  // Soft skills (mostrate in coda al comando `skills`)
  softSkills: ["Problem solving", "Creative thinking", "Critical thinking", "Cross-cultural communication", "Teamwork", "Adaptability", "Digital ethics", "Privacy awareness"],

  // ---------------------------- PROGETTI ------------------------------------
  //  Campi: name, description, year, aiUsed (true/false), aiLevel
  //  (none|low|medium|high|vibecoded), links: [ {name, url}, ... ]
  projects: [
    {
      name: "AutoMercatorum",
      description: "A set of tools that assist you throughout your studies at Università degli Studi Mercatorum.",
      year: "2026",
      aiUsed: true,
      aiLevel: "vibecoded",
      links: [
        { name: "Website", url: "https://automercatorum.top/" },
      ],
    },
    {
      name: "Scilla",
      description: "An app to organise your TV series and films: save titles and track your watch progress. Paired with your own server that follows Scilla's API, it also lets you stream films and series straight to your phone.",
      year: "2025",
      aiUsed: true,
      aiLevel: "vibecoded",
      links: [
        { name: "TestFlight", url: "https://testflight.apple.com/join/jYNJmhu6" },
      ],
    },
    {
      name: "Barefoot Suite",
      description: "Ongoing project born from the collaboration between the Apple Developer Academy and Barefoot College. The suite is two apps and a framework; the main app is Sakhi. I made the app fully offline, managing data and server synchronisation, refactoring and app logic. Built in UIKit.",
      year: "2023",
      aiUsed: true,
      aiLevel: "low",
      links: [
        { name: "More info", url: "https://www.behance.net/gallery/172661547/Barefoot-Suite-iOS-iPadOS-applications" },
      ],
    },
    {
      name: "Yodd AI Chat",
      description: "My first important solo open-source project, built in three weeks: a frontend app for OpenAI's ChatGPT API, with DALL-E image generation. Made with SwiftUI, MVVM, CoreData and SwiftLint.",
      year: "2023",
      aiUsed: true,
      aiLevel: "low",
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
      aiUsed: true,
      aiLevel: "low",
      links: [
        { name: "GitHub", url: "https://github.com/Yoddikko/ASL-Recognizer" },
      ],
    },
    {
      name: "Now.",
      description: "WWDC 2023 winner — a short (under 3 minutes) experience for the WWDC 2023 Swift Student Challenge, built in less than a week. Now. is a safe space to pause, unwind and reflect on the present, inspired by Stoic philosophy.",
      year: "2023",
      aiUsed: true,
      aiLevel: "low",
      links: [
        { name: "GitHub", url: "https://github.com/Yoddikko/Now" },
        { name: "Video", url: "https://www.youtube.com/watch?v=p4cmUtHqRlM&ab_channel=Alessio" },
      ],
    },
  ],

  // ---------------------------- ESPERIENZE (recenti prima) ------------------
  experience: [
    {
      role: "QA Automation Engineer",
      company: "M47 Labs",
      period: "August 2023 – Present · Madrid, ES",
      details: "After the Apple Developer Academy I joined M47 Labs, a tech company focused on AI technology and projects with leading IT companies. I work as a QA Automation Engineer, focusing on unit testing, code maintenance and the creation of internal tools.",
    },
  ],

  // ---------------------------- ISTRUZIONE ----------------------------------
  education: [
    {
      degree: "Bachelor's Degree in Computer Engineering",
      institution: "Università Mercatorum",
      year: "2023 – 2026 · Remote, IT",
      details: "Started my studies at Università degli Studi di Napoli Parthenope and later completed the bachelor's degree remotely at Università Mercatorum.",
    },
    {
      degree: "",
      institution: "Apple Developer Academy — Pier Program",
      year: "2022 – 2023 · Naples, IT",
      details: "Second year of the Academy: a full year on a single project with the same team, using agile methodologies. Backend developer on a project with Barefoot International — a large, long-running legacy Swift codebase.",
    },
    {
      degree: "",
      institution: "Apple Developer Academy — Student Year",
      year: "2021 – 2022 · Naples, IT",
      details: "Nine-month program covering all aspects of app development; specialized in coding, plus process, UI and UX.",
    },
    {
      degree: "",
      institution: "iOS Foundation Program — Advanced course (Università Parthenope)",
      year: "2020 · Remote",
      details: "Two-month program exploring application development for tvOS and watchOS.",
    },
    {
      degree: "",
      institution: "iOS Foundation Program — Base course (Università Parthenope)",
      year: "2020 · Naples, IT",
      details: "Introduction to application development.",
    },
  ],

  // ---------------------------- CERTIFICAZIONI ------------------------------
  //  Campi: title, url (lascia "" se non c'è un link)
  certifications: [
    { title: "AWS Academy Graduate — Introduction to Cloud, Semester 2", url: "https://www.credly.com/badges/fb3b2d67-f006-4dcf-9492-973230d48565/linked_in?t=rw6q51" },
    { title: "AWS Academy Graduate — Introduction to Cloud, Semester 1", url: "https://www.credly.com/badges/533b8455-e410-45b5-bf7b-234a8c5ed5e9/linked_in_profile" },
    { title: "Cisco — CCNA: Introduction to Networks", url: "https://www.credly.com/badges/ac2e0ab9-9687-474b-9b8c-3eb67235bb1c?source=linked_in_profile" },
    { title: "Cisco — Introduction to Cybersecurity", url: "https://www.credly.com/badges/9c4b7782-a924-4a6d-84d3-a5f936b7fab3/linked_in_profile" },
    { title: "Cisco — Introduction to IoT", url: "" },
    { title: "Cisco — Get Connected", url: "" },
    { title: "English Language Certificate B1 — AM Language", url: "" },
    { title: "Apple Teacher", url: "" },
  ],

  // ---------------------------- PREMI ---------------------------------------
  awards: [
    {
      title: "WWDC Swift Student Challenge 2023 — Winner",
      detail: "For \"Now.\", a Stoic mindfulness experience built in under a week.",
      url: "https://github.com/Yoddikko/Now",
    },
  ],

};
