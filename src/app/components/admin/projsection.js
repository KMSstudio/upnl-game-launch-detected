"use client";

import { useState } from "react";
import "@/styles/components/admin/projsection.css";
import "@/styles/components/console/projregister.css";
import coreTags from "@/config/coreTag.json";

export default function ProjSection() {
  return (
    <section id="proj-section">
      <h2>프로젝트 등록</h2>
      <div className="proj-wrapper">
        <ProjRegisterConsole />
      </div>
    </section>
  );
}

/**
 * 등록 화면 콘솔
 */
function ProjRegisterConsole() {
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
      await fetch("/api/project/regist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      alert("프로젝트 등록 완료");
    } catch (err) {
      alert("등록 실패");
    }
    setIsSubmitting(false);
  };

  return (
    <section className="proj-register">
      <div className="input-group">
        <div className="title-edition-group">
          <input placeholder="프로젝트 이름" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input placeholder="버전" value={version} onChange={(e) => setVersion(e.target.value)} />
        </div>
        <input placeholder="사용 OS" value={os} onChange={(e) => setOs(e.target.value)} />
        <input placeholder="Homepage URL" value={homepageUrl} onChange={(e) => setHomepageUrl(e.target.value)} />
        <div className="download-group">
          <select value={downloadType} onChange={(e) => setDownloadType(e.target.value)}>
            <option value="upnl">upnl</option>
            <option value="link">link</option>
            <option value="file">file</option>
          </select>
          <input placeholder="Download URL" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} />
        </div>
      </div>

      {/* 이미지 업로드 */}
      <div className="input-group image-upload-group">
        <div className="image-upload-boxes">
          <label className="upload-box" htmlFor="image-sq">
            {imageSq ? imageSq.split("/").pop() : "Click to add image (Square)"}
          </label>
          <input id="image-sq" type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files[0], "sq")} hidden />

          <label className="upload-box" htmlFor="image-fl">
            {imageFl ? imageFl.split("/").pop() : "Click to add image (Full)"}
          </label>
          <input id="image-fl" type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files[0], "fl")} hidden />
        </div>
      </div>

      {/* 태그 미리보기 */}
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

      {/* 태그 입력 */}
      <div className="tag-input-group">
        <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
          <option value="">Select Core Tag</option>
          {coreTags.map((tag) => (
            <option key={tag.name} value={tag.name}>{tag.name}</option>
          ))}
        </select>
        <button onClick={addMainTag}>+</button>
      </div>

      <div className="tag-input-group">
        <input placeholder="Tag" value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
        <button onClick={addTag}>+</button>
      </div>

      {/* 등록 버튼 */}
      <div className="button-group">
        <button className="register-button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </section>
  );
}