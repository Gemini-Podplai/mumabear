import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import React from 'react';

export const ThemeToggle: React.FC = () => {
    const [dark, setDark] = React.useState(() =>
        document.documentElement.classList.contains('dark')
    );

    React.useEffect(() => {
        const handler = () => setDark(document.documentElement.classList.contains('dark'));
        window.addEventListener('toggle-theme', handler);
        return () => window.removeEventListener('toggle-theme', handler);
    }, []);

    const toggle = () => {
        document.documentElement.classList.toggle('dark');
        setDark(d => !d);
    };

    return (
        <button
            onClick={toggle}
            className="ml-2 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
            aria-label="Toggle theme"
            title="Toggle light/dark mode"
        >
            {dark ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-gray-800" />}
        </button>
    );
};

export default ThemeToggle;
