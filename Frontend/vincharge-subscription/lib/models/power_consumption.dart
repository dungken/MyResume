class PowerConsumption {
  final double vinfastConsumption;
  final double evnConsumption;
  final String? verificationImagePath;
  final DateTime reportDate;
  final double calculatedConsumption;

  PowerConsumption({
    required this.vinfastConsumption,
    required this.evnConsumption,
    this.verificationImagePath,
    required this.reportDate,
  }) : calculatedConsumption = vinfastConsumption - evnConsumption;

  factory PowerConsumption.fromJson(Map<String, dynamic> json) {
    return PowerConsumption(
      vinfastConsumption: json['vinfastConsumption'].toDouble(),
      evnConsumption: json['evnConsumption'].toDouble(),
      verificationImagePath: json['verificationImagePath'],
      reportDate: DateTime.parse(json['reportDate']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'vinfastConsumption': vinfastConsumption,
      'evnConsumption': evnConsumption,
      'verificationImagePath': verificationImagePath,
      'reportDate': reportDate.toIso8601String(),
      'calculatedConsumption': calculatedConsumption,
    };
  }
}
