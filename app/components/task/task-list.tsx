import { Assignment } from "@mui/icons-material"
import { Task } from "../kanban/board-list"
import TaskItem from "./task-item"
import { useCallback, useEffect, useState } from "react"

interface TaskListProps {
  user_id: string
  list: Task[]
}

const TaskList = ({list}: TaskListProps) => {
  const [tasks, setTasks] = useState(list);

  useEffect(() => {
    setTasks(list);
  }, [list]);

  const find = useCallback((id: string) => {
    const task = tasks.filter((t) => `${t.task_id}` === id)[0]
    return {
      task,
      index: tasks.indexOf(task),
    }
  },
  [tasks]);

const move = useCallback((id: string, atIndex: number) => {
    const { task, index } = find(id);
    setTasks(old => {
      const list = [...old];
      if(index != undefined)
        list.splice(index, 1);
      list.splice(atIndex, 0, task);
      //list.splice(atIndex, 0, task);
      //console.log(old.map(t => t.todo_id).join(',') + ' -> '+ list.map(t => t.todo_id).join(','), todo);
      return list;
    });
  },
  [find, setTasks]);

const insertAt = useCallback((newTask: Task, atIndex: number) => {
  setTasks(old => {
    const list = [...old];
    list.splice(atIndex, 0, newTask);
    return list;
  });
}, [find]);

const remove = useCallback((id: Number) => {
  setTasks(old => old.filter(t => t.task_id != id));
}, []);

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

  return <ul className="space-y-2">
    {
      tasks.map(t => <TaskItem key={t.task_id.toString()} task={t} insertAt={insertAt} remove={remove} move={move} find={find} onDrop={updateOrder} />)
    }
  </ul>
}
export default TaskList;