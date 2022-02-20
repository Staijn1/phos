import 'package:Fulminare/src/widgets/liquid-pages.dart';
import 'package:flutter/material.dart';

class ModePage extends StatelessWidget {
  const ModePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.blueAccent,
      body: Center(child: Text("Mode page", style: textStyle)),
    );
  }
}
