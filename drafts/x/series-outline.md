# X/Twitter Article Series Outline

This is the primary X/Twitter publishing plan for the Codex vs Claude Code vs Pi (pi.dev) work.

Decision: start with three long-form X Articles, not seven smaller articles. Use short posts, clips, screenshots, and threads around each article. Add follow-up articles only if audience questions show demand.

## Series Title

Working title:

> The Agent Harness Is the Product

Alternative titles:

- Codex vs Claude Code vs Pi: The Harness Comparison
- The New Coding Agent Stack
- What Actually Makes an Agentic Coding Tool Useful

## Article 1: The Agent Harness Is the Product

### Core Claim

The difference between modern coding agents is not only model quality or prompt style. The harness controls the actual workflow: context, tools, permissions, memory, lifecycle, verification, review, and handoff.

### Reader Promise

After reading this, the reader understands why comparing Codex, Claude Code, and Pi as "AI coding tools" is too shallow.

### Hook Options

1. The most important part of an AI coding tool is no longer the prompt. It is the harness.
2. Codex, Claude Code, and Pi can all help write code. The real difference is what they let you control around the code.
3. The next wave of AI coding will be decided by harnesses, not just models.

### Sections

1. Why prompt comparisons are not enough.
2. What an agent harness actually controls.
3. The three tools in one sentence:
   - Codex: integrated OpenAI agent workflow.
   - Claude Code: lifecycle-rich coding agent.
   - Pi: useful minimal core and a deeply programmable harness.
4. Built-in vs configured vs custom-built.
5. The practical question: how much workflow can a team standardize?
6. What the rest of the series will test.

### Visuals

- Harness anatomy diagram.
- Three-column comparison card.
- "Built-in / Configured / Custom-built" ladder.

### Supporting X Posts

- "The prompt is only one layer. The harness decides what context loads, what tools run, what commands are allowed, and what happens before handoff."
- "If an agent can write code but cannot reliably verify, review, and hand off, you do not have a workflow. You have a demo."
- "I am comparing Codex, Claude Code, and Pi through the same workflow, not through vibes."

## Article 2: Pi vs Codex vs Claude Code: How Minimal Is Minimal?

### Core Claim

Pi starts as a useful minimal coding harness. That can require more operator-owned policy and isolation than a broader product, while making deep customization unusually direct.

### Reader Promise

After reading this, the reader understands what Pi is, what works before project configuration, how setup grows by level, and why it should not be evaluated as an incomplete clone of Claude Code or Codex.

### Hook Options

1. Pi is not trying to be Claude Code with different branding. It is a smaller, programmable harness.
2. "Minimal" is not automatically weak. It depends whether you want more product policy or more harness ownership.
3. The interesting question about Pi is not "does it have every feature built in?" It is "what works immediately, and what do I own when I extend it?"

### Sections

1. The team question: is Pi worth comparing?
2. Codex in one frame: productized OpenAI workflow.
3. Claude Code in one frame: lifecycle automation.
4. Pi in one frame: useful core tools and context files, then extensions, skills, providers, and packages.
5. Setup levels:
   - Level 1: basic terminal agent.
   - Level 2: project-local skills/settings.
   - Level 3: custom TypeScript extension.
6. How much configuration each tool needs.
7. When Pi's minimal design creates operator burden.
8. When Pi's programmable design is the point.

### Visuals

- Setup effort table.
- Pi "default to custom harness" ladder.
- One file tree showing `.pi/settings.json`, skills, prompts, extensions.

### Supporting X Posts

- "Pi starts useful, but it leaves more policy and isolation to the operator. That tradeoff is the comparison."
- "Codex gives you a productized agent workflow. Claude Code gives you lifecycle automation. Pi gives you a smaller core and a direct extension surface."
- "If your agentic workflow needs custom commands, custom tools, and event interception, Pi becomes more interesting."

## Article 3: Same Agentic Workflow, Three Harnesses

### Core Claim

The real comparison only appears when the task is identical. The interesting part is not just what code each tool writes, but what each harness requires before, during, and after the code change.

### Reader Promise

After reading this, the reader sees a concrete side-by-side workflow and can choose the right harness for their own team.

### Hook Options

1. I ran the same agentic workflow through Codex, Claude Code, and Pi. The interesting part was not only the code they wrote. It was what I had to build around them.
2. The best way to compare coding agents is to force the same workflow, the same repo, and the same verification expectations.
3. A coding agent is only as useful as the workflow it can repeat.

### Sections

1. The demo repo and task.
2. The required workflow gate:
   - repo orientation
   - spec
   - implementation
   - verification
   - review
   - handoff
3. Codex setup and result.
4. Claude Code setup and result.
5. Pi setup and result.
6. Comparison table:
   - files/config needed
   - ease of setup
   - enforcement strength
   - custom tool path
   - review/handoff quality
   - repeatability
7. Final decision guide:
   - choose Codex when...
   - choose Claude Code when...
   - choose Pi when...
8. Open follow-up questions.

### Visuals

- Same workflow swimlane.
- Results table.
- Decision tree.
- Short terminal clips for each harness.

### Supporting X Posts

- "A good agent workflow has a beginning, middle, and end: orient, specify, implement, verify, review, hand off."
- "Instruction-only workflows are easy to write and easy to bypass. The interesting question is where each harness lets you make policy concrete."
- "Codex, Claude Code, and Pi all get you to code. They differ in how much of the surrounding workflow they make repeatable."

## Follow-Up Article Pool

Write these only if there is demand from comments, DMs, or reposts.

1. `Security and Permissions in Agentic Coding Harnesses`
   - sandboxing
   - approvals
   - network access
   - secrets
   - command trust

2. `Hooks vs Skills vs Extensions`
   - Codex skills
   - Claude Code hooks/subagents
   - Pi extensions/skills
   - which mechanism fits which workflow

3. `Building a Spec Gate for Coding Agents`
   - one workflow gate
   - three harness implementations
   - how to prevent premature coding

4. `Custom Tools in Pi`
   - TypeScript extension example
   - custom command
   - custom tool
   - event interception

5. `What Teams Should Standardize Before Adopting Coding Agents`
   - instructions
   - verification
   - review
   - handoff
   - permission model

## Publishing Rhythm

Recommended rhythm:

1. Publish Article 1.
2. Post 3-5 short supporting posts over the next 48 hours.
3. Publish Article 2 after audience has had time to react.
4. Post screenshots and Pi setup examples.
5. Publish Article 3 after the hands-on demo is captured.
6. Use comments and questions to choose the first follow-up article.

## Success Signals

Track:

- Are people asking for hands-on setup details?
- Are people asking where Pi's minimal core creates extra operator work?
- Are people asking about security and permissions?
- Are people asking for reusable templates?
- Are people asking for video walkthroughs?
- Are people asking about team adoption?

Use those signals to decide the next article after the three-part series.
