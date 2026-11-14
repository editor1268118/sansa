import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  FiArrowUpRight,
  FiArrowRight,
  FiPhone,
  FiMapPin,
  FiMail,
  FiPlus,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { imageUrl, imageSize, hospital, appointmentPath } from "../data/site";
import s from "../styles/site.module.scss";

export function Photo({ src, alt, priority = false, className = "" }) {
  const size = imageSize(src);
  return (
    <img
      src={imageUrl(src)}
      alt={alt}
      width={size.width}
      height={size.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}
Photo.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  priority: PropTypes.bool,
  className: PropTypes.string,
};

export function Button({
  to = appointmentPath,
  children = "Book an appointment",
  secondary = false,
  ...props
}) {
  return (
    <Link
      to={to}
      className={`${s.button} ${secondary ? s.secondary : ""}`}
      {...props}
    >
      {children}
      <FiArrowUpRight aria-hidden="true" />
    </Link>
  );
}
Button.propTypes = {
  to: PropTypes.string,
  children: PropTypes.node,
  secondary: PropTypes.bool,
};

export function SectionHeading({
  eyebrow,
  title,
  children,
  to,
  linkText = "Explore more",
}) {
  return (
    <div className={s.sectionHeading}>
      <div>
        {eyebrow && <span className={s.eyebrow}>{eyebrow}</span>}
        <h2>{title}</h2>
        {children && <p>{children}</p>}
      </div>
      {to && (
        <Link className={s.textLink} to={to}>
          {linkText}
          <FiArrowUpRight />
        </Link>
      )}
    </div>
  );
}
SectionHeading.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  to: PropTypes.string,
  linkText: PropTypes.string,
};

export function Breadcrumbs({ title }) {
  return (
    <nav className={s.breadcrumbs} aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{title}</span>
    </nav>
  );
}
Breadcrumbs.propTypes = { title: PropTypes.string.isRequired };

export function PageHero({
  eyebrow = "SANSA Hospital · Adilabad",
  title,
  intro,
  image,
  imageAlt,
  portrait = false,
}) {
  return (
    <section className={s.pageHero}>
      <div className={s.container}>
        <Breadcrumbs title={eyebrow} />
        <div className={image ? s.split : s.heroIntro}>
          <div>
            <span className={s.eyebrow}>{eyebrow}</span>
            <h1>{title}</h1>
            {intro && <p className={s.lead}>{intro}</p>}
          </div>
          {image && (
            <Photo
              src={image}
              alt={imageAlt || eyebrow}
              priority
              className={`${s.pageHeroPhoto} ${portrait ? s.portraitPhoto : ""}`}
            />
          )}
        </div>
      </div>
    </section>
  );
}
PageHero.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  intro: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  portrait: PropTypes.bool,
};

