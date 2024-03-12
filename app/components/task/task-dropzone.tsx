import { useDrop } from "react-dnd";
import { Task } from "../kanban/board-list";
import { Dispatch } from "react";
import { KanbanActions } from "../kanban/kanban";

interface TaskDropzoneProps {
  board_id: Number
  dispatch: Dispatch<KanbanActions>
}

const TaskDropzone = ({board_id, dispatch}: TaskDropzoneProps) => {
  const [, drop] = useDrop(
    () => ({
      accept: 'task',
      /*hover({ id: draggedId, task: sourceTask }: {id: Number, originalIndex: number, task: Task, removeOld: (id: Number) => void}) {
        if(board_id == sourceTask.category) {
          const { index: overIndex } = find(task.task_id)
          move(draggedId, overIndex)
          
        }
        else {
          console.log('HOVER OVER OTHER CATEGORY src/tgt:', sourceTask.category, task.category);
        }
      },*/
      drop({id: draggedId, task: sourceTask}: {id: Number, task: Task}) {
        if(board_id != sourceTask.category) {
          dispatch({type: 'append-remove-task', board_id, task: sourceTask});
        }
      }
    }),
    []
  )

  return <li ref={(node) => drop(node)} className="p-8 bg-sky-200 opacity-50 hover:opacity-100">Drop task here</li>;
}

export default TaskDropzone;