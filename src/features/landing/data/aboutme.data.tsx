import { Code2, Rocket, Trophy, Briefcase, Award } from "lucide-react";

export interface IAboutMeCard {
  id: string;
  title: string;
  summary: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
  className: string;
}

const ABOUTME_DATA: IAboutMeCard[] = [
  {
    id: "about-me-human",
    title: "About Me - The Human",
    summary: "Full Stack Developer passionate about building innovative solutions",
    icon: <Code2 className="h-6 w-6" />,
    color:
      "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30",
    className: "absolute top-40 left-[20%] rotate-[-5deg]",
    content: (
      <div className="space-y-4">
        <p>
          I&apos;m a passionate full-stack developer who thrives on creating innovative solutions
          that make a real impact. Whether it&apos;s building healthcare platforms that help
          thousands of users or developing decentralized applications that push the boundaries of
          Web3, I love tackling complex challenges.
        </p>
        <p>
          What drives me is the intersection of <strong>creativity and technology</strong>. I
          believe the best solutions come from understanding both the technical constraints and the
          human needs behind every project.
        </p>
        <p>
          When I&apos;m not coding, you&apos;ll find me competing in hackathons (won a few!),
          exploring new AI models, or contributing to open-source projects. I&apos;m always
          learning, always building, and always excited about what&apos;s next.
        </p>
      </div>
    ),
  },
  {
    id: "professional-journey",
    title: "Professional Journey",
    summary: "From healthcare to blockchain - building scalable solutions",
    icon: <Briefcase className="h-6 w-6" />,
    color: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30",
    className: "absolute top-80 left-[25%] rotate-[-7deg]",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-blue-900 dark:text-blue-100">
            Lead Full Stack Developer - TheHowdyStudios
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Building intelligent solutions for modern challenges
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Developed AI chat integration systems with model rotation</li>
            <li>Built financial coaching app with real-time analytics</li>
            <li>Architected scalable MERN stack applications</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-blue-900 dark:text-blue-100">
            Full Stack Developer - Theoria Medical
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Healthcare compliance and HIPAA-compliant systems
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Implemented healthcare compliance standards</li>
            <li>Built secure, HIPAA-compliant platforms</li>
            <li>Optimized patient data management systems</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-blue-900 dark:text-blue-100">
            React Native Developer - Tritech
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Mobile healthcare application development
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Developed cross-platform healthcare mobile apps</li>
            <li>Implemented real-time patient monitoring features</li>
            <li>Optimized app performance for 10,000+ users</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "hackathon-winner",
    title: "Hackathon Winner 🏆",
    summary: "$5K prize winner • 500+ entries • Multiple first places",
    icon: <Trophy className="h-6 w-6" />,
    color:
      "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/30",
    className: "absolute top-25 left-[40%] rotate-[8deg]",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-yellow-900 dark:text-yellow-100">
            Dumpet.Fun - $5,000 Prize Winner 💰
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">Won against 500+ entries</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Built decentralized meme coin creation platform</li>
            <li>Integrated Solana blockchain for fast transactions</li>
            <li>Implemented real-time token analytics dashboard</li>
            <li>Won $5,000 grand prize in competitive field</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-yellow-900 dark:text-yellow-100">
            Everlink - 1st Place 🥇
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Decentralized platform for connecting creators
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Web3 social platform with blockchain integration</li>
            <li>Smart contract deployment for creator monetization</li>
            <li>Built in 48 hours during hackathon</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-yellow-900 dark:text-yellow-100">
            IWorkspace - Collaboration Platform
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Real-time workspace for remote teams
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Real-time collaboration features with WebSockets</li>
            <li>Video conferencing integration</li>
            <li>Project management dashboard</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "tech-arsenal",
    title: "Tech Arsenal",
    summary: "MERN • React Native • Blockchain • AI Integration",
    icon: <Rocket className="h-6 w-6" />,
    color:
      "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30",
    className: "absolute top-64 left-[55%] rotate-[10deg]",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-purple-900 dark:text-purple-100">Frontend Technologies</h4>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>React.js / Next.js</strong> - Building modern web applications
            </li>
            <li>
              <strong>React Native</strong> - Cross-platform mobile development
            </li>
            <li>
              <strong>TypeScript</strong> - Type-safe JavaScript development
            </li>
            <li>
              <strong>Tailwind CSS</strong> - Rapid UI development
            </li>
            <li>
              <strong>Framer Motion</strong> - Smooth animations and interactions
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-purple-900 dark:text-purple-100">
            Backend & Infrastructure
          </h4>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>Node.js / Express</strong> - RESTful API development
            </li>
            <li>
              <strong>MongoDB</strong> - NoSQL database management
            </li>
            <li>
              <strong>tRPC</strong> - End-to-end type-safe APIs
            </li>
            <li>
              <strong>PostgreSQL</strong> - Relational database design
            </li>
            <li>
              <strong>Docker</strong> - Containerization and deployment
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-purple-900 dark:text-purple-100">Blockchain & Web3</h4>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>Solana</strong> - High-performance blockchain development
            </li>
            <li>
              <strong>Web3.js</strong> - Blockchain integration
            </li>
            <li>
              <strong>Smart Contracts</strong> - Decentralized application logic
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-purple-900 dark:text-purple-100">AI & Machine Learning</h4>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>OpenAI API</strong> - GPT integration
            </li>
            <li>
              <strong>Groq</strong> - Fast AI inference
            </li>
            <li>
              <strong>LangChain</strong> - AI application framework
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "awards-education",
    title: "Awards & Recognition",
    summary: "BS Computer Science • Multiple Hackathon Wins • Open Source Contributor",
    icon: <Award className="h-6 w-6" />,
    color:
      "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30",
    className: "absolute top-40 right-[35%] rotate-[2deg]",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-green-900 dark:text-green-100">Education</h4>
          <p className="mt-2">
            <strong>Bachelor of Science in Computer Science</strong>
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">Graduated: June 2024</p>
          <p className="mt-2 text-sm">
            Focused on software engineering, algorithms, and full-stack development. Built strong
            foundation in data structures, system design, and modern development practices.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-green-900 dark:text-green-100">Hackathon Achievements</h4>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong>$5,000 Prize Winner</strong> - Dumpet.Fun (500+ entries)
            </li>
            <li>
              <strong>1st Place</strong> - Everlink Decentralized Platform
            </li>
            <li>
              <strong>Multiple Top Placements</strong> - Various hackathons
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-green-900 dark:text-green-100">Professional Impact</h4>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Built healthcare platforms serving 10,000+ users</li>
            <li>Implemented HIPAA-compliant systems for medical data</li>
            <li>Led development teams on multi-million user applications</li>
            <li>Contributed to open-source blockchain projects</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-green-900 dark:text-green-100">Continuous Learning</h4>
          <p className="mt-2 text-sm">
            Always exploring new technologies - from the latest AI models to emerging blockchain
            protocols. Believe in learning by building and sharing knowledge with the developer
            community.
          </p>
        </div>
      </div>
    ),
  },
];

export default ABOUTME_DATA;
