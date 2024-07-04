import React from 'react';
import { DualTree } from './components/DualTree';
import { TreeItem, OnMoveData } from './types';
import './App.css';
import 'react-sortable-tree/style.css';
import { useHistoryStack } from './hooks/useHistoryStack';

type LeftTreeItemData = { leftValue: any };
type RightTreeItemData = { rightValue: any };

function App() {
  const [leftTreeData, setLeftTreeData] = React.useState<TreeItem<LeftTreeItemData>[]>([
    { title: 'node1', leftValue: 1 },
    { title: 'node2', leftValue: 2, expanded: true, children: [
      { title: 'node3', leftValue: 3 }
    ] },
  ]);
  const [rightTreeData, setRightTreeData] = React.useState<TreeItem<RightTreeItemData>[]>([
    { title: 'node4', rightValue: 4 },
    { title: 'node5', rightValue: 5, expanded: true, children: [
      { title: 'node6', rightValue: 6 }
    ] },
  ]);
  const { undo, redo, push: undoPush, canUndo, canRedo } = useHistoryStack<LeftTreeItemData, RightTreeItemData>();

  const takeSnapshot = React.useCallback(() => 
    ({ left: leftTreeData, right: rightTreeData })
  , [leftTreeData, rightTreeData]);

  const onLeftMoveNode = React.useCallback(({ treeData }: OnMoveData<TreeItem<LeftTreeItemData>>) => {
    undoPush(takeSnapshot());
    setLeftTreeData(treeData);
  }, [undoPush, takeSnapshot]);

  const onRightMoveNode = React.useCallback(({ treeData }: OnMoveData<TreeItem<RightTreeItemData>>) => {
    undoPush(takeSnapshot());
    setRightTreeData(treeData);
  }, [undoPush, takeSnapshot]);

  // Because we have a single handler for inter-tree moves, we won't push two
  // snapshots onto the undo stack (one for each handler above)
  const onBothMoveNode = React.useCallback((
    { treeData: newLeftTreeData }: OnMoveData<TreeItem<LeftTreeItemData>>, 
    { treeData: newRightTreeData }: OnMoveData<TreeItem<RightTreeItemData>>
  ) => {
    undoPush(takeSnapshot());
    setLeftTreeData(newLeftTreeData);
    setRightTreeData(newRightTreeData);
  }, [undoPush, takeSnapshot]);

  const onUndo = React.useCallback(() => {
    const snapshot = undo(takeSnapshot());
    if (!snapshot) {
      return;
    }
    setLeftTreeData(snapshot!.left);
    setRightTreeData(snapshot!.right);
  }, [undo, takeSnapshot]);

  const onRedo = React.useCallback(() => {
    const snapshot = redo(takeSnapshot());
    if (!snapshot) {
      return;
    }
    setLeftTreeData(snapshot.left);
    setRightTreeData(snapshot.right);
  }, [redo, takeSnapshot]);

  // 노드 추가 함수
  const addLeftNode = () => {
    const newNode = { title: `node${leftTreeData.length + 1}`, leftValue: leftTreeData.length + 1 };
    setLeftTreeData([...leftTreeData, newNode]);
  };

  const addRightNode = () => {
    const newNode = { title: `node${rightTreeData.length + 1}`, rightValue: rightTreeData.length + 1 };
    setRightTreeData([...rightTreeData, newNode]);
  };
  
  return (
    <div className="App">
      <div>
        <button disabled={!canUndo} onClick={onUndo}>Undo</button>
        <button disabled={!canRedo} onClick={onRedo}>Redo</button>
      </div>
      <div className="dual-tree">
        <div className="tree-controls">
          <button onClick={addLeftNode}>Add Left Node</button>
          <button onClick={addRightNode}>Add Right Node</button>
        </div>
        <DualTree<TreeItem<LeftTreeItemData>, TreeItem<RightTreeItemData>>
          leftTreeProps={{
            treeData: leftTreeData,
            onVisibilityToggle({ treeData }) {
              setLeftTreeData(treeData);
            }
          }}
          rightTreeProps={{
            treeData: rightTreeData,
            onVisibilityToggle({ treeData }) {
              setRightTreeData(treeData);
            }
          }}
          onLeftMoveNode={onLeftMoveNode}
          onRightMoveNode={onRightMoveNode}
          onBothMoveNode={onBothMoveNode}
        />
      </div>
    </div>
  );
}

export default App;