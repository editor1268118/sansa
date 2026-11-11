// Services and portraits supplied by the hospital on 10 November 2026.
// Names and qualifications confirmed by the user in the follow-up request.
export const additionalDoctors = [
  {
    name: "Dr. Mohammed Zakria",
    qualifications: "MBBS, MD, DM(Cardiology)",
    specialty: "Cardiology",
    image: "/media/cardiologist.jpeg",
    alt: "Dr. Mohammed Zakria, Cardiologist at SANSA Hospital",
    description:
      "Consultation for cardiology services, including ECG, 2D echo and cardiac monitoring.",
    appointmentDepartment: "Cardiology",
    portrait: true,
    pendingDetails: false,
  },
  {
    name: "Dr. Jakkula Srikanth",
    qualifications: "MBBS (Osm), MS(General Surgery), DNB Surgical Oncology, FMAS, FIAFES",
    specialty: "Surgical Oncology & General Surgery",
    image: "/media/surgical-oncologist.jpeg",
    alt: "Dr. Jakkula Srikanth, Surgical Oncologist at SANSA Hospital",
    description:
      "Consultation for general surgery, surgical oncology and urological surgeries. Contact the team to discuss your surgical care needs.",
    appointmentDepartment: "Surgical Oncology",
    portrait: true,
    pendingDetails: false,
  },
];

export const additionalSpecialties = [
  {
    key: "cardiology",
    name: "Cardiology",
    path: "/Cardiology",
    label: "Heart care",
    summary:
      "Cardiology services including ECG, 2D echo and cardiac monitoring.",
    headline: "Specialist attention for your heart health.",
    image: additionalDoctors[0].image,
    imageAlt: additionalDoctors[0].alt,
    portrait: true,
    doctor: 2,
    info: {
      description:
        "SANSA Hospital offers cardiology services including ECG, 2D echo and cardiac monitoring. Contact our team to discuss a consultation and the available services.",
    },
    cards: [
      {
        title: "ECG",
        description:
          "ECG services are available through the cardiology department. Contact our team for appointment information.",
      },
      {
        title: "2D ECHO",
        description:
          "2D echo is included in our cardiology services. Speak with the team about arranging your visit.",
      },
      {
        title: "CARDIAC MONITORING",
        description:
          "Cardiac monitoring is part of our cardiology services. The specialist will discuss your care requirements.",
      },
    ],
    plannedService: {
      title: "Cath lab — planned for the future",
      description:
        "A cath lab is planned for the future. It is not currently listed as an available service. Please contact the hospital for updates.",
    },
  },
  {
    key: "surgical-oncology",
    name: "Surgical Oncology",
    path: "/Surgical-Oncology",
    label: "General, cancer & urological surgery",
    summary:
      "Consultations for general surgery, surgical oncology and urological surgeries.",
    headline: "Surgical care with a personal approach.",
    image: additionalDoctors[1].image,
    imageAlt: additionalDoctors[1].alt,
    portrait: true,
    doctor: 3,
    info: {
      description:
        "SANSA Hospital provides general surgery, surgical oncology and urological surgeries. Speak with the team about the procedure you need and arrange a specialist consultation to discuss your care.",
    },
    cards: [
      {
        title: "GENERAL SURGERY",
        description:
          "General surgery services are available. Contact the hospital to discuss the procedure you need and arrange a surgical consultation.",
      },
      {
        title: "SURGICAL ONCOLOGY",
        description:
          "Surgical oncology consultations are available to discuss cancer-related surgical care. The specialist will discuss the approach appropriate to your circumstances.",
      },
      {
        title: "UROLOGICAL SURGERIES",
        description:
          "Urological surgeries are included in our surgical services. Contact the team to discuss your requirements and consultation availability.",
      },
    ],
  },
];

export const additionalAppointmentDepartments = [
  "Cardiology",
  "Surgical Oncology",
];
