import { Link } from "react-router-dom";
import { FiArrowUpRight, FiInstagram, FiFacebook } from "react-icons/fi";
import { specialties, laser, hospital, appointmentPath } from "../../data/site";
import { ContactDetails } from "../UI";
import s from "../../styles/site.module.scss";
export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className={s.footerGrid}>
          <div>
            <Link to="/" className={s.brand}>
              <img
                src="/media/logosansa.jpg"
                width="48"
                height="60"
                alt="SANSA Hospital logo"
              />
              <span>
                SANSA<small>GASTRO, LIVER & SKIN HOSPITAL</small>
              </span>
            </Link>
            <p>{hospital.intro}</p>
            <div className={s.social}>
              <a
                href={hospital.facebook}
                aria-label="SANSA on Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <FiFacebook />
              </a>
              <a
                href={hospital.instagram}
                aria-label="SANSA on Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <FiInstagram />
              </a>
              <a
                href="https://wa.me/919182348994"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp <FiArrowUpRight />
              </a>
            </div>
          </div>
          <div>
            <h3>Explore SANSA</h3>
            <Link to="/about/hospital">Our hospital</Link>
            <Link to="/about/doctors">Our doctors</Link>
            <Link to="/gallery">Hospital gallery</Link>
            <Link to="/contact">Contact & directions</Link>
            <Link to={appointmentPath}>Book an appointment</Link>
          </div>
          <div>
            <h3>Our specialities</h3>
            {[...specialties, laser].map((sp) => (
              <Link key={sp.path} to={sp.path}>
                {sp.name}
              </Link>
            ))}
          </div>
          <div>
            <h3>Here for you</h3>
            <ContactDetails />
          </div>
        </div>
        <div className={s.footerBottom}>
          <span>
            © {new Date().getFullYear()} SANSA Hospital. All rights reserved.
          </span>
          <span>
            Adilabad, Telangana <span aria-hidden="true">·</span>{" "}
            <Link to="/privacy-policy">Privacy policy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
