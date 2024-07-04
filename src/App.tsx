import React from 'react';
import SortableTree, { NodeRendererProps, TreeItem as SortableTreeItem, FullTree, OnMovePreviousAndNextLocation, ExtendedNodeData } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import { useHistoryStack } from './hooks/useHistoryStack';
import './App.css';

interface TreeItem<T> extends SortableTreeItem {
  leftValue?: any;
  rightValue?: any;
  value: T;
}

type TreeItemData = { value: any };
type Snapshot<T> = TreeItem<T>[];

const App: React.FC = () => {
  const [treeData, setTreeData] = React.useState<TreeItem<TreeItemData>[]>([
    { title: 'node1', leftValue: 1, value: { value: 1 } },
    { title: 'node2', leftValue: 2, value: { value: 2 }, expanded: true, children: [
      { title: 'node3', leftValue: 3, value: { value: 3 } }
    ] },
    { title: 'node4', rightValue: 4, value: { value: 4 } },
    { title: 'node5', rightValue: 5, value: { value: 5 }, expanded: true, children: [
      { title: 'node6', rightValue: 6, value: { value: 6 } }
    ] },
  ]);

  const { undo, redo, push: undoPush, canUndo, canRedo } = useHistoryStack<TreeItemData>();

  const takeSnapshot = React.useCallback((): Snapshot<TreeItemData> => [...treeData], [treeData]);

  const onMoveNode = React.useCallback(({ treeData }: FullTree & OnMovePreviousAndNextLocation) => {
    undoPush(takeSnapshot() as any);
    setTreeData(treeData as TreeItem<TreeItemData>[]);
  }, [undoPush, takeSnapshot]);

  const onUndo = React.useCallback(() => {
    const snapshot = undo(takeSnapshot() as any);
    if (!snapshot) {
      return;
    }
    setTreeData(snapshot);
  }, [undo, takeSnapshot]);

  const onRedo = React.useCallback(() => {
    const snapshot = redo(takeSnapshot() as any);
    if (!snapshot) {
      return;
    }
    setTreeData(snapshot);
  }, [redo, takeSnapshot]);

  const addNode = () => {
    const newNode = { title: `node${treeData.length + 1}`, value: { value: treeData.length + 1 } };
    setTreeData([...treeData, newNode]);
  };

  const addChildNode = (rowInfo: ExtendedNodeData) => {
    const newTreeData = [...treeData];
    const node = newTreeData[rowInfo.treeIndex];

    if (!node.children) {
      node.children = [];
    }

    if (Array.isArray(node.children)) {
      node.children.push({
        title: `node${treeData.length + 1}`,
        value: { value: treeData.length + 1 },
      });

      setTreeData(newTreeData);
    }
  };

  return (
    <div className="App">
      <div>
        <button disabled={!canUndo} onClick={onUndo}>Undo</button>
        <button disabled={!canRedo} onClick={onRedo}>Redo</button>
        <button onClick={addNode}>Add Node</button>
      </div>
      <div style={{ height: 500 }}>
        <SortableTree
          treeData={treeData}
          onChange={newTreeData => setTreeData(newTreeData as any)}
          onMoveNode={onMoveNode}
          generateNodeProps={(rowInfo: ExtendedNodeData) => ({
            buttons: [
              <button onClick={() => addChildNode(rowInfo)}>Add child</button>
            ]
          })}
        />
      </div>
    </div>
  );
}

export default App;
