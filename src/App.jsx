
import { useEffect, useState } from "react";
import "./App.css";

const names = [
  "Design website homepage", "Create login page", "Develop dashboard",
  "Prepare project report", "Design database schema", "Build registration form",
  "Test application features", "Fix responsive layout", "Create user profile page",
  "Develop search functionality", "Design mobile interface", "Create admin dashboard",
  "Implement task filters", "Prepare presentation slides", "Test user authentication",
  "Build contact page", "Create project documentation", "Improve website performance",
  "Design navigation menu", "Fix validation errors", "Develop notification system",
  "Create settings page", "Update application styling", "Build reporting module",
  "Test database connections", "Create landing page", "Develop API integration",
  "Design project timeline", "Implement data backup", "Create help section",
  "Build file upload feature", "Review security settings", "Improve accessibility",
  "Create feedback form", "Develop user management", "Test mobile responsiveness",
  "Update project requirements", "Create analytics page", "Optimize database queries",
  "Build notification panel", "Design task management table", "Implement sorting options",
  "Create export functionality", "Test error handling", "Prepare final documentation",
  "Review project progress", "Fix interface bugs", "Complete integration testing",
  "Prepare final demonstration", "Publish project website"
];

const sampleTasks = names.map((name, i) => ({
  id: i + 1,
  name,
  priority: ["Top Priority", "Medium Priority", "Low Priority"][i % 3],
  deadline: `2026-10-${String(20 + (i % 12)).padStart(2, "0")}`,
  done: i >= 45
}));

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");
      const seeded = localStorage.getItem("tasks-demo-seeded");
      if (!seeded) {
        localStorage.setItem("tasks-demo-seeded", "yes");
        if (!saved || JSON.parse(saved).length === 0) return sampleTasks;
      }
      return saved === null ? sampleTasks : JSON.parse(saved);
    } catch {
      return sampleTasks;
    }
  });

  const [name, setName] = useState("");
  const [priority, setPriority] = useState("Top Priority");
  const [deadline, setDeadline] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setTasks(old => [{
      id: Date.now(), name: name.trim(), priority, deadline, done: false
    }, ...old]);
    setName("");
    setPriority("Top Priority");
    setDeadline("");
  }

  const visible = tasks.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) &&
    (filter === "All" || t.priority === filter)
  );

  function toggle(id) {
    setTasks(old => old.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  }

  function remove(id) {
    setTasks(old => old.filter(t => t.id !== id));
  }

  const upcoming = visible.filter(t => !t.done);
  const completed = visible.filter(t => t.done);

  function taskTable(items, isCompleted) {
    return (
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Priority</th>
              <th>Deadline</th>
              {isCompleted || <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {items.map(t => (
              <tr key={t.id}>
                <td className={t.done ? "finished" : ""}>{t.name}</td>
                <td><span className={"priority " + (
                  t.priority === "Top Priority" ? "high" :
                  t.priority === "Medium Priority" ? "medium" : "low"
                )}>{t.priority}</span></td>
                <td>{t.deadline || "—"}</td>
                {!isCompleted && (
                  <td className="actions">
                    <button className="complete" onClick={() => toggle(t.id)}>
                      Complete
                    </button>
                    <button className="delete" onClick={() => remove(t.id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {!items.length && (
              <tr><td colSpan={isCompleted ? 3 : 4} className="empty">
                No tasks to display
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <main className="container">
      <h1>Task Management</h1>

      <form className="add-form" onSubmit={addTask}>
        <input className="task-input" placeholder="Enter task..."
          value={name} onChange={e => setName(e.target.value)} required />
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option>Top Priority</option>
          <option>Medium Priority</option>
          <option>Low Priority</option>
        </select>
        <input type="date" value={deadline}
          onChange={e => setDeadline(e.target.value)} />
        <button type="submit">Add Task</button>
      </form>

      <div className="filters">
        <input placeholder="Search tasks" value={search}
          onChange={e => setSearch(e.target.value)} />
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All">All Priorities</option>
          <option>Top Priority</option>
          <option>Medium Priority</option>
          <option>Low Priority</option>
        </select>
      </div>
      <h2>Upcoming Tasks <span>{upcoming.length}</span></h2>
      {taskTable(upcoming, false)}
      <h2>Completed Tasks <span>{completed.length}</span></h2>
      {taskTable(completed, true)}
      <footer>MY TASK MANAGER <span>{tasks.length} TOTAL TASKS</span></footer>
    </main>
  );
}
