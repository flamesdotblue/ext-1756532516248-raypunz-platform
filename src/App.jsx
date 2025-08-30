import { useMemo, useState } from 'react'
import Header from './components/Header'
import TeamOverview from './components/TeamOverview'
import TaskBoard from './components/TaskBoard'
import Scheduler from './components/Scheduler'

function App() {
  const [team, setTeam] = useState([
    { id: 'u1', name: 'Alex Chen', role: 'Ops Lead', capacity: 8, assignedHours: 2, skills: ['coordination', 'scheduling'] },
    { id: 'u2', name: 'Priya Singh', role: 'HR Generalist', capacity: 7, assignedHours: 3, skills: ['onboarding', 'benefits'] },
    { id: 'u3', name: 'Marta Gomez', role: 'Recruiter', capacity: 7, assignedHours: 1, skills: ['sourcing', 'interviews'] },
    { id: 'u4', name: 'Jordan Lee', role: 'Ops Associate', capacity: 8, assignedHours: 4, skills: ['logistics', 'inventory'] },
  ])

  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Onboard 3 new hires', hours: 3, skill: 'onboarding', status: 'todo', assigneeId: null, due: '2025-09-01', priority: 'High' },
    { id: 't2', title: 'September shift plan', hours: 2, skill: 'scheduling', status: 'in-progress', assigneeId: 'u1', due: '2025-09-02', priority: 'Medium' },
    { id: 't3', title: 'Phone screen candidates', hours: 2, skill: 'interviews', status: 'todo', assigneeId: null, due: '2025-09-03', priority: 'High' },
    { id: 't4', title: 'Inventory count', hours: 2, skill: 'inventory', status: 'todo', assigneeId: 'u4', due: '2025-09-01', priority: 'Low' },
  ])

  const [schedule, setSchedule] = useState({
    // week days: Mon-Sun
    u1: { Mon: ['Shift A (9-1)'], Tue: ['Planning'], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] },
    u2: { Mon: ['Onboarding Prep'], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] },
    u3: { Mon: [], Tue: ['Sourcing'], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] },
    u4: { Mon: ['Warehouse (10-2)'], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] },
  })

  const unassignedTasks = useMemo(() => tasks.filter(t => !t.assigneeId), [tasks])

  const assignTask = (taskId, assigneeId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assigneeId, status: t.status === 'todo' ? 'in-progress' : t.status } : t))
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    setTeam(prev => prev.map(u => u.id === assigneeId ? { ...u, assignedHours: Math.min(u.capacity, u.assignedHours + (task.hours || 1)) } : u))
  }

  const updateTaskStatus = (taskId, status) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t))
  }

  const addTask = (payload) => {
    const id = `t${Math.random().toString(36).slice(2, 8)}`
    setTasks(prev => [{ id, ...payload }, ...prev])
  }

  const autoAssignAI = () => {
    // simple heuristic: prefer skill match, then lowest load
    setTasks(prev => {
      const updated = [...prev]
      const teamSnapshot = [...team]
      for (let task of updated) {
        if (task.assigneeId) continue
        let candidates = teamSnapshot
          .map(u => ({
            u,
            score: (u.skills.includes(task.skill) ? 2 : 0) + Math.max(0, u.capacity - u.assignedHours),
          }))
          .sort((a, b) => b.score - a.score)
        const best = candidates[0]?.u
        if (best) {
          task.assigneeId = best.id
          task.status = 'in-progress'
          best.assignedHours = Math.min(best.capacity, best.assignedHours + (task.hours || 1))
        }
      }
      setTeam(teamSnapshot)
      return updated
    })
  }

  const autoScheduleAI = () => {
    // naive: place each in-progress task onto nearest empty slot for assignee
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    const nextSchedule = { ...schedule }
    const inProgress = tasks.filter(t => t.assigneeId && (t.status === 'in-progress' || t.status === 'todo'))
    for (const t of inProgress) {
      const assigneeDays = nextSchedule[t.assigneeId] || { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] }
      let placed = false
      for (const d of days) {
        if ((assigneeDays[d] || []).length < 3) {
          assigneeDays[d] = [...(assigneeDays[d] || []), `${t.title} (${t.hours}h)`]
          placed = true
          break
        }
      }
      nextSchedule[t.assigneeId] = assigneeDays
      if (!placed) {
        // push to Fri if all full
        assigneeDays['Fri'] = [...(assigneeDays['Fri'] || []), `${t.title} (${t.hours}h)`]
      }
    }
    setSchedule({ ...nextSchedule })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <Header onAutoAssign={autoAssignAI} onAutoSchedule={autoScheduleAI} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <div className="lg:col-span-1">
            <TeamOverview team={team} tasks={tasks} />
          </div>
          <div className="lg:col-span-3">
            <TaskBoard
              team={team}
              tasks={tasks}
              onAssign={assignTask}
              onUpdateStatus={updateTaskStatus}
              onAddTask={addTask}
            />
          </div>
        </div>
        <div className="mt-10">
          <Scheduler team={team} schedule={schedule} setSchedule={setSchedule} />
        </div>
      </main>
    </div>
  )
}

export default App
