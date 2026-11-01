import { GlossaryItem, ChecklistItem } from '../types';

export const FOOD_RESTRICTIONS = [
  {
    category: 'Viandes',
    title: 'Viandes crues, saignantes ou fumées',
    examples: 'Carpaccio, tartare, steak saignant',
    risk: 'Toxoplasmose & Salmonelle',
    recommendation: 'Cuisson à cœur impérative (> 71°C). Aucune trace rosée.',
  },
  {
    category: 'Poissons & Fruits de mer',
    title: 'Poissons crus, fumés et coquillages',
    examples: 'Sushis, sashimis, saumon fumé, huîtres crues',
    risk: 'Listériose, toxines et vers parasites (anisakis)',
    recommendation: 'Consommer uniquement du poisson bien cuit à la vapeur ou au four.',
  },
  {
    category: 'Fromages & Produits laitiers',
    title: 'Lait cru et croûtes fleuries',
    examples: 'Brie, camembert au lait cru, roquefort, reblochon',
    risk: 'Listériose (bactérie Listeria monocytogenes)',
    recommendation: 'Préférer les fromages pasteurisés à pâte cuite (comté, emmental) et retirer les croûtes.',
  },
  {
    category: 'Œufs',
    title: 'Œufs crus ou peu cuits',
    examples: 'Œufs à la coque, mayonnaise maison, mousse au chocolat artisanale, tiramisu',
    risk: 'Salmonellose',
    recommendation: 'Œufs durs ou préparations industrielles à base d\'œufs pasteurisés.',
  },
  {
    category: 'Charcuterie',
    title: 'Charcuterie crue ou séchée',
    examples: 'Jambon cru, saucisson sec, rillettes, pâté artisanal',
    risk: 'Toxoplasmose et listériose',
    recommendation: 'Seul le jambon blanc pasteurisé sous vide est autorisé.',
  },
];

export const HYGIENE_AND_NUTRITION = {
  fruitVeg: 'Lavez scrupuleusement tous les fruits, légumes crus et herbes aromatiques à grande eau (avec éventuellement quelques gouttes de vinaigre blanc) pour éliminer les oocystes de toxoplasme. Évitez les crudités hors de votre domicile si le lavage n\'est pas garanti.',
  supplements: [
    {
      name: 'Acide folique (Vitamine B9 / 400 µg/j ou 5 mg si antécédents)',
      timing: 'Pré-conception et tout le 1er trimestre',
      purpose: 'Prévention des anomalies de fermeture du tube neural (spina bifida).',
    },
    {
      name: 'Vitamine D3 (Cholécalciférol)',
      timing: 'En ampoule au 6e/7e mois ou quotidienne',
      purpose: 'Fixation optimale du calcium sur le squelette fœtal.',
    },
    {
      name: 'Fer (Tardyféron / Fumafer)',
      timing: 'Selon bilan sanguin / anémie',
      purpose: 'Prévention de la fatigue maternelle et oxygénation fœtale.',
    },
  ],
  hydration: [
    'Consommez au moins 1,5 à 2 litres d\'eau minérale ou filtrée par jour pour prévenir les infections urinaires, la constipation et assurer un bon volume de liquide amniotique.',
    'Zéro alcool dès la conception : l\'alcool franchit librement le placenta sans barrière protectrice.',
    'Limitez la caféine à 200 mg par jour maximum (1 à 2 tasses de café par jour).',
    'Bannissez totalement les boissons énergisantes et sodas stimulants.',
  ],
};

