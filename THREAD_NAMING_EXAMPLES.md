# Intelligent Thread Naming Examples

The new `generateThreadTitle()` function analyzes user input and generates contextual thread names instead of just truncating the text.

## How It Works

1. **Detects @mentions** (@Sales, @Finance, @HR, etc.) 
2. **Identifies action verbs** (create, review, approve, send, etc.)
3. **Extracts domain keywords** (lead, invoice, employee, ticket, etc.)
4. **Generates meaningful 2-4 word titles**

## Example Transformations

### Sales Domain
- Input: `@Sales Check lead emails from HubSpot and send me a summary` → Title: `Sales Request` (mention detected) or `Lead Email Review` (domain keyword detected)
- Input: `Create a proposal for TechCorp for Q3` → Title: `Setup — Sales`
- Input: `Generate lead list for outreach` → Title: `Lead Email Review`

### Finance Domain
- Input: `@Finance Approve vendor invoices batch` → Title: `Finance Request`
- Input: `Review expenses for June and approve reconciliation` → Title: `Approval — Finance`
- Input: `Vendor payment batch needs processing` → Title: `Vendor Management`

### HR Domain  
- Input: `@HR Onboarding checklist for new employee` → Title: `HR Request`
- Input: `Employee records need updating for Dhathri's start` → Title: `Employee Onboarding`
- Input: `Schedule new hire orientation` → Title: `Schedule — HR`

### Support Domain
- Input: `@Support Critical SLA breach risk on TK-4521` → Title: `Support Request`
- Input: `Review open tickets by priority` → Title: `Support Ticket`

### Marketing Domain
- Input: `Analyze competitor pricing for Q3` → Title: `Market Analysis`
- Input: `Create social media campaign for product launch` → Title: `Campaign Management`

### DevOps Domain
- Input: `Deploy new version to production` → Title: `Deployment Request`
- Input: `Check server infrastructure status` → Title: `DevOps Request`

## Priority Order

The function uses this priority order to generate titles:

1. **Mention-based** - If @Sales/@Finance/@HR/@Support/@Marketing/@DevOps/@Command detected → Use agent-specific title
2. **Action + Domain combo** - If action verb (approve, review, create) + domain detected → Generate "Action — Domain" title
3. **Domain keyword-based** - If strong domain keyword (lead, invoice, employee, ticket, etc.) detected → Use keyword-specific title
4. **First meaningful phrase** - Extract first 2-3 words as title
5. **Fallback** - Use first 40 characters of input

## Where This Is Applied

- **EAIScreen.tsx** - When employee creates a new thread with `@mention agent query`
- **Task comments** - When thread name would be generated for task activity (future enhancement)
- **Workflow comments** - When thread name would be generated for workflow activity (future enhancement)

## Testing

Run your app and try creating threads with these sample inputs in the Employee AI screen to see the intelligent naming in action!

Example: Type `@Sales Check the latest leads from our CRM` and send - the thread will be named `Sales Request` instead of `@Sales Check the latest leads from ou...`
