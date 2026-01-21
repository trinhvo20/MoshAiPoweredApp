import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
  content: string;
  role: 'user' | 'bot';
};

type Props = {
  messages: Message[];
};

const ChatMessages = ({ messages }: Props) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  // Handle auto scroll to the latest message
  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle copy message properly (trim whitespace from html)
  const onCopyMessage = (
    e: React.ClipboardEvent<HTMLParagraphElement>
  ): void => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message, index) => (
        <div
          key={index}
          onCopy={onCopyMessage}
          ref={index === messages.length - 1 ? lastMessageRef : null} // set the ref to the last message
          className={`px-3 py-1 max-w-lg rounded-xl ${message.role === 'user' ? 'bg-rose-400 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
