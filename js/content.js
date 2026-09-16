export const profile = {
  name: 'Garrett Ennis',
  role: 'Lead Security Engineer',
  tagline: 'Builds detection systems that separate real threats from noise.',
  location: 'Maryland, USA',
  email: 'williamgarrettennis@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/garrett-ennis-security/',
    github: 'https://github.com/SecAI-Lab',
  },
  resumeHref: 'assets/Garrett_Ennis_CV_General.pdf',
  about:
    "I'm a security engineer focused on detection engineering and SOC " +
    'architecture — building the pipelines and alerting logic that turn ' +
    'raw telemetry into signal analysts can actually act on. My background ' +
    'spans enterprise SIEM design, cloud security operations across Azure ' +
    'and Microsoft 365, and earlier work in application penetration testing ' +
    'and large-scale network infrastructure. Most environments generate far ' +
    'more alerts than any team can triage; the real work is building systems ' +
    'precise enough to surface what actually matters.',
};

export const experience = [
  {
    role: 'Lead Security Engineer',
    org: 'SysArc',
    start: '2022',
    end: 'Present',
    bullets: [
      'Designed and implemented enterprise SOC architectures supporting multiple commercial and government contractor clients.',
      'Engineered SIEM ingestion pipelines processing firewall, endpoint, and cloud telemetry; improved alert fidelity and reduced noise through structured normalization validation.',
      'Directed threat hunting initiatives and cloud security operations across Azure and Microsoft 365 environments.',
      'Implemented NIST 800-171 and CMMC-aligned frameworks for regulated environments.',
      'Delivered executive-level reporting and strategic security posture assessments.',
    ],
  },
  {
    role: 'Cybersecurity Engineer III (Penetration Testing)',
    org: 'Walmart Global Tech',
    start: '2021',
    end: '2022',
    bullets: [
      'Conducted enterprise application penetration testing for web and mobile platforms.',
      'Developed structured threat models and collaborated with engineering teams to integrate secure SDLC controls.',
      'Evaluated authentication and authorization implementations in high-sensitivity environments.',
    ],
  },
  {
    role: 'Network Administrator',
    org: 'Blue Heron Systems',
    start: '2019',
    end: '2021',
    bullets: [
      'Managed distributed infrastructure spanning 900+ branch locations.',
      'Engineered hybrid WAN and VPN routing architectures supporting large-scale enterprise operations.',
      'Conducted recurring security assessments and rapid incident response adjustments.',
    ],
  },
];

export const researchInterests = [
  {
    title: 'AI-augmented adversarial attack & defense',
    description:
      'How adversaries use AI to accelerate reconnaissance and evasion, and how detection systems can adapt to match.',
  },
  {
    title: 'SOC optimization',
    description:
      'Improving alert fidelity and analyst workflow efficiency through structured telemetry normalization and pipeline design.',
  },
  {
    title: 'Threat hunting & adversary intelligence',
    description:
      'Real-world threat hunting, OPSEC, and information gathering on adversaries and advanced persistent threats (APTs).',
  },
];

export const projects = [
  {
    title: 'SIEM alert-fidelity pipeline',
    description:
      'A generalized version of a normalization pipeline pattern used to reduce false-positive volume in high-telemetry SOC environments, illustrating structured field validation before correlation.',
    tags: ['SIEM', 'Detection Engineering', 'Python'],
    illustrative: true,
  },
  {
    title: 'Cloud identity threat model',
    description:
      'A sample threat-modeling walkthrough for Azure/M365 identity flows, showing how privilege-escalation paths get mapped and prioritized.',
    tags: ['Azure', 'Threat Modeling', 'M365'],
    illustrative: true,
  },
  {
    title: 'APT infrastructure tracking pattern',
    description:
      'An illustrative framework for correlating adversary infrastructure indicators over time to support proactive threat hunting.',
    tags: ['Threat Intel', 'OPSEC'],
    illustrative: true,
  },
];
