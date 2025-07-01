'use client';

import { useEffect, useRef, useCallback, useTransition } from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  ImageIcon,
  Figma,
  MonitorIcon,
  Paperclip,
  SendIcon,
  XIcon,
  LoaderIcon,
  Sparkles,
  Command,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { svg } from 'framer-motion/client';

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY),
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight],
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

interface CommandSuggestion {
  label: string;
  description: string;
  prefix: string;
  icon?: React.ReactNode;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className={cn('relative', containerClassName)}>
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'transition-all duration-200 ease-in-out',
            'placeholder:text-muted-foreground',
            'disabled:cursor-not-allowed disabled:opacity-50',
            showRing
              ? 'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
              : '',
            className,
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {showRing && isFocused && (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-primary/30 ring-offset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {props.onChange && (
          <div
            className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-primary opacity-0"
            style={{
              animation: 'none',
            }}
            id="textarea-ripple"
          />
        )}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

export default function AnimatedAIChat() {
  const [value, setValue] = useState('');
  const [selectedAgentCommand, setSelectedAgentCommand] = useState<string | null>(null);
  const [inputPrompt, setInputPrompt] = useState<string>('');

  const [attachments, setAttachments] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [recentCommand, setRecentCommand] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  const [inputFocused, setInputFocused] = useState(false);
  const commandPaletteRef = useRef<HTMLDivElement>(null);
  // Speech recognition state
  const [isListening, setIsListening] = useState(false);

  // Define a type for the SpeechRecognition instance
  type SpeechRecognitionInstance = typeof window extends { webkitSpeechRecognition: new () => infer T }
    ? T
    : any;
    
    const [micWave, setMicWave] = useState(false);

    useEffect(() => {
      if (isListening) {
        setMicWave(true);
      } else {
        setMicWave(false);
      }
    }, [isListening]);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Setup SpeechRecognition API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setValue(transcript);
          adjustHeight();
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };
      }
    }
    // Cleanup
    return () => {
      recognitionRef.current?.abort();
    };
  }, [adjustHeight]);

  const handleMicClick = () => {

    if (recognitionRef.current) {
      if (!isListening) {
      setIsListening(true);
      recognitionRef.current.start();
      } else {
      recognitionRef.current.stop();
      setIsListening(false);
      }
    }
  };
  const commandSuggestions: CommandSuggestion[] = [
    {
      label: 'General',
      description: 'General health questions and assistant',
      prefix: '/general',
      icon: (
        <span className="flex items-center">
          <Sparkles className="h-4 w-4 mr-1 text-cyan-300 animate-pulse" />
        </span>
      ),
    },

    {
      
      label: 'Drug Classifier',
      description: 'Based on a given drug name, classify whethere it is an antibiotic, antihistamine, or other',
      prefix: '/classify',
    },
    {
      
      label: 'Drug Recommender',
      description: 'Recommend a drug based on symptoms',
      prefix: '/recommend',
    },
    {
    
      label: 'Side Effects Checker',
      description: 'Check side effects of a given drug',
      prefix: '/side-effects',
    },
    {
      
      label: 'Allergy Safe Recommender',
      description: 'Recommend a drug based on symptoms and allergies',
      prefix: '/allergy',
    },
    {
      label: 'Queries History',
      description: 'View or update your medicine query history',
      prefix: '/history',
    },
    {
      label: 'Health Tips',
      description: 'Get health tips based on your profile',
      prefix: '/health-tips',
    },
  ];

  useEffect(() => {
    if (value.startsWith('/') && !value.includes(' ')) {
      setShowCommandPalette(true);

      const matchingSuggestionIndex = commandSuggestions.findIndex((cmd) =>
        cmd.prefix.startsWith(value),
      );

      if (matchingSuggestionIndex >= 0) {
        setActiveSuggestion(matchingSuggestionIndex);
      } else {
        setActiveSuggestion(-1);
      }
    } else {
      setShowCommandPalette(false);
    }
  }, [value]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const commandButton = document.querySelector('[data-command-button]');

      if (
        commandPaletteRef.current &&
        !commandPaletteRef.current.contains(target) &&
        !commandButton?.contains(target)
      ) {
        setShowCommandPalette(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showCommandPalette) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev < commandSuggestions.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev > 0 ? prev - 1 : commandSuggestions.length - 1,
        );
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        if (activeSuggestion >= 0) {
          const selectedCommand = commandSuggestions[activeSuggestion];
          setValue(selectedCommand.prefix + ' ');
          setShowCommandPalette(false);

          setRecentCommand(selectedCommand.label);
          setTimeout(() => setRecentCommand(null), 3500);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowCommandPalette(false);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        handleSendMessage();
      }
    }
  };


