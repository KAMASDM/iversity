import { balanceAnswers } from './balanceAnswers.js';

export const aiEthicsCourse = balanceAnswers({
  title: "AI Ethics: Building and Using AI Responsibly",
  description: "AI decisions affect jobs, loans, healthcare, information and creativity. Learn to recognise the ethical risks in AI systems — bias, opacity, privacy intrusion, manipulation and societal harm — and practical methods to make better decisions, whether you build AI, buy it or simply use it at work.",
  category: "AI for Professionals",
  level: "beginner",
  duration: 5,
  topics: [
    "Why AI ethics matters in everyday work",
    "Ethical frameworks for practical decisions",
    "Bias and fairness in AI systems",
    "Transparency and explainability",
    "Privacy, consent and surveillance",
    "Accountability and human oversight",
    "Misinformation, deepfakes and creative work",
    "Running ethical reviews and speaking up"
  ],
  objectives: [
    "Explain the core ethical principles that apply to AI and why they sometimes conflict",
    "Identify where bias enters AI systems and evaluate fairness trade-offs",
    "Decide what level of transparency and explanation different AI uses require",
    "Recognise privacy and consent risks, including surveillance and inference",
    "Assess broader societal impacts such as misinformation, labour and environmental costs",
    "Use a practical ethical review process and raise concerns constructively"
  ],
  prerequisites: [
    "No technical background required",
    "Open to anyone who builds, buys, manages or uses AI",
    "Pairs well with 'AI Governance & Compliance: EU AI Act, NIST & ISO 42001'"
  ],
  published: true,
  chapters: [
    {
      id: "chapter-1",
      title: "Foundations of AI Ethics",
      description: "Why ethics matters for AI, the principles involved, and how to reason about trade-offs",
      order: 1,
      lessons: [
        {
          id: "lesson-1-1",
          title: "Why AI Ethics Is Everyone's Job",
          type: "article",
          content: `# Why AI Ethics Is Everyone's Job

It's tempting to think AI ethics belongs to philosophers, regulators or a special committee. In reality, most ethical choices about AI are made by ordinary people doing ordinary work: choosing a vendor, writing a prompt, approving a launch, or deciding whether to trust an output.

## Ethics vs. Law vs. Governance

| | Question it answers | Example |
|---|---|---|
| **Law** | What must we do? What's forbidden? | Don't use prohibited AI practices; protect personal data |
| **Governance** | How do we organise ourselves to do it reliably? | Inventories, risk assessments, approvals |
| **Ethics** | What *should* we do — including where the law is silent? | Should we use AI to monitor employees' productivity, even if it's legal? |

Laws set the floor. Ethics is about the judgement calls above it — and AI creates many of them, faster than laws can keep up.

## Why AI Raises the Stakes

- **Scale:** a single model can make millions of decisions; one flawed assumption affects all of them
- **Opacity:** it can be hard to know why an AI produced a result
- **Automation of judgement:** AI now shapes decisions once made entirely by people — hiring, lending, diagnosis, moderation
- **Persuasiveness:** fluent, confident output is easy to over-trust
- **Speed of adoption:** tools spread through organisations before anyone asks hard questions

## Real Consequences

Documented cases show what goes wrong when ethics is an afterthought:

- A recruiting tool trained on past hiring data learned to downgrade CVs that signalled the applicant was a woman, and was abandoned
- A widely used healthcare algorithm used past healthcare *costs* as a stand-in for health *needs*, which led it to underestimate the needs of Black patients who had historically had less spent on their care
- Facial analysis systems were found to have much higher error rates for darker-skinned women than for lighter-skinned men

None of these teams set out to cause harm. The harm came from unexamined assumptions.

## Your Role

Whatever your job, you can ask:

- Who could be affected by this, and how?
- What happens when it's wrong — and who bears the cost?
- Would I be comfortable explaining this use to the people affected?

> **Try it:** Think of one AI tool you use at work. Write down who is affected by its outputs besides you. Did anyone ask those people what they'd think?

## Key Takeaways

- Law sets the minimum; ethics guides judgement above it
- AI amplifies ethical risks through scale, opacity, automation and persuasiveness
- Most ethical choices are made by everyday practitioners, so everyone has a role`,
          estimatedMinutes: 11,
          order: 1
        },
        {
          id: "lesson-1-2",
          title: "Core Principles and Their Tensions",
          type: "article",
          content: `# Core Principles and Their Tensions

Dozens of organisations have published AI ethics principles. They use different words, but converge on a familiar set. The hard part isn't knowing the principles — it's handling the moments when they pull in different directions.

## The Common Principles

| Principle | Core idea |
|---|---|
| **Beneficence** | AI should create real benefits for people and society |
| **Non-maleficence** | Avoid causing harm — physical, financial, psychological, social |
| **Autonomy** | Respect people's ability to make informed choices about their own lives |
| **Justice and fairness** | Distribute benefits and burdens fairly; avoid unjust discrimination |
| **Transparency** | Be open about when and how AI is used |
| **Accountability** | Someone is answerable for outcomes and can put things right |
| **Privacy** | Respect people's control over information about them |

## Where Principles Collide

Real decisions involve trade-offs:

- **Privacy vs. fairness:** to check whether a system is biased against a group, you may need data about group membership — sensitive data you'd otherwise avoid collecting
- **Transparency vs. security:** publishing exactly how a fraud-detection model works helps fraudsters evade it
- **Beneficence vs. autonomy:** a health app that nudges people toward healthier choices may be helpful — or manipulative
- **Accuracy vs. explainability:** the most accurate model may be the hardest to explain
- **Speed vs. care:** launching quickly helps users sooner but leaves less time to find harms

## Handling Tensions Well

There's rarely a perfect answer. Good practice is to:

1. **Name the tension explicitly** instead of pretending it doesn't exist
2. **Identify who bears the cost** of each option — especially people with less power
3. **Look for creative options** that reduce the trade-off (e.g. privacy-preserving ways to test for bias)
4. **Document the reasoning** so the decision can be reviewed and revisited
5. **Revisit** as evidence comes in

## Principles Need Practices

Principles printed on a website change nothing on their own. They matter when they become concrete practices: bias testing before launch, disclosure to users, a human appeal route, data minimisation. The rest of this course is about those practices.

> **Try it:** Choose one AI use case and find two principles that conflict in it. Describe one creative option that reduces the conflict.

## Key Takeaways

- Common principles: beneficence, non-maleficence, autonomy, fairness, transparency, accountability, privacy
- Principles often conflict; name the tension and consider who bears the cost
- Principles only matter when translated into concrete practices`,
          estimatedMinutes: 12,
          order: 2
        },
        {
          id: "lesson-1-3",
          title: "Thinking Tools for Ethical Decisions",
          type: "article",
          content: `# Thinking Tools for Ethical Decisions

You don't need a philosophy degree to make better ethical decisions. A few classic lenses, used together, reveal angles you might otherwise miss.

## Four Lenses

| Lens | Key question | AI example |
|---|---|---|
| **Consequences** | Which option produces the best overall outcomes, and for whom? | Does an AI triage tool reduce waiting times overall — and does anyone end up worse off? |
| **Rights and duties** | Are we respecting people's rights and keeping our obligations, whatever the outcome? | Do people have a right to know a machine evaluated them, and to contest it? |
| **Fairness** | Are benefits and burdens shared justly? Are like cases treated alike? | Does the tool work equally well for every group it serves? |
| **Character and trust** | What would a trustworthy organisation do? What does this choice say about us? | Would we be proud if this practice appeared in the news? |

No single lens is "right". When all four point the same way, you can act with confidence. When they disagree, you've found the real dilemma and can discuss it honestly.

## Stakeholder Mapping

List everyone affected by an AI system — not just users and customers:

- **Direct users** (staff operating the tool)
- **Subjects** (people the AI makes decisions or predictions about)
- **Bystanders** (people captured in data, such as faces in camera footage)
- **Workers behind the AI** (data labellers, content moderators)
- **Society** (effects on information, jobs, the environment)

Ask: whose voice is missing from our decision-making? Often it's the subjects and bystanders — the people with the most at stake and the least say.

## Quick Tests

- **The headline test:** would you be comfortable seeing this on the front page?
- **The reversal test:** would you accept this if you were the person being evaluated?
- **The explanation test:** could you explain this use to an affected person, face to face?
- **The worst-case test:** what's the most harmful plausible outcome, and who would suffer it?

## From Thinking to Action

Ethical reasoning should end in a decision: proceed, proceed with changes, or don't proceed — with reasons recorded. "We thought about it" isn't an outcome.

> **Try it:** Apply the four lenses and the reversal test to an AI use you're considering, such as using AI to screen job applications. Where do the lenses agree, and where do they disagree?

## Key Takeaways

- Use four lenses: consequences, rights and duties, fairness, and character and trust
- Map all stakeholders, especially subjects and bystanders with little voice
- Quick tests — headline, reversal, explanation, worst case — surface problems fast`,
          estimatedMinutes: 12,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q1-1",
            question: "How does AI ethics relate to AI law?",
            options: [
              "They are identical",
              "Law sets minimum requirements; ethics guides judgement about what we should do, including where the law is silent",
              "Ethics only applies to academic research",
              "Law is always stricter than ethics"
            ],
            correctAnswer: 1,
            explanation: "Laws set the floor. Many AI choices are legal but still raise real questions about what's right."
          },
          {
            id: "q1-2",
            question: "In the healthcare algorithm case, what caused the unfair outcome?",
            options: [
              "The model was intentionally discriminatory",
              "It used past healthcare costs as a proxy for health needs, which reflected unequal access to care",
              "It had too little training data",
              "Doctors refused to use it"
            ],
            correctAnswer: 1,
            explanation: "An unexamined proxy carried historical inequality into the model's predictions."
          },
          {
            id: "q1-3",
            question: "Which is an example of tension between two ethical principles?",
            options: [
              "Being accurate and being correct",
              "Needing sensitive group data to test whether a system is fair, while privacy suggests not collecting it",
              "Being fast and being quick",
              "Testing a model before launch"
            ],
            correctAnswer: 1,
            explanation: "Fairness testing can require data that privacy principles would minimise — a real trade-off to manage."
          },
          {
            id: "q1-4",
            question: "What does the 'reversal test' ask?",
            options: [
              "Whether the model works backwards",
              "Whether you would accept the practice if you were the person being evaluated by it",
              "Whether the decision can be undone",
              "Whether competitors do the same thing"
            ],
            correctAnswer: 1,
            explanation: "Putting yourself in the affected person's position reveals harms that are easy to overlook."
          }
        ]
      }
    },
    {
      id: "chapter-2",
      title: "Bias and Fairness",
      description: "Where bias comes from, how fairness is defined, and what you can do about it",
      order: 2,
      lessons: [
        {
          id: "lesson-2-1",
          title: "Where Bias Comes From",
          type: "article",
          content: `# Where Bias Comes From

"The algorithm is biased" is often said, rarely explained. Bias can enter at every stage of building and using an AI system — and understanding where helps you find and fix it.

## Sources of Bias

| Stage | Source | Example |
|---|---|---|
| **Historical data** | The world the data describes was itself unequal | Past hiring favoured certain groups, so a model trained on it learns to repeat that |
| **Representation** | Some groups are under-represented in the data | A skin-condition model trained mostly on lighter skin performs worse on darker skin |
| **Measurement** | What's measured is a poor or unequal proxy for what matters | Using arrests as a proxy for crime, or costs as a proxy for health needs |
| **Labelling** | Human labellers bring their own assumptions | Labelling dialects or names as "unprofessional" |
| **Problem framing** | The question itself is skewed | Predicting who will "fit the culture" rather than who can do the job |
| **Deployment** | The system is used in a different context or population | A model built for one country used in another |
| **Feedback loops** | Outputs shape future data | More patrols in an area produce more recorded incidents there, "confirming" the prediction |

## Proxies: The Hidden Problem

Removing a sensitive attribute like gender or ethnicity from the data doesn't remove bias. Other features — postcode, school, first name, gaps in employment, hobbies — can act as **proxies** that correlate strongly with the removed attribute. The model can learn the same pattern indirectly.

## Generative AI Bias

Large language and image models learn from vast amounts of internet text and images, absorbing the stereotypes within them:

- Image generators may default to particular genders or ethnicities for professions like "CEO" or "nurse"
- Language models may associate certain names with particular traits or jobs
- Quality can be lower for less-represented languages and dialects

Providers reduce these effects, but they can't eliminate them — so test outputs in your own context.

## Bias Isn't Only Technical

Many biases come from **decisions people made**: which problem to solve, what data to use, what counts as success, and who was consulted. That's why diverse teams and the involvement of affected communities matter as much as technical fixes.

> **Try it:** For an AI system you know, go through the table and note at least one plausible source of bias at three different stages.

## Key Takeaways

- Bias can enter through data, measurement, labels, framing, deployment and feedback loops
- Removing sensitive attributes doesn't remove bias, because proxies remain
- Many biases come from human decisions, not just technical flaws`,
          estimatedMinutes: 12,
          order: 1
        },
        {
          id: "lesson-2-2",
          title: "What Does 'Fair' Mean?",
          type: "article",
          content: `# What Does 'Fair' Mean?

Everyone agrees AI should be fair. The trouble is that "fair" has several precise definitions — and they can't all be satisfied at once.

## Common Fairness Definitions

Imagine a model that predicts which loan applicants will repay.

| Definition | Meaning | In the loan example |
|---|---|---|
| **Demographic parity** | Each group receives positive outcomes at the same rate | Equal approval rates across groups |
| **Equal opportunity** | People who would succeed have the same chance of a positive outcome, whatever their group | Equal approval rates among applicants who would actually repay |
| **Equalised odds** | Equal true-positive *and* false-positive rates across groups | Errors in both directions are equally likely for every group |
| **Calibration** | A given score means the same thing for every group | A "70% likely to repay" score is right about 70% of the time in each group |
| **Individual fairness** | Similar people are treated similarly | Two applicants with similar finances get similar decisions |

## The Impossibility Result

Researchers have shown mathematically that when groups have different underlying rates of the outcome, several of these definitions — for example, calibration and equal error rates — **cannot all hold at the same time** (except in unrealistic cases).

A well-known debate about a criminal risk-assessment tool illustrated this. Critics showed it produced higher false-positive rates for Black defendants; its developers showed its scores were similarly calibrated across groups. Both could be true at once. The real question was which kind of fairness should matter most in that context.

## So How Do You Choose?

There's no universal answer; it depends on context and values:

- **What are the harms of each type of error?** Wrongly denying a loan versus wrongly approving one; wrongly flagging someone for investigation versus missing a case
- **Who bears those harms?** Are some groups already disadvantaged?
- **What does the law require?** Anti-discrimination law may constrain your options
- **What would affected people consider fair?** Ask them

## Make the Choice Explicit

The worst approach is not choosing — implicitly accepting whatever trade-off the model happens to make. Decide which fairness definitions matter for your use, measure them, and document why.

> **Try it:** For an AI that flags job applicants for interview, which error is worse: rejecting a strong candidate, or interviewing a weak one? Which fairness definition follows from your answer?

## Key Takeaways

- Fairness has several precise definitions: parity, equal opportunity, equalised odds, calibration, individual fairness
- They can conflict mathematically, so you must choose based on context
- Base the choice on the harms of different errors and who bears them — and document it`,
          estimatedMinutes: 13,
          order: 2
        },
        {
          id: "lesson-2-3",
          title: "Reducing Bias in Practice",
          type: "article",
          content: `# Reducing Bias in Practice

You can't make an AI system perfectly unbiased. But you can greatly reduce unfair outcomes with deliberate practices across the lifecycle.

## Before Building or Buying

- **Question the problem framing:** is this the right thing to predict or automate? Is AI necessary at all?
- **Examine the data:** who's represented, who's missing, and what historical patterns it contains
- **Choose the target carefully:** avoid proxies that encode inequality
- **Involve affected people** and domain experts early
- **For vendor tools:** ask what bias testing was done, on which populations, and request the results

## During Development and Testing

- **Disaggregate performance:** measure accuracy and error rates separately for relevant groups, not just overall
- **Test intersections:** a system may work for women and for older people overall, but poorly for older women
- **Stress-test generative AI:** run prompts that vary only names, genders or dialects and compare outputs
- **Apply mitigations:** rebalance data, adjust decision thresholds, or constrain the model — and re-measure

## At and After Deployment

- **Keep humans meaningfully involved** in consequential decisions
- **Provide routes to appeal** and correct errors
- **Monitor outcomes over time** by group — performance can drift as populations change
- **Watch for feedback loops** that reinforce initial biases
- **Act on findings:** pause or change a system that's producing unfair outcomes

## A Simple Bias Testing Example

For an AI that summarises customer complaints and assigns priority:

1. Create pairs of identical complaints that differ only in the customer's name (signalling different genders or ethnic backgrounds) or writing style (formal vs. informal, native vs. non-native English)
2. Run all versions through the system
3. Compare assigned priorities and summary tone
4. Investigate any systematic differences

This "counterfactual" testing is simple, cheap and revealing.

## Document Everything

Record what you tested, what you found, which trade-offs you accepted and why. Model cards and datasheets — short standard documents describing a model or dataset's purpose, performance across groups and limitations — are useful formats.

> **Try it:** Design a counterfactual test for an AI tool you use: what would you vary, what would you hold constant, and what difference would concern you?

## Key Takeaways

- Address bias from framing and data through to deployment and monitoring
- Disaggregate results by group and intersection; use counterfactual tests
- Provide appeals, monitor over time and document your choices`,
          estimatedMinutes: 12,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q2-1",
            question: "Why doesn't removing a sensitive attribute like gender from training data guarantee a fair model?",
            options: [
              "Models always add it back automatically",
              "Other features can act as proxies that correlate with the removed attribute",
              "Gender data is required by law",
              "It makes the model less accurate"
            ],
            correctAnswer: 1,
            explanation: "Features like names, postcodes or career gaps can let the model learn the same pattern indirectly."
          },
          {
            id: "q2-2",
            question: "What is a feedback loop in the context of AI bias?",
            options: [
              "Users giving thumbs-up ratings",
              "A system's outputs shaping future data in a way that reinforces its original predictions",
              "Retraining a model every week",
              "A loop in the code"
            ],
            correctAnswer: 1,
            explanation: "For example, more patrols in an area produce more recorded incidents, which then 'confirm' the prediction."
          },
          {
            id: "q2-3",
            question: "What does the 'impossibility result' in fairness research show?",
            options: [
              "Fair AI is impossible to build",
              "When groups have different base rates, several fairness definitions can't all be satisfied at once",
              "Fairness can only be measured by humans",
              "Bias testing is too expensive"
            ],
            correctAnswer: 1,
            explanation: "Definitions like calibration and equal error rates can conflict, so you must choose based on context."
          },
          {
            id: "q2-4",
            question: "What is counterfactual bias testing?",
            options: [
              "Testing the model on fake data only",
              "Running inputs that differ only in one attribute (like a name) and comparing the outputs",
              "Asking the model whether it is biased",
              "Comparing two different vendors"
            ],
            correctAnswer: 1,
            explanation: "Holding everything else constant reveals whether a single attribute changes the result."
          }
        ]
      }
    },
    {
      id: "chapter-3",
      title: "Transparency, Accountability and Human Oversight",
      description: "Make AI understandable, keep people answerable, and keep humans meaningfully in control",
      order: 3,
      lessons: [
        {
          id: "lesson-3-1",
          title: "Transparency and Explainability",
          type: "article",
          content: `# Transparency and Explainability

People affected by AI deserve to understand that AI is involved and, where it matters, why it produced a particular result. But "explainable AI" means different things to different audiences.

## Levels of Transparency

| Level | What's disclosed | Example |
|---|---|---|
| **Disclosure** | That AI is being used | "You're chatting with an AI assistant" |
| **Process transparency** | How the system works in general: purpose, data, limitations | A public page describing the hiring tool and how it's reviewed |
| **Outcome explanation** | Why *this* result happened for *this* person | "Your application was flagged mainly because of an incomplete employment history" |
| **Recourse** | What the person can do about it | "You can request a human review here" |

## Different Audiences, Different Explanations

- **Affected people** need plain-language reasons and a route to challenge
- **Operators** (staff using the tool) need enough understanding to judge when to trust or override it
- **Auditors and regulators** need technical detail, documentation and test results
- **Developers** need detailed diagnostics to improve the system

One explanation rarely serves all four.

## Explaining Complex Models

Some models (such as large neural networks) can't be fully explained step by step. Practical options include:

- Highlighting the **main factors** that influenced a decision
- **Counterfactual explanations:** "If your income were higher by X, the decision would likely change"
- **Example-based explanations:** similar past cases and their outcomes
- **Choosing simpler models** where explanation is essential and performance allows

## Explaining Generative AI

For language models, explanations take a different shape:

- **Cite sources** so people can verify claims
- **Show uncertainty** — encourage the system to say when it isn't sure
- **Label AI-generated content** clearly, especially where people could be misled

## Beware False Transparency

An explanation that sounds plausible but doesn't reflect how the system actually reached its result can be worse than none. AI-generated "reasoning" may not faithfully describe the underlying process. Treat such explanations as helpful context, not proof.

> **Try it:** Write a two-sentence explanation for a person denied a service by an AI-assisted decision. Include the main reason and how they can request a human review.

## Key Takeaways

- Transparency ranges from disclosure to individual explanations and recourse
- Tailor explanations to affected people, operators, auditors and developers
- Use factors, counterfactuals, citations and uncertainty — and beware explanations that sound right but aren't faithful`,
          estimatedMinutes: 12,
          order: 1
        },
        {
          id: "lesson-3-2",
          title: "Accountability: Who Answers When AI Gets It Wrong?",
          type: "article",
          content: `# Accountability: Who Answers When AI Gets It Wrong?

"The computer said so" has never been an acceptable excuse. With AI, the temptation to hide behind the system is stronger — so accountability must be designed in deliberately.

## The Accountability Gap

AI systems involve many parties: model developers, vendors, the team that configured it, the manager who approved it, the employee who used it. When something goes wrong, each can point to another. That's the **accountability gap**: harm with no one clearly responsible.

## Closing the Gap

- **Named owners:** every AI system has a person accountable for its outcomes
- **Clear decision rights:** who approved deployment, who can pause it, who handles complaints
- **Documentation:** records of what the system is for, how it was tested and what limitations were known
- **Traceability:** logs that show how specific outcomes were produced
- **Redress:** a working process for people to complain, get errors corrected and receive remedies

## "Using AI" Doesn't Transfer Responsibility

If you use AI to write a report, draft a contract clause or summarise a patient's history, **you** remain responsible for what you submit. Courts, professional bodies and employers have repeatedly made clear that relying on unchecked AI output — for example, submitting AI-generated legal citations that turned out to be fabricated — is the user's failure, not the tool's.

## Contestability

People should be able to challenge AI-influenced decisions that affect them significantly. A meaningful appeals process:

- Is easy to find and use
- Reaches a human with authority to change the outcome
- Explains the reasoning behind the original decision
- Feeds lessons back to improve the system

## Accountability in Generative AI Use

Practical rules for everyday work:

- Verify facts, figures, quotes and citations before relying on them
- Don't present AI-generated work as your personal expertise where that would mislead
- Follow your organisation's disclosure expectations
- Report errors and incidents so others can learn

> **Try it:** For one AI system at your organisation, answer: who owns it, who can switch it off, and how can an affected person complain? If any answer is "not sure", that's an accountability gap.

## Key Takeaways

- Many parties in AI systems create an accountability gap that must be closed deliberately
- Named owners, documentation, traceability and redress make accountability real
- Using AI never transfers your responsibility for the work you submit`,
          estimatedMinutes: 12,
          order: 2
        },
        {
          id: "lesson-3-3",
          title: "Meaningful Human Oversight",
          type: "article",
          content: `# Meaningful Human Oversight

"A human makes the final decision" sounds reassuring. In practice, a human who approves every AI recommendation in seconds provides little real oversight. Oversight has to be designed to work.

## Human-in-the-Loop, On-the-Loop, In-Command

| Model | How it works | Suits |
|---|---|---|
| **Human-in-the-loop** | A person reviews and decides on each case | High-stakes individual decisions (credit, hiring, diagnosis) |
| **Human-on-the-loop** | AI acts; people monitor and can intervene | High-volume, lower-stakes processes |
| **Human-in-command** | People decide whether, where and how AI is used at all | Strategic and policy decisions |

## Why Oversight Fails

- **Automation bias:** people tend to defer to automated suggestions, especially when busy
- **Deskilling:** over time, reviewers lose the expertise needed to spot errors
- **Volume pressure:** hundreds of reviews per hour make real judgement impossible
- **Missing information:** reviewers see only the AI's conclusion, not the evidence
- **No authority:** reviewers fear consequences for disagreeing with "the system"

## Designing Oversight That Works

- **Show evidence, not just conclusions:** the key factors and source data behind a recommendation
- **Make disagreement easy and safe:** a one-click override with a reason, without penalty
- **Manage workload:** realistic review volumes and time
- **Train reviewers:** on the system's limitations and on automation bias
- **Measure override rates:** if humans almost never disagree, investigate whether oversight is real
- **Seed known errors occasionally** in training exercises to keep reviewers alert

## When Not to Automate

Some decisions may be too consequential, too context-dependent or too value-laden to delegate to AI even with oversight — for example, final decisions on criminal sentencing, medical treatment withdrawal or firing an employee. Deciding what *not* to automate is a central ethical choice.

## Preserving Human Skills

Rotate tasks, keep some work fully manual, and invest in training so people retain the expertise oversight depends on.

> **Try it:** For an AI-assisted decision in your organisation, list what the human reviewer sees. Is it enough for them to genuinely disagree with the AI? What would you add?

## Key Takeaways

- Choose the right oversight model: in-the-loop, on-the-loop or in-command
- Oversight fails through automation bias, deskilling, volume pressure and missing information
- Design for real judgement — evidence, safe overrides, manageable workloads — and decide what not to automate`,
          estimatedMinutes: 12,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q3-1",
            question: "What does 'recourse' mean in AI transparency?",
            options: [
              "Retraining the model",
              "Telling affected people what they can do about a decision, such as requesting human review",
              "Publishing the source code",
              "Repeating the decision"
            ],
            correctAnswer: 1,
            explanation: "Recourse gives affected people a practical way to challenge or correct an AI-influenced outcome."
          },
          {
            id: "q3-2",
            question: "Why should AI-generated 'reasoning' be treated with caution as an explanation?",
            options: [
              "It is always too long",
              "It may sound plausible without faithfully reflecting how the result was actually produced",
              "It is illegal to show it",
              "It only works in English"
            ],
            correctAnswer: 1,
            explanation: "Plausible-sounding explanations can mislead if they don't match the real decision process."
          },
          {
            id: "q3-3",
            question: "A professional submits AI-generated citations that turn out to be fabricated. Who is responsible?",
            options: [
              "The AI vendor alone",
              "The professional who submitted the work without verifying it",
              "Nobody, because AI made the error",
              "The court or recipient"
            ],
            correctAnswer: 1,
            explanation: "Using AI doesn't transfer responsibility. People must verify what they submit."
          },
          {
            id: "q3-4",
            question: "Human reviewers almost never override an AI system's recommendations. What should you do?",
            options: [
              "Celebrate — the AI is perfect",
              "Investigate whether oversight is real, checking workload, information shown and automation bias",
              "Remove the human reviewers",
              "Hide the override button"
            ],
            correctAnswer: 1,
            explanation: "Very low override rates can signal rubber-stamping rather than genuine agreement."
          }
        ]
      }
    },
    {
      id: "chapter-4",
      title: "Privacy, Manipulation and Societal Impact",
      description: "Look beyond individual decisions to privacy, persuasion, information and the wider world",
      order: 4,
      lessons: [
        {
          id: "lesson-4-1",
          title: "Privacy, Consent and Surveillance",
          type: "article",
          content: `# Privacy, Consent and Surveillance

AI is hungry for data and remarkably good at finding patterns in it. That creates privacy risks that go well beyond traditional data protection.

## Privacy Risks Specific to AI

| Risk | Example |
|---|---|
| **Inference** | Predicting sensitive traits — health conditions, pregnancy, sexual orientation, political views — from innocuous data like purchases or likes |
| **Re-identification** | Combining "anonymous" datasets to identify individuals |
| **Memorisation** | Models occasionally reproducing personal data they were trained on |
| **Function creep** | Data collected for one purpose quietly reused to train AI for another |
| **Surveillance at scale** | Facial recognition, emotion analysis or productivity tracking applied to everyone, all the time |
| **Leakage through prompts** | Employees pasting confidential or personal information into public AI tools |

## Consent Is Necessary but Not Sufficient

"Users agreed to the terms" rarely settles the ethical question. Long, unread terms don't produce meaningful understanding, and people often have no real alternative to accepting. Ask instead:

- Would people **reasonably expect** their data to be used this way?
- Is the use **proportionate** to the benefit?
- Can people **opt out** without losing essential services?

## Workplace Monitoring

AI-powered tools can track keystrokes, screen activity, location, tone in meetings and "productivity scores". Even where legal, consider:

- Does it measure what actually matters, or just what's easy to measure?
- What does it do to trust, autonomy and wellbeing?
- Are employees told clearly, and do they have a voice in the decision?
- Could it be used to discriminate or retaliate?

Some forms, such as emotion recognition in the workplace, are prohibited in certain jurisdictions, including the EU.

## Privacy-Protective Practices

- **Data minimisation:** collect and use only what's necessary
- **Purpose limitation:** don't repurpose data without a fresh assessment
- **De-identification and aggregation** where individual data isn't needed
- **Privacy-enhancing technologies:** techniques that allow analysis while revealing less about individuals
- **Clear AI tool rules** for staff about what data can go into which tools
- **Retention limits:** delete data and logs you no longer need

> **Try it:** Pick a dataset your team uses. Write down one sensitive thing an AI could infer from it that people never chose to share. What would you do to prevent that use?

## Key Takeaways

- AI adds privacy risks: inference, re-identification, memorisation, function creep and surveillance
- Consent alone doesn't settle ethical questions — consider expectations and proportionality
- Minimise, limit purposes, protect data and set clear rules for staff`,
          estimatedMinutes: 12,
          order: 1
        },
        {
          id: "lesson-4-2",
          title: "Manipulation, Misinformation and Deepfakes",
          type: "article",
          content: `# Manipulation, Misinformation and Deepfakes

Generative AI makes it cheap to produce persuasive text, realistic images, cloned voices and convincing video. These capabilities have creative and practical value — and real potential for harm.

## Manipulation and Dark Patterns

AI can personalise persuasion to an individual's vulnerabilities at scale. Ethical lines are crossed when AI:

- Exploits emotional states, addictions or financial distress
- Creates false urgency or social proof
- Uses conversational "companions" to build dependence for commercial gain
- Targets children or vulnerable people with persuasion they can't recognise

Ask: **does this help people make the decision they would make with full information and a clear head — or does it work around their judgement?**

## Misinformation

- **Hallucinations:** confident, false statements produced without any intent to deceive
- **Synthetic content at scale:** fake reviews, fake news sites, coordinated inauthentic posts
- **Erosion of trust:** when anything could be fake, real evidence can be dismissed too (sometimes called the "liar's dividend")

## Deepfakes

Realistic synthetic media of real people can be used for:

- **Fraud:** cloned voices of executives or relatives requesting urgent payments
- **Harassment:** non-consensual intimate imagery, which causes severe harm
- **Political manipulation:** fake statements by candidates or officials
- **Reputational attacks** on individuals and organisations

## Responsible Practices

**If you create content with AI:**
- Label synthetic media where people could be misled — and follow legal labelling requirements where they apply
- Never create realistic depictions of real people without consent
- Don't generate fake reviews, testimonials or endorsements

**If you deploy AI to the public:**
- Prevent impersonation and abuse
- Support content provenance standards that attach information about how media was created

**In your organisation:**
- Set verification procedures for unusual payment or data requests, including call-back checks — never rely on voice or video alone
- Train staff to recognise and report suspected deepfakes

> **Try it:** Draft a two-step verification procedure your finance team could use if they received an urgent video call from an executive asking for a payment.

## Key Takeaways

- AI enables persuasion and synthetic media at scale, with serious potential for manipulation
- Avoid designs that work around people's judgement, especially for vulnerable groups
- Label synthetic content, never fake people or reviews, and set verification procedures against deepfake fraud`,
          estimatedMinutes: 12,
          order: 2
        },
        {
          id: "lesson-4-3",
          title: "Work, Creativity and the Environment",
          type: "article",
          content: `# Work, Creativity and the Environment

Some of the biggest ethical questions about AI aren't about any single system, but about AI's combined effect on people's livelihoods, creative work and the planet.

## Work and Livelihoods

AI is changing many jobs — automating some tasks, reshaping others and creating new ones. Ethical questions for organisations include:

- **Transparency:** are employees told honestly how AI will affect their roles?
- **Transition support:** is there investment in reskilling and redeployment?
- **Sharing gains:** do productivity gains benefit workers as well as shareholders?
- **Job quality:** does AI remove drudgery, or intensify monitoring and pace?
- **Voice:** are workers and their representatives involved in decisions about AI?

## The Hidden Workforce

Many AI systems rely on people who label data, rate outputs and moderate harmful content — often low-paid contractors, sometimes exposed to disturbing material. Responsible buyers ask vendors about pay, conditions and mental-health support for this work.

## Creativity and Intellectual Property

Generative AI raises unresolved questions:

- Models are trained on large amounts of human-created work, often without permission or payment, and legal disputes over this are ongoing in several countries
- AI can imitate living artists' and writers' styles closely
- Ownership of AI-generated output varies by jurisdiction and is still evolving

Practical ethics for your work:

- Don't prompt for imitations of specific living creators to substitute for hiring them
- Respect licences and attribution
- Be transparent about AI involvement in creative work where audiences would care
- Prefer tools and providers that offer clear terms, opt-outs or licensed training data where it matters to you

## Environmental Impact

Training and running large AI models uses significant electricity and, in many data centres, water for cooling, plus the materials and energy embodied in hardware. Responsible practices:

- Use AI where it adds real value, not by default for everything
- Choose appropriately sized models — smaller models for simpler tasks
- Avoid wasteful repeated generation and unnecessary processing
- Ask providers about energy sourcing and efficiency
- Include AI in your organisation's sustainability reporting where relevant

## Access and Inclusion

AI's benefits aren't evenly distributed. Systems often work best in widely spoken languages and for well-represented groups, and access to tools and skills varies. Consider accessibility, language coverage and affordability when deploying AI to the public.

> **Try it:** For an AI rollout in your organisation, write one commitment you'd make on each of: employee transition, creative attribution and environmental impact.

## Key Takeaways

- Consider effects on jobs, job quality and the hidden workforce behind AI
- Respect creators: avoid imitation that substitutes for paying them, and be transparent
- Right-size AI use to reduce environmental costs, and consider who is left out`,
          estimatedMinutes: 13,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q4-1",
            question: "What is an 'inference' privacy risk in AI?",
            options: [
              "The model running too slowly",
              "Predicting sensitive traits people never shared, such as health conditions, from innocuous data",
              "Encrypting data",
              "Storing data in the cloud"
            ],
            correctAnswer: 1,
            explanation: "AI can deduce sensitive information from patterns in ordinary data, creating privacy harm without any data breach."
          },
          {
            id: "q4-2",
            question: "Why isn't user consent always enough to make an AI data use ethical?",
            options: [
              "Consent is illegal",
              "Terms are often unread and people may have no real alternative, so we must also consider expectations and proportionality",
              "AI doesn't need data",
              "Consent forms are too short"
            ],
            correctAnswer: 1,
            explanation: "Meaningful consent requires understanding and choice; ethics also asks what people would reasonably expect."
          },
          {
            id: "q4-3",
            question: "What's the best defence against deepfake voice fraud requesting urgent payments?",
            options: [
              "Trusting calls from known numbers",
              "A verification procedure such as calling back on a known number before acting on unusual requests",
              "Asking the caller if they are real",
              "Recording all calls"
            ],
            correctAnswer: 1,
            explanation: "Independent verification through a separate channel defeats convincing voice or video impersonation."
          },
          {
            id: "q4-4",
            question: "Which is a responsible way to reduce the environmental impact of AI use?",
            options: [
              "Always use the largest model available",
              "Use appropriately sized models and use AI where it adds real value",
              "Generate many versions of every output",
              "Ignore energy use because it's the provider's problem"
            ],
            correctAnswer: 1,
            explanation: "Right-sizing models and avoiding wasteful use cuts energy and resource consumption."
          }
        ]
      }
    },
    {
      id: "chapter-5",
      title: "Ethics in Practice",
      description: "Run ethical reviews, build a responsible culture and handle real dilemmas",
      order: 5,
      lessons: [
        {
          id: "lesson-5-1",
          title: "Running an Ethical Review",
          type: "article",
          content: `# Running an Ethical Review

Good intentions aren't a process. An ethical review gives teams a repeatable way to surface and address concerns before they become harms.

## When to Review

Trigger a review when an AI use:

- Makes or influences decisions about people
- Processes sensitive personal data
- Interacts with the public or vulnerable groups
- Generates content presented to customers or the public
- Changes significantly in purpose, data or model

Low-risk uses can use a short self-assessment; high-impact uses deserve a fuller review.

## A Practical Review Template

**1. Purpose and necessity**
- What problem are we solving? Is AI the right approach — or is a simpler, non-AI solution better?

**2. Stakeholders**
- Who is affected, including subjects and bystanders? Have we heard from them?

**3. Benefits and harms**
- What are the expected benefits, and for whom?
- What could go wrong? Who bears the cost of errors?

**4. Fairness**
- Which groups could be treated differently? What have we tested? Which fairness definition fits?

**5. Transparency and recourse**
- Will people know AI is involved? Can they understand and challenge outcomes?

**6. Privacy**
- Is the data use necessary, expected and proportionate?

**7. Oversight and accountability**
- Who owns it? What human oversight exists, and is it meaningful?

**8. Societal effects**
- Effects on jobs, information, creative work or the environment?

**9. Decision**
- Proceed / proceed with conditions / do not proceed — with reasons and conditions recorded.

**10. Follow-up**
- What will we monitor, and when will we review again?

## Who Should Be Involved

- The team building or buying the system
- Someone independent of the project who can challenge it
- Domain experts (legal, privacy, HR, clinical, etc. as relevant)
- Where possible, people representing those affected

## Integrate, Don't Duplicate

Combine ethical review with existing risk, privacy and security assessments rather than creating a separate bureaucratic hurdle. A single, well-designed review is more likely to be done properly.

> **Try it:** Run sections 1–4 of the template for an AI use you're considering. What's one condition you would attach to approval?

## Key Takeaways

- Trigger reviews for AI uses that affect people, sensitive data, the public or vulnerable groups
- Use a structured template ending in a recorded decision and follow-up plan
- Involve independent voices and affected people, and integrate with existing assessments`,
          estimatedMinutes: 12,
          order: 1
        },
        {
          id: "lesson-5-2",
          title: "Building an Ethical AI Culture",
          type: "article",
          content: `# Building an Ethical AI Culture

Processes catch some problems. Culture determines whether people notice problems in the first place — and whether they feel safe saying so.

## Signs of a Healthy Culture

- People ask "should we?" as naturally as "can we?"
- Concerns are welcomed early, not treated as obstacles
- Leaders model the behaviour: they accept delays or changes for ethical reasons
- Teams share mistakes and near-misses so others learn
- Ethical considerations appear in normal planning, not just special reviews

## Psychological Safety and Speaking Up

Many AI harms were noticed by someone inside the organisation who didn't feel able to raise them. Make speaking up easy:

- Clear channels for raising concerns, including anonymous options
- Protection against retaliation
- Visible follow-up, so people see that concerns lead to action
- Recognition for those who raise valid issues

## How to Raise an Ethical Concern Effectively

1. **Describe the specific risk** — who could be harmed, how and how likely
2. **Bring evidence** — an example output, a test result, a pattern in complaints
3. **Connect to shared goals** — trust, quality, legal risk, brand, customer outcomes
4. **Propose options** — additional testing, a pilot, human review, a design change
5. **Escalate if needed** — through the proper channel if the concern isn't addressed

Framing concerns constructively makes them far more likely to be acted on.

## Incentives Matter

If teams are rewarded only for speed and launch volume, ethics will lose. Include quality, safety and responsible-use measures in goals and reviews. Give teams time and budget for testing and review.

## Diversity and Inclusion

Teams with varied backgrounds, disciplines and life experiences are better at spotting harms that a homogeneous team would miss. Bring in perspectives from outside engineering — and from outside your organisation — especially for systems affecting diverse populations.

## Continuous Learning

- Share case studies, internal and external
- Run short exercises discussing realistic dilemmas
- Update guidance as technology, law and understanding evolve

> **Try it:** Write a short message raising a (real or hypothetical) concern about an AI feature, using the five steps above.

## Key Takeaways

- Culture determines whether problems are noticed and raised
- Build psychological safety, clear channels and visible follow-up
- Raise concerns with specifics, evidence and options — and align incentives with responsible practice`,
          estimatedMinutes: 11,
          order: 2
        },
        {
          id: "lesson-5-3",
          title: "Capstone: Working Through Real Dilemmas",
          type: "article",
          content: `# Capstone: Working Through Real Dilemmas

Let's apply the whole course to three realistic scenarios. There's no single "right" answer to any of them — the goal is a well-reasoned decision.

## Scenario 1: The Productivity Score

Your company wants to use an AI tool that scores employees' productivity from emails, calendar and chat activity, to inform performance reviews.

**Questions to work through:**
- Does activity data actually measure performance, or just visibility?
- Who could be disadvantaged — part-time staff, people with disabilities, roles with less digital activity?
- What does constant monitoring do to trust and wellbeing?
- What does the law say where you operate?

**A reasoned outcome might be:** don't use individual scores in performance reviews. If the goal is understanding workload, use aggregated, anonymised team-level insights, shared openly with employees, with their input.

## Scenario 2: The Helpful Health Chatbot

A wellness app wants an AI chatbot that answers users' health questions to reduce support costs.

**Questions:**
- What happens if it gives wrong advice — and who bears the cost?
- How will it handle emergencies or signs of crisis?
- Will users understand it's AI, not a clinician?
- How is sensitive health data protected?

**A reasoned outcome might be:** proceed only with clear AI disclosure, answers grounded in vetted medical content with sources, strict escalation for urgent symptoms and crisis signals to human help, no diagnosis, strong privacy protections, and ongoing review of conversations by clinicians.

## Scenario 3: The Marketing Avatar

Marketing proposes using an AI-generated "customer" avatar giving glowing testimonials in ads.

**Questions:**
- Would viewers believe this is a real customer?
- Is it honest? Does it comply with advertising rules?

**A reasoned outcome:** don't present a synthetic person as a real customer. If using an AI presenter, label it clearly, and use genuine testimonials from real customers with consent.

## Your Personal Checklist

Before using or deploying AI in a way that affects others, ask:

1. Who is affected, and have I considered their perspective?
2. What happens when it's wrong — and who pays?
3. Is it fair across the people it affects?
4. Would they know AI was involved, and could they challenge it?
5. Am I using data in ways people would expect?
6. Who is accountable, and is human oversight meaningful?
7. Would I be comfortable explaining this to the people affected?

## Where to Go Next

- Apply the review template to a real project
- Pair this course with **AI Governance & Compliance** to connect ethics with legal and organisational requirements
- Share a scenario discussion with your team — the conversation itself builds culture

## Key Takeaways

- Real dilemmas need reasoned judgement, not formulas
- Ask what's being measured, who bears errors, and whether people would be misled
- Use the seven-question checklist whenever AI affects others`,
          estimatedMinutes: 13,
          order: 3
        }
      ],
      quiz: {
        enabled: true,
        questions: [
          {
            id: "q5-1",
            question: "Which AI use most clearly warrants a full ethical review?",
            options: [
              "Suggesting email subject lines for internal newsletters",
              "An AI tool that influences decisions about which job applicants are interviewed",
              "Spell-checking documents",
              "Generating meeting room names"
            ],
            correctAnswer: 1,
            explanation: "Decisions about people's opportunities are high-impact and deserve a thorough review."
          },
          {
            id: "q5-2",
            question: "What should an ethical review always end with?",
            options: [
              "A press release",
              "A recorded decision (proceed, proceed with conditions, or don't proceed) with reasons and a follow-up plan",
              "A vote by the whole company",
              "Nothing — discussion is enough"
            ],
            correctAnswer: 1,
            explanation: "A documented decision and follow-up turn reflection into accountable action."
          },
          {
            id: "q5-3",
            question: "What makes raising an ethical concern most effective?",
            options: [
              "Stating that AI is dangerous in general",
              "Describing the specific risk with evidence, linking it to shared goals, and proposing options",
              "Waiting until after launch",
              "Raising it anonymously on social media first"
            ],
            correctAnswer: 1,
            explanation: "Specific, evidence-based concerns with constructive options are far more likely to lead to action."
          },
          {
            id: "q5-4",
            question: "In the marketing avatar scenario, what's the most ethical approach?",
            options: [
              "Use the avatar as a real customer since it's cheaper",
              "Don't present a synthetic person as a real customer; label AI presenters and use genuine testimonials with consent",
              "Use the avatar but hide the disclaimer in small print",
              "Ask the AI whether it's ethical"
            ],
            correctAnswer: 1,
            explanation: "Presenting a fake person as a real customer misleads viewers; honesty and consent are essential."
          }
        ]
      }
    }
  ]
});
