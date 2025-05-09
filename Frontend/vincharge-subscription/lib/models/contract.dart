class Contract {
  final String contractId;
  final double initialLimit;
  final double currentBalance;
  final double monthlyIncome;
  final bool isActive;

  Contract({
    required this.contractId,
    required this.initialLimit,
    required this.currentBalance,
    required this.monthlyIncome,
    required this.isActive,
  });

  factory Contract.fromJson(Map<String, dynamic> json) {
    return Contract(
      contractId: json['contractId'],
      initialLimit: json['initialLimit'].toDouble(),
      currentBalance: json['currentBalance'].toDouble(),
      monthlyIncome: json['monthlyIncome'].toDouble(),
      isActive: json['currentBalance'] > 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'contractId': contractId,
      'initialLimit': initialLimit,
      'currentBalance': currentBalance,
      'monthlyIncome': monthlyIncome,
      'isActive': isActive,
    };
  }
}
