import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { getApplicantsForJob, updateApplicationStatus } from "../api/applications";
import "../styles/jobs.css";

const statusOptions = ["APPLIED", "UNDER_REVIEW", "ACCEPTED", "REJECTED"];

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplicants = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      const res = await getApplicantsForJob(jobId, pageNum, 10);
      setApplicants(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    const loadApplicants = async () => {
      await fetchApplicants(page);
    };
    loadApplicants();
  }, [page, fetchApplicants]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus, undefined);
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleNotesChange = async (applicationId, notes) => {
    try {
      await updateApplicationStatus(applicationId, undefined, notes);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save notes");
    }
  };

  if (loading) return <DashboardLayout><p>Loading applicants...</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <h2>Applicants</h2>
      {error && <p className="error-text">{error}</p>}

      {applicants.length === 0 ? (
        <p>No applicants yet for this job.</p>
      ) : (
        <>
          <div className="applicant-list">
            {applicants.map((app) => (
              <div key={app.id} className="applicant-card">
                <div className="applicant-info">
                  <h3>{app.candidateName}</h3>
                  <p>{app.candidateEmail}</p>
                  <p className="applied-date">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                  {app.coverLetter && (
                    <p className="cover-letter-preview">"{app.coverLetter}"</p>
                  )}
                  <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="resume-link">
                    View Resume
                  </a>
                </div>

                <div className="applicant-actions">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </select>

                  <textarea
                    placeholder="Internal notes..."
                    defaultValue={app.recruiterNotes || ""}
                    onBlur={(e) => handleNotesChange(app.id, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <span>Page {page + 1} of {totalPages}</span>
            <button disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default JobApplicants;