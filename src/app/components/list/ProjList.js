"use client";

import { useState, useMemo } from "react";
import "@/styles/components/list/projlist.css";
import ProjComponent from "@/app/components/ProjComponent";

// Search Console Component
function ProjSearchConsole({ projs, coreTags, setSearchResult }) {
  const [searchInput, setSearchInput] = useState("");
  const [regexInput, setRegexInput] = useState("");
  const [osInput, setOsInput] = useState("");

  const [disabledInputs, setDisabledInputs] = useState({
    search: "",
    regex: "",
    os: "",
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const allTags = useMemo(() => [...new Set(projs.flatMap(p => [...p.tag]))], [projs]);

  const executeSearch = (regexQuery, osQuery, tags) => {
    const filtered = projs.filter((proj) => {
      let titleMatch = true;
      if (regexQuery) {
        try {
          titleMatch = new RegExp(regexQuery, "i").test(proj.title);
        } catch (error) {
          titleMatch = false;
        }
      }

      const osMatch = osQuery ? proj.os.toLowerCase().includes(osQuery.toLowerCase()) : true;
      const tagMatch = tags.length === 0 || tags.some((tag) =>
        (proj.tag || []).includes(tag) || (proj["core-tag"] || []).includes(tag)
      );

      return titleMatch && osMatch && tagMatch;
    });

    setSearchResult(filtered);
  };

  const handleSearchBlur = (e, type) => {
    if (type === "search") {
      const value = e.target.value;
      setRegexInput(value ? `.*${value}.*` : "");
      setDisabledInputs({ search: "", regex: "", os: "disabled-input" });
    } else if (type === "regex") {
      setDisabledInputs({ search: "disabled-input", regex: "", os: "disabled-input" });
    } else if (type === "os") {
      setDisabledInputs({ search: "disabled-input", regex: "disabled-input", os: "" });
    }
  };

  const handleOnChange = (e, type) => {
    const value = e.target.value;
    let regexQuery = regexInput;
    let osQuery = osInput;

    if (type === "search") { setSearchInput(value); regexQuery = value ? `.*${value}.*` : ""; }
    else if (type === "regex") { setRegexInput(value); regexQuery = value; }
    else if (type === "os") { setOsInput(value); osQuery = value; }

    executeSearch(regexQuery, osQuery, selectedTags);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
      executeSearch(regexInput, osInput, newTags);
      return newTags;
    });
  };

  const handleEnableInputs = () => {
    setSearchInput("");
    setRegexInput("");
    setOsInput("");
    setDisabledInputs({ search: "", regex: "", os: "" });
    executeSearch("", "", selectedTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") e.target.blur();
  };

  return (
    <div id="search-section">
      <div id="left-search">
        <input
          type="text"
          placeholder="Search Title"
          value={searchInput}
          onBlur={(e) => handleSearchBlur(e, "search")}
          onChange={(e) => handleOnChange(e, "search")}
          onClick={handleEnableInputs}
          onKeyDown={handleKeyDown}
          className={disabledInputs.search}
        />
        <input
          type="text"
          placeholder="Regex Search"
          value={regexInput}
          onBlur={(e) => handleSearchBlur(e, "regex")}
          onChange={(e) => handleOnChange(e, "regex")}
          onClick={handleEnableInputs}
          onKeyDown={handleKeyDown}
          className={disabledInputs.regex}
        />
        <input
          type="text"
          placeholder="Search OS"
          value={osInput}
          onBlur={(e) => handleSearchBlur(e, "os")}
          onChange={(e) => handleOnChange(e, "os")}
          onClick={handleEnableInputs}
          onKeyDown={handleKeyDown}
          className={disabledInputs.os}
        />
      </div>
      <div id="right-search">
        <div className="tag-container">
          {coreTags.map((tag) => (
            <span
              key={tag.name}
              className={selectedTags.includes(tag.name) ? "main-tag selected" : "main-tag"}
              onClick={() => handleTagToggle(tag.name)}
              style={{ backgroundColor: tag.bgColor, color: tag.textColor }}
            >
              <img src={tag.icon} className="tag-icon" />
              {tag.name}
            </span>
          ))}
          {allTags.map((tag) => (
            <span
              key={tag}
              className={selectedTags.includes(tag) ? "tag selected" : "tag"}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Display Component
function ProjListDisplay({ searchResult, coreTags }) {
  return (
    <div className="proj-list">
      {searchResult.map((proj) => (
        <ProjComponent key={proj.id} proj={proj} coreTags={coreTags} />
      ))}
    </div>
  );
}

// Main List Component
export default function ProjList({ projs, coreTags }) {
  const [searchResult, setSearchResult] = useState(projs);

  return (
    <div id="proj-list-container">
      <ProjSearchConsole projs={projs} coreTags={coreTags} setSearchResult={setSearchResult} />
      <ProjListDisplay searchResult={searchResult} coreTags={coreTags} />
    </div>
  );
}