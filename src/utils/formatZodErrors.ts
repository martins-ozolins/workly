import { type ZodSafeParseError, z } from "zod";

export function formatZodErrors(
  result: ZodSafeParseError<unknown>
): Record<string, string[]> {
  const { fieldErrors } = z.flattenError(result.error);

  return {
    ...fieldErrors,
  };
}
