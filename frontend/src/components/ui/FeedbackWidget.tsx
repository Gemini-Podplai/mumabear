import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

export const FeedbackWidget: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Send feedback to backend or service
        setSent(true);
        setTimeout(() => {
            setOpen(false);
            setSent(false);
            setMessage('');
        }, 2000);
    };

    return (
        <div className="fixed bottom-20 right-6 z-[90]">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full shadow-xl hover:bg-blue-700 focus:outline-none"
                aria-label="Open feedback widget"
            >
                <ChatBubbleLeftRightIcon className="w-7 h-7 text-white" />
            </button>
            {open && (
                <div className="mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">Feedback</span>
                        <button onClick={() => setOpen(false)} aria-label="Close feedback" className="text-gray-400 hover:text-gray-700">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                    {sent ? (
                        <div className="text-green-600 dark:text-green-400">Thank you for your feedback!</div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Your feedback..."
                                className="w-full h-24 p-2 rounded border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                                required
                            />
                            <button
                                type="submit"
                                className="mt-2 w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 focus:outline-none"
                            >
                                Send
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default FeedbackWidget;
