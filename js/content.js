// NOTE: these values are inserted into the DOM via innerHTML without escaping (see js/render.js). Never source a field here from user input or an external API without HTML-escaping it first.
export const profile = {
  name: 'Garrett Ennis',
  role: 'AI Security Researcher / Security Engineer',
  tagline: 'Optimizing AI-assisted defenders by building the attackers they have to face.',
  city: 'Suwon',
  // Rendered inside lang="ko" so browsers and screen readers pick the right
  // font and the right voice for it. Keep these fields plain text: render.js
  // wraps them, and markup here would be inserted unescaped.
  cityKorean: '수원',
  country: 'South Korea',
  get location() { return `${this.city}, ${this.country}`; },
  homeBase: 'Maryland, USA',
  email: 'williamgarrettennis@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/garrett-ennis-security/',
    github: 'https://github.com/hi-im-pod',
  },
  resumeHref: 'assets/Garrett_Ennis_CV_General.pdf',
  lookingFor:
    'I am looking for research collaborations and opportunities to present ' +
    'at conferences. If you work on AI-assisted defense, detection ' +
    'engineering, or SOC automation, I would like to hear from you.',
  about:
    'I am a master’s student and researcher at the SecAI Lab at ' +
    'Sungkyunkwan University (SKKU), and a security engineer by ' +
    'background. My work ' +
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
    start: '2024',
    end: '2026',
    bullets: [
      'Led the security engineering and incident response team.',
      'Directed threat hunting initiatives and cloud security operations across Azure and Microsoft 365 environments.',
      'Delivered executive-level reporting and strategic security posture assessments.',
    ],
  },
  {
    role: 'Security Engineer',
    org: 'SysArc',
    start: '2022',
    end: '2024',
    bullets: [
      'Helped enterprises and government contractors reach and maintain NIST 800-171 and CMMC compliance.',
      'Designed and implemented enterprise SOC architectures for commercial and government contractor clients.',
      'Engineered SIEM ingestion pipelines processing firewall, endpoint, and cloud telemetry; improved alert fidelity and reduced noise through structured normalization validation.',
      'Wrote and tuned SIEM detection rules across endpoint, firewall, and cloud telemetry to expand attack coverage.',
      'Managed the cybersecurity tool stack for the proactive services department.',
    ],
  },
  {
    role: 'Software Engineer III, Cybersecurity (Pentest)',
    org: 'Walmart Global Tech',
    start: '2021',
    end: '2022',
    bullets: [
      'Conducted enterprise application penetration testing for web and mobile platforms.',
      'Scoped and ran assessments as the final gate in the application development cycle.',
      'Developed structured threat models and collaborated with engineering teams to integrate secure SDLC controls.',
      'Evaluated authentication, authorization, and input sanitization implementations in high-sensitivity environments.',
    ],
  },
  {
    role: 'Network Administrator',
    org: 'Blue Heron Systems',
    start: '2019',
    end: '2021',
    bullets: [
      'Administered more than 1,000 Cradlepoint routers across hundreds of remote locations.',
      'Designed and integrated a Cisco network backbone.',
      'Conducted recurring security assessments and rapid incident response adjustments.',
    ],
  },
];

