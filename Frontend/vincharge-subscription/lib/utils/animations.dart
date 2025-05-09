import 'package:flutter/material.dart';

class TabAnimations {
  static Duration get selectionDuration => const Duration(milliseconds: 250);
  static Duration get contentSwitchDuration =>
      const Duration(milliseconds: 400);
  static Curve get selectionCurve => Curves.easeOutCubic;
  static Curve get contentInCurve => Curves.easeOutQuint;
  static Curve get contentOutCurve => Curves.easeInQuint;
  static Curve get fadeInCurve => const Interval(0.0, 0.8);
}

class PageTransitions {
  static Route<T> fadeThrough<T>(Widget page) {
    return PageRouteBuilder<T>(
      pageBuilder: (context, animation, secondaryAnimation) => page,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return FadeTransition(
          opacity: CurvedAnimation(
            parent: animation,
            curve: Curves.easeOut,
          ),
          child: child,
        );
      },
    );
  }
}
