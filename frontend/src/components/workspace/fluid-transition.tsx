import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface FluidTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  duration?: number;
  className?: string;
}

// Fluid transition component for smooth state changes
export const FluidTransition: React.FC<FluidTransitionProps> = ({
  children,
  isVisible,
  duration = 0.5,
  className = ''
}) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced floating component with presence features
interface FloatingComponentProps {
  children: React.ReactNode;
  position?: { x: number; y: number };
  isDraggable?: boolean;
  onDrag?: (x: number, y: number) => void;
  className?: string;
}

export const FloatingComponent: React.FC<FloatingComponentProps> = ({
  children,
  position,
  isDraggable = true,
  onDrag,
  className = ''
}) => {
  const handleDrag = (event: any, info: any) => {
    if (onDrag) {
      onDrag(info.point.x, info.point.y);
    }
  };

  return (
    <motion.div
      drag={isDraggable}
      dragMomentum={false}
      onDrag={handleDrag}
      initial={position}
      animate={position}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={`absolute ${className}`}
      style={{
        touchAction: "none",
        ...(!position ? { position: 'relative' } : {})
      }}
    >
      {children}
    </motion.div>
  );
};

// Workspace transition component for 3D transformations
interface WorkspaceTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
  transitionType?: '3d-flip' | '3d-rotate' | 'morph';
  className?: string;
}

export const WorkspaceTransition: React.FC<WorkspaceTransitionProps> = ({
  children,
  isActive,
  transitionType = '3d-flip',
  className = ''
}) => {
  const transitions = {
    '3d-flip': {
      initial: { rotateY: -90, opacity: 0 },
      animate: { rotateY: 0, opacity: 1 },
      exit: { rotateY: 90, opacity: 0 }
    },
    '3d-rotate': {
      initial: { rotate: -15, scale: 0.8, opacity: 0 },
      animate: { rotate: 0, scale: 1, opacity: 1 },
      exit: { rotate: 15, scale: 0.8, opacity: 0 }
    },
    morph: {
      initial: { borderRadius: 40, scale: 0.8, opacity: 0 },
      animate: { borderRadius: 0, scale: 1, opacity: 1 },
      exit: { borderRadius: 40, scale: 0.8, opacity: 0 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={transitions[transitionType].initial}
          animate={transitions[transitionType].animate}
          exit={transitions[transitionType].exit}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 25,
            duration: 0.5
          }}
          className={`preserve-3d ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
