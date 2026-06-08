export function AuthButton({ user, onSignIn, onSignOut }) {
  if (!user) {
    return (
      <span className="status-btn login-pulse" onClick={onSignIn} title="Sign in to save progress">
        [LOGIN]
      </span>
    );
  }
  const handle = (user.email ?? '').split('@')[0].toUpperCase().slice(0, 8);
  return (
    <span className="status-btn auth-active" onClick={onSignOut} title={`${user.email} — click to sign out`}>
      [●{handle}]
    </span>
  );
}
