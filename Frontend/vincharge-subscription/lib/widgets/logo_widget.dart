import 'package:flutter/material.dart';
import '../utils/constants.dart';

class LogoWidget extends StatelessWidget {
  final double size;

  const LogoWidget({
    Key? key,
    this.size = 120,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Center(
        child: ClipOval(
          child: Image.asset(
            'assets/vinfast_logo.png',
            width: size * 0.8,
            height: size * 0.8,
          ),
        ),
      ),
    );
  }
}
