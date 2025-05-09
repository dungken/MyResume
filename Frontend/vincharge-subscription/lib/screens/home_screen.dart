import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import '../providers/auth_provider.dart';
import '../providers/language_provider.dart';
import '../utils/theme.dart';
import '../utils/translations.dart';
import '../utils/constants.dart';
import '../widgets/gradient_background.dart';
import '../widgets/consumption_input_widget.dart';
import '../widgets/qr_code_widget.dart';
import '../widgets/language/language_toggle_button.dart';
import '../models/contract.dart';
import '../models/power_consumption.dart';
import '../services/contract_service.dart';
import 'login_screen.dart';
import 'payment_screen.dart';
import 'package:dotted_border/dotted_border.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ContractService _contractService = ContractService();
  Contract? _contract;
  bool _isLoading = true;
  bool _showError = false;
  String? _errorMessage;

  // Track if the user has declined payment in popup
  bool _userDeclinedPayment = false;

  File? _evnUploadedImage;
  File? _vinfastUploadedImage;
  File? _mainUploadedImage;
  double _totalConsumption = 14.55;
  final TextEditingController _vinfastController = TextEditingController();
  final TextEditingController _evnController = TextEditingController();
  final TextEditingController _mainController = TextEditingController();
  bool _showPaymentButton = false;

  // Track input field focus states
  bool _mainInputBlurred = false;
  bool _evnInputBlurred = false;
  bool _vinfastInputBlurred = false;
  bool _dialogShown = false;

  // Variables to store previous month data
  double? _previousMainValue;
  double? _previousEvnValue;
  double? _previousVinfastValue;
  File? _previousMainImage;
  File? _previousEvnImage;
  File? _previousVinfastImage;

  // Flag to track if payment has been completed for current month
  bool _paymentCompleted = false;

  @override
  void initState() {
    super.initState();
    // Load contract data whenever the home screen is initialized
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadContractData();
    });
    _setupTextControllers();
  }

  void _setupTextControllers() {
    _vinfastController.addListener(() {
      if (_vinfastController.text.isNotEmpty) {
        String value = _vinfastController.text.replaceAll(' kWh', '');
        if (value.isNotEmpty) {
          // Validate if the input is a valid number
          final number = double.tryParse(value);
          if (number == null || number < 0) {
            // If invalid, don't add kWh suffix
            return;
          }
          if (!_vinfastController.text.endsWith(' kWh')) {
            _vinfastController.value = _vinfastController.value.copyWith(
              text: '$value kWh',
              selection: TextSelection.collapsed(offset: value.length),
            );
          }

          // Check if all conditions are met to show payment dialog
          _checkInputsCompletion();
        }
      }
    });

    _evnController.addListener(() {
      if (_evnController.text.isNotEmpty) {
        String value = _evnController.text.replaceAll(' kWh', '');
        if (value.isNotEmpty) {
          // Validate if the input is a valid number
          final number = double.tryParse(value);
          if (number == null || number < 0) {
            // If invalid, don't add kWh suffix
            return;
          }
          if (!_evnController.text.endsWith(' kWh')) {
            _evnController.value = _evnController.value.copyWith(
              text: '$value kWh',
              selection: TextSelection.collapsed(offset: value.length),
            );
          }

          // Check if all conditions are met to show payment dialog
          _checkInputsCompletion();
        }
      }
    });

    _mainController.addListener(() {
      if (_mainController.text.isNotEmpty) {
        String value = _mainController.text.replaceAll(' kWh', '');
        if (value.isNotEmpty) {
          // Validate if the input is a valid number
          final number = double.tryParse(value);
          if (number == null || number < 0) {
            // If invalid, don't add kWh suffix
            return;
          }
          if (!_mainController.text.endsWith(' kWh')) {
            _mainController.value = _mainController.value.copyWith(
              text: '$value kWh',
              selection: TextSelection.collapsed(offset: value.length),
            );
          }

          // Check if all conditions are met to show payment dialog
          _checkInputsCompletion();
        }
      }
    });
  }

  Future<void> _loadContractData() async {
    try {
      setState(() {
        _isLoading = true;
        _showError = false;
      });

      // Get the current user's ID from AuthProvider
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final userId = authProvider.currentUser?.userid.toString() ?? '';

      if (userId.isEmpty) {
        setState(() {
          _isLoading = false;
          _showError = true;
          _errorMessage = 'User ID not found';
        });
        return;
      }

      final contract = await _contractService.getContractDetails(userId);

      setState(() {
        _contract = contract;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
        _showError = true;
        _errorMessage = e.toString();
      });
    }
  }

  Future<void> _pickImage(String type) async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);

    if (image != null) {
      setState(() {
        if (type == 'evn') {
          _evnUploadedImage = File(image.path);
        } else if (type == 'vinfast') {
          _vinfastUploadedImage = File(image.path);
        } else if (type == 'main') {
          _mainUploadedImage = File(image.path);
        }
      });

      // Check if all conditions are met to show payment dialog
      _checkInputsCompletion();
    }
  }

  // Method to open image in full screen
  void _viewImageFullScreen(File imageFile) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => Scaffold(
          backgroundColor: Colors.black,
          appBar: AppBar(
            backgroundColor: Colors.black,
            iconTheme: const IconThemeData(color: Colors.white),
            elevation: 0,
          ),
          body: Center(
            child: InteractiveViewer(
              panEnabled: true,
              boundaryMargin: const EdgeInsets.all(20),
              minScale: 0.5,
              maxScale: 4,
              child: Image.file(
                imageFile,
                fit: BoxFit.contain,
              ),
            ),
          ),
        ),
      ),
    );
  }

  // Check if all fields and images are complete to show payment dialog
  // and validate in real-time
  void _checkInputsCompletion() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      // Update the validation state in real-time
      setState(() {
        _showValidationErrors = !_validateInputsComplete();
      });
      _checkAllFieldsAndShowPopup();
    });
  }

  void _checkAllFieldsAndShowPopup() {
    // Only proceed if dialog hasn't been shown yet
    if (_dialogShown) return;

    // Check if all three input fields have values
    bool allFieldsFilled = _mainController.text.isNotEmpty &&
        _evnController.text.isNotEmpty &&
        _vinfastController.text.isNotEmpty;

    // Check if all three images are uploaded
    bool allImagesUploaded = _evnUploadedImage != null &&
        _vinfastUploadedImage != null &&
        _mainUploadedImage != null;

    // Check if at least one field has been blurred (indicating user has finished entering data)
    bool anyFieldBlurred =
        _mainInputBlurred || _evnInputBlurred || _vinfastInputBlurred;

    if (allFieldsFilled && allImagesUploaded && anyFieldBlurred) {
      // Show popup dialog with a 3-second delay
      setState(() {
        _dialogShown = true; // Mark dialog as shown to prevent multiple popups
      });

      // Wait 3 seconds before showing the payment confirmation dialog
      Future.delayed(const Duration(seconds: 3), () {
        if (mounted) {
          // Check if widget is still mounted
          _showPaymentConfirmationDialog();
        }
      });
    }
  }

  void _showPaymentConfirmationDialog() {
    final languageProvider =
        Provider.of<LanguageProvider>(context, listen: false);

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            languageProvider.currentLanguage == 'vi'
                ? 'Bạn có muốn thanh toán?'
                : 'Do you want to make a payment?',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            textAlign: TextAlign.center,
          ),
          titlePadding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          contentPadding: EdgeInsets.zero,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          backgroundColor: Colors.white,
          elevation: 8,
          actionsPadding: const EdgeInsets.fromLTRB(0, 0, 0, 8),
          actions: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop(); // Close the dialog
                    setState(() {
                      _userDeclinedPayment =
                          true; // Set flag to show payment button
                      _showPaymentButton = true; // Show payment button
                    });
                  },
                  style: TextButton.styleFrom(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  ),
                  child: Text(
                    languageProvider.currentLanguage == 'vi' ? 'Không' : 'No',
                    style: TextStyle(color: Colors.grey[700], fontSize: 16),
                  ),
                ),
                const SizedBox(width: 16),
                ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pop(); // Close the dialog
                    _navigateToPaymentScreen(); // Navigate to payment screen
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF34C38F),
                    foregroundColor: const Color(0xFFF0FDFD),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20)),
                    elevation: 3,
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.check_circle, size: 18),
                      const SizedBox(width: 6),
                      Text(
                        languageProvider.currentLanguage == 'vi' ? 'Có' : 'Yes',
                        style:
                            const TextStyle(color: Colors.white, fontSize: 16),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        );
      },
    );
  }

  void _navigateToPaymentScreen() {
    Navigator.of(context)
        .push(
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => PaymentScreen(
          onPaymentSuccess: _handleSuccessfulPayment,
        ),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(
            opacity: animation,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0, 0.1),
                end: Offset.zero,
              ).animate(CurvedAnimation(
                parent: animation,
                curve: Curves.easeOutCubic,
              )),
              child: child,
            ),
          );
        },
        transitionDuration: const Duration(milliseconds: 500),
      ),
    )
        .then((_) {
      // This runs when user returns from payment screen
      // If payment was not completed, show the payment button
      if (!_paymentCompleted) {
        setState(() {
          _userDeclinedPayment = true;
          _showPaymentButton = true;
        });
      }
    });
  }

  // Handle successful payment completion
  void _handleSuccessfulPayment() {
    setState(() {
      // Mark payment as completed
      _paymentCompleted = true;
      // Hide the payment button
      _showPaymentButton = false;
      // Reset user declined payment flag
      _userDeclinedPayment = false;

      // Move current month's data to previous month
      // Parse values from controllers
      String mainText = _mainController.text.replaceAll(' kWh', '');
      String evnText = _evnController.text.replaceAll(' kWh', '');
      String vinfastText = _vinfastController.text.replaceAll(' kWh', '');

      // Store as previous month values
      _previousMainValue = double.tryParse(mainText);
      _previousEvnValue = double.tryParse(evnText);
      _previousVinfastValue = double.tryParse(vinfastText);

      // Store current images as previous month images
      _previousMainImage = _mainUploadedImage;
      _previousEvnImage = _evnUploadedImage;
      _previousVinfastImage = _vinfastUploadedImage;

      // Clear current inputs and images
      _mainController.clear();
      _evnController.clear();
      _vinfastController.clear();
      _mainUploadedImage = null;
      _evnUploadedImage = null;
      _vinfastUploadedImage = null;

      // Reset dialog shown flag for next month
      _dialogShown = false;
    });
  }

  Future<void> _submitConsumption() async {
    // Add your submission logic here
    _navigateToPaymentScreen();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final languageProvider = Provider.of<LanguageProvider>(context);

    if (_isLoading) {
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
          child: Column(
            children: [
              // Header with logout button and language switch
              Padding(
                padding: const EdgeInsets.all(10.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Logout button with logout confirmation dialog
                    ElevatedButton.icon(
                      onPressed: () {
                        // Show logout confirmation dialog
                        showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return AlertDialog(
                              title: Text(
                                languageProvider.currentLanguage == 'vi'
                                    ? 'Xác nhận'
                                    : 'Confirmation',
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold),
                              ),
                              content: Text(
                                languageProvider.currentLanguage == 'vi'
                                    ? 'Bạn có muốn đăng xuất?'
                                    : 'Do you want to log out?',
                              ),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16)),
                              actions: [
                                TextButton(
                                  onPressed: () {
                                    Navigator.of(context)
                                        .pop(); // Close the dialog
                                  },
                                  child: Text(
                                    languageProvider.currentLanguage == 'vi'
                                        ? 'Không'
                                        : 'No',
                                    style: TextStyle(color: Colors.grey[700]),
                                  ),
                                ),
                                ElevatedButton(
                                  onPressed: () {
                                    Navigator.of(context)
                                        .pop(); // Close the dialog
                                    // Logout and navigate to login screen
                                    Provider.of<AuthProvider>(context,
                                            listen: false)
                                        .logout();
                                    Navigator.of(context).pushAndRemoveUntil(
                                      MaterialPageRoute(
                                          builder: (context) =>
                                              const LoginScreen()),
                                      (Route<dynamic> route) => false,
                                    );
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF34C38F),
                                    foregroundColor: const Color(0xFFF0FDFD),
                                    shape: RoundedRectangleBorder(
                                        borderRadius:
                                            BorderRadius.circular(20)),
                                  ),
                                  child: Text(
                                    languageProvider.currentLanguage == 'vi'
                                        ? 'Có'
                                        : 'Yes',
                                    style: const TextStyle(color: Colors.white),
                                  ),
                                ),
                              ],
                            );
                          },
                        );
                      },
                      icon: Transform.rotate(
                        angle: 3.14159, // 180 degrees in radians
                        child:
                            const Icon(Icons.logout, color: Color(0xFF2F4F4F)),
                      ),
                      label: const SizedBox
                          .shrink(), // Remove the text, keep only icon
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        foregroundColor: const Color(0xFF2F4F4F),
                        elevation: 0,
                        shadowColor: Colors.transparent,
                        side: BorderSide.none, // Remove the border completely
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                        padding: const EdgeInsets.all(8),
                      ),
                    ),
                    // Language toggle
                    const LanguageToggleButton(
                      borderColor: Color(0xFF5A9C7F),
                      margin: EdgeInsets.zero,
                    ),
                  ],
                ),
              ),
              // Content
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    children: [
                      _buildUserInfoCard(),
                      const SizedBox(height: 16),
                      _buildMainInfoCard(),
                      const SizedBox(height: 16),
                      _buildEvnCard(),
                      const SizedBox(height: 16),
                      _buildVinfastCard(),
                      const SizedBox(height: 24),
                      // Payment button (conditionally shown) or payment completed message
                      if (_userDeclinedPayment || _paymentCompleted) ...[
                        _buildPaymentButton(),
                        const SizedBox(height: 24),
                      ],
                      // Footer moved here to allow scrolling
                      _buildFooter(),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildUserInfoCard() {
    final languageProvider = Provider.of<LanguageProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final String fullName = authProvider.currentUser?.fullname ?? 'User';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0x40000000),
            blurRadius: 4,
            offset: const Offset(0, 4),
            spreadRadius: 0,
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.black87, width: 2),
              color: Colors.white,
            ),
            child: Image.asset(
              'assets/avatar.png',
              width: 32,
              height: 32,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return const Icon(Icons.account_circle_outlined,
                    size: 32, color: Colors.black87);
              },
            ),
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                fullName,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w300,
                  color: Colors.black,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'NLMT 0.1',
                style: TextStyle(
                  fontSize: 18,
                  color: Colors.black,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMainInfoCard() {
    final languageProvider = Provider.of<LanguageProvider>(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0x40000000),
            blurRadius: 4,
            offset: const Offset(0, 4),
            spreadRadius: 0,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildInfoRow(
              Translations.get(
                  'investmentLimit', languageProvider.currentLanguage),
              '100.000.000đ',
              Icons.account_balance,
              Colors.green[700]),
          const SizedBox(height: 16),
          _buildInfoRow(
              Translations.get(
                  'monthlyIncome', languageProvider.currentLanguage),
              '100.000.000đ',
              Icons.trending_up,
              Colors.blue[700]),
          const SizedBox(height: 16),
          _buildInfoRow(
              Translations.get('balance', languageProvider.currentLanguage),
              '100.000.000đ',
              Icons.wallet,
              Colors.orange[700],
              isRed: true),
          const SizedBox(height: 20),
          Row(
            children: [
              Icon(Icons.info_outline,
                  size: 16, color: const Color(0xFF537474)),
              const SizedBox(width: 8),
              Expanded(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Text(
                    Translations.get('inputConsumptionGuide',
                        languageProvider.currentLanguage),
                    style: const TextStyle(
                      fontSize: 13,
                      color: Color(0xFF537474),
                      fontStyle: FontStyle.italic,
                    ),
                    maxLines: 1,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1EFEC),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: [
                      Text(
                        Translations.get('previousMonthConsumption',
                            languageProvider.currentLanguage),
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.black54,
                        ),
                      ),
                      const SizedBox(height: 4),
                      GestureDetector(
                        onTap: _previousMainValue != null
                            ? () => _showPreviousMonthData('main')
                            : null,
                        child: Column(
                          children: [
                            Text(
                              _previousMainValue != null
                                  ? '${_previousMainValue} kWh'
                                  : '--- kWh',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: _previousMainValue != null
                                    ? Colors.blue[800]
                                    : Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1EFEC),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: [
                      Text(
                        Translations.get('currentMonthConsumption',
                            languageProvider.currentLanguage),
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.black54,
                        ),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        controller: _mainController,
                        textAlign: TextAlign.center,
                        enabled: !_paymentCompleted,
                        readOnly: _paymentCompleted,
                        keyboardType: const TextInputType.numberWithOptions(
                            decimal: true),
                        onChanged: (_) => setState(() {}),
                        onTap: () {
                          // Reset the blurred state when field is tapped
                          setState(() {
                            _mainInputBlurred = false;
                          });
                        },
                        onEditingComplete: () {
                          // Mark as blurred and unfocus
                          setState(() {
                            _mainInputBlurred = true;
                          });
                          FocusScope.of(context).unfocus();
                          _checkInputsCompletion();
                        },
                        onFieldSubmitted: (_) {
                          setState(() {
                            _mainInputBlurred = true;
                          });
                          _checkInputsCompletion();
                        },
                        inputFormatters: [
                          FilteringTextInputFormatter.allow(
                              RegExp(r'^\d*\.?\d*')),
                        ],
                        decoration: InputDecoration(
                          hintText: '--- kWh',
                          border: _showValidationErrors &&
                                  _mainController.text.isEmpty
                              ? OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(4),
                                  borderSide: BorderSide(
                                      color: Colors.red[600]!, width: 1.5))
                              : InputBorder.none,
                          contentPadding: _showValidationErrors &&
                                  _mainController.text.isEmpty
                              ? const EdgeInsets.symmetric(horizontal: 8)
                              : EdgeInsets.zero,
                          isDense: true,
                          errorStyle: const TextStyle(fontSize: 10),
                          fillColor: _showValidationErrors &&
                                  _mainController.text.isEmpty
                              ? Colors.red[50]
                              : const Color(0xFFF1EFEC),
                          filled: true,
                        ),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                        validator: (value) {
                          if (value != null && value.isNotEmpty) {
                            String numValue = value.replaceAll(' kWh', '');
                            final number = double.tryParse(numValue);
                            if (number == null) {
                              return Translations.get('inputNumberValidation',
                                  languageProvider.currentLanguage);
                            }
                            if (number < 0) {
                              return Translations.get('numberShouldBePositive',
                                  languageProvider.currentLanguage);
                            }
                          }
                          return null;
                        },
                        autovalidateMode: AutovalidateMode.onUserInteraction,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildImageUploadSection('main'),
        ],
      ),
    );
  }

  Widget _buildEvnCard() {
    final languageProvider = Provider.of<LanguageProvider>(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0x40000000),
            blurRadius: 4,
            offset: const Offset(0, 4),
            spreadRadius: 0,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                languageProvider.currentLanguage == 'vi'
                    ? 'TỪ EVN'
                    : 'FROM EVN',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF164399),
                ),
              ),
              const SizedBox(width: 8),
              Image.asset(
                'assets/evn_logo.png',
                height: 50,
                width: 50,
                errorBuilder: (context, error, stackTrace) {
                  return Icon(Icons.electric_bolt,
                      color: Colors.blue[700], size: 50);
                },
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Icon(Icons.info_outline,
                  size: 16, color: const Color(0xFF537474)),
              const SizedBox(width: 8),
              Expanded(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Text(
                    Translations.get('inputConsumptionGuide',
                        languageProvider.currentLanguage),
                    style: const TextStyle(
                      fontSize: 13,
                      color: Color(0xFF537474),
                      fontStyle: FontStyle.italic,
                    ),
                    maxLines: 1,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1EFEC),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: [
                      Text(
                        Translations.get('previousMonthConsumption',
                            languageProvider.currentLanguage),
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.black54,
                        ),
                      ),
                      const SizedBox(height: 4),
                      GestureDetector(
                        onTap: _previousEvnValue != null
                            ? () => _showPreviousMonthData('evn')
                            : null,
                        child: Column(
                          children: [
                            Text(
                              _previousEvnValue != null
                                  ? '${_previousEvnValue} kWh'
                                  : '--- kWh',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: _previousEvnValue != null
                                    ? Colors.blue[800]
                                    : Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1EFEC),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: [
                      Text(
                        Translations.get('currentMonthConsumption',
                            languageProvider.currentLanguage),
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.black54,
                        ),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        controller: _evnController,
                        textAlign: TextAlign.center,
                        enabled: !_paymentCompleted,
                        readOnly: _paymentCompleted,
                        keyboardType: const TextInputType.numberWithOptions(
                            decimal: true),
                        onChanged: (_) => setState(() {}),
                        onTap: () {
                          // Reset the blurred state when field is tapped
                          setState(() {
                            _evnInputBlurred = false;
                          });
                        },
                        onEditingComplete: () {
                          // Mark as blurred and unfocus
                          setState(() {
                            _evnInputBlurred = true;
                          });
                          FocusScope.of(context).unfocus();
                          _checkInputsCompletion();
                        },
                        onFieldSubmitted: (_) {
                          setState(() {
                            _evnInputBlurred = true;
                          });
                          _checkInputsCompletion();
                        },
                        inputFormatters: [
                          FilteringTextInputFormatter.allow(
                              RegExp(r'^\d*\.?\d*')),
                        ],
                        decoration: InputDecoration(
                          hintText: '--- kWh',
                          border: _showValidationErrors &&
                                  _evnController.text.isEmpty
                              ? OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(4),
                                  borderSide: BorderSide(
                                      color: Colors.red[600]!, width: 1.5))
                              : InputBorder.none,
                          contentPadding: _showValidationErrors &&
                                  _evnController.text.isEmpty
                              ? const EdgeInsets.symmetric(horizontal: 8)
                              : EdgeInsets.zero,
                          isDense: true,
                          errorStyle: const TextStyle(fontSize: 10),
                          fillColor: _showValidationErrors &&
                                  _evnController.text.isEmpty
                              ? Colors.red[50]
                              : const Color(0xFFF1EFEC),
                          filled: true,
                        ),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                        validator: (value) {
                          if (value != null && value.isNotEmpty) {
                            String numValue = value.replaceAll(' kWh', '');
                            final number = double.tryParse(numValue);
                            if (number == null) {
                              return Translations.get('inputNumberValidation',
                                  languageProvider.currentLanguage);
                            }
                            if (number < 0) {
                              return Translations.get('numberShouldBePositive',
                                  languageProvider.currentLanguage);
                            }
                          }
                          return null;
                        },
                        autovalidateMode: AutovalidateMode.onUserInteraction,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildImageUploadSection('evn'),
        ],
      ),
    );
  }

  Widget _buildVinfastCard() {
    final languageProvider = Provider.of<LanguageProvider>(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0x40000000),
            blurRadius: 4,
            offset: const Offset(0, 4),
            spreadRadius: 0,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                Translations.get(
                    'fromVinfast', languageProvider.currentLanguage),
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFB2B4BC),
                ),
              ),
              const SizedBox(width: 8),
              Image.asset(
                'assets/vinfast_logo.png',
                height: 50,
                width: 50,
                errorBuilder: (context, error, stackTrace) {
                  return Icon(Icons.electric_car,
                      color: Colors.green[700], size: 50);
                },
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Icon(Icons.info_outline,
                  size: 16, color: const Color(0xFF537474)),
              const SizedBox(width: 8),
              Expanded(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Text(
                    Translations.get('inputConsumptionGuide',
                        languageProvider.currentLanguage),
                    style: const TextStyle(
                      fontSize: 13,
                      color: Color(0xFF537474),
                      fontStyle: FontStyle.italic,
                    ),
                    maxLines: 1,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1EFEC),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: [
                      Text(
                        Translations.get('previousMonthConsumption',
                            languageProvider.currentLanguage),
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.black54,
                        ),
                      ),
                      const SizedBox(height: 4),
                      GestureDetector(
                        onTap: _previousVinfastValue != null
                            ? () => _showPreviousMonthData('vinfast')
                            : null,
                        child: Column(
                          children: [
                            Text(
                              _previousVinfastValue != null
                                  ? '${_previousVinfastValue} kWh'
                                  : '--- kWh',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: _previousVinfastValue != null
                                    ? Colors.blue[800]
                                    : Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1EFEC),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: [
                      Text(
                        Translations.get('currentMonthConsumption',
                            languageProvider.currentLanguage),
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.black54,
                        ),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        controller: _vinfastController,
                        textAlign: TextAlign.center,
                        enabled: !_paymentCompleted,
                        readOnly: _paymentCompleted,
                        keyboardType: const TextInputType.numberWithOptions(
                            decimal: true),
                        onChanged: (_) => setState(() {}),
                        onTap: () {
                          // Reset the blurred state when field is tapped
                          setState(() {
                            _vinfastInputBlurred = false;
                          });
                        },
                        onEditingComplete: () {
                          // Mark as blurred and unfocus
                          setState(() {
                            _vinfastInputBlurred = true;
                          });
                          FocusScope.of(context).unfocus();
                          _checkInputsCompletion();
                        },
                        onFieldSubmitted: (_) {
                          setState(() {
                            _vinfastInputBlurred = true;
                          });
                          _checkInputsCompletion();
                        },
                        inputFormatters: [
                          FilteringTextInputFormatter.allow(
                              RegExp(r'^\d*\.?\d*')),
                        ],
                        decoration: InputDecoration(
                          hintText: '--- kWh',
                          border: _showValidationErrors &&
                                  _vinfastController.text.isEmpty
                              ? OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(4),
                                  borderSide: BorderSide(
                                      color: Colors.red[600]!, width: 1.5))
                              : InputBorder.none,
                          contentPadding: _showValidationErrors &&
                                  _vinfastController.text.isEmpty
                              ? const EdgeInsets.symmetric(horizontal: 8)
                              : EdgeInsets.zero,
                          isDense: true,
                          errorStyle: const TextStyle(fontSize: 10),
                          fillColor: _showValidationErrors &&
                                  _vinfastController.text.isEmpty
                              ? Colors.red[50]
                              : const Color(0xFFF1EFEC),
                          filled: true,
                        ),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                        validator: (value) {
                          if (value != null && value.isNotEmpty) {
                            String numValue = value.replaceAll(' kWh', '');
                            final number = double.tryParse(numValue);
                            if (number == null) {
                              return Translations.get('inputNumberValidation',
                                  languageProvider.currentLanguage);
                            }
                            if (number < 0) {
                              return Translations.get('numberShouldBePositive',
                                  languageProvider.currentLanguage);
                            }
                          }
                          return null;
                        },
                        autovalidateMode: AutovalidateMode.onUserInteraction,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildImageUploadSection('vinfast'),
        ],
      ),
    );
  }

  Widget _buildQRPaymentCard() {
    final languageProvider = Provider.of<LanguageProvider>(context);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.blue[50]!,
            Colors.white,
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.blue.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
            spreadRadius: 1,
          ),
        ],
        border: Border.all(
          color: Colors.blue[100]!,
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.blue[700],
              borderRadius: BorderRadius.circular(30),
              boxShadow: [
                BoxShadow(
                  color: Colors.blue.withOpacity(0.2),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.qr_code_scanner,
                    color: Colors.white, size: 24),
                const SizedBox(width: 12),
                Text(
                  Translations.get('payment', languageProvider.currentLanguage)
                      .toUpperCase(),
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 1.2,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.1),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
              border: Border.all(
                color: Colors.grey[200]!,
                width: 1,
              ),
            ),
            child: QrCodeWidget(
              qrCodeData: 'assets/qr_code.png',
              accountNumber: '1051 000 121 666',
              version: '3.0',
              contactEmail: 'vinsport.contact@gmail.com',
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.mobile_friendly, color: Colors.blue[700], size: 20),
              const SizedBox(width: 8),
              Text(
                Translations.get(
                    'scanQrPayment', languageProvider.currentLanguage),
                style: TextStyle(
                  fontSize: 15,
                  color: Colors.blue[900],
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.green[50],
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: Colors.green[200]!,
                width: 1,
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.check_circle, color: Colors.green[700], size: 16),
                const SizedBox(width: 6),
                Text(
                  Translations.get(
                      'safePayment', languageProvider.currentLanguage),
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.green[700],
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildImageUploadSection(String type) {
    final languageProvider = Provider.of<LanguageProvider>(context);
    File? uploadedImage;
    bool isImageMissing = false;

    if (type == 'evn') {
      uploadedImage = _evnUploadedImage;
      isImageMissing = _showValidationErrors && _evnUploadedImage == null;
    } else if (type == 'vinfast') {
      uploadedImage = _vinfastUploadedImage;
      isImageMissing = _showValidationErrors && _vinfastUploadedImage == null;
    } else if (type == 'main') {
      uploadedImage = _mainUploadedImage;
      isImageMissing = _showValidationErrors && _mainUploadedImage == null;
    }

    return GestureDetector(
      onTap: _paymentCompleted
          ? null
          : () => uploadedImage != null
              ? _viewImageFullScreen(uploadedImage)
              : _pickImage(type),
      behavior: HitTestBehavior.translucent,
      child: uploadedImage != null
          ? Container(
              width: double.infinity,
              height: 120,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(8),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Stack(
                  children: [
                    Positioned.fill(
                      child: Image.file(
                        uploadedImage,
                        width: double.infinity,
                        height: 120,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Positioned(
                      top: 8,
                      right: 8,
                      child: GestureDetector(
                        onTap: () {
                          setState(() {
                            if (type == 'evn') {
                              _evnUploadedImage = null;
                            } else if (type == 'vinfast') {
                              _vinfastUploadedImage = null;
                            } else if (type == 'main') {
                              _mainUploadedImage = null;
                            }
                          });
                        },
                        behavior: HitTestBehavior
                            .opaque, // Prevents taps from passing through
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.close,
                            color: Colors.white,
                            size: 16,
                          ),
                        ),
                      ),
                    ),
                    // Add a hint that image is tappable
                    Positioned(
                      bottom: 8,
                      right: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.6),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.zoom_in,
                                color: Colors.white, size: 16),
                            const SizedBox(width: 4),
                            Text(
                              languageProvider.currentLanguage == 'vi'
                                  ? 'Xem'
                                  : 'View',
                              style: const TextStyle(
                                  color: Colors.white, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            )
          : DottedBorder(
              borderType: BorderType.RRect,
              radius: const Radius.circular(8),
              dashPattern: const [6, 3],
              color: _paymentCompleted
                  ? Colors.grey[300]!
                  : (isImageMissing ? Colors.red[600]! : Colors.grey[400]!),
              strokeWidth: isImageMissing ? 2.0 : 1.5,
              child: Container(
                width: double.infinity,
                height: 120,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                          _paymentCompleted
                              ? Icons.lock_outline
                              : (isImageMissing
                                  ? Icons.warning_amber_rounded
                                  : Icons.photo_camera_outlined),
                          size: 40,
                          color: _paymentCompleted
                              ? Colors.grey[400]
                              : (isImageMissing
                                  ? Colors.red[600]
                                  : Colors.blue[400])),
                      const SizedBox(height: 8),
                      Text(
                        _paymentCompleted
                            ? languageProvider.currentLanguage == 'vi'
                                ? 'Không thể thay đổi'
                                : 'Cannot modify'
                            : (isImageMissing
                                ? languageProvider.currentLanguage == 'vi'
                                    ? 'Hình ảnh bắt buộc'
                                    : 'Image required'
                                : Translations.get('uploadImage',
                                    languageProvider.currentLanguage)),
                        style: TextStyle(
                          fontSize: 12,
                          color: _paymentCompleted
                              ? Colors.grey[500]
                              : (isImageMissing
                                  ? Colors.red[600]
                                  : const Color(0xFF537474)),
                          fontWeight: isImageMissing
                              ? FontWeight.bold
                              : FontWeight.normal,
                          fontStyle: _paymentCompleted
                              ? FontStyle.italic
                              : FontStyle.normal,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
    );
  }

  Widget _buildInfoRow(
      String label, String value, IconData icon, Color? iconColor,
      {bool isRed = false}) {
    return Row(
      children: [
        Icon(icon, size: 16, color: iconColor ?? Colors.grey[600]),
        const SizedBox(width: 8),
        Text(
          label,
          style: TextStyle(
            fontSize: 15,
            color: Colors.grey[800],
            fontWeight: FontWeight.w600,
          ),
        ),
        const Spacer(),
        Text(
          value,
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: isRed ? const Color(0xFFFF0004) : const Color(0xFF0910EC),
          ),
        ),
      ],
    );
  }

  // Validation state variables
  bool _showValidationErrors = false;
  String? _validationErrorMessage;

  // Check if all required fields and images are provided
  bool _validateInputsComplete() {
    final bool allFieldsFilled = _mainController.text.isNotEmpty &&
        _evnController.text.isNotEmpty &&
        _vinfastController.text.isNotEmpty;

    final bool allImagesUploaded = _evnUploadedImage != null &&
        _vinfastUploadedImage != null &&
        _mainUploadedImage != null;

    final languageProvider =
        Provider.of<LanguageProvider>(context, listen: false);

    if (!allFieldsFilled && !allImagesUploaded) {
      _validationErrorMessage = languageProvider.currentLanguage == 'vi'
          ? 'Vui lòng nhập đầy đủ thông tin và tải lên tất cả các hình ảnh'
          : 'Please fill in all fields and upload all required images';
      return false;
    } else if (!allFieldsFilled) {
      _validationErrorMessage = languageProvider.currentLanguage == 'vi'
          ? 'Vui lòng nhập đầy đủ thông tin cho tất cả các trường'
          : 'Please fill in all required fields';
      return false;
    } else if (!allImagesUploaded) {
      _validationErrorMessage = languageProvider.currentLanguage == 'vi'
          ? 'Vui lòng tải lên tất cả các hình ảnh yêu cầu'
          : 'Please upload all required images';
      return false;
    }

    _validationErrorMessage = null;
    return true;
  }

  // Attempt to proceed to payment after validation
  void _validateAndProceedToPayment() {
    if (_validateInputsComplete()) {
      setState(() {
        _showValidationErrors = false;
      });
      _navigateToPaymentScreen();
    } else {
      setState(() {
        _showValidationErrors = true;
      });
    }
  }

  // Show dialog with previous month data when tapped
  void _showPreviousMonthData(String type) {
    if (type == 'main' && _previousMainImage == null) return;
    if (type == 'evn' && _previousEvnImage == null) return;
    if (type == 'vinfast' && _previousVinfastImage == null) return;

    final languageProvider =
        Provider.of<LanguageProvider>(context, listen: false);
    File? image;
    double? value;
    String title;

    if (type == 'main') {
      image = _previousMainImage;
      value = _previousMainValue;
      title = languageProvider.currentLanguage == 'vi'
          ? 'Dữ liệu tháng trước'
          : 'Previous Month Data';
    } else if (type == 'evn') {
      image = _previousEvnImage;
      value = _previousEvnValue;
      title = languageProvider.currentLanguage == 'vi'
          ? 'Dữ liệu EVN tháng trước'
          : 'Previous Month EVN Data';
    } else {
      image = _previousVinfastImage;
      value = _previousVinfastValue;
      title = languageProvider.currentLanguage == 'vi'
          ? 'Dữ liệu VinFast tháng trước'
          : 'Previous Month VinFast Data';
    }

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey[300]!),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.file(
                      image!,
                      height: 200,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      languageProvider.currentLanguage == 'vi'
                          ? 'Số liệu: '
                          : 'Value: ',
                      style: const TextStyle(fontSize: 16),
                    ),
                    Text(
                      '${value!} kWh',
                      style: const TextStyle(
                          fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: TextButton.styleFrom(
                    backgroundColor: const Color(0xFF34C38F),
                    foregroundColor: const Color(0xFFF0FDFD),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 12),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30)),
                  ),
                  child: Text(
                    languageProvider.currentLanguage == 'vi' ? 'Đóng' : 'Close',
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildPaymentButton() {
    final languageProvider = Provider.of<LanguageProvider>(context);

    if (_paymentCompleted) {
      // Payment completed, show success message
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
        decoration: BoxDecoration(
          color: Colors.green[50],
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: const Color(0xFF34C38F)),
        ),
        child: Column(
          children: [
            const Icon(
              Icons.check_circle_outline,
              color: Color(0xFF34C38F),
              size: 42,
            ),
            const SizedBox(height: 12),
            Text(
              languageProvider.currentLanguage == 'vi'
                  ? 'Bạn đã hoàn thành thanh toán.'
                  : 'You have successfully completed the payment.',
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF34C38F),
              ),
            ),
          ],
        ),
      );
    }

    // Payment button for when payment is not completed
    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: _validateAndProceedToPayment,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF34C38F),
              foregroundColor: const Color(0xFFF0FDFD),
              padding: const EdgeInsets.symmetric(vertical: 15, horizontal: 24),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
              elevation: 3,
            ),
            icon: const Icon(Icons.payment, size: 24),
            label: Text(
              languageProvider.currentLanguage == 'vi'
                  ? 'Thanh toán'
                  : 'Pay Now',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
        ),
        if (_showValidationErrors && _validationErrorMessage != null) ...[
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.red[50],
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.red[300]!),
            ),
            child: Row(
              children: [
                Icon(Icons.error_outline, color: Colors.red[700], size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    _validationErrorMessage!,
                    style: TextStyle(color: Colors.red[700], fontSize: 14),
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildFooter() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: const [
          Text(
            '0000.000.000',
            style: TextStyle(
              fontSize: 12,
              color: Color(0xFF537474),
            ),
          ),
          Text(
            'Ver 1.0.0',
            style: TextStyle(
              fontSize: 12,
              color: Color(0xFF537474),
            ),
          ),
          Text(
            'abcxyz@gmail.com',
            style: TextStyle(
              fontSize: 12,
              color: Color(0xFF537474),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _vinfastController.dispose();
    _evnController.dispose();
    _mainController.dispose();
    super.dispose();
  }
}
