import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await API.get("/notifications/unread-count");
        setCount(res.data.count);
      } catch {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button onClick={() => navigate("/notifications")} style={styles.btn}>
      🔔
      {count > 0 && <span style={styles.badge}>{count}</span>}
    </button>
  );
}

const styles = {
  btn: {
    position: "relative",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    padding: "4px",
  },
  badge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    background: "#e74c3c",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "10px",
    width: "16px",
    height: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
