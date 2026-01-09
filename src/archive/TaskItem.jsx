// Task Item Component
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getContextualEncouragement } from '../utils/encouragement';
import './TaskList.css';

const TaskItem = ({ task }) => {
    const { completeTask, uncompleteTask, postponeTask, skipTask, editTask } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    const handleComplete = () => {
        if (task.completed) {
            uncompleteTask(task.id);
        } else {
            completeTask(task.id);
            setMessage(getContextualEncouragement('complete'));
            setShowMessage(true);
            setIsAnimating(true);

            setTimeout(() => {
                setShowMessage(false);
                setIsAnimating(false);
            }, 2000);
        }
    };

    const handlePostpone = () => {
        setMessage(getContextualEncouragement('postpone'));
        setShowMessage(true);

        setTimeout(() => {
            postponeTask(task.id);
        }, 1500);
    };

    const handleSkip = () => {
        setMessage(getContextualEncouragement('skip'));
        setShowMessage(true);

        setTimeout(() => {
            skipTask(task.id);
        }, 1500);
    };

    const handleEdit = () => {
        if (isEditing && editText.trim() !== task.text) {
            editTask(task.id, editText.trim());
        }
        setIsEditing(!isEditing);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleEdit();
        } else if (e.key === 'Escape') {
            setEditText(task.text);
            setIsEditing(false);
        }
    };

    return (
        <div className={`task-item ${task.completed ? 'task-completed' : ''} ${isAnimating ? 'bloom' : ''}`}>
            <div className="task-main">
                <label className="checkbox-wrapper">
                    <input
                        type="checkbox"
                        className="checkbox"
                        checked={task.completed}
                        onChange={handleComplete}
                    />
                </label>

                {isEditing ? (
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleEdit}
                        onKeyDown={handleKeyDown}
                        className="task-edit-input"
                        autoFocus
                    />
                ) : (
                    <span
                        className="task-text"
                        onDoubleClick={() => !task.completed && setIsEditing(true)}
                    >
                        {task.text}
                    </span>
                )}
            </div>

            {!task.completed && (
                <div className="task-actions">
                    <button
                        className="task-action-btn task-postpone"
                        onClick={handlePostpone}
                        title="Postpone to tomorrow"
                    >
                        Tomorrow
                    </button>
                    <button
                        className="task-action-btn task-skip"
                        onClick={handleSkip}
                        title="Skip this task"
                    >
                        Skip
                    </button>
                </div>
            )}

            {showMessage && (
                <div className="task-message gentle-fade-in">
                    {message}
                </div>
            )}
        </div>
    );
};

export default TaskItem;
