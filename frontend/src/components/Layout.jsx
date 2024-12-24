import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";
import "../styles/Layout.css";
export const Layout = () => {
  return (
    <>
      <header className="header-container">
        <NavBar />
        <div className="navbar-line"></div>
      </header>
      <main className='main-container'>
          <Outlet />
        <div className='main-gradient'></div>
      </main>
    </>
  )
}
