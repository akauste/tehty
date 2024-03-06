export default async function Info() {
  return <>
    <h1>Info page</h1>
    <section className="space-y-6">
      <p>This page is here just for testing out things</p>
      <p className="animate-pulse border-2 border-gray-800 shadow-sm shadow-gray-500">Here comes some information, just testing the second page. And this text should be pulsating.</p>
      <div>
        <button className="w-24 h-12 bg-blue-500 text-slate-100 animate-bounce">Bouncing button</button>
        <button className="w-24 h-12 bg-blue-500 text-slate-100 animate-spin">Spin</button>
        <button className="w-24 h-12 bg-blue-500 text-slate-100 animate-ping">Ping</button>
      </div>
    </section>
  </>
}