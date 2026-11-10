import NativeForm from "../../components/NativeForm";
import { PageHero, ContactDetails } from "../../components/UI";
import s from "../../styles/site.module.scss";
export default function BookAppointment() {
  return (
    <>
      <PageHero
        eyebrow="Appointments"
        title="Your next step to specialist care."
        intro="Tell us a little about yourself and your preferred visit. We’ll help you connect with the right specialist at SANSA Hospital."
      />
      <section className={s.section}>
        <div className={`${s.container} ${s.formLayout}`}>
          <NativeForm />
          <aside className={s.bookingAside}>
            <span className={s.eyebrow}>Here to guide you</span>
            <h2>Prefer to speak with us?</h2>
            <p>
              Our team can help with department selection, appointment
              availability and directions.
            </p>
            <ContactDetails hours />
          </aside>
        </div>
      </section>
    </>
  );
}
