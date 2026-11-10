import policy from "../../data/privacy.json";
import { PageHero } from "../../components/UI";
import s from "../../styles/site.module.scss";
export default function PrivacyPolicy() {
  return (
    <>
      <PageHero
        eyebrow="Privacy policy"
        title="Your privacy matters."
        intro="How SANSA Hospital collects, uses and protects your information."
      />
      <section className={s.section}>
        <div className={s.container}>
          <article className={s.legal}>
            {policy.map((block, i) =>
              block.type === "h2" ? (
                <h2 key={i}>{block.text}</h2>
              ) : (
                <p key={i}>{block.text}</p>
              ),
            )}
          </article>
        </div>
      </section>
    </>
  );
}
