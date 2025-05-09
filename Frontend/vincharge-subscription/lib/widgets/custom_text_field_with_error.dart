import 'package:flutter/material.dart';
import '../utils/theme.dart';
import '../utils/constants.dart';

class CustomTextFieldWithError extends StatefulWidget {
  final TextEditingController controller;
  final String hintText;
  final String? Function(String?)? validator;
  final bool obscureText;
  final Widget? suffixIcon;
  final TextInputType keyboardType;
  final Function(String)? onChanged;
  final String? initialError;

  const CustomTextFieldWithError({
    Key? key,
    required this.controller,
    required this.hintText,
    this.validator,
    this.obscureText = false,
    this.suffixIcon,
    this.keyboardType = TextInputType.text,
    this.onChanged,
    this.initialError,
  }) : super(key: key);

  @override
  State<CustomTextFieldWithError> createState() =>
      _CustomTextFieldWithErrorState();
}

class _CustomTextFieldWithErrorState extends State<CustomTextFieldWithError> {
  String? _errorText;
  bool _isDirty = false;
  final FocusNode _focusNode = FocusNode();
  bool _isFocused = false;

  @override
  void initState() {
    super.initState();
    _errorText = widget.initialError;

    // Add listener to validate input when text changes
    widget.controller.addListener(_validateInput);
    _focusNode.addListener(_handleFocusChange);
  }

  void _handleFocusChange() {
    setState(() {
      _isFocused = _focusNode.hasFocus;
    });
  }

  @override
  void dispose() {
    widget.controller.removeListener(_validateInput);
    _focusNode.removeListener(_handleFocusChange);
    _focusNode.dispose();
    super.dispose();
  }

  void _validateInput() {
    if (_isDirty && widget.validator != null) {
      final error = widget.validator!(widget.controller.text);
      if (error != _errorText) {
        setState(() {
          _errorText = error;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Text field with focus & error states
        TextFormField(
          controller: widget.controller,
          obscureText: widget.obscureText,
          keyboardType: widget.keyboardType,
          focusNode: _focusNode,
          cursorColor: AppConstants.primaryColor,
          cursorWidth: 2.0,
          decoration: InputDecoration(
            hintText: widget.hintText,
            hintStyle: const TextStyle(
              color: Color(0xFF2F4F4F),
              fontSize: 16,
            ),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            filled: true,
            fillColor: Colors.white,
            // Apply border radius directly to the input field
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide.none,
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide.none,
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide:
                  BorderSide(color: AppConstants.primaryColor, width: 1.5),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Color(0xFFF44336), width: 1.5),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Color(0xFFF44336), width: 1.5),
            ),
            suffixIcon: widget.suffixIcon,
            // Hide the default error style
            errorStyle:
                const TextStyle(height: 0, color: Colors.transparent),
          ),
          validator: (value) {
            // Mark as dirty on first validation
            if (!_isDirty) {
              setState(() {
                _isDirty = true;
                _errorText = widget.validator?.call(value);
              });
            }
            return _errorText; // Return error for form validation
          },
          onChanged: (value) {
            if (!_isDirty) {
              setState(() {
                _isDirty = true;
              });
            }
            _validateInput();
            widget.onChanged?.call(value);
          },
        ),

        // Error message (completely below input with animation)
        if (_errorText != null && _isDirty)
          AppErrorTextStyle.buildErrorWidget(_errorText!),
      ],
    );
  }
}