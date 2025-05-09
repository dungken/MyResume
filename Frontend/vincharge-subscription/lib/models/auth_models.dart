// Auth models for handling authentication data
import 'dart:convert';

class RegisterRequest {
  final String username;
  final String password;
  final String full_name;
  final String phone;
  final String email;

  RegisterRequest({
    required this.username,
    required this.password,
    required String fullname,
    required this.phone,
    required this.email,
  }) : full_name = fullname;

  Map<String, dynamic> toJson() => {
        'username': username,
        'password': password,
        'full_name': full_name,
        'phone': phone,
        'email': email,
      };
}

class LoginRequest {
  final String username;
  final String password;
  final bool saveLogin;

  LoginRequest({
    required this.username,
    required this.password,
    this.saveLogin = false,
  });

  Map<String, dynamic> toJson() => {
        'username': username,
        'password': password,
      };
}

class AuthResponse {
  final String? token;
  final User user;
  final String message;
  final String status;

  AuthResponse({
    this.token,
    required this.user,
    required this.message,
    required this.status,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    final status = json['status'] as String;
    final message = json['message'] as String;
    
    if (status == 'success' && json['data'] != null) {
      final data = json['data'];
      final token = data['token'] as String?;
      return AuthResponse(
        token: token,
        user: User.fromJson(data),
        message: message,
        status: status,
      );
    } else if (status == 'error') {
      // For error responses, we'll create a minimal user object
      // This object won't be used since we'll be showing an error message
      return AuthResponse(
        token: null,
        user: User(
          userid: -1,
          username: '',
          fullname: '',
          phone: '',
          email: '',
        ),
        message: message,
        status: status,
      );
    } else {
      throw Exception(message ?? 'Failed to parse response');
    }
  }
}

// Matches the users table in the class diagram
class User {
  final int userid;
  final String username;
  final String fullname;
  final String phone;
  final String email;

  User({
    required this.userid,
    required this.username,
    required this.fullname,
    this.phone = '',  // Default empty string for registration responses
    this.email = '',  // Default empty string for registration responses
  });

  factory User.fromJson(Map<String, dynamic> json) {
    // Handle both registration and login responses
    // Registration only returns user_id, username, and full_name
    return User(
      userid: json['user_id'] is String ? int.parse(json['user_id']) : json['user_id'],
      username: json['username'] ?? '',
      fullname: json['full_name'] ?? '',
      phone: json['phone'] ?? '',
      email: json['email'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userid': userid,
      'username': username,
      'fullname': fullname,
      'phone': phone,
      'email': email,
    };
  }
  
  String toJsonString() {
    return jsonEncode(toJson());
  }
  
  static User fromJsonString(String jsonString) {
    return User.fromJson(jsonDecode(jsonString));
  }
}

// Contract model matching the contracts table in the class diagram
class Contract {
  final int contractid;
  final int userid;
  final String contractcode;
  final double limitamount;
  final bool isactive;
  final DateTime createddate;

  Contract({
    required this.contractid,
    required this.userid,
    required this.contractcode,
    required this.limitamount,
    required this.isactive,
    required this.createddate,
  });

  factory Contract.fromJson(Map<String, dynamic> json) {
    return Contract(
      contractid: json['contractid'],
      userid: json['userid'],
      contractcode: json['contractcode'],
      limitamount: json['limitamount'] ?? 0.0,
      isactive: json['isactive'] ?? false,
      createddate: json['createddate'] != null 
        ? DateTime.parse(json['createddate']) 
        : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'contractid': contractid,
      'userid': userid,
      'contractcode': contractcode,
      'limitamount': limitamount,
      'isactive': isactive,
      'createddate': createddate.toIso8601String(),
    };
  }
}

// ConsumptionRecord model matching the consumption_records table in the class diagram
class ConsumptionRecord {
  final int consumptionrecordid;
  final int contractid;
  final double incomemonth;
  final double totalincome;
  final double balance;
  final bool ispaid;
  final bool isfinalized;
  final DateTime lastupdated;
  final DateTime createddate;

  ConsumptionRecord({
    required this.consumptionrecordid,
    required this.contractid,
    required this.incomemonth,
    required this.totalincome,
    required this.balance,
    required this.ispaid,
    required this.isfinalized,
    required this.lastupdated,
    required this.createddate,
  });

