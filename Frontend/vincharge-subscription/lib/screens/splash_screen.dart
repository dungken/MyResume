import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../providers/auth_provider.dart';
import '../providers/language_provider.dart';
import '../utils/theme.dart';
import '../utils/constants.dart';
import '../widgets/language/language_toggle_button.dart';
import 'login_screen.dart';
import 'home_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString(AppConstants.tokenStorageKey);
      final userId = prefs.getString('user_id');
      final rememberMe = prefs.getBool('remember_me') ?? false;
      final userData = prefs.getString(AppConstants.userStorageKey);
      
      print('Splash screen check - Token: ${token != null ? 'exists' : 'not found'}, UserId: $userId, Remember Me: $rememberMe');
      
      // Simulate loading for 3 seconds as specified
      await Future.delayed(const Duration(seconds: 3));

      if (!mounted) return;

      // Check if we have a token AND (either Remember Me is enabled OR this is the first app launch)
      if (token != null && (rememberMe || userData != null)) {
        print('Valid auth credentials found, navigating to Home screen');
        // Token exists and Remember Me is enabled or we have user data, navigate to Home
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const HomeScreen()),
        );
      } else {
        // If token exists but Remember Me is not checked, clear the token
        if (token != null && !rememberMe) {
          print('Token found but Remember Me not checked, clearing token');
          await prefs.remove(AppConstants.tokenStorageKey);
          // Also notify AuthProvider to update its state
          if (mounted) {
            Provider.of<AuthProvider>(context, listen: false).logout();
          }
        }
        
        print('No valid auth credentials found, navigating to Login screen');
        // No token or Remember Me not enabled, go to Login
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
      }
    } catch (e) {
      print('Error in splash screen: $e');
      if (!mounted) return;
      
      // In case of error, default to login screen
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final languageProvider = Provider.of<LanguageProvider>(context);
    
    // Don't display the UI until the language provider is initialized
    if (!languageProvider.isInitialized) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFFB2F2BB),
              Color(0xFFD0F0C0),
            ],
            stops: [0.3631, 0.7568],
          ),
        ),
        child: SafeArea(
          child: Stack(
            children: [
              // Language toggle button in top right
              const Positioned(
                top: 16,
                right: 16,
                child: LanguageToggleButton(
                  textColor: Colors.white,
                  iconColor: Colors.white,
                  borderColor: Colors.white,
                ),
              ),
              // Center content
              Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Logo with size 238x223 as specified
                    Image.asset(
                      'assets/logo.png',
                      width: 238,
                      height: 223,
                      fit: BoxFit.contain,
                    ),
                    const SizedBox(height: 40),
                    // Loading indicator only, removed button as requested
                    const CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
