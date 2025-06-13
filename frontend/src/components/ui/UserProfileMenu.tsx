import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

const defaultProfile = {
    name: 'Podplay User',
    avatar: '',
    email: 'user@podplay.app',
};

export const UserProfileMenu: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [profile] = useState(defaultProfile);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="Open user menu"
            >
                {profile.avatar ? (
                    <img src={profile.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                ) : (
                    <UserCircleIcon className="w-8 h-8 text-purple-600" />
                )}
                <span className="hidden md:inline text-sm font-medium text-gray-900 dark:text-white">{profile.name}</span>
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b dark:border-gray-700">
                        <div className="font-semibold text-gray-900 dark:text-white">{profile.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{profile.email}</div>
                    </div>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" /> Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfileMenu;
