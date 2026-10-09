import { useLanguage } from "../context/languageStore";
import { useParams, Link, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import { getWorkspace, deleteWorkspace, updateWorkspace } from "../services/workspace.services";
import WorkspaceChat from "../components/WorkspaceChat";
import WorkspaceTasks from "../components/WorkspaceTasks";
import WorkspaceValidation from "../components/WorkspaceValidation";

function WorkspaceDetailsPage() {
  const {t , tError, formatDate, formatNumber } = useLanguage();


    const { workspaceId } = useParams();
    const nav = useNavigate();

    const [deleting, setDeleting] = useState(false);
    const [ deleteError, setDeleteError ] = useState("");

    const [ workspace, setWorkspace ] = useState(null);
    const [ loading, setLoading ] = useState(true)
    const [ errorMessage, setErrorMessage ] = useState("");

    const [ dashboardTasks, setDashboardTasks ] = useState(null);

    const [ savingStage, setSavingStage]  = useState(false);
    const [ stageError, setStageError ] = useState("");

    useEffect(() => {
        let active = true;

        const fetchWorkspace = async () => {
            setLoading(true);
            setErrorMessage("");

            try {
                const response = await getWorkspace(workspaceId);

                if(active) {
                    setWorkspace(response.data);
                }
            } catch (error) {
                if(active) {
                    setErrorMessage(
                        error.response?.status === 404 ? "Workspace not found." : "Unable to load your business."
                    );
                }
            } finally {
                if(active) {
                    setLoading(false);
                } 
            }
        };

        fetchWorkspace();
        
        return () => {
            active = false;
        };
    }, [workspaceId])

    if (loading) {
        return <p>{t("Loading your business…")}</p>;
    }

    if (errorMessage) {
        return (
            <main>
                <p role="alert">{tError(errorMessage)}</p>
                <Link to="/workspaces">{t("Back to My Businesses")}</Link>
            </main>
        );
    }

    if (!workspace) {
        return <p>{t("Workspace not found.")}</p>;
    }

    const handleDelete = async () => {
        if (deleting) return;

        const confirmed = window.confirm(
            t("Delete this business workspace? This cannot be undone.")
        );

        if (!confirmed) return;
        
        setDeleteError("");
        setDeleting(true);

        try {
            await deleteWorkspace(workspaceId)

            nav("/workspaces", { replace: true})
        } catch (error) {
            setDeleteError(
                error.response?.data?.message || "Unable to delete your business. Please try again."
            )
        } finally {
            setDeleting(false);
        }
    };

    const tasks = dashboardTasks ?? [];

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter((task) => task.status === "done").length;

    const dateParts = new Intl.DateTimeFormat("en", {
        timeZone: "Europe/Madrid",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const getDatePart = (type) => dateParts.find((part) => part.type === type).value;

    const today = `${getDatePart("year")}-${getDatePart("month")}-${getDatePart("day")}`;

    const overdueTasks = tasks.filter((task) => task.status !== "done" && task.dueDate && task.dueDate.slice(0, 10) < today).length;

    const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const nextTasks = tasks.filter((task) => task.status !== "done").sort((a, b) => {
        const firstDate = a.dueDate?.slice(0, 10) || "9999-12-31";

        const secondDate = b.dueDate?.slice(0, 10) || "9999-12-31";

        return firstDate.localeCompare(secondDate);
    }).slice(0, 3);


    const handleStageChange = async (event) => {
        const stage = event.target.value;

        if(savingStage) return;

        setSavingStage(true);
        setStageError("");

        try {
            await updateWorkspace(workspaceId, {stage});

            setWorkspace((previous) => ({
                ...previous, stage,
            }));
        } catch (error) {
            setStageError(error.response?.data?.message || "Unable to upgrade your buisness stage.");
        } finally {
            setSavingStage(false);
        }

    }

    return (
        <main className="workspace-details-page ws-layout">
            <header className="ws-header">
                <div>
                    <span className="ws-eyebrow"> {t("Private business workspace")} </span>
                    <h1>{workspace.name}</h1>
                    <p>{t("Plan your next steps and discuss them with your mentor.")}</p>
                </div>
            </header>

            <nav className="ws-section-nav" aria-label={t("Business sections")}>
                <a href="#business-overview">{t("Overview")}</a>
                <a href="#business-tasks">{t("Tasks")}</a>
                <a href="#business-chat">{t("AI mentor")}</a>
            </nav>

            <div className="ws-layout-columns">
                <div className="ws-planning-column">
                    <div className="ws-overview-row">
                        <section id="business-overview" className="ws-overview">
                            <div>
                                <span className="ws-eyebrow">{t("The idea")}</span>
                                <h2>{t("Business overview")}</h2>

                                <p className="ws-description">{workspace.summary}</p>
                            </div>

                            <dl className="ws-facts">
                                <div>
                                    <dt>{t("Target customer")}</dt>

                                    <dd>{workspace.customer || t("Not specified")}</dd>
                                </div>

                                <div>
                                    <dt>{t("Loaction")}</dt>
                                    <dd>{workspace.location || t("Not specified")}</dd>
                                </div>
                            </dl>

                            <div className="ws-stage-control">
                                <label htmlFor="business-stage">{t("Business stage")}</label>

                                <select 
                                id="busienss-stage" 
                                value={workspace.satge || "idea"} 
                                onChange={handleStageChange}
                                disabled={savingStage}
                                >
                                    <option value="idea">{t("Idea")}</option>
                                    <option value="customer_research">{t("Customer research")}</option>
                                    <option value="testing_demand">{t("Testing demand")}</option>
                                    <option value="building">{t("Building")}</option>
                                    <option value="launched">{t("Launched")}</option>
                                </select>

                                {savingStage && (
                                    <p role="status">{t("Saving stage...")}</p>
                                )}

                                {stageError && (
                                    <p role="alert">{tError(stageError)}</p>
                                )}
                            </div>
                        </section>

                        <section className="ws-dashboard" aria-labelledby="task-overview-heading">
                            <h2 id="task-overview-heading">{t("Task overview")}</h2>

                            {dashboardTasks === null ? (
                                <p>{t("Task overview will appear once tasks load.")}</p>
                            ) : (
                                <dl className="ws-dashboard-stats">
                                    <div>
                                        <dt>{t("Total tasks")}</dt>
                                        <dd>{formatNumber(totalTasks)}</dd>
                                    </div>

                                    <div>
                                    <dt>{t("Completed")}</dt>
                                    <dd>{formatNumber(completedTasks)}</dd>
                                </div>
                                <div>
                                    <dt>{t("Overdue")}</dt>
                                    <dd>{formatNumber(overdueTasks)}</dd>
                                </div>
                                <div>
                                    <dt>{t("Task completion")}</dt>
                                    <dd>{formatNumber(completionPercentage)}%</dd>
                                </div>
                                </dl>
                            )}
                        </section>
                    </div>

                    <section className="ws-next-tasks">
                        <div className="ws-next-heading">
                            <h2>{t("Next tasks")}</h2>
                            <a href="#business-tasks" className="ws-back">{t("View all tasks →")}</a>
                        </div>

                        {dashboardTasks === null ? (
                            <p>{t("Your tasks will appear here once loaded.")}</p>
                        ) : nextTasks.length === 0 ? (
                            <p>{totalTasks === 0 ? t("Create your first task to plan your next step.") : t("All tasks are completed")}</p>
                        ) : (
                            <ul className="ws-next-list">{nextTasks.map((task) => {
                                const deadline = task.dueDate?.slice(0, 10);

                                const isOverdue = deadline && deadline < today;

                                return (
                                    <li key={task._id}>
                                        <div>
                                            <h3>{task.title}</h3>
                                            <span>
                                                {task.status === "in_progress" ? t("In progress") : t("To do")}
                                            </span>
                                        </div>

                                        <span className={`ws-next-deadline ${isOverdue ? "is-overdue" : ""}`}>
                                            {!deadline ? t("No deadline") : isOverdue ? t("Overdue • {{0}}", {"0": formatDate(deadline)}) : deadline === today ? t("Due today") : t("Due {{0}}", {"0": formatDate(deadline)})}
                                        </span>
                                    </li>
                                )
                            })}</ul>
                        )}
                    </section>

                    <div id="business-tasks">
                        <WorkspaceTasks
                            key={`tasks-${workspaceId}`}
                            workspaceId={workspaceId}
                            onTasksChange={setDashboardTasks}
                        />
                    </div>

                    <details className="ws-validation-fold">
                        <summary>{t("Validation summary")}</summary>

                        <WorkspaceValidation 
                            key={`validation-${workspaceId}`}
                            workspace={workspace}
                            onSaved={(updates) => setWorkspace((previous) => ({
                                ...previous,
                                ...updates,
                            }))}
                        />
                    </details>
                </div>

                <aside
                    id="business-chat"
                    className="ws-mentor-column"
                    aria-label={t("Business mentor")}
                >

                    <WorkspaceChat
                        key={`chat-${workspaceId}`}
                        workspaceId={workspaceId}
                    />
                </aside>
            </div>

            <footer className="ws-footer">
                <Link to="/workspaces" className="ws-back"> {t("← Back to My Businesses")} </Link>

                <div>
                    {deleteError && <p role="alert">{tError(deleteError)}</p>}

                    <div className="ws-footer-buttons">
                        <Link to={`/workspaces/${workspaceId}/edit`} className="ws-button ws-secondary"> {t("Edit Business")} </Link>

                        <button className="ws-button ws-danger" type="button" onClick={handleDelete} disabled={deleting}>
                            {deleting ? t("Deleting...") : t("Delete Business")}
                        </button>
                    </div>
                </div>
            </footer>
        </main>
    );
}

export default WorkspaceDetailsPage;

        // <main className="workspace-details-page">
        //     <Link to="/workspaces" className="ws-back">← My Businesses</Link>
        //     <header className="ws-header">
        //         <div>
        //             <span className="ws-eyebrow">Private business workspace</span>
        //             <h1>{workspace.name}</h1>
        //             <p>Small steps. Real conversations. A clearer direction.</p>
        //         </div>
        //         <Link to={`/workspaces/${workspaceId}/edit`} className="ws-button ws-secondary">Edit Business</Link>
        //     </header>
        //     <nav className="ws-section-nav" aria-label="Business sections">
        //         <a href="#business-overview">Overview</a>
        //         <a href="#business-tasks">Validation tasks</a>
        //         <a href="#business-chat">AI mentor</a>
        //     </nav>
        //     <section id="business-overview" className="ws-overview">
        //         <div>
        //             <span className="ws-eyebrow">The idea</span>
        //             <h2>Business overview</h2>
        //             <p className="ws-description">{workspace.summary}</p>
        //         </div>
        //         <dl className="ws-facts">
        //             <div><dt>Target customer</dt><dd>{workspace.customer || "Not specified"}</dd></div>
        //             <div><dt>Location</dt><dd>{workspace.location || "Not specified"}</dd></div>
        //         </dl>
        //     </section>

        //     <section className="ws-dashboard" aria-labelledby="task-overview-heading">
        //         <h2 id="task-overview-heading">Task overview</h2>

        //         {dashboardTasks === null ? (
        //             <p>Task overview unavailable until tasks load.</p>
        //         ) : (
        //             <dl className="ws-dashboard-stats">
        //                 <div>
        //                     <dt>Total tasks</dt>
        //                     <dd>{totalTasks}</dd>
        //                 </div>

        //                 <div>
        //                     <dt>Completed</dt>
        //                     <dd>{completedTasks}</dd>
        //                 </div>

        //                 <div>
        //                     <dt>Overdue</dt>
        //                     <dd>{overdueTasks}</dd>
        //                 </div>

        //                 <div>
        //                     <dt>Task completion</dt>
        //                     <dd>{completionPercentage}%</dd>
        //                 </div>
        //             </dl>
        //         )}

        //         <div className="ws-stage-control">
        //             <label htmlFor="business-stage">Business stage</label>

        //             <select
        //                 id="business-stage"
        //                 value={workspace.stage || "idea"}
        //                 onChange={handleStageChange}
        //                 disabled={savingStage}
        //             >
        //                 <option value="idea">Idea</option>
        //                 <option value="customer_research">Customer research</option>
        //                 <option value="testing_demand">Testing demand</option>
        //                 <option value="building">Building</option>
        //                 <option value="launched">Launched</option>
        //             </select>

        //             {savingStage && <p role="status">Saving stage...</p>}
        //             {stageError && <p role="alert">{stageError}</p>}
        //         </div>
        //     </section>
            
        //     <section className="ws-next-tasks">
        //         <div className="ws-next-heading">
        //             <h2>Next tasks</h2>
        //             <a href="#business-tasks" className="ws-back">View all tasks →</a>
        //         </div>

        //         {dashboardTasks === null ? (
        //             <p>Your tasks will appear here once loaded.</p>
        //         ) : nextTasks.length === 0 ? (
        //             <p>
        //                 {totalTasks === 0 ? "Create your first task to plan your next step." : "All tasks are complete."}
        //             </p>
        //         ) : (
        //             <ul className="ws-next-list">{nextTasks.map((task) => {
        //                 const deadline = task.dueDate?.slice(0, 10);

        //                 const isOverdue = deadline && deadline < today;

        //                 return (
        //                     <li key={task._id}>
        //                         <div>
        //                             <h3>{task.title}</h3>
        //                             <span>{task.status === "in_progress" ? "In progress" : "To do"}</span>
        //                         </div>

        //                         <span className={`ws-next-deadline ${ isOverdue ? "is-overdue" : ""}`}>
        //                             {!deadline ? "No deadline" : isOverdue ? `Overdue • ${deadline}` : deadline === today ? "Due today" : `Due ${deadline}`} 
        //                         </span>
        //                     </li>
        //                 )
        //             })}</ul>
        //         )}
        //     </section>


        //     <WorkspaceValidation
        //         key={`validation-${workspaceId}`}
        //         workspace={workspace}
        //         onSaved={(updates) => setWorkspace((previous) => ({...previous, ...updates,}))}
        //     />
        //     <div className="ws-workbench">
        //         <div id="business-tasks">
        //             <WorkspaceTasks key={`tasks-${workspaceId}`} workspaceId={workspaceId} onTasksChange={setDashboardTasks}/>
        //         </div>
        //         <div id="business-chat">
        //             <WorkspaceChat key={`chat-${workspaceId}`} workspaceId={workspaceId}/>
        //         </div>
        //     </div>
        //     <footer className="ws-footer">
        //         <Link to="/workspaces" className="ws-back">← Back to My Businesses</Link>
        //         <div>
        //             {deleteError && <p role="alert">{deleteError}</p>}
        //             <button className="ws-button ws-danger" type="button" onClick={handleDelete} disabled={deleting}>
        //                 {deleting ? "Deleting…" : "Delete Business"}
        //             </button>
        //         </div>
        //     </footer>
        // </main>