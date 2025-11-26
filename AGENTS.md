# OpenCode Agents Configuration for FlagMeter

This file configures specialized OpenCode agents for working on the FlagMeter project. These agents are designed to help with different aspects of development, from building features to code review and debugging.

## Quick Reference

| Agent | Mode | Purpose | Tools |
|-------|------|---------|-------|
| `build` (default) | Primary | Full development work | All tools enabled |
| `plan` | Primary | Analysis & planning | Read-only |
| `general` | Subagent | Search & exploration | All tools |
| `database` | Subagent | Database schema & migrations | Edit + bash |
| `api-dev` | Subagent | API endpoint development | All tools |
| `worker-dev` | Subagent | Worker logic development | All tools |
| `reviewer` | Subagent | Code review | Read-only + documentation |

---

## Agent Configurations

### Primary Agents

#### `build` (Default)
- **Mode**: Primary
- **Purpose**: Main development agent with full access to all tools
- **Use when**: Building features, fixing bugs, implementing changes
- **Tools**: All enabled (write, edit, bash, etc.)
- **Access**: Complete codebase access

```
Use TAB to switch to this agent (it's the default).
```

**Example usage:**
```
Add authentication to the POST /events endpoint using API keys
```

---

#### `plan`
- **Mode**: Primary
- **Purpose**: Planning and code analysis without making changes
- **Use when**: Reviewing architecture, understanding code flow, planning refactors
- **Tools**: Read-only (no file edits, no bash commands)
- **Permissions**: All file operations set to `ask`

```
Use TAB to switch between primary agents.
```

**Example usage:**
```
Analyze the event processing flow from API to Worker and suggest optimizations
```

---

### Subagents

#### `general` (Built-in)
- **Mode**: Subagent
- **Purpose**: General-purpose research and multi-step searching
- **Use when**: Searching for code patterns, finding where features are implemented
- **Tools**: All tools enabled
- **Invocation**: Mention with `@general`

**Example usage:**
```
@general Find all places where we handle Slack webhooks in this codebase
```

---

#### `database`
- **Mode**: Subagent
- **Purpose**: Database schema management, migrations, and queries
- **Use when**: Modifying database schema, writing migrations, optimizing queries
- **Tools**: Edit, bash (for drizzle-kit commands)
- **Focus**: `packages/db/` directory

**Example usage:**
```
@database Add a new `rate_limits` table to track per-tenant rate limiting
```

**Commands available through this agent:**
- `pnpm db:generate` - Generate migrations
- `pnpm db:push` - Apply migrations
- `pnpm db:studio` - Drizzle Studio
- `pnpm db:seed` - Seed database

---

#### `api-dev`
- **Mode**: Subagent
- **Purpose**: API endpoint development and dashboard features
- **Use when**: Adding new endpoints, modifying request/response handlers
- **Tools**: All tools enabled
- **Focus**: `apps/dashboard/` directory

**Example usage:**
```
@api-dev Create a new GET /usage/:tenant/history endpoint that returns usage over the last 7 days
```

**Key files:**
- `apps/dashboard/src/routes/api/` - API endpoints
- `apps/dashboard/src/components/` - React components
- `apps/dashboard/src/server/` - Server handlers

---

#### `worker-dev`
- **Mode**: Subagent
- **Purpose**: Background worker and event processing logic
- **Use when**: Modifying aggregation logic, event processing, Slack notifications
- **Tools**: All tools enabled
- **Focus**: `apps/worker/` directory

**Example usage:**
```
@worker-dev Implement exponential backoff for Slack webhook failures
```

**Key files:**
- `apps/worker/src/index.ts` - Main worker loop
- `apps/worker/src/services/` - Business logic

---

#### `reviewer`
- **Mode**: Subagent
- **Purpose**: Code review and quality checks
- **Use when**: Reviewing PRs, analyzing code quality, security audits
- **Tools**: Read-only access
- **Permissions**: 
  - File edits: `deny`
  - Bash: `deny` (except read-only commands)

**Example usage:**
```
@reviewer Review this implementation for security, performance, and best practices
```

---

## Working with Agents

### Switching Primary Agents

Use the **TAB** key to cycle between primary agents (`build` and `plan`).

**Workflow example:**
1. Press `TAB` to switch to `plan` agent
2. Ask: "What's the best way to implement rate limiting?"
3. Review the analysis and plan
4. Press `TAB` again to switch back to `build`
5. Ask: "Implement that plan"

---

### Using Subagents

Mention subagents with `@` to invoke them:

```
@database Create a migration to add an index on (tenant, created_at) in the events table
```

Subagents can be used for:
- **Research**: Use `@general` to find code patterns
- **Specialized tasks**: Use domain-specific agents like `@database` or `@worker-dev`
- **Review**: Use `@reviewer` to analyze code quality

---

### Referencing Files

Use `@` to fuzzy-search for files:

```
How is the event ingestion handled in @apps/dashboard/src/routes/api/events.ts?
```

Or reference specific functions/components:

```
@database Modify the schema used in @packages/db/schema.ts to add soft deletes
```

---

## Project-Specific Workflows

### Adding a New API Endpoint

**Suggested workflow:**

1. **Plan it out** (Tab → Plan agent)
   ```
   We need a new GET /webhook-logs/:tenant endpoint to see recent webhook delivery logs.
   What tables should we query? What fields should we return?
   ```

