import 'package:flutter/material.dart';

// Extension on Form widget to handle validation errors display
extension FormExtensions on FormFieldState {
  String? get errorText => errorText;
}

class FormErrorWidget extends StatelessWidget {
  final Widget child;
  final FormFieldValidator<String> validator;
  final String value;
  final Widget Function(String errorText) errorBuilder;

  const FormErrorWidget({
    Key? key,
    required this.child,
    required this.validator,
    required this.value,
    required this.errorBuilder,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FormField<String>(
      initialValue: value,
      validator: (val) => validator(value),
      builder: (FormFieldState<String> state) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            child,
            if (state.hasError)
              errorBuilder(state.errorText ?? 'Error')
          ],
        );
      },
    );
  }
}