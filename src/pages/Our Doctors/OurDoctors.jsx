import { doctors } from "../../data/site";
import {
  PageHero,
  SectionHeading,
  DoctorCard,
  AppointmentCTA,
} from "../../components/UI";
import s from "../../styles/site.module.scss";
export default function OurDoctors() {
  return (
    <>
      <PageHero
        eyebrow="Our doctors"
        title="Your health. In experienced hands."
        intro="Meet the specialists behind SANSA's digestive, liver, skin, hair, heart and surgical care in Adilabad."
      />
      <section className={s.section}>
        <div className={s.container}>
          <SectionHeading
            eyebrow="A personal commitment to care"
            title="Get to know your specialists."
          />
          <div className={s.doctorsStack}>
            {doctors.map((d) => (
              <DoctorCard key={d.name} doctor={d} full />
            ))}
          </div>
          <p className={s.formHint}>
            Qualifications and biographies are preserved from the hospital’s
            existing profiles. Experience figures reflect those published
            biographies.
          </p>
        </div>
      </section>
      <AppointmentCTA />
    </>
  );
}