const handleSendMessage = async () => {
  if (!value.trim()) return;

  // Extract agent and prompt
  let agent = 'general_agent';
  let prompt = value.trim();

  const match = value.trim().match(/^\/(\w+)\s+(.*)$/);
  if (match) {
    const prefix = match[1];
    prompt = match[2] || '';
    switch (prefix) {
      case 'general':
        agent = 'general_agent';
        break;
      case 'classify':
        agent = 'classify_agent';
        break;
      case 'recommend':
        agent = 'recommend_agent';
        break;
      case 'side-effects':
        agent = 'side_effects_agent';
        break;
      case 'allergy':
        agent = 'allergy_agent';
        break;
            case 'history':
        agent = 'history_agent';
        break;
      case 'health-tips':
        agent = 'health_tips_agent';
        break;
      default:
        agent = 'general_agent';
    }
  }

  // Show typing indicator
  setIsTyping(true);

  try {
    // If no specific command is used, treat as general query
    if (!match) {
      agent = 'general_agent';
      prompt = value.trim();
    }

    // Redirect to dashboard with agent and prompt
    window.location.href = `/dashboard?agent=${encodeURIComponent(agent)}&prompt=${encodeURIComponent(prompt)}`;
  } catch (error) {
    console.error('Error sending message:', error);
    setIsTyping(false);
  }
};

  const handleAttachFile = () => {
    const mockFileName = `file-${Math.floor(Math.random() * 1000)}.pdf`;
    setAttachments((prev) => [...prev, mockFileName]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

 const selectCommandSuggestion = (index: number) => {
  const selectedCommand = commandSuggestions[index];
  setValue(selectedCommand.prefix + ' ');
  setShowCommandPalette(false);
  
  // Focus back to textarea after command selection
  setTimeout(() => {
    textareaRef.current?.focus();
  }, 100);

  setRecentCommand(selectedCommand.label);
  setTimeout(() => setRecentCommand(null), 2000);
};

const handleCommandButtonClick = (suggestion: CommandSuggestion) => {
  setValue(suggestion.prefix + ' ');
  setShowCommandPalette(false);
  
  // Focus back to textarea
  setTimeout(() => {
    textareaRef.current?.focus();
    // Move cursor to end
    if (textareaRef.current) {
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, 100);

  setRecentCommand(suggestion.label);
  setTimeout(() => setRecentCommand(null), 2000);
};


  return (
    <div className="flex w-screen overflow-x-hidden">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-transparent p-6 text-foreground">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          {/* Cyan animated blobs */}
          <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-cyan-400/20 mix-blend-normal blur-[128px] filter" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-300/20 mix-blend-normal blur-[128px] filter delay-700" />
          <div className="absolute right-1/3 top-1/4 h-64 w-64 animate-pulse rounded-full bg-cyan-500/20 mix-blend-normal blur-[96px] filter delay-1000" />
        </div>
        <div className="relative mx-auto w-full max-w-2xl">
            <motion.div
            className="relative z-10 space-y-12 mt-[-60px] md:mt-[-100px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            >
            <h1
              className="text-5xl font-bold mb-6 mt-4 bg-gradient-to-r from-cyan-300 via-cyan-200 via-70% to-purple-400 bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(128,0,255,0.08)]"
              style={{
              backgroundImage:
                'linear-gradient(90deg, #22d3ee 0%, #a5b4fc 70%, #c084fc 92%, rgb(181, 49, 161) 100%)',
              }}
            >
              Tired of Googling Symptoms? 
              We Got You!
            </h1>
            <p className="text-xl italic text-cyan-200 mb-12 max-w-2xl mx-auto">
              From weird rashes to confusing meds - Ask anything, anytime.
            </p>

            <motion.div
              className="relative rounded-2xl border border-border bg-card/80 shadow-2xl backdrop-blur-2xl"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <AnimatePresence>
              {showCommandPalette && (
                <motion.div
                ref={commandPaletteRef}
                className="absolute bottom-full left-4 right-4 z-50 mb-2 overflow-hidden rounded-lg border border-border bg-background/90 shadow-lg backdrop-blur-xl"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                >
                <div className="bg-background py-1">
                  {commandSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.prefix}
                    className={cn(
                    'flex cursor-pointer items-center gap-2 px-3 py-2 text-xs transition-colors',
                    activeSuggestion === index
                      ? 'bg-cyan-400/20 text-foreground'
                      : 'text-muted-foreground hover:bg-cyan-400/10',
                    )}
                    onClick={() => selectCommandSuggestion(index)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div className="flex h-5 w-5 items-center justify-center text-cyan-500">
                    {suggestion.icon}
                    </div>
                    <div className="font-medium">{suggestion.label}</div>
                    <div className="ml-1 text-xs text-muted-foreground">
                    {suggestion.prefix}
                    </div>
                  </motion.div>
                  ))}
                </div>
                </motion.div>
              )}
              </AnimatePresence>

              <div className="p-4 relative">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="I have fever and headache, what do I take?"
                containerClassName="w-full"
                className={cn(
                'w-full px-4 py-3',
                'resize-none',
                'bg-transparent',
                'border-none',
                'text-sm text-foreground',
                'focus:outline-none',
                'placeholder:text-muted-foreground',
                'min-h-[60px]',
                )}
                style={{
                overflow: 'hidden',
                }}
                showRing={false}
              />
              </div>

              <AnimatePresence>
              {attachments.length > 0 && (
                <motion.div
                className="flex flex-wrap gap-2 px-4 pb-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                >
                {attachments.map((file, index) => (
                  <motion.div
                  key={index}
                  className="flex items-center gap-2 rounded-lg bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  >
                  <span>{file}</span>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="text-cyan-300 transition-colors hover:text-cyan-100"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                  </motion.div>
                ))}
                </motion.div>
              )}
              </AnimatePresence>

              <div className="relative">
                <div className="flex items-center justify-between gap-4 border-t border-border p-4">
                <div className="flex items-center gap-3">
                <motion.button
                type="button"
                onClick={handleAttachFile}
                whileTap={{ scale: 0.94 }}
                className="group relative rounded-lg p-2 text-cyan-300 transition-colors hover:text-cyan-100"
                >
                <Paperclip className="h-4 w-4" />
                <motion.span
                  className="absolute inset-0 rounded-lg bg-cyan-400/10 opacity-0 transition-opacity group-hover:opacity-100"
                  layoutId="button-highlight"
                />
                </motion.button>
                <motion.button
                type="button"
                data-command-button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCommandPalette((prev) => !prev);
                }}
                whileTap={{ scale: 0.94 }}
                className={cn(
                  'group relative rounded-lg p-2 text-cyan-300 transition-colors hover:text-cyan-100',
                  showCommandPalette && 'bg-cyan-400/20 text-foreground',
                )}
                >
                <Command className="h-4 w-4" />
                <motion.span
                  className="absolute inset-0 rounded-lg bg-cyan-400/10 opacity-0 transition-opacity group-hover:opacity-100"
                  layoutId="button-highlight"
                />
                </motion.button>
                </div>
                {isListening && (
                  <span className="ml-2 flex items-center gap-1 text-cyan-300 animate-pulse">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="8" fill="#22d3ee" opacity="0.3">
                        <animate attributeName="r" values="8;12;8" dur="6s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="6s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="12" cy="12" r="4" fill="#22d3ee" />
                    </svg>
                    Listening...
                  </span>
                )}
                <div className="relative flex items-center gap-2">
                <motion.button
                  type="button"
                  onClick={handleMicClick}
                  whileTap={{ scale: 0.94 }}
                  className="group relative rounded-lg p-2 text-gray-400 transition-colors hover:text-cyan-100"
                  aria-label="Voice input"
                >
                  {/* Lucide Input icon for mic */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm6 10v1a6 6 0 0 1-12 0v-1m6 8v4m-4 0h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="9" y="2" width="6" height="12" rx="3" /></svg>
                </motion.button>
        
                <motion.button
                type="button"
                onClick={handleSendMessage}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={isTyping || !value.trim()}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  'flex items-center gap-2',
                  value.trim()
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-400/10'
                  : 'bg-muted/50 text-muted-foreground',
                )}
                >
                {isTyping ? (
                  <LoaderIcon className="h-4 w-4 animate-[spin_2s_linear_infinite]" />
                ) : (
                  <SendIcon className="h-4 w-4 text-cyan-400" />
                )}
                <span>Send</span>
                </motion.button>
                </div>
                </div>
          
                
              </div>
            </motion.div>

