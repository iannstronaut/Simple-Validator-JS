class BaseValidator {
  constructor(key) {
    this.key = key;
    this.rules = [];
    this.isOptional = false;
  }

  require(message = `${this.key} is required`) {
    this.rules.push((value) => {
      if (value === undefined || value === null || value === "") {
        return message;
      }
    });
    return this;
  }

  optional() {
    this.isOptional = true;
    return this;
  }

  string(message = `${this.key} must be a string`) {
    this.rules.push((value) => {
      if (value !== undefined && value !== null && typeof value !== "string") {
        return message;
      }
    });
    return this;
  }

  number(message = `${this.key} must be a number`) {
    this.rules.push((value) => {
      if (value !== undefined && value !== null && typeof value !== "number") {
        return message;
      }
    });
    return this;
  }

  min(minVal, message = `${this.key} must be at least ${minVal}`) {
    this.rules.push((value) => {
      if (
        (typeof value === "string" || typeof value === "number") &&
        value.length < minVal
      ) {
        return message;
      }
    });
    return this;
  }

  max(maxVal, message = `${this.key} must be at most ${maxVal}`) {
    this.rules.push((value) => {
      if (
        (typeof value === "string" || typeof value === "number") &&
        value.length > maxVal
      ) {
        return message;
      }
    });
    return this;
  }

  email(message = `${this.key} must be a valid email`) {
    this.rules.push((value) => {
      if (
        value !== undefined &&
        value !== null &&
        typeof value === "string" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        return message;
      }
    });
    return this;
  }

  regex(pattern, message = `${this.key} is invalid`) {
    this.rules.push((value) => {
      if (
        value !== undefined &&
        value !== null &&
        typeof value === "string" &&
        !pattern.test(value)
      ) {
        return message;
      }
    });
    return this;
  }

  validate(value) {
    if (
      this.isOptional &&
      (value === undefined || value === null || value === "")
    ) {
      return null;
    }

    for (const rule of this.rules) {
      const error = rule(value);
      if (error) return error;
    }

    return null;
  }
}

class SchemaValidator {
  constructor(schema) {
    this.schema = schema;
  }

  validate(data) {
    const errors = {};
    for (const key in this.schema) {
      const fieldValidator = this.schema[key];
      const error = fieldValidator.validate(data[key]);
      if (error) {
        errors[key] = error;
      }
    }

    return Object.keys(errors).length === 0
      ? { success: true, data }
      : { success: false, errors };
  }
}

const sv = {
  Schema: (schema) => new SchemaValidator(schema),
  require: (msg) => new BaseValidator("").require(msg),
  optional: () => new BaseValidator("").optional(),
  string: () => new BaseValidator("").string(),
  number: () => new BaseValidator("").number(),
};

export default sv;
