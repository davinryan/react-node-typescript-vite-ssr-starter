import { ValidationError } from "@packages-be/errors";
import Joi from "joi";

/**
 * Annotations have been re-written. This is only doc you can rely on that explains how to use
 * decorators - https://github.com/tc39/proposal-decorators
 */

/**
 * Provide a customer validator that can throw validation exceptions
 *
 * @param validator custom validator
 */
const validateWith = (validator: (args: string[]) => Promise<void>): any => {
  return function (
    target: any,
    name: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const annotatedArtefact = descriptor.value;
    if (typeof annotatedArtefact === "function") {
      descriptor.value = async function (...args: any[]) {
        return validator(args).then(() => {
          return annotatedArtefact.call(this, ...args);
        });
      };
    }
    return descriptor;
  };
};

/**
 * Normally we would use a parameter annotation to find the payload instead of relying on an index but
 * Microsoft has re-written decorators and haven't yet implemented parameter annotations
 * Refer: https://blog.logrocket.com/practical-guide-typescript-decorators/
 *
 * @param schema JOI based schema to provide main validation
 * @param options JOI based options that allow you to override the current validator options. Default options are
 * allowUnknown=true and abortEarly=false
 * @throws ValidationError
 */
const validateWithSchema = (
  schema: Joi.ObjectSchema,
  options?: Joi.ValidationOptions
): any => {
  return function (
    target: any,
    name: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const annotatedArtefact = descriptor.value;
    if (typeof annotatedArtefact === "function") {
      descriptor.value = function (...args: any[]) {
        const mergedOptions = {
          abortEarly: false,
          allowUnknown: true,
          ...options,
        };
        const result: Joi.ValidationResult = schema.validate(
          args[0],
          mergedOptions
        );
        if (result.error) {
          const { details: joiErrorItems } = result.error;
          const details = joiErrorItems.map((item) => item.message).join(",");
          throw new ValidationError({
            message: "Schema validation error",
            details,
          });
        }
        return annotatedArtefact.call(this, ...args);
      };
    }
    return descriptor;
  };
};

export { validateWithSchema, validateWith };