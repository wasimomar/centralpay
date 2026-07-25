export interface RegisterRes {
  status: string
  message: string
  data: Data
}

export interface Data {
  user: User
  token: string
  qrCode: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
}
