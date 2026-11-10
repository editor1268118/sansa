import PropTypes from "prop-types";
import { NavLink, Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { specialties, doctors, laser } from "../data/site";
import {
  PageHero,
  SectionHeading,
  TreatmentCard,
  DoctorCard,
  AppointmentCTA,
  FAQ,
} from "./UI";
import s from "../styles/site.module.scss";

export default function DepartmentPage({ department }) {
  const sp = specialties.find((item) => item.key === department);
  const faqs = [
    {
      question: `What care does the ${sp.name.toLowerCase()} department provide?`,
      answer: sp.summary,
    },
    {
      question: "Which treatments and procedures are listed?",
      answer:
        sp.cards.map((t) => t.title).join(", ") +
        ". Your specialist will discuss which options are appropriate for you.",
    },
    {
      question: "Who can I consult at SANSA?",
      answer: [doctors[sp.doctor].name, doctors[sp.doctor].qualifications]
        .filter(Boolean)
        .join(" — "),
    },
    {
      question: "How do I request an appointment?",
      answer:
        "Use our appointment request page or call +91 9182348994. Your consultation time will be confirmed by the hospital team.",
    },
  ];
  return (
    <>
      <PageHero
        eyebrow={sp.name}
        title={sp.headline}
        intro={sp.summary}
        image={sp.image}
        imageAlt={
          sp.imageAlt ||
          `${sp.name} department — original SANSA website photography`
        }
        portrait={sp.portrait}
      />
      <section className={s.section}>
        <div className={`${s.container} ${s.departmentContent}`}>
          <div>
            <SectionHeading
              eyebrow="Our department"
              title={`Understanding ${sp.name.toLowerCase()} care.`}
            />
            <p className={s.departmentIntro}>{sp.info.description}</p>
            {sp.plannedService && (
              <aside className={s.notice}>
                <h3>{sp.plannedService.title}</h3>
                <p>{sp.plannedService.description}</p>
              </aside>
            )}
            {department === "liver" && (
              <aside className={s.notice}>
                <h3>Ask us about FibroScan screening</h3>
                <p>
                  Our earlier website advertised free FibroScan screening on the
                  third Monday of each month. The current schedule and offer
                  have not been confirmed.{" "}
                  <Link to="/contact">Contact our team</Link> for current
                  availability before planning your visit.
                </p>
              </aside>
            )}
          </div>
          <aside className={s.departmentAside}>
            <h3>Explore our specialities</h3>
            {[...specialties, laser].map((item) => (
              <NavLink to={item.path} key={item.path}>
                {item.name}
                <FiArrowUpRight />
              </NavLink>
            ))}
          </aside>
        </div>
      </section>
      <section className={`${s.section} ${s.tinted}`} id="services-section">
        <div className={s.container}>
          <SectionHeading
            eyebrow="Specialist services"
            title="Care tailored to your needs."
          >
            Explore the conditions, treatments and procedures described by our
            hospital. A consultation helps determine the right approach for you.
          </SectionHeading>
          <div className={s.grid3}>
            {sp.cards.map((t) => (
              <TreatmentCard key={t.title} treatment={t} />
            ))}
          </div>
          <p className={s.formHint}>
            Treatment suitability, risks and expected results should be
            discussed with your specialist.
          </p>
        </div>
      </section>
      <section className={s.section}>
        <div className={s.container}>
          <SectionHeading
            eyebrow="Meet your specialist"
            title="Expertise with a personal commitment."
          />
          <DoctorCard doctor={doctors[sp.doctor]} full />
        </div>
      </section>
      <section className={`${s.section} ${s.tinted}`}>
        <div className={`${s.container} ${s.split}`}>
          <div>
            <span className={s.eyebrow}>Questions before your visit</span>
            <h2>
              A little clarity.
              <br />A more confident first step.
            </h2>
          </div>
          <FAQ items={faqs} />
        </div>
      </section>
      <AppointmentCTA />
    </>
  );
}
DepartmentPage.propTypes = {
  department: PropTypes.oneOf([
    "gastro",
    "liver",
    "skin",
    "hair",
    "cardiology",
    "surgical-oncology",
  ]).isRequired,
};
