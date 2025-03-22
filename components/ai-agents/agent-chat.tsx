'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { ModelConfig, AVAILABLE_MODELS } from '@/lib/ai-agents/types';
import { cn } from '@/lib/utils';
import type { Message } from 'ai';
import { CopyButton } from '../copy-icon';

interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

interface ExtendedMessage extends Message {
  toolCalls?: ToolCall[];
}

interface AgentChatProps {
  className?: string;
}

function ModelSelect({ 
  label, 
  value, 
  onChange, 
  models = AVAILABLE_MODELS 
}: { 
  label: string; 
  value: ModelConfig; 
  onChange: (model: ModelConfig) => void; 
  models?: ModelConfig[]; 
}) {
  return (
    <div className="flex-1">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        className="w-full p-2 rounded-md border bg-background"
        value={value.model}
        onChange={(e) => {
          const model = models.find(m => m.model === e.target.value);
          if (model) onChange(model);
        }}
      >
        {models.map((model) => (
          <option key={model.model} value={model.model}>
            {model.label} ({model.provider})
          </option>
        ))}
      </select>
    </div>
  );
}

export function AgentChat({ className }: AgentChatProps) {
  const [primaryModel, setPrimaryModel] = useState<ModelConfig>(AVAILABLE_MODELS[0]);
  const [secondaryModel, setSecondaryModel] = useState<ModelConfig>(AVAILABLE_MODELS[1]);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai-agents',
    body: {
      primaryModel,
      secondaryModel,
    },
  });

  return (
    <div className={cn('flex flex-col h-[calc(100vh-12rem)]', className)}>
      <div className="flex gap-4 mb-4">
        <ModelSelect
          label="Primary Model (Research)"
          value={primaryModel}
          onChange={setPrimaryModel}
        />
        <ModelSelect
          label="Secondary Model (Processing)"
          value={secondaryModel}
          onChange={setSecondaryModel}
        />
      </div>

      <div className="flex-1 overflow-auto border rounded-md p-4 mb-4">
        {messages.map((message) => {
          const extendedMessage = message as ExtendedMessage;
          return (
            <div
              key={message.id}
              className={cn(
                'mb-4 last:mb-0',
                message.role === 'assistant' ? 'pl-4 border-l-2 relative' : ''
              )}
            >
              <div className="font-medium mb-1">
                {message.role === 'user' ? 'You' : 'Assistant'}:
              </div>
              {message.role === 'assistant' && (
                <div className="absolute -left-10 top-0">
                  <CopyButton 
                    content={message.content || ''} 
                  />
                </div>
              )}
              <div className="whitespace-pre-wrap">
                {message.content}
                {extendedMessage.role === 'assistant' && extendedMessage.toolCalls?.map((tool, index) => (
                  <div key={index} className="bg-muted p-2 rounded my-2 text-sm font-mono">
                    <div className="font-medium">Tool Call: {tool.function.name}</div>
                    <pre className="mt-1">
                      {JSON.stringify(JSON.parse(tool.function.arguments), null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Send a message..."
          className="flex-1 p-2 rounded-md border bg-background"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            'px-4 py-2 rounded-md bg-primary text-primary-foreground',
            'hover:bg-primary/90 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          Send
        </button>
      </form>
    </div>
  );
}
