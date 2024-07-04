import * as React from 'react';
import { TreeItem, OnMoveData } from '../types';
import { TreeProps, Tree } from './Tree';

interface DualTreeProps<L extends TreeItem<L>, R extends TreeItem<R>> {
  leftTreeProps: Omit<TreeProps<L>, 'onChange'>;
  rightTreeProps: Omit<TreeProps<R>, 'onChange'>;
  onLeftMoveNode(data: OnMoveData<L>): void; 
  onRightMoveNode(data: OnMoveData<R>): void;
  onBothMoveNode(leftData: OnMoveData<L>, rightData: OnMoveData<R>): void;
}

// The pupose of this component is to batch moves between L and R trees into a `both` handler.
// This is useful is the consumer is trying to manage a history stack and would not want
// to push L and R separately onto the stack as a result of each tree's handler firing.
export function DualTree<L extends TreeItem<L>, R extends TreeItem<R>> ({
  leftTreeProps,
  rightTreeProps,
  onLeftMoveNode,
  onRightMoveNode,
  onBothMoveNode,
}: DualTreeProps<L, R>) {
  const [treesChanged, setTreesChanged] = React.useState<{
    left?: OnMoveData<L> | null;
    right?: OnMoveData<R> | null;
  }>({ left: null, right: null });
  const onChangeTimer = React.useRef<number>();

  // Since we're slightly debouncing the move callback, keep tree state locally
  // and immediately update upon change to avoid rendering latency
  const [leftTreeData, setLeftTreeData] = React.useState(leftTreeProps.treeData);
  const [rightTreeData, setRightTreeData] = React.useState(rightTreeProps.treeData);

  const onAnyMoveNode = React.useCallback(() => {
    if (treesChanged.left && treesChanged.right) {
      onBothMoveNode(treesChanged.left, treesChanged.right);
    } else if (treesChanged.left) {
      onLeftMoveNode(treesChanged.left);
    } else if (treesChanged.right) {
      onRightMoveNode(treesChanged.right);
    }
    setTreesChanged({ left: null, right: null });
  }, [onBothMoveNode, onLeftMoveNode, onRightMoveNode, treesChanged]);

  React.useEffect(() => setLeftTreeData(leftTreeProps.treeData), [leftTreeProps.treeData]);
  React.useEffect(() => setRightTreeData(rightTreeProps.treeData), [rightTreeProps.treeData]);

  React.useEffect(() => {
    // debounce in case both trees are changing
    clearTimeout(onChangeTimer.current);
    onChangeTimer.current = window.setTimeout(() => {
      if (treesChanged.left || treesChanged.right) {
        onAnyMoveNode();
      }
    }, 10);
  }, [treesChanged, onAnyMoveNode]);

  return (
    <>
      <Tree<L>
        {...leftTreeProps}
        treeData={leftTreeData}
        onChange={data => setLeftTreeData(data) }
        onMoveNode={data => setTreesChanged({ ...treesChanged, left: data })}
      />
      <Tree<R>
        {...rightTreeProps}
        treeData={rightTreeData}
        onChange={data => setRightTreeData(data) }
        onMoveNode={data => setTreesChanged({ ...treesChanged, right: data })}
      />
    </>
  );
}