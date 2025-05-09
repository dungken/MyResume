import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/language_provider.dart';
import '../utils/validator.dart';
import '../utils/translations.dart';
import '../utils/error_helper.dart';
import '../utils/constants.dart';
import '../utils/theme.dart';
import '../models/auth_models.dart';
import '../services/auth_service.dart';
import '../widgets/language/language_toggle_button.dart';
import '../widgets/custom_text_field_with_error.dart';

import 'home_screen.dart';
import 'login_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  // Controllers
  final _usernameController = TextEditingController();
  final _fullnameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _phoneController = TextEditingController();
  final _emailController = TextEditingController();

  // Form key
  final _formKey = GlobalKey<FormState>();

  // Password visibility
  bool _passwordVisible = false;
  bool _confirmPasswordVisible = false;
  bool _isLoading = false;

  // Auth service
  final _authService = AuthService();

  @override
  void dispose() {
    _usernameController.dispose();
    _fullnameController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _phoneController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      try {
        final request = RegisterRequest(
          username: _usernameController.text,
          fullname: _fullnameController.text,
          password: _passwordController.text,
          phone: _phoneController.text,
          email: _emailController.text,
        );

        final response = await _authService.register(request);
        
        if (mounted) {
          // Get the current language for displaying messages
          final language = Provider.of<LanguageProvider>(context, listen: false).currentLanguage;
          
          if (response.status == 'success') {
            // Registration successful
            final authProvider = Provider.of<AuthProvider>(context, listen: false);
            authProvider.setCurrentUser(response);
            
            // Show success message before navigation
            ErrorHelper.showSuccessMessage(context, response.message, language, onDismiss: () {
              // Check if we have a token and directly navigate to home
              // If we don't have a token, we might need to redirect to login first
              if (response.token != null) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const HomeScreen()),
                );
              } else {
                // If no token is provided after registration, navigate to login screen
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                );
              }
            });
          } else {
            // Registration failed with an error message from the API
            ErrorHelper.showCustomError(
              context, 
              response.message, 
              language, 
              titleOverride: language == 'vi' ? 'Lỗi đăng ký' : 'Registration Error'
            );
          }
        }
      } catch (e) {
        if (mounted) {
          // For unexpected errors that weren't handled by the API response formatting
          ErrorHelper.showError(context, e.toString());
        }
      } finally {
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final language = Provider.of<LanguageProvider>(context).currentLanguage;

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
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
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Language toggle in top right
                  const Align(
                    alignment: Alignment.topRight,
                    child: LanguageToggleButton(),
                  ),

                  const SizedBox(height: 40),

                  // Logo - increased size
                  Image.asset(
                    'assets/logo.png',
                    width: 230,
                    height: 210,
                    fit: BoxFit.contain,
                  ),

                  const SizedBox(height: 30),

                  // Login/Register tabs
                  Container(
                    width: double.infinity,
                    height: 60,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                      boxShadow: [
                        BoxShadow(
                          color: Color(0x40000000),
                          offset: Offset(0, 4),
                          blurRadius: 4,
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () {
                              Navigator.pushReplacement(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => const LoginScreen()),
                              );
                            },
                            child: Center(
                              child: Text(
                                Translations.get('login', language),
                                style: TextStyle(
                                  color: Color(0xFF34C38F),
                                  fontWeight: FontWeight.w500,
                                  fontSize: 20,
                                ),
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: Container(
                            decoration: BoxDecoration(
                              color: AppConstants.buttonColor,
                              borderRadius: BorderRadius.circular(30),
                            ),
                            child: Center(
                              child: Text(
                                Translations.get('register', language),
                                style: const TextStyle(
                                  color: Color(0xFFF0FDFD),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 20,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 30),

                  // Username field label
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      Translations.get('username', language),
                      style: TextStyle(
                        color: Color(0xFF2F4F4F),
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),

                  const SizedBox(height: 8),

                  // Username field
                  CustomTextFieldWithError(
                    controller: _usernameController,
                    hintText: Translations.get('usernamePlaceholder', language),
                    validator: (value) =>
                        Validator.validateUsername(value ?? '', language),
                  ),

                  const SizedBox(height: 15),

                  // Full name field label
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      Translations.get('fullname', language),
                      style: TextStyle(
                        color: Color(0xFF2F4F4F),
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),

                  const SizedBox(height: 8),

                  // Full name field
                  CustomTextFieldWithError(
                    controller: _fullnameController,
                    hintText: Translations.get('fullnamePlaceholder', language),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return Translations.get('fullnameRequired', language);
                      }
                      return null;
                    },
                  ),

                  const SizedBox(height: 15),

                  // Password field label
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      Translations.get('password', language),
                      style: TextStyle(
                        color: Color(0xFF2F4F4F),
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),

                  const SizedBox(height: 8),

                  // Password field
                  CustomTextFieldWithError(
                    controller: _passwordController,
                    hintText: Translations.get('passwordPlaceholder', language),
                    obscureText: !_passwordVisible,
                    validator: (value) =>
                        Validator.validatePassword(value ?? '', language),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _passwordVisible
                            ? Icons.visibility_off
                            : Icons.visibility,
                        color: Colors.grey,
                      ),
                      onPressed: () {
                        setState(() {
                          _passwordVisible = !_passwordVisible;
                        });
                      },
                    ),
                  ),

                  const SizedBox(height: 15),

                  // Confirm Password field label
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      Translations.get('confirmPassword', language),
                      style: TextStyle(
                        color: Color(0xFF2F4F4F),
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),

                  const SizedBox(height: 8),

                  // Confirm Password field
                  CustomTextFieldWithError(
                    controller: _confirmPasswordController,
                    hintText: Translations.get(
                        'confirmPasswordPlaceholder', language),
                    obscureText: !_confirmPasswordVisible,
                    validator: (value) => Validator.validateConfirmPassword(
                      value ?? '',
                      _passwordController.text,
                      language,
                    ),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _confirmPasswordVisible
                            ? Icons.visibility_off
                            : Icons.visibility,
                        color: Colors.grey,
                      ),
                      onPressed: () {
                        setState(() {
                          _confirmPasswordVisible = !_confirmPasswordVisible;
                        });
                      },
                    ),
                  ),

                  const SizedBox(height: 15),

                  // Phone field label
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      Translations.get('phoneNumber', language),
                      style: TextStyle(
                        color: Color(0xFF2F4F4F),
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),

                  const SizedBox(height: 8),

                  // Phone field
                  CustomTextFieldWithError(
                    controller: _phoneController,
                    hintText:
                        Translations.get('phoneNumberPlaceholder', language),
                    keyboardType: TextInputType.phone,
                    validator: (value) =>
                        Validator.validatePhoneNumber(value ?? '', language),
                  ),

                  const SizedBox(height: 15),

                  // Email field label
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text(
                      Translations.get('email', language),
                      style: TextStyle(
                        color: Color(0xFF2F4F4F),
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),

                  const SizedBox(height: 8),

                  // Email field
                  CustomTextFieldWithError(
                    controller: _emailController,
                    hintText: Translations.get('emailPlaceholder', language),
                    keyboardType: TextInputType.emailAddress,
                    validator: (value) =>
                        Validator.validateEmail(value ?? '', language),
                  ),

                  const SizedBox(height: 40),

                  // Register button
                  SizedBox(
                    width: double.infinity,
                    height: 56, // Increased height for larger padding
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _handleRegister,
                      style: AppButtonStyles.primaryButtonStyle,
                      child: _isLoading
                          ? SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor:
                                    AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            )
                          : Text(
                              Translations.get('register', language),
                              // No need to specify style since it's in the button's style
                            ),
                    ),
                  ),

                  const SizedBox(height: 30),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
