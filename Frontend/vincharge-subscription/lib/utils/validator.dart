import 'translations.dart';

class Validator {
  static String? validateUsername(String value, String language) {
    if (value.trim().isEmpty) {
      return Translations.get('usernameRequired', language);
    }
    // No spaces, must contain numbers and letters, no special characters, max 20 chars
    if (value.contains(' ')) {
      return Translations.get('usernameNoSpaces', language);
    }
    if (!RegExp(r'[0-9]').hasMatch(value)) {
      return Translations.get('usernameNeedsNumbers', language);
    }
    if (!RegExp(r'[a-zA-Z]').hasMatch(value)) {
      return Translations.get('usernameNeedsLetters', language);
    }
    if (RegExp(r'[^a-zA-Z0-9]').hasMatch(value)) {
      return Translations.get('usernameNoSpecialChars', language);
    }
    if (value.length > 20) {
      return Translations.get('usernameMaxLength', language);
    }
    return null;
  }

  static String? validatePassword(String value, String language) {
    if (value.isEmpty) {
      return Translations.get('passwordRequired', language);
    }
    // At least 6 chars, at least 3 special chars from (@!#*&), letters + numbers, 1 uppercase
    if (value.length < 6) {
      return Translations.get('passwordShort', language);
    }
    
    // Check for 3 special characters from (@!#*&)
    final specialChars = value.replaceAll(RegExp(r'[^@!#*&]'), '').length;
    if (specialChars < 3) {
      return Translations.get('passwordSpecialChars', language);
    }
    
    // Check for numbers
    if (!RegExp(r'[0-9]').hasMatch(value)) {
      return Translations.get('passwordNeedsNumber', language);
    }
    
    // Check for letters
    if (!RegExp(r'[a-zA-Z]').hasMatch(value)) {
      return Translations.get('passwordNeedsLetter', language);
    }
    
    // Check for uppercase letter
    if (!RegExp(r'[A-Z]').hasMatch(value)) {
      return Translations.get('passwordUppercase', language);
    }
    
    return null;
  }

  static String? validateConfirmPassword(
      String confirmPassword, String password, String language) {
    if (confirmPassword.isEmpty) {
      return Translations.get('confirmPasswordRequired', language);
    }
    if (confirmPassword != password) {
      return Translations.get('passwordNotMatch', language);
    }
    return null;
  }

  static String? validateEmail(String value, String language) {
    if (value.isEmpty) {
      return Translations.get('emailRequired', language);
    }

    // Email validation with Gmail format check - only accept @gmail.com emails
    final gmailRegex = RegExp(
      r'^[\w-\.]+@gmail\.com$',
      caseSensitive: false,
    );

    if (!gmailRegex.hasMatch(value)) {
      return Translations.get('emailInvalid', language);
    }
    
    return null;
  }

  static String? validatePowerInput(String value, String language) {
    if (value.isEmpty) {
      return 'Vui lòng nhập số điện';
    }

    try {
      final number = double.parse(value);
      if (number < 0) {
        return 'Số điện không thể âm';
      }
      return null;
    } catch (e) {
      return 'Số điện không hợp lệ';
    }
  }

  static String? validatePhoneNumber(String value, String language) {
    if (value.isEmpty) {
      return Translations.get('phoneNumberRequired', language);
    }

    // Vietnamese phone number validation (starts with 03, 05, 07, 08, 09 followed by 8 digits)
    final phoneRegex = RegExp(r'^(0[3|5|7|8|9])+([0-9]{8})$');
    if (!phoneRegex.hasMatch(value)) {
      return Translations.get('phoneNumberInvalid', language);
    }
    return null;
  }
  
  static String? validateOTP(String value, String language) {
    if (value.isEmpty) {
      return Translations.get('otpRequired', language);
    }
    
    // OTP must be 6 digits
    if (value.length != 6) {
      return Translations.get('otpInvalid', language);
    }
    
    // OTP must be all numbers
    if (!RegExp(r'^[0-9]{6}$').hasMatch(value)) {
      return Translations.get('otpMustBeDigits', language);
    }
    
    return null;
  }
}