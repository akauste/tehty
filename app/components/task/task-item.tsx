"use client";
import { useDrag, useDrop } from "react-dnd";
import { NewTask, Task } from "@/lib/db";
import { Assignment } from "@mui/icons-material";
import { Dispatch, useState } from "react";
import AddTaskModal from "./add-task-modal";
import { KanbanActions } from "@/lib/kanban-reducer";

interface TasksProps {
  task: Task;
  move: (id: number, to: number) => void;
  find: (id: number) => { index: number };
  dispatch: Dispatch<KanbanActions>;
}

const TaskItem: React.FC<TasksProps> = ({ task, move, find, dispatch }) => {
  const [editTask, setEditTask] = useState(false);
  const originalIndex = find(task.task_id).index;
  const [clampDescription, setClampDescription] = useState(true);
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "task",
      item: {
        task: { ...task },
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [originalIndex, move]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "task",
      drop({
        task: sourceTask,
      }: {
        id: number;
        originalIndex: number;
        task: Task;
      }) {
        const { index } = find(task.task_id);
        dispatch({
          type: "append-remove-task",
          board_id: task.board_id,
          index,
          task: sourceTask,
        });
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
