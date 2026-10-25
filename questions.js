/* Questions du prototype — version 5.
   Chaque question porte sur ce que le SERVICE ou ses PROFESSIONNELS ont fait, dans la situation réelle
   de la personne. Tout est au passé : la personne répond après la fin de l'accompagnement.
   Enfants et adolescents : « un éducateur ou une éducatrice » + nom de l'établissement (ID.educDe).
   Adultes : « les professionnels », « le service ».

   type : "scale" (curseur continu 0-100, le mot de la zone s'affiche dessous comme repère),
          "yesno", "choice3", "text".
   Une liste par accompagnement ET par personne qui répond. Quand une seule personne peut répondre,
   l'écran « Qui répond ? » n'apparaît pas.
   Les identifiants (id) sont repris tels quels dans les données jointes au PDF. */

const ECHELLE_ACCORD = ["Pas du tout", "Plutôt non", "Moyennement", "Plutôt oui", "Tout à fait"];
const RYTHME = ["Pas assez", "Assez", "Trop"];

window.ACCOMPAGNEMENTS = {
  accueil:  "Accueil en établissement (foyer, internat d’urgence, pouponnière)",
  domicile: "Accompagnement à la maison",
  parental: "Centre parental",
  assfam:   "Soutien aux assistants familiaux",
  tiers:    "Accompagnement des tiers (dignes de confiance, durables et bénévoles)"
};

/* qui peut répondre — l'ordre est celui de l'écran « Qui répond ? » */
window.REPONDANTS = {
  enfant: "Un enfant",
  ado: "Un adolescent",
  parent: "Un parent",
  assfam: "L’assistant familial",
  tiers: "Le tiers"
};
window.PUBLIC_DOC = { enfant: "Enfant", ado: "Adolescent", parent: "Parent", assfam: "Assistant familial", tiers: "Tiers" };

const S5 = (id, t) => ({ id, type: "scale", labels: ECHELLE_ACCORD, t });
const YN = (id, t) => ({ id, type: "yesno", t });
const C3 = (id, t, choices = RYTHME) => ({ id, type: "choice3", choices, t });
const TX = (id, t) => ({ id, type: "text", t });

const EDUC = `un éducateur ou une éducatrice ${(window.ID && ID.educDe) || ""}`.trim();

