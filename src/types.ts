export interface EnvCheckerOptions {
  /** Chemin vers le fichier .env (par défaut: .env) */
  envFile?: string;
  /** Variables d'environnement requises */
  requiredVars: string[];
  /** Variables d'environnement optionnelles */
  optionalVars?: string[];
  /** Charger automatiquement le fichier .env */
  loadEnvFile?: boolean;
  /** Mode strict (arrêter l'exécution si des variables manquent) */
  strict?: boolean;
  /** Préfixe pour les messages d'erreur */
  errorPrefix?: string;
}

export interface EnvCheckResult {
  /** Indique si toutes les variables requises sont présentes */
  isValid: boolean;
  /** Variables manquantes */
  missingVars: string[];
  /** Variables présentes */
  presentVars: string[];
  /** Variables optionnelles présentes */
  optionalPresentVars: string[];
  /** Variables optionnelles manquantes */
  optionalMissingVars: string[];
  /** Messages d'erreur */
  errors: string[];
}

export interface EnvCheckerConfig {
  /** Configuration par défaut */
  defaultOptions: Partial<EnvCheckerOptions>;
  /** Fonction de callback pour les erreurs */
  onError?: (errors: string[]) => void;
  /** Fonction de callback pour les succès */
  onSuccess?: (result: EnvCheckResult) => void;
}