export const education = [
  {
    degree: 'M.S. Computer Science and Engineering (AI)',
    org: 'Sungkyunkwan University (SKKU)',
    // Rendered inside lang="ko" so browsers and screen readers pick the right
    // font and the right voice for it.
    orgKorean: '성균관대학교',
    period: 'Sep 2026 – May 2028 (expected)',
    detail: 'SecAI Lab. Research on AI-assisted defense and SOC automation.',
  },
  {
    degree: 'B.S. Computer Networks and Cybersecurity',
    org: 'University of Maryland Global Campus',
    period: '2020–2021',
    detail: 'GPA 3.455 of 4.0. Minor in East Asian Studies.',
  },
  {
    degree: 'Associate degrees, Cyber Security and Computer Networking',
    org: 'Anne Arundel Community College',
    period: '2018–2020',
    detail: 'Dual degrees. Concentration in computer and information systems security and information assurance.',
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
    position:
      'Most of the attention here goes to attack demonstrations. I think the ' +
      'benchmarks matter more. Cybench, NYU CTF Bench, and AgentDojo turn ' +
      '"could an agent do this" into a number, and a number is what lets a ' +
      'defender argue about coverage instead of intuition. I am more ' +
      'optimistic than most about which side gains from this. The same ' +
      'automation that produces an exploit also produces the detection for ' +
      'it, and the defender gets to run it against their own environment first.',
    reading: [
      {
        title: 'Cybench: A Framework for Evaluating Cybersecurity Capabilities and Risks of Language Models',
        authors: 'Zhang et al.',
        venue: 'ICLR',
        year: 2025,
        url: 'https://proceedings.iclr.cc/paper_files/paper/2025/hash/3e9412a9c1d93810ef3ef7825115016b-Abstract-Conference.html',
      },
      {
        title: 'AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents',
        authors: 'Debenedetti et al.',
        venue: 'NeurIPS Datasets and Benchmarks',
        year: 2024,
        url: 'https://proceedings.neurips.cc/paper_files/paper/2024/hash/97091a5177d8dc64b1da8bf3e1f6fb54-Abstract-Datasets_and_Benchmarks_Track.html',
      },
      {
        title: 'NYU CTF Bench: A Scalable Open-Source Benchmark Dataset for Evaluating LLMs in Offensive Security',
        authors: 'Shao et al.',
        venue: 'NeurIPS Datasets and Benchmarks',
        year: 2024,
        url: 'https://proceedings.neurips.cc/paper_files/paper/2024/hash/69d97a6493fbf016fff0a751f253ad18-Abstract-Datasets_and_Benchmarks_Track.html',
      },
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
    position:
      'Both surveys reach the conclusion I reached in production: alert ' +
      'volume, not detection logic, is the binding constraint. That is where ' +
      'I think AI earns its place first, filtering noise rather than trying ' +
      'to replace the analyst. Rule generation is the other half of the ' +
      'problem. If writing a detection gets cheap, coverage expands, and the ' +
      'filtering has to improve at the same rate or the analyst ends up worse ' +
      'off than before.',
    reading: [
      {
        title: 'From Texts to Rules: Generating Sigma Rules with Large Language Models from Cyber Threat Reports',
        authors: 'Cai, Qiu, Li, Cheng, and Chen',
        venue: 'USENIX Security',
        year: 2026,
        url: 'https://www.usenix.org/conference/usenixsecurity26/presentation/cai',
      },
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
    position:
      'Provenance-based detection answers the attribution question and ' +
      'creates a volume question. HOLMES, UNICORN, and MAGIC each produce a ' +
      'graph that an analyst still has to read. The Tea Leaves result is the ' +
      'uncomfortable one, because threat intelligence feeds agree with each ' +
      'other less than most teams assume. Given the choice, I would rather ' +
      'expand rule coverage and filter hard than trust any single feed’s ' +
      'precision.',
    reading: [
      {
        title: 'MAGIC: Detecting Advanced Persistent Threats via Masked Graph Representation Learning',
        authors: 'Jia et al.',
        venue: 'USENIX Security',
        year: 2024,
        url: 'https://www.usenix.org/conference/usenixsecurity24/presentation/jia-zian',
      },
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

// Each project is an approach rather than an artifact, because the systems
// themselves are confidential and a rebuilt toy would prove less than the
// reasoning does.
//
// The four fields below are the write-up. Fill all four and the project gets a
// section on work.html, with its tile on the front page linking there. Leave
// them empty and the tile stays a plain card, so nothing half-written ships.
//
//   constraint  What made this hard. Volume, budget, data quality, politics,
//               a deadline, a compliance boundary. Name the number if there is
//               one: "14,000 alerts a day against two analysts".
//   decision    What you chose. One sentence, in the active voice.
//   rejected    The option you did not take, and why it was wrong HERE rather
//               than wrong in general. This is the beat that shows judgement;
//               the rest is description.
//   measure     How you would know it worked. A metric, not a feeling:
//               false-positive rate, time to triage, coverage against ATT&CK,
//               how long the rule survived contact with the estate.
export const projects = [
  {
    id: 'siem-fidelity',
    title: 'SIEM alert-fidelity pipeline',
    description:
      'A generalized normalization pipeline that validates structured fields before correlation, which cuts false-positive volume in high-telemetry environments.',
    tags: ['SIEM', 'Detection Engineering', 'Python'],
    constraint: '',
    decision: '',
    rejected: '',
    measure: '',
  },
  {
    id: 'cloud-identity',
    title: 'Cloud identity threat model',
    description:
      'A threat-modeling walkthrough for Azure and Microsoft 365 identity flows. It maps privilege-escalation paths and ranks them by what an attacker gains.',
    tags: ['Azure', 'Threat Modeling', 'M365'],
    constraint: '',
    decision: '',
    rejected: '',
    measure: '',
  },
  {
    id: 'apt-infrastructure',
    title: 'APT infrastructure tracking pattern',
    description:
      'A method for correlating adversary infrastructure indicators over time, so hunting starts from infrastructure reuse rather than single indicators.',
    tags: ['Threat Intel', 'OPSEC'],
    constraint: '',
    decision: '',
    rejected: '',
    measure: '',
  },
];
