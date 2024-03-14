"use client";
import { useDrag, useDrop } from "react-dnd";
import { NewTask, Task } from "@/lib/db";
import { Assignment } from "@mui/icons-material";
import { Dispatch, useState } from "react";
import AddTaskModal from "./add-task-modal";
import { KanbanActions } from "../kanban/kanban";

interface TasksProps {
  task: Task;
  remove: (id: number) => void;
  move: (id: number, to: number) => void;
  insertAt: (task: Task, atIndex: number) => void;
  find: (id: number) => { index: number };
  dispatch: Dispatch<KanbanActions>;
  onDrop: () => void;
}

const TaskItem: React.FC<TasksProps> = ({
  task,
  remove,
  insertAt,
  move,
  find,
  dispatch,
  onDrop,
}) => {
  const [editTask, setEditTask] = useState(false);
  const originalIndex = find(task.task_id).index;
  const [clampDescription, setClampDescription] = useState(true);
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "task",
      item: {
        id: task.task_id,
        originalIndex,
        task: { ...task },
        removeOld: remove,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        console.log(
          "end handler!!!",
          task.name,
          item.task.name,
          task.board_id,
          item.task.board_id
        );
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          console.log("No drop", monitor);
          move(droppedId, originalIndex);
        } else {
          onDrop();
        }
      },
    }),
    [originalIndex, move]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "task",
      drop({
        id: draggedId,
        task: sourceTask,
        removeOld,
      }: {
        id: number;
        originalIndex: number;
        task: Task;
        removeOld: (id: Number) => void;
      }) {
        const { index } = find(task.task_id);
        removeOld(sourceTask.task_id);
        fetch("/api/board/" + task.board_id + "/moveto", {
          method: "POST",
          body: JSON.stringify({ task_id: sourceTask.task_id, index }),
        })
          .then((res) => res.json())
          .then((data) => console.log("moveto:", data));
        insertAt({ ...sourceTask, board_id: task.board_id }, index);
      },
    }),
    [find, move]
  );

  const updateTask = (task: Task) => {
    console.log("updateTask", task);
    dispatch({ type: "update-task", task });
    setEditTask(false);
  };

  const now = new Date();
  const isLate = task.due_date && task.due_date < now;
  return (
    <li
      ref={(node) => drag(drop(node))}
      className="border-b border-slate-600 hover:border-red-800 hover:opacity-70"
    >
      <header
        className="mt-3 bg-slate-400"
        style={{ backgroundColor: task.background_color }}
      >
        <div className="text-xs">
          &nbsp;
          <div
            className={`${
              isLate ? "bg-red-200 text-red-800" : "bg-slate-200"
            }  float-right border border-slate-500 mt-[-6px] flex gap-2 opacity-80`}
          >
            {task.due_date && (
              <span>{task.due_date.toLocaleDateString("fi")}</span>
            )}
            <button onClick={() => setEditTask((s) => !s)}>
              <Assignment
                fontSize="small"
                className="float-right hover:text-sky-800"
              />
            </button>
            {editTask ? (
              <AddTaskModal
                task={task}
                save={updateTask}
                close={() => setEditTask(false)}
              />
            ) : null}
          </div>
        </div>
        <h3
          className="px-1 bold"
          style={{ backgroundColor: task.background_color }}
        >
          {task.name}
        </h3>
      </header>
      <section
        className="bg-slate-300"
        onClick={() => setClampDescription((s) => !s)}
      >
        {task.description.length > 0 && (
          <p className={`p-1 text-xs ${clampDescription && "line-clamp-3"}`}>
            {task.description}
          </p>
        )}
        {/*task.tags.length > 0 && (
          <p className="text-sky-600 p-1 text-xs">{task.tags.join(", ")}</p>
        )*/}
      </section>
    </li>
  );
};
export default TaskItem;
