import '../models/user.dart';

class ApiService {
  // Mock login API call
  Future<User?> login(LoginRequest request) async {
    // Simulate API request
    await Future.delayed(const Duration(seconds: 1));

    // In a real application, this would validate credentials against a server
    return User(username: request.username);
  }

  // Mock register API call
  Future<User?> register(RegisterRequest request) async {
    // Simulate API request
    await Future.delayed(const Duration(seconds: 1));

    // In a real application, this would create a new user on the server
    return User(username: request.username, email: request.email);
  }
}
