import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../utils/translations.dart';
import '../utils/constants.dart';
import '../utils/theme.dart';
import '../providers/language_provider.dart';
import '../utils/error_helper.dart';
import '../utils/validator.dart';
import '../widgets/language/language_toggle_button.dart';
import 'reset_password_screen.dart';

class OtpScreen extends StatefulWidget {
  final String email;
  
  const OtpScreen({Key? key, required this.email}) : super(key: key);

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final List<TextEditingController> _otpControllers = List.generate(
    6, 
    (index) => TextEditingController()
  );
  
  final List<FocusNode> _focusNodes = List.generate(
    6, 
    (index) => FocusNode()
  );
  
  final _authService = AuthService();
  bool _isLoading = false;
  String? _errorText;

  @override
  void dispose() {
    for (var controller in _otpControllers) {
      controller.dispose();
    }
    for (var node in _focusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  String get _otpCode {
    return _otpControllers.map((controller) => controller.text).join();
  }

  @override
  void initState() {
    super.initState();
    // Auto-focus on the first OTP field
    WidgetsBinding.instance.addPostFrameCallback((_) {
      FocusScope.of(context).requestFocus(_focusNodes[0]);
    });
  }
  
  void _onOtpChanged(String value, int index) {
    // Ensure only one digit per box
    if (value.length > 1) {
      _otpControllers[index].text = value[0];
    }
    
    if (value.isNotEmpty && index < 5) {
      // Auto-advance to next field when a digit is entered
      _focusNodes[index + 1].requestFocus();
    }
    
    // Clear any error when user starts typing again
    if (_errorText != null) {
      setState(() {
        _errorText = null;
      });
    }
  }

  Future<void> _verifyOtp() async {
    final otpCode = _otpCode;
    
    final language = Provider.of<LanguageProvider>(context, listen: false).currentLanguage;
    final validationResult = Validator.validateOTP(otpCode, language);
    
    if (validationResult != null) {
      setState(() {
        _errorText = validationResult;
      });
      return;
    }
    
    setState(() {
      _isLoading = true;
      _errorText = null;
    });

    try {
      final response = await _authService.verifyOtp(widget.email, otpCode);
      
      if (mounted) {
        setState(() {
          _isLoading = false;
        });

        if (response['status'] == 'success' && response['data'] != null) {
          final resetToken = response['data']['reset_token'];
          
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => ResetPasswordScreen(
                email: widget.email,
                resetToken: resetToken,
              ),
            ),
          );
        } else {
          setState(() {
            _errorText = response['message'] ?? Translations.get(
              'otpInvalid', 
              Provider.of<LanguageProvider>(context, listen: false).currentLanguage
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

  Future<void> _resendOtp() async {
    setState(() {
      _isLoading = true;
      _errorText = null;
    });

    try {
      final response = await _authService.forgotPassword(widget.email);
      
      if (mounted) {
        setState(() {
          _isLoading = false;
        });

        if (response['status'] == 'success') {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                response['message'] ?? Translations.get(
                  'otpResent', 
                  Provider.of<LanguageProvider>(context, listen: false).currentLanguage
                )
              ),
              backgroundColor: Colors.green,
            ),
          );
        } else {
          setState(() {
            _errorText = response['message'] ?? Translations.get(
              'failedToResendOtp', 
              Provider.of<LanguageProvider>(context, listen: false).currentLanguage
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
                
                // OTP Verification Title
                Text(
                  Translations.get('verifyOtp', language),
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF2F4F4F),
                  ),
                ),
                
                const SizedBox(height: 16),
                
                // Instruction text
                Text(
                  '${Translations.get('otpSent', language)} ${widget.email}',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 16,
                    color: Color(0xFF2F4F4F),
                  ),
                ),
                
                const SizedBox(height: 40),
                
                // OTP input fields
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: List.generate(
                      6,
                      (index) => SizedBox(
                        width: 45,
                        height: 50,
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: RawKeyboardListener(
                            focusNode: FocusNode(),
                            onKey: (RawKeyEvent event) {
                              // Check for backspace key press
                              if (event is RawKeyDownEvent && 
                                  event.logicalKey == LogicalKeyboardKey.backspace &&
                                  _otpControllers[index].text.isEmpty &&
                                  index > 0) {
                                _focusNodes[index - 1].requestFocus();
                                // Clear the previous field when backspace is pressed
                                _otpControllers[index - 1].clear();
                              }
                            },
                            child: TextField(
                              controller: _otpControllers[index],
                              focusNode: _focusNodes[index],
                              textAlign: TextAlign.center,
                              keyboardType: TextInputType.number,
                              maxLength: 1,
                              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                              decoration: const InputDecoration(
                                counterText: "",
                                border: InputBorder.none,
                                contentPadding: EdgeInsets.zero,
                              ),
                              onChanged: (value) => _onOtpChanged(value, index),
                              inputFormatters: [
                                FilteringTextInputFormatter.digitsOnly,
                                LengthLimitingTextInputFormatter(1),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                
                // Error text
                if (_errorText != null) ...[  
                const SizedBox(height: 20),
                AppErrorTextStyle.buildErrorWidget(_errorText!),
                ],
                
                const SizedBox(height: 30),
                
                // Verify button
                SizedBox(
                  width: double.infinity,
                  height: 56, // Increased height for larger padding
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _verifyOtp,
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
                            Translations.get('verifyOtp', language).toUpperCase(),
                            // No need to specify style since it's in the button's style
                          ),
                  ),
                ),
                
                const SizedBox(height: 20),
                
                // Resend OTP link
                GestureDetector(
                  onTap: _isLoading ? null : _resendOtp,
                  child: Text(
                    Translations.get('resendOtp', language),
                    style: const TextStyle(
                      color: Color(0xFF2F4F4F),
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
                
                const SizedBox(height: 30),
              ],
            ),
          ),
        ),
      ),
    );
  }
}