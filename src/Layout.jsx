import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import usePageMeta from "./utils/usePageMeta";
import { Button } from "./components/UI";
import s from "./styles/site.module.scss";
export default function Layout() {
  const { pathname, hash } = useLocation();
  usePageMeta();
  useEffect(() => {
    if (hash) {
      const timeout = setTimeout(
        () => document.getElementById(hash.slice(1))?.scrollIntoView(),
        150,
      );
      return () => clearTimeout(timeout);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <>
      <a href="#main-content" className={s.skipLink}>
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <div className={s.mobileAction}>
        <a href="tel:+919182348994">Call SANSA</a>
        <Button>Book appointment</Button>
      </div>
    </>
  );
}
