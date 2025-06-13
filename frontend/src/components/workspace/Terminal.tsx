import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface TerminalProps {
    onCommand: (command: string) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onCommand }) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);

    useEffect(() => {
        if (terminalRef.current && !xtermRef.current) {
            const term = new XTerm({
                theme: {
                    background: '#1E1E1E',
                    foreground: '#D4D4D4',
                },
                fontSize: 14,
                fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                cursorBlink: true,
            });

            const fitAddon = new FitAddon();
            term.loadAddon(fitAddon);

            term.open(terminalRef.current);
            fitAddon.fit();

            xtermRef.current = term;
            fitAddonRef.current = fitAddon;

            term.writeln('Podplay Development Terminal');
            term.writeln('Type your commands below:');
            term.write('\r\n$ ');

            let currentLine = '';

            term.onKey(({ key, domEvent }) => {
                const ev = domEvent;
                const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

                if (ev.keyCode === 13) { // Enter
                    term.write('\r\n');
                    if (currentLine.trim()) {
                        onCommand(currentLine);
                    }
                    term.write('$ ');
                    currentLine = '';
                } else if (ev.keyCode === 8) { // Backspace
                    if (currentLine.length > 0) {
                        currentLine = currentLine.slice(0, -1);
                        term.write('\b \b');
                    }
                } else if (printable) {
                    currentLine += key;
                    term.write(key);
                }
            });
        }

        return () => {
            if (xtermRef.current) {
                xtermRef.current.dispose();
            }
        };
    }, [onCommand]);

    return (
        <div
            ref={terminalRef}
            className="w-full h-full bg-[#1E1E1E] rounded-md overflow-hidden"
        />
    );
};
