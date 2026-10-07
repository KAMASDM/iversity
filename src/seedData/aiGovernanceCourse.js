import { balanceAnswers } from './balanceAnswers.js';

export const aiGovernanceCourse = balanceAnswers({
  title: "AI Governance & Compliance: EU AI Act, NIST & ISO 42001",
  description: "Every organisation using AI now needs a way to manage its risks — and regulators are setting deadlines. Learn the EU AI Act's risk-based rules, the NIST AI Risk Management Framework and ISO/IEC 42001, and build a practical governance program: AI inventory, risk assessments, policies, vendor reviews and AI literacy.",
  category: "AI for Professionals",
  level: "beginner",
  duration: 5,
  topics: [
    "Why AI governance matters now",
    "EU AI Act risk tiers and timeline",
    "Roles: providers, deployers and others",
    "High-risk systems and general-purpose AI obligations",
    "NIST AI Risk Management Framework",
    "ISO/IEC 42001 AI management systems",
    "AI inventory, risk assessments and policies",
    "Vendor due diligence, AI literacy and incident handling"
  ],
  objectives: [
    "Explain why AI governance is a business necessity, not just a legal one",
    "Classify AI use cases under the EU AI Act's risk-based approach and identify your organisation's role",
    "Describe the main obligations for prohibited, high-risk, transparency and general-purpose AI",
    "Use the NIST AI RMF and ISO/IEC 42001 to structure an AI governance program",
    "Build an AI inventory, run risk assessments and write a usable AI policy",
    "Set up vendor reviews, AI literacy training and incident handling"
  ],
  prerequisites: [
    "No legal or technical background required",
    "Useful for managers, compliance, risk, legal, HR, product and IT professionals",
    "Note: this course is educational and not legal advice"
  ],
  published: true,
  chapters: [
    {
      id: "chapter-1",
      title: "Why AI Governance Matters Now",
      description: "Understand the risks, the regulatory momentum and what governance actually means",
      order: 1,
      lessons: [
        {
          id: "lesson-1-1",
          title: "From Experiments to Accountability",
          type: "article",
          content: `# From Experiments to Accountability

A few years ago, AI was mostly experiments in innovation labs. Now it screens job applicants, drafts customer emails, summarises medical notes and recommends loans. When AI makes or shapes decisions about people, someone has to be accountable.

## What Is AI Governance?

**AI governance is the set of policies, roles, processes and controls that make sure an organisation uses AI responsibly, legally and effectively.**

It answers questions like:

- What AI are we using, and for what?
- Who approved it, and who is responsible if it goes wrong?
- What risks does it carry, and how are we managing them?
- Are we meeting our legal obligations?
- How do we know it's still working as intended?

## The Risks Governance Manages

| Risk | Real-world example |
|---|---|
| Discrimination and bias | A hiring tool that ranks candidates lower based on proxies for gender or ethnicity |
| Privacy | Staff pasting customer data into public AI tools |
| Inaccuracy | A chatbot inventing a refund policy the company must then honour |
| Security | Agents manipulated into leaking confidential data |
| Intellectual property | Generated content that reproduces copyrighted material |
| Lack of transparency | Customers unaware they're talking to a bot |
| Operational dependence | A critical process that breaks when a vendor changes its model |

## Why Now?

- **Regulation is arriving.** The EU AI Act is in force with staged deadlines, and other jurisdictions and sectors are adding rules.
- **Customers and partners ask.** Enterprise buyers increasingly send AI questionnaires as part of procurement.
- **Adoption is everywhere.** Many employees use AI tools at work, often without approval ("shadow AI").
- **Mistakes are public.** AI failures become headlines quickly.

## Governance Enables, Not Just Restricts

Good governance isn't a brake. Organisations with clear rules adopt AI **faster**, because teams know what's allowed, approvals are quick, and leaders trust the outcomes. The alternative — no rules — usually ends in either chaos or a blanket ban.

> **Try it:** List three ways AI is used in your organisation (or one you know). For each, who would be accountable if it caused harm? If the answer is unclear, that's a governance gap.

## Key Takeaways

- AI governance = policies, roles, processes and controls for responsible, legal, effective AI
- It manages risks like bias, privacy, inaccuracy, security and transparency
- Clear governance speeds up adoption by making it safe to say yes`,
          estimatedMinutes: 11,
          order: 1
        },
        {
          id: "lesson-1-2",
          title: "The Global Regulatory Landscape",
          type: "article",
          content: `# The Global Regulatory Landscape

There's no single global AI law, but a clear pattern is emerging: risk-based rules, transparency and accountability. Here's the map.

## The Main Approaches

| Region / source | Approach |
|---|---|
| **European Union** | The **AI Act** — a comprehensive, risk-based law covering anyone placing AI on the EU market or whose AI outputs are used in the EU |
| **United States** | No single federal AI law; a mix of existing laws (consumer protection, anti-discrimination, privacy), sector regulators, and a growing number of state laws |
| **United Kingdom** | Principles-based approach applied through existing regulators |
| **China** | Specific rules for algorithms, deepfakes and generative AI services |
| **Many others** | National strategies, sector guidance, and laws in development |

## Existing Laws Already Apply

Even without an AI-specific law, AI uses are covered by rules you already know:

- **Data protection** (such as the GDPR) — lawful basis, transparency, data minimisation, and rights around automated decision-making
- **Anti-discrimination and employment law** — biased hiring or lending tools can be unlawful regardless of whether AI was involved
- **Consumer protection** — misleading claims about AI products, or chatbots that mislead customers
- **Intellectual property** — copyright and trade secrets
- **Sector rules** — financial services, healthcare, insurance and others have their own requirements

## Voluntary Frameworks and Standards

Alongside laws, widely used frameworks help organisations build good practice:

- **NIST AI Risk Management Framework** (United States) — voluntary, widely adopted structure for managing AI risk
- **ISO/IEC 42001** — an international, certifiable standard for AI management systems
- **OECD AI Principles** — high-level principles adopted by many countries

These often become the practical "how" for meeting legal "whats", and customers increasingly ask about them.

## Why the EU AI Act Matters Beyond Europe

The AI Act applies to organisations outside the EU when their AI systems are placed on the EU market or their outputs are used in the EU. Like the GDPR before it, it's becoming a global reference point. That's why we spend the next chapter on it.

## Stay Current

AI regulation is moving fast — deadlines shift, guidance is published and new laws appear. Treat any summary (including this course) as a starting point, and check official sources and legal advice for decisions.

> **Try it:** Identify which jurisdictions your organisation operates in and which sector rules apply to it. That's the first step in knowing which AI requirements matter to you.

## Key Takeaways

- The EU AI Act is the most comprehensive AI law and has global reach
- Existing laws (privacy, discrimination, consumer protection, sector rules) already apply to AI
- NIST AI RMF and ISO/IEC 42001 provide practical structures for compliance`,
          estimatedMinutes: 12,
          order: 2
        },
        {
          id: "lesson-1-3",
          title: "Principles of Trustworthy AI",
          type: "article",
          content: `# Principles of Trustworthy AI

Laws and frameworks differ in detail, but they share a common set of principles. Understanding these makes every specific rule easier to grasp.

## The Core Principles

| Principle | What it means in practice |
|---|---|
| **Accountability** | A named person or team is responsible for each AI system |
| **Transparency** | People know when they're interacting with AI and, where it matters, how decisions are made |
| **Fairness** | Systems are tested for bias and don't produce unjustified discriminatory outcomes |
| **Safety and robustness** | Systems work reliably, handle errors gracefully and resist misuse |
| **Privacy** | Personal data is used lawfully, minimally and securely |
| **Human oversight** | Humans can understand, monitor and override AI where it matters |
| **Security** | Systems are protected against attacks and data leaks |

## From Principles to Practice

Principles are only useful when translated into concrete controls:

- *Accountability* → every AI system in the inventory has an owner
- *Transparency* → chatbots identify themselves as AI; AI-generated content is labelled where required
- *Fairness* → hiring tools are tested for outcome differences across groups before use
- *Human oversight* → a human reviews AI recommendations before adverse decisions about people
- *Safety* → systems are evaluated before launch and monitored after

## Proportionality

Not every AI use needs heavy controls. A tool that suggests email subject lines doesn't need the same oversight as one that recommends medical treatments. Good governance is **risk-based**: effort scales with potential harm. That's also the core idea of the EU AI Act.

## Human Oversight Done Right

"Human in the loop" can be meaningless if the human just rubber-stamps AI output. Effective oversight requires:

- People with the competence and authority to disagree with the AI
- Enough time and information to make a real judgement
- Awareness of **automation bias** — the tendency to over-trust automated suggestions
- Monitoring of override rates (if humans never override, ask why)

> **Try it:** Pick one AI use case and write one concrete control for each of the seven principles. Which were easy, and which were hard?

## Key Takeaways

- Common principles: accountability, transparency, fairness, safety, privacy, oversight, security
- Translate principles into concrete, testable controls
- Scale controls to risk, and make human oversight real rather than a rubber stamp`,
          estimatedMinutes: 11,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q1-1",
            question: "What does AI governance primarily consist of?",
            options: [
              "Buying the most advanced AI tools",
              "Policies, roles, processes and controls for responsible, legal and effective AI use",
              "Banning AI in the workplace",
              "Training AI models internally"
            ],
            correctAnswer: 1,
            explanation: "Governance defines who decides, what's allowed and how risks are managed across the AI lifecycle."
          },
          {
            id: "q1-2",
            question: "Does an organisation outside the EU ever need to consider the EU AI Act?",
            options: [
              "No, never",
              "Yes, when its AI systems are placed on the EU market or their outputs are used in the EU",
              "Only if it has an EU office",
              "Only for open-source models"
            ],
            correctAnswer: 1,
            explanation: "Like the GDPR, the AI Act has extraterritorial reach based on where AI is placed on the market or used."
          },
          {
            id: "q1-3",
            question: "What does 'risk-based' governance mean?",
            options: [
              "Every AI system gets identical controls",
              "The level of controls scales with the potential harm of the AI use",
              "Only risky companies need governance",
              "Risk is assessed only after incidents"
            ],
            correctAnswer: 1,
            explanation: "Proportionality focuses effort where harm could be greatest, keeping low-risk uses lightweight."
          },
          {
            id: "q1-4",
            question: "What is 'automation bias'?",
            options: [
              "AI models preferring certain languages",
              "The human tendency to over-trust automated suggestions",
              "Robots replacing workers",
              "A type of training data error"
            ],
            correctAnswer: 1,
            explanation: "Automation bias undermines human oversight; reviewers need the competence, time and authority to disagree."
          }
        ]
      }
    },
    {
      id: "chapter-2",
      title: "The EU AI Act Explained",
      description: "Risk tiers, roles, obligations, penalties and the evolving timeline",
      order: 2,
      lessons: [
        {
          id: "lesson-2-1",
          title: "The Risk Pyramid",
          type: "article",
          content: `# The Risk Pyramid

The EU AI Act sorts AI uses into risk levels. Your obligations depend on where a use case falls, so classification is the first step for every AI system.

## The Four Levels

| Level | What it covers | Consequence |
|---|---|---|
| **Unacceptable risk** | Practices considered a clear threat to safety or rights | **Prohibited** |
| **High risk** | AI in sensitive areas affecting people's lives, or safety components of regulated products | Strict requirements before and after deployment |
| **Limited / transparency risk** | Systems such as chatbots and AI-generated or manipulated content | Disclosure and labelling obligations |
| **Minimal risk** | Most AI uses — spam filters, recommendations, writing assistance | No new obligations (voluntary codes encouraged) |

Separately, the Act sets rules for **general-purpose AI (GPAI) models** — the large models that power many applications.

## Prohibited Practices (Examples)

These have been banned since February 2025:

- Manipulative or deceptive techniques that materially distort behaviour and cause significant harm
- Exploiting vulnerabilities due to age, disability or social or economic situation
- Social scoring that leads to unjustified detrimental treatment
- Predicting criminal behaviour based solely on profiling or personality traits
- Untargeted scraping of facial images to build facial recognition databases
- Emotion recognition in workplaces and educational institutions (with narrow exceptions such as medical or safety reasons)
- Biometric categorisation to infer sensitive characteristics like race, political views or sexual orientation
- Real-time remote biometric identification in public spaces for law enforcement, except in narrowly defined situations

## High-Risk Areas (Annex III Examples)

- **Employment** — recruitment, screening, promotion, termination, task allocation and performance monitoring
- **Education** — admissions, grading, exam proctoring
- **Access to essential services** — creditworthiness, certain insurance pricing, public benefits eligibility
- **Critical infrastructure** — safety components in utilities and traffic
- **Biometrics** — remote identification and categorisation (where not prohibited)
- **Law enforcement, migration, justice and democratic processes**

AI that is a safety component of products already covered by EU product rules (such as machinery or medical devices) can also be high-risk.

## Classification Is a Judgement Call

Some systems in Annex III areas may not be high-risk if they only perform narrow preparatory tasks and don't materially influence decisions — but this exception is limited (for example, it doesn't apply where profiling of people is involved) and must be documented.

> **Try it:** Classify these: (a) a chatbot answering product questions, (b) a CV-screening tool ranking applicants, (c) an AI spam filter, (d) a webcam tool that infers employees' emotions during meetings.

*(Answers: limited/transparency, high-risk, minimal, prohibited.)*

## Key Takeaways

- Four levels: prohibited, high-risk, transparency, minimal — plus separate GPAI model rules
- Prohibited practices have applied since February 2025
- Employment, education, credit and essential services are key high-risk areas`,
          estimatedMinutes: 13,
          order: 1
        },
        {
          id: "lesson-2-2",
          title: "Roles and Obligations",
          type: "article",
          content: `# Roles and Obligations

Under the AI Act, *what* you must do depends on *who* you are in relation to an AI system. Most organisations are deployers; some are also providers.

## The Key Roles

| Role | Who | Example |
|---|---|---|
| **Provider** | Develops an AI system or model (or has it developed) and places it on the market or puts it into service under its own name | A software company selling an AI hiring tool |
| **Deployer** | Uses an AI system under its authority in a professional context | A company using that hiring tool to screen applicants |
| **Importer / distributor** | Brings AI systems into the EU market or makes them available | Resellers and EU importers |

Watch out: you can **become a provider** if you put your name on a system, substantially modify a high-risk system, or change its intended purpose so it becomes high-risk.

## High-Risk Obligations for Providers

- A **risk management system** across the lifecycle
- **Data governance** — relevant, representative training data, examined for bias
- **Technical documentation** and record-keeping (automatic logging)
- **Transparency** — clear instructions for deployers
- **Human oversight** designed into the system
- **Accuracy, robustness and cybersecurity**
- A **quality management system**, conformity assessment, CE marking and registration in the EU database
- **Post-market monitoring** and serious-incident reporting

## High-Risk Obligations for Deployers

- Use the system according to the provider's instructions
- Assign **human oversight** to competent people with authority
- Ensure input data is relevant for the intended purpose (where you control it)
- **Monitor** operation and inform the provider of risks or incidents
- **Keep logs** generated by the system for an appropriate period
- **Inform workers and their representatives** before using high-risk AI in the workplace
- Inform people when high-risk AI makes or helps make decisions about them, where required
- Some deployers (such as public bodies and certain credit and insurance uses) must conduct a **fundamental rights impact assessment**

## Transparency Obligations

- Tell people when they're interacting with an AI system (unless obvious)
- Mark AI-generated synthetic content in a machine-readable way (providers)
- Disclose deepfakes and certain AI-generated text published to inform the public (deployers)
- Inform people exposed to emotion recognition or biometric categorisation systems

## AI Literacy

Since February 2025, providers and deployers must take measures to ensure a sufficient level of **AI literacy** among staff who operate or use AI systems — appropriate to their role and context. This applies regardless of risk level, and is a practical starting point for every organisation (see Chapter 5).

> **Try it:** For two AI systems your organisation uses, decide whether you're the provider, the deployer, or both. Could any planned customisation turn you into a provider?

## Key Takeaways

- Providers build and place AI on the market; deployers use it professionally
- High-risk obligations are heaviest for providers, but deployers have real duties too
- Transparency and AI literacy obligations apply broadly`,
          estimatedMinutes: 13,
          order: 2
        },
        {
          id: "lesson-2-3",
          title: "General-Purpose AI, Timeline and Penalties",
          type: "article",
          content: `# General-Purpose AI, Timeline and Penalties

The AI Act phases in over several years, and its schedule has already been adjusted. Here's how to think about timing, GPAI models and enforcement.

## General-Purpose AI (GPAI) Models

GPAI models — large models capable of many tasks — have their own rules for **model providers**, applying since **August 2025**:

- Technical documentation for regulators and information for downstream providers
- A policy to comply with EU copyright law
- A sufficiently detailed public summary of training content

Models designated as having **systemic risk** (the most capable ones) face extra duties: model evaluations and adversarial testing, risk assessment and mitigation, serious-incident reporting and cybersecurity protections. A voluntary **Code of Practice** helps providers demonstrate compliance.

If you only *use* a GPAI model through an API to build your own application, these model-provider duties generally fall on the model provider — but your application may have its own obligations depending on its use.

## The Timeline

| Date | What applies |
|---|---|
| **1 Aug 2024** | AI Act enters into force |
| **2 Feb 2025** | Prohibited practices banned; AI literacy obligations |
| **2 Aug 2025** | GPAI model obligations; governance structures and penalties framework |
| **2026 onwards** | Remaining obligations phase in, including transparency duties |
| **High-risk systems** | Originally due from August 2026 (Annex III) and August 2027 (product-embedded). Under the "Digital Omnibus" agreed by EU lawmakers in 2026, these were set to move to **December 2027** and **August 2028** respectively, while standards and guidance are completed |

**Always check the current official timeline.** The postponement doesn't change *what* is required — it gives organisations more time to prepare. Smart teams use it to build governance now rather than rushing later.

## Penalties

Fines are tiered by severity (the higher of a fixed amount or a percentage of worldwide annual turnover, with adjustments for smaller companies):

- **Prohibited practices:** up to €35 million or 7%
- **Most other obligations:** up to €15 million or 3%
- **Supplying incorrect or misleading information to authorities:** up to €7.5 million or 1%

## Enforcement

National market surveillance authorities enforce most rules; the EU's **AI Office** oversees GPAI models. Each member state also has to set up structures such as regulatory sandboxes to support innovation.

> **Try it:** Build a simple timeline for your organisation: which obligations already apply to you today, and which are coming? Mark which ones need preparation work to start this quarter.

## Key Takeaways

- GPAI model providers have had obligations since August 2025, with extra duties for systemic-risk models
- Prohibitions and AI literacy have applied since February 2025; high-risk deadlines were pushed back in 2026
- Penalties reach up to €35M or 7% of global turnover for prohibited practices`,
          estimatedMinutes: 13,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q2-1",
            question: "Under the EU AI Act, a tool that infers employees' emotions from webcam footage during meetings is most likely…",
            options: [
              "Minimal risk",
              "A prohibited practice (emotion recognition in the workplace, absent narrow exceptions)",
              "Only a transparency obligation",
              "Not covered by the Act"
            ],
            correctAnswer: 1,
            explanation: "Emotion recognition in workplaces and education is prohibited except for narrow medical or safety reasons."
          },
          {
            id: "q2-2",
            question: "A company uses a third-party AI tool to screen job applicants. What is its main role under the AI Act?",
            options: [
              "Provider",
              "Deployer",
              "Importer",
              "Distributor"
            ],
            correctAnswer: 1,
            explanation: "Using an AI system under your authority in a professional context makes you a deployer — with real obligations for high-risk uses like hiring."
          },
          {
            id: "q2-3",
            question: "Which obligation has applied to providers and deployers since February 2025, regardless of risk level?",
            options: [
              "CE marking",
              "Ensuring sufficient AI literacy among relevant staff",
              "Registering every chatbot",
              "Annual external audits"
            ],
            correctAnswer: 1,
            explanation: "AI literacy obligations apply broadly and are a practical first step for any organisation."
          },
          {
            id: "q2-4",
            question: "What is the maximum fine for engaging in prohibited AI practices?",
            options: [
              "€1 million",
              "Up to €35 million or 7% of worldwide annual turnover, whichever is higher",
              "€500,000",
              "There are no fines, only warnings"
            ],
            correctAnswer: 1,
            explanation: "Prohibited practices carry the highest penalty tier in the AI Act."
          }
        ]
      }
    },
    {
      id: "chapter-3",
      title: "Frameworks: NIST AI RMF and ISO/IEC 42001",
      description: "Use proven frameworks to structure how your organisation manages AI risk",
      order: 3,
      lessons: [
        {
          id: "lesson-3-1",
          title: "The NIST AI Risk Management Framework",
          type: "article",
          content: `# The NIST AI Risk Management Framework

The NIST AI Risk Management Framework (AI RMF) is a voluntary framework from the US National Institute of Standards and Technology. It's widely used worldwide as a practical structure for managing AI risk.

## The Four Functions

| Function | Purpose | Example activities |
|---|---|---|
| **Govern** | Build the culture, policies and accountability for AI risk management | AI policy, roles and responsibilities, risk tolerance, training |
| **Map** | Understand the context of each AI system and identify risks | Intended purpose, affected people, legal requirements, potential harms |
| **Measure** | Analyse, assess and track the identified risks | Bias testing, accuracy and robustness evaluation, red teaming, monitoring metrics |
| **Manage** | Prioritise and act on risks | Mitigations, go/no-go decisions, incident response, decommissioning |

**Govern** sits across everything; **Map → Measure → Manage** repeats for each AI system throughout its lifecycle.

## Characteristics of Trustworthy AI

The framework describes what "trustworthy" means:

- Valid and reliable
- Safe
- Secure and resilient
- Accountable and transparent
- Explainable and interpretable
- Privacy-enhanced
- Fair, with harmful bias managed

These characteristics give you a checklist for what to measure.

## The Generative AI Profile

NIST has published a **Generative AI Profile** that applies the framework to generative AI, highlighting risks such as confabulation (confidently wrong outputs), information integrity, data privacy, intellectual property, harmful content and information security — along with suggested actions.

## How Organisations Use It

- As the **backbone of an AI risk program**, mapping existing processes to the four functions
- As a **common language** between technical teams, risk, legal and leadership
- As **evidence** for customers and partners that AI risk is managed systematically
- Alongside the EU AI Act: the AI Act says *what* is required; the RMF helps structure *how*

## It's Flexible by Design

The RMF isn't a checklist you pass or fail, and it isn't certifiable. You adapt it to your size, sector and risk profile. A startup might implement a lightweight version in a few documents; a bank might build an extensive program.

> **Try it:** Take one AI system you know and write one sentence for each function: how is it governed, what risks did mapping reveal, how are they measured, and how are they managed?

## Key Takeaways

- NIST AI RMF has four functions: Govern, Map, Measure, Manage
- It defines characteristics of trustworthy AI that tell you what to measure
- It's voluntary and flexible — a structure for the "how" of AI risk management`,
          estimatedMinutes: 12,
          order: 1
        },
        {
          id: "lesson-3-2",
          title: "ISO/IEC 42001: AI Management Systems",
          type: "article",
          content: `# ISO/IEC 42001: AI Management Systems

ISO/IEC 42001, published in 2023, is the first international standard for an **AI management system (AIMS)**. Unlike the NIST framework, organisations can be **certified** against it.

## What Is a Management System?

If you know ISO 27001 (information security) or ISO 9001 (quality), you know the pattern: a management system is the set of policies, objectives, processes and continual improvement cycles an organisation uses to manage something systematically. ISO/IEC 42001 applies this to AI.

## The Structure

Like other ISO management system standards, it follows **Plan–Do–Check–Act**:

| Stage | Key requirements |
|---|---|
| **Plan** | Understand context and stakeholders; set the scope; leadership commitment; AI policy; assess AI risks and impacts; set objectives |
| **Do** | Provide resources and competence; implement controls; manage the AI system lifecycle and third parties |
| **Check** | Monitor and measure; internal audits; management review |
| **Act** | Fix nonconformities; continually improve |

An annex lists **controls** covering areas such as AI policies, internal organisation, resources, impact assessment, the AI lifecycle, data, information for interested parties, use of AI systems and third-party relationships.

## AI Impact Assessments

A distinctive element is assessing the **impact of AI systems on individuals, groups and society** — not only on the organisation. This aligns closely with the AI Act's focus on fundamental rights.

## Why Organisations Pursue Certification

- **Trust** — independent evidence for customers, partners and regulators
- **Procurement** — increasingly requested in enterprise and public-sector tenders
- **Structure** — a proven way to organise governance rather than inventing one
- **Integration** — fits alongside existing ISO 27001 or ISO 9001 programs

## NIST vs. ISO: Better Together

| | NIST AI RMF | ISO/IEC 42001 |
|---|---|---|
| Nature | Voluntary framework | International standard |
| Certifiable? | No | Yes |
| Focus | Risk management functions and trustworthiness | A complete management system with controls |
| Best use | Flexible structure for risk activities | Formal, auditable governance program |

Many organisations use NIST's functions to shape their risk work and ISO/IEC 42001 to formalise and certify the overall system.

> **Try it:** If your organisation has ISO 27001 or ISO 9001, list two existing processes (such as internal audit or document control) that could be extended to cover AI.

## Key Takeaways

- ISO/IEC 42001 defines a certifiable AI management system using Plan–Do–Check–Act
- It includes AI impact assessments covering effects on individuals and society
- NIST AI RMF and ISO/IEC 42001 complement each other`,
          estimatedMinutes: 12,
          order: 2
        },
        {
          id: "lesson-3-3",
          title: "Mapping Frameworks to Regulation",
          type: "article",
          content: `# Mapping Frameworks to Regulation

You don't want three separate compliance programs for the AI Act, NIST and ISO. The trick is to build **one set of controls** and map it to each requirement.

## The "Build Once, Comply Many" Approach

| Control | EU AI Act | NIST AI RMF | ISO/IEC 42001 |
|---|---|---|---|
| AI inventory and classification | Needed to know your obligations | Map | Context and scope |
| Named owners and roles | Provider/deployer duties, oversight | Govern | Leadership, roles |
| Risk and impact assessment | Risk management; fundamental rights impact assessment where required | Map, Measure | AI risk and impact assessment |
| Data governance and bias testing | Data quality requirements (high-risk) | Measure | Data controls |
| Documentation and logging | Technical documentation, logs | Govern, Manage | Documented information |
| Human oversight procedures | Required for high-risk | Manage | Lifecycle controls |
| Monitoring and incident reporting | Post-market monitoring, serious incidents | Manage | Check / Act |
| Vendor management | Deployer and provider relationships | Govern | Third-party controls |
| AI literacy training | Required since Feb 2025 | Govern | Competence and awareness |

## Where to Start

1. **Inventory** — you can't classify or control what you don't know about
2. **Classify** each system by risk and by your role
3. **Gap-assess** the highest-risk systems against the relevant requirements
4. **Prioritise** — prohibited-practice checks and AI literacy first (already applicable), then high-risk preparation
5. **Implement** shared controls and document them once
6. **Review** regularly as laws, guidance and your AI use change

## Evidence Matters

Compliance isn't just doing the right things — it's being able to **show** you did them. Keep:

- Assessment records and approval decisions
- Test results (bias, accuracy, security)
- Training records
- Monitoring reports and incident logs
- Vendor documentation and contracts

## Avoid Paper Compliance

The goal isn't a binder of policies nobody follows. Controls should be built into how teams actually work: inside procurement, product development and change processes. If governance only exists in documents, it will fail its first real test.

> **Try it:** Pick three rows from the table and describe how your organisation does each today — even informally. Where's the biggest gap?

## Key Takeaways

- Build one set of controls and map it to the AI Act, NIST AI RMF and ISO/IEC 42001
- Start with inventory and classification, then gap-assess high-risk systems
- Keep evidence, and embed controls in real workflows rather than paper policies`,
          estimatedMinutes: 12,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q3-1",
            question: "What are the four functions of the NIST AI Risk Management Framework?",
            options: [
              "Plan, Do, Check, Act",
              "Govern, Map, Measure, Manage",
              "Identify, Protect, Detect, Respond",
              "Design, Build, Test, Deploy"
            ],
            correctAnswer: 1,
            explanation: "Govern spans everything, while Map, Measure and Manage repeat for each AI system across its lifecycle."
          },
          {
            id: "q3-2",
            question: "What is a key difference between ISO/IEC 42001 and the NIST AI RMF?",
            options: [
              "NIST is mandatory worldwide",
              "Organisations can be certified against ISO/IEC 42001; the NIST AI RMF is a voluntary, non-certifiable framework",
              "ISO/IEC 42001 only applies to hardware",
              "They cover completely unrelated topics"
            ],
            correctAnswer: 1,
            explanation: "ISO/IEC 42001 defines an auditable management system; NIST provides a flexible risk framework. They complement each other."
          },
          {
            id: "q3-3",
            question: "What cycle does ISO/IEC 42001 follow, like other ISO management system standards?",
            options: [
              "Map–Measure–Manage",
              "Plan–Do–Check–Act",
              "Build–Measure–Learn",
              "Assess–Approve–Archive"
            ],
            correctAnswer: 1,
            explanation: "Plan–Do–Check–Act drives continual improvement of the AI management system."
          },
          {
            id: "q3-4",
            question: "What is the recommended first step in building an AI governance program?",
            options: [
              "Writing a 50-page policy",
              "Creating an inventory of the AI systems in use",
              "Buying an AI governance platform",
              "Seeking certification immediately"
            ],
            correctAnswer: 1,
            explanation: "You can't classify, assess or control AI systems you don't know exist."
          }
        ]
      }
    },
    {
      id: "chapter-4",
      title: "Building Your AI Governance Program",
      description: "Inventory, risk assessments, policies and the people who make it work",
      order: 4,
      lessons: [
        {
          id: "lesson-4-1",
          title: "Building an AI Inventory",
          type: "article",
          content: `# Building an AI Inventory

An AI inventory (or register) is the foundation of governance. It's a living list of every AI system your organisation builds, buys or uses — and the key facts about each.

## What Counts as an AI System?

More than you think:

- Products and features you build with AI
- Vendor tools with AI built in (HR platforms, CRMs, customer service suites)
- General-purpose assistants staff use (chat assistants, copilots)
- AI embedded in everyday software (meeting transcription, writing suggestions)
- Internal scripts or models built by data teams

## What to Record

| Field | Example |
|---|---|
| Name and description | "CV screening module in our applicant tracking system" |
| Owner | Head of Talent Acquisition |
| Vendor / built in-house | Vendor X |
| Purpose and users | Ranks applicants for recruiters |
| People affected | Job applicants |
| Data used | CVs, application forms (personal data) |
| Our role | Deployer |
| Risk classification | High-risk (employment) |
| Status | In use since March 2026 |
| Key controls | Human review of all rejections; annual bias audit |
| Review date | March 2027 |

## How to Find Everything

- **Survey teams** — short questionnaire: "Which tools with AI features do you use?"
- **Procurement and finance records** — software subscriptions and expense claims
- **IT and security data** — network logs and app catalogues can reveal unapproved tools
- **Vendor communications** — many vendors have added AI features to existing products
- **Ongoing intake** — make registering new AI part of procurement and project approval

## Shadow AI

Employees often use AI tools without approval because they're useful and easy. Banning them rarely works — it just drives usage out of sight. Better:

- Provide approved alternatives that meet people's needs
- Make the approval process fast for low-risk tools
- Give clear guidance on what data must never be entered into unapproved tools

## Keep It Alive

An inventory that's out of date is worse than useless — it creates false confidence. Assign an owner, connect it to procurement and change processes, and review it at least quarterly.

> **Try it:** Start an inventory with five AI systems you know your organisation uses. Fill in owner, purpose, people affected, data used, your role and a first-pass risk level.

## Key Takeaways

- The AI inventory is the foundation for classification, controls and compliance
- Include built, bought and embedded AI — including general assistants
- Address shadow AI with approved alternatives and fast approvals, and keep the inventory current`,
          estimatedMinutes: 12,
          order: 1
        },
        {
          id: "lesson-4-2",
          title: "Running AI Risk and Impact Assessments",
          type: "article",
          content: `# Running AI Risk and Impact Assessments

Once you know what AI you have, assess what could go wrong — and for whom. Scale the depth of the assessment to the risk.

## Tiered Assessment

| Tier | Example uses | Assessment |
|---|---|---|
| Low | Grammar suggestions, internal brainstorming | Short checklist (5 minutes) |
| Medium | Customer-facing chatbot, marketing content generation | Standard assessment with owner sign-off |
| High | Hiring, credit, health, safety-related uses | Full risk and impact assessment, testing evidence, governance committee approval |

## A Standard Assessment Template

**1. Purpose and context**
- What problem does it solve? What decisions does it influence?
- Who uses it, and who is affected?

**2. Legal and policy check**
- Any prohibited practice? Is it high-risk under the AI Act or sector rules?
- Personal data involved? (Coordinate with privacy impact assessments)

**3. Risk identification**

| Area | Questions |
|---|---|
| Fairness | Could outcomes differ unjustifiably across groups? |
| Accuracy | What happens when it's wrong? How often might that be? |
| Transparency | Do affected people know AI is involved? Can decisions be explained? |
| Privacy and security | What data flows where? Could it leak? |
| Oversight | Who reviews outputs, and can they override? |
| Dependency | What if the vendor changes or discontinues the system? |

**4. Mitigations**
Controls for each significant risk, with owners and deadlines.

**5. Decision**
Approve, approve with conditions, or reject — with the reasons recorded.

**6. Monitoring plan**
What will be measured after launch, and when it will be reviewed.

## Impact on People

For high-risk uses, go beyond organisational risk to the **impact on affected individuals and groups**: their rights, opportunities and wellbeing. Involve people who understand those groups — including, where possible, representatives of those affected.

## Testing Evidence

Assessments should be grounded in evidence, not just opinions: bias testing results, accuracy evaluations, security reviews and pilot results.

> **Try it:** Run a short assessment of one medium-risk AI use using the six-part template. Record your decision and one condition for approval.

## Key Takeaways

- Tier assessments so effort matches risk
- Cover purpose, legal check, risks, mitigations, decision and monitoring
- For high-risk uses, assess the impact on affected people and base decisions on testing evidence`,
          estimatedMinutes: 13,
          order: 2
        },
        {
          id: "lesson-4-3",
          title: "Policies, Roles and Decision-Making",
          type: "article",
          content: `# Policies, Roles and Decision-Making

Governance needs clear rules and clear decision-makers. Too little structure leads to chaos; too much leads to everyone avoiding the process.

## The AI Acceptable Use Policy

Every organisation needs a short, readable policy for employees. It should cover:

- **Approved tools** and how to request new ones
- **Data rules** — what must never be entered into AI tools (e.g. customer personal data, confidential financials, source code) unless the tool is approved for it
- **Human responsibility** — staff remain accountable for work they produce with AI and must check outputs
- **Disclosure** — when to tell customers or colleagues that AI was used
- **Prohibited uses** — e.g. making final decisions about people without human review
- **Reporting** — how to report problems or incidents

Keep it to two pages. A policy people don't read doesn't protect anyone.

## Governance Roles

| Role | Responsibilities |
|---|---|
| **Executive sponsor** | Sets direction and risk appetite; resolves escalations |
| **AI governance committee** | Cross-functional group (legal, privacy, security, risk, business, technical) that approves high-risk uses and sets policy |
| **AI governance lead** | Runs the program day to day: inventory, assessments, training |
| **System owners** | Accountable for each AI system's risks and controls |
| **Builders and users** | Follow policies, raise concerns, maintain documentation |

Smaller organisations can combine roles — what matters is that each responsibility is clearly owned.

## Decision Rights

Avoid sending every request to a committee:

- **Low-risk:** pre-approved, or approved by a manager with the checklist
- **Medium-risk:** approved by the system owner plus the governance lead
- **High-risk:** approved by the committee with full assessment

Publish target turnaround times. A process that takes three months for a low-risk tool will be bypassed.

## Make It Part of Existing Processes

Embed AI checks where decisions already happen:

- **Procurement** — AI questions in vendor onboarding
- **Product development** — AI assessment in design reviews
- **Change management** — re-assessment when an AI system's purpose, data or model changes
- **Risk reporting** — AI risks included in the organisation's risk register

> **Try it:** Draft the "data rules" section of an AI acceptable use policy for your organisation in five bullet points.

## Key Takeaways

- A short, practical acceptable use policy guides everyday AI use
- Define roles from executive sponsor to system owner, combining them in smaller organisations
- Tier decision rights and embed AI checks into existing processes`,
          estimatedMinutes: 12,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q4-1",
            question: "Which of these should be included in an AI inventory?",
            options: [
              "Only AI systems built in-house",
              "Built, bought and embedded AI, including general-purpose assistants staff use",
              "Only systems classified as high-risk",
              "Only systems with more than 1,000 users"
            ],
            correctAnswer: 1,
            explanation: "A complete inventory covers all AI in use; classification and controls follow from it."
          },
          {
            id: "q4-2",
            question: "What is the most effective response to 'shadow AI' (unapproved AI tool use)?",
            options: [
              "Ban all AI tools",
              "Provide approved alternatives, fast approvals for low-risk tools, and clear data rules",
              "Ignore it",
              "Monitor and discipline every employee"
            ],
            correctAnswer: 1,
            explanation: "Bans push usage out of sight. Meeting needs safely brings AI use into governance."
          },
          {
            id: "q4-3",
            question: "Why should risk assessments be tiered?",
            options: [
              "To save paper",
              "So effort matches the potential harm, keeping low-risk uses fast and high-risk uses rigorous",
              "Because regulators require exactly three tiers",
              "To avoid assessing high-risk systems"
            ],
            correctAnswer: 1,
            explanation: "Proportionate assessment keeps governance usable while focusing scrutiny where it matters."
          },
          {
            id: "q4-4",
            question: "What should an AI acceptable use policy for employees emphasise about responsibility?",
            options: [
              "The AI vendor is responsible for all outputs",
              "Staff remain accountable for work they produce with AI and must check outputs",
              "Nobody is responsible for AI outputs",
              "Only the IT team is responsible"
            ],
            correctAnswer: 1,
            explanation: "Using AI doesn't transfer accountability; people must review and own what they produce."
          }
        ]
      }
    },
    {
      id: "chapter-5",
      title: "Operating Governance Day to Day",
      description: "Vendor due diligence, AI literacy, monitoring and incidents in practice",
      order: 5,
      lessons: [
        {
          id: "lesson-5-1",
          title: "Vendor Due Diligence for AI",
          type: "article",
          content: `# Vendor Due Diligence for AI

Most organisations use far more AI than they build. Your obligations don't disappear when the AI comes from a vendor — so ask the right questions before signing.

## Key Questions for AI Vendors

**Purpose and performance**
- What exactly does the AI do, and what is it designed *not* to be used for?
- How was it tested? Can you share accuracy and bias testing results relevant to our use?
- What are its known limitations?

**Data**
- What data of ours does it process and store, and where?
- Is our data used to train or improve models? Can we opt out?
- How long is data retained, and how is it deleted?

**Regulation and standards**
- What is your role under the EU AI Act for this product (provider of a high-risk system?), and what documentation and instructions for use will you provide?
- Do you follow NIST AI RMF or hold ISO/IEC 42001 or ISO 27001 certification?

**Oversight and transparency**
- Can our staff see why the system made a recommendation?
- Can outputs be overridden, and is that logged?

**Change and security**
- How will you notify us of model changes that could affect results?
- How do you test for security issues such as prompt injection?
- What incident notification commitments do you make?

## Contract Clauses to Consider

- Restrictions on using your data for training
- Data location, retention and deletion obligations
- Notice of material model or feature changes
- Cooperation with audits, regulator requests and incident investigations
- Clear allocation of responsibilities under applicable AI law
- Service levels and exit plans (can you leave without losing your data?)

## Scale the Effort

A low-risk writing assistant needs a light review. A vendor whose AI ranks job applicants or assesses creditworthiness needs deep scrutiny, testing evidence and strong contract terms.

## Don't Forget Existing Vendors

Many established vendors have added AI features to products you already use, sometimes switched on by default. Review existing contracts and settings, not just new purchases.

> **Try it:** Pick an AI-enabled tool your organisation already uses. Answer as many of the questions above as you can from public information and your contract. What's still unknown?

## Key Takeaways

- Using vendor AI doesn't remove your obligations as a deployer
- Ask about purpose, testing, data use, regulatory role, oversight, changes and security
- Scale due diligence to risk, and review existing vendors' new AI features`,
          estimatedMinutes: 12,
          order: 1
        },
        {
          id: "lesson-5-2",
          title: "AI Literacy Programs That Work",
          type: "article",
          content: `# AI Literacy Programs That Work

AI literacy is both a legal obligation under the EU AI Act and the most practical risk control you have: people who understand AI make fewer dangerous mistakes.

## What "Sufficient AI Literacy" Means

The AI Act asks providers and deployers to ensure staff have a sufficient level of AI literacy, taking into account their technical knowledge, experience, education and the context in which AI is used. In practice, that means **role-based** training, not one generic course for everyone.

## A Role-Based Curriculum

| Audience | Focus |
|---|---|
| **All staff** | What AI is and isn't; strengths and limitations (including confident errors); the acceptable use policy; data rules; how to report problems |
| **Regular AI users** | Effective and safe use of approved tools; verifying outputs; disclosure; avoiding automation bias |
| **Staff overseeing high-risk AI** | How the specific system works, its limits, when and how to override, documenting decisions |
| **Builders and technical teams** | Evaluation, bias testing, security, documentation, regulatory requirements |
| **Leaders and boards** | Strategic opportunities and risks, regulatory exposure, governance responsibilities |

## Make It Stick

- **Practical, not theoretical** — use real tools and real scenarios from people's jobs
- **Short and repeated** — brief modules and refreshers beat a single annual session
- **Show failures** — examples of AI being confidently wrong are memorable and effective
- **Champions network** — enthusiastic employees in each team who help colleagues and surface issues
- **Tie to access** — require a short module before granting access to approved AI tools

## Keep Evidence

Record who completed which training and when. If a regulator, auditor or customer asks how you meet the AI literacy obligation, you'll need to show it.

## Measure Impact

Track more than completions:

- Fewer incidents of sensitive data entered into unapproved tools
- More issues reported through the proper channel
- Confidence and capability survey results over time
- Adoption of approved tools

> **Try it:** Outline a 30-minute AI literacy session for "all staff" in your organisation: three learning goals, one real example of an AI mistake, and the two policy rules everyone must remember.

## Key Takeaways

- AI literacy is required under the AI Act and is one of your strongest risk controls
- Tailor training by role, from all staff to builders and boards
- Keep it practical and repeated, record completion, and measure behaviour change`,
          estimatedMinutes: 12,
          order: 2
        },
        {
          id: "lesson-5-3",
          title: "Monitoring, Incidents and Continuous Improvement",
          type: "article",
          content: `# Monitoring, Incidents and Continuous Improvement

Approval is not the end of governance. AI systems change, data drifts and new risks appear. Governance must continue for the system's whole life.

## Ongoing Monitoring

For each AI system, according to its risk level, monitor:

- **Performance** — accuracy and error rates against the baseline from approval
- **Fairness** — outcome differences across groups over time
- **Oversight in practice** — are humans actually reviewing, and how often do they override?
- **Complaints and feedback** — from users and affected people
- **Changes** — vendor model updates, new data sources, new purposes

Set **triggers for re-assessment**: a model change, a new use case, a significant drop in performance, or a pattern of complaints.

## What Counts as an AI Incident?

Examples:

- An AI system produces discriminatory outcomes
- Personal or confidential data is exposed through an AI tool
- A chatbot gives harmful or seriously misleading advice
- An agent takes an unintended action with real consequences
- A high-risk system malfunctions in a way that could harm health, safety or fundamental rights

## An Incident Process

1. **Report** — an easy channel for anyone to raise concerns
2. **Triage** — assess severity and whether legal reporting duties apply (for example, serious incidents involving high-risk systems, or personal data breaches)
3. **Contain** — pause or restrict the system if needed
4. **Investigate** — find the root cause: data, model, configuration, misuse or process
5. **Remediate** — fix the cause and, where appropriate, support affected people
6. **Learn** — update assessments, controls, training and the inventory

## Retirement

Decommission AI systems deliberately: archive documentation, handle data according to retention rules, inform users and affected people where relevant, and update the inventory.

## Review the Program Itself

At least annually, review the governance program as a whole:

- Is the inventory complete?
- Are assessments happening before deployment, not after?
- Are approval times reasonable?
- What did incidents teach us?
- What has changed in the law and guidance?

## Your 90-Day Starter Plan

| Days | Actions |
|---|---|
| 1–30 | Appoint a lead and sponsor; launch the inventory; publish an interim acceptable use policy; check for prohibited practices |
| 31–60 | Classify inventory items; assess high-risk uses; start AI literacy for all staff; add AI questions to procurement |
| 61–90 | Form the governance committee; set monitoring for high-risk systems; set up the incident process; plan for upcoming obligations |

> **Try it:** Adapt the 90-day plan to your organisation. Which three actions would you do first, and who would own them?

## Key Takeaways

- Governance continues throughout an AI system's life: monitor, re-assess and retire deliberately
- Have a clear incident process, including checks for legal reporting duties
- Review the program itself regularly — and start with a focused 90-day plan`,
          estimatedMinutes: 13,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q5-1",
            question: "A vendor provides your company's AI hiring tool. Who has obligations under the EU AI Act?",
            options: [
              "Only the vendor",
              "Both: the vendor as provider, and your company as deployer",
              "Only your company",
              "Neither, because it's a vendor product"
            ],
            correctAnswer: 1,
            explanation: "Providers and deployers each have their own duties, especially for high-risk uses like hiring."
          },
          {
            id: "q5-2",
            question: "What makes an AI literacy program most effective?",
            options: [
              "One long annual lecture for everyone",
              "Role-based, practical, repeated training with real examples and recorded completion",
              "Sending the AI Act text to all staff",
              "Training only the IT department"
            ],
            correctAnswer: 1,
            explanation: "Different roles need different knowledge, and practical repetition changes behaviour."
          },
          {
            id: "q5-3",
            question: "Which event should trigger a re-assessment of an approved AI system?",
            options: [
              "A new office opening",
              "The vendor changing the underlying model, or the system being used for a new purpose",
              "A routine software licence renewal",
              "A team member's birthday"
            ],
            correctAnswer: 1,
            explanation: "Changes to the model, data or purpose can change the risks, so the assessment must be revisited."
          },
          {
            id: "q5-4",
            question: "In the 90-day starter plan, which action belongs in the first 30 days?",
            options: [
              "Pursuing ISO/IEC 42001 certification",
              "Appointing a governance lead, launching the inventory and checking for prohibited practices",
              "Decommissioning all AI systems",
              "Writing a 100-page policy manual"
            ],
            correctAnswer: 1,
            explanation: "Ownership, visibility and confirming no prohibited practices are the essential first steps."
          }
        ]
      }
    }
  ]
});
