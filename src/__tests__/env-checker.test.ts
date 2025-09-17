import { EnvChecker } from "../env-checker";
import { checkEnv, getEnvVar, getEnvNumber, getEnvBoolean } from "../index";

describe("EnvChecker", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("check", () => {
    it("devrait retourner isValid: true quand toutes les variables requises sont présentes", () => {
      process.env.DATABASE_URL = "postgresql://localhost:5432/test";
      process.env.PORT = "3000";

      const checker = new EnvChecker({
        requiredVars: ["DATABASE_URL", "PORT"],
        loadEnvFile: false,
      });

      const result = checker.check();

      expect(result.isValid).toBe(true);
      expect(result.missingVars).toEqual([]);
      expect(result.presentVars).toEqual(["DATABASE_URL", "PORT"]);
      expect(result.errors).toEqual([]);
    });

    it("devrait retourner isValid: false quand des variables requises sont manquantes", () => {
      process.env.DATABASE_URL = "postgresql://localhost:5432/test";

      const checker = new EnvChecker({
        requiredVars: ["DATABASE_URL", "PORT", "API_KEY"],
        loadEnvFile: false,
      });

      const result = checker.check();

      expect(result.isValid).toBe(false);
      expect(result.missingVars).toEqual(["PORT", "API_KEY"]);
      expect(result.presentVars).toEqual(["DATABASE_URL"]);
      expect(result.errors).toHaveLength(2);
    });

    it("devrait gérer les variables optionnelles correctement", () => {
      process.env.DATABASE_URL = "postgresql://localhost:5432/test";
      process.env.DEBUG = "true";

      const checker = new EnvChecker({
        requiredVars: ["DATABASE_URL"],
        optionalVars: ["DEBUG", "LOG_LEVEL"],
        loadEnvFile: false,
      });

      const result = checker.check();

      expect(result.isValid).toBe(true);
      expect(result.optionalPresentVars).toEqual(["DEBUG"]);
      expect(result.optionalMissingVars).toEqual(["LOG_LEVEL"]);
    });

    it("devrait considérer les variables vides comme manquantes", () => {
      process.env.DATABASE_URL = "";
      process.env.PORT = "3000";

      const checker = new EnvChecker({
        requiredVars: ["DATABASE_URL", "PORT"],
        loadEnvFile: false,
      });

      const result = checker.check();

      expect(result.isValid).toBe(false);
      expect(result.missingVars).toEqual(["DATABASE_URL"]);
      expect(result.presentVars).toEqual(["PORT"]);
    });
  });

  describe("getVar", () => {
    it("devrait retourner la valeur de la variable si elle existe", () => {
      process.env.TEST_VAR = "test-value";

      const checker = new EnvChecker({
        requiredVars: [],
        loadEnvFile: false,
      });

      expect(checker.getVar("TEST_VAR")).toBe("test-value");
    });

    it("devrait retourner undefined si la variable n'existe pas", () => {
      const checker = new EnvChecker({
        requiredVars: [],
        loadEnvFile: false,
      });

      expect(checker.getVar("NON_EXISTENT_VAR")).toBeUndefined();
    });

    it("devrait retourner la valeur par défaut si la variable n'existe pas", () => {
      const checker = new EnvChecker({
        requiredVars: [],
        loadEnvFile: false,
      });

      expect(checker.getVar("NON_EXISTENT_VAR", "default-value")).toBe(
        "default-value"
      );
    });
  });

  describe("getNumber", () => {
    it("devrait convertir une chaîne numérique en nombre", () => {
      process.env.PORT = "3000";

      const checker = new EnvChecker({
        requiredVars: [],
        loadEnvFile: false,
      });

      expect(checker.getNumber("PORT")).toBe(3000);
    });

    it("devrait retourner undefined pour une variable non numérique", () => {
      process.env.INVALID_NUMBER = "not-a-number";

      const checker = new EnvChecker({
        requiredVars: [],
        loadEnvFile: false,
        strict: false,
      });

      expect(checker.getNumber("INVALID_NUMBER")).toBeUndefined();
    });

    it("devrait retourner la valeur par défaut pour une variable non numérique", () => {
      process.env.INVALID_NUMBER = "not-a-number";

      const checker = new EnvChecker({
        requiredVars: [],
        loadEnvFile: false,
        strict: false,
      });

      expect(checker.getNumber("INVALID_NUMBER", 8080)).toBe(8080);
    });
  });

  describe("getBoolean", () => {
    it("devrait convertir les valeurs booléennes correctement", () => {
      process.env.DEBUG_TRUE = "true";
      process.env.DEBUG_FALSE = "false";
      process.env.DEBUG_1 = "1";
      process.env.DEBUG_0 = "0";

      const checker = new EnvChecker({
        requiredVars: [],
        loadEnvFile: false,
      });

      expect(checker.getBoolean("DEBUG_TRUE")).toBe(true);
      expect(checker.getBoolean("DEBUG_FALSE")).toBe(false);
      expect(checker.getBoolean("DEBUG_1")).toBe(true);
      expect(checker.getBoolean("DEBUG_0")).toBe(false);
    });

    it("devrait retourner undefined pour une valeur booléenne invalide", () => {
      process.env.INVALID_BOOL = "maybe";

      const checker = new EnvChecker({
        requiredVars: [],
        loadEnvFile: false,
        strict: false,
      });

      expect(checker.getBoolean("INVALID_BOOL")).toBeUndefined();
    });
  });
});

describe("Fonctions utilitaires", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("checkEnv", () => {
    it("devrait vérifier les variables d'environnement", () => {
      process.env.DATABASE_URL = "postgresql://localhost:5432/test";

      const result = checkEnv({
        requiredVars: ["DATABASE_URL"],
        loadEnvFile: false,
      });

      expect(result.isValid).toBe(true);
    });
  });

  describe("getEnvVar", () => {
    it("devrait obtenir une variable d'environnement", () => {
      process.env.TEST_VAR = "test-value";

      expect(getEnvVar("TEST_VAR")).toBe("test-value");
    });
  });

  describe("getEnvNumber", () => {
    it("devrait obtenir une variable numérique", () => {
      process.env.PORT = "3000";

      expect(getEnvNumber("PORT")).toBe(3000);
    });
  });

  describe("getEnvBoolean", () => {
    it("devrait obtenir une variable booléenne", () => {
      process.env.DEBUG = "true";

      expect(getEnvBoolean("DEBUG")).toBe(true);
    });
  });
});