window.QUESTIONS = {
  enfant: {
    accueil: [
      YN("debut_explique", `À ton arrivée, ${EDUC} t’a expliqué pourquoi tu étais accueilli ?`),
      S5("securite", "Pendant ton accueil, tu te sentais en sécurité ?"),
      YN("educ_confiance", "Parmi les éducateurs et les éducatrices, il y en avait un à qui tu pouvais parler quand ça n’allait pas ?"),
      S5("ecoute", "Les éducateurs et les éducatrices t’écoutaient quand tu avais quelque chose à dire ?"),
      YN("regles_expliquees", "Les règles du foyer, on te les a expliquées ?"),
      YN("livret", "On t’a montré et expliqué le livret d’accueil ?"),
      S5("regles_justes", "Tu trouvais ces règles justes ?"),
      S5("chez_soi", "Dans ta chambre, tu te sentais un peu chez toi ?"),
      C3("famille", "Les moments avec ta famille, c’était…"),
      S5("continuite", "Les éducateurs et les éducatrices t’ont aidé à garder ce qui comptait pour toi : l’école, tes activités, tes copains ?"),
      YN("projet", "On t’a demandé ton avis pour écrire ton projet, le papier qui dit pour quoi on allait t’aider ?"),
      YN("juge", "Avant de voir le juge, un éducateur ou une éducatrice t’a dit ce que le service allait lui proposer ?"),
      YN("fin", "Pour ton départ, on t’a demandé ton avis sur l’endroit où tu irais vivre ?"),
      S5("utile", "Ton passage au foyer t’a aidé ?"),
      TX("aide", "Qu’est-ce que les éducateurs et les éducatrices ont fait qui t’a aidé ?"),
      TX("changer", "Si tu pouvais changer une chose au foyer, ce serait quoi ?")
    ],
    domicile: [
      YN("debut_explique", `Au début, ${EDUC} t’a expliqué pourquoi il venait voir ta famille ?`),
      YN("livret", "On t’a montré et expliqué le livret d’accueil du service ?"),
      S5("aise", "Tu étais à l’aise pour parler avec l’éducateur ou l’éducatrice ?"),
      S5("ecoute", "L’éducateur ou l’éducatrice t’écoutait quand tu avais quelque chose à dire ?"),
      YN("seul", "Tu as pu voir l’éducateur ou l’éducatrice sans tes parents, quand tu en avais besoin ?"),
      C3("rythme", "Les visites de l’éducateur ou de l’éducatrice, c’était…"),
      S5("objectifs", "Tu savais à quoi l’éducateur ou l’éducatrice devait aider ta famille ?"),
      YN("avis", "L’éducateur ou l’éducatrice te demandait ton avis sur ce qui te concernait ?"),
      YN("projet", "On t’a demandé ton avis pour écrire ton projet, le papier qui dit pour quoi on allait aider ta famille ?"),
      S5("visites_mediatisees", "Quand tu voyais tes parents avec l’éducateur ou l’éducatrice présent, ça t’a aidé ?"),
      YN("juge", "Avant de voir le juge, l’éducateur ou l’éducatrice t’a dit ce que le service allait lui proposer ?"),
      YN("fin", "On t’a expliqué pourquoi l’éducateur ou l’éducatrice ne viendrait plus ?"),
      S5("utile", "Depuis que l’éducateur ou l’éducatrice est venu, ça va mieux à la maison ?"),
      TX("aide", "Qu’est-ce que l’éducateur ou l’éducatrice a fait qui t’a aidé ?"),
      TX("changer", "Si tu pouvais changer une chose, ce serait quoi ?")
    ]
  },
  ado: {
    accueil: [
      YN("debut_explique", `À ton arrivée, ${EDUC} t’a expliqué pourquoi tu étais accueilli ?`),
      YN("livret", "On t’a présenté et expliqué le livret d’accueil ?"),
      S5("securite", "Pendant ton accueil, tu te sentais en sécurité ?"),
      YN("educ_confiance", "Parmi les éducateurs et les éducatrices, il y en avait un à qui tu pouvais parler quand ça n’allait pas ?"),
      S5("ecoute", "Les professionnels tenaient compte de ce que tu disais ?"),
      S5("regles_justes", "Les règles du service, tu les trouvais justes ?"),
      YN("regles_avis", "Tu as pu donner ton avis sur ces règles ?"),
      S5("intimite", "Tu avais assez d’intimité et de moments à toi ?"),
      C3("famille", "Les contacts avec ta famille, c’était…"),
      S5("continuite", "Les professionnels t’ont aidé à garder ce qui comptait pour toi : l’école, tes activités, tes amis ?"),
      YN("projet", "Tu as participé à l’écriture de ton projet, le document qui fixait tes objectifs ?"),
      YN("juge", "Avant l’audience, un éducateur ou une éducatrice t’a parlé de ce que le service allait écrire au juge ?"),
      YN("cvs", "Tu connaissais le conseil de la vie sociale (CVS), où les jeunes donnent leur avis sur le service ?"),
      YN("fin", "On t’a demandé ton avis sur l’endroit où tu irais vivre après ?"),
      S5("utile", "Ton accueil t’a aidé ?"),
      TX("aide", "Qu’est-ce que les professionnels ont fait qui t’a aidé ?"),
      TX("changer", "Qu’est-ce que le service devrait changer ?")
    ],
    domicile: [
      YN("debut_explique", `Au début, ${EDUC} t’a expliqué pourquoi le service intervenait dans ta famille ?`),
      YN("livret", "On t’a présenté et expliqué le livret d’accueil du service ?"),
      S5("aise", "Tu étais à l’aise pour parler avec l’éducateur ou l’éducatrice ?"),
      S5("ecoute", "L’éducateur ou l’éducatrice tenait compte de ce que tu disais ?"),
      YN("seul", "Tu as pu voir l’éducateur ou l’éducatrice sans tes parents, quand tu en avais besoin ?"),
      C3("rythme", "Les rencontres avec l’éducateur ou l’éducatrice, c’était…"),
      S5("moments", "Les rendez-vous tombaient à des moments qui t’allaient (école, activités) ?"),
      S5("visites_mediatisees", "Quand tu voyais tes parents avec l’éducateur ou l’éducatrice présent, ça t’a aidé ?"),
      S5("objectifs", "Tu savais à quoi l’accompagnement devait t’aider ?"),
      YN("projet", "Tu as participé à l’écriture de ton projet, le document qui fixait les objectifs ?"),
      YN("juge", "Avant l’audience, l’éducateur ou l’éducatrice t’a parlé de ce que le service allait écrire au juge ?"),
      YN("cvs", "Tu connaissais le conseil de la vie sociale (CVS), où les jeunes donnent leur avis sur le service ?"),
      YN("fin", "L’éducateur ou l’éducatrice t’a expliqué pourquoi l’accompagnement s’arrêtait ?"),
      S5("utile", "L’accompagnement a aidé ta famille ?"),
      TX("aide", "Qu’est-ce que l’éducateur ou l’éducatrice a fait qui t’a aidé ?"),
      TX("changer", "Qu’est-ce que le service devrait changer ?")
    ]
  },
  parent: {
    accueil: [
      YN("debut_explique", "À l’arrivée de votre enfant, les professionnels vous ont-ils expliqué comment allait se passer son accueil ?"),
      YN("livret", "Les professionnels vous ont-ils présenté le livret d’accueil ?"),
      YN("cvs", "Vous a-t-on expliqué que vous pouviez participer au conseil de la vie sociale (CVS) ?"),
      S5("securite_enfant", "Selon vous, votre enfant était-il en sécurité ?"),
      S5("informe_quotidien", "Les professionnels vous informaient-ils de ce qui comptait pour votre enfant : santé, école, incidents ?"),
      S5("role_parent", "Les professionnels ont-ils favorisé votre rôle de parent : rendez-vous médicaux, école ?"),
      YN("projet", "Avez-vous participé à l’écriture du projet de votre enfant ?"),
      C3("contacts", "Les contacts avec votre enfant (visites, appels) étaient…"),
      S5("ecoute", "Vous êtes-vous senti écouté par les professionnels ?"),
      S5("respect", "Vous êtes-vous senti respecté dans votre place de parent ?"),
      YN("juge", "Les écrits destinés au juge vous ont-ils été présentés avant l’audience ?"),
      S5("annonce", "Ce que le service vous avait annoncé a-t-il été respecté ?"),
      YN("fin", "La fin de l’accueil a-t-elle été préparée avec vous ?"),
      S5("utile", "Selon vous, l’accueil a-t-il aidé votre enfant et votre famille ?"),
      TX("aide", "Qu’est-ce que les professionnels ont fait qui vous a aidé ?"),
      TX("changer", "Qu’est-ce que le service devrait améliorer ?")
    ],
    domicile: [
      YN("debut_explique", "Au début, les professionnels vous ont-ils expliqué pourquoi le service intervenait et ce que le juge avait décidé ?"),
      YN("livret", "Les professionnels vous ont-ils présenté le livret d’accueil du service ?"),
      YN("cvs", "Vous a-t-on expliqué que vous pouviez participer au conseil de la vie sociale (CVS) ?"),
      S5("objectifs", "Les objectifs de l’accompagnement étaient-ils clairs pour vous ?"),
      YN("projet", "Avez-vous participé à l’écriture du projet de votre enfant, le document qui fixait les objectifs de l’accompagnement ?"),
      C3("rythme", "Les rencontres avec les professionnels étaient…"),
      S5("contraintes", "Les rendez-vous tenaient-ils compte de vos contraintes : travail, enfants, transports ?"),
      S5("ecoute", "Vous êtes-vous senti écouté par les professionnels ?"),
      S5("respect", "Vous êtes-vous senti respecté dans votre place de parent ?"),
      S5("visites_mediatisees", "Pendant les visites en présence d’un professionnel, vous êtes-vous senti respecté comme parent ?"),
      YN("juge", "Les écrits destinés au juge vous ont-ils été présentés avant l’audience ?"),
      S5("annonce", "Ce que le service vous avait annoncé a-t-il été respecté ?"),
      YN("fin", "La fin de l’accompagnement a-t-elle été préparée avec vous ?"),
      S5("utile", "L’accompagnement vous a-t-il aidé dans votre rôle de parent ?"),
      TX("aide", "Qu’est-ce que les professionnels ont fait qui vous a aidé ?"),
      TX("changer", "Qu’est-ce que le service devrait améliorer ?")
    ],
    parental: [
      YN("debut_explique", "À votre arrivée, les professionnels vous ont-ils expliqué le fonctionnement du centre et ses règles de vie ?"),
      YN("livret", "Les professionnels vous ont-ils présenté le livret d’accueil ?"),
      YN("cvs", "Vous a-t-on expliqué que vous pouviez participer au conseil de la vie sociale (CVS) ?"),
      YN("projet", "Avez-vous construit avec les professionnels votre projet, avec vos propres objectifs ?"),
      S5("securite", "Vous sentiez-vous en sécurité au centre, vous et votre enfant ?"),
      S5("intimite", "Votre logement vous laissait-il assez d’intimité ?"),
      S5("soins", "Les professionnels vous ont-ils aidé à prendre soin de votre enfant : repas, sommeil, santé ?"),
      S5("choix", "Les professionnels respectaient-ils vos choix de parent ?"),
      S5("sans_jugement", "Vous êtes-vous senti soutenu sans être jugé ?"),
      S5("disponible", "Les professionnels étaient-ils disponibles quand vous en aviez besoin, y compris le soir ?"),
      S5("demarches", "Les professionnels vous ont-ils aidé dans vos démarches : logement, papiers, travail, formation ?"),
      YN("ecrits", "Les bilans vous concernant vous ont-ils été présentés avant d’être transmis ?"),
      YN("fin", "Votre départ a-t-il été préparé avec vous : logement, suite de l’accompagnement ?"),
      S5("utile", "Le séjour vous a-t-il aidé à vous sentir plus sûr de vous comme parent ?"),
      TX("aide", "Qu’est-ce que les professionnels ont fait qui vous a aidé ?"),
      TX("changer", "Qu’est-ce que le centre devrait améliorer ?")
    ]
  },
  assfam: {
    assfam: [
      YN("debut_explique", "Au début de cet accompagnement, les professionnels vous ont-ils expliqué ce qu’ils pouvaient vous apporter ?"),
      S5("delai", "Quand vous avez demandé cet accompagnement, le service a-t-il répondu assez vite ?"),
      C3("rythme", "Les séances d’analyse de la pratique étaient…"),
      S5("contraintes", "Les horaires et les lieux des séances tenaient-ils compte de vos contraintes ?"),
      S5("liberte", "Vous sentiez-vous libre d’y parler de vos difficultés ?"),
      S5("disponible", "Les professionnels du service étaient-ils joignables quand vous aviez besoin d’eux ?"),
      S5("partenaires", "Le service vous a-t-il aidé dans vos relations avec les autres professionnels autour de l’enfant : référent, école, soins ?"),
      YN("redemander", "Saviez-vous que vous pouviez redemander un accompagnement en cas de difficulté ?"),
      YN("fin", "La fin de l’accompagnement a-t-elle été préparée avec vous ?"),
      S5("utile", "L’accompagnement vous a-t-il aidé à prendre du recul sur ce que vous viviez avec les enfants accueillis ?"),
      TX("aide", "Qu’est-ce que le service a fait qui vous a aidé ?"),
      TX("changer", "Qu’est-ce que le service devrait améliorer ?")
    ]
  },
  tiers: {
    tiers: [
      YN("debut_explique", "Au début, les professionnels vous ont-ils expliqué votre rôle, vos droits et ce que le juge attendait ?"),
      YN("livret", "Les professionnels vous ont-ils présenté le livret d’accueil du service ?"),
      YN("cvs", "Vous a-t-on expliqué que vous pouviez participer au conseil de la vie sociale (CVS) ?"),
      C3("rythme", "Les rencontres avec les professionnels étaient…"),
      S5("disponible", "Les professionnels étaient-ils joignables quand vous aviez besoin d’eux ?"),
      S5("soutien", "Le service vous a-t-il soutenu dans l’éducation de l’enfant au quotidien ?"),
      S5("demarches", "Le service vous a-t-il aidé dans les démarches : école, santé, aides financières ?"),
      S5("relation_parents", "Le service vous a-t-il aidé dans vos relations avec les parents de l’enfant ?"),
      S5("ecoute", "Vous êtes-vous senti écouté par les professionnels ?"),
      YN("transmis", "Les professionnels vous ont-ils dit ce qu’ils transmettaient à votre sujet ?"),
      YN("fin", "La fin de l’accompagnement a-t-elle été préparée avec vous ?"),
      S5("utile", "L’accompagnement vous a-t-il aidé à accueillir l’enfant ?"),
      TX("aide", "Qu’est-ce que les professionnels ont fait qui vous a aidé ?"),
      TX("changer", "Qu’est-ce que le service devrait améliorer ?")
    ]
  }
};

window.AIDE = [
  ["119", "Enfance en danger, jour et nuit"],
  ["3919", "Violences faites aux femmes, jour et nuit"],
  ["116 006", "Aide aux victimes, tous les jours"],
  ["3114", "Souffrance, idées noires, jour et nuit"],
  ["0 800 235 236", "Fil Santé Jeunes, 12-25 ans"],
  ["15 · 17 · 112", "Urgences : SAMU, police, numéro européen"]
];
