import 'package:flutter/material.dart';
import '../utils/constants.dart';

class CustomTextField extends StatelessWidget {
  final String label;
  final TextEditingController controller;
  final bool isPassword;
  final bool obscureText;
  final VoidCallback? onTogglePasswordVisibility;
  final String? errorText;
  final TextInputType keyboardType;
  final IconData? prefixIcon;
  final Function(String)? onChanged;
  final bool compact;
  final String? placeholder;

  const CustomTextField({
    Key? key,
    required this.label,
    required this.controller,
    this.isPassword = false,
    this.obscureText = false,
    this.onTogglePasswordVisibility,
    this.errorText,
    this.keyboardType = TextInputType.text,
    this.prefixIcon,
    this.onChanged,
    this.compact = false,
    this.placeholder,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (!compact) ...[
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              // color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 8),
        ],
        TextField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          onChanged: onChanged,
          style: TextStyle(fontSize: compact ? 15 : 16),
          decoration: InputDecoration(
            hintText: placeholder,
            labelText: compact ? label : null,
            labelStyle: TextStyle(
              // color: AppColors.textGrey,
              fontSize: 14,
            ),
            contentPadding: EdgeInsets.symmetric(
              vertical: compact ? 12 : 16,
              horizontal: 16,
            ),
            filled: true,
            fillColor: errorText != null ? Colors.red.shade50 : Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(
                color: errorText != null ? Colors.red : Colors.grey.shade300,
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(
                color: errorText != null ? Colors.red : Colors.grey.shade300,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(
                // color: errorText != null ? Colors.red : AppColors.primaryGreen,
                width: 1.5,
              ),
            ),
            prefixIcon: prefixIcon != null ? Icon(prefixIcon) : null,
            suffixIcon: isPassword
                ? IconButton(
                    icon: Icon(
                      obscureText ? Icons.visibility_off : Icons.visibility,
                      color: Colors.grey,
                    ),
                    onPressed: onTogglePasswordVisibility,
                  )
                : null,
          ),
        ),
        if (errorText != null) ...[
          SizedBox(height: 6),
          Text(
            errorText!,
            style: TextStyle(
              color: Colors.red,
              fontSize: 12,
            ),
          ),
        ],
        SizedBox(height: compact ? 12 : 16),
      ],
    );
  }
}
