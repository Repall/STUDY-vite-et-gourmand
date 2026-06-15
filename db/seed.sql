-- =============================================================================
--  Vite & Gourmand — Jeu de données d'intégration (PostgreSQL)
-- =============================================================================
--  Fichier d'INTÉGRATION des données, écrit à la main (pas de fixture/migration).
--  À exécuter APRÈS schema.sql sur une base vierge (les SERIAL démarrent à 1,
--  les identifiants ci-dessous correspondent donc à l'ordre d'insertion).
--
--  Comptes de démonstration (mots de passe respectant la politique : 10+ car.,
--  1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial ; hash bcrypt) :
--    - ADMIN    : admin@vitegourmand.fr     / Admin@2026!Vg
--    - EMPLOYÉ  : employe@vitegourmand.fr   / Employe2026!
--    - CLIENT 1 : jean.dupont@example.com   / Client@2026Vg
--    - CLIENT 2 : marie.martin@example.com  / Client@2026Vg
--  (L'admin n'est PAS créable depuis l'application : il est inséré ici / en base.)
-- =============================================================================

-- Réinitialise les données (ordre inverse des dépendances) et les compteurs SERIAL.
TRUNCATE contact, token_reset, avis, suivi_commande, commande, image,
         plat_allergene, menu_plat, menu, plat, allergene, regime, theme,
         horaire, utilisateur, role
RESTART IDENTITY CASCADE;

-- -----------------------------------------------------------------------------
--  Références
-- -----------------------------------------------------------------------------

INSERT INTO role (libelle) VALUES
    ('utilisateur'),   -- 1
    ('employe'),       -- 2
    ('admin');         -- 3

INSERT INTO theme (libelle) VALUES
    ('Noël'),          -- 1
    ('Pâques'),        -- 2
    ('classique'),     -- 3
    ('évènement');     -- 4

INSERT INTO regime (libelle) VALUES
    ('classique'),     -- 1
    ('végétarien'),    -- 2
    ('vegan');         -- 3

INSERT INTO allergene (libelle) VALUES
    ('Gluten'),            -- 1
    ('Lactose'),           -- 2
    ('Œuf'),               -- 3
    ('Fruits à coque'),    -- 4
    ('Crustacés'),         -- 5
    ('Soja'),              -- 6
    ('Moutarde'),          -- 7
    ('Poisson');           -- 8

INSERT INTO horaire (jour, heure_ouverture, heure_fermeture, ferme) VALUES
    ('lundi',     '09:00', '18:00', FALSE),
    ('mardi',     '09:00', '18:00', FALSE),
    ('mercredi',  '09:00', '18:00', FALSE),
    ('jeudi',     '09:00', '18:00', FALSE),
    ('vendredi',  '09:00', '19:00', FALSE),
    ('samedi',    '10:00', '17:00', FALSE),
    ('dimanche',   NULL,    NULL,   TRUE);   -- fermé

-- -----------------------------------------------------------------------------
--  Utilisateurs (mots de passe = hash bcrypt, cost 10)
-- -----------------------------------------------------------------------------

INSERT INTO utilisateur
    (email, password, prenom, nom, telephone, adresse_postale, ville, pays, role_id, actif, consentement_rgpd)
VALUES
    ('admin@vitegourmand.fr',
     '$2b$10$7oPXadulyR2TiOICBPt4De57yTUF1U5h8h9scJ6eHlmA0ju830IBO',
     'José', 'Admin', '0600000001', '12 cours de l''Intendance', 'Bordeaux', 'France', 3, TRUE, TRUE),   -- 1
    ('employe@vitegourmand.fr',
     '$2b$10$PfhAyFhNRy4HrL6PWbf2EeqPhnTLXap7k6UpGrffkTnaP4Y9JCRmy',
     'Julie', 'Employee', '0600000002', '12 cours de l''Intendance', 'Bordeaux', 'France', 2, TRUE, TRUE),  -- 2
    ('jean.dupont@example.com',
     '$2b$10$vPR5lose6.WSjyxnesvVberJ88Bq1AlidU9LvzfDeSX.Vwn/RD92G',
     'Jean', 'Dupont', '0611111111', '5 rue Sainte-Catherine', 'Bordeaux', 'France', 1, TRUE, TRUE),       -- 3
    ('marie.martin@example.com',
     '$2b$10$RCqIybeWpuEGCSWPKe5Y1utX2MRjUOGT8SsSyNexTstIcdoKyRM0i',
     'Marie', 'Martin', '0622222222', '8 avenue de la Marne', 'Mérignac', 'France', 1, TRUE, TRUE);        -- 4

-- -----------------------------------------------------------------------------
--  Plats
-- -----------------------------------------------------------------------------

INSERT INTO plat (titre_plat, photo_url) VALUES
    ('Velouté de potimarron',          '/images/plats/veloute-potimarron.jpg'),   -- 1
    ('Foie gras maison & chutney',     '/images/plats/foie-gras.jpg'),            -- 2
    ('Salade landaise',                '/images/plats/salade-landaise.jpg'),      -- 3
    ('Chapon farci aux marrons',       '/images/plats/chapon-marrons.jpg'),       -- 4
    ('Filet de bar, beurre blanc',     '/images/plats/filet-bar.jpg'),            -- 5
    ('Risotto crémeux aux cèpes',      '/images/plats/risotto-cepes.jpg'),        -- 6
    ('Bûche chocolat-praliné',         '/images/plats/buche-chocolat.jpg'),       -- 7
    ('Pavlova aux fruits rouges',      '/images/plats/pavlova.jpg'),              -- 8
    ('Tarte fine aux pommes',          '/images/plats/tarte-pommes.jpg');         -- 9

-- Allergènes par plat (relation N-N « contient »).
INSERT INTO plat_allergene (plat_id, allergene_id) VALUES
    (1, 2),                       -- Velouté : lactose
    (2, 1),                       -- Foie gras : gluten (pain d'épices)
    (3, 3), (3, 7),               -- Salade landaise : œuf, moutarde
    (4, 1), (4, 4),               -- Chapon : gluten, fruits à coque
    (5, 8), (5, 2),               -- Bar : poisson, lactose
    (6, 2),                       -- Risotto : lactose
    (7, 1), (7, 2), (7, 3), (7, 4), (7, 6),   -- Bûche : gluten, lactose, œuf, fruits à coque, soja
    (8, 3), (8, 2),               -- Pavlova : œuf, lactose
    (9, 1), (9, 2);               -- Tarte pommes : gluten, lactose

-- -----------------------------------------------------------------------------
--  Menus
-- -----------------------------------------------------------------------------

INSERT INTO menu
    (titre, description, conditions, nombre_personne_minimum, prix_base, theme_id, regime_id, quantite_restante)
VALUES
    ('Festin de Noël',
     'Un menu festif et généreux pour célébrer les fêtes en famille.',
     'À commander au moins 7 jours avant la prestation. Conserver au réfrigérateur, à consommer sous 48h.',
     6, 240.00, 1, 1, 5),       -- menu 1
    ('Pâques Gourmand',
     'Fraîcheur printanière et produits de saison pour un repas de Pâques raffiné.',
     'À commander au moins 5 jours avant la prestation. Conserver au frais.',
     4, 160.00, 2, 1, 8),       -- menu 2
    ('Menu Végétarien d''Automne',
     'Une carte 100% végétarienne mettant en valeur les légumes de saison.',
     'À commander au moins 3 jours avant la prestation.',
     4, 140.00, 3, 2, 10),      -- menu 3
    ('Cocktail Évènementiel',
     'Buffet dînatoire pour vos évènements professionnels et privés.',
     'À commander au moins 14 jours avant la prestation. Du matériel (mange-debout) est prêté : restitution sous 10 jours ouvrés, sous peine de 600 € de frais (voir CGV).',
     10, 350.00, 4, 1, 3);      -- menu 4

-- Composition des menus (entrée / plat / dessert) — relation N-N avec catégorie.
INSERT INTO menu_plat (menu_id, plat_id, categorie) VALUES
    (1, 2, 'entree'), (1, 4, 'plat'), (1, 7, 'dessert'),   -- Festin de Noël
    (2, 3, 'entree'), (2, 5, 'plat'), (2, 8, 'dessert'),   -- Pâques Gourmand
    (3, 1, 'entree'), (3, 6, 'plat'), (3, 9, 'dessert'),   -- Végétarien d'Automne
    (4, 2, 'entree'), (4, 5, 'plat'), (4, 7, 'dessert');   -- Cocktail Évènementiel

-- Galerie d'images des menus (1 menu -> N images).
INSERT INTO image (menu_id, url, alt, position) VALUES
    (1, '/images/menus/noel-1.jpg',       'Table de Noël dressée avec le menu Festin de Noël', 0),
    (1, '/images/menus/noel-2.jpg',       'Gros plan sur le chapon farci aux marrons', 1),
    (2, '/images/menus/paques-1.jpg',     'Assiette printanière du menu Pâques Gourmand', 0),
    (3, '/images/menus/vegetarien-1.jpg', 'Risotto crémeux aux cèpes du menu végétarien', 0),
    (4, '/images/menus/cocktail-1.jpg',   'Buffet dînatoire du cocktail évènementiel', 0);

-- -----------------------------------------------------------------------------
--  Commandes (statuts variés) + historique de suivi
--  Rappels de calcul (faits à la main pour cohérence) :
--    - prix unitaire = prix_base / nombre_personne_minimum
--    - prix_menu = prix unitaire * nombre_personne (-10% si nb >= min + 5)
--    - prix_livraison = 5 € + 0,59 €/km hors Bordeaux (0 km si Bordeaux)
-- -----------------------------------------------------------------------------

INSERT INTO commande
    (utilisateur_id, menu_id, date_commande, date_prestation, heure_livraison,
     adresse_prestation, ville_prestation, nombre_personne,
     prix_menu, distance_km, prix_livraison, reduction_appliquee,
     statut, pret_materiel, restitution_materiel)
VALUES
    -- 1) Jean, menu Végétarien, 4 pers (= min, pas de réduction), Bordeaux. TERMINÉE.
    (3, 3, now() - interval '30 days', CURRENT_DATE - 20, '12:00',
     '5 rue Sainte-Catherine', 'Bordeaux', 4,
     140.00, 0, 5.00, FALSE, 'terminee', FALSE, FALSE),
    -- 2) Marie, menu Pâques, 9 pers (min 4 +5 -> -10%), Mérignac (8 km). ACCEPTÉE.
    (4, 2, now() - interval '2 days', CURRENT_DATE + 10, '11:30',
     '8 avenue de la Marne', 'Mérignac', 9,
     324.00, 8, 9.72, TRUE, 'accepte', FALSE, FALSE),
    -- 3) Jean, menu Noël, 6 pers (= min), Bordeaux. EN ATTENTE de validation.
    (3, 1, now() - interval '1 day', CURRENT_DATE + 20, '10:00',
     '5 rue Sainte-Catherine', 'Bordeaux', 6,
     240.00, 0, 5.00, FALSE, 'en_attente', FALSE, FALSE),
    -- 4) Marie, Cocktail, 12 pers (min 10, +2 seulement -> pas de réduction), Bordeaux,
    --    matériel prêté. EN ATTENTE DU RETOUR DE MATÉRIEL.
    (4, 4, now() - interval '15 days', CURRENT_DATE - 5, '18:00',
     '8 avenue de la Marne', 'Bordeaux', 12,
     420.00, 0, 5.00, FALSE, 'attente_retour_materiel', TRUE, FALSE),
    -- 5) Marie, menu Noël, 8 pers (min 6, +2 -> pas de réduction), Bordeaux. TERMINÉE.
    (4, 1, now() - interval '40 days', CURRENT_DATE - 30, '12:00',
     '8 avenue de la Marne', 'Bordeaux', 8,
     320.00, 0, 5.00, FALSE, 'terminee', FALSE, FALSE),
    -- 6) Jean, menu Pâques, 4 pers (= min), Bordeaux. TERMINÉE.
    (3, 2, now() - interval '25 days', CURRENT_DATE - 18, '13:00',
     '5 rue Sainte-Catherine', 'Bordeaux', 4,
     160.00, 0, 5.00, FALSE, 'terminee', FALSE, FALSE);

