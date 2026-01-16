# Room Activity Logging - Setup Guide

## Overview

Track user activity across all rooms (Planning, Future, Care, Memory, Calm) with comprehensive logging and analytics.

## What's Tracked

### Room Visits
- **When**: User enters/exits a room
- **Data**: Room name, start time, end time, duration, activities performed

### Daily Activity
- **When**: Automatically aggregated from room visits
- **Data**: Total time, rooms visited, tasks completed, goals added, journal entries, check-ins

### Statistics
- Visit counts per room
- Time spent in each room
- Most visited room
- Activity trends over time

---

## Setup Instructions

### 1. Run SQL Setup

Execute `supabase_room_logging.sql` in your Supabase SQL Editor:

```bash
# This creates:
# - room_visits table
# - daily_activity table  
# - room_statistics view
# - Automatic triggers for daily summaries
```

### 2. Import Utilities

```javascript
import { 
  startRoomVisit, 
  endRoomVisit, 
  logRoomActivity,
  updateDailyActivityCounter,
  getRoomStatistics,
  getDailyActivity
} from '../utils/roomLogging';
```

### 3. Add to Room Components

Update each room wrapper to track visits:

```javascript
// In RoomWrapper.jsx or individual room components
import { startRoomVisit, endRoomVisit } from '../utils/roomLogging';

useEffect(() => {
  // Start tracking when room loads
  const visitId = await startRoomVisit(roomId); // 'planning', 'future', etc.
  
  // End tracking when component unmounts
  return () => {
    endRoomVisit(visitId);
  };
}, [roomId]);
```

### 4. Log Activities

Track specific actions in each room:

```javascript
// When user completes a task
await logRoomActivity('task_completed', { taskId: task.id });
await updateDailyActivityCounter('task_completed');

// When user adds a goal
await logRoomActivity('goal_added', { goalText: goal.text });
await updateDailyActivityCounter('goal_added');

// When user writes journal entry
await updateDailyActivityCounter('journal_entry');

// When user completes daily check-in
await updateDailyActivityCounter('checkin_completed');
```

---

## Usage Examples

### Get Room Statistics

```javascript
// Get stats for all rooms (last 30 days)
const stats = await getRoomStatistics();
console.log(stats);
// {
//   totalVisits: 45,
//   totalTimeSeconds: 12600,
//   averageTimeSeconds: 280,
//   byRoom: {
//     planning: { visits: 15, totalSeconds: 4500, lastVisit: '2026-01-16...' },
//     future: { visits: 10, totalSeconds: 3000, lastVisit: '2026-01-15...' },
//     ...
//   }
// }

// Get stats for specific room
const planningStats = await getRoomStatistics('planning', 7); // Last 7 days
```

### Get Daily Activity

```javascript
// Today's activity
const today = await getDailyActivity();
console.log(today);
// {
//   total_time_seconds: 1800,
//   rooms_visited: ['planning', 'care', 'future'],
//   tasks_completed: 5,
//   goals_added: 2,
//   journal_entries: 1,
//   checkins_completed: 1
// }

// Specific date
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const activity = await getDailyActivity(yesterday);
```

### Get Activity History

```javascript
// Last 7 days
const history = await getActivityHistory(7);
history.forEach(day => {
  console.log(`${day.activity_date}: ${day.total_time_seconds}s in ${day.rooms_visited.length} rooms`);
});
```

---

## Analytics Dashboard Example

Create a stats component to display user activity:

```javascript
import { getRoomStatistics, getActivityHistory, formatDuration } from '../utils/roomLogging';

const ActivityDashboard = () => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      const roomStats = await getRoomStatistics(null, 30);
      const activityHistory = await getActivityHistory(7);
      setStats(roomStats);
      setHistory(activityHistory);
    };
    loadStats();
  }, []);

  return (
    <div>
      <h2>Your Activity (Last 30 Days)</h2>
      <p>Total Visits: {stats?.totalVisits}</p>
      <p>Total Time: {formatDuration(stats?.totalTimeSeconds)}</p>
      
      <h3>By Room</h3>
      {Object.entries(stats?.byRoom || {}).map(([room, data]) => (
        <div key={room}>
          <strong>{room}</strong>: {data.visits} visits, {formatDuration(data.totalSeconds)}
        </div>
      ))}
      
      <h3>Last 7 Days</h3>
      {history.map(day => (
        <div key={day.activity_date}>
          {day.activity_date}: {formatDuration(day.total_time_seconds)}
        </div>
      ))}
    </div>
  );
};
```

---

## Activity Types

Track these activities across rooms:

| Activity Type | Description | Counter Field |
|--------------|-------------|---------------|
| `task_completed` | User completed a task | `tasks_completed` |
| `goal_added` | User added a new goal | `goals_added` |
| `journal_entry` | User wrote journal entry | `journal_entries` |
| `checkin_completed` | User completed daily check-in | `checkins_completed` |

---

## Benefits

✅ **User Insights**: Understand how users engage with your app  
✅ **Progress Tracking**: See which rooms users spend time in  
✅ **Engagement Metrics**: Track daily active usage  
✅ **Personalization**: Recommend rooms based on usage patterns  
✅ **Streak Tracking**: Build on activity data for gamification

---

## Next Steps

1. Run `supabase_room_logging.sql` in Supabase
2. Add `startRoomVisit`/`endRoomVisit` to room components
3. Add `logRoomActivity` calls for user actions
4. Create analytics dashboard to display stats
5. Use data for insights and recommendations
