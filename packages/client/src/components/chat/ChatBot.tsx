import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import TypingIndicator from './TypingIndicator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

const ChatBot = () => {
  const conversationId = useRef(crypto.randomUUID());
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

  return (
    <div className="flex flex-col h-full">
      {/* Old Messages */}
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isBotTyping && <TypingIndicator />}
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