<div className="flex flex-wrap items-center justify-center gap-2">
  {commandSuggestions.map((suggestion, index) => (
    <motion.button
      key={suggestion.prefix}
      onClick={() => handleCommandButtonClick(suggestion)}
      className="group relative flex items-center gap-2 rounded-lg bg-cyan-400/10 px-3 py-2 text-sm text-cyan-300 transition-all hover:bg-cyan-400/20 hover:text-cyan-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {suggestion.icon}
      <span>{suggestion.label}</span>
      <motion.div
        className="absolute inset-0 rounded-lg border border-cyan-400/50"
        initial={false}
        animate={{
          opacity: [0, 1],
          scale: [0.98, 1],
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
      />
    </motion.button>
  ))}
</div>
            </motion.div>
        </div>

        <AnimatePresence>
          {isTyping && (
            <motion.div
              className="fixed left-1/2 bottom-4 mx-auto -translate-x-1/2 transform rounded-full border border-cyan-400 bg-background/80 px-4 py-2 shadow-lg backdrop-blur-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{ zIndex: 50 }} 
            >
              <div className="flex items-center gap-3">
              <div className="flex h-7 w-8 items-center justify-center rounded-full bg-cyan-400/10 text-center">
                <Sparkles className="h-4 w-4 text-cyan-400" />
              </div>
              <div className="flex items-center gap-2 text-sm text-cyan-200">
                <span>Sending</span>
                <TypingDots />
              </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {inputFocused && (
          <motion.div
            className="pointer-events-none fixed z-0 h-[50rem] w-[50rem] rounded-full bg-gradient-to-r from-cyan-400 via-cyan-300/80 to-cyan-200 opacity-[0.04] blur-[96px]"
            animate={{
              x: mousePosition.x - 400,
              y: mousePosition.y - 400,
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 150,
              mass: 0.5,
            }}
          />
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="ml-1 flex items-center">
      {[1, 2, 3].map((dot) => (
        <motion.div
          key={dot}
          className="mx-0.5 h-1.5 w-1.5 rounded-full bg-primary"
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.9, 0.3],
            scale: [0.85, 1.1, 0.85],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: dot * 0.15,
            ease: 'easeInOut',
          }}
          style={{
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.3)',
          }}
        />
      ))}
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
}

const rippleKeyframes = `
@keyframes ripple {
  0% { transform: scale(0.5); opacity: 0.6; }
  100% { transform: scale(2); opacity: 0; }
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = rippleKeyframes;
  document.head.appendChild(style);
}
