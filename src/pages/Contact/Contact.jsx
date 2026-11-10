import { Link } from "react-router-dom";
import { specialties } from "../../data/site";
import {
  PageHero,
  SectionHeading,
  ContactDetails,
  HospitalMap,
  AppointmentCTA,
} from "../../components/UI";
import NativeForm from "../../components/NativeForm";
import s from "../../styles/site.module.scss";
export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact SANSA"
        title="Let’s connect. We’re here for you."
        intro="Find us in Dasnapur, Adilabad. Contact our team about consultations, directions or any questions before your visit."
      />
      <section className={s.section}>
        <div className={`${s.container} ${s.split}`}>
          <ContactDetails hours />
          <HospitalMap />
        </div>
      </section>
      <section className={`${s.section} ${s.tinted}`}>
        <div className={`${s.container} ${s.formLayout}`}>
          <NativeForm contact />
          <aside>
            <SectionHeading
              eyebrow="Find the right care"
              title="A specialist for your needs."
            />
            <p>
              Explore our departments or speak with the hospital team to help
              plan your visit.
            </p>
            <div className={s.pillLinks}>
              {specialties.map((sp) => (
                <Link to={sp.path} key={sp.path}>
                  {sp.name}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
      <AppointmentCTA />
    </>
  );
}
