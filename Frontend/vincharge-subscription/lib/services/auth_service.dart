import '../models/auth_models.dart';
import 'api/api_client.dart';
import '../utils/constants.dart';

// No need for redundant import as ApiClient already includes ApiException

class AuthService {
  final ApiClient _apiClient;

  AuthService({ApiClient? apiClient})
      : _apiClient = apiClient ?? ApiClient(baseUrl: AppConstants.apiBaseUrl);

  // Login method
  Future<Map<String, dynamic>> login(LoginRequest request) async {
    try {
      final response = await _apiClient.post('/auth/login', request.toJson());
      
      // Return the full response including message field
      return response;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Register method
  Future<AuthResponse> register(RegisterRequest request) async {
    try {
      final response = await _apiClient.post('/auth/register', request.toJson());
      return AuthResponse.fromJson(response);
    } catch (e) {
      // If we have an ApiException, we'll try to convert it to an AuthResponse
      if (e is ApiException && e.statusCode != null) {
        try {
          // Attempt to parse the error response into an AuthResponse
          // This allows us to handle API errors in a structured way
          return AuthResponse(
            token: null,
            user: User(
              userid: -1,
              username: '',
              fullname: '',
              phone: '',
              email: '',
            ),
            message: e.message,
            status: 'error',
          );
        } catch (_) {
          // If parsing fails, just throw the original error
          throw e;
        }
      }
      throw _handleError(e);
    }
  }

  // Forgot password method
  Future<Map<String, dynamic>> forgotPassword(String email) async {
    try {
      final response = await _apiClient.post('/auth/forgot-password', {'email': email});
      return response;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Verify OTP method
  Future<Map<String, dynamic>> verifyOtp(String email, String otpCode) async {
    try {
      final response = await _apiClient.post('/auth/verify-otp', {
        'email': email,
        'otp_code': otpCode,
      });
      return response;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Update password method
  Future<Map<String, dynamic>> updatePassword(String email, String resetToken, String newPassword) async {
    try {
      final response = await _apiClient.post('/auth/update-password', {
        'email': email,
        'reset_token': resetToken,
        'new_password': newPassword,
      });
      return response;
    } catch (e) {
      throw _handleError(e);
    }
  }

  // Helper to handle errors
  Exception _handleError(dynamic e) {
    if (e is ApiException) {
      return e;
    }
    return Exception('An unexpected error occurred: ${e.toString()}');
  }
}