import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

function Dashboard() {
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
  });

  const [search, setSearch] = useState("");

  // Load Jobs
  const fetchJobs = async () => {
    const res = await axios.get("http://127.0.0.1:8000/jobs");
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Add / Update Job
  const addJob = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(
        `http://127.0.0.1:8000/jobs/${editingId}`,
        form
      );
      setEditingId(null);
    } else {
      await axios.post("http://127.0.0.1:8000/jobs", form);
    }

    setForm({
      title: "",
      company: "",
      location: "",
      description: "",
    });

    fetchJobs();
  };

  // Delete Job
  const deleteJob = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/jobs/${id}`);
    fetchJobs();
  };

  // Edit Job
  const editJob = (job) => {
    setEditingId(job.id);

    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // AI Generate
  const generateDescription = async () => {
    if (form.title.trim() === "") {
      alert("Enter Job Title first");
      return;
    }

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/generate/${encodeURIComponent(
          form.title
        )}`
      );

      setForm((prev) => ({
        ...prev,
        description: res.data.description,
      }));
    } catch (err) {
      console.log(err);
      alert("Failed to generate description");
    }
  };

  // Search
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`container ${darkMode ? "dark-container" : ""}`}>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h1>AI Job Board</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: darkMode ? "#facc15" : "#374151",
              color: darkMode ? "#000" : "#fff",
              padding: "10px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button
            onClick={logout}
            style={{
              background: "#dc2626",
              color: "white",
              padding: "10px 18px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={addJob} className="form">

        <input
          type="text"
          placeholder="Job Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <button
          type="button"
          className="generate-btn"
          onClick={generateDescription}
        >
          Generate with AI
        </button>

        <input
          type="text"
          placeholder="Company"
          value={form.company}
          onChange={(e) =>
            setForm({ ...form, company: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <textarea
          rows="8"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button type="submit">
          {editingId ? "Update Job" : "Add Job"}
        </button>

      </form>

      <input
        className="search"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>Available Jobs</h2>

      {filteredJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        filteredJobs.map((job) => (
          <div className="job-card" key={job.id}>

            <h3>{job.title}</h3>

            <p>
              <b>Company:</b> {job.company}
            </p>

            <p>
              <b>Location:</b> {job.location}
            </p>

            <p style={{ whiteSpace: "pre-line" }}>
              {job.description}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <button
                style={{
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => editJob(job)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteJob(job.id)}
              >
                Delete
              </button>
            </div>

          </div>
        ))
      )}
      {filteredJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        filteredJobs.map((job) => (
          <div className="job-card" key={job.id}>
            {/* Your existing job card */}
          </div>
        ))
      )}

      {/* Footer */}
      <hr style={{ marginTop: "40px" }} />

      <div
        style={{
          textAlign: "center",
          padding: "20px",
          color: "gray",
        }}
      >
        <h3>🤖 AI Job Board</h3>
        <p>Built with React + FastAPI + SQLite</p>
        <p>Created by Kalluri Parvathi</p>
      </div>

    </div>
  );
}

export default Dashboard;