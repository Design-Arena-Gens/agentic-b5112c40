'use client'

import { useState, useEffect } from 'react'

interface Habit {
  id: string
  name: string
  completedDates: string[]
  createdAt: string
}

const motivationalQuotes = [
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Success is nothing more than a few simple disciplines, practiced every day.", author: "Jim Rohn" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "We must all suffer one of two things: the pain of discipline or the pain of regret.", author: "Jim Rohn" },
  { text: "Discipline is doing what needs to be done, even when you don't want to do it.", author: "Unknown" },
  { text: "The pain of discipline is far less than the pain of regret.", author: "Sarah Bombell" },
  { text: "Motivation gets you going, but discipline keeps you growing.", author: "John C. Maxwell" },
]

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabitName, setNewHabitName] = useState('')
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0])

  useEffect(() => {
    const stored = localStorage.getItem('discipline-habits')
    if (stored) {
      setHabits(JSON.parse(stored))
    }

    setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])
  }, [])

  useEffect(() => {
    localStorage.setItem('discipline-habits', JSON.stringify(habits))
  }, [habits])

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHabitName.trim()) return

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      completedDates: [],
      createdAt: new Date().toISOString(),
    }

    setHabits([...habits, newHabit])
    setNewHabitName('')
  }

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id))
  }

  const toggleHabitToday = (id: string) => {
    const today = new Date().toISOString().split('T')[0]
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const isCompleted = habit.completedDates.includes(today)
        return {
          ...habit,
          completedDates: isCompleted
            ? habit.completedDates.filter(d => d !== today)
            : [...habit.completedDates, today]
        }
      }
      return habit
    }))
  }

  const calculateStreak = (completedDates: string[]) => {
    if (completedDates.length === 0) return 0

    const sortedDates = [...completedDates].sort().reverse()
    let streak = 0
    let currentDate = new Date()

    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(currentDate)
      checkDate.setHours(0, 0, 0, 0)
      const completedDate = new Date(sortedDates[i])
      completedDate.setHours(0, 0, 0, 0)

      if (checkDate.getTime() === completedDate.getTime()) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  const getTodayCompletionRate = () => {
    if (habits.length === 0) return 0
    const today = new Date().toISOString().split('T')[0]
    const completed = habits.filter(h => h.completedDates.includes(today)).length
    return Math.round((completed / habits.length) * 100)
  }

  const getTotalCompletions = () => {
    return habits.reduce((sum, habit) => sum + habit.completedDates.length, 0)
  }

  const getLongestStreak = () => {
    if (habits.length === 0) return 0
    return Math.max(...habits.map(h => calculateStreak(h.completedDates)), 0)
  }

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0]
    return habit.completedDates.includes(today)
  }

  const getLast7Days = (habit: Habit) => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      days.push({
        date: dateStr,
        completed: habit.completedDates.includes(dateStr)
      })
    }
    return days
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🎯 Discipline Dashboard</h1>
        <p>Build habits. Track progress. Stay disciplined.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Progress</h3>
          <div className="value">{getTodayCompletionRate()}%</div>
        </div>
        <div className="stat-card">
          <h3>Active Habits</h3>
          <div className="value">{habits.length}</div>
        </div>
        <div className="stat-card">
          <h3>Total Completions</h3>
          <div className="value">{getTotalCompletions()}</div>
        </div>
        <div className="stat-card">
          <h3>Longest Streak</h3>
          <div className="value">{getLongestStreak()}🔥</div>
        </div>
      </div>

      <div className="habits-section">
        <div className="section-header">
          <h2>Daily Habits</h2>
        </div>

        <form onSubmit={addHabit} className="add-habit-form">
          <input
            type="text"
            placeholder="Add a new habit (e.g., Exercise, Read, Meditate)"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Add Habit</button>
        </form>

        {habits.length === 0 ? (
          <div className="empty-state">
            <p>No habits yet. Start building your discipline by adding your first habit!</p>
          </div>
        ) : (
          <div className="habits-list">
            {habits.map(habit => (
              <div key={habit.id} className="habit-item">
                <div className="habit-info">
                  <input
                    type="checkbox"
                    className="habit-checkbox"
                    checked={isCompletedToday(habit)}
                    onChange={() => toggleHabitToday(habit.id)}
                  />
                  <span className="habit-name">{habit.name}</span>
                </div>

                <div className="habit-streak">
                  <div className="calendar-grid">
                    {getLast7Days(habit).map((day, idx) => (
                      <div
                        key={idx}
                        className={`calendar-day ${day.completed ? 'completed' : ''}`}
                        title={day.date}
                      />
                    ))}
                  </div>

                  {calculateStreak(habit.completedDates) > 0 && (
                    <span className="streak-badge">
                      {calculateStreak(habit.completedDates)} day streak 🔥
                    </span>
                  )}

                  <button
                    className="btn btn-danger"
                    onClick={() => deleteHabit(habit.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="quotes-section">
        <div className="quote">"{currentQuote.text}"</div>
        <div className="quote-author">— {currentQuote.author}</div>
      </div>
    </div>
  )
}
