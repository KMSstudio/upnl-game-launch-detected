/* @/app/show/layout.js */

// Component
import NavBar from "@/app/components/NavBar";
// Style (CSS)
import "@/styles/show.css";
// Constants
import navData from "@/config/navConstant.json";

export default function ShowLayout({ children }) {
  return (
    <div className="main-container">
      <NavBar navs={navData.navs}/>
      <div className="content-container">{children}</div>
    </div>
  );
}