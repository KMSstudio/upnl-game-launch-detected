/* @/app/components/ProjComponent.js */

import "@/styles/components/projcomponent.css";

export default function ProjComponent({ proj, coreTags }) {
  return (
    <div className="proj-item">
      <div className="proj-image">
        <img src={proj["image-sq"] || "/image/default.png"} alt="thumbnail" />
      </div>
      <div className="proj-info">
        <h3>{proj.title}</h3>
        <p>{proj.version}</p>
        <div className="proj-tags">
          {proj["core-tag"].map((tag) => {
            const tagData = coreTags.find((t) => t.name === tag);
            return tagData ? (
              <span key={tag} className="main-tag" style={{ backgroundColor: tagData.bgColor, color: tagData.textColor }}>
                <img src={tagData.icon} className="tag-icon" />
                {tag}
              </span>
            ) : null;
          })}
          {proj.tag.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}