import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/language_provider.dart';

class LanguageToggle extends StatelessWidget {
  final Color textColor;
  final Color borderColor;
  final Color iconColor;
  
  const LanguageToggle({
    Key? key,
    this.textColor = Colors.black,
    this.borderColor = Colors.black,
    this.iconColor = Colors.black,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final languageProvider = Provider.of<LanguageProvider>(context);
    
    return GestureDetector(
      onTap: () {
        languageProvider.toggleLanguage();
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(30),
          border: Border.all(color: borderColor, width: 1),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Language icon
            Image.asset(
              'assets/language_icon.png',
              width: 24,
              height: 24,
              color: iconColor,
              errorBuilder: (context, error, stackTrace) {
                // Fallback to icon if image is not found
                return Icon(
                  Icons.language,
                  color: iconColor,
                  size: 20,
                );
              },
            ),
            const SizedBox(width: 8),
            Text(
              languageProvider.currentLanguage == 'vi' ? 'VI' : 'EN',
              style: TextStyle(
                color: textColor,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}