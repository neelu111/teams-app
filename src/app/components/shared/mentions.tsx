import React from 'react';

export interface MentionOption {
  label: string;
  type: 'user' | 'agent';
}

export interface ActiveMention {
  start: number;
  end: number;
  query: string;
}

const mentionTokenRegex = /@(?:\{[^}\n]+\}|[A-Za-z][A-Za-z0-9_-]*)/g;

export function getActiveMention(value: string, caret: number): ActiveMention | null {
  const beforeCaret = value.slice(0, caret);
  const match = beforeCaret.match(/(?:^|\s)@(\{?)([^\s{}]*)$/);
  if (!match || match.index === undefined) {
    return null;
  }

  const mentionStart = match.index + (match[0].startsWith(' ') ? 1 : 0);
  return {
    start: mentionStart,
    end: caret,
    query: match[2].toLowerCase(),
  };
}

export function getMentionSuggestions(options: MentionOption[], query: string): MentionOption[] {
  const deduped = Array.from(new Map(options.map(option => [option.label.toLowerCase(), option])).values());
  if (!query) {
    return deduped;
  }

  return deduped.filter(option => option.label.toLowerCase().includes(query));
}

export function insertMention(value: string, mention: ActiveMention, label: string): { nextValue: string; nextCaret: number } {
  const needsBraces = /\s/.test(label);
  const token = needsBraces ? `@{${label}} ` : `@${label} `;
  const nextValue = value.slice(0, mention.start) + token + value.slice(mention.end);
  const nextCaret = mention.start + token.length;

  return { nextValue, nextCaret };
}

export function renderTextWithMentions(text: string, mentionClassName: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = mentionTokenRegex.exec(text)) !== null) {
    const index = match.index;
    const token = match[0];

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    nodes.push(
      <span key={`mention-${index}`} className={mentionClassName}>
        {token}
      </span>
    );

    lastIndex = index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function extractMentionLabels(text: string): string[] {
  const labels = new Set<string>();
  let match: RegExpExecArray | null;
  mentionTokenRegex.lastIndex = 0;

  while ((match = mentionTokenRegex.exec(text)) !== null) {
    const token = match[0];
    const normalized = token.startsWith('@{') && token.endsWith('}')
      ? token.slice(2, -1)
      : token.slice(1);
    if (normalized.trim()) {
      labels.add(normalized.trim());
    }
  }

  return Array.from(labels);
}
