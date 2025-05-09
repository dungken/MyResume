import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/language_provider.dart';

class LanguageToggleButton extends StatelessWidget {
  final Color? borderColor;
  final Color? textColor;
  final Color? iconColor;
  final EdgeInsetsGeometry? margin;

  const LanguageToggleButton({
    Key? key,
    this.borderColor = Colors.black,
    this.textColor = Colors.black,
    this.iconColor = Colors.black,
    this.margin = const EdgeInsets.only(top: 10),
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final languageProvider = Provider.of<LanguageProvider>(context);
    final currentLanguage = languageProvider.currentLanguage;
    final currentFlag = languageProvider.currentLanguageFlag;

    return GestureDetector(
      onTap: () {
        Provider.of<LanguageProvider>(context, listen: false).toggleLanguage();
      },
      child: Container(
        margin: margin,
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          border: Border.all(color: borderColor ?? Colors.black),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Try to load the flag image first
            Image.asset(
              currentFlag,
              width: 16,
              height: 16,
              color: iconColor,
              errorBuilder: (context, error, stackTrace) {
                // If flag image fails, use language icon
                return Image.asset(
                  'assets/language_icon.png',
                  width: 16,
                  height: 16,
                  color: iconColor,
                  errorBuilder: (context, error, stackTrace) {
                    // If both fail, use default language icon
                    return Icon(
                      Icons.language,
                      color: iconColor,
                      size: 16,
                    );
                  },
                );
              },
            ),
            const SizedBox(width: 4),
            Text(
              currentLanguage == 'vi' ? 'VI' : 'EN',
              style: TextStyle(
                color: textColor,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
