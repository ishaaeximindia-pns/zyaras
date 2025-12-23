import type { Product } from '@/lib/types';

export const products: Product[] = [
  {
    id: '1',
    slug: 'nexus-flow',
    name: 'NexusFlow',
    category: 'Productivity',
    tagline: 'Orchestrate Your Workflow, Seamlessly.',
    description:
      'NexusFlow is a revolutionary productivity tool that integrates all your apps into a single, intuitive dashboard. Automate tasks, manage projects, and collaborate with your team like never before.',
    keyBenefit: 'Unified Workflow',
    price: 25,
    status: 'Popular',
    heroImage: 'product-nexus-flow',
    features: [
      {
        title: 'Unified Dashboard',
        description: 'Connect all your tools and view them in one centralized hub.',
        icon: 'LayoutGrid',
      },
      {
        title: 'Advanced Automation',
        description: 'Create complex automation rules with a simple drag-and-drop interface.',
        icon: 'Cpu',
      },
      {
        title: 'Team Collaboration',
        description: 'Assign tasks, share files, and communicate with your team in real-time.',
        icon: 'Users',
      },
    ],
    useCases: [
      {
        title: 'Project Management for Agile Teams',
        description:
          'Use NexusFlow to manage sprints, track progress, and facilitate communication, ensuring your projects are delivered on time.',
        image: 'use-case-1',
      },
      {
        title: 'Automated Client Onboarding',
        description:
          'Set up automated workflows to onboard new clients, from sending welcome emails to creating project folders and assigning team members.',
        image: 'use-case-2',
      },
    ],
    faqs: [
      {
        question: 'What integrations does NexusFlow support?',
        answer: 'NexusFlow supports over 100 popular apps, including Slack, Google Drive, Trello, and Salesforce. We are constantly adding new integrations.',
      },
      {
        question: 'Is there a limit to the number of automations I can create?',
        answer:
          'The number of automations depends on your pricing plan. Our Enterprise plan offers unlimited automations.',
      },
    ],
    pricing: [
      {
        name: 'Basic',
        price: '15',
        priceSuffix: '/ user / mo',
        features: ['5 Integrations', '10 Automations', 'Basic Support'],
        cta: 'Choose Basic',
      },
      {
        name: 'Pro',
        price: '25',
        priceSuffix: '/ user / mo',
        features: ['50 Integrations', 'Unlimited Automations', 'Priority Support', 'Team Collaboration'],
        cta: 'Choose Pro',
        isFeatured: true,
      },
      {
        name: 'Enterprise',
        price: 'Contact Us',
        priceSuffix: '',
        features: ['Unlimited Integrations', 'Advanced Security', 'Dedicated Account Manager'],
        cta: 'Contact Sales',
      },
    ],
  },
  {
    id: '2',
    slug: 'pixel-forge',
    name: 'PixelForge',
    category: 'Design',
    tagline: 'Craft Stunning Visuals, Effortlessly.',
    description:
      'PixelForge is a powerful yet intuitive design tool for creating beautiful graphics, mockups, and prototypes. With a vast library of assets and AI-powered features, your creativity knows no bounds.',
    keyBenefit: 'AI-Powered Design',
    price: 49,
    status: 'New',
    heroImage: 'product-pixel-forge',
    features: [
      {
        title: 'AI-Assisted Design',
        description: 'Generate color palettes, suggest layouts, and create assets with the power of AI.',
        icon: 'Palette',
      },
      {
        title: 'Vector Editing Suite',
        description: 'A full-featured vector editor that is powerful for pros and easy for newcomers.',
        icon: 'Brush',
      },
      {
        title: 'Real-time Collaboration',
        description: 'Design together with your team in the same canvas, at the same time.',
        icon: 'Feather',
      },
    ],
    useCases: [
      {
        title: 'UI/UX Design for Web and Mobile',
        description: 'Create high-fidelity mockups and interactive prototypes for your next application.',
        image: 'use-case-2',
      },
      {
        title: 'Marketing and Social Media Graphics',
        description:
          'Design engaging visuals for your marketing campaigns, social media posts, and brand identity.',
        image: 'use-case-1',
      },
    ],
    faqs: [
      {
        question: 'Can I import my files from other design tools?',
        answer: 'Yes, PixelForge supports importing files from Sketch, Figma, and Adobe XD, making your transition seamless.',
      },
      {
        question: 'Is there a desktop app available?',
        answer:
          'PixelForge is currently a web-based application, but a desktop version for both Mac and Windows is in active development and will be released soon.',
      },
    ],
    pricing: [
      {
        name: 'Hobby',
        price: '19',
        priceSuffix: '/ mo',
        features: ['3 Projects', 'Basic AI Features', 'Community Support'],
        cta: 'Choose Hobby',
      },
      {
        name: 'Professional',
        price: '49',
        priceSuffix: '/ mo',
        features: ['Unlimited Projects', 'Full AI Suite', 'Real-time Collaboration', 'Priority Support'],
        cta: 'Choose Pro',
        isFeatured: true,
      },
      {
        name: 'Organization',
        price: 'Contact Us',
        priceSuffix: '',
        features: ['Design Systems', 'Shared Asset Libraries', 'Admin Controls', 'Dedicated Support'],
        cta: 'Contact Sales',
      },
    ],
  },
  {
    id: '3',
    slug: 'data-sphere',
    name: 'DataSphere',
    category: 'Business',
    tagline: 'Unlock Insights from Your Data.',
    description:
      'DataSphere is an enterprise-grade business intelligence platform that turns raw data into actionable insights. Connect your data sources, build interactive dashboards, and share reports with your team.',
    keyBenefit: 'Actionable Insights',
    price: 99,
    heroImage: 'product-data-sphere',
    features: [
      {
        title: 'Powerful Data Connectors',
        description: 'Connect to databases, spreadsheets, and cloud services with our extensive library of connectors.',
        icon: 'Database',
      },
      {
        title: 'Interactive Dashboards',
        description: 'Build beautiful, interactive dashboards with a simple drag-and-drop interface.',
        icon: 'BarChart',
      },
      {
        title: 'Enterprise-Grade Security',
        description: 'Your data is protected with industry-leading security features and compliance certifications.',
        icon: 'Shield',
      },
    ],
    useCases: [
        {
            title: "Financial Performance Tracking",
            description: "Aggregate financial data from multiple sources to create comprehensive performance dashboards for stakeholders.",
            image: "use-case-1"
        },
        {
            title: "Sales and Marketing Analytics",
            description: "Track key metrics, analyze campaign effectiveness, and identify growth opportunities with custom reports.",
            image: "use-case-2"
        }
    ],
    faqs: [
        {
            question: "What level of technical skill is required to use DataSphere?",
            answer: "DataSphere is designed for both technical and non-technical users. Our intuitive interface allows business users to create reports, while data analysts can leverage advanced features and SQL editing."
        },
        {
            question: "How does DataSphere ensure data security?",
            answer: "We employ end-to-end encryption, role-based access control, and regular security audits. DataSphere is compliant with GDPR, SOC 2, and HIPAA."
        }
    ],
    pricing: [
      {
        name: 'Starter',
        price: '99',
        priceSuffix: '/ mo',
        features: ['2 Data Sources', '5 Dashboards', 'Standard Connectors'],
        cta: 'Choose Starter'
      },
      {
        name: 'Business',
        price: '499',
        priceSuffix: '/ mo',
        features: ['10 Data Sources', 'Unlimited Dashboards', 'Advanced Connectors', 'Email Support'],
        cta: 'Choose Business',
        isFeatured: true,
      },
      {
        name: 'Enterprise',
        price: 'Contact Us',
        priceSuffix: '',
        features: ['Unlimited Data Sources', 'Embedded Analytics', 'SSO & Advanced Security', 'Dedicated Support'],
        cta: 'Contact Sales'
      },
    ],
  },
  {
    id: '4',
    slug: 'connect-iq',
    name: 'ConnectIQ',
    category: 'Development',
    tagline: 'Build & Deploy APIs in Minutes.',
    description: 'ConnectIQ is a developer-first platform for building, deploying, and managing APIs. With a powerful code editor, built-in testing, and one-click deployments, you can focus on writing code, not managing infrastructure.',
    keyBenefit: 'Accelerated Development',
    price: 79,
    status: 'Popular',
    heroImage: 'product-connect-iq',
    features: [
        {
            title: "Integrated Code Editor",
            description: "A web-based IDE with linting, debugging, and version control integration (Git).",
            icon: 'Code'
        },
        {
            title: "One-Click Deployments",
            description: "Deploy your APIs to a global, serverless infrastructure with a single click.",
            icon: 'Globe'
        },
        {
            title: "Secure & Scalable",
            description: "Automatic scaling, DDoS protection, and authentication middleware built-in.",
            icon: 'Server'
        }
    ],
    useCases: [
        {
            title: "Rapid Prototyping for Startups",
            description: "Quickly build and iterate on backend services for new applications without worrying about infrastructure.",
            image: "use-case-2"
        },
        {
            title: "Microservices for Enterprises",
            description: "Deconstruct monolithic applications into scalable, manageable microservices with ease.",
            image: "use-case-1"
        }
    ],
    faqs: [
        {
            question: "What languages are supported?",
            answer: "ConnectIQ currently supports Node.js, Python, and Go. We are planning to add support for Java and Ruby in the near future."
        },
        {
            question: "Can I use my own domain?",
            answer: "Yes, all paid plans support custom domains with free, auto-renewing SSL certificates."
        }
    ],
    pricing: [
        {
            name: "Developer",
            price: "29",
            priceSuffix: "/ dev / mo",
            features: ["5 APIs", "100k Requests/mo", "Community Support"],
            cta: "Choose Developer"
        },
        {
            name: "Team",
            price: "79",
            priceSuffix: "/ dev / mo",
            features: ["Unlimited APIs", "1M Requests/mo", "Team Collaboration", "Email Support"],
            cta: "Choose Team",
            isFeatured: true
        },
        {
            name: "Enterprise",
            price: "Contact Us",
            priceSuffix: "",
            features: ["Custom Rate Limits", "VPC Integration", "On-premise Options", "24/7 Support"],
            cta: "Contact Sales"
        }
    ]
  },
];
