import { 
 TreeItem as rstTreeItem,
 NodeData as rstNodeData, 
 FullTree as rstFullTree, 
 OnMovePreviousAndNextLocation as rstOnMovePreviousAndNextLocation,
 OnVisibilityToggleData as rstOnVisibilityToggleData,
 GetTreeItemChildrenFn
} from 'react-sortable-tree';

export const externalNodeType = 'external';

// RST default TreeItem accepts any { [key: string]: any } pair.
// These types allow the consumer to define their own properties on tree items.
// Of course, the helper functions exported by RST would also need to be augmented
// to accept type arguments as well.
export type TreeItem<T = {}> = Pick<rstTreeItem, 'title' | 'subtitle' | 'expanded'> & {
  [P in keyof T]: T[P];
} & { children?: TreeItem<T>[] | GetTreeItemChildrenFn; };

export interface NodeData<T extends TreeItem<T>> extends rstNodeData {
  node: T;
}
export interface FullTree<T extends TreeItem<T>> extends rstFullTree {
  treeData: T[];
}
export interface OnMovePreviousAndNextLocation<T extends TreeItem<T>> extends rstOnMovePreviousAndNextLocation {
  nextParentNode: T | null;
}
export type OnMoveData<T extends TreeItem<T>> = NodeData<T> & FullTree<T> & OnMovePreviousAndNextLocation<T>;
export interface OnVisibilityToggleData<T extends TreeItem<T>> extends Omit<rstOnVisibilityToggleData, 'treeData'>, FullTree<T> {
  node: T;
}
