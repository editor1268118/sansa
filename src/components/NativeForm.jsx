import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, useSearchParams } from "react-router-dom";
import { additionalAppointmentDepartments } from "../data/additional-services";
import { FiArrowUpRight } from "react-icons/fi";
import s from "../styles/site.module.scss";

export default function NativeForm({ contact = false }) {
  const [searchParams] = useSearchParams();
  const requestedDepartment = searchParams.get("department");
  const selectedDepartment = [
    "Gastroenterology",
    "Dermatology",
    ...additionalAppointmentDepartments,
  ].includes(requestedDepartment)
    ? requestedDepartment
    : "";
  const [loading, setLoading] = useState(false);
  const locked = useRef(false);
  useEffect(() => {
    const reset = () => {
      locked.current = false;
      setLoading(false);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const field = (label, name, type = "text", props = {}) => (
    <label className={s.field}>
      <span>
        {label}
        {type === "email" ? " (optional)" : " *"}
      </span>
      <input name={name} type={type} required={type !== "email"} {...props} />
    </label>
  );
  return (
    <form
      className={s.formPanel}
      action="https://formsubmit.co/info@sansahospital.com"
      method="POST"
      aria-label={contact ? "Hospital enquiry" : "Appointment request"}
      aria-busy={loading}
      onSubmit={(e) => {
        if (locked.current) {
          e.preventDefault();
          return;
        }
        locked.current = true;
        setLoading(true);
      }}
    >
      <span className={s.eyebrow}>
        {contact ? "We’re here to help" : "Plan your visit"}
      </span>
      <h2>{contact ? "Drop us a line" : "Request an appointment"}</h2>
      <p className={s.formIntro}>
        {contact
          ? "Send your question to our hospital team."
          : "Choose your preferred date and time. Our team will confirm availability."}
      </p>
      <div className={s.formGrid}>
        {contact ? (
          <>
            {field("Your name", "name", "text", { autoComplete: "name" })}
            {field("Email address", "email", "email", {
              autoComplete: "email",
            })}
          </>
        ) : (
          <>
            {field("First name", "First Name", "text", {
              autoComplete: "given-name",
            })}
            {field("Last name", "Last Name", "text", {
              autoComplete: "family-name",
            })}
            {field("Mobile number", "Mobile", "tel", {
              autoComplete: "tel",
              pattern: "[0-9]{10}",
              inputMode: "numeric",
              maxLength: 10,
              title: "Enter a 10-digit mobile number",
            })}
            {field("Email address", "Email", "email", {
              autoComplete: "email",
            })}
            <label className={s.field}>
              <span>Gender *</span>
              <select name="Gender" required defaultValue="">
                <option value="" disabled>
                  Select gender
                </option>
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
              </select>
            </label>
          </>
        )}
        <label className={s.field}>
          <span>Department *</span>
          <select
            name={contact ? "department" : "Department"}
            required
            defaultValue={selectedDepartment}
          >
            <option value="" disabled>
              Select department
            </option>
            <option>Gastroenterology</option>
            <option>Dermatology</option>
            {additionalAppointmentDepartments.map((department) => (
              <option key={department}>{department}</option>
            ))}
          </select>
        </label>
        {contact ? (
          <label className={`${s.field} ${s.formWide}`}>
            <span>Your message</span>
            <textarea
              name="message"
              rows={5}
              placeholder="How can our team help? Please avoid sharing sensitive medical information here."
            />
          </label>
        ) : (
          <>
            {field("Preferred date", "Preferred Date", "date", {
              min: minDate,
            })}
            <label className={s.field}>
              <span>Preferred time *</span>
              <select name="Preferred Time" required defaultValue="">
                <option value="" disabled>
                  Select time
                </option>
                <option>Morning</option>
                <option>Evening</option>
              </select>
            </label>
          </>
        )}
      </div>
      <label className={s.consent}>
        <input type="checkbox" required />
        <span>
          I agree to be contacted about this request and have read the{" "}
          <Link to="/privacy-policy">privacy policy</Link>.
        </span>
      </label>
      <button className={s.button} type="submit" disabled={loading}>
        {loading
          ? "Sending your request…"
          : contact
            ? "Send enquiry"
            : "Request appointment"}
        <FiArrowUpRight />
      </button>
      {loading && (
        <p role="status" className={s.formHint}>
          Connecting to our form service. Please wait for its response before
          closing this page.
        </p>
      )}
      <p className={s.formHint}>
        This form is securely sent through our existing FormSubmit service.{" "}
        {contact
          ? "For urgent appointment enquiries, please call our team."
          : "Your preferred slot is subject to confirmation by the hospital."}
      </p>
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      <input
        type="hidden"
        name="_next"
        value={`${window.location.origin}/thank-you`}
      />
    </form>
  );
}
NativeForm.propTypes = { contact: PropTypes.bool };
