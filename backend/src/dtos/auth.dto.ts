// Define los Data Transfer Objects (DTOs) utilizados para la comunicación entre el servidor y los clientes.
// Los DTOs garantizan que solo se expongan datos relevantes y seguros, manteniendo un contrato claro
// para las peticiones y respuestas en toda la aplicación.

export interface AuthResponseDto {
  user: {
    id: string;
    name: string;
    email: string;
    birthday: string; // String ISO para la respuesta
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
