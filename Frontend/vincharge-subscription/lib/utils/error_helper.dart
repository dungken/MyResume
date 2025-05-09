import 'package:flutter/material.dart';
import 'constants.dart';

/// Helper class to handle and display errors consistently throughout the app
class ErrorHelper {
  /// Show a snackbar with an error message
  static void showError(BuildContext context, String message, {Duration? duration}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppConstants.errorColor,
        duration: duration ?? const Duration(seconds: 3),
      ),
    );
  }
  
  /// Show a dialog with an error message
  static void showErrorDialog(BuildContext context, String title, String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }
  
  /// Parse error messages from API responses
  static String parseApiError(dynamic error) {
    if (error is Map<String, dynamic> && error.containsKey('message')) {
      return error['message'] as String;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }
  
  /// Format validation errors into a readable format
  static String formatValidationErrors(Map<String, dynamic> errors) {
    final List<String> errorMessages = [];
    
    errors.forEach((key, value) {
      if (value is List) {
        for (final message in value) {
          errorMessages.add('$key: $message');
        }
      } else {
        errorMessages.add('$key: $value');
      }
    });
    
    return errorMessages.join('\n');
  }
  
  /// Show a specific dialog for login errors
  static void showLoginError(BuildContext context, String language) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          backgroundColor: Colors.white,
          elevation: 5,
          title: Column(
            children: [
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Color(0xFFFEE2E2),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.error_outline,
                  color: Color(0xFFDC2626),
                  size: 38,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                language == 'vi' ? 'Lỗi đăng nhập' : 'Login Error',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Color(0xFF2F4F4F),
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
          content: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            child: Text(
              language == 'vi' 
                ? 'Tài khoản hoặc mật khẩu không chính xác' 
                : 'Incorrect username or password',
              style: const TextStyle(
                fontSize: 16,
                color: Color(0xFF4B5563),
              ),
              textAlign: TextAlign.center,
            ),
          ),
          actionsAlignment: MainAxisAlignment.center,
          actions: [
            Container(
              margin: const EdgeInsets.only(bottom: 16),
              child: ElevatedButton(
                onPressed: () => Navigator.of(context).pop(),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppConstants.buttonColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 12),
                ),
                child: Text(
                  language == 'vi' ? 'Đóng' : 'OK',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
  
  /// Show a dialog with a custom error message from the API
  static void showCustomError(BuildContext context, String errorMessage, String language, {String? titleOverride}) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          backgroundColor: Colors.white,
          elevation: 5,
          title: Column(
            children: [
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Color(0xFFFEE2E2),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.error_outline,
                  color: Color(0xFFDC2626),
                  size: 38,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                titleOverride ?? (language == 'vi' ? 'Lỗi' : 'Error'),
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Color(0xFF2F4F4F),
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
          content: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            child: Text(
              errorMessage,
              style: const TextStyle(
                fontSize: 16,
                color: Color(0xFF4B5563),
              ),
              textAlign: TextAlign.center,
            ),
          ),
          actionsAlignment: MainAxisAlignment.center,
          actions: [
            Container(
              margin: const EdgeInsets.only(bottom: 16),
              child: ElevatedButton(
                onPressed: () => Navigator.of(context).pop(),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppConstants.buttonColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 12),
                ),
                child: Text(
                  language == 'vi' ? 'Đóng' : 'OK',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
  
  /// Show a dialog with a success message from the API
  static void showSuccessMessage(BuildContext context, String successMessage, String language, {VoidCallback? onDismiss}) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          backgroundColor: Colors.white,
          elevation: 5,
          title: Column(
            children: [
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Color(0xFFD1FAE5),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.check_circle_outline,
                  color: AppConstants.successColor,
                  size: 38,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                language == 'vi' ? 'Thành công' : 'Success',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Color(0xFF2F4F4F),
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
          content: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            child: Text(
              successMessage,
              style: const TextStyle(
                fontSize: 16,
                color: Color(0xFF4B5563),
              ),
              textAlign: TextAlign.center,
            ),
          ),
          actionsAlignment: MainAxisAlignment.center,
          actions: [
            Container(
              margin: const EdgeInsets.only(bottom: 16),
              child: ElevatedButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  if (onDismiss != null) {
                    onDismiss();
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppConstants.buttonColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 12),
                ),
                child: Text(
                  language == 'vi' ? 'Đóng' : 'OK',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}