-- Historique horodaté des statuts (suivi de commande).
INSERT INTO suivi_commande (numero_commande, statut, date_heure) VALUES
    -- Commande 1 (terminée) : cycle complet
    (1, 'en_attente',          now() - interval '30 days'),
    (1, 'accepte',             now() - interval '29 days'),
    (1, 'en_preparation',      now() - interval '21 days'),
    (1, 'en_cours_livraison',  now() - interval '20 days 2 hours'),
    (1, 'livre',               now() - interval '20 days'),
    (1, 'terminee',            now() - interval '20 days'),
    -- Commande 2 (acceptée)
    (2, 'en_attente',          now() - interval '2 days'),
    (2, 'accepte',             now() - interval '1 day'),
    -- Commande 3 (en attente)
    (3, 'en_attente',          now() - interval '1 day'),
    -- Commande 4 (attente retour matériel)
    (4, 'en_attente',          now() - interval '15 days'),
    (4, 'accepte',             now() - interval '14 days'),
    (4, 'en_preparation',      now() - interval '6 days'),
    (4, 'en_cours_livraison',  now() - interval '5 days 3 hours'),
    (4, 'livre',               now() - interval '5 days'),
    (4, 'attente_retour_materiel', now() - interval '5 days'),
    -- Commande 5 (terminée)
    (5, 'en_attente',          now() - interval '40 days'),
    (5, 'accepte',             now() - interval '39 days'),
    (5, 'en_preparation',      now() - interval '31 days'),
    (5, 'en_cours_livraison',  now() - interval '30 days 2 hours'),
    (5, 'livre',               now() - interval '30 days'),
    (5, 'terminee',            now() - interval '30 days'),
    -- Commande 6 (terminée)
    (6, 'en_attente',          now() - interval '25 days'),
    (6, 'accepte',             now() - interval '24 days'),
    (6, 'en_preparation',      now() - interval '19 days'),
    (6, 'en_cours_livraison',  now() - interval '18 days 2 hours'),
    (6, 'livre',               now() - interval '18 days'),
    (6, 'terminee',            now() - interval '18 days');

-- -----------------------------------------------------------------------------
--  Avis (publiés sur des commandes terminées ; seuls les « valide » s'affichent
--  en page d'accueil — la modération est faite par employé/admin)
-- -----------------------------------------------------------------------------

INSERT INTO avis (numero_commande, utilisateur_id, note, description, statut, cree_le) VALUES
    (1, 3, 5, 'Prestation impeccable, plats délicieux et livraison ponctuelle. Je recommande !',
        'valide', now() - interval '19 days'),
    (5, 4, 4, 'Très bon menu de Noël, copieux et savoureux. Un vrai régal en famille.',
        'valide', now() - interval '29 days'),
    (6, 3, 3, 'Bon dans l''ensemble mais le dessert manquait un peu de fraîcheur.',
        'en_attente', now() - interval '17 days');   -- en attente de modération

-- -----------------------------------------------------------------------------
--  Message de contact d'exemple
-- -----------------------------------------------------------------------------

INSERT INTO contact (titre, description, email) VALUES
    ('Demande de devis mariage',
     'Bonjour, je souhaiterais un devis pour un buffet de 80 personnes en septembre. Merci.',
     'contact.client@example.com');
