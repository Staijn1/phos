export const prettyPrint = (object: unknown): string => {
  return JSON.stringify(object, null, 2)
}
