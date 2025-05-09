import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/rendering.dart';
import 'package:provider/provider.dart';
import 'dart:async';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:path_provider/path_provider.dart';
import 'dart:io';
// import 'package:image_gallery_saver/image_gallery_saver.dart'; // Comment out problematic import
import 'package:permission_handler/permission_handler.dart';
import '../providers/language_provider.dart';
import '../utils/translations.dart';
import '../widgets/qr_code_widget.dart';
import '../utils/image_saver/image_saver.dart'; // Import our custom image saver

class PaymentScreen extends StatefulWidget {
  final Function? onPaymentSuccess; // Callback for when payment is successful

  const PaymentScreen({Key? key, this.onPaymentSuccess}) : super(key: key);

  @override
  _PaymentScreenState createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  late Timer _timer;
  int _secondsRemaining = 5 * 60; // 5 minutes in seconds
  GlobalKey _qrKey = GlobalKey();
  bool _isDownloading = false;
  bool _showError = false;
  String _errorMessage = "";

  @override
  void initState() {
    super.initState();
    _startTimer();

    // Show the confirmation message
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _showConfirmationMessage();
    });
  }

  void _showConfirmationMessage() {
    final languageProvider =
        Provider.of<LanguageProvider>(context, listen: false);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          languageProvider.currentLanguage == 'vi'
              ? 'Chuyển sang trang thanh toán, vui lòng kiểm tra thông tin trước khi thanh toán.'
              : 'Redirecting to payment page, please check information before payment.',
          style: const TextStyle(fontSize: 16),
        ),
        backgroundColor: Colors.green[700],
        duration: const Duration(seconds: 4),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    );
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (_secondsRemaining > 0) {
          _secondsRemaining--;

          // Show warning when 30 seconds left
          if (_secondsRemaining == 30) {
            _showTimeWarning();
          }
        } else {
          _timer.cancel();
          _showTimeoutDialog();
        }
      });
    });
  }

  void _showTimeWarning() {
    final languageProvider =
        Provider.of<LanguageProvider>(context, listen: false);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          languageProvider.currentLanguage == 'vi'
              ? 'Chú ý: Chỉ còn 30 giây!'
              : 'Warning: Only 30 seconds left!',
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.red[700],
        duration: const Duration(seconds: 3),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    );
  }

  void _showTimeoutDialog() {
    final languageProvider =
        Provider.of<LanguageProvider>(context, listen: false);
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: Text(
          languageProvider.currentLanguage == 'vi'
              ? 'Hết thời gian thanh toán'
              : 'Payment Time Expired',
          style: const TextStyle(color: Color(0xFFFF0004)),
        ),
        content: Text(
          languageProvider.currentLanguage == 'vi'
              ? 'Thời gian thanh toán đã hết. Vui lòng quay lại trang chủ.'
              : 'Payment session has expired. Please return to home screen.',
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop(); // Close dialog
              Navigator.of(context).pop(); // Return to home screen
            },
            child: Text(
              languageProvider.currentLanguage == 'vi' ? 'Đồng ý' : 'OK',
              style: const TextStyle(color: Color(0xFF5A9C7F)),
            ),
          ),
        ],
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
    );
  }

  String _formatTime(int seconds) {
    final minutes = seconds ~/ 60;
    final remainingSeconds = seconds % 60;
    return '$minutes:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  // Complete payment and return to home screen
  void _completePayment() {
    final languageProvider =
        Provider.of<LanguageProvider>(context, listen: false);

    // Show confirmation dialog
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          languageProvider.currentLanguage == 'vi'
              ? 'Xác nhận thanh toán'
              : 'Confirm Payment',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        content: Text(
          languageProvider.currentLanguage == 'vi'
              ? 'Bạn đã hoàn thành thanh toán?'
              : 'Have you completed the payment?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(
              languageProvider.currentLanguage == 'vi' ? 'Chưa' : 'Not yet',
              style: TextStyle(color: Colors.grey[700]),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop(); // Close dialog

              // Call the success callback if provided
              if (widget.onPaymentSuccess != null) {
                widget.onPaymentSuccess!();
              }

              // Show success message
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    languageProvider.currentLanguage == 'vi'
                        ? 'Thanh toán thành công!'
                        : 'Payment successful!',
                    style: const TextStyle(fontSize: 16),
                  ),
                  backgroundColor: Colors.green[700],
                  duration: const Duration(seconds: 2),
                  behavior: SnackBarBehavior.floating,
                ),
              );

              // Return to home screen after short delay
              Future.delayed(const Duration(milliseconds: 1500), () {
                Navigator.of(context).pop(); // Return to home screen
              });
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF34C38F),
              foregroundColor: const Color(0xFFF0FDFD),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20)),
            ),
            child: Text(
              languageProvider.currentLanguage == 'vi' ? 'Xác nhận' : 'Confirm',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _saveQrCodeToGallery() async {
    final languageProvider =
        Provider.of<LanguageProvider>(context, listen: false);

    setState(() {
      _isDownloading = true;
      _showError = false;
    });

    try {
      // Always check for permissions first and handle properly
      bool permissionGranted = false;

      if (Platform.isAndroid) {
        // For Android 13+ (SDK 33+), we need to request specific permissions
        var status = await Permission.photos.status;
        if (status.isDenied) {
          // If permission is denied, request it
          status = await Permission.photos.request();
        }
        permissionGranted = status.isGranted;
      } else if (Platform.isIOS) {
        // For iOS
        var status = await Permission.photos.status;
        if (status.isDenied) {
          status = await Permission.photos.request();
        }
        permissionGranted = status.isGranted;
      }

      if (permissionGranted) {
        // Capture QR code as image
        RenderRepaintBoundary boundary =
            _qrKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
        ui.Image image = await boundary.toImage(pixelRatio: 3.0);
        ByteData? byteData =
            await image.toByteData(format: ui.ImageByteFormat.png);

        if (byteData != null) {
          // Use our custom image saver instead
          try {
            final imagePath = await CustomImageSaver.saveImage(
                byteData.buffer.asUint8List(),
                quality: 100,
                name: 'VNPAY_QR_${DateTime.now().millisecondsSinceEpoch}.png');

            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  languageProvider.currentLanguage == 'vi'
                      ? 'Mã QR đã được lưu vào thiết bị của bạn'
                      : 'QR code has been saved to your device',
                ),
                backgroundColor: Colors.green[700],
                duration: const Duration(seconds: 2),
              ),
            );
          } catch (saveError) {
            print('Error in CustomImageSaver: $saveError');
            setState(() {
              _showError = true;
              _errorMessage = languageProvider.currentLanguage == 'vi'
                  ? 'Không thể lưu hình ảnh: $saveError'
                  : 'Could not save image: $saveError';
            });
          }
        } else {
          setState(() {
            _showError = true;
            _errorMessage = languageProvider.currentLanguage == 'vi'
                ? 'Không thể tạo hình ảnh từ mã QR.'
                : 'Could not create image from QR code.';
          });
        }
      } else {
        // Show a more helpful error message with instructions
        setState(() {
          _showError = true;
          _errorMessage = languageProvider.currentLanguage == 'vi'
              ? 'Ứng dụng cần quyền truy cập vào thư viện ảnh để lưu mã QR. Vui lòng vào Cài đặt > Quyền để cấp quyền.'
              : 'App needs permission to access photo library to save QR code. Please go to Settings > Permissions to grant access.';
        });
      }
    } catch (e) {
      print('Error saving QR code: $e');
      setState(() {
        _showError = true;
        _errorMessage = languageProvider.currentLanguage == 'vi'
            ? 'Đã xảy ra lỗi khi lưu mã QR: $e'
            : 'Error occurred while saving QR code: $e';
      });
    } finally {
      setState(() {
        _isDownloading = false;
      });
    }
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final languageProvider = Provider.of<LanguageProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          languageProvider.currentLanguage == 'vi' ? 'Thanh Toán' : 'Payment',
          style: const TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF5A9C7F),
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
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
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Title removed as requested
                const SizedBox(height: 10),

                // QR Code Card
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      // QR Code with RepaintBoundary for screenshot
                      RepaintBoundary(
                        key: _qrKey,
                        child: Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.grey.withOpacity(0.2),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Column(
                            children: [
                              const Text(
                                'VNPAY',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF16316F),
                                ),
                              ),
                              const SizedBox(height: 12),
                              SizedBox(
                                width: 250,
                                height: 250,
                                child: Stack(
                                  children: [
                                    Container(
                                      width: 250,
                                      height: 250,
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(8),
                                        border: Border.all(
                                            color: const Color(0xFF5A9C7F)
                                                .withOpacity(0.3),
                                            width: 2),
                                      ),
                                      child: Padding(
                                        padding: const EdgeInsets.all(4.0),
                                        // child: QrCodeWidget(
                                        //   // qrCodeData: 'assets/qr_code.png',
                                        //   accountNumber: '1051 000 121 666',
                                        //   version: '3.0',
                                        //   contactEmail:
                                        //       'vinsport.contact@gmail.com',
                                        // ),
                                      ),
                                    ),
                                    Positioned(
                                      top: 8,
                                      right: 8,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(
                                            vertical: 4, horizontal: 6),
                                        decoration: BoxDecoration(
                                          color: Colors.white.withOpacity(0.9),
                                          borderRadius:
                                              BorderRadius.circular(12),
                                          border: Border.all(
                                              color: _secondsRemaining <= 30
                                                  ? const Color(0xFFFF0004)
                                                  : Colors.grey[300]!),
                                        ),
                                        child: IntrinsicWidth(
                                          // Fix overflow nếu text quá dài
                                          child: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              GestureDetector(
                                                onTap: _completePayment,
                                                child: Container(
                                                  padding:
                                                      const EdgeInsets.all(4),
                                                  margin: const EdgeInsets.only(
                                                      right: 6),
                                                  decoration: BoxDecoration(
                                                    color:
                                                        const Color(0xFF34C38F),
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            8),
                                                  ),
                                                  child: const Icon(
                                                    Icons.check,
                                                    color: Colors.white,
                                                    size: 16,
                                                  ),
                                                ),
                                              ),
                                              Icon(
                                                _secondsRemaining <= 30
                                                    ? Icons.timer
                                                    : Icons.timer_outlined,
                                                color: _secondsRemaining <= 30
                                                    ? const Color(0xFFFF0004)
                                                    : Colors.grey[700],
                                                size: 14,
                                              ),
                                              const SizedBox(width: 4),
                                              Text(
                                                _formatTime(_secondsRemaining),
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  fontWeight: FontWeight.bold,
                                                  color: _secondsRemaining <= 30
                                                      ? const Color(0xFFFF0004)
                                                      : Colors.grey[700],
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              )
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),

                      const SizedBox(height: 20),

                      // Download Button
                      Container(
                        width: double.infinity,
                        margin: const EdgeInsets.symmetric(horizontal: 16),
                        child: ElevatedButton.icon(
                          onPressed:
                              _isDownloading ? null : _saveQrCodeToGallery,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF34C38F),
                            foregroundColor: const Color(0xFFF0FDFD),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 24, vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                            elevation: 4,
                            shadowColor:
                                const Color(0xFF5A9C7F).withOpacity(0.4),
                          ),
                          icon: _isDownloading
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2,
                                  ),
                                )
                              : const Icon(Icons.download_rounded, size: 28),
                          label: Text(
                            languageProvider.currentLanguage == 'vi'
                                ? 'Tải mã QR để thanh toán'
                                : 'Download QR code for payment',
                            style: const TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                      if (_showError) ...[
                        const SizedBox(height: 12),
                        Text(
                          _errorMessage,
                          style: const TextStyle(
                            color: Color(0xFFFF0004),
                            fontSize: 14,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // Payment instructions
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.9),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                        color: const Color(0xFF5A9C7F).withOpacity(0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        languageProvider.currentLanguage == 'vi'
                            ? 'Hướng dẫn thanh toán:'
                            : 'Payment instructions:',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF16316F),
                        ),
                      ),
                      const SizedBox(height: 8),
                      _buildInstructionStep(
                        '1',
                        languageProvider.currentLanguage == 'vi'
                            ? 'Mở ứng dụng ngân hàng hoặc VNPAY trên điện thoại'
                            : 'Open your banking app or VNPAY on your phone',
                      ),
                      _buildInstructionStep(
                        '2',
                        languageProvider.currentLanguage == 'vi'
                            ? 'Chọn chức năng quét mã QR'
                            : 'Select QR code scanning function',
                      ),
                      _buildInstructionStep(
                        '3',
                        languageProvider.currentLanguage == 'vi'
                            ? 'Quét mã QR hiển thị ở trên'
                            : 'Scan the QR code shown above',
                      ),
                      _buildInstructionStep(
                        '4',
                        languageProvider.currentLanguage == 'vi'
                            ? 'Xác nhận thông tin và hoàn tất thanh toán'
                            : 'Confirm details and complete payment',
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInstructionStep(String number, String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 24,
            height: 24,
            decoration: BoxDecoration(
              color: const Color(0xFF5A9C7F),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                number,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[800],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
