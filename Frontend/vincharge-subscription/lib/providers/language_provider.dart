import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/constants.dart';

class LanguageProvider with ChangeNotifier {
  String _currentLanguage = 'vi'; // Default language is Vietnamese
  bool _isInitialized = false;

  LanguageProvider() {
    _loadSavedLanguage();
  }

  String get currentLanguage => _currentLanguage;
  bool get isInitialized => _isInitialized;

  Future<void> _loadSavedLanguage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedLanguage = prefs.getString(AppConstants.languageStorageKey);

      if (savedLanguage != null) {
        _currentLanguage = savedLanguage;
      }
      
      _isInitialized = true;
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading language: $e');
      _isInitialized = true;
      notifyListeners();
    }
  }

  Future<void> setLanguage(String languageCode) async {
    if (languageCode == _currentLanguage) return;

    _currentLanguage = languageCode;

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(AppConstants.languageStorageKey, languageCode);
    } catch (e) {
      debugPrint('Error saving language: $e');
    }

    notifyListeners();
  }

  void toggleLanguage() {
    setLanguage(_currentLanguage == 'en' ? 'vi' : 'en');
  }
  
  // Get the right flag icon for the current language
  String get currentLanguageFlag {
    switch (_currentLanguage) {
      case 'vi':
        return 'assets/flags/vi.png';
      case 'en':
        return 'assets/flags/en.png';
      default:
        return 'assets/flags/vi.png';
    }
  }
  
  // Get the language name for display
  String get currentLanguageName {
    switch (_currentLanguage) {
      case 'vi':
        return 'Tiếng Việt';
      case 'en':
        return 'English';
      default:
        return 'Tiếng Việt';
    }
  }
}