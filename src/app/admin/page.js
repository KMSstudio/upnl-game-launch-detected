/*
* @/app/admin/project/admin.js
*/

// Styles
import "@/styles/admin.css";

// Components
import NavBar from "@/app/components/NavBar";
import ProjMdfSection from "@/app/components/admin/projmdfsection";
import ProjSection from "@/app/components/admin/projsection";
// Data
import { getAllDBProjs } from "@/utils/database/projDB";

export default async function AdminProjectPage() {
  const projects = {};

  return (
    <div className="main-container">
      <NavBar/>
      <main className="content-container">
        <div className="admin-proj-sections">
          <ProjMdfSection projects={projects} />
          <ProjSection />
        </div>
      </main>
    </div>
  );
}