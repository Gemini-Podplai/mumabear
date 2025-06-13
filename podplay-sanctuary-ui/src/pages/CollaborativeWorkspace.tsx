import React, { useState } from 'react';
import CompetitionCrusher from '../components/collaboration/CompetitionCrusher';

const CollaborativeWorkspacePage: React.FC = () => {
  const [workspaceId] = useState('workspace-' + Date.now());
  const [userId] = useState('user-' + Math.random().toString(36).substr(2, 9));

  return (
    <CompetitionCrusher
      workspaceId={workspaceId}
      userId={userId}
    />
  );
};

export default CollaborativeWorkspacePage;