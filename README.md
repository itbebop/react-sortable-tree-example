## Dual react-sortable-tree example

Example usage of multiple [react-sortable-tree](https://github.com/frontend-collective/react-sortable-tree) trees with an undo/redo stack. Inter-tree moves are batched into a single handler to prevent individual trees from each performing their own push onto the stack for the single action. 

This project also includes a types file that shows example overrides of the default RST `TreeItem` type such that it can accept a type argument so the consumer can define its own properties on each tree item.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
