import 'package:flutter/material.dart';

class QrCodeWidget extends StatelessWidget {
  final String qrCodeData;
  final String? accountNumber;
  final String? version;
  final String? contactEmail;

  const QrCodeWidget({
    Key? key,
    required this.qrCodeData,
    this.accountNumber,
    this.version,
    this.contactEmail,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 200,
            height: 200,
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: Colors.grey[300]!),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Center(
              child: qrCodeData.contains('assets/')
                  ? Image.asset(
                      qrCodeData,
                      width: 180,
                      height: 180,
                      fit: BoxFit.contain,
                    )
                  : Icon(
                      Icons.qr_code,
                      size: 180,
                      color: Colors.black87,
                    ),
            ),
          ),
          const SizedBox(height: 16),
          if (accountNumber != null) ...[
            Text(
              'STK: $accountNumber',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 4),
          ],
          if (version != null) ...[
            Text(
              'Version: $version',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 4),
          ],
          if (contactEmail != null) ...[
            Text(
              contactEmail!,
              style: TextStyle(
                fontSize: 14,
                color: Colors.blue[700],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
