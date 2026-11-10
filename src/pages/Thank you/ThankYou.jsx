import { useLocation } from "react-router-dom";
import { FiCheckCircle, FiHeart } from "react-icons/fi";
import { hospital } from "../../data/site";
import { Button } from "../../components/UI";
import s from "../../styles/site.module.scss";
export default function ThankYou() {
  const { state } = useLocation();
  return (
    <section className={`${s.section} ${s.tinted}`}>
      <div className={s.container}>
        <div className={s.confirmation}>
          {state?.submitted ? <FiCheckCircle /> : <FiHeart />}
          <span className={s.eyebrow}>SANSA Hospital · Adilabad</span>
          <h1>
            {state?.submitted
              ? "Your request has been sent."
              : "Thank you for contacting SANSA."}
          </h1>
          <p>
            {state?.submitted
              ? "Our team will contact you to discuss your request. Your appointment is subject to confirmation by the hospital."
              : "If you have submitted a form, please wait for the form service’s confirmation. For help with your request or appointment availability, contact our team."}
          </p>
          <a href={`tel:${hospital.tel}`}>{hospital.phone}</a>
          <div className={s.actions}>
            <Button to="/">Return to homepage</Button>
            <Button to="/contact" secondary>
              Contact our team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
