import { Link } from "react-router-dom";
import { specialties, doctors, testimonials, laserFaqs } from "../../data/site";
import {
  PageHero,
  SectionHeading,
  DoctorCard,
  TreatmentCard,
  Testimonials,
  FAQ,
  AppointmentCTA,
  Button,
  ContactDetails,
} from "../../components/UI";
import AppointmentForm from "../../components/AppointmentForm";
import s from "../../styles/site.module.scss";
export default function DermaLp() {
  return (
    <>
      <PageHero
        eyebrow="SANSA Derma Laser"
        title="Specialist skin care. A more personal approach."
        intro="Explore laser and cosmetic dermatology with Dr. Saritha Aadhi at SANSA Hospital, Adilabad. Start with a conversation about your skin and your goals."
        image="/public/derma-hero-img.jpg"
        imageAlt="Original SANSA laser dermatology campaign photograph"
      />
      <section className={s.section}>
        <div className={`${s.container} ${s.split}`}>
          <div className={s.prose}>
            <span className={s.eyebrow}>Laser & cosmetic dermatology</span>
            <h2>Expert solutions for your skin with laser technology.</h2>
            <p>
              Our dermatologist, cosmetologist and skin specialist at SANSA
              Hospital provides medical and surgical treatments for a range of
              skin conditions through advanced modalities. Your care starts with
              an assessment of your skin, medical history and treatment goals.
            </p>
            <div className={s.actions}>
              <Button to="#consultation">Request a consultation</Button>
              <Button to="#services-section" secondary>
                Explore treatments
              </Button>
            </div>
          </div>
          <div className={s.bookingAside}>
            <h2>Care that begins with you.</h2>
            <p>
              A thorough consultation helps you understand the options, possible
              side effects, expected results and aftercare.
            </p>
            <ContactDetails />
          </div>
        </div>
      </section>
      <section className={`${s.section} ${s.tinted}`} id="services-section">
        <div className={s.container}>
          <SectionHeading
            eyebrow="Our dermatology services"
            title="Understand your treatment options."
          >
            Original SANSA services, with explanations to help you prepare for a
            specialist consultation.
          </SectionHeading>
          <div className={s.grid3}>
            {specialties[2].cards.map((t) => (
              <TreatmentCard treatment={t} key={t.title} />
            ))}
          </div>
          <p className={s.formHint}>
            Treatment results and suitability vary. Discuss the benefits and
            risks with your dermatologist.
          </p>
        </div>
      </section>
      <section className={s.section} id="doctors-section">
        <div className={s.container}>
          <SectionHeading
            eyebrow="Your dermatology specialist"
            title="Meet Dr. Saritha Aadhi."
          />
          <DoctorCard doctor={doctors[1]} full />
        </div>
      </section>
      <section className={`${s.section} ${s.tinted}`}>
        <div className={s.container}>
          <SectionHeading
            eyebrow="Patient experiences"
            title="In our patients’ own words."
          >
            These experiences appeared on SANSA’s original website. Individual
            results vary.
          </SectionHeading>
          <Testimonials items={testimonials} />
        </div>
      </section>
      <section className={s.section} id="faq-section">
        <div className={s.container}>
          <SectionHeading
            eyebrow="Before your consultation"
            title="Your questions, answered."
          />
          <FAQ items={laserFaqs} />
        </div>
      </section>
      <section className={`${s.section} ${s.tinted}`} id="consultation">
        <div className={`${s.container} ${s.formLayout}`}>
          <AppointmentForm variant="laser" />
          <div className={s.bookingAside}>
            <span className={s.eyebrow}>Start with a specialist</span>
            <h2>Let’s talk about your skin.</h2>
            <p>
              Tell us how to reach you and our team will get in touch about your
              consultation.
            </p>
            <ContactDetails />
            <aside className={s.notice}>
              <h3>Consultation availability</h3>
              <p>
                Our earlier campaign advertised a free consultation. Please{" "}
                <Link to="/contact">
                  confirm current consultation fees and offers
                </Link>{" "}
                with our team.
              </p>
            </aside>
          </div>
        </div>
      </section>
      <AppointmentCTA />
    </>
  );
}
