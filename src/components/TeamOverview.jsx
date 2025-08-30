import { Users, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function TeamOverview({ team, tasks }) {
  const tasksByAssignee = tasks.reduce((acc, t) => {
    const key = t.assigneeId || 'unassigned'
    acc[key] = acc[key] || []
    acc[key].push(t)
    return acc
  }, {})

  const totalOpen = tasks.filter(t => t.status !== 'done').length
  const unassigned = tasks.filter(t => !t.assigneeId).length

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-slate-500" />
          <h2 className="font-semibold">Team Overview</h2>
        </div>
        <div className="text-xs text-slate-500">{team.length} members</div>
      </div>

      <div className="p-4 grid grid-cols-3 gap-3 text-sm">
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-xs text-slate-500 flex items-center gap-1"><CheckCircle size={14} />Open</div>
          <div className="text-xl font-semibold">{totalOpen}</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-xs text-slate-500 flex items-center gap-1"><Clock size={14} />Unassigned</div>
          <div className="text-xl font-semibold">{unassigned}</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-xs text-slate-500 flex items-center gap-1"><AlertCircle size={14} />Capacity</div>
          <div className="text-xl font-semibold">{Math.round(team.reduce((s, u) => s + (u.assignedHours / u.capacity), 0) / team.length * 100)}%</div>
        </div>
      </div>

      <ul className="divide-y">
        {team.map(u => {
          const assigned = tasksByAssignee[u.id] || []
          const load = Math.min(100, Math.round((u.assignedHours / u.capacity) * 100))
          return (
            <li key={u.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-slate-500">{u.role}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-600">{assigned.length} tasks</div>
                  <div className="text-xs text-slate-400">{u.assignedHours}/{u.capacity}h</div>
                </div>
              </div>
              <div className="mt-2 h-2 bg-slate-100 rounded">
                <div className={`h-full rounded ${load > 85 ? 'bg-rose-500' : load > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${load}%` }} />
              </div>
              {assigned.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {assigned.slice(0, 3).map(t => (
                    <span key={t.id} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{t.title}</span>
                  ))}
                  {assigned.length > 3 && <span className="text-xs text-slate-400">+{assigned.length - 3} more</span>}
                </div>
              )}
            </li>
          )
        })}
        {(!team || team.length === 0) && (
          <li className="p-4 text-sm text-slate-500">No team members found.</li>
        )}
      </ul>
    </div>
  )
}
