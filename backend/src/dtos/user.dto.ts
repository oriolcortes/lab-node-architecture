// Define los Data Transfer Objects (DTOs) utilizados para la comunicación entre el servidor y los clientes.
// Los DTOs garantizan que solo se expongan datos relevantes y seguros, manteniendo un contrato claro
// para las peticiones y respuestas en toda la aplicación.

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  birthday: string; // String ISO para la respuesta
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  birthday: string; // Fecha en formato "1990-01-01" o ISO
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  birthday?: string; // Fecha en formato "1990-01-01" o ISO
  isBlocked?: boolean;
}
