import { Calendar } from 'lucide-react'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export default function Scheduler({ team, schedule, setSchedule }) {
  const addSlot = (userId, day) => {
    const label = prompt('Add schedule item (e.g., Shift B 1-5 or Task)')
    if (!label) return
    setSchedule(prev => ({
      ...prev,
      [userId]: {
        ...(prev[userId] || {}),
        [day]: [ ...(prev[userId]?.[day] || []), label ]
      }
    }))
  }

  const removeSlot = (userId, day, idx) => {
    setSchedule(prev => ({
      ...prev,
      [userId]: {
        ...(prev[userId] || {}),
        [day]: (prev[userId]?.[day] || []).filter((_, i) => i !== idx)
      }
    }))
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-slate-500" />
          <h2 className="font-semibold">Weekly Schedule</h2>
        </div>
        <div className="text-xs text-slate-500">Drag and drop coming soon</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider p-3 border-b bg-slate-50">Member</th>
              {days.map(d => (
                <th key={d} className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider p-3 border-b bg-slate-50">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {team.map(u => (
              <tr key={u.id} className="border-b">
                <td className="p-3 align-top">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-slate-500">{u.role}</div>
                </td>
                {days.map(d => (
                  <td key={d} className="p-3 align-top">
                    <div className="flex flex-col gap-2">
                      {(schedule[u.id]?.[d] || []).map((s, idx) => (
                        <div key={idx} className="text-xs bg-slate-100 rounded px-2 py-1 flex items-center justify-between">
                          <span>{s}</span>
                          <button onClick={() => removeSlot(u.id, d, idx)} className="text-slate-400 hover:text-rose-600">×</button>
                        </div>
                      ))}
                      <button onClick={() => addSlot(u.id, d)} className="text-xs text-slate-500 hover:text-slate-700 text-left">+ add</button>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
