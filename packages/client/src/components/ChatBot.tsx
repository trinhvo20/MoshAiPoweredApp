import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

type Message = {
  content: string;
  role: 'user' | 'bot';
};

const ChatBot = () => {
  const conversationId = useRef(crypto.randomUUID());
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  // Hanlde Click submit form
  const onSubmit = async (formData: FormData) => {
    try {
      // formData.prompt = user's message
      setMessages((prev) => [
        ...prev,
        { content: formData.prompt, role: 'user' },
      ]);

      setIsBotTyping(true);
      setError('');
      reset({ prompt: '' }); // clear the chatbox

      // send user's chat to backend
      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt: formData.prompt,
        conversationId: conversationId.current,
      });
      console.log(data);

      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
    } catch (error) {
      console.error(error);
      setError('Something went wrong!');
    } finally {
      setIsBotTyping(false);
    }
  };

  // Handle Enter submit form
  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

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
    <div className="flex flex-col h-full">
      {/* Old Messages */}
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            onCopy={onCopyMessage}
            ref={index === messages.length - 1 ? lastMessageRef : null} // set the ref to the last message
            className={`px-3 py-1 rounded-xl ${message.role === 'user' ? 'bg-rose-400 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
        {/* show bot typing animation */}
        {isBotTyping && (
          <div className="flex gap-1 px-3 py-3 rounded-xl bg-gray-100 text-black self-start">
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
          </div>
        )}
        {/* Error */}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* Chatbox */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 items-end border-2 rounded-3xl p-4"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (data) => data.trim().length > 0,
          })}
          autoFocus // set cursor in the chatbox when page first load
          className="w-full border-0 focus:outline-0 resize-none"
          placeholder="Ask anything"
          maxLength={1000}
        />
        <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
