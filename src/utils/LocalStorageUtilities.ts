
export default class LocalStorageUtiltites {
  public static get jwtToken(): string {
    return localStorage.getItem('jwtToken') || '';
  }

  public static set jwtToken(jwtToken: string) {
    localStorage.removeItem('selectedCalendars');
    localStorage.setItem('jwtToken', jwtToken);
  }
}