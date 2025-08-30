import { Calendar, ListChecks, Users, Brain, Settings, Search } from 'lucide-react'

export default function Header({ onAutoAssign, onAutoSchedule }) {
  return (
    <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow">
            <Brain size={18} />
          </div>
          <div>
            <div className="text-sm uppercase tracking-widest text-slate-500">Manager Console</div>
            <h1 className="text-base sm:text-lg font-semibold text-slate-900">HR + Operations</h1>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-6 hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="w-full pl-10 pr-3 py-2 rounded-md bg-slate-100/60 focus:bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Search people, tasks, schedules"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onAutoAssign} className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-3 py-2 text-sm hover:bg-slate-800">
            <ListChecks size={16} />
            AI Assign
          </button>
          <button onClick={onAutoSchedule} className="inline-flex items-center gap-2 rounded-md bg-white border px-3 py-2 text-sm hover:bg-slate-50">
            <Calendar size={16} />
            AI Schedule
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-white border px-3 py-2 text-sm hover:bg-slate-50">
            <Users size={16} />
            Team
          </button>
          <button className="p-2 rounded-md hover:bg-slate-100">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
