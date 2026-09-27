import { useEffect, useState } from "react";
import { getWorkspaceTasks, createWorkspaceTask, updateWorkspaceTask, deleteWorkspaceTask,  getWorkspaceTaskSuggestions} from "../services/workspaceTask.services";
import EditWorkspaceTask from "./EditWorkspaceTask";
// import WorkspaceDetailsPage from "../pages/WorkspaceDetailsPage";


function WorkspaceTasks({ workspaceId, onTasksChange }) {

    const [tasks, setTasks] = useState([]);
    const [ loading, setLoading] = useState(true);
    const [ errorMessage, setErrorMessage ] = useState("")

    const [title, setTitle ] = useState("");
    const [ creating, setCreating ] = useState(false);
    const [ dueDate, setDueDate ] = useState("");
    const [ createError, setCreateError ] = useState("");

    const [ updatingTaskId, setUpdatingTaskId ] = useState(null);
    const [ updateError, setUpdateError ] = useState("");

    const [editingTaskId, setEditingTaskId] = useState(null);

    const [ deletingTaskId, setDeletingTaskId ] = useState(null);
    const [ deleteError, setDeleteError] = useState("");

    const [ suggestions, setSuggestions] = useState([]);
    const [ suggesting, setSuggesting ] = useState(false);
    const [ suggestionError, setSuggestionError ] = useState("");

    useEffect(() => {
        let active = true;

        const fetchTasks = async () => {
            setLoading(true);
            setErrorMessage("");

            try {
                const response = await getWorkspaceTasks(workspaceId);

                if(active) {
                    setTasks(response.data);
                }
            } catch (error) {
                if(active) {
                    setErrorMessage(error.response?.data?.message || "Unable to load tasks.");
                }
            } finally {
            if (active) {
                setLoading(false);
                }
            }
        };

        fetchTasks();

        return () => {
            active = false;
        };
    }, [workspaceId]);

    useEffect(() => {
        if(loading || errorMessage) {
            onTasksChange?.(null);
            return;
        }

        onTasksChange?.(tasks);
    }, [tasks, loading, errorMessage, onTasksChange])

    const handleCreateTask = async (event) => {
        event.preventDefault();

        if(creating || !title.trim()) 
            return;

        setCreating(true);
        setCreateError("");

        try {
            const response = await createWorkspaceTask(workspaceId, {title: title.trim(),
                dueDate: dueDate || null,
            });

            setTasks((previousTasks) => [ response.data, ...previousTasks,
            ])

            setTitle("");
            setDueDate("");
        } catch (error) {
            setCreateError(
                error.response?.data?.message || "Unable to create task. Please try again."
            );
        } finally {
            setCreating(false);
        }
    };

    const handleTaskSaved = (updatedTask) => {
        setTasks((previousTasks) => previousTasks.map((task) => task._id === updatedTask._id ? updatedTask : task));

        setEditingTaskId(null);
    };

    if(loading) {
        return <p>Loading tasks...</p>;
    }

    if (errorMessage) {
        return <p role="alert">{errorMessage}</p>;
    }

    const statusLabels = {
        todo: "To do",
        in_progress: "In progress",
        done: "Done",
    };

    const handleStatusChange = async (taskId, status) => {
        if(updatingTaskId) return;

        setUpdatingTaskId(taskId);
        setUpdateError("");

        try {
            const response = await updateWorkspaceTask( workspaceId, taskId, { status });

            setTasks((previousTasks) => previousTasks.map((task) => task._id === taskId ? response.data : task))
        } catch (error) {
            setUpdateError(error.response?.data?.message || "Unable to update task status.");
        } finally {
            setUpdatingTaskId(null);
        }
    };

    const handleDeleteTask = async (task) => {
        if(deletingTaskId !== null || updatingTaskId !== null || editingTaskId !== null) return;

        const confirmed = window.confirm(`Delete "${task.title}"? This cannot be undone.`);

        if(!confirmed) return;

        setDeletingTaskId(task._id)
        setDeleteError("");

        try {
            await deleteWorkspaceTask(workspaceId, task._id);

            setTasks((previousTasks) => previousTasks.filter((existingTask) => existingTask._id !== task._id));
        } catch (error) {
            setDeleteError(error.response?.data?.message || "Unable to delete task. Please try again.")
        } finally {
            setDeletingTaskId(null);
        }
    }

    const handleGenerateSuggestions = async () => {
        if(suggesting) return;
        setSuggesting(true);
        setSuggestionError("");

        try {
            const response = await getWorkspaceTaskSuggestions(workspaceId);

            setSuggestions(response.data.suggestions);
        } catch (error) {
            setSuggestionError(error.response?.data?.message || "Unable to generate suggestions. Please try again.");
        } finally {
            setSuggesting(false);
        }
    };

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter((task) => task.status === "done").length;

    //TODAY'S CALENDER DATE IN THE USER'S LOCAL TIMEZONE.

    const now = new Date();
    const today = [now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
    ].join("-");

    const overDueTasks = tasks.filter((task) => task.status !== "done" && task.dueDate && task.dueDate.slice(0, 10) < today).length;

    const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const madridDateParts = new Intl.DateTimeFormat("en", {
        timeZone: "Europe/Madrid",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const getMadridPart = (type) => madridDateParts.find((part) => part.type === type).value;

    const minimumDeadline = `${getMadridPart("year")}-${getMadridPart("month")}-${getMadridPart("day")}`;


    return (
        <section className="workspace-tasks">
            <h2>Validation tasks</h2>
            <p>Track your next steps and record what you learn.</p>


            <div>
                <dl className="ws-task-stats">
                    <div>
                        <dt>Total tasks</dt>
                        <dd>{totalTasks}</dd>
                    </div>

                    <div>
                        <dt>Completed</dt>
                        <dd>{completedTasks}</dd>
                    </div>

                    <div>
                        <dt>Overdue</dt>
                        <dd>{overDueTasks}</dd>
                    </div>
                </dl>

                <label htmlFor={`task-progress-${workspaceId}`}>Task completion: {completionPercentage}%</label>

                <progress 
                    id={`task-progress-${workspaceId}`}
                    value={completedTasks}
                    max={totalTasks || 1}
                />

                <p>Completed tasks track your activity. Customer evidence helps you assess wether the business idea works.</p>
            </div>

            {createError && (
                <p role="alert">{createError}</p>
            )}

            <form onSubmit={handleCreateTask}>
                <div>
                    <label htmlFor={`task-title-${workspaceId}`}>
                        Task title
                    </label>

                    <input
                    id={`task-title-${workspaceId}`}
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Interview five potential customers"
                    maxLength={200}
                    disabled={creating}
                    required
                    />
                </div>

                <div>
                    <label htmlFor={`task-deadline-${workspaceId}`}>Deadline (optional)</label>

                    <input
                        id={`task-deadline-${workspaceId}`}
                        type="date"
                        value={dueDate}
                        onChange={(event) => setDueDate(event.target.value)}
                        disabled={creating}
                        min={minimumDeadline}
                    />
                </div>

                <button type="Submit" disabled={creating || !title.trim()}>
                    {creating ? "Creating..." : "Create Task"}
                </button>
            </form>

            {updateError && (
                <p role="alert">{updateError}</p>
            )}

            {/* <div className="workspace-task-suggestion">
                <h3>Suggested next steps</h3>

                <button type="button" onClick={handleGenerateSuggestions} disabled={suggesting}>
                    {suggesting ? "Generating..." : "Suggest task with AI"}
                </button>

                {suggestionError && (<p role="alert">{suggestionError}</p>)}

                {suggestions.map((suggestion, index) => (
                    <article key={`${suggestion.title}-${index}`} className="workspace-task">
                        <h4>{suggestion.title}</h4>
                        <p>{suggestion.reason}</p>
                    </article>
                ))}
            </div> */}

            {deleteError && (<p role="alert">{deleteError}</p>)}

            {tasks.length === 0 ? (
                <p>No tasks yet.</p>
            ) : (
                tasks.map((task) => (
                    <article key={task._id} className="workspace-task">
                        <h3>{task.title}</h3>

                        <span className={`ws-status ws-status-${task.status}`}>{statusLabels[task.status]}</span>

                        <label htmlFor={`task-status-${task._id}`}> Change status</label>

                        <select 
                        id={`task-status-${task._id}`}
                        value={task.status}
                        onChange={(event) => handleStatusChange(task._id, event.target.value)}
                        disabled={updatingTaskId !== null || editingTaskId !== null}
                        >

                        <option value="todo">To do</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                        </select>

                        {updatingTaskId === task._id && (<p role="status">Saving status...</p>)}

                        <p>Deadline:{""} {task.dueDate ? task.dueDate.slice(0, 10) : "Not set"}</p>

                        <p style={{ whiteSpace: "pre-wrap"}}>Evidence: {task.evidence || "No evidence recorded yet."}</p>

                        {editingTaskId === task._id ? (
                            <EditWorkspaceTask
                                key={task._id}
                                workspaceId={workspaceId}
                                task={task}
                                onSave={handleTaskSaved}
                                onCancel={() => setEditingTaskId(null)}
                            />
                        ) : (
                            <button type="button" onClick={() => setEditingTaskId(task._id)} disabled={editingTaskId !== null || updatingTaskId !== null || deletingTaskId !== null}>Edit task</button>
                        )}

                        <button type="button" onClick={() => handleDeleteTask(task)} disabled={deletingTaskId !== null || updatingTaskId !== null || editingTaskId !== null}>
                            {deletingTaskId === task._id ? "Deleting" : "Delete Task"}
                        </button>
                    </article>
                ))
            )}
        </section>
    )
}

export default WorkspaceTasks;