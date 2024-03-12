import { Assignment } from "@mui/icons-material";
import { Task } from "@/lib/db";
import TaskItem from "./task-item";
import { Dispatch, useCallback } from "react";
import { KanbanActions } from "../kanban/kanban";
import TaskDropzone from "./task-dropzone";

interface TaskListProps {
  user_id: string;
  list: Task[];
  board_id: number;
  dispatch: Dispatch<KanbanActions>;
}

const TaskList = ({ board_id, list, dispatch }: TaskListProps) => {
  const tasks = list;

  const find = useCallback(
    (id: Number) => {
      const task = tasks.filter((t) => t.task_id === id)[0];
      return {
        task,
        index: tasks.indexOf(task),
      };
    },
    [tasks]
  );

  const move = (id: Number, atIndex: number) => {
    const { task, index } = find(id);
    dispatch({
      type: "move-task",
      board_id: task.board_id,
      removeIndex: index,
      atIndex,
      task,
    });
  };

  const insertAt = (newTask: Task, atIndex: number) => {
    dispatch({ type: "insert-task", board_id, newTask, atIndex });
  };

  const remove = (task_id: number) => {
    dispatch({ type: "remove-task", board_id, task_id });
  };

  const updateOrder = async () => {
    // const res = await fetch('/api/todos', {
    //   method: 'POST',
    //   body: JSON.stringify(
    //     todos.map((t,index) => ({todo_id: t.todo_id, orderno: index}))
    //   ),
    // });
    // const data = await res.json();
    // console.log('Updated: ', data);
  };

  return (
    <ul className="space-y-2">
      {tasks.length ? (
        tasks.map((t) => (
          <TaskItem
            key={t.task_id.toString()}
            task={t}
            insertAt={insertAt}
            remove={remove}
            move={move}
            find={find}
            onDrop={updateOrder}
          />
        ))
      ) : (
        <TaskDropzone board_id={board_id} dispatch={dispatch} />
      )}
    </ul>
  );
};
export default TaskList;
