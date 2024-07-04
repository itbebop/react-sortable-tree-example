import * as React from 'react';
import SortableTree, { ReactSortableTreeProps } from 'react-sortable-tree';
import { TreeItem, externalNodeType, OnMoveData, OnVisibilityToggleData } from '../types';

export interface TreeProps<T extends TreeItem<T>> extends ReactSortableTreeProps {
  treeData: T[];
  onChange(treeData: T[]): void;
  onMoveNode?(data: OnMoveData<T>): void;
  onVisibilityToggle?(data: OnVisibilityToggleData<T>): void;
}

export function Tree<T extends TreeItem<T>>(props: TreeProps<T>) {
  return (
    <SortableTree
      dndType={externalNodeType}
      {...props}
    />
  );
}
