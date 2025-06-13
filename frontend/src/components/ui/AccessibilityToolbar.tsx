import React, { useState } from 'react';

const fontSizes = [14, 16, 18, 20, 24];

export const AccessibilityToolbar: React.FC = () => {
    const [fontSize, setFontSize] = useState(16);
    const [highContrast, setHighContrast] = useState(false);

    React.useEffect(() => {
        document.documentElement.style.fontSize = fontSize + 'px';
        if (highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }, [fontSize, highContrast]);

    return (
        <div className="fixed left-4 bottom-4 z-[90] bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg p-2 flex items-center space-x-2">
            <label className="text-xs text-gray-700 dark:text-gray-300">Font Size</label>
            <select
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="rounded px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800"
            >
                {fontSizes.map(size => (
                    <option key={size} value={size}>{size}px</option>
                ))}
            </select>
            <button
                onClick={() => setHighContrast(h => !h)}
                className={`px-2 py-1 rounded text-xs ${highContrast ? 'bg-yellow-400 text-black' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
            >
                {highContrast ? 'High Contrast: On' : 'High Contrast: Off'}
            </button>
        </div>
    );
};

export default AccessibilityToolbar;
