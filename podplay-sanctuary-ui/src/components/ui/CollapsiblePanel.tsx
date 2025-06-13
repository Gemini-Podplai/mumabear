import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface CollapsiblePanelProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const CollapsiblePanel = ({ title, icon, defaultOpen = true, children }: CollapsiblePanelProps) => {
  const [isOpen, toggle] = React.useReducer(prev => !prev, defaultOpen);

  return (
    <div className="rounded-lg bg-neutral-900 shadow-md border border-gray-800">
      <button onClick={toggle} className="flex flex-row w-full justify-between items-center p-4">
        {icon && <span className="mr-2">{icon}</span>}
        <h3 className="font-semibold text-white">{title}</h3>
        {isOpen ? <ChevronUpIcon className="w-6 h-6 text-accent" /> : <ChevronDownIcon className="w-6 h-6 text-accent" />}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ ease: "easeInOut", duration: 0.4 }}
          className="px-4 pb-4"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};