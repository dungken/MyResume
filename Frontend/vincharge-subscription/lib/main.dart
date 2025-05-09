import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/forgot_password_screen.dart';
import 'screens/otp_screen.dart';
import 'screens/reset_password_screen.dart';
import 'screens/home_screen.dart';
import 'utils/theme.dart';
import 'utils/constants.dart';
import 'providers/auth_provider.dart';
import 'providers/language_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Initialize services and shared preferences
  await _initializeServices();

  runApp(const MyApp());
}

Future<void> _initializeServices() async {
  // Initialize any services or global configurations here
  await SharedPreferences.getInstance();
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
      ],
      child: Consumer<LanguageProvider>(
        builder: (context, languageProvider, _) {
          // Wait for language provider to be initialized
          if (!languageProvider.isInitialized) {
            return MaterialApp(
              title: 'Loading',
              theme: AppTheme.lightTheme,
              debugShowCheckedModeBanner: false,
              home: const Center(child: CircularProgressIndicator()),
            );
          }
          
          return MaterialApp(
            title: 'VinCharge Subscription',
            theme: AppTheme.lightTheme,
            debugShowCheckedModeBanner: false,
            // We start with the splash screen, which will check for login token
            // and redirect as needed
            home: const SplashScreen(),
            routes: {
              '/splash': (context) => const SplashScreen(),
              '/login': (context) => const LoginScreen(),
              '/register': (context) => const RegisterScreen(),
              '/forgot-password': (context) => const ForgotPasswordScreen(),
              '/home': (context) => const HomeScreen(),
            },
            // Route generation for routes with parameters
            onGenerateRoute: (settings) {
              if (settings.name == '/otp') {
                final args = settings.arguments as Map<String, dynamic>;
                return MaterialPageRoute(
                  builder: (context) => OtpScreen(
                    email: args['email'],
                  ),
                );
              } else if (settings.name == '/reset-password') {
                final args = settings.arguments as Map<String, dynamic>;
                return MaterialPageRoute(
                  builder: (context) => ResetPasswordScreen(
                    email: args['email'],
                    resetToken: args['resetToken'],
                  ),
                );
              }
              return null;
            },
          );
        },
      ),
    );
  }
}