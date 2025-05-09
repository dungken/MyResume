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
import 'forgot_password_screen.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // Controllers
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  // Form key
  final _formKey = GlobalKey<FormState>();

  // Password visibility
  bool _passwordVisible = false;
  bool _saveLogin = false;

  // Auth service
  final _authService = AuthService();

  @override
  void initState() {
    super.initState();
    // Check if user is already logged in
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      if (authProvider.isLoggedIn) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const HomeScreen()),
        );
      }
    });

    // Add listeners to text controllers to update button state
    _usernameController.addListener(_updateButtonState);
    _passwordController.addListener(_updateButtonState);
  }

  // Show pending approval message for 'user' account
  void _showPendingApprovalMessage() {
    final language =
        Provider.of<LanguageProvider>(context, listen: false).currentLanguage;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            language == 'vi' ? 'Thông báo' : 'Notice',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          content: Text(
            language == 'vi'
                ? "Hợp đồng của bạn đang chờ duyệt bởi Admin."
                : "Your contract is pending approval by the Admin.",
            style: const TextStyle(fontSize: 16),
          ),
          actions: [
            TextButton(
              child: Text(
                language == 'vi' ? 'Đóng' : 'Close',
                style: TextStyle(color: AppConstants.buttonColor),
              ),
              onPressed: () {
                Navigator.of(context).pop();
                // Log out the user since they can't proceed
                Provider.of<AuthProvider>(context, listen: false).logout();
              },
            ),
          ],
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        );
      },
    );
  }

  @override
  void dispose() {
    _usernameController.removeListener(_updateButtonState);
    _passwordController.removeListener(_updateButtonState);
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  bool _isButtonEnabled = false;

  void _updateButtonState() {
    final isEnabled = _validateInputs();
    if (isEnabled != _isButtonEnabled) {
      setState(() {
        _isButtonEnabled = isEnabled;
      });
    }
  }

  bool _isLoading = false;

  // API-based authentication

  bool _validateInputs() {
    // Just check that username and password are not empty
    return _usernameController.text.isNotEmpty &&
        _passwordController.text.isNotEmpty;
  }

  void _handleLogin() async {
    // Prevent double-submissions
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
    });

    final username = _usernameController.text;
    final password = _passwordController.text;
    final language = Provider.of<LanguageProvider>(context, listen: false).currentLanguage;
    
    try {
      // Create login request
      final loginRequest = LoginRequest(
        username: username,
        password: password,
        saveLogin: _saveLogin,
      );
      
      // Call API and get the full response
      final response = await _authService.login(loginRequest);
      
      if (!mounted) return;
      
      // Check response status
      if (response['status'] == 'success' && response['data'] != null) {
        // Extract auth data
        final data = response['data'];
        final authResponse = AuthResponse(
          token: data['token'],
          user: User.fromJson(data),
          message: response['message'] ?? 'Login successful',
          status: 'success',
        );
        
        // Update auth provider with response
        final authProvider = Provider.of<AuthProvider>(context, listen: false);
        authProvider.setCurrentUser(authResponse, saveLogin: _saveLogin);
        
        // Show the API success message directly
        final message = response['message'] ?? 'Login successful';
        showSuccessMessageDialog(context, message, language);
      } else {
        // Show the API error message directly
        final message = response['message'] ?? 'Login failed';
        showErrorMessageDialog(context, message, language);
      }
    } catch (e) {
      if (!mounted) return;
      
      // Show error message from exception
      showErrorMessageDialog(context, e.toString().replaceAll('Exception: ', ''), language);
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }
  
  // Shows a custom success message dialog using the existing UI style
  void showSuccessMessageDialog(BuildContext context, String message, String language) {
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
              message, // Display the message from API
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
                  // Navigate to home screen after successful login
                  // Use pushAndRemoveUntil to clear the navigation stack
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (context) => const HomeScreen()),
                    (Route<dynamic> route) => false,
                  );
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
  
  // Shows a custom error message dialog using the existing UI style
  void showErrorMessageDialog(BuildContext context, String message, String language) {
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
              message, // Display the error message from API
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
                        // Login Tab
                        Expanded(
                          child: Container(
                            decoration: BoxDecoration(
                              color: AppConstants.buttonColor,
                              borderRadius: BorderRadius.circular(30),
                            ),
                            child: Center(
                              child: Text(
                                Translations.get('login', language),
                                style: const TextStyle(
                                  color: Color(0xFFF0FDFD),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 20,
                                ),
                              ),
                            ),
                          ),
                        ),
                        // Register Tab
                        Expanded(
                          child: GestureDetector(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) =>
                                        const RegisterScreen()),
                              );
                            },
                            child: Center(
                              child: Text(
                                Translations.get('register', language),
                                style: TextStyle(
                                  color: Color(0xFF34C38F),
                                  fontWeight: FontWeight.w500,
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

                  // Tài khoản label
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
                  ),

                  const SizedBox(height: 20),

                  // Mật khẩu label
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
                    suffixIcon: IconButton(
                      icon: Icon(
                        _passwordVisible
                            ? Icons.visibility
                            : Icons.visibility_off,
                        color: Colors.grey,
                      ),
                      onPressed: () {
                        setState(() {
                          _passwordVisible = !_passwordVisible;
                        });
                      },
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Remember me & Forgot password
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Remember me checkbox
                      Row(
                        children: [
                          SizedBox(
                            width: 20,
                            height: 20,
                            child: Checkbox(
                              value: _saveLogin,
                              onChanged: (value) {
                                setState(() {
                                  _saveLogin = value ?? false;
                                });
                              },
                              activeColor: AppConstants.buttonColor,
                              side: BorderSide(color: Colors.grey),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(3),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            Translations.get('saveLogin', language),
                            style: TextStyle(
                              color: Color(0xFF2F4F4F),
                              fontSize: 16,
                            ),
                          ),
                        ],
                      ),
                      // Forgot password
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) =>
                                    const ForgotPasswordScreen()),
                          );
                        },
                        child: Text(
                          Translations.get('forgotPassword', language),
                          style: TextStyle(
                            color: Color(0xFF0007DC),
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 40),

                  // Login button
                  SizedBox(
                    width: double.infinity,
                    height: 56, // Increased height for larger padding
                    child: ElevatedButton(
                      onPressed: (_isLoading || !_isButtonEnabled)
                          ? null
                          : _handleLogin,
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
                              Translations.get('login', language),
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