# LLM risk triggers

Read this file only when a change sends data to, or acts on output from, a large language model (LLM).
It complements ASVS. It does not replace it: the surrounding web feature still needs the ASVS requirements.

Source: OWASP Top 10 for LLM Applications (OWASP GenAI Security Project), https://genai.owasp.org.
Risk names below follow the 2025 edition. If your organisation has adopted the 2026 edition,
map each name to its 2026 ID before citing it in a PR.

| If the change... | Consider this risk | Ask the team |
|---|---|---|
| Puts user-supplied or third-party text into a prompt | Prompt injection | What can an attacker make the model do or reveal? Which instructions are trusted? |
| Sends customer records, notes or secrets to a model | Sensitive information disclosure | Which fields are sent? Is the provider approved for this data classification? |
| Renders, executes or stores model output | Improper output handling | Is output encoded for its context (HTML, SQL, CSV, shell)? |
| Lets the model call tools or APIs | Excessive agency | Which actions can it take? Are they scoped to the caller's permissions and tenant? |
| Has a system prompt with business rules or secrets | System prompt leakage | Would it matter if the system prompt were disclosed? Keep secrets out of it. |
| Retrieves documents into the prompt (RAG) | Vector and embedding weaknesses | Is retrieval tenant-scoped? Can one tenant's documents reach another's prompt? |
| Shows model output to users as fact | Misinformation | How is output labelled? Who checks it before it is acted on? |
| Allows unbounded prompts or calls | Unbounded consumption | What are the size, rate and cost limits per user and tenant? |
| Adds a model, SDK or dataset dependency | Supply chain | Is the source approved and pinned? |

## Translating into acceptance criteria

LLM risks usually become criteria on the **surrounding application**, for example:

- Only fields on an explicit allow-list are included in the prompt (ASVS 15.3.1, 8.2.3).
- Retrieval and tool calls use the caller's tenant and permissions (ASVS 8.2.2, 8.4.1).
- Model output is encoded before rendering (ASVS chapter V1).
- Requests are rate limited per user (ASVS 2.4.1).
