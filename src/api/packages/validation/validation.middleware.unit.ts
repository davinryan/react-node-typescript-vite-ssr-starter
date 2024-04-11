import Joi, { ValidationError } from "joi";
import { validateWith, validateWithSchema } from "./validation.validator";

const getUsersSchema: Joi.ObjectSchema = Joi.object({
  query: Joi.object({
    email: Joi.string().required().email().messages({
      "any.required": `Email is required`,
      "string.email": "Not an email",
    }),
  }),
});

const customEmailRequiredAsyncValidator = async (args: any[]) => {
  if (args[0]?.query?.email === undefined) {
    throw new ValidationError(
      "Email is required",
      [
        {
          message: "Email is required",
          type: "error",
          path: ["query", "email"],
        },
      ],
      "Original error"
    );
  }
};

/* eslint-disable */
class MockClass {
  @validateWithSchema(getUsersSchema)
  public getUsers(payload: { query: { email: string } }) {}

  @validateWith(customEmailRequiredAsyncValidator)
  public getUsersCustomSync(payload: { query: { email: string } }) {}

  @validateWith(customEmailRequiredAsyncValidator)
  public async getUsersCustomAsync(payload: { query: { email: string } }) {}
}
/* eslint-enable */

describe("Validator annotations test suite", () => {
  it("should be able to validate using a provided JOI schema", () => {
    // Assemble
    const mockValidPayload: any = { query: { email: "abc@domain.com" } };
    const mockPayloadRequired: any = { query: { email: undefined } };
    const mockPayloadNotFormatted: any = {
      query: { email: "thisIsNotAnEmail" },
    };

    // Act / Assert
    try {
      new MockClass().getUsers(mockValidPayload);
    } catch (error) {
      throw new Error(
        `Should not have had a failure with valid data. Got ${error}`
      );
    }

    try {
      new MockClass().getUsers(mockPayloadRequired);
      // fail("Should have thrown a validation error");
    } catch (error: any) {
      expect(error.name).toEqual("ValidationError");
      expect(error.toLog().payload.details).toEqual("Email is required");
    }

    try {
      new MockClass().getUsers(mockPayloadNotFormatted);
      // fail("Should have thrown a validation error");
    } catch (error: any) {
      expect(error.name).toEqual("ValidationError");
      expect(error.toLog().payload.details).toEqual("Not an email");
    }
  });

  it("should be able to validate using a custom synchronous function", async () => {
    // Assemble
    const mockValidPayload: any = { query: { email: "abc@domain.com" } };
    const mockPayloadRequired: any = { query: { email: undefined } };

    // Act / Assert
    try {
      await new MockClass().getUsersCustomSync(mockValidPayload);
    } catch (error) {
      throw new Error(
        `Should not have had a failure with valid data. Got ${error}`
      );
    }

    try {
      await new MockClass().getUsersCustomSync(mockPayloadRequired);
      // fail("Should have thrown a validation error");
    } catch (error: any) {
      expect(error.name).toEqual("ValidationError");
      expect(error.message).toEqual("Email is required");
    }
  });

  it("should be able to validate using a custom asynchronous function", async () => {
    // Assemble
    const mockValidPayload: any = { query: { email: "abc@domain.com" } };
    const mockPayloadRequired: any = { query: { email: undefined } };

    // Act / Assert
    try {
      await new MockClass().getUsersCustomAsync(mockValidPayload);
    } catch (error) {
      throw new Error(
        `Should not have had a failure with valid data. Got ${error}`
      );
    }

    try {
      await new MockClass().getUsersCustomAsync(mockPayloadRequired);
      // fail("Should have thrown a validation error");
    } catch (error: any) {
      expect(error.name).toEqual("ValidationError");
      expect(error.message).toEqual("Email is required");
    }
  });
});