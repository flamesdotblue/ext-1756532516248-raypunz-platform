import { useMemo, useState } from 'react'
import { ListChecks, Plus, Brain } from 'lucide-react'

function StatusBadge({ status }) {
  const map = {
    'todo': 'bg-slate-100 text-slate-700',
    'in-progress': 'bg-amber-100 text-amber-800',
    'done': 'bg-emerald-100 text-emerald-800'
  }
  return <span className={`text-xs px-2 py-1 rounded ${map[status] || 'bg-slate-100 text-slate-700'}`}>{status}</span>
}

export default function TaskBoard({ team, tasks, onAssign, onUpdateStatus, onAddTask }) {
  const [newTask, setNewTask] = useState({ title: '', hours: 2, skill: 'coordination', due: '', priority: 'Medium' })

  const grouped = useMemo(() => ({
    todo: tasks.filter(t => t.status === 'todo'),
    inProgress: tasks.filter(t => t.status === 'in-progress'),
    done: tasks.filter(t => t.status === 'done'),
  }), [tasks])

  const createTask = () => {
    if (!newTask.title) return
    onAddTask({ ...newTask, status: 'todo', assigneeId: null, id: undefined })
    setNewTask({ title: '', hours: 2, skill: 'coordination', due: '', priority: 'Medium' })
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks size={18} className="text-slate-500" />
          <h2 className="font-semibold">Tasks</h2>
        </div>
        <div className="text-xs text-slate-500">Manage work assignments</div>
      </div>

      <div className="p-4 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-3 bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="grid sm:grid-cols-5 gap-2">
            <input value={newTask.title} onChange={e => setNewTask(s => ({ ...s, title: e.target.value }))} placeholder="Task title" className="sm:col-span-2 w-full px-3 py-2 border rounded bg-white" />
            <input type="number" min={1} max={8} value={newTask.hours} onChange={e => setNewTask(s => ({ ...s, hours: parseInt(e.target.value || '1') }))} className="w-full px-3 py-2 border rounded bg-white" />
            <select value={newTask.skill} onChange={e => setNewTask(s => ({ ...s, skill: e.target.value }))} className="w-full px-3 py-2 border rounded bg-white">
              <option value="coordination">coordination</option>
              <option value="scheduling">scheduling</option>
              <option value="onboarding">onboarding</option>
              <option value="benefits">benefits</option>
              <option value="sourcing">sourcing</option>
              <option value="interviews">interviews</option>
              <option value="logistics">logistics</option>
              <option value="inventory">inventory</option>
            </select>
            <input value={newTask.due} onChange={e => setNewTask(s => ({ ...s, due: e.target.value }))} type="date" className="w-full px-3 py-2 border rounded bg-white" />
            <select value={newTask.priority} onChange={e => setNewTask(s => ({ ...s, priority: e.target.value }))} className="w-full px-3 py-2 border rounded bg-white">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={createTask} className="inline-flex items-center gap-2 rounded-md bg-slate-900 text-white px-3 py-2 text-sm hover:bg-slate-800">
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </div>

        <Column title="To Do" items={grouped.todo} team={team} onAssign={onAssign} onUpdateStatus={onUpdateStatus} />
        <Column title="In Progress" items={grouped.inProgress} team={team} onAssign={onAssign} onUpdateStatus={onUpdateStatus} />
        <Column title="Done" items={grouped.done} team={team} onAssign={onAssign} onUpdateStatus={onUpdateStatus} />
      </div>

      {/* Insight */}
      <div className="px-4 pb-4">
        <div className="rounded-lg border bg-gradient-to-r from-indigo-50 to-sky-50 p-4 flex items-start gap-3">
          <div className="p-2 rounded bg-indigo-600 text-white"><Brain size={18} /></div>
          <div className="text-sm">
            <div className="font-medium">AI Tip</div>
            <div className="text-slate-600">Use AI Assign to optimally distribute based on skill match and remaining capacity.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Column({ title, items, team, onAssign, onUpdateStatus }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-700">{title} <span className="text-slate-400 font-normal">({items.length})</span></h3>
      </div>
      <div className="space-y-3">
        {items.map(t => (
          <TaskCard key={t.id} task={t} team={team} onAssign={onAssign} onUpdateStatus={onUpdateStatus} />
        ))}
        {items.length === 0 && (
          <div className="text-xs text-slate-500 bg-slate-50 border rounded p-3">Nothing here.</div>
        )}
      </div>
    </div>
  )
}

function TaskCard({ task, team, onAssign, onUpdateStatus }) {
  return (
    <div className="border rounded-lg p-3 hover:shadow-sm transition bg-white">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium">{task.title}</div>
          <div className="text-xs text-slate-500">{task.hours}h • {task.skill} • due {task.due || '—'}</div>
        </div>
        <StatusBadge status={task.status} />
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm">
        <select value={task.assigneeId || ''} onChange={(e) => onAssign(task.id, e.target.value)} className="px-2 py-1 border rounded bg-white">
          <option value="">Unassigned</option>
          {team.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <select value={task.status} onChange={(e) => onUpdateStatus(task.id, e.target.value)} className="px-2 py-1 border rounded bg-white">
          <option value="todo">todo</option>
          <option value="in-progress">in-progress</option>
          <option value="done">done</option>
        </select>
        <span className={`ml-auto text-xs px-2 py-0.5 rounded ${task.priority === 'High' ? 'bg-rose-100 text-rose-700' : task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{task.priority}</span>
      </div>
    </div>
  )
}
