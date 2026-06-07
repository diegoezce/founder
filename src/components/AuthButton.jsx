export function AuthButton({ user, onSignIn, onSignOut }) {
  if (!user) {
    return (
      <span className="status-btn" onClick={onSignIn} title="Authenticate with Google">
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