  factory ConsumptionRecord.fromJson(Map<String, dynamic> json) {
    return ConsumptionRecord(
      consumptionrecordid: json['consumptionrecordid'],
      contractid: json['contractid'],
      incomemonth: json['incomemonth'] ?? 0.0,
      totalincome: json['totalincome'] ?? 0.0,
      balance: json['balance'] ?? 0.0,
      ispaid: json['ispaid'] ?? false,
      isfinalized: json['isfinalized'] ?? false,
      lastupdated: json['lastupdated'] != null 
        ? DateTime.parse(json['lastupdated']) 
        : DateTime.now(),
      createddate: json['createddate'] != null 
        ? DateTime.parse(json['createddate']) 
        : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'consumptionrecordid': consumptionrecordid,
      'contractid': contractid,
      'incomemonth': incomemonth,
      'totalincome': totalincome,
      'balance': balance,
      'ispaid': ispaid,
      'isfinalized': isfinalized,
      'lastupdated': lastupdated.toIso8601String(),
      'createddate': createddate.toIso8601String(),
    };
  }
}

// ConsumptionRecordDetail model matching the consumption_record_details table in the class diagram
class ConsumptionRecordDetail {
  final int consumptionrecorddetailid;
  final int consumptionrecordid;
  final double kwhnumber;
  final String imageurl;
  final int type; // 1-solar, 2-evn, 3-vinfast
  final DateTime createddate;

  ConsumptionRecordDetail({
    required this.consumptionrecorddetailid,
    required this.consumptionrecordid,
    required this.kwhnumber,
    required this.imageurl,
    required this.type,
    required this.createddate,
  });

  factory ConsumptionRecordDetail.fromJson(Map<String, dynamic> json) {
    return ConsumptionRecordDetail(
      consumptionrecorddetailid: json['consumptionrecorddetailid'],
      consumptionrecordid: json['consumptionrecordid'],
      kwhnumber: json['kwhnumber'] ?? 0.0,
      imageurl: json['imageurl'] ?? '',
      type: json['type'] ?? 0,
      createddate: json['createddate'] != null 
        ? DateTime.parse(json['createddate']) 
        : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'consumptionrecorddetailid': consumptionrecorddetailid,
      'consumptionrecordid': consumptionrecordid,
      'kwhnumber': kwhnumber,
      'imageurl': imageurl,
      'type': type,
      'createddate': createddate.toIso8601String(),
    };
  }
}

// Transaction model matching the transactions table in the class diagram
class Transaction {
  final int transactionid;
  final int consumptionrecordid;
  final String paymentmethod;
  final double amount;
  final String status;
  final String qrurl;
  final DateTime expiredat;
  final DateTime createddate;
  final String? vnptxnref;
  final String? vnptransactionno;
  final String? bankcode;
  final DateTime? paydate;

  Transaction({
    required this.transactionid,
    required this.consumptionrecordid,
    required this.paymentmethod,
    required this.amount,
    required this.status,
    required this.qrurl,
    required this.expiredat,
    required this.createddate,
    this.vnptxnref,
    this.vnptransactionno,
    this.bankcode,
    this.paydate,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      transactionid: json['transactionid'],
      consumptionrecordid: json['consumptionrecordid'],
      paymentmethod: json['paymentmethod'] ?? '',
      amount: json['amount'] ?? 0.0,
      status: json['status'] ?? '',
      qrurl: json['qrurl'] ?? '',
      expiredat: json['expiredat'] != null 
        ? DateTime.parse(json['expiredat']) 
        : DateTime.now(),
      createddate: json['createddate'] != null 
        ? DateTime.parse(json['createddate']) 
        : DateTime.now(),
      vnptxnref: json['vnptxnref'],
      vnptransactionno: json['vnptransactionno'],
      bankcode: json['bankcode'],
      paydate: json['paydate'] != null 
        ? DateTime.parse(json['paydate']) 
        : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'transactionid': transactionid,
      'consumptionrecordid': consumptionrecordid,
      'paymentmethod': paymentmethod,
      'amount': amount,
      'status': status,
      'qrurl': qrurl,
      'expiredat': expiredat.toIso8601String(),
      'createddate': createddate.toIso8601String(),
      'vnptxnref': vnptxnref,
      'vnptransactionno': vnptransactionno,
      'bankcode': bankcode,
      'paydate': paydate?.toIso8601String(),
    };
  }
}