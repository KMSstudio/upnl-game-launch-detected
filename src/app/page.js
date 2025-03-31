/* @/app/page.js */

// Next
import Link from "next/link";
// Components
import NavBar from "@/app/components/NavBar";
// Styles (CSS)
import "@/styles/index.css"

export default function HomePage() {
  return (
    <div id="main-container">
      <NavBar/>

      <div id="content-container">
        {/* Left section */}
        <section className="left">
          <a
            href="https://upnl.org/"
            className="redirect-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to UPnL
          </a>
        </section>

        {/* Right section */}
        <section className="right">
          <Link href="/show" className="redirect-button">
            Launch Game
          </Link>
        </section>
      </div>
    </div>
  );
}
