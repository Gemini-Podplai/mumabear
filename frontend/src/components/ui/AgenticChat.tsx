import { GlobeAltIcon, PaperAirplaneIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:5000');

interface ChatMessage {
    id: string;
    content: string;
    sender: 'user' | 'agent';
    timestamp: number;
    type?: 'text' | 'image' | 'file' | 'audio' | 'video';
    fileUrl?: string;
}

interface AgenticChatProps {
    agentId: string;
    agentName: string;
    features?: {
        file?: boolean;
        image?: boolean;
        audio?: boolean;
        video?: boolean;
        rag?: boolean;
        browser?: boolean;
    };
}

export const AgenticChat: React.FC<AgenticChatProps> = ({ agentId, agentName, features = { file: true, image: true, audio: true, video: true, rag: true, browser: true } }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [audio, setAudio] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const dropRef = useRef<HTMLDivElement>(null);
    const [uploading, setUploading] = useState(false);
    const [showBrowser, setShowBrowser] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.on(`${agentId}_response`, (msg: { content: string, type?: string, fileUrl?: string }) => {
            setMessages((prev) => [
                ...prev,
                { id: Date.now().toString(), content: msg.content, sender: 'agent', timestamp: Date.now(), type: msg.type as any, fileUrl: msg.fileUrl },
            ]);
            setIsTyping(false);
        });
        socket.on(`${agentId}_typing`, () => setIsTyping(true));
        return () => {
            socket.off(`${agentId}_response`);
            socket.off(`${agentId}_typing`);
        };
    }, [agentId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Drag-and-drop support
    useEffect(() => {
        const dropArea = dropRef.current;
        if (!dropArea) return;
        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            dropArea.classList.add('ring-2', 'ring-purple-400');
        };
        const handleDragLeave = (e: DragEvent) => {
            e.preventDefault();
            dropArea.classList.remove('ring-2', 'ring-purple-400');
        };
        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            dropArea.classList.remove('ring-2', 'ring-purple-400');
            if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith('image/')) setImage(file);
                else if (file.type.startsWith('audio/')) setAudio(file);
                else if (file.type.startsWith('video/')) setVideo(file);
                else setFile(file);
            }
        };
        dropArea.addEventListener('dragover', handleDragOver);
        dropArea.addEventListener('dragleave', handleDragLeave);
        dropArea.addEventListener('drop', handleDrop);
        return () => {
            dropArea.removeEventListener('dragover', handleDragOver);
            dropArea.removeEventListener('dragleave', handleDragLeave);
            dropArea.removeEventListener('drop', handleDrop);
        };
    }, []);

    // Copy-paste image support
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData) {
                const items = e.clipboardData.items;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.type.startsWith('image/')) {
                        const file = item.getAsFile();
                        if (file) setImage(file);
                    }
                }
            }
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, []);

    // RAG/web search
    const handleRAGSearch = async () => {
        const query = prompt('Enter your research/web search query:');
        if (query && query.trim()) {
            setIsTyping(true);
            socket.emit(`${agentId}_message`, { content: '', rag_query: query.trim() });
        }
    };

    // Multimodal send
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() && !file && !image && !audio && !video) return;
        const msg: ChatMessage = {
            id: Date.now().toString(),
            content: input,
            sender: 'user',
            timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, msg]);
        setInput('');
        setIsTyping(true);
        const sendWithBase64 = (type: 'file' | 'image' | 'audio' | 'video', fileObj: File) => {
            setUploading(true);
            const reader = new FileReader();
            reader.onload = () => {
                socket.emit(`${agentId}_message`, {
                    content: input,
                    [type]: {
                        name: fileObj.name,
                        fileType: fileObj.type,
                        data: reader.result,
                    },
                });
                setUploading(false);
                if (type === 'file') setFile(null);
                if (type === 'image') setImage(null);
                if (type === 'audio') setAudio(null);
                if (type === 'video') setVideo(null);
            };
            reader.readAsDataURL(fileObj);
        };
        if (file) return sendWithBase64('file', file);
        if (image) return sendWithBase64('image', image);
        if (audio) return sendWithBase64('audio', audio);
        if (video) return sendWithBase64('video', video);
        socket.emit(`${agentId}_message`, { content: msg.content });
    };

    // Emoji for each chat message
    const getMessageEmoji = (sender: 'user' | 'agent') => sender === 'user' ? '🧑‍💻' : '🤖';

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
                <span className="font-semibold text-lg text-gray-900 dark:text-white">{agentName} Chat</span>
                {features.browser && (
                    <button onClick={() => setShowBrowser((v) => !v)} className="text-gray-400 hover:text-purple-600" title="Open RAG/Web Browser">
                        <GlobeAltIcon className="w-6 h-6" />
                    </button>
                )}
            </div>
            <div ref={dropRef} className="flex-1 overflow-y-auto p-4 space-y-2" style={{ minHeight: 240, maxHeight: 400 }}>
                {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-lg px-4 py-2 max-w-[80%] flex items-center gap-2 ${m.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                            <span className="text-xl select-none">{getMessageEmoji(m.sender)}</span>
                            <span>
                                {m.type === 'image' && m.fileUrl ? <img src={m.fileUrl} alt="uploaded" className="max-w-xs rounded mb-1" /> : null}
                                {m.type === 'file' && m.fileUrl ? <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="underline">Download file</a> : null}
                                {m.type === 'audio' && m.fileUrl ? <audio controls src={m.fileUrl} className="mb-1" /> : null}
                                {m.type === 'video' && m.fileUrl ? <video controls src={m.fileUrl} className="max-w-xs mb-1" /> : null}
                                {(m.type === 'text' || !m.type) ? m.content : null}
                            </span>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                        <span className="text-xs text-gray-500">{agentName} is typing…</span>
                    </div>
                )}
                {uploading && (
                    <div className="flex items-center space-x-2 mt-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        <span className="text-xs text-blue-500">Uploading…</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="flex items-center p-3 border-t dark:border-gray-700 space-x-2">
                {/* File upload button */}
                {features.file && (
                    <button type="button" className="p-2 text-gray-400 hover:text-purple-600" title="Attach File" onClick={() => fileInputRef.current?.click()} aria-label="Attach file">
                        <PaperClipIcon className="w-5 h-5" />
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] || null)} />
                    </button>
                )}
                {/* Image upload button */}
                {features.image && (
                    <button type="button" className="p-2 text-gray-400 hover:text-pink-600" title="Attach Image" onClick={() => imageInputRef.current?.click()} aria-label="Attach image">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" /></svg>
                        <input type="file" accept="image/*" ref={imageInputRef} style={{ display: 'none' }} onChange={e => setImage(e.target.files?.[0] || null)} />
                    </button>
                )}
                {/* Audio upload button */}
                {features.audio && (
                    <button type="button" className="p-2 text-gray-400 hover:text-green-600" title="Attach Audio" onClick={() => audioInputRef.current?.click()} aria-label="Attach audio">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="6" height="6" rx="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 15V9a3 3 0 016 0v6a3 3 0 01-6 0z" /></svg>
                        <input type="file" accept="audio/*" ref={audioInputRef} style={{ display: 'none' }} onChange={e => setAudio(e.target.files?.[0] || null)} />
                    </button>
                )}
                {/* Video upload button */}
                {features.video && (
                    <button type="button" className="p-2 text-gray-400 hover:text-blue-600" title="Attach Video" onClick={() => videoInputRef.current?.click()} aria-label="Attach video">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M10 9l5 3-5 3V9z" /></svg>
                        <input type="file" accept="video/*" ref={videoInputRef} style={{ display: 'none' }} onChange={e => setVideo(e.target.files?.[0] || null)} />
                    </button>
                )}
                {/* RAG/Web search button */}
                {features.rag && (
                    <button type="button" className="p-2 text-gray-400 hover:text-purple-600" title="Web Search / Research" onClick={handleRAGSearch} aria-label="Web search">
                        <GlobeAltIcon className="w-5 h-5" />
                    </button>
                )}
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your message…"
                    className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-label="Send message"
                >
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </form>
            <AnimatePresence>
                {showBrowser && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        className="fixed inset-0 bg-black bg-opacity-40 z-[300] flex items-center justify-center"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 max-w-2xl w-full relative">
                            <button onClick={() => setShowBrowser(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                            {/* TODO: Embed RAG/Web search UI here */}
                            <div className="text-gray-900 dark:text-white">RAG/Web Search coming soon…</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgenticChat;
