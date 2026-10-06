/** Where to send a user after sign-in: back to the page they wanted, if their role allows it. */
export function destinationFor(role, from) {
  const home = role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
  const area = role === 'admin' ? '/admin/' : '/student/';
  return typeof from === 'string' && from.startsWith(area) ? from : home;
}
