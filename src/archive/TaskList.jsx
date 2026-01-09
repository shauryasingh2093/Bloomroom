// Task List Component
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import TaskItem from './TaskItem';
import Input from './Input';
import Button from './Button';
import './TaskList.css';

const TaskList = () => {
    const { getTodaysTasks, addTask, getTodaysCompletedCount } = useApp();
    const [newTask, setNewTask] = useState('');

    const todaysTasks = getTodaysTasks();
    const completedCount = getTodaysCompletedCount();
    const totalCount = todaysTasks.length;

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTask.trim()) {
            addTask(newTask.trim());
            setNewTask('');
        }
    };

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <h3>Today's Tasks</h3>
                {totalCount > 0 && (
                    <span className="task-count">
                        {completedCount} of {totalCount} complete
                    </span>
                )}
            </div>

            <form onSubmit={handleAddTask} className="task-add-form">
                <Input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="What's one small thing you want to do today?"
                    className="task-input"
                />
                <Button type="submit" variant="primary" disabled={!newTask.trim()}>
                    Add
                </Button>
            </form>

            {todaysTasks.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🌸</div>
                    <p className="empty-state-text">No tasks yet</p>
                    <p className="empty-state-subtext">What would make today feel okay?</p>
                </div>
            ) : (
                <div className="task-list stagger-children">
                    {todaysTasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>
            )}

            {completedCount > 0 && completedCount === totalCount && (
                <div className="task-celebration bloom">
                    <span className="celebration-icon">✨</span>
                    <p>You did it! All tasks complete.</p>
                    <p className="celebration-subtext">You showed up today 🌸</p>
                </div>
            )}
        </div>
    );
};

export default TaskList;
