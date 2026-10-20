// Every field here is plain text. js/templates.js HTML-escapes each value as it
// builds the page, so a quote, an ampersand or an angle bracket shows as
// itself. The same escaping means markup written here shows as literal tags.
// A field that needs a link or emphasis gets it from its template instead.
export const profile = {
  name: 'Garrett Ennis',
  // The name the lab page and ORCID use. Search engines treat the two forms as
  // different people unless something says they are one, so the structured
  // data carries it as an alternate name.
  legalName: 'William Garrett Ennis',
  role: 'AI Security Researcher / Security Engineer',
  tagline: 'Studying AI-assisted attacks and building evidence-based detections.',
  city: 'Suwon',
  // Rendered inside lang="ko" so browsers and screen readers pick the right
  // font and the right voice for it. The template adds that element around the
  // escaped value, so this stays plain text like every other field.
  cityKorean: '수원',
  country: 'South Korea',
  get location() { return `${this.city}, ${this.country}`; },
  homeBase: 'Maryland, USA',
  // Two addresses, each for one kind of mail. The SKKU address is for research
  // and collaboration. Everything else, recruiters included, goes to the
  // personal address so it stays out of the school inbox.
  email: {
    research: 'redrobe9@g.skku.edu',
    general: 'williamgarrettennis@gmail.com',
  },
  links: {
    linkedin: 'https://www.linkedin.com/in/garrett-ennis-security/',
    github: 'https://github.com/hi-im-pod',
    // The researcher ID that keeps papers attached to this person rather than
    // to the other people who share the name.
    orcid: 'https://orcid.org/0009-0007-6651-9111',
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
      'Evaluate autonomous pentest agents against lab targets, recording their actions and the coverage of the bundled detection rules.',
      'Map where AI trims a security operations center (SOC) analyst’s alert backlog, and where it only relocates the work.',
      'Thesis: whether an AI agent that chooses its own malware analysis steps writes better Sigma detection rules than a fixed workflow. Approved in October 2026, with no results yet.',
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
    detail: 'Completed after transferring credits from Anne Arundel Community College. Minor in East Asian Studies.',
  },
  {
    degree: 'Associate degrees, Cyber Security and Computer Networking',
    org: 'Anne Arundel Community College',
    period: '2018–2020',
    detail: 'Dual degrees. Concentration in computer and information systems security and information assurance.',
  },
];

