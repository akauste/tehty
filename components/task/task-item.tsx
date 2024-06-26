"use client";
import { useDrag, useDrop } from "react-dnd";
import { NewTask, Task } from "@/lib/types";
import {
  Assignment,
  Check,
  CheckBoxOutlineBlank,
  DeleteOutline,
  Edit,
  Expand,
  MinimizeOutlined,
} from "@mui/icons-material";
import { Dispatch, useState } from "react";
import AddTaskModal from "./add-task-modal";
import { KanbanActions } from "@/lib/kanban-reducer";
import DropdownMenu from "../ui/dropdown-menu";
import MenuItem from "../ui/menuitem";

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

  const visibleSteps = clampDescription
    ? task.steps?.filter((s) => !s.done) || []
    : task.steps || [];

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

  const deleteHandler = () => {
    dispatch({
      type: "remove-task",
      board_id: task.board_id,
      task_id: task.task_id,
    });
  };

  const now = new Date();
  const isLate = task.due_date && task.due_date < now;
  return (
    <li
      ref={(node) => drag(drop(node))}
      className="border-b border-slate-600 hover:border-slate-700"
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
            }  float-right border border-slate-500 mt-[-6px] flex`}
          >
            {task.due_date && (
              <span>{task.due_date.toLocaleDateString("fi")}</span>
            )}
            <button onClick={() => setEditTask((s) => !s)}>
              <Assignment fontSize="small" className="hover:text-sky-800" />
            </button>
            <DropdownMenu>
              {clampDescription ? (
                <MenuItem onClick={() => setClampDescription(false)}>
                  <Expand fontSize="small" /> Show full task
                </MenuItem>
              ) : (
                <MenuItem onClick={() => setClampDescription(true)}>
                  <MinimizeOutlined fontSize="small" /> Minimize task
                </MenuItem>
              )}

              <MenuItem onClick={() => setEditTask(true)}>
                <Edit fontSize="small" /> Edit
              </MenuItem>
              {task.done ? (
                <MenuItem onClick={() => updateTask({ ...task, done: false })}>
                  <CheckBoxOutlineBlank fontSize="small" /> Mark not done
                </MenuItem>
              ) : (
                <MenuItem onClick={() => updateTask({ ...task, done: true })}>
                  <Check fontSize="small" /> Mark done
                </MenuItem>
              )}
              <MenuItem onClick={deleteHandler}>
                <DeleteOutline fontSize="small" /> Delete
              </MenuItem>
            </DropdownMenu>
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
          className={`px-1 bold ${task.done ? "line-through" : null}`}
          style={{ backgroundColor: task.background_color }}
        >
          {task.name}
        </h3>
      </header>
      <section
        className={`bg-slate-300 ${task.done ? "line-through" : null}`}
        onClick={() => setClampDescription((s) => !s)}
      >
        {task.description.length > 0 && (
          <p className={`p-1 text-xs ${clampDescription && "line-clamp-3"}`}>
            {task.description}
          </p>
        )}
        <ul
          className={`ml-2 list-inside list-disc text-xs ${
            clampDescription && visibleSteps.length > 4 ? "line-clamp-3" : ""
          }`}
        >
          {visibleSteps.map((s, i) => (
            <li key={i} className={`${s.done ? "line-through" : ""}`}>
              {s.name}
            </li>
          ))}
        </ul>
        {/*task.tags.length > 0 && (
          <p className="text-sky-600 p-1 text-xs">{task.tags.join(", ")}</p>
        )*/}
        {task.steps!.length > 0 && (
          <progress
            value={task.steps!.reduce((val, s) => (s.done ? val + 1 : val), 0)}
            max={task.steps!.length}
            className="w-full h-2"
          ></progress>
        )}
      </section>
    </li>
  );
};
export default TaskItem;
