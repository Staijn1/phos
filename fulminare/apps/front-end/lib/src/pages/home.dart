import 'package:Fulminare/src/widgets/liquid-pages.dart';
import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Colors.redAccent,
      body: Center(child: Text("Homepage", style: textStyle)),
    );
  }
}
