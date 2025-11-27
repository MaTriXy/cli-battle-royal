# CLI Battle Royal 🥊💻

```text
   ██████╗██╗     ██╗    ██████╗  █████╗ ████████╗████████╗██╗     ███████╗
  ██╔════╝██║     ██║    ██╔══██╗██╔══██╗╚══██╔══╝╚══██╔══╝██║     ██╔════╝
  ██║     ██║     ██║    ██████╔╝███████║   ██║      ██║   ██║     █████╗
  ██║     ██║     ██║    ██╔══██╗██╔══██║   ██║      ██║   ██║     ██╔══╝
  ╚██████╗███████╗██║    ██████╔╝██║  ██║   ██║      ██║   ███████╗███████╗
   ╚═════╝╚══════╝╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝╚══════╝
                    ██████╗  ██████╗ ██╗   ██╗ █████╗ ██╗
                    ██╔══██╗██╔═══██╗╚██╗ ██╔╝██╔══██╗██║
                    ██████╔╝██║   ██║ ╚████╔╝ ███████║██║
                    ██╔══██╗██║   ██║  ╚██╔╝  ██╔══██║██║
                    ██║  ██║╚██████╔╝   ██║   ██║  ██║███████╗
                    ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝

            ⚔️  three models enter  •  one wins  ⚔️
```

**Three CLIs. Three LLMs. Same inputs. No excuses.**

So I took **3 different CLI tools** (each backed by a different **LLM**) for a quick test drive to see how they behave in a real, day-to-day dev workflow.

---

## What I Tested (Setup & Goals)

1. **Latest CLI versions + latest available models**  
2. **Out-of-the-box experience** — minimal setup, minimal glue code  
3. **Same exact inputs for everyone**  
   - identical **UI image**
   - identical **prompt**

---

## Why I’m Doing This

I’m building my own daily setup and I like to periodically sanity-check what’s out there:

- which tools uncover **new capabilities**
- which ones introduce **pitfalls**
- what I should plan for in my own workflows

This is an **early, preliminary test**.  
I’ll keep iterating and adding branches based on:

- audience demand
- new tools / model releases
- features people request

---

## The Contenders

| CLI | LLM | Link |
|-----|-----|------|
| **Claude Code** | Claude (Anthropic) | [anthropics/claude-code](https://github.com/anthropics/claude-code) |
| **Codex CLI** | GPT-X-Codex (OpenAI) | [openai/codex](https://github.com/openai/codex) |
| **Gemini CLI** | Gemini (Google) | [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) |

---

## Battles

| # | Battle | Description | Code | Video |
|---|--------|-------------|------|-------|
| 001 | [React Native UI](battles/001-react-native-ui/) | Build a mobile app from a UI screenshot | [View](battles/001-react-native-ui/) | Coming Soon |

---

## How to Navigate

```text
cli-battle-royal/
├── README.md           # You are here
└── battles/
    └── 001-react-native-ui/
        ├── README.md   # Battle details
        ├── input/      # What each CLI was given
        ├── artifacts/  # Screenshots of results
        ├── claude/     # Claude Code output
        ├── codex/      # Codex CLI output
        └── gemini/     # Gemini CLI output
```

---

## License / Usage

All code in this repo is **free to use for non-commercial purposes**, **as long as you give acknowledgment**:

**Credit required:**  

- **Yossi Elkrief**  
- GitHub: **MaTriXy** (mention/profile link)

**Commercial usage:**  
If you want to use any of this commercially (directly or inside a commercial product), please **sponsor my GitHub** first.

✅ Non-commercial use: allowed with attribution  
💼 Commercial use: requires sponsorship + attribution

---

## Attribution Example

If you’re using code from this repo, include something like:

> “Based on CLI Battle Royale by Yossi Elkrief (GitHub: MaTriXy).”

---

## Author

Built by **Yossi Elkrief** — GitHub: **MaTriXy**