export const WARNING_SIGNS = [
  {
    id: 'bleeding',
    title: 'Pertes de sang vaginales',
    description: 'Pertes de sang rouges, continues ou accompagnées de douleurs pelviennes.',
    urgency: 'Immédiate',
  },
  {
    id: 'contractions',
    title: 'Contractions régulières avant 37 SA',
    description: 'Contractions utérines douloureuses et rythmées (plus de 4 par heure avant 37 SA).',
    urgency: 'Immédiate',
  },
  {
    id: 'leakage',
    title: 'Fuite ou écoulement continu de liquide tiède',
    description: 'Suspicion de fissure ou rupture prématurée de la poche des eaux.',
    urgency: 'Immédiate',
  },
  {
    id: 'headache_vision',
    title: 'Maux de tête violents & troubles visuels',
    description: 'Céphalées rebelles au paracétamol, mouches volantes, éclairs ou bourdonnements d\'oreille (signes de pré-éclampsie).',
    urgency: 'Urgence Vitale',
  },
  {
    id: 'edema',
    title: 'Gonflement soudain du visage, mains ou pieds',
    description: 'Prise de poids fulgurante (>1,5 kg en quelques jours) avec œdèmes marqués.',
    urgency: 'Immédiate',
  },
  {
    id: 'reduced_movement',
    title: 'Diminution nette des mouvements fœtaux',
    description: 'Absence inhabituelle de mouvements de bébé sur plus de 12 à 24 heures après 24 SA.',
    urgency: 'Immédiate',
  },
  {
    id: 'fever',
    title: 'Fièvre supérieure à 38°C',
    description: 'Fièvre inexpliquée sans point d\'appel clair, frissons ou courbatures intenses.',
    urgency: 'Rapide (2h)',
  },
];

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: 'SA (Semaines d\'Aménorrhée)',
    definition: 'Nombre de semaines écoulées depuis le premier jour des dernières règles (DDR). Unité de mesure officielle des professionnels de santé.',
  },
  {
    term: 'DPA (Date Prévue d\'Accouchement)',
    definition: 'Date théorique calculée à 41 SA révolues en France (soit 39 semaines de grossesse effective / 287 jours).',
  },
  {
    term: 'Colostrum',
    definition: 'Premier liquide nourricier produit par les seins dès le 3e trimestre et les premiers jours de vie, doré et ultra-concentré en immunoglobulines (IgA).',
  },
  {
    term: 'Amniocentèse',
    definition: 'Prélèvement de 15 à 20 ml de liquide amniotique par ponction transabdominale guidée par échographie, pour établir le caryotype génétique fœtal.',
  },
  {
    term: 'Contractions de Braxton-Hicks',
    definition: 'Contractions physiologiques d\'entraînement de l\'utérus, irrégulières, sans rythme fixe, non douloureuses, n\'agissant pas sur la dilatation du col.',
  },
  {
    term: 'DPNI (Dépistage Prénatal Non Invasif)',
    definition: 'Analyse de l\'ADN fœtal libre circulant dans le sang maternel, permettant de dépister avec une sensibilité > 99 % la trisomie 21 sans geste invasif.',
  },
  {
    term: 'Clarté Nucale',
    definition: 'Espace sous-cutané translucide situé à la nuque du fœtus, mesuré rigoureusement entre 11 SA et 13 SA + 6 jours (normale < 3 mm).',
  },
  {
    term: 'Streptocoque B (SGB)',
    definition: 'Bactérie fréquente et bénigne pour la maman mais transmissible au bébé lors du passage dans la filière génitale. Dépistée à 35-37 SA pour administrer une antibioprophylaxie pendant le travail si positive.',
  },
  {
    term: 'Progestérone',
    definition: 'Hormone lutéale essentielle sécrétée par le corps jaune puis le placenta, indispensable au maintien de la nidation embryonnaire et à la quiescence utérine.',
  },
  {
    term: 'Terme / Post-terme',
    definition: 'Une grossesse atteint son terme à 37–41 SA. Au-delà de 41 SA + 6 jours, on parle de dépassement de terme nécessitant une surveillance monitorée tous les 2 jours et un éventuel déclenchement.',
  },
];

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Baby items
  {
    id: 'pyjamas',
    label: 'Pyjamas zippés double sens (0-3 mois)',
    quantity: '4 à 6',
    isEssential: true,
    note: 'Les fermetures éclair à double sens permettent de changer bébé la nuit sans déshabiller le haut ni exposer son thorax au froid.',
    category: 'baby',
  },
  {
    id: 'bodys',
    label: 'Bodys croisés kimono manches courtes & longues (0-3 mois)',
    quantity: '6 à 8',
    isEssential: true,
    note: 'La coupe croisée s\'enfile sans forcer sur la tête et la fontanelle fragile du nouveau-né.',
    category: 'baby',
  },
  {
    id: 'gigoteuses',
    label: 'Gigoteuses (turbulettes) / langes d\'emmaillotage',
    quantity: '3 à 4',
    isEssential: true,
    note: 'Calme le réflexe de Moro et garantit un couchage sécurisé sur le dos sans couverture ni oreiller.',
    category: 'baby',
  },
  {
    id: 'siege-auto',
    label: 'Siège auto bébé (cosy groupe 0+) avec base Isofix',
    quantity: '1',
    isEssential: true,
    note: 'Obligatoire dès la sortie de maternité pour un transport sécurisé et homologué en voiture.',
    category: 'baby',
  },
  {
    id: 'berceau',
    label: 'Berceau cododo / lit avec draps-housses respirants',
    quantity: '1',
    isEssential: true,
    note: 'Matelas ferme aux dimensions exactes du couchage pour prévenir les risques de mort subite du nourrisson (MSN).',
    category: 'baby',
  },
  {
    id: 'kit-soins',
    label: 'Kit de premiers soins bébé (thermomètre rectal à embout souple, mouche-bébé, sérum physiologique)',
    quantity: '1 kit',
    isEssential: true,
    note: 'Indispensable pour nettoyer les yeux, le nez et surveiller la température corporelle dès les premiers jours.',
    category: 'baby',
  },
  // Mom items
  {
    id: 'valise-maman',
    label: 'Valise de maternité (vêtements amples, câble chargeur 3m, trousse de toilette, dossier médical)',
    quantity: '1 sac',
    isEssential: true,
    note: 'À préparer dès 36 SA. Prévoir un chargeur long, des chaussettes chaudes, brumisateur d\'eau minérale et vos pièces d\'identité / carte de groupe sanguin.',
    category: 'mom',
  },
  {
    id: 'kit-perinee',
    label: 'Kit de récupération périnéale (flacon bidet péri-bouteille, compresses d\'hamamélis, poches de froid, culottes filet jetables)',
    quantity: '1 kit',
    isEssential: true,
    note: 'Permet une hygiène intime douce à l\'eau tiède après chaque miction et apaise les œdèmes périnéaux.',
    category: 'mom',
  },
  {
    id: 'kit-allaitement',
    label: 'Kit d\'allaitement & tire-lait (soutiens-gorge d\'allaitement sans armatures, baume lanoline pure, coussinets, coussin de maternité)',
    quantity: '1 ensemble',
    isEssential: true,
    note: 'Prévient et répare les crevasses mamelonnaires, absorbe les montées de lait et soulage les bras et les lombaires lors des tétées.',
    category: 'mom',
  },
];

