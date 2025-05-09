import 'package:flutter/material.dart';
import '../utils/constants.dart';
import '../widgets/common/language_toggle.dart';
import '../providers/language_provider.dart';
import 'package:provider/provider.dart';

class AuthBackground extends StatelessWidget {
  final Widget child;
  final bool showLogo;
  final bool showLanguageToggle;

  const AuthBackground({
    Key? key,
    required this.child,
    this.showLogo = true,
    this.showLanguageToggle = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: AppGradients.backgroundGradient,
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: Column(
              children: [
                const SizedBox(height: 20),
                // Language toggle in top right
                if (showLanguageToggle) ...[
                  Align(
                    alignment: Alignment.centerRight,
                    child: Consumer<LanguageProvider>(
                      builder: (_, __, ___) => const LanguageToggle(),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
                if (showLogo) ...[
                  // Logo with standard size as required
                  Image.asset(
                    'assets/logo.png',
                    width: AppConstants.logoWidth,
                    height: AppConstants.logoHeight,
                    fit: BoxFit.contain,
                  ),
                  const SizedBox(height: 20),
                ],
                child,
              ],
            ),
          ),
        ),
      ),
    );
  }
}