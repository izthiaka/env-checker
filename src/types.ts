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
  /** Configuration de validation avancée */
  validation?: ValidationConfig;
}

export interface ValidationConfig {
  /** Validation regex pour les variables */
  regex?: Record<string, RegExp>;
  /** Validation personnalisée pour les variables */
  custom?: Record<string, (value: string) => boolean>;
  /** Transformation des valeurs */
  transform?: Record<string, (value: string) => any>;
  /** Validation de plage pour les nombres */
  numberRange?: Record<string, { min?: number; max?: number }>;
  /** Validation de format prédéfini */
  format?: Record<string, 'email' | 'url' | 'uuid' | 'date' | 'json'>;
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
  /** Erreurs de validation */
  validationErrors: string[];
  /** Variables transformées */
  transformedVars: Record<string, any>;
}

export interface EnvCheckerConfig {
  /** Configuration par défaut */
  defaultOptions: Partial<EnvCheckerOptions>;
  /** Fonction de callback pour les erreurs */
  onError?: (errors: string[]) => void;
  /** Fonction de callback pour les succès */
  onSuccess?: (result: EnvCheckResult) => void;
}