export const BIRTH_PLAN_TOPICS = [
  {
    id: 'ambiance',
    title: 'Accueil & Ambiance en Salle de Naissance',
    question: 'Souhaitez-vous tamiser l\'éclairage et écouter de la musique pendant le travail ?',
    options: [
      'Oui, ambiance tamisée et playlist personnelle.',
      'Éclairage standard de la salle de naissance.',
      'Pas de préférence particulière.',
    ],
  },
  {
    id: 'pain_relief',
    title: 'Gestion du Travail & Soulagement de la Douleur',
    question: 'Quelles méthodes non médicamenteuses de gestion de la douleur privilégiez-vous ?',
    options: [
      'Ballon de grossesse, marche et bains chauds.',
      'Massages et pressions lombaires par l\'accompagnant.',
      'Liberté totale de mouvement selon les sensations.',
    ],
  },
  {
    id: 'epidural',
    title: 'Péridurale',
    question: 'Quelle est votre position concernant la péridurale ?',
    options: [
      'Demande de péridurale dès que possible / souhaitée.',
      'Péridurale ambulatoire (dosée pour conserver la mobilité des jambes).',
      'Souhait d\'essayer de m\'en passer le plus longtemps possible (accouchement physiologique).',
    ],
  },
  {
    id: 'pushing',
    title: 'Phase d\'Expulsion & Poussée',
    question: 'Comment envisagez-vous la phase d\'expulsion ?',
    options: [
      'Poussée dirigée par l\'équipe médicale.',
      'Poussée spontanée au réflexe d\'éjection et selon les contractions.',
      'Utilisation d\'un miroir pour voir la naissance du bébé.',
    ],
  },
  {
    id: 'newborn_welcome',
    title: 'Accueil du Nouveau-Né',
    question: 'Quels sont vos souhaits pour les premiers moments de bébé ?',
    options: [
      'Peau à peau immédiat et ininterrompu d\'au moins 2 heures.',
      'Cordon ombilical coupé par le co-parent après l\'arrêt complet des battements.',
      'Premiers soins (mesures, pesée, bain) différés après la première tétée / tétée d\'accueil.',
    ],
  },
];
