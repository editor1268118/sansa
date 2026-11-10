import { gallery } from "../../data/site";
import {
  PageHero,
  SectionHeading,
  GalleryGrid,
  AppointmentCTA,
} from "../../components/UI";
import s from "../../styles/site.module.scss";
export default function Gallery() {
  return (
    <>
      <PageHero
        eyebrow="Inside SANSA"
        title="Our hospital, through our lens."
        intro="Explore the spaces, people and facilities that make up SANSA Hospital. Select any photograph for a closer look."
      />
      <section className={s.section}>
        <div className={s.container}>
          <SectionHeading
            eyebrow="The original SANSA collection"
            title="A closer look at your care environment."
          >
            At SANSA Hospital, our doctors, nurses and support staff work
            together to help patients feel comfortable and supported throughout
            their hospital experience.
          </SectionHeading>
          <GalleryGrid images={gallery} />
        </div>
      </section>
      <AppointmentCTA />
    </>
  );
}
