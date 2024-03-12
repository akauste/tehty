import { Board } from "./board-list";
import { bgColors } from "./board-item";
import { useState } from "react";

interface BoardEditProps {
  board: Board
  update: (board: Board) => void
  close: () => void
}

const BoardEdit = ({board, update, close}: BoardEditProps) => {
  const [name, setName] = useState(board.name);
  const [backgroundColor, setBackgroundColor] = useState(board.backgroundColor);
  const save = () => {
    update({...board, name, backgroundColor});
    close();
  }

  return <div className="absolute z-10 w-44 bg-slate-100 dark:bg-slate-700 shadow-sm shadow-slate-800">
    <form onSubmit={save} className="p-2 flex flex-col space-y-1">
      <label>Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border border-slate-500 rounded w-full" /> 
      <label>Color</label>
      <div className="flex flex-row gap-1">
        { bgColors.map(color => (
          <button key={color} className="w-4 h-4 hover:opacity-50"
            onClick={() => setBackgroundColor(color)}
            style={{
              backgroundColor: color,
              boxShadow: (color == backgroundColor ? `1px -1px 2px black` : ''),
          }}></button>
        )) }
      </div>
      <select className="border border-slate-500 rounded">
        <option>Default</option>
        <option className="bg-sky-400">Blue</option>
      </select> 
      <label>
        <input type="checkbox" />
        Show</label>
      <div className="flex w-full gap-2">
        <button type="reset" className="border border-slate-500 hover:bg-slate-200 rounded p-1 flex-1" onClick={close}>Cancel</button>
        <button type="submit" className="border border-sky-500 bg-sky-200 hover:bg-sky-100 rounded p-1 flex-1" onClick={save}>Save</button>
      </div>
    </form>
  </div>;
}
export default BoardEdit;