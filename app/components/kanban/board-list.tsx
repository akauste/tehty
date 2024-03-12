'use client';
import { NewTodo, Todo } from "@/lib/db";
import Board from "./board-item";
//import TodoAdd from "./board-add";
import { Dispatch, useCallback, useEffect, useState } from "react";
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import BoardItem from "./board-item";
import { KanbanActions } from '@/app/components/kanban/kanban';

// const getTodos = async () : Promise<Todo[]> => {
//   const data = await fetch('/api/todos');
//   const list : Todo[] = await data.json();
//   return list;
// }

// const addTodo = async (todo: NewTodo) : Promise<Todo> => {
//   const data = await fetch('/api/todo', {
//     method: 'POST',
//     body: JSON.stringify(todo),
//   });
//   return await data.json();
// }

// const deleteTodo = async (todo_id: Number) : Promise<Todo> => {
//   const data = await fetch('/api/todo', {
//     method: 'DELETE',
//     body: JSON.stringify({todo_id}),
//   });
//   return await data.json();
// }

export type Task = {
  task_id: Number;
  category: Number;
  name: string;
  description: string;
  backgroundColor: string;
  tags: string[]
}

export type Board = {
  board_id: Number;
  name: string;
  backgroundColor: string;
  tasks: Task[];
}

const BoardList : React.FC<{user_id: string, list: Board[], dispatch: Dispatch<KanbanActions>}> = ({user_id, list, dispatch}) => {
  const boards = list;

  const updateBoard = (index: number, board: Board) => {
    dispatch({type: 'update-board', index, board});
  }
  
  // useEffect(() => {
  //   getTodos().then(list => setTodos(list));
  // }, []);

  // const insertTodo = (task: string) => {
  //   addTodo({ task, user_id, done: false, orderno: null}).then(newTodo => setTodos(old => [...old, newTodo]));
  // }

  // const removeTodo = (id: Number) => {
  //   console.log('removing todo item: ', id);
  //   deleteTodo(id).then(() => setTodos(old => old.filter(i => i.todo_id != id)));
  // }

  const findBoard = useCallback((id: string) => {
      const board = boards.filter((b) => `${b.board_id}` === id)[0]
      return {
        board,
        index: boards.indexOf(board),
      }
    },
    [boards]);

  const moveBoard = useCallback((id: string, atIndex: number) => {
      const { board, index } = findBoard(id);
      dispatch({type: 'move-board', index, atIndex, board});
    },
    [findBoard]);

  const updateOrder = async () => {
    // const res = await fetch('/api/todos', {
    //   method: 'POST',
    //   body: JSON.stringify(
    //     todos.map((t,index) => ({todo_id: t.todo_id, orderno: index}))
    //   ),
    // });
    // const data = await res.json();
    // console.log('Updated: ', data);
  }

  const [, drop] = useDrop(() => ({ accept: 'board' }));

  return <ul className="flex w-full min-h-100 space-x-4" ref={drop}>
      { boards.map((b, i) => <BoardItem key={i} board={b} update={(board) => updateBoard(i, board)} remove={() => {} /*removeTodo*/} moveBoard={moveBoard} findBoard={findBoard} onDrop={updateOrder} />) }
      {/* <TodoAdd user_id={user_id} addTodo={insertTodo} /> */}
    </ul>
}
export default BoardList;