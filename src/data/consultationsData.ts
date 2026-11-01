import { ObstetricMilestone } from '../types';

export const OBSTETRIC_MILESTONES: ObstetricMilestone[] = [
  {
    period: 'Semaines 8 à 10',
    title: 'Première Consultation Prénatale & Datation',
    location: 'Cabinet du Gynécologue-Obstétricien ou Sage-Femme',
    description: 'Premier examen prénatal officiel, ouverture du dossier de maternité, prescription du bilan sanguin du 1er trimestre et échographie de datation précoce.',
    keyExams: [
      'Échographie précoce de viabilité & datation',
      'Examen clinique complet et prise de tension',
      'Bilan sanguin et prescription d\'acide folique',
    ],
  },
  {
    period: 'Semaines 11 à 13',
    title: 'Échographie du 1er Trimestre & DPNI',
    location: 'Centre d\'Échographie Obstétricale',
    description: 'Mesure de la clarté nucale, étude de la morphologie précoce, datation précise de la grossesse et prise de sang pour le dépistage combiné de la trisomie 21 ou DPNI (ADN fœtal circulant).',
    keyExams: [
      'Échographie morphologique T1',
      'Mesure de la clarté nucale (< 3 mm)',
      'Prise de sang DPNI / Dépistage T21',
    ],
  },
  {
    period: 'Semaines 16 à 18',
    title: 'Consultation Prénatale du 4e Mois',
    location: 'Cabinet ou Maternité',
    description: 'Premier contrôle morphologique intermédiaire, écoute des battements cardiaques fœtaux, vérification de la tension artérielle, du poids et prescription du bilan sérologique du 2e trimestre.',
    keyExams: [
      'Examen clinique mensuel',
      'Bandelette urinaire (albumine et sucre)',
      'Bilan sérologique T2 (Toxoplasmose)',
    ],
  },
  {
    period: 'Semaines 20 à 22',
    title: 'Échographie Morphologique T2',
    location: 'Centre d\'Échographie Spécialisé',
    description: 'Examen détaillé organe par organe du fœtus (cerveau, cœur, reins, membres, colonne vertébrale), vérification de la quantité de liquide amniotique et de l\'insertion placentaire.',
    keyExams: [
      'Échographie morphologique de référence',
      'Doppler des artères utérines',
      'Biométrie fœtale complète (BIP, fémur, périmètre abdo)',
    ],
  },
  {
    period: 'Semaines 24 à 28',
    title: 'Test HGPO & Bilan du 6e Mois',
    location: 'Laboratoire d\'Analyses Médicales',
    description: 'Dépistage du diabète gestationnel par ingestion de 75g de glucose (HGPO) avec prises de sang à jeun, à 1h et à 2h. Contrôle de la formule sanguine (NFS) et recherche d\'agglutinines irrégulières (RAI) si rhésus négatif.',
    keyExams: [
      'HGPO (Glycémie à jeun, 1h, 2h)',
      'NFS / Ferritine (vigilance anémie)',
      'RAI si rhésus sanguin négatif',
    ],
  },
  {
    period: 'Semaines 30 à 32',
    title: 'Échographie de Croissance T3',
    location: 'Centre d\'Échographie Obstétricale',
    description: 'Évaluation de la croissance fœtale estimée, position du bébé (céphalique ou siège), quantité de liquide amniotique et bon fonctionnement placentaire.',
    keyExams: [
      'Échographie de croissance fœtale',
      'Doppler ombilical et cérébral',
      'Vérification de la présentation (tête ou siège)',
    ],
  },
  {
    period: 'Semaines 34 à 36',
    title: 'Consultation Anesthésie & Dépistage SGB',
    location: 'Maternité & Laboratoire',
    description: 'Consultation obligatoire avec le médecin anesthésiste pour valider le dossier péridurale et l\'anesthésie potentielle. Réalisation du prélèvement vaginal de dépistage du Streptocoque B (SGB).',
    keyExams: [
      'Consultation d\'anesthésie pré-opératoire',
      'Prélèvement vaginal Streptocoque B',
      'Bilan de coagulation sanguine',
    ],
  },
  {
    period: 'Semaines 37 à 40+',
    title: 'Consultations de Terme & Accouchement',
    location: 'Maternité (Salle de Naissance)',
    description: 'Suivi rapproché hebdomadaire de fin de terme avec monitoring fœtal (RCF) et examen du col utérin.',
    keyExams: [
      'Monitoring fœtal (RCF / NST)',
      'Examen clinique du col',
      'Accueil de bébé 🎉 (Surveillance post-terme à J+2 si besoin)',
    ],
  },
];
