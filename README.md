<a href="https://github.com/mindful-ai-dude">
<img alt="Agentic Multi-LLM AI Assistant Built With Next.js 15 App Router, React 19, Tavily Search, and Vercel's AI SDK.  Built with love by Gregory Kennedy." src="app/opengraph-image.png">
  <h1 align="center">Multi-LLM AI Assistant</h1>
</a>

<p align="center">
  An Open-Source AI Assistant Built With Next.js 15 App Router, React 19, Multiple LLM Providers, and Vercel's AI SDK.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#architecture"><strong>Architecture</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing for seamless navigation and performance
  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for generating text, structured objects, and tool calls with Multi-LLMs
  - Hooks for building dynamic chat and generative user interfaces
  - Supports multiple LLM providers with a unified interface
- Supported Models
  - [Anthropic Claude](https://www.anthropic.com/claude)
    - Claude 3.7 Sonnet - Anthropic's most intelligent model with extended thinking capabilities
    - Claude 3.5 Sonnet - Balances intelligence and speed for enterprise workloads
  - [OpenAI](https://openai.com/)
    - o3-mini - OpenAI's efficient and capable model
  - [Google](https://deepmind.google/technologies/gemini/)
    - Gemini 2.0 Flash - Google's powerful, fast, and efficient model
  - [Groq](https://groq.com/)
    - Qwen-QWQ-32B - High-performance open source LLM
  - [Mistral](https://mistral.ai/)
    - Codestral - Specialized for code generation and understanding
  - [Perplexity](https://www.perplexity.ai/)
    - Perplexity Sonar - Research-focused model
  - [OpenRouter](https://openrouter.ai/)
    - Access to various models through a unified API
- Features
  - Model Switching - Seamlessly switch between different LLM providers
  - Reasoning Mode - Toggle step-by-step reasoning for more detailed responses
    - Default state: Disabled (off)
    - A toggle button labeled "Reasoning" appears in the chat input area
    - When enabled (toggled on), the AI provides detailed step-by-step reasoning in its responses
    - When disabled (toggled off), the AI provides direct, concise responses
    - Can be toggled on/off at any time during the conversation
  - Tavily Web Search - Enhance AI responses with real-time web search results
    - Available on the dedicated Tavily AI Search page (/tavily-ai-search)
    - Toggle web search on/off with a simple switch
    - Provides up-to-date information from the web to improve AI responses
    - Works with all supported models
  - AI Agents - Multi-step AI processing with model switching
    - Primary model performs research using Tavily search
    - Secondary model processes and synthesizes the results
    - Comprehensive logging system:
      - `tavily_output/` - Contains raw search results from the primary model
      - `ai_agents_output/` - Contains both models' outputs:
        - Individual JSON files: `ai-agents-{timestamp}-{primary-model}-{secondary-model}.json`
        - Summary log: `ai-agents-log.jsonl`
      - Real-time log monitoring: `tail -f ai_agents_output/ai-agents-log.jsonl`
- [shadcn/ui](https://ui.shadcn.com)
  - Styling with [Tailwind CSS](https://tailwindcss.com)
  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility

## Architecture

The application follows a modern architecture pattern using Next.js and the Vercel AI SDK to communicate with various LLM providers.

For a detailed view of the application architecture, including component breakdown, data flow, and a mermaid diagram, see the [Architecture Documentation](docs/project-structure-ui-ux-flow.md).

## Deploy Your Own

You can deploy your own version of the Next.js AI Chatbot to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-reasoning%2Ftree%2Fmain&env=ANTHROPIC_API_KEY,OPENAI_API_KEY,GOOGLE_GENERATIVE_AI_API_KEY,GROQ_API_KEY,MISTRAL_API_KEY,PERPLEXITY_API_KEY,OPENROUTER_API_KEY,TAVILY_API_KEY&envDescription=API%20keys%20for%20various%20LLM%20providers&envLink=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-reasoning%2Fblob%2Fmain%2F.env.example)

## Required API Keys

To use all the supported models, you'll need to obtain API keys from the following providers:

- [Anthropic API Key](https://console.anthropic.com/) - For Claude models
- [OpenAI API Key](https://platform.openai.com/account/api-keys) - For o3-mini model
- [Google AI API Key](https://aistudio.google.com/apikey) - For Gemini models
- [Groq API Key](https://console.groq.com/keys) - For Qwen model
- [Mistral API Key](https://console.mistral.ai/api-keys) - For Codestral model
- [Perplexity API Key](https://www.perplexity.ai/) - For Perplexity Sonar model
- [OpenRouter API Key](https://openrouter.ai/settings/keys) - For OpenRouter models
- [Tavily API Key](https://tavily.com/) - For web search functionality

Add these keys to your `.env.local` file or Vercel environment variables.

## Supabase Integration

The application now includes Supabase integration for chat history management:

- **Chat History Persistence**: Store and retrieve chat sessions and messages
- **User-specific Data**: Row Level Security (RLS) ensures users can only access their own data
- **Time-based Filtering**: Filter chat history by time periods (7, 14, 30 days, or all)
- **Session Management**: Copy, delete, and restore chat sessions

### Supabase Setup

To use the Supabase integration, add the following environment variables to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

The database schema can be found in `supabase/schema.sql`. Run these SQL statements in the Supabase SQL editor to set up the necessary tables and Row Level Security policies.

For detailed setup instructions, see the [Supabase Integration Documentation](supabase/README.md).

## Testing

The application includes comprehensive tests to ensure all features work correctly:

### Running Tests

```bash
# Run Jest tests
pnpm test

# Run model tests
pnpm test:models

# Run all tests (Jest + model tests)
pnpm test:all
```

### Test Coverage

- **Unit Tests**: Test individual components and functions
- **API Tests**: Test API routes for chat and search functionality
- **Model Tests**: Test all supported AI models
- **Integration Tests**: Test the complete application flow

For detailed testing instructions, see the [Tavily Testing Guide](docs/tavily-testing-guide.md).

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app template should now be running on [localhost:3000](http://localhost:3000/).

## NODE MODULES - REMOVAL & CACHE CLEANING

```bash
rm -rf node_modules && pnpm store prune 
```
## NODE MODULES - REMOVAL, CACHE CLEANING & APP INSTALLATION

```bash
rm -rf node_modules && pnpm store prune && pnpm install
```

## NODE MODULES - REMOVAL, CACHE CLEANING, APP INSTALLATION & APP START

```bash
rm -rf node_modules && pnpm store prune && pnpm install && pnpm dev
```

## Shut down the npm server

```bash
pkill -f "npm"