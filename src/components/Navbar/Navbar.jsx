import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiArrowUpRight,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { specialties, laser, hospital, appointmentPath } from "../../data/site";
import s from "../../styles/site.module.scss";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const location = useLocation();
  const root = useRef(null);
  const menuButton = useRef(null);
  useEffect(() => {
    setOpen(false);
    setDropdown(false);
  }, [location.pathname]);
  useEffect(() => {
    const outside = (e) => {
      if (!root.current?.contains(e.target)) setDropdown(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  const close = () => {
    setOpen(false);
    setDropdown(false);
    menuButton.current?.focus();
  };
  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      close();
      return;
    }
    if (open && e.key === "Tab") {
      const items = [...root.current.querySelectorAll("a,button")].filter(
        (el) => el.getClientRects().length,
      );
      const first = items[0],
        last = items.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  return (
    <>
      <div className={s.topbar}>
        <div className={s.container}>
          <span>
            <FiMapPin /> Specialist care, close to home. Adilabad.
          </span>
          <a href={`tel:${hospital.tel}`}>
            <FiPhone /> {hospital.phone}
          </a>
        </div>
      </div>
      <header className={s.header} ref={root} onKeyDown={onKeyDown}>
        <div className={s.navInner}>
          <Link to="/" className={s.brand} aria-label="SANSA Hospital home">
            <img
              src="/media/logosansa.jpg"
              width="48"
              height="60"
              alt="Original SANSA Gastro Liver Skin logo"
            />
            <span>
              SANSA<small>GASTRO, LIVER & SKIN HOSPITAL</small>
            </span>
          </Link>
          <button
            ref={menuButton}
            className={s.menuToggle}
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="main-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
          <nav
            id="main-navigation"
            className={`${s.navigation} ${open ? s.navigationOpen : ""}`}
            aria-label="Main navigation"
          >
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/about/hospital">About SANSA</NavLink>
            <div
              className={s.dropdown}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget))
                  setDropdown(false);
              }}
            >
              <button
                type="button"
                aria-expanded={dropdown}
                aria-controls="speciality-navigation"
                className={
                  specialties.some((sp) => sp.path === location.pathname) ||
                  location.pathname === laser.path
                    ? s.activeNav
                    : ""
                }
                onClick={() => setDropdown(!dropdown)}
              >
                Specialities <FiChevronDown />
              </button>
              {dropdown && (
                <div id="speciality-navigation" className={s.dropdownMenu}>
                  {[...specialties, laser].map((sp) => (
                    <NavLink key={sp.path} to={sp.path}>
                      {sp.name}
                      <FiArrowUpRight />
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
            <NavLink to="/about/doctors">Our Doctors</NavLink>
            <NavLink to="/gallery">Gallery</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <Link className={s.navAppointment} to={appointmentPath}>
              Book appointment <FiArrowUpRight />
            </Link>
          </nav>
        </div>
      </header>
      {open && (
        <button
          type="button"
          tabIndex={-1}
          className={s.menuOverlay}
          aria-label="Close navigation overlay"
          onClick={close}
        />
      )}
    </>
  );
}
