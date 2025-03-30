/* @/app/components/NavBar.js */

"use client";

import Link from "next/link";
import "@/style/components/navbar.css";

export default function NavBar({ navs }) {
  return (
    <header id="navbar">
      {/* Logo Image */}
      <Link href="/" className="navbar-logo-container">
        <img src="https://upnl.org/static/img/upnl.png" alt="UPnL Logo" className="navbar-logo" />
        <img src="https://upnl.org/static/img/upnl.png" alt="UPnL Logo" className="navbar-hover-logo" />
      </Link>
      <nav className="nav">
        <Link href="/">Home</Link>
        {/* Navigation */}
        {navs &&
          navs.map((nav, index) => (
            <Link key={index} href={nav.href}>
              {nav.name}
            </Link>
          ))}
      </nav>
    </header>
  );
}