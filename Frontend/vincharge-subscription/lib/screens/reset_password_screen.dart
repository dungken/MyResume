import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/language_provider.dart';
import '../utils/translations.dart';
import '../utils/constants.dart';
import '../utils/theme.dart';
import '../utils/validator.dart';
import '../utils/error_helper.dart';
import '../services/auth_service.dart';
import '../widgets/language/language_toggle_button.dart';
import '../widgets/custom_text_field_with_error.dart';
import 'login_screen.dart';

class ResetPasswordScreen extends StatefulWidget {
  final String email;
  final String resetToken;

  const ResetPasswordScreen({
    Key? key,
    required this.email,
    required this.resetToken,
  }) : super(key: key);

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  final _authService = AuthService();

  bool _passwordVisible = false;
  bool _confirmPasswordVisible = false;
  bool _isLoading = false;
  String? _errorText;

  @override
  void dispose() {
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _resetPassword() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
        _errorText = null;
      });

      try {
        final response = await _authService.updatePassword(
          widget.email,
          widget.resetToken,
          _newPasswordController.text,
        );

        if (mounted) {
          setState(() {
            _isLoading = false;
          });

          if (response['status'] == 'success') {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  response['message'] ?? Translations.get(
                    'resetPasswordSuccess',
                    Provider.of<LanguageProvider>(context, listen: false).currentLanguage,
                  ),
                ),
                backgroundColor: AppConstants.successColor,
              ),
            );

            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => const LoginScreen()),
              (route) => false,
            );
          } else {
            setState(() {
              _errorText = response['message'] ?? Translations.get(
                'resetPasswordFailed',
                Provider.of<LanguageProvider>(context, listen: false).currentLanguage,
              );
            });
          }
        }
      } catch (e) {
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

            // Reset Password Title
            Text(
              Translations.get('resetPassword', language),
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2F4F4F),
              ),
            ),

            const SizedBox(height: 16),

            // Instruction text
            Text(
              Translations.get('resetPasswordGuide', language),
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 16,
                color: Color(0xFF2F4F4F),
              ),
            ),

            const SizedBox(height: 40),

            // New Password field
            CustomTextFieldWithError(
              controller: _newPasswordController,
              hintText: Translations.get('passwordPlaceholder', language),
              validator: (value) => Validator.validatePassword(value ?? '', language),
              obscureText: !_passwordVisible,
              suffixIcon: IconButton(
                icon: Icon(
                  _passwordVisible ? Icons.visibility_off : Icons.visibility,
                ),
                onPressed: () {
                  setState(() {
                    _passwordVisible = !_passwordVisible;
                  });
                },
              ),
              initialError: _errorText,
            ),

            const SizedBox(height: 15),

            // Confirm New Password field
            CustomTextFieldWithError(
              controller: _confirmPasswordController,
              hintText: Translations.get('confirmPasswordPlaceholder', language),
              validator: (value) => Validator.validateConfirmPassword(
                value ?? '',
                _newPasswordController.text,
                language,
              ),
              obscureText: !_confirmPasswordVisible,
              suffixIcon: IconButton(
                icon: Icon(
                  _confirmPasswordVisible ? Icons.visibility_off : Icons.visibility,
                ),
                onPressed: () {
                  setState(() {
                    _confirmPasswordVisible = !_confirmPasswordVisible;
                  });
                },
              ),
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

            // Reset Password button
            SizedBox(
              width: double.infinity,
              height: 56, // Increased height for larger padding
              child: ElevatedButton(
                onPressed: _isLoading ? null : _resetPassword,
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
                        Translations.get('resetPassword', language).toUpperCase(),
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