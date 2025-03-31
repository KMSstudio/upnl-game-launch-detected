"use client";

import { useEffect, useState } from "react";
import "@/styles/components/admin/projmdfsection.css";
import "@/styles/components/console/projregister.css";
import coreTags from "@/config/coreTag.json";

function ProjEditor({ initialData }) {
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("");
  const [homepageUrl, setHomepageUrl] = useState("");
  const [os, setOs] = useState("");
  const [downloadType, setDownloadType] = useState("upnl");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [imageSq, setImageSq] = useState(null);
  const [imageFl, setImageFl] = useState(null);
  const [mainTags, setMainTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!initialData) return;
    setTitle(initialData.title || "");
    setVersion(initialData.version || "");
    setHomepageUrl(initialData["homepage-url"] || "");
    setOs(initialData.os || "");
    setDownloadType(initialData["download-type"] || "upnl");
    setDownloadUrl(initialData["download-url"] || "");
    setImageSq(initialData["image-sq"] || null);
    setImageFl(initialData["image-fl"] || null);
    setTags(initialData.tag || []);
    setMainTags(
      (initialData["core-tag"] || [])
        .map((name) => coreTags.find((t) => t.name === name))
        .filter(Boolean)
    );
  }, [initialData]);

  const uploadImage = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (type === "sq") setImageSq(data.url);
    else setImageFl(data.url);
  };

  const addMainTag = () => {
    const tag = coreTags.find((t) => t.name === selectedTag);
    if (tag && !mainTags.some((t) => t.name === selectedTag)) {
      setMainTags([...mainTags, tag]);
    }
    setSelectedTag("");
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, ...tagInput.split(" ").filter((t) => t.trim())]);
      setTagInput("");
    }
  };

  const removeMainTag = (name) => setMainTags(mainTags.filter((t) => t.name !== name));
  const removeTag = (name) => setTags(tags.filter((t) => t !== name));

  const handleSubmit = async () => {
    const data = {
      title,
      version,
      "homepage-url": homepageUrl,
      os,
      "download-type": downloadType,
      "download-url": downloadUrl,
      "image-sq": imageSq,
      "image-fl": imageFl,
      "core-tag": mainTags.map((t) => t.name),
      tag: tags,
    };

    setIsSubmitting(true);
    try {
      await fetch("/api/project/modify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: initialData.id, data }),
      });
      alert("Project successfully updated.");
    } catch (err) {
      alert("Error while updating project.");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setIsDeleting(true);
    try {
      await fetch("/api/project/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: initialData.id }),
      });
      alert("Deleted.");
    } catch (err) {
      alert("Error deleting.");
    }
    setIsDeleting(false);
  };

  return (
    <section id="proj-modify-section">
      <h2>Modify Project</h2>
      <div className="proj-input">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Version" value={version} onChange={(e) => setVersion(e.target.value)} />
        <input placeholder="Homepage URL" value={homepageUrl} onChange={(e) => setHomepageUrl(e.target.value)} />
        <input placeholder="OS" value={os} onChange={(e) => setOs(e.target.value)} />
        <input placeholder="Download URL" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} />

        <div className="proj-select-row">
          <label>Download Type</label>
          <select value={downloadType} onChange={(e) => setDownloadType(e.target.value)}>
            <option value="upnl">upnl</option>
            <option value="link">link</option>
            <option value="file">file</option>
          </select>
        </div>

        <div className="proj-image-upload">
          <label>Image Square</label>
          <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files[0], "sq")} />
          {imageSq && <img src={imageSq} className="image-preview" />}
        </div>
        <div className="proj-image-upload">
          <label>Image Full</label>
          <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files[0], "fl")} />
          {imageFl && <img src={imageFl} className="image-preview" />}
        </div>
      </div>

      <div className="tag-preview">
        {mainTags.map((tag) => (
          <span key={tag.name} className="main-tag" onClick={() => removeMainTag(tag.name)} style={{ backgroundColor: tag.bgColor, color: tag.textColor }}>
            <img src={tag.icon} className="tag-icon" />
            {tag.name}
          </span>
        ))}
        {tags.map((tag, i) => (
          <span key={i} className="tag" onClick={() => removeTag(tag)}>{tag}</span>
        ))}
      </div>

      <div className="tag-input-group">
        <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
          <option value="">Select Core Tag</option>
          {coreTags.map((tag) => <option key={tag.name} value={tag.name}>{tag.name}</option>)}
        </select>
        <button onClick={addMainTag}>+</button>
      </div>

      <div className="tag-input-group">
        <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Tag" />
        <button onClick={addTag}>+</button>
      </div>

      <div className="button-group">
        <button className="register-button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Modifying..." : "Modify"}
        </button>
        <button className="delete-button" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </section>
  );
}

export default function ProjMdfSection({ projects }) {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [idx, setIdx] = useState(0);
  const selectedProj = searchResult.length > 0 ? searchResult[idx] : null;

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setQuery(searchTerm);

    if (!searchTerm.trim()) {
      setSearchResult([]);
      setIdx(0);
      return;
    }

    const filtered = projects.filter((proj) => proj.title.toLowerCase().includes(searchTerm));
    setSearchResult(filtered);
    setIdx(0);
  };

  return (
    <section id="proj-modify-section">
      <h2>Modify Project</h2>
      <input
        type="text"
        placeholder="Search by title..."
        value={query}
        onChange={handleSearch}
        className="book-search"
      />

      {selectedProj && (
        <ProjEditor initialData={selectedProj} />
      )}
    </section>
  );
}