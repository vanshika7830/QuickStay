import { useState, useEffect } from "react";
import "./UserProfile.css";

export default function UserProfile() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [editing, setEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Call your API to save profile here
      // await axios.put("/api/users/profile", { ...user, password });
      setEditing(false);
      setPassword("");
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage("Failed to update profile");
    }
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">My Profile</h1>

      {/* Card */}
      <div className="profile-container">
        <form className="profile-form">
          <label>
            Name
            <input
              type="text"
              name="name"
              value={user.name}
              disabled={!editing}
              onChange={handleChange}
            />
          </label>

          <label>
            Email
            <input type="email" name="email" value={user.email} disabled />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter new password"
              disabled={!editing}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </form>
      </div>

      {/* Save Button below card */}
      {editing ? (
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      ) : (
        <button className="edit-btn" onClick={() => setEditing(true)}>
          Edit Profile
        </button>
      )}

      {message && <div className="profile-message">{message}</div>}
    </div>
  );
}