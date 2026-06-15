-- =============================================================================
--  Vite & Gourmand — Schéma de la base de données relationnelle (PostgreSQL)
-- =============================================================================
--  Fichier de CRÉATION de la base, écrit à la main (sans ORM, sans migration,
--  sans fixture) — conformément à l'exigence de l'énoncé : démontrer la maîtrise
--  du SQL (« développer des composants d'accès aux données SQL »).
--
--  Conventions :
--    - Identifiants techniques en SERIAL (auto-incrément).
--    - Horodatages en TIMESTAMPTZ (fuseau géré, bonne pratique).
--    - Montants en NUMERIC(10,2) — JAMAIS de FLOAT pour de la monnaie
--      (évite les erreurs d'arrondi).
--    - Contraintes CHECK pour fiabiliser les données au plus près du stockage.
--    - Index sur les clés étrangères et les colonnes filtrées (perf).
--
--  Corrections apportées au MCD de départ (volontairement imparfait) :
--    1. Régime : supprimé en tant que champ de `menu`, conservé en TABLE + FK.
--    2. Prix : `prix_base` = prix pour le nombre MINIMUM de personnes
--       (sémantique clarifiée ; le prix au-delà est extrapolé applicativement).
--    3. Galerie d'images : nouvelle table `image` (1 menu -> N images).
--    4. Conditions du menu : champ `conditions` ajouté sur `menu`.
--    5. Plat <-> menu : relation N-N via `menu_plat` avec catégorie
--       (entrée / plat / dessert).
--    6. Historique des statuts de commande : nouvelle table `suivi_commande`.
--    7. Annulation : motif + mode de contact ajoutés sur `commande`.
--    8. Réinitialisation de mot de passe : nouvelle table `token_reset`.
--    9. Messages de contact : nouvelle table `contact`.
--   10. Faute de frappe corrigée : restition_materiel -> restitution_materiel.
--   11. Désactivation des comptes : champ `actif` sur `utilisateur`.
-- =============================================================================

-- Suppression dans l'ordre inverse des dépendances (script ré-exécutable).
DROP TABLE IF EXISTS contact            CASCADE;
DROP TABLE IF EXISTS token_reset        CASCADE;
DROP TABLE IF EXISTS avis               CASCADE;
DROP TABLE IF EXISTS suivi_commande     CASCADE;
DROP TABLE IF EXISTS commande           CASCADE;
DROP TABLE IF EXISTS image              CASCADE;
DROP TABLE IF EXISTS plat_allergene     CASCADE;
DROP TABLE IF EXISTS menu_plat          CASCADE;
DROP TABLE IF EXISTS menu               CASCADE;
DROP TABLE IF EXISTS plat               CASCADE;
DROP TABLE IF EXISTS allergene          CASCADE;
DROP TABLE IF EXISTS regime             CASCADE;
DROP TABLE IF EXISTS theme              CASCADE;
DROP TABLE IF EXISTS horaire            CASCADE;
DROP TABLE IF EXISTS utilisateur        CASCADE;
DROP TABLE IF EXISTS role               CASCADE;

-- -----------------------------------------------------------------------------
--  Tables de référence
-- -----------------------------------------------------------------------------

-- Rôles : visiteur (non stocké, = absence de compte), utilisateur, employe, admin.
CREATE TABLE role (
    role_id  SERIAL PRIMARY KEY,
    libelle  VARCHAR(50) NOT NULL UNIQUE
);

-- Thèmes des menus (extensible).
CREATE TABLE theme (
    theme_id  SERIAL PRIMARY KEY,
    libelle   VARCHAR(50) NOT NULL UNIQUE
);

-- Régimes alimentaires (extensible) — remplace le champ redondant de `menu`.
CREATE TABLE regime (
    regime_id  SERIAL PRIMARY KEY,
    libelle    VARCHAR(50) NOT NULL UNIQUE
);

-- Allergènes (extensible).
CREATE TABLE allergene (
    allergene_id  SERIAL PRIMARY KEY,
    libelle       VARCHAR(100) NOT NULL UNIQUE
);

-- Horaires d'ouverture (lundi -> dimanche), affichés en pied de page.
CREATE TABLE horaire (
    horaire_id       SERIAL PRIMARY KEY,
    jour             VARCHAR(10) NOT NULL UNIQUE
        CHECK (jour IN ('lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche')),
    heure_ouverture  TIME,
    heure_fermeture  TIME,
    ferme            BOOLEAN NOT NULL DEFAULT FALSE  -- jour de fermeture
);

-- -----------------------------------------------------------------------------
--  Utilisateurs
-- -----------------------------------------------------------------------------

CREATE TABLE utilisateur (
    utilisateur_id     SERIAL PRIMARY KEY,
    email              VARCHAR(255) NOT NULL UNIQUE,   -- sert d'identifiant de connexion
    password           VARCHAR(255) NOT NULL,          -- HASH bcrypt (jamais en clair)
    prenom             VARCHAR(100) NOT NULL,
    nom                VARCHAR(100) NOT NULL,
    telephone          VARCHAR(20)  NOT NULL,          -- GSM
    adresse_postale    VARCHAR(255) NOT NULL,
    ville              VARCHAR(100) NOT NULL,
    pays               VARCHAR(100) NOT NULL DEFAULT 'France',
    role_id            INTEGER NOT NULL REFERENCES role(role_id),
    actif              BOOLEAN NOT NULL DEFAULT TRUE,  -- désactivation d'un compte employé
    consentement_rgpd  BOOLEAN NOT NULL DEFAULT FALSE, -- consentement RGPD à l'inscription
    cree_le            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_utilisateur_role ON utilisateur(role_id);

-- -----------------------------------------------------------------------------
--  Catalogue : plats, menus, et leurs relations
-- -----------------------------------------------------------------------------

CREATE TABLE plat (
    plat_id     SERIAL PRIMARY KEY,
    titre_plat  VARCHAR(150) NOT NULL,
    photo_url   VARCHAR(500)             -- URL de l'image (choix : pas de BLOB en base)
);

CREATE TABLE menu (
    menu_id                  SERIAL PRIMARY KEY,
    titre                    VARCHAR(150) NOT NULL,
    description              TEXT NOT NULL,
    conditions               TEXT,                       -- délai de commande, stockage… (mis en évidence côté UI)
    nombre_personne_minimum  INTEGER NOT NULL CHECK (nombre_personne_minimum > 0),
    prix_base                NUMERIC(10,2) NOT NULL CHECK (prix_base >= 0),  -- prix pour le nombre MIN de personnes
    theme_id                 INTEGER NOT NULL REFERENCES theme(theme_id),
    regime_id                INTEGER NOT NULL REFERENCES regime(regime_id),
    quantite_restante        INTEGER NOT NULL DEFAULT 0 CHECK (quantite_restante >= 0),  -- stock
    actif                    BOOLEAN NOT NULL DEFAULT TRUE,
    cree_le                  TIMESTAMPTZ NOT NULL DEFAULT now(),
    maj_le                   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_menu_theme  ON menu(theme_id);
CREATE INDEX idx_menu_regime ON menu(regime_id);
CREATE INDEX idx_menu_prix   ON menu(prix_base);          -- accélère les filtres par prix

-- Association N-N menu <-> plat, avec la catégorie du plat DANS ce menu.
CREATE TABLE menu_plat (
    menu_id    INTEGER NOT NULL REFERENCES menu(menu_id) ON DELETE CASCADE,
    plat_id    INTEGER NOT NULL REFERENCES plat(plat_id) ON DELETE CASCADE,
    categorie  VARCHAR(10) NOT NULL CHECK (categorie IN ('entree','plat','dessert')),
    PRIMARY KEY (menu_id, plat_id)
);
CREATE INDEX idx_menu_plat_plat ON menu_plat(plat_id);

-- Association N-N plat <-> allergène (« contient »).
CREATE TABLE plat_allergene (
    plat_id       INTEGER NOT NULL REFERENCES plat(plat_id) ON DELETE CASCADE,
    allergene_id  INTEGER NOT NULL REFERENCES allergene(allergene_id) ON DELETE CASCADE,
    PRIMARY KEY (plat_id, allergene_id)
);

-- Galerie d'images d'un menu (1 menu -> N images).
CREATE TABLE image (
    image_id  SERIAL PRIMARY KEY,
    menu_id   INTEGER NOT NULL REFERENCES menu(menu_id) ON DELETE CASCADE,
    url       VARCHAR(500) NOT NULL,
    alt       VARCHAR(255) NOT NULL,         -- texte alternatif (accessibilité RGAA)
    position  INTEGER NOT NULL DEFAULT 0     -- ordre d'affichage
);
CREATE INDEX idx_image_menu ON image(menu_id);

-- -----------------------------------------------------------------------------
--  Commandes
-- -----------------------------------------------------------------------------

CREATE TABLE commande (
    numero_commande          SERIAL PRIMARY KEY,
    utilisateur_id           INTEGER NOT NULL REFERENCES utilisateur(utilisateur_id),
    menu_id                  INTEGER NOT NULL REFERENCES menu(menu_id),
    date_commande            TIMESTAMPTZ NOT NULL DEFAULT now(),
    date_prestation          DATE NOT NULL,
    heure_livraison          TIME NOT NULL,
    adresse_prestation       VARCHAR(255) NOT NULL,
    ville_prestation         VARCHAR(100) NOT NULL,
    nombre_personne          INTEGER NOT NULL CHECK (nombre_personne > 0),
    prix_menu                NUMERIC(10,2) NOT NULL,                 -- part menu (réduction -10% déjà appliquée si éligible)
    distance_km              NUMERIC(6,2)  NOT NULL DEFAULT 0,       -- km hors Bordeaux (sinon 0)
    prix_livraison           NUMERIC(10,2) NOT NULL DEFAULT 5.00,    -- 5 € + 0,59 €/km hors Bordeaux
    reduction_appliquee      BOOLEAN NOT NULL DEFAULT FALSE,         -- TRUE si >= min+5 personnes
    -- Total recalculé automatiquement à partir des deux parts (cohérence garantie en base).
    prix_total               NUMERIC(10,2) GENERATED ALWAYS AS (prix_menu + prix_livraison) STORED,
    statut                   VARCHAR(40) NOT NULL DEFAULT 'en_attente'
        CHECK (statut IN ('en_attente','accepte','en_preparation','en_cours_livraison',
                          'livre','attente_retour_materiel','terminee','annulee')),
    pret_materiel            BOOLEAN NOT NULL DEFAULT FALSE,
    restitution_materiel     BOOLEAN NOT NULL DEFAULT FALSE,         -- corrige « restition_materiel »
    -- Annulation par un employé : contact client obligatoire AVANT annulation.
    annulation_motif         TEXT,
    annulation_mode_contact  VARCHAR(20) CHECK (annulation_mode_contact IN ('appel','mail')),
    annulation_date          TIMESTAMPTZ
);
CREATE INDEX idx_commande_utilisateur ON commande(utilisateur_id);
CREATE INDEX idx_commande_menu        ON commande(menu_id);
CREATE INDEX idx_commande_statut      ON commande(statut);  -- filtre employé par statut

-- Historique horodaté des changements de statut (suivi de commande).
CREATE TABLE suivi_commande (
    suivi_id         SERIAL PRIMARY KEY,
    numero_commande  INTEGER NOT NULL REFERENCES commande(numero_commande) ON DELETE CASCADE,
    statut           VARCHAR(40) NOT NULL,
    date_heure       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_suivi_commande ON suivi_commande(numero_commande);

-- -----------------------------------------------------------------------------
--  Avis (publiés par un utilisateur sur une commande terminée)
-- -----------------------------------------------------------------------------

CREATE TABLE avis (
    avis_id          SERIAL PRIMARY KEY,
    numero_commande  INTEGER NOT NULL UNIQUE REFERENCES commande(numero_commande) ON DELETE CASCADE, -- 1 avis / commande
    utilisateur_id   INTEGER NOT NULL REFERENCES utilisateur(utilisateur_id),
    note             INTEGER NOT NULL CHECK (note BETWEEN 1 AND 5),
    description      TEXT,
    statut           VARCHAR(20) NOT NULL DEFAULT 'en_attente'
        CHECK (statut IN ('en_attente','valide','refuse')),     -- modération employé/admin
    cree_le          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_avis_statut ON avis(statut);  -- accueil = avis validés uniquement

-- -----------------------------------------------------------------------------
--  Réinitialisation de mot de passe (token à usage unique + expiration)
-- -----------------------------------------------------------------------------

CREATE TABLE token_reset (
    token_id        SERIAL PRIMARY KEY,
    utilisateur_id  INTEGER NOT NULL REFERENCES utilisateur(utilisateur_id) ON DELETE CASCADE,
    token_hash      VARCHAR(255) NOT NULL,        -- on stocke le HASH du token, pas le token brut
    expire_le       TIMESTAMPTZ NOT NULL,
    utilise         BOOLEAN NOT NULL DEFAULT FALSE,
    cree_le         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_token_reset_hash ON token_reset(token_hash);
CREATE INDEX idx_token_reset_user ON token_reset(utilisateur_id);

-- -----------------------------------------------------------------------------
--  Messages de contact (formulaire public -> envoyé par mail à l'entreprise)
-- -----------------------------------------------------------------------------

CREATE TABLE contact (
    contact_id   SERIAL PRIMARY KEY,
    titre        VARCHAR(200) NOT NULL,
    description  TEXT NOT NULL,
    email        VARCHAR(255) NOT NULL,
    cree_le      TIMESTAMPTZ NOT NULL DEFAULT now()
);
