import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import { Button } from "./components/UI";
import s from "./styles/site.module.scss";
const Home = lazy(() => import("./pages/Home/Home"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const BookAppointment = lazy(
  () => import("./pages/Book Appointment/BookAppointment"),
);
const TheHospital = lazy(() => import("./pages/The Hospital/TheHospital"));
const OurDoctors = lazy(() => import("./pages/Our Doctors/OurDoctors"));
const Gastroenterology = lazy(
  () => import("./pages/Gastroenterology/Gastroenterology"),
);
const Hepatology = lazy(() => import("./pages/Hepatology/Hepatology"));
const Dermatology = lazy(() => import("./pages/Dermatology/Dermatology"));
const Trichology = lazy(() => import("./pages/Trichology/Trichology"));
const Gallery = lazy(() => import("./pages/Gallery/Gallery"));
const ThankYou = lazy(() => import("./pages/Thank you/ThankYou"));
const PrivacyPolicy = lazy(
  () => import("./pages/Privacy Policy/PrivacyPolicy"),
);
const Page = lazy(() => import("./pages/Page/Page"));
const DermaLp = lazy(() => import("./pages/DermaLP/DermaLp"));
const Cardiology = lazy(() => import("./pages/Cardiology/Cardiology"));
const SurgicalOncology = lazy(
  () => import("./pages/Surgical Oncology/SurgicalOncology"),
);
function NotFound() {
  return (
    <section className={s.section}>
      <div className={s.container}>
        <h1>We couldn’t find that page.</h1>
        <p className={s.lead}>
          Explore SANSA Hospital or contact our team for help.
        </p>
        <div className={s.actions}>
          <Button to="/">Go to homepage</Button>
          <Button to="/contact" secondary>
            Contact SANSA
          </Button>
        </div>
      </div>
    </section>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className={`${s.section} ${s.container}`} role="status">
            Loading SANSA Hospital…
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="Book-An-Appointment" element={<BookAppointment />} />
            <Route path="about/hospital" element={<TheHospital />} />
            <Route path="about/doctors" element={<OurDoctors />} />
            <Route path="Gastroenterology" element={<Gastroenterology />} />
            <Route path="Hepatology" element={<Hepatology />} />
            <Route path="Cosmetic-Dermatology" element={<Dermatology />} />
            <Route path="Trichology" element={<Trichology />} />
            <Route path="Cardiology" element={<Cardiology />} />
            <Route path="Surgical-Oncology" element={<SurgicalOncology />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="thank-you" element={<ThankYou />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="page" element={<Page />} />
            <Route path="derma-laser" element={<DermaLp />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
