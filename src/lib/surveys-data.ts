/**
 * Survey System for Learning Communities
 * Surveys help identify essential resources and earn SAT rewards
 */

import { OfflineSurvey } from './offline-storage';

// Default surveys for resource identification
export const defaultSurveys: OfflineSurvey[] = [
  {
    id: 'resource-survey-01',
    title: 'Community Resource Survey',
    description: 'Identify essential survival and learning resources needed in your local zone. Your data helps NGOs allocate inventory.',
    questions: [
      {
        id: 'q1',
        question: 'What type of resources does your community need most?',
        type: 'multiple-choice',
        options: ['Food', 'Clothing', 'Educational materials', 'Technology access', 'Healthcare', 'Other']
      },
      {
        id: 'q2',
        question: 'How often do you have access to clean water?',
        type: 'rating'
      },
      {
        id: 'q3',
        question: 'Describe any specific learning challenges in your area:',
        type: 'text'
      }
    ],
    reward: 0.005,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'infrastructure-survey-01',
    title: 'Learning Infrastructure Assessment',
    description: 'Help us understand the state of educational facilities in your region.',
    questions: [
      {
        id: 'q1',
        question: 'How would you rate your school\'s internet connectivity?',
        type: 'rating'
      },
      {
        id: 'q2',
        question: 'What facilities are missing from your learning environment?',
        type: 'multiple-choice',
        options: ['Library', 'Laboratory', 'Computer room', 'Sports facilities', 'Arts room', 'All available']
      },
      {
        id: 'q3',
        question: 'How many students share one textbook on average?',
        type: 'text'
      }
    ],
    reward: 0.003,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'nutrition-survey-01',
    title: 'Student Nutrition Survey',
    description: 'Understanding food security and its impact on learning outcomes.',
    questions: [
      {
        id: 'q1',
        question: 'Do you receive regular meals during school days?',
        type: 'multiple-choice',
        options: ['Yes, always', 'Yes, sometimes', 'Rarely', 'No']
      },
      {
        id: 'q2',
        question: 'How does hunger affect your ability to learn?',
        type: 'rating'
      },
      {
        id: 'q3',
        question: 'What nutritious foods would help you focus better in class?',
        type: 'text'
      }
    ],
    reward: 0.004,
    completed: false,
    createdAt: new Date().toISOString()
  }
];

// Parties involved in education resource distribution
export const educationParties = {
  ngos: {
    name: 'NGOs',
    description: 'Non-profit organizations providing educational aid and resources',
    benefits: [
      'Targeted resource allocation based on real data',
      'Impact measurement through student feedback',
      'Efficient distribution planning'
    ]
  },
  anonymous: {
    name: 'Anonymous Individuals',
    description: 'Private donors and volunteers contributing to education',
    benefits: [
      'Direct impact visibility through survey responses',
      'Community-driven support networks',
      'Peer-to-peer resource sharing'
    ]
  },
  government: {
    name: 'Government Projects',
    description: 'Public sector educational initiatives and funding',
    benefits: [
      'Data-driven policy making',
      'Resource gap identification',
      'Program effectiveness tracking'
    ]
  },
  investors: {
    name: 'Investors & Loaners',
    description: 'Long-term educational investment and micro-finance',
    benefits: [
      'Low-risk investment opportunities (SAT rewards as collateral)',
      'Community development ROI tracking',
      'Sustainable education funding models'
    ]
  }
};

// Resource types with implementation methods
export const resourceTypes = {
  food: {
    name: 'Food',
    methods: {
      conventional: [
        'School feeding programs (World Food Programme model)',
        'Community gardens and kitchens',
        'Nutritional education integration'
      ],
      nonConventional: [
        'Permaculture food forests in schools',
        'Aquaponics systems for sustainable protein',
        'Food-sharing networks (Food is Free model)'
      ]
    },
    quotes: [
      '"Hunger is not an issue of scarcity, but of access and distribution." - World Food Programme',
      '"Education is the most powerful weapon which you can use to change the world." - Nelson Mandela (on education-nutrition link)'
    ]
  },
  clothing: {
    name: 'Clothing',
    methods: {
      conventional: [
        'School uniform programs',
        'Donation drives and distribution centers',
        'Micro-enterprise tailoring training'
      ],
      nonConventional: [
        'Upcycling workshops in schools',
        'Clothing libraries (borrow, don\'t buy)',
        'Community fiber arts programs'
      ]
    }
  },
  survival: {
    name: 'Survival Resources',
    methods: {
      conventional: [
        'Emergency response protocols',
        'Resource stockpiling and distribution',
        'Community emergency teams'
      ],
      nonConventional: [
        'Bushcraft and survival skills education',
        'Local resource mapping and sharing',
        'Peer-to-peer emergency networks'
      ]
    }
  },
  inquiry: {
    name: 'Inquiry & Research',
    methods: {
      conventional: [
        'Library and laboratory access',
        'Research grant programs',
        'Mentorship and guidance systems'
      ],
      nonConventional: [
        'Citizen science projects',
        'Open-source research collaboration',
        'Peer-led inquiry circles'
      ]
    },
    quotes: [
      '"The important thing is not to stop questioning." - Albert Einstein',
      '"Research is to see what everybody else has seen, and to think what nobody else has thought." - Albert Szent-Gyorgyi'
    ]
  },
  experimentation: {
    name: 'Experimentation',
    methods: {
      conventional: [
        'Science lab programs',
        'Maker space initiatives',
        'Hands-on learning curricula'
      ],
      nonConventional: [
        'DIY science kits from recycled materials',
        'Community tinkering workshops',
        'Open-source hardware projects'
      ]
    }
  },
  guidance: {
    name: 'Guidance & Care',
    methods: {
      conventional: [
        'School counseling services',
        'Mentorship programs',
        'Peer support groups'
      ],
      nonConventional: [
        'Elders and community wisdom integration',
        'Peer-to-peer counseling networks',
        'Trauma-informed community care'
      ]
    }
  }
};