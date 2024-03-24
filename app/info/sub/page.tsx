import Kanban from "@/components/kanban/kanban";

export default function Sub() {
  return (
    <>
      <h2>Sub</h2>
      <p>This is the sub page in /info/sub</p>
      <p>
        Point of this is testing the layouts for different levels, here the top
        layout is showing the main header etc., but there is also a layout for
        info pages, and routes under that are showing that.
      </p>

      <div className="flex w-full min-h-100 space-x-4">
        <div className="bg-slate-200 p-2 flex-grow h-96 border border-slate-500 shadow-sm shadow-slate-500">
          Todo
        </div>
        <div className="bg-slate-200 p-2 flex-grow h-96 border border-slate-500 shadow-sm shadow-slate-500">
          Done
        </div>
        <div className="bg-slate-200 p-2 flex-grow h-96 border border-slate-500 shadow-sm shadow-slate-500">
          In progress
        </div>
        <div className="bg-slate-200 p-2 h-96 border border-slate-500 shadow-sm shadow-slate-500">
          +
        </div>
      </div>
    </>
  );
}
