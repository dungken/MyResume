class User {
  final String username;
  final String email;

  User({required this.username, this.email = ''});
}

class LoginRequest {
  final String username;
  final String password;
  final bool saveLogin;

  LoginRequest({
    required this.username,
    required this.password,
    this.saveLogin = false,
  });
}

class RegisterRequest {
  final String username;
  final String password;
  final String email;

  RegisterRequest({
    required this.username,
    required this.password,
    required this.email,
  });
}