export function SpecialtyCard({ specialty, index }) {
  return (
    <Link to={specialty.path} className={s.specialtyCard}>
      <div className={s.cardPhoto}>
        <Photo
          src={specialty.cardImage || specialty.image}
          alt={
            specialty.cardImageAlt ||
            specialty.imageAlt ||
            `${specialty.name} care at SANSA`
          }
          className={
            !specialty.cardImage && specialty.portrait ? s.portraitPhoto : ""
          }
        />
        <span className={s.cardNumber}>0{index + 1}</span>
      </div>
      <div className={s.cardBody}>
        <span className={s.eyebrow}>{specialty.label}</span>
        <h3>
          {specialty.name}
          <FiArrowUpRight />
        </h3>
        <p>{specialty.summary}</p>
        <span className={s.smallLink}>
          Explore department <FiArrowRight />
        </span>
      </div>
    </Link>
  );
}
SpecialtyCard.propTypes = {
  specialty: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export function TreatmentCard({ treatment }) {
  return (
    <article className={s.treatmentCard}>
      {treatment.image && <Photo src={treatment.image} alt={treatment.title} />}
      <div>
        <h3>
          {treatment.title
            .replace(/\bSTRECH\b/g, "STRETCH")
            .replace("PHOTOTHERAPHY", "PHOTOTHERAPY")}
        </h3>
        <p>{treatment.description}</p>
      </div>
    </article>
  );
}
TreatmentCard.propTypes = { treatment: PropTypes.object.isRequired };

export function DoctorCard({ doctor, full = false }) {
  return (
    <article className={`${s.doctorCard} ${full ? s.doctorFull : ""}`}>
      <div
        className={`${s.doctorPhoto} ${doctor.portrait ? s.doctorPortrait : ""} ${doctor.fitOnMobile ? s.fitDoctorPortrait : ""}`}
      >
        <Photo src={doctor.image} alt={doctor.alt} />
      </div>
      <div className={s.doctorInfo}>
        <span className={s.eyebrow}>{doctor.specialty}</span>
        <h3>{doctor.name}</h3>
        {doctor.qualifications && (
          <p className={s.qualifications}>{doctor.qualifications}</p>
        )}
        {full && <p>{doctor.description}</p>}
        <Link
          className={s.textLink}
          to={
            doctor.appointmentDepartment
              ? `${appointmentPath}?department=${encodeURIComponent(doctor.appointmentDepartment)}`
              : appointmentPath
          }
        >
          Book a consultation <FiArrowUpRight />
        </Link>
      </div>
    </article>
  );
}
DoctorCard.propTypes = {
  doctor: PropTypes.object.isRequired,
  full: PropTypes.bool,
};

export function AppointmentCTA() {
  return (
    <section className={s.cta}>
      <div className={s.container}>
        <div>
          <span className={s.eyebrow}>Your health. Our commitment.</span>
          <h2>
            Let’s take the next step
            <br />
            towards better health.
          </h2>
          <p>
            Connect with our team for a specialist consultation in Adilabad.
          </p>
        </div>
        <div className={s.ctaActions}>
          <Button />
          <a href={`tel:${hospital.tel}`}>
            <FiPhone /> {hospital.phone}
          </a>
        </div>
      </div>
    </section>
  );
}

export function ContactDetails({ hours = false }) {
  return (
    <div className={s.contactDetails}>
      <a href={hospital.directions} target="_blank" rel="noreferrer">
        <FiMapPin />
        <span>
          <strong>Visit SANSA</strong>
          {hospital.address}
        </span>
      </a>
      <a href={`tel:${hospital.tel}`}>
        <FiPhone />
        <span>
          <strong>Call our team</strong>
          {hospital.phone}
        </span>
      </a>
      <a href={`mailto:${hospital.email}`}>
        <FiMail />
        <span>
          <strong>Email us</strong>
          {hospital.email}
        </span>
      </a>
      {hours && (
        <div className={s.hours}>
          <span className={s.eyebrow}>Consultation hours</span>
          <p>
            <strong>Gastroenterology</strong>
            <br />
            09:00 AM–02:00 PM & 04:00 PM–07:30 PM
          </p>
          <p>
            <strong>Dermatology</strong>
            <br />
            11:00 AM–02:00 PM & 05:00 PM–07:30 PM
          </p>
          <p>Sunday closed. Please call to confirm availability.</p>
        </div>
      )}
    </div>
  );
}
ContactDetails.propTypes = { hours: PropTypes.bool };

export function HospitalMap() {
  return (
    <iframe
      className={s.map}
      src={hospital.map}
      title="SANSA Hospital location in Dasnapur, Adilabad"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

export function FAQ({ items }) {
  return (
    <div className={s.faq}>
      {items.map((item, i) => (
        <details key={item.question}>
          <summary>
            <span>{item.question.replace(/^\d+\.\s*/, "")}</span>
            <FiPlus aria-hidden="true" />
          </summary>
          <div id={`faq-answer-${i}`}>
            <p>{item.answer}</p>
            {item.answer.endsWith("Nd.") && (
              <p>
                Please ask the dermatologist which laser is appropriate for your
                skin type.
              </p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
FAQ.propTypes = { items: PropTypes.array.isRequired };

export function Testimonials({ items }) {
  return (
    <div className={s.testimonials}>
      {items.map((t) => (
        <figure key={t.name}>
          <span className={s.quoteMark} aria-hidden="true">
            “
          </span>
          <blockquote>{t.quote}</blockquote>
          <figcaption>
            <span>
              {t.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div>
              <strong>{t.name}</strong>
              <small>Patient experience</small>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
Testimonials.propTypes = { items: PropTypes.array.isRequired };

export function GalleryGrid({ images, preview = false }) {
  const [active, setActive] = useState(null);
  const dialog = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    if (active !== null && !dialog.current.open) dialog.current.showModal();
  }, [active]);
  const close = () => {
    dialog.current.close();
    setActive(null);
    trigger.current?.focus();
  };
  const move = (delta) =>
    setActive((i) => (i + delta + images.length) % images.length);
  return (
    <>
      <div className={`${s.galleryGrid} ${preview ? s.galleryPreview : ""}`}>
        {images.map((img, i) => (
          <button
            type="button"
            key={img.src}
            onClick={(e) => {
              trigger.current = e.currentTarget;
              setActive(i);
            }}
            aria-label={`Enlarge: ${img.alt}`}
          >
            <Photo src={img.src} alt={img.alt} />
            <span>
              <FiPlus /> View photograph
            </span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className={s.lightbox}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            close();
            return;
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            move(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            move(-1);
          }
        }}
        aria-label="Hospital photograph viewer"
      >
        {active !== null && (
          <>
            <button
              type="button"
              className={s.lightboxClose}
              onClick={close}
              aria-label="Close photograph"
            >
              <FiX />
            </button>
            <button
              type="button"
              className={s.lightboxPrev}
              onClick={() => move(-1)}
              aria-label="Previous photograph"
            >
              <FiChevronLeft />
            </button>
            <Photo src={images[active].src} alt={images[active].alt} priority />
            <button
              type="button"
              className={s.lightboxNext}
              onClick={() => move(1)}
              aria-label="Next photograph"
            >
              <FiChevronRight />
            </button>
            <p aria-live="polite">
              {images[active].alt} · {active + 1} / {images.length}
            </p>
          </>
        )}
      </dialog>
    </>
  );
}
GalleryGrid.propTypes = {
  images: PropTypes.array.isRequired,
  preview: PropTypes.bool,
};
