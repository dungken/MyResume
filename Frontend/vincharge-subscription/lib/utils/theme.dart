import 'package:flutter/material.dart';
import 'constants.dart';

// Error text style for form validation
class AppErrorTextStyle {
  static TextStyle get style => TextStyle(
    color: Color(0xFFF44336),
    fontSize: 14,
    fontWeight: FontWeight.w400,
    letterSpacing: 0.2,
    height: 1.2,
    fontFamily: 'Roboto',
  );
  
  static Widget buildErrorWidget(String errorText) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: const Duration(milliseconds: 200),
      builder: (context, value, child) {
        return Opacity(
          opacity: value,
          child: Container(
            margin: const EdgeInsets.only(top: 4, bottom: 4),
            padding: const EdgeInsets.only(left: 4),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  Icons.error_outline,
                  color: Color(0xFFF44336),
                  size: 16,
                ),
                SizedBox(width: 6),
                Expanded(
                  child: Text(
                    errorText,
                    style: style,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

// Common button style for authentication screens
class AppButtonStyles {
  static ButtonStyle primaryButtonStyle = ElevatedButton.styleFrom(
    backgroundColor: AppConstants.buttonColor,
    foregroundColor: AppConstants.buttonTextColor,
    disabledBackgroundColor: AppConstants.buttonColor.withOpacity(0.7),
    disabledForegroundColor: AppConstants.buttonTextColor.withOpacity(0.7),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(25),
    ),
    elevation: 8,
    shadowColor: const Color(0x40000000),
    padding: const EdgeInsets.symmetric(vertical: 18), // Higher padding
    textStyle: const TextStyle(
      fontSize: 20, // Larger font size
      fontWeight: FontWeight.bold,
    ),
    // Ensure material properties are maintained in disabled state
    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
    animationDuration: const Duration(milliseconds: 200),
    enableFeedback: true,
    // Ensure button shape is maintained in all states
    visualDensity: VisualDensity.standard,
  );
}

/// App-wide theme configuration
class AppTheme {
  /// Main theme for the app
  static ThemeData get lightTheme {
    return ThemeData(
      primaryColor: AppConstants.primaryColor,
      fontFamily: 'Roboto',
      scaffoldBackgroundColor: AppConstants.backgroundColor,
      
      // App bar theme
      appBarTheme: AppBarTheme(
        backgroundColor: AppConstants.primaryColor,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        titleTextStyle: const TextStyle(
          color: Colors.white,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      
      // Button themes
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppConstants.buttonColor,
          foregroundColor: AppConstants.buttonTextColor,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
          elevation: 0,
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppConstants.primaryColor,
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppConstants.primaryColor,
          side: BorderSide(color: AppConstants.primaryColor),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ),
      
      // Input decoration theme
      inputDecorationTheme: InputDecorationTheme(
        fillColor: Colors.white,
        filled: true,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16), // More curved borders
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16), // More curved borders
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16), // More curved borders
          borderSide: BorderSide(color: AppConstants.primaryColor, width: 1),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16), // More curved borders
          borderSide: BorderSide(color: AppConstants.errorColor, width: 1),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
      ),
      
      // Text theme
      textTheme: TextTheme(
        displayLarge: TextStyle(color: AppConstants.primaryColor, fontWeight: FontWeight.bold),
        displayMedium: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        titleLarge: TextStyle(color: AppConstants.textColor, fontWeight: FontWeight.bold),
        bodyLarge: TextStyle(color: AppConstants.textColor),
        bodyMedium: TextStyle(color: AppConstants.textColor.withOpacity(0.8)),
      ),
      
      // Color scheme
      colorScheme: ColorScheme.light(
        primary: AppConstants.primaryColor,
        secondary: AppConstants.primaryColor.withOpacity(0.8),
        error: AppConstants.errorColor,
      ),
    );
  }
  
  /// Auth-specific styles
  static BoxDecoration get authInputDecoration {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16), // More curved borders
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.05),
          blurRadius: 5,
          offset: const Offset(0, 2),
        ),
      ],
    );
  }
  
  /// Card decoration
  static BoxDecoration get cardDecoration {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(15),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.05),
          blurRadius: 10,
          offset: const Offset(0, 5),
        ),
      ],
    );
  }
}