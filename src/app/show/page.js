/* @/app/show/page.js */

// Style (CSS)
import "@/styles/show.css";
// Utils
import { getAllDBProjs } from "@/utils/database/projDB";
// Component
import ProjList from "@/app/components/list/ProjList";
// Constant
import coreTags from "@/config/coreTag.json";

export default async function ShowProjectPage() {
  const projs = await getAllDBProjs();
  return (
    <div>
      <ProjList projs={projs} coreTags={coreTags} />
    </div>
  );
}