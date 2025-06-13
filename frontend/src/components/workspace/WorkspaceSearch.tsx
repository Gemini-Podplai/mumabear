import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { workspaceService } from '../../services/workspaceService';

interface SearchResultsProps {
    query: string;
    results: string[];
    onResultClick: (path: string) => void;
    onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query, results, onResultClick, onClose }) => (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg mt-1 max-h-96 overflow-auto z-50">
        <div className="flex justify-between items-center p-2 border-b dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
                {results.length} results for "{query}"
            </span>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <XCircleIcon className="w-5 h-5" />
            </button>
        </div>
        <div className="divide-y dark:divide-gray-700">
            {results.map((path) => (
                <button
                    key={path}
                    onClick={() => onResultClick(path)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                    {path}
                </button>
            ))}
        </div>
    </div>
);

export const WorkspaceSearch: React.FC<{ onFileSelect: (path: string) => void }> = ({ onFileSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        try {
            const searchResults = await workspaceService.searchFiles(query);
            setResults(searchResults);
            setShowResults(true);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleResultClick = (path: string) => {
        onFileSelect(path);
        setShowResults(false);
        setQuery('');
    };

    return (
        <div className="relative">
            <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search files..."
                        className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button
                    type="submit"
                    disabled={isSearching}
                    className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700
                   focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                >
                    {isSearching ? 'Searching...' : 'Search'}
                </button>
            </form>

            {showResults && (
                <SearchResults
                    query={query}
                    results={results}
                    onResultClick={handleResultClick}
                    onClose={() => setShowResults(false)}
                />
            )}
        </div>
    );
};
