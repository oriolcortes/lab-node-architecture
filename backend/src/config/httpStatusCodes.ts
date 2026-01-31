// Contiene constantes para los códigos de estado HTTP.
// Se utiliza en toda la aplicación para garantizar la coherencia en el uso de los códigos de estado.

export const httpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
