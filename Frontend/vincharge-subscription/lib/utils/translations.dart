class Translations {
  static const Map<String, Map<String, String>> _translations = {
    'vi': {
      'login': 'Đăng nhập',
      'register': 'Đăng ký',
      'username': 'Tài Khoản',
      'password': 'Mật Khẩu',
      'confirmPassword': 'Xác nhận mật khẩu',
      'email': 'Email',
      'saveLogin': 'Lưu đăng nhập',
      'forgotPassword': 'Quên mật khẩu?',
      'welcome': 'Chào mừng đến với MIHACO, %s!',
      'logout': 'Đăng xuất',
      'usernamePlaceholder': 'Nhập tài khoản đăng nhập',
      'passwordPlaceholder': 'Nhập mật khẩu',
      'confirmPasswordPlaceholder': 'Nhập lại mật khẩu',
      'emailPlaceholder': 'example@email.com',
      'newPassword': 'Mật khẩu mới',

      // Validation
      'usernameRequired': 'Vui lòng nhập tài khoản đăng nhập',
      'usernameNoSpaces': 'Tên người dùng không được chứa khoảng trắng',
      'usernameNeedsNumbers': 'Tên người dùng phải chứa ít nhất 1 số',
      'usernameNeedsLetters': 'Tên người dùng phải chứa ít nhất 1 chữ cái',
      'usernameNoSpecialChars': 'Tên người dùng không được chứa ký tự đặc biệt',
      'usernameMaxLength': 'Tên người dùng không được vượt quá 20 ký tự',
      'passwordRequired': 'Vui lòng nhập mật khẩu',
      'passwordShort': 'Mật khẩu phải có ít nhất 6 ký tự',
      'passwordSpecialChars':
          'Mật khẩu phải chứa ít nhất 3 ký tự đặc biệt (@!#*&)',
      'passwordNeedsNumber': 'Mật khẩu phải chứa ít nhất 1 số',
      'passwordNeedsLetter': 'Mật khẩu phải chứa ít nhất 1 chữ cái',
      'passwordUppercase': 'Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa',
      'confirmPasswordRequired': 'Vui lòng xác nhận mật khẩu',
      'passwordNotMatch': 'Mật khẩu không khớp',
      'emailRequired': 'Vui lòng nhập email',
      'emailInvalid': 'Email không hợp lệ',
      'emailNotFound': 'Không tìm thấy email này trong hệ thống',
      'phoneNumber': 'Số điện thoại',
      'phoneNumberPlaceholder': 'Nhập số điện thoại (VD: 0987654321)',
      'phoneNumberRequired': 'Vui lòng nhập số điện thoại',
      'phoneNumberInvalid':
          'Số điện thoại không hợp lệ (phải là số điện thoại Việt Nam)',
      'fullname': 'Họ và Tên',
      'fullnamePlaceholder': 'Nhập họ và tên (VD: Hà Văn Dũng)',
      'fullnameRequired': 'Vui lòng nhập họ và tên',
      'otpRequired': 'Vui lòng nhập mã OTP',
      'otpInvalid': 'Mã OTP không hợp lệ',
      'otpMustBeDigits': 'Mã OTP phải là 6 chữ số',
      'otpIncomplete': 'Vui lòng nhập đủ 6 chữ số',

      // OTP related
      'sendOtp': 'Gửi mã OTP',
      'otpSent': 'Mã OTP đã được gửi tới',
      'otpSuccess': 'Xác thực OTP thành công!',
      'verifyOtp': 'Xác thực OTP',
      'resendOtp': 'Gửi lại mã OTP',
      'otpResent': 'Đã gửi lại mã OTP',
      'failedToResendOtp': 'Không thể gửi lại mã OTP',

      // Password reset
      'forgotPasswordGuide': 'Nhập email để nhận mã OTP đặt lại mật khẩu',
      'resetPassword': 'Đặt lại mật khẩu',
      'resetPasswordGuide': 'Nhập mật khẩu mới cho tài khoản của bạn',
      'resetPasswordSuccess':
          'Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.',
      'resetPasswordFailed': 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.',

      // Contract screen
      'contractId': 'Mã hợp đồng',
      'initialLimit': 'Hạn mức đầu tư',
      'monthlyIncome': 'Thu nhập 1 tháng',
      'currentBalance': 'Số dư',
      'activeContract': 'Đang hoạt động',
      'inactiveContract': 'Kết thúc',
      'powerConsumption': 'Tiêu thụ điện',
      'vinfastConsumption': 'Số kW điện tháng này và chỉ số tính toán',
      'evnConsumption': 'Số kW điện tháng trước',
      'uploadImage': 'Chọn ảnh từ máy hoặc chụp hình',
      'submit': 'Gửi',
      'calculatedPower': 'Số kW điện tháng này',
      'kwh': 'kWh',
      'invalidInput': 'Giá trị nhập không hợp lệ',

      // Home screen
      'contractInfo': 'Thông tin hợp đồng',
      'customerCode': 'Mã khách hàng',
      'investmentLimit': 'Hạn mức đầu tư',
      'balance': 'Số dư',
      'previousPeriod': 'Kỳ trước',
      'currentPeriod': 'Kỳ này',
      'totalConsumption': 'Tổng tiêu thụ',
      'verificationImage': 'Ảnh minh chứng',
      'upload': 'Tải lên',
      'payment': 'Thanh toán',
      'scanQrPayment': 'Quét mã QR để thanh toán',
      'submitSuccessful': 'Đã gửi báo cáo tiêu thụ điện thành công',
      'fillAllFields': 'Vui lòng nhập đầy đủ chỉ số điện',
      'previousMonthConsumption': 'Số kí điện tháng trước',
      'currentMonthConsumption': 'Số kí điện tháng này',
      'fromVinfast': 'TỪ TRẠM SẠC VINFAST',
      'safePayment': 'Thanh toán an toàn & bảo mật',
      'inputConsumptionGuide':
          'Vui lòng nhập vào số kí điện tháng này và chụp hình xác nhận',
      'inputNumberValidation': 'Vui lòng nhập số hợp lệ',
      'numberShouldBePositive': 'Số phải lớn hơn hoặc bằng 0',
    },
    'en': {
      'login': 'Login',
      'register': 'Register',
      'username': 'Username',
      'password': 'Password',
      'confirmPassword': 'Confirm Password',
      'email': 'Email',
      'saveLogin': 'Save Login',
      'forgotPassword': 'Forgot Password?',
      'welcome': 'Welcome to MIHACO, %s!',
      'logout': 'Logout',
      'usernamePlaceholder': 'Enter username',
      'passwordPlaceholder': 'Enter password',
      'confirmPasswordPlaceholder': 'Re-enter password',
      'emailPlaceholder': 'example@email.com',
      'newPassword': 'New Password',

      // Validation
      'usernameRequired': 'Please enter your username',
      'usernameNoSpaces': 'Username cannot contain spaces',
      'usernameNeedsNumbers': 'Username must contain at least 1 number',
      'usernameNeedsLetters': 'Username must contain at least 1 letter',
      'usernameNoSpecialChars': 'Username cannot contain special characters',
      'usernameMaxLength': 'Username cannot exceed 20 characters',
      'passwordRequired': 'Please enter your password',
      'passwordShort': 'Password must be at least 6 characters',
      'passwordSpecialChars':
          'Password must contain at least 3 special characters (@!#*&)',
      'passwordNeedsNumber': 'Password must contain at least 1 number',
      'passwordNeedsLetter': 'Password must contain at least 1 letter',
      'passwordUppercase': 'Password must contain at least 1 uppercase letter',
      'confirmPasswordRequired': 'Please confirm your password',
      'passwordNotMatch': 'Passwords do not match',
      'emailRequired': 'Please enter your email',
      'emailInvalid': 'Invalid email address',
      'emailNotFound': 'This email was not found in the system',
      'phoneNumber': 'Phone Number',
      'phoneNumberPlaceholder': 'Enter phone number (Ex: 0987654321)',
      'phoneNumberRequired': 'Please enter your phone number',
      'phoneNumberInvalid':
          'Invalid phone number (must be a Vietnam phone number)',
      'fullname': 'Full Name',
      'fullnamePlaceholder': 'Enter your full name (Ex: Ha Van Dung)',
      'fullnameRequired': 'Please enter your full name',
      'otpRequired': 'Please enter the OTP code',
      'otpInvalid': 'Invalid OTP code',
      'otpMustBeDigits': 'OTP must be 6 digits',
      'otpIncomplete': 'Please enter all 6 digits',

      // OTP related
      'sendOtp': 'Send OTP',
      'otpSent': 'OTP has been sent to',
      'otpSuccess': 'OTP verified successfully!',
      'verifyOtp': 'Verify OTP',
      'resendOtp': 'Resend OTP',
      'otpResent': 'OTP has been resent',
      'failedToResendOtp': 'Failed to resend OTP',

      // Password reset
      'forgotPasswordGuide':
          'Enter your email to receive OTP for password reset',
      'resetPassword': 'Reset Password',
      'resetPasswordGuide': 'Enter a new password for your account',
      'resetPasswordSuccess':
          'Password reset successfully! Please login again.',
      'resetPasswordFailed': 'Password reset failed. Please try again.',

      // Contract screen
      'contractId': 'Contract ID',
      'initialLimit': 'Initial Limit',
      'monthlyIncome': 'Monthly Income',
      'currentBalance': 'Current Balance',
      'activeContract': 'Active',
      'inactiveContract': 'Inactive',
      'powerConsumption': 'Power Consumption',
      'vinfastConsumption': 'Current Month kW and Calculated Value',
      'evnConsumption': 'Previous Month kW',
      'uploadImage': 'Select image from device or take photo',
      'submit': 'Submit',
      'calculatedPower': 'Current Month kW',
      'kwh': 'kWh',
      'invalidInput': 'Invalid input value',

      // Home screen
      'contractInfo': 'Contract Information',
      'customerCode': 'Customer Code',
      'investmentLimit': 'Investment Limit',
      'balance': 'Balance',
      'previousPeriod': 'Previous Period',
      'currentPeriod': 'Current Period',
      'totalConsumption': 'Total Consumption',
      'verificationImage': 'Verification Image',
      'upload': 'Upload',
      'payment': 'Payment',
      'scanQrPayment': 'Scan QR code to pay',
      'submitSuccessful': 'Power consumption report submitted successfully',
      'fillAllFields': 'Please fill in all electricity readings',
      'previousMonthConsumption': 'Last reading',
      'currentMonthConsumption': 'Current reading',
      'fromVinfast': 'FROM VINFAST',
      'safePayment': 'Safe & secure payment',
      'inputConsumptionGuide':
          'Please enter this month\'s electricity reading and upload verification photo',
      'inputNumberValidation': 'Please enter a valid number',
      'numberShouldBePositive': 'Number must be greater than or equal to 0',
    },
  };

  static String get(String key, String language, [List<String>? args]) {
    final translation = _translations[language]?[key] ??
        _translations['en']?[key] ??
        'Translation not found for [$key]';

    if (args != null && args.isNotEmpty) {
      return translation.replaceAll('%s', args[0]);
    }
    return translation;
  }
}
