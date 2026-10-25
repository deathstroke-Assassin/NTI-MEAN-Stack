const emps = [
  {
    name: "Ali Reda",
    job: "Frontend Developer",
    address: "Mansoura",
    age: 24,
    experience: 2,
    description:
      "Frontend developer specializing in React.js and modern responsive web interfaces. Focused on creating clean, accessible, and user-friendly applications.",
    cv: "https://example.com/cv/ali-reda.pdf",
    photo:
      "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/5.png",
  },

  {
    name: "Mariam Adel",
    job: "Plant Geneticist",
    address: "Damietta",
    age: 29,
    experience: 5,
    description:
      "Plant geneticist researching plant traits, genetic variation, and methods for improving crop characteristics through modern genetic techniques.",
    cv: "https://example.com/cv/mariam-adel.pdf",
    photo:
      "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/10.png",
  },

  {
    name: "Waleed Mohammed",
    job: "Backend Developer",
    address: "Mansoura",
    age: 26,
    experience: 3,
    description:
      "Backend developer working with Node.js, Express, and databases to build reliable APIs and server-side applications.",
    cv: "https://example.com/cv/waleed-mohammed.pdf",
    photo:
      "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/15.png",
  },

  {
    name: "Nour Hassan",
    job: "Frontend Developer",
    address: "Cairo",
    age: 25,
    experience: 2,
    description:
      "Frontend developer focused on responsive web design, JavaScript, React, and creating intuitive user interfaces.",
    cv: "https://example.com/cv/nour-hassan.pdf",
    photo:
      "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/25.png",
  },

  {
    name: "Fathy Farouk",
    job: "Plant Biologist",
    address: "Cairo",
    age: 31,
    experience: 7,
    description:
      "Plant biologist specializing in plant physiology, growth responses, and the effects of environmental conditions on plants.",
    cv: "https://example.com/cv/fathy-farouk.pdf",
    photo:
      "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/25.png",
  },

  {
    name: "Salma Mohamed",
    job: "Plant Ecologist",
    address: "Ismailia",
    age: 28,
    experience: 4,
    description:
      "Plant ecologist studying plant communities, environmental interactions, biodiversity, and ecosystem responses to climate change.",
    cv: "https://example.com/cv/salma-mohamed.pdf",
    photo:
      "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/45.png",
  },

  {
    name: "Omar Hassan",
    job: "Botany Researcher",
    address: "Alexandria",
    age: 33,
    experience: 8,
    description:
      "Botany researcher involved in plant classification, laboratory studies, and research into plant adaptation and environmental stress.",
    cv: "https://example.com/cv/omar-hassan.pdf",
    photo:
      "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png",
  },

  {
    name: "Yasmine Khaled",
    job: "Data Analyst - Botany",
    address: "Zagazig",
    age: 27,
    experience: 3,
    description:
      "Data analyst combining biological knowledge with data analysis techniques to interpret experimental and botanical research data.",
    cv: "https://example.com/cv/yasmine-khaled.pdf",
    photo:
      "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/68.png",
  },

  {
    name: "Ahmed Mahmoud",
    job: "Full Stack Developer",
    address: "Tanta",
    age: 30,
    experience: 6,
    description:
      "Full stack developer experienced in building web applications using JavaScript, Node.js, Express, React, and database technologies.",
    cv: "https://example.com/cv/ahmed-mahmoud.pdf",
    photo:
      "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/86.png",
  },

  {
    name: "Hana Ibrahim",
    job: "Full Stack Developer",
    address: "Port Said",
    age: 26,
    experience: 4,
    description:
      "Full stack developer focused on building complete web applications and integrating frontend interfaces with scalable backend services.",
    cv: "https://example.com/cv/hana-ibrahim.pdf",
    photo:
      "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/female/90.png",
  },
];

const staffModel = () => {
  return {
    emps: emps,
  };
};

module.exports = staffModel;