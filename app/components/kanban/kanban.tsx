'use client';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardList, { Board, Task } from "./board-list";
import { Todo } from "@/lib/db";
import { useReducer } from "react";
import {produce} from "immer";

const tasks = [
  { task_id: 1, category: 1,  name: 'Task 1 (lime)', description: 'Description of the first task. Long description to test the clamping when we go on for too long', backgroundColor: '#a3e635', tags: ['#tag1'] },
  { task_id: 2, category: 1,  name: 'Task 2 (red)', description: 'This one is important', backgroundColor: '#f87171', tags: ['#tag1', '#important', '#tagged'] },
  { task_id: 3, category: 2,  name: 'Task 3', description: '', backgroundColor: '', tags: [] },
  { task_id: 4, category: 2,  name: 'Task 4', description: '', backgroundColor: '', tags: [] },
  { task_id: 5, category: 3,  name: 'Task 5', description: '', backgroundColor: '', tags: [] },
  { task_id: 6, category: 1,  name: 'Task 6', description: '', backgroundColor: '', tags: [] },
  { task_id: 7, category: 4,  name: 'Task 7', description: '', backgroundColor: '', tags: [] },
  { task_id: 8, category: 1,  name: 'Task 8', description: '', backgroundColor: '', tags: [] },
  { task_id: 9, category: 2,  name: 'Task 9', description: '', backgroundColor: '', tags: [] },
  { task_id: 10, category: 3,  name: 'Task 10', description: '', backgroundColor: '', tags: [] },
  { task_id: 11, category: 4,  name: 'Task 11', description: '', backgroundColor: '', tags: [] },
  { task_id: 12, category: 4,  name: 'Task 12', description: '', backgroundColor: '', tags: [] },
  { task_id: 13, category: 2,  name: 'Task 13', description: '', backgroundColor: '', tags: [] },
  { task_id: 14, category: 3,  name: 'Task 14', description: '', backgroundColor: '', tags: [] },
  { task_id: 15, category: 1,  name: 'Task 15', description: '', backgroundColor: '', tags: [] },
  { task_id: 16, category: 4,  name: 'Task 16', description: '', backgroundColor: '', tags: [] },
  { task_id: 17, category: 4,  name: 'Task 17', description: '', backgroundColor: '', tags: [] },
  { task_id: 18, category: 4,  name: 'Task 18', description: '', backgroundColor: '', tags: [] },
];

const boards = [
  { board_id: 1, backgroundColor: '#94a3b8', name: 'Planned', tasks: tasks.filter(t => t.category === 1) },
  { board_id: 2, backgroundColor: '#60a5fa', name: 'In progress', tasks: tasks.filter(t => t.category === 2) },
  { board_id: 3, backgroundColor: '#fbbf24', name: 'In testing', tasks: tasks.filter(t => t.category === 3) },
  { board_id: 4, backgroundColor: '#a3e635', name: 'Done', tasks: tasks.filter(t => t.category === 4) },
];

type MoveBoardAction = {
  type: 'move-board'
  board_id: Number
  atIndex: number
}
type UpdateBoardAction = {
  type: 'update-board'
  index: number
  board: Board
}
type MoveTaskAction = {
  type: 'move-task'
  board_id: Number
  removeIndex: number
  atIndex: number
  task: Task
}
type InsertTaskAction = {
  type: 'insert-task'
  board_id: Number
  atIndex: number
  newTask: Task
}
type RemoveTaskAction = {
  type: 'remove-task'
  board_id: Number
  task_id: Number
}
type AppendTaskAction = {
  type: 'append-task'
  board_id: Number
  task: Task
}
type AppendRemoveTaskAction = {
  type: 'append-remove-task'
  board_id: Number
  task: Task
}

export type KanbanActions = MoveBoardAction | UpdateBoardAction | MoveTaskAction | InsertTaskAction | RemoveTaskAction | AppendTaskAction | AppendRemoveTaskAction;

function reducer(state: { boards: Board[] }, action: KanbanActions) {
  switch(action.type) {
    case 'move-board':
      return produce(state, draft => {
        const board = draft.boards.find(b => b.board_id == action.board_id);
        if(board) {
          draft.boards.splice(draft.boards.indexOf(board), 1);
          draft.boards.splice(action.atIndex, 0, board);
        }
      });
    case 'update-board':
      return produce(state, draft => {
        draft.boards[action.index] = action.board; 
      });
    case 'move-task':
      return produce(state, draft => {
        const tasks = draft.boards.find(i => i.board_id == action.board_id)?.tasks;
        if(tasks) {
          tasks.splice(action.removeIndex, 1);
          tasks.splice(action.atIndex, 0, action.task);
        }
      });
    case 'insert-task':
      return produce(state, draft => {
        const tasks = draft.boards.find(i => i.board_id == action.board_id)?.tasks;
        tasks?.splice(action.atIndex, 0, {...action.newTask, category: action.board_id});
      });
    case 'remove-task':
      return produce(state, draft => {
        const board = draft.boards.find(i => i.board_id == action.board_id);
        if(board)
          board.tasks = board.tasks.filter(t => t.task_id != action.task_id);
      });
    case 'append-task':
      return produce(state, draft => {
        const board = draft.boards.find(i => i.board_id == action.board_id);
        board?.tasks.push(action.task);
      })
      case 'append-remove-task':
        return produce(state, draft => {
          const oldBoard = draft.boards.find(i => i.board_id == action.task.category);
          if(oldBoard)
            oldBoard.tasks = oldBoard.tasks.filter(t => t.task_id != action.task.task_id);

          const board = draft.boards.find(i => i.board_id == action.board_id);
          board?.tasks.push({...action.task, category: action.board_id});
        })
    default:
      throw Error('Unimplemented action:', action);
  }
  return state;
}

export default function Kanban(
  {user_id}: {user_id: string}
  //{user_id, todos}: {user_id: string, todos: Todo[]}
  ) {
  const [state, dispatch] = useReducer(reducer, {boards});

  return <DndProvider backend={HTML5Backend}>
    <div className="flex w-full my-2 gap-2"> 
      <h1 className="flex-grow">Kanban test</h1>
      <button className=" px-1 border border-slate-500 rounded">Action</button>
      <button className=" px-1 border border-slate-500 rounded">Other</button>
      <button className=" px-1 border border-slate-500 rounded">+ Add task</button>
      <button className=" px-1 border border-slate-500 rounded">+ Add board</button>
    </div>
    <BoardList user_id={user_id} list={state.boards} dispatch={dispatch} />
    <br />
  </DndProvider>
}