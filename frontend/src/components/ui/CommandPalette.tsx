import { CommandLineIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';

const commands = [
    { label: 'Go to Workspace', action: () => window.location.pathname = '/workspace' },
    { label: 'Go to Agent Hub', action: () => window.location.pathname = '/' },
    { label: 'Show Git Panel', action: () => window.dispatchEvent(new CustomEvent('show-git-panel')) },
    { label: 'Hide Git Panel', action: () => window.dispatchEvent(new CustomEvent('hide-git-panel')) },
    { label: 'Toggle Theme', action: () => window.dispatchEvent(new CustomEvent('toggle-theme')) },
    { label: 'Show Notification Example', action: () => window.notify('info', 'This is a command palette notification!') },
];

export const CommandPalette: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [filtered, setFiltered] = useState(commands);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
                setOpen(true);
                setTimeout(() => inputRef.current?.focus(), 50);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        setFiltered(
            commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
        );
    }, [query]);

    const handleSelect = (cmd: typeof commands[0]) => {
        setOpen(false);
        setQuery('');
        cmd.action();
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg p-4">
                <div className="flex items-center mb-2">
                    <CommandLineIcon className="w-6 h-6 text-purple-600 mr-2" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Type a command..."
                        className="flex-1 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                    />
                    <button onClick={() => setOpen(false)} className="ml-2 text-gray-400 hover:text-gray-700">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                <ul>
                    {filtered.map((cmd, i) => (
                        <li
                            key={cmd.label}
                            className="px-3 py-2 rounded hover:bg-purple-100 dark:hover:bg-purple-900 cursor-pointer text-gray-900 dark:text-white"
                            onClick={() => handleSelect(cmd)}
                        >
                            {cmd.label}
                        </li>
                    ))}
                    {filtered.length === 0 && (
                        <li className="px-3 py-2 text-gray-400">No commands found</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default CommandPalette;
