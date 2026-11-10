import { useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FiArrowUpRight } from "react-icons/fi";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { baseServerUrl } from "../constant";
import { hospital } from "../data/site";
import s from "../styles/site.module.scss";

export default function AppointmentForm({ variant = "home" }) {
  const id = useId();
  const navigate = useNavigate();
  const captcha = useRef(null);
  const busy = useRef(false);
  const [data, setData] = useState({
    name: "",
    mobile: "",
    email: "",
    department: "",
  });
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim();
  const change = (e) => {
    const { name, value } = e.target;
    setData((d) => ({
      ...d,
      [name]: name === "mobile" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const submit = async (e) => {
    e.preventDefault();
    if (busy.current) return;
    setError("");
    const invalid = {};
    if (!data.name.trim()) invalid.name = "Please enter your name.";
    if (variant === "laser" && !/^[A-Za-z\s]+$/.test(data.name))
      invalid.name =
        "Please use letters and spaces, as required by this enquiry form.";
    if (!/^\d{10}$/.test(data.mobile))
      invalid.mobile = "Enter a 10-digit mobile number.";
    if (variant === "home" && !data.email.endsWith("@gmail.com"))
      invalid.email =
        "This form currently requires a Gmail address. You can also book by phone.";
    if (variant !== "laser" && !data.department)
      invalid.department = "Please select a department.";
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      e.currentTarget
        .querySelector(`[name="${Object.keys(invalid)[0]}"]`)
        ?.focus();
      return;
    }
    if (!sitekey || !token) {
      setError(
        "Please complete the security check before sending your request.",
      );
      return;
    }
    busy.current = true;
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseServerUrl}api/send-email`,
        { ...data, name: data.name.trim(), recaptchaToken: token },
        { headers: { "Content-Type": "application/json" }, timeout: 20000 },
      );
      if (response.status !== 200) throw new Error("Request was not accepted");
      navigate("/thank-you", { state: { submitted: true } });
    } catch {
      setError(
        "Your request could not be sent. Please try again or call " +
          hospital.phone +
          ".",
      );
      setToken("");
      captcha.current?.reset();
    } finally {
      busy.current = false;
      setLoading(false);
    }
  };
  const field = (name, label, type = "text", placeholder = "") => (
    <label className={s.field}>
      <span>{label} *</span>
      <input
        id={`${id}-${name}`}
        name={name}
        type={type}
        autoComplete={
          name === "name" ? "name" : name === "mobile" ? "tel" : "email"
        }
        value={data[name]}
        onChange={change}
        required
        placeholder={placeholder}
        inputMode={name === "mobile" ? "numeric" : undefined}
        maxLength={name === "mobile" ? 10 : undefined}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${id}-${name}-error` : undefined}
      />
      {errors[name] && (
        <span id={`${id}-${name}-error`} className={s.fieldError}>
          {errors[name]}
        </span>
      )}
    </label>
  );
  return (
    <form
      id="form"
      className={s.formPanel}
      onSubmit={submit}
      aria-label="Specialist consultation request"
      aria-busy={loading}
    >
      <span className={s.eyebrow}>A conversation is the first step</span>
      <h2>Request a consultation</h2>
      <p className={s.formIntro}>
        Share your details. Our team will contact you to discuss availability.
      </p>
      <div className={s.formGrid}>
        {field("name", "Full name", "text", "Your full name")}
        {field("mobile", "Mobile number", "tel", "10-digit mobile number")}
        {field(
          "email",
          variant === "home" ? "Gmail address" : "Email address",
          "email",
          "you@example.com",
        )}
        {variant !== "laser" && (
          <label className={s.field}>
            <span>Department *</span>
            <select
              name="department"
              value={data.department}
              onChange={change}
              required
              aria-invalid={!!errors.department}
              aria-describedby={
                errors.department ? `${id}-department-error` : undefined
              }
            >
              <option value="" disabled>
                Select department
              </option>
              <option value="gastroenterology">Gastroenterology</option>
              <option value="dermatology">Dermatology</option>
            </select>
            {errors.department && (
              <span id={`${id}-department-error`} className={s.fieldError}>
                {errors.department}
              </span>
            )}
          </label>
        )}
      </div>
      <div className={s.captcha}>
        {sitekey ? (
          <ReCAPTCHA
            ref={captcha}
            sitekey={sitekey}
            size="compact"
            onChange={(value) => setToken(value || "")}
            onExpired={() => setToken("")}
            onErrored={() => {
              setToken("");
              setError(
                "The security check could not load. Please reload or call our team.",
              );
            }}
          />
        ) : (
          <p role="status">
            Online consultation requests are currently unavailable. Please call{" "}
            <a href={`tel:${hospital.tel}`}>{hospital.phone}</a> to book.
          </p>
        )}
      </div>
      <label className={s.consent}>
        <input type="checkbox" required />
        <span>
          I agree to be contacted about my request and have read the{" "}
          <Link to="/privacy-policy">privacy policy</Link>.
        </span>
      </label>
      {error && (
        <p className={s.formStatus} role="alert">
          {error}
        </p>
      )}
      <button type="submit" className={s.button} disabled={loading || !sitekey}>
        {loading ? "Sending your request…" : "Send consultation request"}
        <FiArrowUpRight />
      </button>
      <p className={s.formHint}>
        A request does not confirm an appointment. Please wait for our team to
        confirm your visit.
      </p>
      {variant !== "laser" && (
        <p className={s.formHint}>
          For{" "}
          <Link
            className={s.bookingLink}
            to="/Book-An-Appointment?department=Cardiology"
          >
            Cardiology
          </Link>{" "}
          or{" "}
          <Link
            className={s.bookingLink}
            to="/Book-An-Appointment?department=Surgical%20Oncology"
          >
            Surgical Oncology
          </Link>
          , use our appointment request form.
        </p>
      )}
    </form>
  );
}
AppointmentForm.propTypes = {
  variant: PropTypes.oneOf(["home", "legacy", "laser"]),
};
