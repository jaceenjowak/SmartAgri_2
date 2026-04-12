import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import "./dashboard.css";

export default function DashboardLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="dashboard">
      <SiteNav showAuthLinks={false} appMode />
      <Outlet />
    </div>
  );
}
