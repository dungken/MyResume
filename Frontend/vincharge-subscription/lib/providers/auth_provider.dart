import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/auth_models.dart';
import 'dart:convert';

class AuthProvider extends ChangeNotifier {
  User? _currentUser;
  String? _token;
  bool _isLoggedIn = false;
  int _activeTabIndex = 0;

  // Keys for shared preferences
  static const String _userKey = 'user';
  static const String _tokenKey = 'token';

  AuthProvider() {
    _initialize();
  }

  User? get currentUser => _currentUser;
  String? get token => _token;
  bool get isLoggedIn => _isLoggedIn;
  int get activeTabIndex => _activeTabIndex;

  void _initialize() async {
    // Load saved login data
    await _loadSavedLogin();
  }

  Future<void> _loadSavedLogin() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userJson = prefs.getString(_userKey);
      final savedToken = prefs.getString(_tokenKey);
      final rememberMe = prefs.getBool('remember_me') ?? false;

      debugPrint('Loading saved login. Token exists: ${savedToken != null}, RememberMe: $rememberMe');

      // If we have a token and the Remember Me option was set, load the full user data
      if (savedToken != null) {
        _token = savedToken;

        // If we have user data from Remember Me, load it
        if (userJson != null && rememberMe) {
          _currentUser = User.fromJsonString(userJson);
          _isLoggedIn = true;
          debugPrint('User logged in with remembered credentials');
        } else {
          // If we don't have user data, we'll need to clear the token as it's only valid
          // for a single session if Remember Me wasn't checked
          if (!rememberMe) {
            await prefs.remove(_tokenKey);
            _token = null;
            _isLoggedIn = false;
            debugPrint('Token found but Remember Me was not checked, clearing token');
          }
        }
        
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error loading saved login: $e');
    }
  }

  Future<void> setCurrentUser(AuthResponse response, {bool saveLogin = false}) async {
    _currentUser = response.user;
    _token = response.token;
    
    // Only consider the user logged in if we have a token
    // For registration, we might not have a token yet if it's just a success message
    _isLoggedIn = response.token != null;

    // Save login data based on the saveLogin parameter
    try {
      final prefs = await SharedPreferences.getInstance();
      print('Saving token: ${response.token} and user_id: ${response.user.userid}, saveLogin: $saveLogin');
      
      // Only save token if it's not null
      if (response.token != null) {
        await prefs.setString(_tokenKey, response.token!);
        await prefs.setString('user_id', response.user.userid.toString());
        
        // Save full user data if Remember Me is checked
        if (saveLogin) {
          await prefs.setString(_userKey, response.user.toJsonString());
          // Save a flag to indicate Remember Me was checked
          await prefs.setBool('remember_me', true);
        } else {
          // If Remember Me is not checked, remove the user data but keep the token
          // for the current session only
          await prefs.remove(_userKey);
          await prefs.setBool('remember_me', false);
        }
      }
    } catch (e) {
      debugPrint('Error saving login: $e');
    }

    notifyListeners();
  }

  Future<void> logout() async {
    _currentUser = null;
    _token = null;
    _isLoggedIn = false;

    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_userKey);
      await prefs.remove(_tokenKey);
      await prefs.remove('user_id');
      await prefs.remove('remember_me');
    } catch (e) {
      debugPrint('Error clearing saved login: $e');
    }

    notifyListeners();
  }

  void setActiveTabIndex(int index) {
    _activeTabIndex = index;
    notifyListeners();
  }
}