2. **Get expert input** (Mention @api-dev)
   ```
   @api-dev Create this endpoint. It should return the last 50 webhook deliveries 
   with timestamps, status codes, and error messages.
   ```

3. **Review it** (Mention @reviewer)
   ```
   @reviewer Check the new endpoint for security, error handling, and performance
   ```

---

### Modifying Database Schema

**Suggested workflow:**

1. **Discuss the change** (Plan agent)
   ```
   We want to track webhook retry attempts. Should we create a separate table 
   or add a column to existing tables?
   ```

2. **Execute the migration** (@database agent)
   ```
   @database Add a `webhook_deliveries` table with: id, tenant_id, url, 
   payload, status_code, error_message, created_at, retry_count
   ```

3. **Update worker logic** (@worker-dev agent)
   ```
   @worker-dev Modify the webhook sending logic to log attempts to the new table
   ```

---

### Debugging Performance Issues

**Suggested workflow:**

1. **Analyze** (Plan agent)
   ```
   The POST /events endpoint is slow when we have 1,000 concurrent requests. 
   Where are the bottlenecks?
   ```

2. **Implement fixes** (Build agent)
   ```
   Implement connection pooling for PostgreSQL in apps/dashboard
   ```

3. **Review** (@reviewer agent)
   ```
   @reviewer Check for any connection leak risks in the new pooling code
   ```

---

## Configuration Details

### Agent Permissions

By default:
- **Build agent**: `ask` for file edits and bash (requires confirmation)
- **Plan agent**: `deny` for file edits and bash (read-only)
- **Subagents**: Vary by purpose (see agent descriptions above)

### Temperature Settings

- **Database agent**: `0.1` (precise, deterministic)
- **API/Worker agents**: `0.3` (balanced)
- **Review agent**: `0.1` (precise analysis)

### Tool Access

All agents have access to:
- File reading and analysis
- Code search and pattern matching
- TypeScript type checking

Domain-specific agents have additional access:
- **@database**: Drizzle ORM tools, SQL execution
- **@api-dev**: React component tools, HTTP utilities
- **@worker-dev**: Queue operations, async task management

---

## Tips & Best Practices

### 1. Use Plan Agent for Architecture Decisions
Before implementing large changes, use the plan agent to review the approach:

```
[TAB] → Switch to Plan
```

### 2. Leverage Specialized Agents
Don't ask the build agent to do database work. Use:

```
@database for schema changes
@api-dev for endpoint changes
@worker-dev for background job changes
```

### 3. Provide Context
When asking agents to make changes, provide:
- The file path: `@apps/dashboard/src/routes/api/events.ts`
- The current behavior
- The desired behavior
- Any constraints or requirements

**Good:**
```
@api-dev Add a ?limit=100 query parameter to GET /usage/:tenant endpoint. 
Default to 50. See the pattern in @apps/dashboard/src/routes/api/rollups.ts for reference.
```

**Not as clear:**
```
@api-dev Add pagination
```

### 4. Review Code Quality
After making changes, use the reviewer agent:

```
@reviewer Check this implementation for edge cases and error handling
```

### 5. Reference the Handover Document
If agents seem confused, reference `PROJECT_HANDOVER.md`:

```
See PROJECT_HANDOVER.md for architecture overview. 
I need to add a new feature following the same patterns.
```

---

## Troubleshooting

### Agent can't find files

If an agent struggles to find a file:
- Use `@` to fuzzy search and get the exact path
- Provide the full path from the project root
- Example: `@packages/db/schema.ts` (not just `schema.ts`)

### Agent modifying wrong files

If an agent edits the wrong file:
- Use `/undo` to revert changes
- Provide more specific file references
- Use the plan agent first to review the approach

### Agent not specialized enough for the task

Some tasks need a more general agent:
- Switch to the `build` agent for general work
- Use `@general` for exploration tasks
- Use multiple agents in sequence (plan → specialized → review)

---

## Creating New Agents

To create a new specialized agent for a specific task:

```bash
opencode agent create
```

This will guide you through:
1. Choosing global or project-specific
2. Describing the agent's purpose
3. Selecting tool access
4. Generating the configuration

The agent will be saved as a markdown file in `.opencode/agent/` or globally.

### Example: Creating a TypeScript Validation Agent

```bash
$ opencode agent create
? Where to save: .opencode/agent/
? Description: Validates TypeScript code and checks for type errors
? Generate prompt? yes
? Tools: read (yes), write (no), bash (yes)
```

This creates `.opencode/agent/ts-validator.md` with appropriate configuration.

---

## Resources

- **Project Handover**: See `PROJECT_HANDOVER.md` for project overview
- **OpenCode Docs**: https://opencode.ai/docs/agents/
- **Architecture**: Review `README.md` for system design
- **Database Schema**: Run `pnpm db:studio` to explore live schema

---

## Summary

- Use **TAB** to switch between `build` and `plan` primary agents
- Mention **@agent-name** to invoke specialized subagents
- Use **@** to fuzzy-search for files
- Start with the **plan** agent for architectural decisions
- Use specialized **@database**, **@api-dev**, **@worker-dev** agents for domain work
- Always use **@reviewer** for security and quality checks
- Use `/undo` if an agent makes unwanted changes

Happy coding! 🚀
