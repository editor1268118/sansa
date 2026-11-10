import original from "../../data/original-content.json";
import { hospital } from "../../data/site";
import {
  PageHero,
  Photo,
  SectionHeading,
  TreatmentCard,
  AppointmentCTA,
  Button,
} from "../../components/UI";
import s from "../../styles/site.module.scss";
export default function TheHospital() {
  return (
    <>
      <PageHero
        eyebrow="About SANSA"
        title="Small town. Big heart. Exceptional care."
        intro={hospital.intro}
        image="/src/compressed/compressed_sansa0.JPG"
        imageAlt="Original SANSA Hospital building and signage"
      />
      <section className={s.section}>
        <div className={`${s.container} ${s.split}`}>
          <Photo
            src="/src/compressed/compressed_team1.JPG"
            alt="Dr. Sachin Kumar and the SANSA Hospital care team"
            className={s.editorialPhoto}
          />
          <div className={s.prose}>
            <span className={s.eyebrow}>Rooted in Adilabad</span>
            <h2>
              Specialist healthcare.
              <br />
              Community at heart.
            </h2>
            <p>
              In the short span of its existence, SANSA Hospital has created its
              niche on the map of quality healthcare delivery in Adilabad by
              introducing gastroenterology and laser dermatology. Having earned
              the trust and loyalty of patients through the compassion of its
              caregivers and medical technology, the institution has become part
              of the town’s care community.
            </p>
            <p>
              Our doctors, nurses and support staff work together to provide
              personalised care. From routine consultations to endoscopy and
              cosmetic dermatology, we put patients at the centre of our
              approach.
            </p>
            <div>
              <Button to="/about/doctors" secondary>
                Meet our doctors
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className={`${s.section} ${s.tinted}`}>
        <div className={s.container}>
          <SectionHeading
            eyebrow="Our hospital"
            title="The people, services and spaces behind your care."
          />
          <div className={s.grid3}>
            {original.facilities.hospitalCardContent.map((t) => (
              <TreatmentCard key={t.title} treatment={t} />
            ))}
          </div>
        </div>
      </section>
      <section className={s.section}>
        <div className={s.container}>
          <SectionHeading
            eyebrow="What guides us"
            title="Our vision. Our mission. Our values."
          />
          <div className={s.grid3}>
            {original.values.aboutHospital.map((t) => (
              <TreatmentCard key={t.title} treatment={t} />
            ))}
          </div>
        </div>
      </section>
      <AppointmentCTA />
    </>
  );
}