// Name and verification link only. No dates and no earned/expired state: the
// link goes to Microsoft's page, so anyone who wants that detail can read it
// there. Listed in its own small block, not the education timeline.
export const certifications = [
  {
    name: 'Microsoft Certified: Security Operations Analyst Associate (SC-200)',
    url: 'https://learn.microsoft.com/en-us/users/GarrettEnnis-6599/credentials/91277926DDA9D77F',
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
      'automation could help defenders generate detections from observed ' +
      'attacks. Whether those detections work on new activity without flooding ' +
      'analysts with false alerts is the question my thesis tests.',
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
      'Provenance-based detection connects suspicious activity across events ' +
      'and creates a volume question. HOLMES, UNICORN, and MAGIC each produce a ' +
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

// Most projects are an approach rather than an artifact. The client work is
// described at the level of architecture and reasoning, with no client names or
// data, and a rebuilt toy would prove less than the reasoning does. A project
// that is public in its own right has a `link` instead: { href, label }, with an
// https href. Its tile opens that page in a new tab, and it has no write-up on
// work.html.
//
// `status` is optional. It replaces the "Full write-up" label on the tile and
// heads the write-up, so work that has not produced results yet says so before
// anyone reads the plan as a finished project.
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
//               than wrong in general. This is the beat that shows judgment;
//               the rest is description.
//   measure     How you would know it worked. A metric, not a feeling:
//               false-positive rate, time to triage, coverage against ATT&CK,
//               how long the rule survived contact with the estate.
export const projects = [
  {
    id: 'agent-sigma',
    title: 'Agent-led malware analysis for Sigma rules',
    status: 'Current study',
    description:
      'My thesis. Does an AI agent that chooses its own next analysis step write Sigma rules that catch more malware, with fewer false alerts, than a fixed workflow using the same tools? Approved in October 2026. No results yet.',
    tags: ['Malware Analysis', 'Sigma', 'AI Agents', 'Detection Engineering'],
    constraint: [
      'Generating detection rules with a language model is no longer new. Recent work already '
      + 'turns threat reports and sandbox output into Sigma rules, the vendor-neutral format for '
      + 'detections over log events, and tests them against variants and benign activity. A thesis '
      + 'that only generates rules would repeat that work.',
      'The question I am testing is narrower: whether the analysis steps matter. Packed malware '
      + 'hides its behavior in the file on disk, so what an analyst learns depends on what they do '
      + 'next, such as unpacking it, dumping memory, or running it again. An agent can choose those '
      + 'steps. A fixed workflow runs the same ones every time.',
    ],
    decision: [
      'Compare two workflows that differ only in who picks the analysis steps. Both get the same '
      + 'model, the same rule writer, the same tool menu, and the same resource ceiling. One follows '
      + 'a sequence frozen on development samples. The other lets an agent choose the next step and '
      + 'records each question, action, result, and decision to stop.',
      'Sigma is the main output, written from recorded endpoint activity. YARA rules come second, '
      + 'and only where a specific file or memory artifact supports one. Every behavior claim and '
      + 'every rule condition links back to the event records that support it.',
      'Existing rules and deterministic templates run as controls, so a gain has to beat what '
      + 'simple generation from the same evidence already achieves.',
    ],
    rejected: [
      'Starting by building a general-purpose analysis agent. It is the obvious first step and the '
      + 'wrong one here, because an agent with no fixed baseline beside it cannot show that its '
      + 'choices helped. The plan starts with one reproducible case, then a pilot of 10 to 20 files, '
      + 'and adds adaptive tool choice only after the fixed workflow works.',
      'Counting rules that parse as success. A rule that is valid YAML can still match nothing, or '
      + 'match everything. Each rule has to compile, run against real event records, and be checked '
      + 'against benign activity before it counts.',
      'Treating unpacking as the goal. Unpacking is one way to gather evidence, and the result that '
      + 'matters is whether the rule it leads to detects anything.',
    ],
    measure: [
      'Detection on malware the rules never saw. Rules are written from one set of samples, frozen, '
      + 'then replayed on a sealed set from different payload groups. Related copies stay on the '
      + 'same side of that split, so a repacked copy of a development sample cannot pass as a new one.',
      'False alerts on benign workloads, measured alongside detection. A rule that fires on routine '
      + 'administration costs an analyst more time than it saves.',
      'Behavior accuracy against independently reviewed labels, plus failures, abstentions, and '
      + 'machine cost. If the fixed workflow writes equally useful rules for less, that is a '
      + 'result, and I will report it as one. Engineer review time comes later, as a separate '
      + 'study, and only if the technical results justify it.',
    ],
  },
  {
    id: 'siem-fidelity',
    title: 'Multi-tenant SIEM architecture',
    description:
      'Three SIEM platforms across more than 30 government-contractor clients, each chosen for the estate it had to monitor, all feeding one alert queue.',
    tags: ['SIEM', 'Detection Engineering', 'GCC High', 'Kafka'],
    constraint: [
      'An MSSP with more than 30 SOC customers, all government contractors under CMMC. '
      + 'The estates had almost nothing in common: different services, different architectures, '
      + 'different sites, and devices we did not own. A conventional SOC structure assumes one '
      + 'estate, and there were thirty.',
      'GCC High added a limit of its own. Its management APIs lag the commercial tenant and use '
      + 'different URLs and parameters, so tooling that works against commercial Microsoft does '
      + 'not necessarily work there at all.',
    ],
    decision: [
      'Three platforms, chosen per client rather than one standard, behind a single alert surface.',
      'Sentinel took the GCC High cloud workloads, ingesting through log forwarding, Event Hubs, '
      + 'Defender, and connectors I built for Microsoft XDR, with Azure Arc and the Azure Monitor '
      + 'Agent extending reach to machines outside the tenant. On-premises servers and firewalls '
      + 'went through a local Kafka platform that normalized before writing to an analytics bucket, '
      + 'with syslog split to its own.',
      'AlienVault took the clients outside full FedRAMP scope who were not running SentinelOne. '
      + 'That one is almost entirely agent-based, with API integrations to Azure, FortiGate and '
      + 'whichever EDR the client had, and on-premises sensors forwarding network and firewall data '
      + 'over HTTPS.',
      'SentinelOne took the clients already using it for EDR. I wrote parsers and translators into '
      + 'its parsing engine in regex and JSON, covering whatever applications a client asked for, '
      + 'fed from endpoint agents and a Scalyr agent on a hardened central server. Everything was '
      + 'normalized before it reached the data lake.',
      'Detection was written per platform, as analytics and fusion rules in Sentinel and STAR rules '
      + 'against the SentinelOne lake. One API then polled all three for alerts in near real time '
      + 'and pushed them into the SOC dashboard in our PSA tool, so an analyst worked a single queue.',
    ],
    rejected: [
      'Standardizing on one SIEM and fitting every client to it. That is cheaper to run and it was '
      + 'the wrong answer here, because the estates differed in exactly the ways that decide the '
      + 'tool.',
      'A cloud-native GCC High tenant, a site of on-premises firewalls with no cloud presence, and '
      + 'a client with SentinelOne already deployed are three different ingestion problems. '
      + 'Retrofitting one platform across all three means paying for the mismatch in every '
      + 'environment instead of choosing once per client. Architecture, tooling and scope should '
      + 'follow the environment rather than the other way around.',
    ],
    measure: [
      'Alert latency from source to dashboard, and how long a new client took to stand up.',
      'SentinelOne and AlienVault delivered under a minute. GCC High Sentinel delivered under '
      + 'five in these deployments. Those are operational observations from this design, '
      + 'not latency guarantees for the platforms.',
      'A new client was onboarded in under a week, gated by their own IT team rather than by us. '
      + 'That figure is the real test of choosing per client: a bespoke architecture is only '
      + 'affordable if standing one up is routine, so every deployment was scripted and staged in '
      + 'advance, maintenance scripts included.',
      'Underneath both, one criterion. An analyst worked a single queue, and if the platform '
      + 'behind an alert changed how they triaged it, the architecture had failed.',
    ],
  },
  {
    id: 'apt-explorer',
    title: 'APT Explorer',
    description:
      'A public, non-commercial explorer for the threat-actor data in a CCS 2025 paper by my labmate Shakhzod Yuldoshkhujaev. A Python pipeline rebuilds the data every week, and a static site lets you browse actors, reports and reporting trends.',
    tags: ['Threat Intel', 'Python', 'SvelteKit', 'Open Data'],
    link: { href: 'https://hi-im-pod.github.io/apt-explorer/', label: 'Open APT Explorer' },
    constraint: '',
    decision: '',
    rejected: '',
    measure: '',
  },
  {
    "id": "autonomous-agents",
    "title": "Evaluating autonomous pentest agents",
    "status": "Exploratory lab study",
    "description": "An exploratory study of autonomous pentest agents on intentionally vulnerable lab targets, with recorded outcomes, detection coverage limits, and API spending.",
    "tags": [
      "AI Agents",
      "Detection Engineering",
      "Isolated Lab"
    ],
    "constraint": [
      "I studied how an autonomous pentest platform uses its tools, follows scope restrictions, and reports results against intentionally vulnerable targets. I also checked what the detection rules bundled with the platform could observe.",
      "The lab changed during the investigation. Models, context settings, task permissions, and inherited findings varied. These runs support observations about those configurations, but do not isolate model capability as the cause of every difference."
    ],
    "decision": [
      "Use a lab with a controlled external boundary and deliberately vulnerable targets. Internal segmentation was part of the test environment. Local inference and API inference were separate configurations; API access used a restricted relay.",
      "Run local model profiles and an API model on Metasploitable2, then expand to a segmented lab. Preserve task goals, activity, findings, and account-balance snapshots where the capture harness was used.",
      "Place Suricata on the analysis VM’s target-facing interface with the bundled rules. That sensor did not monitor the internal switch. The rules mainly identified the tool’s HTTP User-Agent strings; this was not a benchmark of general intrusion detection."
    ],
    "rejected": [
      "Treating a restricted task as a security verdict. Task 20 inherited an existing foothold and prohibited further escalation and lateral exploitation. Later tasks allowed more actions and inherited earlier findings. Their different outcomes do not form a controlled prompt-only comparison.",
      "Counting every reported finding as a verified vulnerability. The records mix identification, demonstrated access, and pending findings. Without consistent adjudication and deduplication, the counts cannot establish precision or a model ranking."
    ],
    "measure": [
      "The investigation report lists 4 findings for each of two local profiles and 22 for the API configuration before further follow-up findings. These are reported counts across different task histories, not independently adjudicated unique vulnerabilities from repeated matched trials.",
      "The later assessment notes describe privilege escalation and lateral access during an approximately three-hour autonomous task. Those tasks’ raw database records are not exported in the repository reviewed for this page. I distinguish these documented observations from the captured runs.",
      "The detection report records one alert from a manual signature test before the assessment tasks. It reports no alerts from the subsequent runs under those rules. The narrow rule scope and unmonitored internal segment prevent a recall estimate or a conclusion about general detection effectiveness.",
      "Account snapshots show a $0.12 decrease during task 19 and $0.08 during task 20. The later notes report about $9.13 consumed from the initial $10 credit across the investigation. These are API account-balance changes, excluding local compute, setup, and review; delayed charges prevent exact per-task billing."
    ],
    "measureLabel": "Observations and limits",
    "evidence": {
      "heading": "Methods and evidence",
      "intro": "October 2026 exploratory runs. The evidence below distinguishes captured records from later written summaries. The source repository is private; this page publishes a summary, not a reproducible benchmark.",
      "rows": [
        [
          "Model comparison",
          "The findings report names qwen3.8-bigctx2:27b, superqwen-bigctx:27b, and DeepSeek-flash, with reported counts of 4, 4, and 22.",
          "These are recorded profile labels. Immutable model versions, matched budgets, repeated trials, and a uniform adjudication procedure are not established by the committed evidence."
        ],
        [
          "Captured tasks 19–20",
          "Task 19 records a web-user foothold with a finding marked pending. Task 20 inherits it for restricted enumeration, with up to six workers and a 600-second budget.",
          "The repository includes requests, status snapshots, balances, and activity or monitoring records. Stale task cards show zero counters despite recorded activity."
        ],
        [
          "Later tasks 21–22",
          "Assessment notes report escalation in task 21 and lateral access in task 22. Task 22 is described as approximately three hours, with 48 new findings and 126 including inherited records.",
          "Raw records for these tasks remained in the lab database. Counts are reported records, not a verified vulnerability total; no local capture harness was used."
        ],
        [
          "Detection",
          "The findings report records one manual signature-test alert and no assessment-run alerts from the bundled rules.",
          "Suricata watched the analysis VM interface, not the internal switch. User-Agent signatures do not provide general behavior coverage. The committed record does not establish recall or a false-positive rate."
        ],
        [
          "Cost",
          "Committed balances: task 19, $6.64 to $6.52; task 20, $6.52 to $6.44. Later notes report approximately $0.87 left from $10.",
          "Balance changes can include delayed API charges. The total excludes hardware, electricity, engineering, and review time."
        ]
      ],
      "source": "Source snapshot: private lab repository, commit a7d36aa. FINDINGS_REPORT.md, sections 2, 5, and 6; ASSESSMENT_STATUS.md and its October 19 addendum; captured task 19 and task 20 run directories. Reviewed October 20, 2026.",
      "next": "A follow-up evaluation needs frozen model and framework versions, clean target resets, matched budgets, repeated runs, adjudicated findings, and sensors on every evaluated segment."
    }
  },
];
