// Clase de error personalizada para manejar errores específicos de la aplicación.
// Permite especificar un código de estado HTTP y un mensaje para cada error.

export class AppError extends Error {
  public statusCode: number;
  public context: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 500,
    context: Record<string, unknown> = {}
  ) {
    super(message); // Asigna el mensaje de error a la clase base Error

    this.statusCode = statusCode; // Código de estado HTTP asociado con el error
    this.context = context; // Contexto adicional para depuración

    Error.captureStackTrace(this, this.constructor); // Evita que esta clase aparezca en el stack trace
  }
}
