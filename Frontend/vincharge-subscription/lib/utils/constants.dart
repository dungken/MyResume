import 'package:flutter/material.dart';

class AppConstants {
  // API Constants
  static const String apiBaseUrl = 'http://localhost:8081/api';
  
  // Timeout Constants
  static const int connectionTimeout = 30000; // 30 seconds
  static const int receiveTimeout = 30000; // 30 seconds
  
  // UI Constants
  static const Color primaryColor = Color(0xFF06C167);
  static const Color buttonColor = Color(0xFF34C38F);
  static const Color backgroundColor = Color(0xFFF2F2F7);
  static const Color textColor = Color(0xFF333333);
  static const Color buttonTextColor = Color(0xFFF0FDFD);
  static const Color errorColor = Color(0xFFFF3B30);
  static const Color successColor = Color(0xFF34C759);
  
  // Layout Constants
  static const double defaultPadding = 16.0;
  static const double smallPadding = 8.0;
  static const double largePadding = 24.0;
  static const double extraLargePadding = 40.0;
  
  // Animation Constants
  static const Duration defaultAnimationDuration = Duration(milliseconds: 300);
  
  // Image Constants
  static const double logoWidth = 238.0;
  static const double logoHeight = 223.0;
  
  // Validation Constants
  static const int usernameMaxLength = 20;
  static const int passwordMinLength = 6;
  static const int otpLength = 6;
  static const String passwordSpecialChars = '@!#*&';
  
  // Storage Keys
  static const String userStorageKey = 'user';
  static const String tokenStorageKey = 'token';
  static const String languageStorageKey = 'language';
}

class AppGradients {
  static const LinearGradient backgroundGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Color(0xFFB2F2BB),
      Color(0xFFD0F0C0),
    ],
    stops: [0.3631, 0.7568],
  );
}