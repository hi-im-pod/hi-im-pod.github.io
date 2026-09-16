// NOTE: these values are inserted into the DOM via innerHTML without escaping (see js/render.js). Never source a field here from user input or an external API without HTML-escaping it first.
export const profile = {
  name: 'Garrett Ennis',
  role: 'AI Security Researcher / Security Engineer',
  tagline: 'Optimizing AI-assisted defenders by building the attackers they have to face.',
  location: 'Suwon, South Korea',
  homeBase: 'Maryland, USA',
  email: 'williamgarrettennis@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/garrett-ennis-security/',
    github: 'https://github.com/hi-im-pod',
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
      'Research in progress, with no published results yet.',
    ],
  },
  {
    role: 'Lead Security Engineer',
    org: 'SysArc',
    start: '2022',
    end: '2026',
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

// Every entry in `reading` is peer reviewed and was checked against the
// publisher's own proceedings page. No preprints.
export const researchInterests = [
  {
    id: 'ai-adversarial',
    title: 'AI-augmented adversarial attack and defense',
    description:
      'How automated offense changes attacker cost, and what detection has to do once reconnaissance and evasion are cheap.',
    reading: [
      {
        title: 'PentestGPT: Evaluating and Harnessing Large Language Models for Automated Penetration Testing',
        authors: 'Deng et al.',
        venue: 'USENIX Security',
        year: 2024,
        url: 'https://www.usenix.org/conference/usenixsecurity24/presentation/deng',
      },
      {
        title: 'Jailbroken: How Does LLM Safety Training Fail?',
        authors: 'Wei, Haghtalab, and Steinhardt',
        venue: 'NeurIPS',
        year: 2023,
        url: 'https://proceedings.neurips.cc/paper_files/paper/2023/hash/fd6613131889a4b656206c50a8bd7790-Abstract-Conference.html',
      },
      {
        title: "Not What You've Signed Up For: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection",
        authors: 'Greshake et al.',
        venue: 'AISec at ACM CCS',
        year: 2023,
        url: 'https://doi.org/10.1145/3605764.3623985',
      },
    ],
  },
  {
    id: 'soc',
    title: 'SOC optimization',
    description:
      'Where AI assistance lowers analyst load, and where it moves the bottleneck instead of removing it.',
    reading: [
      {
        title: 'Alert Fatigue in Security Operations Centres: Research Challenges and Opportunities',
        authors: 'Tariq, Baruwal Chhetri, Nepal, and Paris',
        venue: 'ACM Computing Surveys 57(9)',
        year: 2025,
        url: 'https://doi.org/10.1145/3723158',
      },
      {
        title: 'Alert Prioritisation in Security Operations Centres: A Systematic Survey on Criteria and Methods',
        authors: 'Jalalvand, Baruwal Chhetri, Nepal, and Paris',
        venue: 'ACM Computing Surveys 57(2)',
        year: 2024,
        url: 'https://doi.org/10.1145/3695462',
      },
      {
        title: 'A Human Capital Model for Mitigating Security Analyst Burnout',
        authors: 'Sundaramurthy et al.',
        venue: 'SOUPS',
        year: 2015,
        url: 'https://www.usenix.org/conference/soups2015/proceedings/presentation/sundaramurthy',
      },
    ],
  },
  {
    id: 'threat-hunting',
    title: 'Threat hunting and adversary intelligence',
    description:
      'Hunting, OPSEC, and tracking adversary infrastructure over time, including what that tradecraft costs to sustain.',
    reading: [
      {
        title: 'HOLMES: Real-Time APT Detection through Correlation of Suspicious Information Flows',
        authors: 'Milajerdi et al.',
        venue: 'IEEE Symposium on Security and Privacy',
        year: 2019,
        url: 'https://ieeexplore.ieee.org/document/8835390/',
      },
      {
        title: 'UNICORN: Runtime Provenance-Based Detector for Advanced Persistent Threats',
        authors: 'Han, Pasquier, Bates, Mickens, and Seltzer',
        venue: 'NDSS',
        year: 2020,
        url: 'https://www.ndss-symposium.org/ndss-paper/unicorn-runtime-provenance-based-detector-for-advanced-persistent-threats/',
      },
      {
        title: 'ATLAS: A Sequence-based Learning Approach for Attack Investigation',
        authors: 'Alsaheel et al.',
        venue: 'USENIX Security',
        year: 2021,
        url: 'https://www.usenix.org/conference/usenixsecurity21/presentation/alsaheel',
      },
      {
        title: 'Reading the Tea Leaves: A Comparative Analysis of Threat Intelligence',
        authors: 'Li et al.',
        venue: 'USENIX Security',
        year: 2019,
        url: 'https://www.usenix.org/conference/usenixsecurity19/presentation/li',
      },
    ],
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
