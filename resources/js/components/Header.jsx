import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Header() {
    //get current active route
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-lg bg-white rounded shadow-sm">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`} aria-current="page" to="/create"> Create Prodact</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
