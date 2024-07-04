import * as React from 'react';
import { cloneDeep } from 'lodash';
import { TreeItem } from '../types';

type Snapshot<T> = TreeItem<T>[];

export function useHistoryStack<T>() {
  const undoStack = React.useRef<Snapshot<T>[]>([]);
  const redoStack = React.useRef<Snapshot<T>[]>([]);

  const undo = (snapshot: Snapshot<T>) => {
    if (!undoStack.current.length) {
      return;
    }
    redoStack.current.push(cloneDeep(snapshot));
    return undoStack.current.pop();
  };

  const redo = (snapshot: Snapshot<T>) => {
    if (!redoStack.current.length) {
      return;
    }
    undoStack.current.push(cloneDeep(snapshot));
    return redoStack.current.pop();
  };

  const push = (snapshot: Snapshot<T>) => {
    undoStack.current.push(cloneDeep(snapshot));
    redoStack.current = [];
  };

  return { 
    undo, 
    redo,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0, 
    push 
  };
}
