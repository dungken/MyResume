import 'package:flutter/material.dart';
import '../utils/constants.dart';

class GradientBackground extends StatelessWidget {
  final Widget child;

  const GradientBackground({
    Key? key,
    required this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            // AppColors.primaryGreen,
            // AppColors.primaryGreen.withOpacity(0.8),
            // AppColors.primaryGreen.withOpacity(0.6),
          ],
        ),
      ),
      child: child,
    );
  }
}
