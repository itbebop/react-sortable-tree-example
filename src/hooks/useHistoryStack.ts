import * as React from 'react';
import { cloneDeep } from 'lodash';
import { TreeItem } from '../types';

type Snapshot<L,R> = { left: TreeItem<L>[]; right: TreeItem<R>[]; };

export function useHistoryStack<L,R>() {
  const undoStack = React.useRef<{ 
    left: TreeItem<L>[]; 
    right: TreeItem<R>[]; 
  }[]>([]);
  const redoStack = React.useRef<{ 
    left: TreeItem<L>[]; 
    right: TreeItem<R>[]; 
  }[]>([]);

  const undo = (snapshot: Snapshot<L,R>) => {
    if (!undoStack.current.length) {
      return;
    }
    redoStack.current.push(cloneDeep(snapshot));
    return undoStack.current.pop();
  };

  const redo = (snapshot: Snapshot<L,R>) => {
    if (!redoStack.current.length) {
      return;
    }
    undoStack.current.push(cloneDeep(snapshot));
    return redoStack.current.pop();
  };

  const push = (snapshot: Snapshot<L,R>) => {
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
