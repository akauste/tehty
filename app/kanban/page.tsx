import Kanban from "@/app/components/kanban/kanban";

export default function Sub() {
  return <>
    <h2>Kanban</h2>
    <p>Point of this is testing the layouts for different levels, here the top layout is showing the main header etc.,
      but there is also a layout for info pages, and routes under that are showing that.
    </p>

    <Kanban user_id="testuser" />
  </>
}