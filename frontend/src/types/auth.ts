// Function HandleLogin from Login.tsx
export type LoginCredentials = {
  email?: string;
  employeeId?: string;
  password: string;
};
//  Location state interface from Login.tsx
export interface LocationState {
  from?: { pathname: string };
  error?: string;
}
