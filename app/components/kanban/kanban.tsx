'use client';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardList from "./board-list";
import { Todo } from "@/lib/db";

const boards = [
  { board_id: 1, backgroundColor: '#94a3b8', name: 'Planned' },
  { board_id: 2, backgroundColor: '#38bdf8', name: 'In progress' },
  { board_id: 3, backgroundColor: '#facc15', name: 'In testing' },
  { board_id: 4, backgroundColor: '#a3e635', name: 'Done' },
];

export default function Kanban(
  {user_id}: {user_id: string}
  //{user_id, todos}: {user_id: string, todos: Todo[]}
  ) {

  return <DndProvider backend={HTML5Backend}>
    <div className="flex w-full my-2 gap-2"> 
      <h1 className="flex-grow">Kanban test</h1>
      <button className=" px-1 border border-slate-500 rounded">Action</button>
      <button className=" px-1 border border-slate-500 rounded">Other</button>
      <button className=" px-1 border border-slate-500 rounded">+ Add task</button>
      <button className=" px-1 border border-slate-500 rounded">+ Add board</button>
    </div>
    <BoardList user_id={user_id} list={boards} />
    <br />
  </DndProvider>
}