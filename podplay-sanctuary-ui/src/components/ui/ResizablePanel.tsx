import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export const ResizablePanel = () => {
  return (
    <PanelGroup autoSaveId="myPanels" direction="horizontal">
      <Panel minSize={20} defaultSize={25}>
        {/* Left Sidebar */}
      </Panel>
      <PanelResizeHandle className="w-1 cursor-col-resize bg-black/20 transition-colors hover:bg-accent" />
      <Panel minSize={30}>
        {/* Main Content Area */}
      </Panel>
      <PanelResizeHandle className="w-1 cursor-col-resize bg-black/20 transition-colors hover:bg-accent" />
      <Panel minSize={20}>
        {/* Right Sidebar */}
      </Panel>
    </PanelGroup>
  );
};