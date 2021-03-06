export class LoginResponseModel {
  api_response: string;
  status: number;
  body: {
    result: string;
    data: {
      admin: boolean;
      privilege: number;
    }
    uid: number;
  }
}
