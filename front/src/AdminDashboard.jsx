import {NavLink } from "react-router-dom";


export default function AdminDashboard() {
  return (
    <>
    <NavLink
      to="/sellrequest"
      style={({ isActive }) => isActive ? activeStyles : null}
    >
      sell request
    </NavLink>
    <NavLink
      to="/publishrequest"
      style={({ isActive }) => isActive ? activeStyles : null}
    >
     publish request
   </NavLink>
    </>
  );
}
