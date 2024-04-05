"use client";
import { BoardTask } from "@/lib/types";
import { Dispatch, useCallback } from "react";
import { DndProvider, useDrop } from "react-dnd";
import BoardItem from "./board-item";
import { KanbanActions } from "@/lib/kanban-reducer";

const BoardList: React.FC<{
  user_id: string;
  list: BoardTask[];
  dispatch: Dispatch<KanbanActions>;
}> = ({ user_id, list, dispatch }) => {
  const boards = list;

  const findBoard = (id: number) => {
    const board = boards.filter((b) => b.board_id === id)[0];
    return {
      board,
      index: boards.indexOf(board),
    };
  };

  const moveBoard = (board_id: number, atIndex: number) => {
    dispatch({ type: "move-board", board_id, atIndex });
  };

  const [, drop] = useDrop(() => ({ accept: "board" }));

  return (
    <ul className="flex w-full min-h-100 space-x-4" ref={drop}>
      {boards
        .filter((b) => b.show)
        .map((b, i) => (
          <BoardItem
            key={i}
            board={b}
            moveBoard={moveBoard}
            findBoard={findBoard}
            dispatch={dispatch}
          />
        ))}
    </ul>
  );
};
export default BoardList;
