import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiHeart,
  FiShield,
  FiActivity,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import {
  specialties,
  doctors,
  carePoints,
  testimonials,
  hospital,
  gallery,
} from "../../data/site";
import {
  Photo,
  Button,
  SectionHeading,
  SpecialtyCard,
  DoctorCard,
  TreatmentCard,
  AppointmentCTA,
  ContactDetails,
  HospitalMap,
  Testimonials,
  GalleryGrid,
} from "../../components/UI";
import AppointmentForm from "../../components/AppointmentForm";
import s from "../../styles/site.module.scss";

export default function Home({ legacy = false }) {
  const galleryPreview = [gallery[0], gallery[5], gallery[2]];
  return (
    <>
      <section className={s.homeHero}>
        <div className={s.container}>
          <div className={s.heroCopy}>
            <span className={s.eyebrow}>Specialist healthcare in Adilabad</span>
            <h1>
              Expert care.
              <br />A personal touch.
              <br />
              <em>Right here at home.</em>
            </h1>
            <p>
              Specialist care for digestive, liver, skin, hair and heart health,
              with general surgery, surgical oncology and urological surgery
              services. Medical expertise with a commitment to you.
            </p>
            <div className={s.actions}>
              <Button />
              <Button to="#specialities" secondary>
                Explore specialities
              </Button>
            </div>
            <div className={s.heroTrust}>
              <FiShield />
              <span>
                <strong>Specialist-led. Patient-focused.</strong>Care built
                around you and your family.
              </span>
            </div>
          </div>
          <div className={s.heroVisual}>
            <Photo
              src="/src/compressed/compressed_doctors.jpg"
              alt="SANSA specialists Dr. V. Sachin Kumar and Dr. Saritha Aadhi"
              priority
              className={s.heroPhoto}
            />
            <div className={s.heroStamp}>
              <FiHeart />
              CARE WITH
              <br />
              COMPASSION
            </div>
            <div className={s.photoLabel}>
              <FiCheckCircle />
              <div>
                <strong>Your specialists. Your community.</strong>
                <span>Gastro, liver, skin & hair care in Adilabad</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={s.careStrip}>
        <div className={s.container}>
          <Link to="/about/doctors">
            <FiShield />
            <span>
              <strong>Specialist doctors</strong>
              <small>Experience meets understanding</small>
            </span>
          </Link>
          <Link to="/Gastroenterology">
            <FiActivity />
            <span>
              <strong>Diagnostic services</strong>
              <small>Endoscopy & liver screening</small>
            </span>
          </Link>
          <Link to="/Book-An-Appointment">
            <FiCalendar />
            <span>
              <strong>Personalised care</strong>
              <small>Start with a consultation</small>
            </span>
          </Link>
          <Link to="/contact">
            <FiMapPin />
            <span>
              <strong>Here in Adilabad</strong>
              <small>Care close to your community</small>
            </span>
          </Link>
        </div>
      </div>
      <section id="specialities" className={s.section}>
        <div className={s.container}>
          <SectionHeading
            eyebrow="Focused expertise. Complete attention."
            title="Specialist care, centred on you."
            to="/about/doctors"
            linkText="Meet your specialists"
          >
            From digestive wellness to healthy skin, find the right department
            for your needs.
          </SectionHeading>
          <div className={`${s.grid4} ${s.specialtyGrid}`}>
            {specialties.map((sp, i) => (
              <SpecialtyCard specialty={sp} index={i} key={sp.key} />
            ))}
          </div>
        </div>
      </section>
      <section className={`${s.section} ${s.tinted}`} id="about-us-section">
        <div className={`${s.container} ${s.split}`}>
          <div className={s.imageFrame}>
            <Photo
              src="/src/compressed/compressed_staff.JPG"
              alt="Dr. Sachin Kumar consulting with a colleague at SANSA Hospital"
              className={s.editorialPhoto}
            />
            <div className={s.imageNote}>
              <small>Rooted in our community</small>Small town.
              <br />
              Big heart.
              <br />
              Exceptional care.
            </div>
          </div>
          <div>
            <span className={s.eyebrow}>Welcome to SANSA Hospital</span>
            <h2>
              Good healthcare starts
              <br />
              with understanding you.
            </h2>
            <p className={`${s.lead} ${s.introSpacing}`}>
              In Adilabad, SANSA brings together gastroenterology and laser
              dermatology with a personal approach to patient care.
            </p>
            <p className={`${s.formIntro} ${s.supportSpacing}`}>
              Our doctors don’t just work here; they are part of the community.
              Through specialist consultations, diagnostic services and a
              dedicated team, we help patients take the next step in their care.
            </p>
            <ul className={s.listChecks}>
              <li>
                <FiCheckCircle /> Gastroenterology, hepatology, skin and hair
                care
              </li>
              <li>
                <FiCheckCircle /> Endoscopy and cosmetic dermatology services
              </li>
              <li>
                <FiCheckCircle /> On-site pharmacy for your convenience
              </li>
            </ul>
            <Button to="/about/hospital" secondary>
              Get to know SANSA
            </Button>
          </div>
        </div>
      </section>
      <section className={s.section}>
        <div className={s.container}>
          <SectionHeading
            eyebrow="From consultation to care"
            title="The expertise you need. The attention you deserve."
          />
          <div className={s.serviceBand}>
            {[
              {
                title: "Digestive diagnostics",
                text: "Endoscopy, colonoscopy and related specialist procedures, with care from our gastroenterology team.",
                to: "/Gastroenterology",
              },
              {
                title: "Liver health & screening",
                text: "Consultation for liver conditions, with FibroScan information and a focus on individual patient needs.",
                to: "/Hepatology",
              },
              {
                title: "Skin, hair & laser care",
                text: "Dermatology and cosmetic treatments, including laser hair reduction, MNRF and PRP services.",
                to: "/derma-laser",
              },
            ].map((item, i) => (
              <Link key={item.title} to={item.to}>
                <span>0{i + 1} / SPECIALIST SERVICES</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className={s.textLink}>
                  Discover our care <FiArrowUpRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className={`${s.section} ${s.tinted}`} id="doctors-section">
        <div className={s.container}>
          <SectionHeading
            eyebrow="People behind your care"
            title="Meet your specialists."
            to="/about/doctors"
            linkText="View doctor profiles"
          >
            Get to know the doctors who bring specialist knowledge and a
            personal commitment to SANSA.
          </SectionHeading>
          <div className={s.grid2}>
            {doctors.map((d) => (
              <DoctorCard key={d.name} doctor={d} />
            ))}
          </div>
        </div>
      </section>
      <section className={s.section} id="why-choose-us">
        <div className={s.container}>
          <SectionHeading
            eyebrow="The SANSA approach"
            title="More than treatment. Care that listens."
          />
          <div className={s.whyGrid}>
            {carePoints.map((point, i) => (
              <article key={point.title} className={s.whyItem}>
                <span>0{i + 1}</span>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className={`${s.section} ${s.tinted}`}>
        <div className={s.container}>
          <SectionHeading
            eyebrow="A closer look at our care"
            title="Treatments with a specialist approach."
            to="/Cosmetic-Dermatology"
            linkText="Explore skin treatments"
          />
          <div className={s.grid3}>
            {[
              specialties[0].cards[0],
              specialties[1].cards[5],
              specialties[2].cards[0],
            ].map((t) => (
              <TreatmentCard key={t.title} treatment={t} />
            ))}
          </div>
        </div>
      </section>
      <section className={s.section}>
        <div className={s.container}>
          <SectionHeading
            eyebrow="In our patients’ words"
            title="Personal experiences. Shared with trust."
          >
            Experiences shared on our existing website. Individual care and
            treatment results vary.
          </SectionHeading>
          <Testimonials items={testimonials.slice(0, 2)} />
        </div>
      </section>
      <section className={`${s.section} ${s.tinted}`}>
        <div className={s.container}>
          <SectionHeading
            eyebrow="Inside SANSA"
            title="A familiar place for better care."
            to="/gallery"
            linkText="View hospital gallery"
          />
          <GalleryGrid images={galleryPreview} preview />
        </div>
      </section>
      <AppointmentCTA />
      <section className={s.section} id="consultation">
        <div className={`${s.container} ${s.formLayout}`}>
          <AppointmentForm variant={legacy ? "legacy" : "home"} />
          <div className={s.bookingAside}>
            <span className={s.eyebrow}>Let’s connect</span>
            <h2>Your care starts with a conversation.</h2>
            <p>{hospital.intro}</p>
            <ContactDetails hours />
          </div>
        </div>
      </section>
      <section className={`${s.section} ${s.tinted}`}>
        <div className={`${s.container} ${s.split}`}>
          <div>
            <SectionHeading
              eyebrow="Find us in Adilabad"
              title="Closer to home. Here for you."
            />
            <ContactDetails />
          </div>
          <HospitalMap />
        </div>
      </section>
    </>
  );
}
Home.propTypes = { legacy: PropTypes.bool };
