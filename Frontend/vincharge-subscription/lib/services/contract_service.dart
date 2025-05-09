import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/contract.dart';
import '../models/power_consumption.dart';

class ContractService {
  static const String baseUrl =
      'http://localhost:8080/api'; // Replace with actual API URL
  static const double unitPrice = 3000; // VND per kWh

  // Mock data for development
  static Future<Contract> getMockContract() async {
    return Contract(
      contractId: 'NLMT-01',
      initialLimit: 100000000,
      currentBalance: 100000000,
      monthlyIncome: 100000000,
      isActive: true,
    );
  }

  Future<Contract> getContractDetails(String userId) async {
    // For development, use mock data
    // In production, uncomment the API call below
    return getMockContract();

    /*
    final response = await http.get(
      Uri.parse('$baseUrl/contracts/$userId'),
      headers: {'Content-Type': 'application/json'},
    );
    
    if (response.statusCode == 200) {
      return Contract.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load contract');
    }
    */
  }

  Future<double> calculateRevenue(double accumulatedKwh) {
    return Future.value(accumulatedKwh * unitPrice);
  }

  Future<void> updateContract(String contractId, double revenue) async {
    // Mock update for now
    // In production, implement the API call to update contract balance
    print('Contract $contractId updated with revenue: $revenue');
  }

  Future<void> submitPowerConsumption(
      String userId, PowerConsumption consumption) async {
    // Calculate accumulated kWh
    final double accumulatedKwh = consumption.calculatedConsumption;
    
    // Calculate revenue
    final double revenue = await calculateRevenue(accumulatedKwh);
    
    // Update contract balance
    await updateContract('NLMT-01', revenue);
    
    // In production, implement the API call
    print('Power consumption submitted: ${consumption.toJson()}');
    print('Calculated revenue: $revenue VND');

    /*
    final response = await http.post(
      Uri.parse('$baseUrl/consumption/$userId'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(consumption.toJson()),
    );
    
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to submit power consumption');
    }
    */
  }
}
