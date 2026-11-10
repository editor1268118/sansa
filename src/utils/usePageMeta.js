import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import routes from "../data/routes.json";
import { hospital, doctors, specialties, imageUrl } from "../data/site";
const origin = "https://www.sansahospital.com";
const setMeta = (key, value, property = false) => {
  const attribute = property ? "property" : "name";
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.append(tag);
  }
  tag.content = value;
};
export default function usePageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const canonicalPath =
      Object.keys(routes).find(
        (p) => p.toLowerCase() === pathname.replace(/\/$/, "").toLowerCase(),
      ) || (pathname === "/" ? "/" : pathname);
    const meta = routes[canonicalPath] || {
      title: "Page not found | SANSA Hospital",
      description: "Explore SANSA Hospital in Adilabad.",
      noindex: true,
    };
    const url = origin + canonicalPath;
    document.title = meta.title;
    setMeta("description", meta.description);
    setMeta("robots", meta.noindex ? "noindex, follow" : "index, follow");
    for (const [key, value] of Object.entries({
      "og:title": meta.title,
      "og:description": meta.description,
      "og:url": url,
      "og:type": "website",
      "og:site_name": "SANSA Hospital",
      "og:image": origin + "/media/compressed_doctors.jpg",
      "og:locale": "en_IN",
    }))
      setMeta(key, value, true);
    for (const [key, value] of Object.entries({
      "twitter:card": "summary_large_image",
      "twitter:title": meta.title,
      "twitter:description": meta.description,
      "twitter:image": origin + "/media/compressed_doctors.jpg",
    }))
      setMeta(key, value);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = url;
    const organization = {
      "@type": "Hospital",
      "@id": origin + "/#hospital",
      name: hospital.name,
      url: origin,
      telephone: hospital.tel,
      email: hospital.email,
      image: origin + "/media/compressed_doctors.jpg",
      logo: origin + "/media/logosansa.jpg",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Plot No. 5,6 & Part of 7, Survey No. 20/B, Behind Royal Enfield Showroom, Dasnapur",
        addressLocality: "Adilabad",
        addressRegion: "Telangana",
        postalCode: "504001",
        addressCountry: "IN",
      },
      sameAs: [hospital.facebook, hospital.instagram],
      hasMap: hospital.directions,
      medicalSpecialty: ["Gastroenterologic", "Dermatologic"],
    };
    const graph = [organization];
    if (canonicalPath !== "/")
      graph.push({
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: origin + "/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: meta.title.split("|")[0].trim(),
            item: url,
          },
        ],
      });
    if (canonicalPath === "/about/doctors")
      for (const doctor of doctors.filter((doctor) => !doctor.pendingDetails))
        graph.push({
          "@type": "Physician",
          name: doctor.name,
          description: doctor.qualifications,
          image: origin + imageUrl(doctor.image),
          medicalSpecialty: doctor.specialty,
          url,
          parentOrganization: { "@id": organization["@id"] },
          address: organization.address,
        });
    const specialty = specialties.find((sp) => sp.path === canonicalPath);
    if (specialty || canonicalPath === "/derma-laser")
      graph.push({
        "@type": "Service",
        serviceType: "Medical consultation and treatment",
        name: specialty?.name || "Laser & cosmetic dermatology",
        description: specialty?.summary || meta.description,
        url,
        provider: { "@id": organization["@id"] },
      });
    let schema = document.getElementById("sansa-structured-data");
    if (!schema) {
      schema = document.createElement("script");
      schema.id = "sansa-structured-data";
      schema.type = "application/ld+json";
      document.head.append(schema);
    }
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": graph,
    });
  }, [pathname]);
}
