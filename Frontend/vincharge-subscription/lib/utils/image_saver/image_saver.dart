import 'dart:io';
import 'dart:typed_data';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';

/// A simplified image saving utility that doesn't rely on the image_gallery_saver plugin
class CustomImageSaver {
  /// Saves an image to the temporary directory and returns the path
  /// This is a workaround for the image_gallery_saver plugin build issues
  static Future<String> saveImage(Uint8List bytes, {int quality = 100, String? name}) async {
    try {
      // Request permissions based on platform
      bool permissionGranted = false;
      
      if (Platform.isAndroid) {
        // For Android 13+ (SDK 33+), we need to request specific permissions
        var status = await Permission.photos.status;
        if (status.isDenied) {
          // If permission is denied, request it
          status = await Permission.photos.request();
        }
        permissionGranted = status.isGranted;
      } else if (Platform.isIOS) {
        // For iOS
        var status = await Permission.photos.status;
        if (status.isDenied) {
          status = await Permission.photos.request();
        }
        permissionGranted = status.isGranted;
      }
      
      if (!permissionGranted) {
        throw Exception('Permission denied to save image. Please grant permission in Settings.');
      }
      
      // Generate a filename if not provided
      final String fileName = name ?? 'image_${DateTime.now().millisecondsSinceEpoch}.png';
      
      // Get the temporary directory path - in a real app, you'd want to save to a more permanent location
      final Directory tempDir = await getTemporaryDirectory();
      final String filePath = '${tempDir.path}/$fileName';
      
      // Write the file
      final File file = File(filePath);
      await file.writeAsBytes(bytes);
      
      return filePath;
    } catch (e) {
      throw Exception('Failed to save image: $e');
    }
  }
}