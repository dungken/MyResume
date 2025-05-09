import 'package:flutter/material.dart';
import '../utils/constants.dart';

class ConsumptionInputWidget extends StatelessWidget {
  final String label;
  final String previousValue;
  final TextEditingController? controller;
  final bool readOnly;

  const ConsumptionInputWidget({
    Key? key,
    required this.label,
    required this.previousValue,
    this.controller,
    this.readOnly = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(6),
      ),
      child: readOnly
          ? Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    label,
                    style: TextStyle(fontSize: 12),
                  ),
                  SizedBox(height: 4),
                  Text(
                    previousValue,
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            )
          : TextField(
              controller: controller,
              keyboardType: TextInputType.number,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
              decoration: InputDecoration(
                contentPadding: EdgeInsets.all(16),
                isDense: true,
                border: InputBorder.none,
                hintText: '0',
                labelText: label,
                labelStyle: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.normal,
                ),
                suffixText: 'kWh',
              ),
            ),
    );
  }
}
