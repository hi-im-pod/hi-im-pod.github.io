// NOTE: these values are inserted into the DOM via innerHTML without escaping (see js/render.js). Never source a field here from user input or an external API without HTML-escaping it first.
export const profile = {
  name: 'Garrett Ennis',
  role: 'AI Security Researcher / Security Engineer',
  tagline: 'Optimizing AI-assisted defenders by building the attackers they have to face.',
  location: 'Maryland, USA',
  email: 'williamgarrettennis@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/garrett-ennis-security/',
    github: 'https://github.com/SecAI-Lab',
  },
  resumeHref: 'assets/Garrett_Ennis_CV_General.pdf',
  about:
    'I am an AI security researcher at the SecAI Lab at Sungkyunkwan ' +
    'University (SKKU), and a security engineer by background. My work ' +
    'covers both sides of one problem: how AI assistance changes what an ' +
    'attacker can do at scale, and what a defender needs in order to keep ' +
    'pace. Before moving into research, I designed SOC architectures and ' +
    'SIEM ingestion pipelines for regulated environments. The limiting ' +
    'factor there was rarely detection logic. It was alert volume that no ' +
    'team could triage, which is the constraint my research starts from.',
};

export const experience = [
  {
    role: 'AI Security Researcher',
    org: 'SecAI Lab, SKKU',
    start: '2026',
    end: 'Present',
    bullets: [
      'Study how AI assistance changes adversary capability, and what detection has to do once reconnaissance and evasion are cheap to automate.',
      'Evaluate where AI assistance lowers analyst load in a security operations center (SOC), and where it moves the bottleneck instead of removing it.',
    ],
  },
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
    title: 'AI-augmented adversarial attack and defense',
    description:
      'How automated offense changes attacker cost, and what detection has to do once reconnaissance and evasion are cheap.',
  },
  {
    title: 'SOC optimization',
    description:
      'Where AI assistance lowers analyst load, and where it moves the bottleneck instead of removing it.',
  },
  {
    title: 'Threat hunting and adversary intelligence',
    description:
      'Hunting, OPSEC, and tracking adversary infrastructure over time, including what that tradecraft costs to sustain.',
  },
];

export const projects = [
  {
    title: 'SIEM alert-fidelity pipeline',
    description:
      'A generalized normalization pipeline that validates structured fields before correlation, which cuts false-positive volume in high-telemetry environments.',
    tags: ['SIEM', 'Detection Engineering', 'Python'],
    illustrative: true,
  },
  {
    title: 'Cloud identity threat model',
    description:
      'A threat-modeling walkthrough for Azure and Microsoft 365 identity flows. It maps privilege-escalation paths and ranks them by what an attacker gains.',
    tags: ['Azure', 'Threat Modeling', 'M365'],
    illustrative: true,
  },
  {
    title: 'APT infrastructure tracking pattern',
    description:
      'A method for correlating adversary infrastructure indicators over time, so hunting starts from infrastructure reuse rather than single indicators.',
    tags: ['Threat Intel', 'OPSEC'],
    illustrative: true,
  },
];
