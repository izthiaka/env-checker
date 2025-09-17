import { EnvChecker } from "../env-checker";
import { AdvancedValidator, validators, transformers, createValidationConfig } from "../advanced-validator";
import { checkEnv, getEnvVar, getEnvNumber, getEnvBoolean } from "../index";

describe("AdvancedValidator", () => {
  let validator: AdvancedValidator;

  beforeEach(() => {
    validator = new AdvancedValidator({
      format: {
        EMAIL: "email",
        URL: "url",
        UUID: "uuid",
      },
      regex: {
        API_KEY: /^[A-Za-z0-9]{32}$/,
      },
      numberRange: {
        PORT: { min: 1, max: 65535 },
      },
      transform: {
        DEBUG: transformers.toBoolean,
        LOG_LEVEL: transformers.toLowerCase,
      },
    });
  });

  describe("validate", () => {
    it("devrait valider une variable avec format email", () => {
      const result = validator.validate("EMAIL", "test@example.com");
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("devrait rejeter une variable avec format email invalide", () => {
      const result = validator.validate("EMAIL", "invalid-email");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Variable EMAIL n'est pas un email valide");
    });

    it("devrait valider une variable avec regex", () => {
      const result = validator.validate("API_KEY", "abcdefghijklmnopqrstuvwxyz123456");
      expect(result.isValid).toBe(true);
    });

    it("devrait rejeter une variable avec regex invalide", () => {
      const result = validator.validate("API_KEY", "short");
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain("Variable API_KEY ne correspond pas au pattern regex");
    });

    it("devrait valider une variable avec plage numérique", () => {
      const result = validator.validate("PORT", "3000");
      expect(result.isValid).toBe(true);
    });

    it("devrait rejeter une variable avec plage numérique invalide", () => {
      const result = validator.validate("PORT", "70000");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Variable PORT doit être <= 65535");
    });

    it("devrait transformer une variable", () => {
      const result = validator.validate("DEBUG", "true");
      expect(result.isValid).toBe(true);
      expect(result.transformedValue).toBe(true);
    });
  });

  describe("validateAll", () => {
    it("devrait valider toutes les variables", () => {
      const vars = {
        EMAIL: "test@example.com",
        URL: "https://example.com",
        API_KEY: "abcdefghijklmnopqrstuvwxyz123456",
        PORT: "3000",
        DEBUG: "true",
      };

      const result = validator.validateAll(vars);
      expect(result.isValid).toBe(true);
      expect(result.transformedVars.DEBUG).toBe(true);
      expect(result.transformedVars.LOG_LEVEL).toBeUndefined();
    });
  });
});

describe("Validators prédéfinis", () => {
  describe("email", () => {
    it("devrait valider un email valide", () => {
      expect(validators.email("test@example.com")).toBe(true);
    });

    it("devrait rejeter un email invalide", () => {
      expect(validators.email("invalid-email")).toBe(false);
    });
  });

  describe("url", () => {
    it("devrait valider une URL valide", () => {
      expect(validators.url("https://example.com")).toBe(true);
    });

    it("devrait rejeter une URL invalide", () => {
      expect(validators.url("not-a-url")).toBe(false);
    });
  });

  describe("uuid", () => {
    it("devrait valider un UUID valide", () => {
      expect(validators.uuid("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    });

    it("devrait rejeter un UUID invalide", () => {
      expect(validators.uuid("not-a-uuid")).toBe(false);
    });
  });

  describe("port", () => {
    it("devrait valider un port valide", () => {
      expect(validators.port("3000")).toBe(true);
    });

    it("devrait rejeter un port invalide", () => {
      expect(validators.port("70000")).toBe(false);
    });
  });
});

describe("Transformers prédéfinis", () => {
  describe("toBoolean", () => {
    it("devrait transformer 'true' en true", () => {
      expect(transformers.toBoolean("true")).toBe(true);
    });

    it("devrait transformer 'false' en false", () => {
      expect(transformers.toBoolean("false")).toBe(false);
    });
  });

  describe("toNumber", () => {
    it("devrait transformer une chaîne en nombre", () => {
      expect(transformers.toNumber("123")).toBe(123);
    });
  });

  describe("toArray", () => {
    it("devrait transformer une chaîne en tableau", () => {
      expect(transformers.toArray("a,b,c")).toEqual(["a", "b", "c"]);
    });
  });
});

describe("EnvChecker avec validation avancée", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("devrait valider avec configuration avancée", () => {
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    process.env.EMAIL = "test@example.com";
    process.env.PORT = "3000";

    const checker = new EnvChecker({
      requiredVars: ["DATABASE_URL", "EMAIL", "PORT"],
      validation: createValidationConfig({
        format: {
          DATABASE_URL: "url",
          EMAIL: "email",
        },
        numberRange: {
          PORT: { min: 1, max: 65535 },
        },
      }),
      loadEnvFile: false,
    });

    const result = checker.check();
    expect(result.isValid).toBe(true);
    expect(result.validationErrors).toEqual([]);
  });

  it("devrait rejeter avec validation avancée invalide", () => {
    process.env.DATABASE_URL = "not-a-url";
    process.env.EMAIL = "invalid-email";
    process.env.PORT = "70000";

    const checker = new EnvChecker({
      requiredVars: ["DATABASE_URL", "EMAIL", "PORT"],
      validation: createValidationConfig({
        format: {
          DATABASE_URL: "url",
          EMAIL: "email",
        },
        numberRange: {
          PORT: { min: 1, max: 65535 },
        },
      }),
      loadEnvFile: false,
    });

    const result = checker.check();
    expect(result.isValid).toBe(false);
    expect(result.validationErrors.length).toBeGreaterThan(0);
  });

  it("devrait transformer les variables", () => {
    process.env.DEBUG = "true";
    process.env.LOG_LEVEL = "INFO";

    const checker = new EnvChecker({
      requiredVars: ["DEBUG", "LOG_LEVEL"],
      validation: createValidationConfig({
        transform: {
          DEBUG: transformers.toBoolean,
          LOG_LEVEL: transformers.toLowerCase,
        },
      }),
      loadEnvFile: false,
    });

    const result = checker.check();
    expect(result.isValid).toBe(true);
    expect(result.transformedVars.DEBUG).toBe(true);
    expect(result.transformedVars.LOG_LEVEL).toBe("info");
  });

  it("devrait obtenir une variable transformée", () => {
    process.env.DEBUG = "true";

    const checker = new EnvChecker({
      requiredVars: ["DEBUG"],
      validation: createValidationConfig({
        transform: {
          DEBUG: transformers.toBoolean,
        },
      }),
      loadEnvFile: false,
    });

    const transformedValue = checker.getTransformedVar("DEBUG");
    expect(transformedValue).toBe(true);
  });

  it("devrait obtenir toutes les variables transformées", () => {
    process.env.DEBUG = "true";
    process.env.LOG_LEVEL = "INFO";

    const checker = new EnvChecker({
      requiredVars: ["DEBUG", "LOG_LEVEL"],
      validation: createValidationConfig({
        transform: {
          DEBUG: transformers.toBoolean,
          LOG_LEVEL: transformers.toLowerCase,
        },
      }),
      loadEnvFile: false,
    });

    const transformedVars = checker.getAllTransformedVars();
    expect(transformedVars.DEBUG).toBe(true);
    expect(transformedVars.LOG_LEVEL).toBe("info");
  });

  it("devrait valider une variable spécifique", () => {
    const checker = new EnvChecker({
      requiredVars: [],
      validation: createValidationConfig({
        format: {
          EMAIL: "email",
        },
      }),
      loadEnvFile: false,
    });

    const result = checker.validateVar("EMAIL", "test@example.com");
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });
});
