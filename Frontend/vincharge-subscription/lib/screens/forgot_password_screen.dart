import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/language_provider.dart';
import '../utils/translations.dart';
import '../utils/constants.dart';
import '../utils/theme.dart';
import '../utils/validator.dart';
import '../services/auth_service.dart';
import '../widgets/language/language_toggle_button.dart';
import '../widgets/custom_text_field_with_error.dart';
import 'otp_screen.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({Key? key}) : super(key: key);

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  final _authService = AuthService();

  bool _isLoading = false;
  String? _errorText;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _sendOtp() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
        _errorText = null;
      });

      try {
        final email = _emailController.text.trim();
        print('Sending forgot password request for email: $email');
        final response = await _authService.forgotPassword(email);
        print('Forgot password response: $response');

        if (mounted) {
          setState(() {
            _isLoading = false;
          });

          if (response['status'] == 'success') {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => OtpScreen(email: email),
              ),
            );
          } else {
            setState(() {
              _errorText = response['message'] ?? Translations.get(
                'emailNotFound',
                Provider.of<LanguageProvider>(context, listen: false).currentLanguage,
              );
            });
          }
        }
      } catch (e) {
        print('Error in forgot password: $e');
        if (mounted) {
          setState(() {
            _isLoading = false;
            _errorText = e.toString();
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
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
            const SizedBox(height: 20),
                  
                  // Top row with back button and language toggle
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Back button in top-left corner
                      IconButton(
                        onPressed: () => Navigator.pop(context),
                        icon: const Icon(
                          Icons.arrow_back_ios,
                          color: Color(0xFF2F4F4F),
                        ),
                        padding: EdgeInsets.zero,
                      ),
                      // Language toggle in top right
                      const LanguageToggleButton(margin: EdgeInsets.zero),
                    ],
                  ),

            const SizedBox(height: 20),

            // Forgot Password Title
            Text(
              Translations.get('forgotPassword', language),
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2F4F4F),
              ),
            ),

            const SizedBox(height: 16),

            // Instruction text
            Text(
              Translations.get('forgotPasswordGuide', language),
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 16,
                color: Color(0xFF2F4F4F),
              ),
            ),

            const SizedBox(height: 40),

            // Email field
            CustomTextFieldWithError(
              controller: _emailController,
              hintText: Translations.get('emailPlaceholder', language),
              validator: (value) => Validator.validateEmail(value ?? '', language),
              keyboardType: TextInputType.emailAddress,
              suffixIcon: const Icon(Icons.email_outlined),
              initialError: _errorText,
            ),

            // Error text
            if (_errorText != null) ...[
              const SizedBox(height: 20),
              Text(
                _errorText!,
                style: TextStyle(
                  color: AppConstants.errorColor,
                  fontSize: 14,
                ),
              ),
            ],

            const SizedBox(height: 40),

            // Send OTP button
            SizedBox(
              width: double.infinity,
              height: 56, // Increased height for larger padding
              child: ElevatedButton(
                onPressed: _isLoading ? null : _sendOtp,
                style: AppButtonStyles.primaryButtonStyle,
                child: _isLoading
                    ? Container(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(
                          color: AppConstants.buttonTextColor,
                          strokeWidth: 2.5,
                          valueColor: AlwaysStoppedAnimation<Color>(AppConstants.buttonTextColor),
                        ),
                      )
                    : Text(
                        Translations.get('sendOtp', language).toUpperCase(),
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