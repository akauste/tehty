'use client';
import { Todo, setTodoDone } from "@/lib/db";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useDrag, useDrop } from "react-dnd";
import { Task } from "../kanban/board-list";
import { Assignment } from "@mui/icons-material";

interface TasksProps {
  task: Task;
  remove: (id: Number) => void;
  move: (id: Number, to: number) => void;
  insertAt: (task: Task, atIndex: number) => void;
  find: (id: Number) => { index: number };
  onDrop: () => void;
}

const TaskItem: React.FC<TasksProps> = ({task, remove, insertAt, move, find, onDrop}) => {
  //const [task, setTask] = useState(task);

  /*useEffect(() => {
    setTask(todo);
  }, [todo])*/
  
  // const toggleDone = () => {
  //   fetch('/api/todo', {
  //     method: 'PATCH',
      
  //     body: JSON.stringify( t )
  //   });
  //   setT(old => ({...old, done: !old.done}));
  // }

  // const removeThis = () => {
  //   remove(todo.todo_id)
  // }

  const originalIndex = find(task.task_id).index;
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'task',
      item: { id: task.task_id, originalIndex, task: {...task}, removeOld: remove },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        console.log('end handler!!!', task.name, item.task.name, task.category, item.task.category);
        const { id: droppedId, originalIndex } = item;
        //console.log(droppedId, originalIndex);
        const didDrop = monitor.didDrop()
        if (!didDrop) {
          console.log('No drop', monitor);
          move(droppedId, originalIndex)
        }
        else {
          onDrop();
        }
      },
    }),
    [originalIndex, move],
  )

  const [, drop] = useDrop(
    () => ({
      accept: 'task',
      hover({ id: draggedId, task: sourceTask }: {id: Number, originalIndex: number, task: Task, removeOld: (id: Number) => void}) {
        if(task.category == sourceTask.category) {
          if (draggedId !== task.task_id) {
            const { index: overIndex } = find(task.task_id)
            move(draggedId, overIndex)
          }
        }
        else {
          console.log('HOVER OVER OTHER CATEGORY src/tgt:', sourceTask.category, task.category);
        }
      },
      drop({id: draggedId, task: sourceTask, removeOld}: {id: Number, originalIndex: number, task: Task, removeOld: (id: Number) => void}) {
        if(task.category != sourceTask.category) {
          console.log('NEWDROP HANDLER', task.category);
          const {index} = find(task.task_id);
          insertAt({...sourceTask, category: task.category}, index);
          removeOld(sourceTask.task_id);
        }
      }
    }),
    [find, move],
  )

  return <li ref={(node) => drag(drop(node))} className="border-b border-slate-600">
  <header className="mt-3 bg-slate-400" style={{backgroundColor: task.backgroundColor}}>
    <div className="text-xs">&nbsp;
      <div className="bg-slate-200 float-right border border-slate-500 mt-[-6px] flex gap-2 opacity-80">
        <span>due date</span>
        <Assignment fontSize="small" className="float-right hover:text-sky-800" />
      </div>
    </div>
    <h3 className="px-1 bold" style={{backgroundColor: task.backgroundColor}}>
      { task.name }
    </h3>
  </header>
  <section className="bg-slate-300">
    { task.description.length > 0 && <p className="p-1 text-xs line-clamp-3">{ task.description }</p> }
    { task.tags.length > 0 && <p className="text-sky-600 p-1 text-xs">{ task.tags.join(', ') }</p>}
  </section>
</li>;
};
export default TaskItem;