import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../utils/constants.dart';
import '../../providers/auth_provider.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, {this.statusCode});

  @override
  String toString() => message;
}

class ApiClient {
  final String baseUrl;
  final AuthProvider? authProvider;

  ApiClient({
    required this.baseUrl,
    this.authProvider,
  });

  // Helper method to get authentication token
  Map<String, String> _getHeaders() {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (authProvider != null && authProvider!.token != null) {
      headers['Authorization'] = 'Bearer ${authProvider!.token}';
    }

    return headers;
  }

  // GET request
  Future<dynamic> get(String endpoint) async {
    final url = Uri.parse('$baseUrl$endpoint');
    try {
      final response = await http.get(
        url,
        headers: _getHeaders(),
      );
      return _processResponse(response);
    } catch (e) {
      throw ApiException('Network error: ${e.toString()}');
    }
  }

  // POST request
  Future<dynamic> post(String endpoint, dynamic data) async {
    final url = Uri.parse('$baseUrl$endpoint');
    print('Making POST request to: $url');
    print('Request data: $data');
    try {
      final headers = _getHeaders();
      print('Request headers: $headers');
      final response = await http.post(
        url,
        headers: headers,
        body: json.encode(data),
      );
      print('Response status code: ${response.statusCode}');
      print('Response body: ${response.body}');
      return _processResponse(response);
    } catch (e) {
      print('API Error: $e');
      if (e is ApiException) throw e;
      throw ApiException('Network error: ${e.toString()}');
    }
  }

  // PUT request
  Future<dynamic> put(String endpoint, dynamic data) async {
    final url = Uri.parse('$baseUrl$endpoint');
    try {
      final response = await http.put(
        url,
        headers: _getHeaders(),
        body: json.encode(data),
      );
      return _processResponse(response);
    } catch (e) {
      throw ApiException('Network error: ${e.toString()}');
    }
  }

  // DELETE request
  Future<dynamic> delete(String endpoint) async {
    final url = Uri.parse('$baseUrl$endpoint');
    try {
      final response = await http.delete(
        url,
        headers: _getHeaders(),
      );
      return _processResponse(response);
    } catch (e) {
      throw ApiException('Network error: ${e.toString()}');
    }
  }

  // Process response and handle errors
  dynamic _processResponse(http.Response response) {
    try {
      final responseData = response.body.isNotEmpty ? json.decode(response.body) : null;
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        // Success response
        return responseData;
      } else {
        // Error response
        String errorMessage = 'Request failed with status: ${response.statusCode}';
        
        if (responseData != null && responseData is Map) {
          // Try to extract message from the API response
          if (responseData.containsKey('message')) {
            errorMessage = responseData['message'];
          } else if (responseData.containsKey('error')) {
            errorMessage = responseData['error'];
          }
        }
        
        throw ApiException(errorMessage, statusCode: response.statusCode);
      }
    } catch (e) {
      if (e is ApiException) throw e;
      throw ApiException('Failed to process response: ${e.toString()}');
    }
  }
}