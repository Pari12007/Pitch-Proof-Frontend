import { useLanguage } from "../context/languageStore";
import { useContext, useEffect, useState } from "react";
import { getWorkspace, getWorkspaces} from "../services/workspace.services";
import { getWorkspaceTasks } from "../services/workspaceTask.services";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getIdeas } from "../services/idea.services";
import { getReviews } from "../services/review.services";
import DashboardGreeting from "../components/DashboardGreeting";
import DashboardSummaryCard from "../components/DashboardSummaryCard";


const DashboardPage = () => {
  const {t, locale , tError, formatDate, formatNumber } = useLanguage();


  const { user } = useContext(AuthContext);

  const [ businesses, setBusinesses ] = useState([]);
  const [ businessesLoading, setBusinessesLoading ] = useState(true);
  const [ businessesError, setBusinessesError ] = useState("");

  const [ tasks, setTasks ] = useState([]);
  const [ tasksLoading, setTasksLoading ] = useState(true);
  const [ tasksError, setTasksError ] = useState("");

  const [ recentReviews, setRecentReviews ] = useState([]);
  const [ reviewsLoading, setReviewsLoading ] = useState(true);
  const [ reviewsError, setReviewsError ] = useState("");

  const [ visibleReviewsCount, setVisibleReviewsCount ] = useState(5);
  
  const stageLabels = {
    idea: t("Idea"),
    customer_research: t("Customer research"),
    testing_demand: t("Testing demand"),
    building: t("Building"),
    launched: t("Launched"),
  }

  useEffect(() => {
    let active = true;

    const fetchBusinesses = async () => {
      setBusinessesLoading(true);
      setBusinessesError("");
      setBusinesses([]);

      try {
        const response = await getWorkspaces();

        if (active) {
          setBusinesses(response.data);
        }
      } catch (error) {
        if(active) {
          setBusinessesError(error.response?.data?.message || "Unable to load your businesses.")
        }
      } finally {
        if(active) {
          setBusinessesLoading(false);
        }
      }
    }

    if(user?._id) {
      fetchBusinesses();

      return () => {
        active = false;
      }
    }

  }, [user?._id]);

  useEffect(() => {
    let active = true;

    if(businessesLoading) {
      setTasksLoading(true);
      return;
    }

    if(businessesError) {
      setTasks([]);
      setTasksError("Task statistics are unavailable because businesses could not load.");
      setTasksLoading(false);
      return;
    }

    const fetchTasks = async () => {
      setTasksLoading(true);
      setTasksError("");
      setTasks([]);

      try {
        const result = await Promise.all(businesses.map(async (business) => {
          const response = await getWorkspaceTasks(business._id);

          return response.data.map((task) => ({
            ...task, 
            workspaceId: business._id,
            businessName: business.name,
          }))
        }))

        if(active) {
          setTasks(result.flat());
        }
      } catch (error) {
        if(active) {
          setTasksError(error.response?.data?.message || "Unable to load your task statistics.")
        }
      } finally {
        if (active) {
          setTasksLoading(false);
        }
      }; 

      
      }
      
      fetchTasks();

      return () => {
        active = false;
    }
  }, [businesses, businessesLoading, businessesError])

  const dateParts = new Intl.DateTimeFormat("en", {timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit",}).formatToParts(new Date());

  const getDatePart = (type) => dateParts.find((part) => part.type === type).value;

  const today = `${getDatePart("year")}-${getDatePart("month")}-${getDatePart("day")}`;

  const openTasks = tasks.filter((task) => task.status !== "done").length;

  const completedTasks = tasks.filter((task) => task.status === "done").length;

  const overdueTasks = tasks.filter((task) => task.status !== "done" && task.dueDate && task.dueDate.slice(0, 10) < today).length;

  const taskStatsUnavailable = tasksLoading || Boolean(tasksError); 

  useEffect(() => {
    let active = true;

    const fetchCommunityActivity = async () => {
      setReviewsLoading(true)
      setReviewsError("")
      setRecentReviews([]);
      setVisibleReviewsCount(5);

      try {
        const response = await getIdeas();

        const myIdeas = response.data.filter((idea) => {
          const authorId = idea.createdBy?._id ?? idea.createdBy;
          return authorId === user._id;
        });

        const results = await Promise.all(
          myIdeas.map(async(idea) => {
            const reviewsResponse = await getReviews(idea._id);

            return reviewsResponse.data.map((review) => ({
              ...review,
              ideaId: idea._id,
              ideaTitle: idea.title,
            }));
          })
        )
        
        const latestReviews = results.flat().sort(
          (a, b) => 
            new Date(b.createdAt).getTime() - 
            new Date(a.createdAt).getTime());

            if(active) {
              setRecentReviews(latestReviews);
            }
      } catch (error) {
        if(active) {
          setReviewsError(error.response?.data?.message || "Unable to load community activity.")
        }
      } finally {
        if(active) {
          setReviewsLoading(false);
        }
      }
    }

    if(user?._id) {
      fetchCommunityActivity();
    }

    return () => {
      active = false;
    }
  }, [user?._id]);

  const businessSummaryItems = businesses.map((business) => {

    const businessTasks = tasks.filter((task) => task.workspaceId === business._id);

    const done = businessTasks.filter((task) => task.status === "done").length;

    return {
      id: business._id,
      title: business.name,
      to: `/workspaces/${business._id}`,
      detail: stageLabels[business.stage] || t("Idea"),
      extra: tasksLoading ? t("Loading task counts...") : tasksError ? t("Task counts unavailable.") : t("{{0}} open tasks • {{1}} completed", {"0": businessTasks.length - done, "1": done}),
    };
  });

  const taskSummaryItem = (task) => ({
    id: task._id,
    title: task.title,
    to: `/workspaces/${task.workspaceId}#business-tasks`,
    detail: task.businessName,
    extra: task.dueDate ? t("Deadline: {{0}}", {"0": formatDate(task.dueDate.slice(0, 10))}) : t("No deadline"),
  });

  const summaryCards = [ 
    {
      title: t("Businesses"),
      count: businesses.length,
      loading: businessesLoading,
      error: businessesError,
      items: businessSummaryItems,
      emptyMessage: t("You haven't created a business yet."),
    },
    {
      title: t("Pending tasks"),
      count: openTasks,
      loading: tasksLoading,
      error: tasksError,
      items: tasks.filter((task) => task.status !== "done").map(taskSummaryItem),
      emptyMessage: t("No open tasks."),
    },
    {
      title: t("Completed tasks"),
      count: completedTasks,
      loading: tasksLoading,
      error: tasksError,
      items: tasks.filter((task) => task.status === "done").map(taskSummaryItem),
      emptyMessage: t("No completed tasks yet."),
    },
    {
      title: t("Overdue tasks"),
      count: overdueTasks,
      loading: tasksLoading,
      error: tasksError,
      items: tasks.filter((task) => task.status !== "done" && task.dueDate && task.dueDate.slice(0, 10) < today).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map(taskSummaryItem),
      emptyMessage: t("No overdue tasks."),
    },
  ];

  return (
    <main className="account-dashboard">
      <header className="dashboard-header">
        <div>
          <span className="ws-eyebrow">{t("Your dashboard")}</span>

          {user && ( <DashboardGreeting key={user._id} user={user} />)} 

          <p>{t("Your businesses, next steps, and community feedback in one place.")}</p>
        </div>

        <Link to="/workspaces/new" className="ws-button"> {t("Create Business")} </Link>
      </header>

      <section aria-labelledby="dashboard-overview-heading">

        <h2 id="dashboard-overview-heading">{t("Account overview")}</h2>

        <div className="dashboard-stats">
          {summaryCards.map((card => (
            <DashboardSummaryCard key={card.title} {...card} />
          )))}
        </div>

        
        {tasksLoading && (
          <p className="dashboard-note"> {t("Loading task statistics...")} </p>
        )}

        {tasksError && (
          <p className="dashboard-note" role="alert">
            {tError(tasksError)}
          </p>
        )}
      </section>

      <div className="dashboard-columns">
        <section className="dashboard-panel">
          <div className="dashboard-section-heading">
            <h2>{t("Needs attention")}</h2>

            <span className="dashboard-tag"> {t("Deadline")} </span>
          </div>

          <p> {t("Your overdue tasks and upcoming deadlines will appear here once task data is connected.")} </p>

          <Link to="/workspaces" className="dashboard-text-link"> {t("Open my businesses →")} </Link>
        </section>


        <section className="dashboard-panel">
          <h2>{t("Quick links")}</h2>

          <nav className="dashboard-quick-links" aria-label={t("Dashboard shortcuts")}>
            <Link to="/workspaces">{t("My businesses →")}</Link>
            <Link to="/my-ideas">{t("My ideas →")}</Link>
            <Link to="/create-idea">{t("Post your idea →")}</Link>
            <Link to="/ai-validator">{t("AI validator →")}</Link>
          </nav>
        </section>
      </div>

      <section className="dashboard-panel">
        <div className="dashboard-section-heading">
          <h2>{t("My businesses")}</h2>

          <Link to="/workspaces" className="dashboard-text-link"> {t("View all →")} </Link>
        </div>

        {businessesLoading ? (
          <p role="status">{t("Loading your businesses...")}</p>
        ) : businessesError ? (
          <p role="alert">{tError(businessesError)}</p>
        ) : businesses.length === 0 ? (
          <div>
            <p>{t("You haven't created a business yet.")}</p>
            <Link to="/workspaces/new" className="ws-button">{t("Create your first business")}</Link>
          </div>
        ) : (
          <div className="ideas-grid">{businesses.map((business) => {
            const businessTasks = tasks.filter((task) => task.workspaceId === business._id);

            const total = businessTasks.length;
            const done = businessTasks.filter((task) => task.status === "done").length;

            const left = total - done;

            return (
              <Link key={business._id} to={`/workspaces/${business._id}`} className="idea-link">
                <article className="idea-card">
                  <div className="idea-card-top">
                    <h3>{business.name}</h3>

                    <span className="idea-category">
                      {stageLabels[business.stage] || t("Idea")}
                    </span>
                  </div>

                  <p className="idea-description">{business.summary}</p>

                  {tasksLoading ? (<p role="status">{t("Loading task counts...")}</p>) : tasksError ? (<p>{t("Task counts unavailable.")}</p>) : (
                    <dl className="dashboard-business-counts">
                      <div>
                        <dt>{t("Total tasks")}</dt>
                        <dd>{formatNumber(total)}</dd>
                      </div>

                      <div>
                        <dt>{t("Left")}</dt>
                        <dd>{formatNumber(left)}</dd>
                      </div>

                      <div>
                        <dt>{t("Done")}</dt>
                        <dd>{formatNumber(done)}</dd>
                      </div>
                    </dl>
                  )}

                  <div className="idea-footer">
                    <span>{t("Open business →")}</span>
                  </div>
                </article>
              </Link>
            )
          })}</div>
        )}
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-section-heading">
          <h2>{t("Community activity")}</h2>

          <Link to="/my-ideas" className="dashboard-text-link"> {t("My ideas →")} </Link>
        </div>

        {reviewsLoading ? (
          <p role="status">{t("Loading recent reviews...")}</p>
        ) : reviewsError ? (
          <p role="alert">{tError(reviewsError)}</p>
        ) : recentReviews.length === 0 ? (
          <p>{t("No reviews on your ideas yet.")}</p>
        ) : (
          <ul className="dashboard-reviews">
            {recentReviews.slice(0, visibleReviewsCount).map((review) => (
              <li key={review._id}>
                <div className="dashboard-review-heading">
                  <Link to={`/ideas/${review.ideaId}`} className="dashboard-text-link">
                    {review.ideaTitle}
                  </Link>

                  <span className="dashboard-review-rating">
                    {formatNumber(review.rating)}/5
                  </span>
                </div>

                <p className="dashboard-review-meta">
                  {review.user?.name || t("Community member")} {" . "}

                  <time dateTime={review.createdAt}>
                    {new Date(review.createdAt).toLocaleDateString(
                      locale,
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </time>
                </p>

                <p className="dashboard-review-comment">
                  {review.comment}
                </p>
              </li>
            ))}
          </ul>
        )}

        {!reviewsLoading && !reviewsError && recentReviews.length > visibleReviewsCount && (
          <button
          type="button"
          className="ws-button ws-secondary"
          onClick={() => setVisibleReviewsCount((previous) => Math.min(previous + 5, recentReviews.length))}> {t("Show more reviews")} </button>
        )}
      </section>
    </main>
  )
}

export default DashboardPage